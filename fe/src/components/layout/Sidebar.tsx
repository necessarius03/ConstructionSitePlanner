import React from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Map,
  Truck,
  Box,
  Route,
  BarChart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar = ({ isOpen, currentPath, onNavigate }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Map, label: 'Site Layout', path: '/site-layout' },
    { icon: Truck, label: 'Equipment', path: '/equipment' },
    { icon: Box, label: 'Materials', path: '/materials' },
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
  ];

  return (
    <aside className={`site-sidebar ${isOpen ? 'site-sidebar--expanded' : 'site-sidebar--collapsed'}`}>
      <nav className="site-sidebar__nav">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={currentPath === item.path ? 'secondary' : 'ghost'}
            className={`justify-start ${!isOpen && 'justify-center'}`}
            onClick={() => onNavigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-2">{item.label}</span>}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;