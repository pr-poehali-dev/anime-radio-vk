import json
import os
import secrets
import urllib.request
import urllib.parse
import psycopg2
import psycopg2.extras


def _conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }


def _resp(status, body):
    return {
        'statusCode': status,
        'headers': {**_cors(), 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(body, default=str, ensure_ascii=False),
    }


def _user_by_token(cur, token):
    if not token:
        return None
    cur.execute("SELECT id, vk_id, name, avatar, token FROM users WHERE token = %s", (token,))
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """API аниме-радио: авторизация ВК, чат, лайки, профиль"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            body = {}

    conn = _conn()
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        # === Авторизация ===
        if method == 'POST' and action == 'login':
            vk_code = body.get('code')
            redirect_uri = body.get('redirect_uri', '')
            name = body.get('name')
            avatar = body.get('avatar')
            vk_id = body.get('vk_id')

            vk_app_id = os.environ.get('VK_APP_ID')
            vk_secret = os.environ.get('VK_SECRET_KEY')

            # Реальный обмен code на токен ВК
            if vk_code and vk_app_id and vk_secret:
                url = 'https://oauth.vk.com/access_token?' + urllib.parse.urlencode({
                    'client_id': vk_app_id,
                    'client_secret': vk_secret,
                    'redirect_uri': redirect_uri,
                    'code': vk_code,
                })
                with urllib.request.urlopen(url, timeout=10) as r:
                    data = json.loads(r.read().decode())
                vk_id = str(data.get('user_id'))
                access = data.get('access_token')
                api_url = 'https://api.vk.com/method/users.get?' + urllib.parse.urlencode({
                    'user_ids': vk_id,
                    'fields': 'photo_200',
                    'access_token': access,
                    'v': '5.131',
                })
                with urllib.request.urlopen(api_url, timeout=10) as r:
                    info = json.loads(r.read().decode())
                u = info['response'][0]
                name = f"{u.get('first_name', '')} {u.get('last_name', '')}".strip()
                avatar = u.get('photo_200')

            if not name:
                return _resp(400, {'error': 'name required'})

            new_token = secrets.token_hex(32)
            if vk_id:
                cur.execute("SELECT id FROM users WHERE vk_id = %s", (vk_id,))
                ex = cur.fetchone()
                if ex:
                    cur.execute(
                        "UPDATE users SET token=%s, name=%s, avatar=%s WHERE id=%s RETURNING id, vk_id, name, avatar, token",
                        (new_token, name, avatar, ex['id']))
                else:
                    cur.execute(
                        "INSERT INTO users (vk_id, name, avatar, token) VALUES (%s,%s,%s,%s) RETURNING id, vk_id, name, avatar, token",
                        (vk_id, name, avatar, new_token))
            else:
                cur.execute(
                    "INSERT INTO users (name, avatar, token) VALUES (%s,%s,%s) RETURNING id, vk_id, name, avatar, token",
                    (name, avatar, new_token))
            user = cur.fetchone()
            return _resp(200, {'user': user})

        # === Текущий пользователь + статистика ===
        if method == 'GET' and action == 'me':
            user = _user_by_token(cur, token)
            if not user:
                return _resp(200, {'user': None})
            cur.execute("SELECT COUNT(*) c FROM likes WHERE user_id=%s", (user['id'],))
            likes = cur.fetchone()['c']
            cur.execute("SELECT COUNT(*) c FROM messages WHERE user_id=%s", (user['id'],))
            msgs = cur.fetchone()['c']
            return _resp(200, {'user': user, 'stats': {'likes': likes, 'messages': msgs}})

        # === Чат: список ===
        if method == 'GET' and action == 'messages':
            cur.execute(
                "SELECT id, user_name, avatar, text, stars, created_at FROM messages ORDER BY id DESC LIMIT 50")
            rows = cur.fetchall()
            return _resp(200, {'messages': list(reversed(rows))})

        # === Чат: отправка ===
        if method == 'POST' and action == 'message':
            user = _user_by_token(cur, token)
            if not user:
                return _resp(401, {'error': 'auth required'})
            text = (body.get('text') or '').strip()[:500]
            stars = int(body.get('stars') or 0)
            if not text:
                return _resp(400, {'error': 'empty'})
            cur.execute(
                "INSERT INTO messages (user_id, user_name, avatar, text, stars) VALUES (%s,%s,%s,%s,%s) RETURNING id, user_name, avatar, text, stars, created_at",
                (user['id'], user['name'], user['avatar'], text, stars))
            return _resp(200, {'message': cur.fetchone()})

        # === Лайки: список пользователя ===
        if method == 'GET' and action == 'likes':
            user = _user_by_token(cur, token)
            if not user:
                return _resp(200, {'likes': []})
            cur.execute("SELECT track_title FROM likes WHERE user_id=%s", (user['id'],))
            return _resp(200, {'likes': [r['track_title'] for r in cur.fetchall()]})

        # === Лайк / анлайк ===
        if method == 'POST' and action == 'like':
            user = _user_by_token(cur, token)
            if not user:
                return _resp(401, {'error': 'auth required'})
            title = body.get('track_title')
            artist = body.get('track_artist', '')
            if not title:
                return _resp(400, {'error': 'track required'})
            cur.execute("SELECT id FROM likes WHERE user_id=%s AND track_title=%s", (user['id'], title))
            if cur.fetchone():
                cur.execute("DELETE FROM likes WHERE user_id=%s AND track_title=%s", (user['id'], title))
                return _resp(200, {'liked': False})
            cur.execute("INSERT INTO likes (user_id, track_title, track_artist) VALUES (%s,%s,%s)",
                        (user['id'], title, artist))
            return _resp(200, {'liked': True})

        return _resp(404, {'error': 'unknown action'})
    finally:
        cur.close()
        conn.close()
