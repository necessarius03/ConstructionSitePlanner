import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    // Navigation logic would go here in real app
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="rounded-lg border bg-card p-4">
            <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              This is a demo of the main layout structure.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;