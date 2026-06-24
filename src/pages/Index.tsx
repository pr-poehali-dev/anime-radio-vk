import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/3332e823-ddf7-4761-8642-52fec844968f/files/9bd27643-274f-49ef-b06b-7cca75e75258.jpg';

const NAV = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'player', label: 'Плеер', icon: 'Radio' },
  { id: 'chat', label: 'Чат', icon: 'MessagesSquare' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'about', label: 'О проекте', icon: 'Sparkles' },
  { id: 'contacts', label: 'Контакты', icon: 'Mail' },
];

const TRACKS = [
  { title: 'Unravel', artist: 'TK from Ling tosite sigure', anime: 'Tokyo Ghoul', rating: 4.9 },
  { title: 'Gurenge', artist: 'LiSA', anime: 'Demon Slayer', rating: 4.8 },
  { title: 'Cruel Angel’s Thesis', artist: 'Yoko Takahashi', anime: 'Evangelion', rating: 5.0 },
  { title: 'Silhouette', artist: 'KANA-BOON', anime: 'Naruto Shippuden', rating: 4.7 },
];

const CHAT = [
  { user: 'Sakura_99', text: 'Этот трек просто огонь! 🔥', stars: 5, color: 'text-primary' },
  { user: 'OtakuKing', text: 'Поставьте что-нибудь из JJK', stars: 4, color: 'text-secondary' },
  { user: 'NekoChan', text: 'Эфир топ, врубаю на весь день', stars: 5, color: 'text-accent' },
];

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
  const [active, setActive] = useState('home');
  const [playing, setPlaying] = useState(true);

  return (
    <div className="min-h-screen grid-bg text-foreground overflow-x-hidden">
      {/* glow blobs */}
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
                onClick={() => setActive(n.id)}
                className={`px-3 py-2 rounded-lg text-sm font-500 transition-all hover:text-accent ${
                  active === n.id ? 'text-accent neon-text-cyan' : 'text-muted-foreground'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <Button className="bg-[#0077FF] hover:bg-[#0066DD] text-white gap-2 rounded-full font-600">
            <Icon name="Share2" size={16} />
            ВКонтакте
          </Button>
        </div>
      </header>

      {/* HERO / HOME */}
      <section className="container py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-float-slow">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-500 tracking-wider uppercase">В эфире · 1 248 слушателей</span>
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
              onClick={() => setPlaying((p) => !p)}
              className="bg-gradient-to-r from-primary to-secondary text-white rounded-full gap-2 font-600 animate-glow"
            >
              <Icon name={playing ? 'Pause' : 'Play'} size={20} />
              {playing ? 'Пауза' : 'Слушать эфир'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 border-accent/50 text-accent hover:bg-accent/10"
            >
              <Icon name="ListMusic" size={20} />
              Плейлисты
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
      <section className="container py-10">
        <div className="glass rounded-3xl p-6 md:p-8 neon-border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent animate-vinyl flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-background border-2 border-white/30" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-accent text-xs uppercase tracking-widest font-600 mb-1">
                Сейчас играет · Demon Slayer OST
              </p>
              <h3 className="font-display text-3xl font-700 mb-1">Gurenge</h3>
              <p className="text-muted-foreground mb-4">LiSA</p>
              <div className="flex items-center justify-center md:justify-start gap-5">
                <button className="text-muted-foreground hover:text-accent transition-colors">
                  <Icon name="SkipBack" size={22} />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white animate-glow"
                >
                  <Icon name={playing ? 'Pause' : 'Play'} size={26} />
                </button>
                <button className="text-muted-foreground hover:text-accent transition-colors">
                  <Icon name="SkipForward" size={22} />
                </button>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon name="Heart" size={22} />
                </button>
                <button className="text-muted-foreground hover:text-[#0077FF] transition-colors gap-1 flex items-center">
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
            {TRACKS.map((t, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-primary/60 transition-all group"
              >
                <span className="font-display text-2xl text-primary/60 w-8 text-center">
                  {i + 1}
                </span>
                <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
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
                <button className="text-muted-foreground hover:text-[#0077FF] transition-colors">
                  <Icon name="Share2" size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section className="container py-10 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-2xl font-700 mb-4 flex items-center gap-2">
            <Icon name="MessagesSquare" className="text-secondary" /> Живой чат
          </h2>
          <div className="glass rounded-3xl p-5 flex flex-col h-[360px]">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {CHAT.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary shrink-0 flex items-center justify-center text-xs font-700 text-white">
                    {m.user[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-600 text-sm ${m.color}`}>{m.user}</span>
                      <span className="flex text-accent">
                        {Array.from({ length: m.stars }).map((_, s) => (
                          <Icon key={s} name="Star" size={11} className="fill-accent" />
                        ))}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Написать в чат..."
                className="bg-muted/40 border-primary/30 rounded-full"
              />
              <Button className="bg-primary hover:bg-primary/90 rounded-full shrink-0">
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div>
          <h2 className="font-display text-2xl font-700 mb-4 flex items-center gap-2">
            <Icon name="User" className="text-accent" /> Профиль
          </h2>
          <div className="glass rounded-3xl p-6 text-center h-[360px] flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 mb-4 animate-glow">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <Icon name="UserRound" size={40} className="text-accent" />
              </div>
            </div>
            <h3 className="font-display text-2xl font-700">Гость</h3>
            <p className="text-muted-foreground text-sm mb-5">
              Войди, чтобы оценивать треки и сохранять любимое
            </p>
            <Button className="bg-[#0077FF] hover:bg-[#0066DD] text-white gap-2 rounded-full font-600 w-full max-w-xs">
              <Icon name="LogIn" size={18} />
              Войти через ВКонтакте
            </Button>
            <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-xs">
              {[
                { n: '0', l: 'Лайков' },
                { n: '0', l: 'Оценок' },
                { n: '0', l: 'Часов' },
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
      <section className="container py-12">
        <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <Icon name="Sparkles" size={36} className="text-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-700 mb-4">
            О <span className="text-primary neon-text">проекте</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            NEON OTAKU — это аниме радио нового поколения. Мы собрали лучшие
            опенинги, эндинги и оркестровые саундтреки в одном бесконечном эфире.
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

      {/* CONTACTS / FOOTER */}
      <footer className="container py-12">
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
              {['Share2', 'Send', 'Youtube', 'Instagram'].map((s) => (
                <button
                  key={s}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all"
                >
                  <Icon name={s} size={18} />
                </button>
              ))}
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
            <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-600 gap-2">
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