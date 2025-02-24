import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const Header = ({ theme, toggleTheme, toggleSidebar }: HeaderProps) => {
  return (
    <header className="site-header">
      <div className="site-header__container">
        <Button
          variant="ghost"
          className="p-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <h2 className="site-header__title">Construction Site Layout Planning</h2>
          <Button
            variant="ghost"
            className="p-2"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;