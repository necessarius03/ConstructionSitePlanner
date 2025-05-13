import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [contentMargin, setContentMargin] = useState(80);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentMargin(collapsed ? 80 : 250);
    }, 50);
    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout 
        className="site-layout" 
        style={{ 
          marginLeft: contentMargin,
          transition: 'margin 0.2s'
        }}
      >
        <Header collapsed={collapsed} toggleCollapsed={toggleSidebar} />
        <Content className="site-layout-content bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;