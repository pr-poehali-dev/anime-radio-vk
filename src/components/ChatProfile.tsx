import { useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type User, type ChatMessage } from '@/lib/api';

interface ChatProfileProps {
  user: User | null;
  stats: { likes: number; messages: number };
  likes: string[];
  messages: ChatMessage[];
  chatText: string;
  chatStars: number;
  loginName: string;
  setChatText: (v: string) => void;
  setChatStars: (v: number) => void;
  setLoginName: (v: string) => void;
  sendChat: () => void;
  doDemoLogin: () => void;
  doLogout: () => void;
  onVkLogin: () => void;
}

const ChatProfile = ({
  user,
  stats,
  likes,
  messages,
  chatText,
  chatStars,
  loginName,
  setChatText,
  setChatStars,
  setLoginName,
  sendChat,
  doDemoLogin,
  doLogout,
  onVkLogin,
}: ChatProfileProps) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="container py-10 grid md:grid-cols-2 gap-6">
      {/* CHAT */}
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
                  onClick={onVkLogin}
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
  );
};

export default ChatProfile;
