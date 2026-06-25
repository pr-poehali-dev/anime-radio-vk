const API = 'https://functions.poehali.dev/a693583a-5afd-47bd-8485-b2857ddf8e4b';

const TOKEN_KEY = 'neon_otaku_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function req(action: string, method: 'GET' | 'POST' = 'GET', body?: unknown) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['X-Auth-Token'] = token;
  const res = await fetch(`${API}?action=${action}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export interface User {
  id: number;
  vk_id: string | null;
  name: string;
  avatar: string | null;
  token: string;
}

export interface ChatMessage {
  id: number;
  user_name: string;
  avatar: string | null;
  text: string;
  stars: number;
  created_at: string;
}

export const api = {
  demoLogin: (name: string) => req('login', 'POST', { name }),
  vkLogin: (data: { code: string; redirect_uri: string }) => req('login', 'POST', data),
  vkAuthUrl: (redirect_uri: string) =>
    fetch(`${API}?action=vk_auth_url&redirect_uri=${encodeURIComponent(redirect_uri)}`).then((r) =>
      r.json()
    ),
  me: () => req('me'),
  getMessages: () => req('messages'),
  sendMessage: (text: string, stars: number) => req('message', 'POST', { text, stars }),
  getLikes: () => req('likes'),
  toggleLike: (track_title: string, track_artist: string) =>
    req('like', 'POST', { track_title, track_artist }),
};