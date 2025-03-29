// src/components/layout/Header.tsx
import React from 'react';
import { Layout, Button, Avatar, Badge, Dropdown } from 'antd';
import { 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, toggleCollapsed }) => {
  // Dropdown items for user menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin tài khoản',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  // Dropdown items for notifications
  const notificationItems = [
    {
      key: '1',
      label: 'Vật liệu sắp hết hạn: Thép xây dựng',
    },
    {
      key: '2',
      label: 'Cần duyệt bản vẽ mặt bằng "Khu A"',
    },
    {
      key: '3',
      label: 'Lịch bảo trì thiết bị: Cần cẩu 30T',
    },
  ];

  return (
    <AntHeader className="flex justify-between items-center px-4 bg-white">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="mr-4"
        />
        <Link to="/" className="font-bold text-xl text-blue-600">
          Site Layout Planning
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          arrow
        >
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined />} shape="circle" />
          </Badge>
        </Dropdown>

        <Dropdown 
          menu={{ items: userMenuItems }} 
          placement="bottomRight" 
          arrow
        >
          <Button type="text" className="flex items-center">
            <Avatar icon={<UserOutlined />} className="mr-2" />
            <span className="hidden md:inline">Quản trị viên</span>
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
