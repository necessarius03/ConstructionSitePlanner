// fe/src/features/equipment/pages/EquipmentPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EquipmentService, { Equipment } from '../../../services/EquipmentService';
import EquipmentFormModal from '../components/EquipmentFormModal';
import { getImageUrl } from '../../../constants/equipmentImages';

const { Title } = Typography;

const EquipmentPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await EquipmentService.getAllEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      message.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setModalMode('add');
    setSelectedEquipment(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record: Equipment) => {
    setModalMode('edit');
    setSelectedEquipment(record);
    setIsModalVisible(true);
  };

  const handleDeleteEquipment = async (record: Equipment) => {
    try {
      setLoading(true);
      await EquipmentService.deleteEquipment(record.id);
      message.success('Thiết bị đã được xóa thành công');
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      message.error('Có lỗi xảy ra khi xóa thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEquipment = async (values: any) => {
    try {
      setLoading(true);
      
      const equipmentData = {
        name: values.name,
        iconName: values.icon, // Giữ nguyên giá trị iconName
        width: values.width,
        height: values.height,
        description: values.description || '',
        category: values.category,
        color: values.color,
        notes: values.notes || ''
      };
      
      if (modalMode === 'add') {
        await EquipmentService.createEquipment(equipmentData);
        message.success('Thiết bị đã được thêm thành công');
      } else if (selectedEquipment) {
        await EquipmentService.updateEquipment(selectedEquipment.id, equipmentData);
        message.success('Thiết bị đã được cập nhật thành công');
      }
      
      setIsModalVisible(false);
      fetchEquipment();
    } catch (error) {
      console.error('Error saving equipment:', error);
      message.error('Có lỗi xảy ra khi lưu thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Equipment) => {
        // Lấy URL hình ảnh từ iconName
        const imageUrl = getImageUrl(record.iconName);
        
        return (
          <Space>
            <img 
              src={imageUrl} 
              alt={text}
              style={{ 
                width: '24px', 
                height: '24px',
                objectFit: 'contain'
              }} 
            />
            {text}
          </Space>
        );
      },
    },
    {
      title: 'Loại',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryMap: {[key: string]: string} = {
          heavy: 'Thiết bị nặng',
          transport: 'Thiết bị vận chuyển',
          lifting: 'Thiết bị nâng',
          concrete: 'Thiết bị bê tông',
          other: 'Khác',
        };
        return categoryMap[category] || category;
      },
    },
    {
      title: 'Kích thước',
      key: 'size',
      render: (text: string, record: Equipment) => `${record.width} × ${record.height}`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: Equipment) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            type="text"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thiết bị này?"
            onConfirm={() => handleDeleteEquipment(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Quản lý thiết bị & máy móc</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          Thêm thiết bị
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={equipment}
          rowKey="id"
          loading={loading}
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>

      <EquipmentFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveEquipment}
        equipment={selectedEquipment}
        mode={modalMode}
      />
    </div>
  );
};

export default EquipmentPage;