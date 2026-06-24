import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  api,
  getToken,
  setToken,
  clearToken,
  type User,
  type ChatMessage,
} from '@/lib/api';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/3332e823-ddf7-4761-8642-52fec844968f/files/9bd27643-274f-49ef-b06b-7cca75e75258.jpg';

const STREAM_URL = 'https://pool.anison.fm/AniSonFM(320)';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'player', label: 'Плеер' },
  { id: 'chat', label: 'Чат' },
  { id: 'profile', label: 'Профиль' },
  { id: 'about', label: 'О проекте' },
  { id: 'contacts', label: 'Контакты' },
];

const TRACKS = [
  { title: 'Unravel', artist: 'TK from Ling tosite sigure', anime: 'Tokyo Ghoul', rating: 4.9 },
  { title: 'Gurenge', artist: 'LiSA', anime: 'Demon Slayer', rating: 4.8 },
  { title: 'Cruel Angel’s Thesis', artist: 'Yoko Takahashi', anime: 'Evangelion', rating: 5.0 },
  { title: 'Silhouette', artist: 'KANA-BOON', anime: 'Naruto Shippuden', rating: 4.7 },
];

const SHARE_TEXT = 'Слушаю аниме радио NEON OTAKU 🎧';

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-1 h-10">
      {[0.1, 0.3, 0.2, 0.5, 0.35, 0.15, 0.4].map((d, i) => (
        <span
          key={i}
          className="eq-bar w-1.5 rounded-full bg-gradient-to-t from-primary to-accent"
          style={{
            height: '100%',
            animationDelay: `${d}s`,
            animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}

const Index = () => {
  const { toast } = useToast();
  const [active, setActive] = useState('home');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ likes: 0, messages: 0 });
  const [loginName, setLoginName] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState('');
  const [chatStars, setChatStars] = useState(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [likes, setLikes] = useState<string[]>([]);

  // ---- audio ----
  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.src = STREAM_URL + '?t=' + Date.now();
      a.play()
        .then(() => setPlaying(true))
        .catch(() => toast({ title: 'Не удалось запустить поток', description: 'Попробуйте ещё раз' }));
    }
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ---- auth ----
  const refreshMe = useCallback(async () => {
    if (!getToken()) return;
    const res = await api.me();
    if (res.user) {
      setUser(res.user);
      if (res.stats) setStats(res.stats);
      const l = await api.getLikes();
      setLikes(l.likes || []);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const doDemoLogin = async () => {
    const name = loginName.trim() || 'Отаку #' + Math.floor(Math.random() * 9999);
    const res = await api.demoLogin(name);
    if (res.user) {
      setToken(res.user.token);
      setUser(res.user);
      toast({ title: 'Добро пожаловать!', description: name });
      refreshMe();
    }
  };

  const doLogout = () => {
    clearToken();
    setUser(null);
    setLikes([]);
    setStats({ likes: 0, messages: 0 });
  };

  // ---- chat ----
  const loadMessages = useCallback(async () => {
    const res = await api.getMessages();
    if (res.messages) setMessages(res.messages);
  }, []);

  useEffect(() => {
    loadMessages();
    const t = setInterval(loadMessages, 5000);
    return () => clearInterval(t);
  }, [loadMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChat = async () => {
    if (!user) {
      toast({ title: 'Войдите, чтобы писать в чат' });
      return;
    }
    if (!chatText.trim()) return;
    const res = await api.sendMessage(chatText.trim(), chatStars);
    if (res.message) {
      setChatText('');
      setChatStars(0);
      loadMessages();
    }
  };

  // ---- likes ----
  const toggleLike = async (t: { title: string; artist: string }) => {
    if (!user) {
      toast({ title: 'Войдите, чтобы ставить лайки' });
      return;
    }
    const res = await api.toggleLike(t.title, t.artist);
    setLikes((prev) =>
      res.liked ? [...prev, t.title] : prev.filter((x) => x !== t.title)
    );
    setStats((s) => ({ ...s, likes: s.likes + (res.liked ? 1 : -1) }));
  };

  // ---- share ----
  const share = (net: 'vk' | 'tg' | 'copy', track?: { title: string; artist: string }) => {
    const url = window.location.href;
    const text = track ? `${SHARE_TEXT} — ${track.title} (${track.artist})` : SHARE_TEXT;
    if (net === 'vk') {
      window.open(
        `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        '_blank'
      );
    } else if (net === 'tg') {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        '_blank'
      );
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast({ title: 'Ссылка скопирована!' });
    }
  };

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen grid-bg text-foreground overflow-x-hidden">
      <audio ref={audioRef} />
      <div className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-secondary/25 blur-[120px]" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary animate-glow flex items-center justify-center">
              <Icon name="Radio" size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-700 tracking-widest neon-text">
              NEON<span className="text-accent neon-text-cyan">OTAKU</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className={`px-3 py-2 rounded-lg text-sm font-500 transition-all hover:text-accent ${
                  active === n.id ? 'text-accent neon-text-cyan' : 'text-muted-foreground'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-700 text-white overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>
              <span className="hidden sm:block text-sm font-500 max-w-24 truncate">{user.name}</span>
              <button onClick={doLogout} className="text-muted-foreground hover:text-primary">
                <Icon name="LogOut" size={18} />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => goTo('profile')}
              className="bg-[#0077FF] hover:bg-[#0066DD] text-white gap-2 rounded-full font-600"
            >
              <Icon name="LogIn" size={16} />
              Войти
            </Button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="container py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-float-slow">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-500 tracking-wider uppercase">
              {playing ? 'В эфире сейчас' : 'Эфир готов'} · AniSonFM 320kbps
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-700 leading-[0.95] mb-6">
            АНИМЕ <span className="text-primary neon-text">РАДИО</span>
            <br />
            БЕЗ <span className="text-accent neon-text-cyan">ГРАНИЦ</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Опенинги, эндинги и саундтреки 24/7. Слушай, оценивай треки и общайся с
            комьюнити прямо в эфире.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={togglePlay}
              className="bg-gradient-to-r from-primary to-secondary text-white rounded-full gap-2 font-600 animate-glow"
            >
              <Icon name={playing ? 'Pause' : 'Play'} size={20} />
              {playing ? 'Пауза' : 'Слушать эфир'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => share('vk')}
              className="rounded-full gap-2 border-accent/50 text-accent hover:bg-accent/10"
            >
              <Icon name="Share2" size={20} />
              Поделиться
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-accent/40 blur-2xl rounded-full" />
          <img
            src={HERO_IMG}
            alt="Anime DJ"
            className="relative rounded-3xl border-2 border-primary/40 neon-border w-full object-cover"
          />
        </div>
      </section>

      {/* PLAYER */}
      <section id="player" className="container py-10">
        <div className="glass rounded-3xl p-6 md:p-8 neon-border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center ${
                  playing ? 'animate-vinyl' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-background border-2 border-white/30" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-accent text-xs uppercase tracking-widest font-600 mb-1">
                Прямой эфир · AniSonFM
              </p>
              <h3 className="font-display text-3xl font-700 mb-1">Anime Radio Live</h3>
              <p className="text-muted-foreground mb-4">320 kbps · Lossless stream</p>
              <div className="flex items-center justify-center md:justify-start gap-5">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white animate-glow"
                >
                  <Icon name={playing ? 'Pause' : 'Play'} size={26} />
                </button>
                <div className="flex items-center gap-2 w-40">
                  <Icon name="Volume2" size={18} className="text-muted-foreground" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <button
                  onClick={() => share('tg')}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Icon name="Share2" size={20} />
                </button>
              </div>
            </div>
            <Equalizer playing={playing} />
          </div>
        </div>

        {/* tracklist */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-700 mb-4 flex items-center gap-2">
            <Icon name="ListMusic" className="text-accent" /> Плейлист эфира
          </h2>
          <div className="grid gap-3">
            {TRACKS.map((t, i) => {
              const liked = likes.includes(t.title);
              return (
                <div
                  key={i}
                  className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-primary/60 transition-all group"
                >
                  <span className="font-display text-2xl text-primary/60 w-8 text-center">
                    {i + 1}
                  </span>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0"
                  >
                    <Icon name="Play" size={16} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-600 truncate">{t.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {t.artist} · {t.anime}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <Icon name="Star" size={15} className="fill-accent" />
                    <span className="text-sm font-600">{t.rating}</span>
                  </div>
                  <button
                    onClick={() => toggleLike(t)}
                    className={`transition-colors ${
                      liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <Icon name="Heart" size={18} className={liked ? 'fill-primary' : ''} />
                  </button>
                  <button
                    onClick={() => share('vk', t)}
                    className="text-muted-foreground hover:text-[#0077FF] transition-colors"
                  >
                    <Icon name="Share2" size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHAT + PROFILE */}
      <section className="container py-10 grid md:grid-cols-2 gap-6">
        <div id="chat">
          <h2 className="font-display text-2xl font-700 mb-4 flex items-center gap-2">
            <Icon name="MessagesSquare" className="text-secondary" /> Живой чат
          </h2>
          <div className="glass rounded-3xl p-5 flex flex-col h-[420px]">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.length === 0 && (
                <p className="text-muted-foreground text-sm text-center mt-10">
                  Пока тихо... Напиши первым!
                </p>
              )}
              {messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary shrink-0 flex items-center justify-center text-xs font-700 text-white overflow-hidden">
                    {m.avatar ? (
                      <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      m.user_name[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-600 text-sm text-accent">{m.user_name}</span>
                      {m.stars > 0 && (
                        <span className="flex text-accent">
                          {Array.from({ length: m.stars }).map((_, s) => (
                            <Icon key={s} name="Star" size={11} className="fill-accent" />
                          ))}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90">{m.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Оценка:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setChatStars(s === chatStars ? 0 : s)}>
                    <Icon
                      name="Star"
                      size={16}
                      className={s <= chatStars ? 'fill-accent text-accent' : 'text-muted-foreground'}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder={user ? 'Написать в чат...' : 'Войдите, чтобы писать'}
                  className="bg-muted/40 border-primary/30 rounded-full"
                />
                <Button
                  onClick={sendChat}
                  className="bg-primary hover:bg-primary/90 rounded-full shrink-0"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div id="profile">
          <h2 className="font-display text-2xl font-700 mb-4 flex items-center gap-2">
            <Icon name="User" className="text-accent" /> Профиль
          </h2>
          <div className="glass rounded-3xl p-6 text-center h-[420px] flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 mb-4 animate-glow">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Icon name="UserRound" size={40} className="text-accent" />
                )}
              </div>
            </div>
            <h3 className="font-display text-2xl font-700">{user ? user.name : 'Гость'}</h3>
            {user ? (
              <>
                <p className="text-muted-foreground text-sm mb-5">Рад видеть тебя в эфире!</p>
                <Button
                  onClick={doLogout}
                  variant="outline"
                  className="rounded-full gap-2 border-primary/40 text-primary"
                >
                  <Icon name="LogOut" size={18} /> Выйти
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-4">
                  Войди, чтобы оценивать треки, лайкать и писать в чат
                </p>
                <Input
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Твой ник"
                  className="bg-muted/40 border-primary/30 rounded-full mb-3 max-w-xs text-center"
                />
                <div className="w-full max-w-xs space-y-2">
                  <Button
                    onClick={doDemoLogin}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white gap-2 rounded-full font-600"
                  >
                    <Icon name="LogIn" size={18} /> Войти
                  </Button>
                  <Button
                    onClick={() =>
                      toast({
                        title: 'Вход через ВКонтакте',
                        description: 'Добавьте ключи VK_APP_ID и VK_SECRET_KEY для активации',
                      })
                    }
                    className="w-full bg-[#0077FF] hover:bg-[#0066DD] text-white gap-2 rounded-full font-600"
                  >
                    <Icon name="Share2" size={18} /> Войти через ВКонтакте
                  </Button>
                </div>
              </>
            )}
            <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-xs">
              {[
                { n: stats.likes, l: 'Лайков' },
                { n: stats.messages, l: 'Сообщений' },
                { n: likes.length, l: 'В избранном' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl text-primary neon-text">{s.n}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container py-12">
        <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <Icon name="Sparkles" size={36} className="text-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-700 mb-4">
            О <span className="text-primary neon-text">проекте</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            NEON OTAKU — это аниме радио нового поколения на базе потока AniSonFM 320 kbps.
            Делись треками в ВКонтакте, ставь оценки и находи единомышленников в живом чате.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              { i: 'Share2', t: 'Шаринг в ВК', d: 'Делись любимым в один клик' },
              { i: 'Star', t: 'Рейтинги', d: 'Оценивай каждый трек' },
              { i: 'MessagesSquare', t: 'Комьюнити', d: 'Общайся в живом чате' },
            ].map((f) => (
              <div key={f.t} className="bg-muted/30 rounded-2xl p-5 border border-primary/20">
                <Icon name={f.i} size={26} className="text-accent mb-2 mx-auto" />
                <p className="font-600">{f.t}</p>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <footer id="contacts" className="container py-12">
        <div className="glass rounded-3xl p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl font-700 mb-3">
              <span className="text-accent neon-text-cyan">Контакты</span>
            </h2>
            <p className="text-muted-foreground mb-4">
              Есть идея для эфира или вопрос? Напиши нам.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Icon name="Mail" size={16} className="text-primary" /> hello@neonotaku.fm
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Send" size={16} className="text-primary" /> @neonotaku
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => share('vk')}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all"
              >
                <Icon name="Share2" size={18} />
              </button>
              <button
                onClick={() => share('tg')}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all"
              >
                <Icon name="Send" size={18} />
              </button>
              <button
                onClick={() => share('copy')}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all"
              >
                <Icon name="Link" size={18} />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <Input placeholder="Твоё имя" className="bg-muted/40 border-primary/30 rounded-xl" />
            <Input placeholder="Email" className="bg-muted/40 border-primary/30 rounded-xl" />
            <textarea
              placeholder="Сообщение..."
              rows={3}
              className="w-full rounded-xl bg-muted/40 border border-primary/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={() => toast({ title: 'Спасибо!', description: 'Мы скоро ответим' })}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-600 gap-2"
            >
              <Icon name="Send" size={18} /> Отправить
            </Button>
          </div>
        </div>
        <p className="text-center text-muted-foreground text-xs mt-8">
          © 2026 NEON OTAKU · Аниме радио с любовью к музыке 🎧
        </p>
      </footer>
    </div>
  );
};

export default Index;
