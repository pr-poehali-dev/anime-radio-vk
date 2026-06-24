import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/3332e823-ddf7-4761-8642-52fec844968f/files/9bd27643-274f-49ef-b06b-7cca75e75258.jpg';

const TRACKS = [
  { title: 'Unravel', artist: 'TK from Ling tosite sigure', anime: 'Tokyo Ghoul', rating: 4.9 },
  { title: 'Gurenge', artist: 'LiSA', anime: 'Demon Slayer', rating: 4.8 },
  { title: 'Cruel Angel\u2019s Thesis', artist: 'Yoko Takahashi', anime: 'Evangelion', rating: 5.0 },
  { title: 'Silhouette', artist: 'KANA-BOON', anime: 'Naruto Shippuden', rating: 4.7 },
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

interface PlayerSectionProps {
  playing: boolean;
  volume: number;
  likes: string[];
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleLike: (t: { title: string; artist: string }) => void;
  share: (net: 'vk' | 'tg' | 'copy', track?: { title: string; artist: string }) => void;
}

const PlayerSection = ({
  playing,
  volume,
  likes,
  togglePlay,
  setVolume,
  toggleLike,
  share,
}: PlayerSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default PlayerSection;
