import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  LayoutOutlined, 
  ToolOutlined, 
  InboxOutlined, 
  NodeIndexOutlined, 
  BarChartOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed: propCollapsed }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [collapsed, setCollapsed] = useState(propCollapsed);

  // When prop changes, update state
  useEffect(() => {
    setCollapsed(propCollapsed && !isHovered);
  }, [propCollapsed, isHovered]);

  useEffect(() => {
    const pathname = location.pathname;
    const mainPath = pathname.split('/')[1];
    const key = mainPath || 'dashboard';
    
    setSelectedKeys([key]);
  }, [location]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCollapsed(propCollapsed);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/">Tổng quan</Link>,
    },
    {
      key: 'site-layout',
      icon: <LayoutOutlined />,
      label: <Link to="/site-layout">Mặt bằng công trường</Link>,
    },
    {
      key: 'equipment',
      icon: <ToolOutlined />,
      label: <Link to="/equipment">Thiết bị & máy móc</Link>,
    },
    {
      key: 'materials',
      icon: <InboxOutlined />,
      label: <Link to="/materials">Vật liệu</Link>,
    },
    {
      key: 'routes',
      icon: <NodeIndexOutlined />,
      label: <Link to="/routes">Luồng di chuyển</Link>,
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports">Báo cáo & phân tích</Link>,
    }
  ];

  return (
    <Sider
      width={250}
      collapsedWidth={80}
      collapsed={collapsed}
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        transition: 'all 0.2s',
        zIndex: 1000,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-center py-4">
        {collapsed ? (
          <Tooltip title="Site Layout Planning" placement="right">
            <div className="text-2xl text-blue-600 font-bold">SLP</div>
          </Tooltip>
        ) : (
          <div className="text-xl text-blue-600 font-bold px-4">
            Site Layout Planning
          </div>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        className="border-r-0"
        items={menuItems}
      />
      
      <div className="absolute bottom-4 left-0 right-0 px-4">
        {!collapsed && (
          <div className="text-xs text-gray-500 text-center">
            Construction Site Layout Planning v1.0
          </div>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;