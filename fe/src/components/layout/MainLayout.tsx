import React, { useState } from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header collapsed={collapsed} toggleCollapsed={toggleSidebar} />
        <Content className="site-layout-content bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;