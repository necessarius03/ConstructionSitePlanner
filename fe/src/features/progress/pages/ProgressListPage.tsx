// src/features/progress/pages/ProgressListPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Button, Space, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FieldTimeOutlined, BarChartOutlined } from '@ant-design/icons';
import SiteLayoutService from '../../../services/SiteLayoutService';

const { Title } = Typography;

const ProgressListPage: React.FC = () => {
  const [layouts, setLayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const data = await SiteLayoutService.getAllLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openProgressDashboard = (layoutId: string) => {
    navigate(`/progress/dashboard/${layoutId}`);
  };

  const openProgressReport = (layoutId: string) => {
    navigate(`/progress/report/${layoutId}`);
  };

  return (
    <div className="p-6">
      <Title level={2}>Quản lý tiến độ công trường</Title>
      
      <Card className="mt-4">
        <Title level={4}>Chọn mặt bằng để xem tiến độ</Title>
        
        {loading ? (
          <div className="py-10 text-center">
            <Spin size="large" />
          </div>
        ) : layouts.length > 0 ? (
          <List
            dataSource={layouts}
            renderItem={(layout) => (
              <List.Item
                key={layout.id}
                actions={[
                  <Button 
                    icon={<FieldTimeOutlined />} 
                    type="primary"
                    onClick={() => openProgressDashboard(layout.id)}
                  >
                    Dashboard tiến độ
                  </Button>,
                  <Button 
                    icon={<BarChartOutlined />}
                    onClick={() => openProgressReport(layout.id)}
                  >
                    Báo cáo tiến độ
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={layout.name}
                  description={
                    <div>
                      <div>{layout.description || 'Không có mô tả'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Cập nhật: {new Date(layout.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="Chưa có mặt bằng nào được tạo" 
            className="py-8"
          />
        )}
      </Card>
    </div>
  );
};

export default ProgressListPage;