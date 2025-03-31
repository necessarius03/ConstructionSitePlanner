// src/components/layout/MainLayout.tsx
import React, { useState } from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
// import { Sidebar } from './Sidebar';
// import Sider from 'antd/lib/layout/Sider';

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
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Sider width={250} collapsed={collapsed} className="site-layout-background" theme="light">
        <Sidebar collapsed={collapsed} />
      </Sider> */}
      <Layout>
        <Header collapsed={collapsed} toggleCollapsed={toggleSidebar} />
        <Content className="site-layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
