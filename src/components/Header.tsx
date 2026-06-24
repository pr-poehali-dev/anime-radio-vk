import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { type User } from '@/lib/api';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'player', label: 'Плеер' },
  { id: 'chat', label: 'Чат' },
  { id: 'profile', label: 'Профиль' },
  { id: 'about', label: 'О проекте' },
  { id: 'contacts', label: 'Контакты' },
];

interface HeaderProps {
  active: string;
  user: User | null;
  goTo: (id: string) => void;
  doLogout: () => void;
}

const Header = ({ active, user, goTo, doLogout }: HeaderProps) => {
  return (
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
  );
};

export default Header;
