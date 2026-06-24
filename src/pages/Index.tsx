import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  api,
  getToken,
  setToken,
  clearToken,
  type User,
  type ChatMessage,
} from '@/lib/api';
import Header from '@/components/Header';
import PlayerSection from '@/components/PlayerSection';
import ChatProfile from '@/components/ChatProfile';
import FooterSection from '@/components/FooterSection';

const STREAM_URL = 'https://pool.anison.fm/AniSonFM(320)';
const SHARE_TEXT = 'Слушаю аниме радио NEON OTAKU 🎧';

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

  const onVkLogin = () => {
    toast({
      title: 'Вход через ВКонтакте',
      description: 'Добавьте ключи VK_APP_ID и VK_SECRET_KEY для активации',
    });
  };

  const onContactSubmit = () => {
    toast({ title: 'Спасибо!', description: 'Мы скоро ответим' });
  };

  return (
    <div className="min-h-screen grid-bg text-foreground overflow-x-hidden">
      <audio ref={audioRef} />
      <div className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-secondary/25 blur-[120px]" />

      <Header active={active} user={user} goTo={goTo} doLogout={doLogout} />

      <PlayerSection
        playing={playing}
        volume={volume}
        likes={likes}
        togglePlay={togglePlay}
        setVolume={setVolume}
        toggleLike={toggleLike}
        share={share}
      />

      <ChatProfile
        user={user}
        stats={stats}
        likes={likes}
        messages={messages}
        chatText={chatText}
        chatStars={chatStars}
        loginName={loginName}
        setChatText={setChatText}
        setChatStars={setChatStars}
        setLoginName={setLoginName}
        sendChat={sendChat}
        doDemoLogin={doDemoLogin}
        doLogout={doLogout}
        onVkLogin={onVkLogin}
      />

      <FooterSection share={share} onContactSubmit={onContactSubmit} />
    </div>
  );
};

export default Index;
