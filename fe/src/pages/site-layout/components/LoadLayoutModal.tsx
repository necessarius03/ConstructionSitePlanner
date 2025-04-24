// src/pages/site-layout/components/LoadLayoutModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, List, Button, Empty, Space, Popconfirm, Input, Tooltip } from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  SearchOutlined,
  InfoCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import SiteLayoutService, { SiteLayout } from '../../../services/SiteLayoutService';

interface LoadLayoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (layoutId: string) => void;
  currentLayoutId?: string;
}

const LoadLayoutModal: React.FC<LoadLayoutModalProps> = ({
  visible,
  onCancel,
  onSelect,
  currentLayoutId
}) => {
  const [layouts, setLayouts] = useState<SiteLayout[]>([]);
  const [searchText, setSearchText] = useState('');

  // Tải danh sách layout khi modal mở
  useEffect(() => {
    if (visible) {
      loadLayouts();
    }
  }, [visible]);

  const loadLayouts = () => {
    const allLayouts = SiteLayoutService.getAllLayouts();
    // Sắp xếp theo thời gian cập nhật mới nhất
    allLayouts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setLayouts(allLayouts);
  };

  const handleDelete = (id: string) => {
    SiteLayoutService.deleteLayout(id);
    loadLayouts();
  };

  const filteredLayouts = layouts.filter(layout => 
    layout.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (layout.description && layout.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Modal
      title="Mở mặt bằng công trường"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div className="mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm mặt bằng..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredLayouts.length > 0 ? (
        <List
          dataSource={filteredLayouts}
          renderItem={(layout) => (
            <List.Item
              key={layout.id}
              className={`cursor-pointer border p-4 rounded-md ${layout.id === currentLayoutId ? 'bg-blue-50' : ''}`}
              onClick={() => layout.id !== currentLayoutId && onSelect(layout.id)}
              actions={[
                <Space>
                  <Tooltip title="Xóa mặt bằng">
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa mặt bằng này?"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDelete(layout.id);
                      }}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </Tooltip>
                </Space>
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center">
                    {layout.name}
                    {layout.id === currentLayoutId && (
                      <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        Đang mở
                      </span>
                    )}
                  </div>
                }
                description={
                  <div className="mt-1">
                    {layout.description && (
                      <div className="flex items-center text-gray-500 mb-1">
                        <InfoCircleOutlined className="mr-1" />
                        {layout.description}
                      </div>
                    )}
                    <div className="flex items-center text-gray-500">
                      <CalendarOutlined className="mr-1" />
                      Cập nhật: {formatDate(layout.updatedAt)}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description={
            searchText 
              ? "Không tìm thấy mặt bằng phù hợp" 
              : "Chưa có mặt bằng nào được lưu"
          } 
        />
      )}
    </Modal>
  );
};

export default LoadLayoutModal;