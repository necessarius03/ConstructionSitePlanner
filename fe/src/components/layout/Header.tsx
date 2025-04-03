// src/components/layout/Header.tsx
import React from 'react';
import { Layout, Button, Avatar, Badge, Dropdown, Row, Col } from 'antd';
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
    <AntHeader style={{ padding: 0, background: 'white' }}>
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{ marginLeft: 16, marginRight: 16 }}
            />
            <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#2563eb' }}>
              Site Layout Planning
            </Link>
          </div>
        </Col>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: 16 }}>
            <Dropdown
              menu={{ items: notificationItems }}
              placement="bottomRight"
              arrow
            >
              <Badge count={3} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  shape="circle" 
                  style={{ marginLeft: 8, marginRight: 8 }}
                />
              </Badge>
            </Dropdown>

            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight" 
              arrow
            >
              <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span className="hidden md:inline">
                  Quản trị viên
                </span>
              </Button>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </AntHeader>
  );
};

export default Header;