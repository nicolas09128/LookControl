import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('lookcontrol-theme');
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isLight = theme === 'light';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lookcontrol-theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Activar modo oscuro' : 'Activar modo claro'}
      title={isLight ? 'Modo oscuro' : 'Modo claro'}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
