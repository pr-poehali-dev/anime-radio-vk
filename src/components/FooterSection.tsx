import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FooterSectionProps {
  share: (net: 'vk' | 'tg' | 'copy') => void;
  onContactSubmit: () => void;
}

const FooterSection = ({ share, onContactSubmit }: FooterSectionProps) => {
  return (
    <>
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
              onClick={onContactSubmit}
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
    </>
  );
};

export default FooterSection;
