// src/features/equipment/pages/EquipmentPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { equipmentData, Equipment } from '../../../data/equipment-data';
import EquipmentFormModal from '../components/EquipmentFormModal';

const { Title } = Typography;

const EquipmentPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load equipment data
    setEquipment([...equipmentData]);
  }, []);

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

  const handleDeleteEquipment = (record: Equipment) => {
    try {
      setLoading(true);
      // Filter out the equipment with the matching ID
      const updatedEquipment = equipment.filter(item => item.id !== record.id);
      setEquipment(updatedEquipment);
      message.success('Thiết bị đã được xóa thành công');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      message.error('Có lỗi xảy ra khi xóa thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEquipment = (values: Equipment) => {
    try {
      setLoading(true);
      if (modalMode === 'add') {
        // Generate a unique ID for new equipment
        const newId = `equipment-${Date.now()}`;
        const newEquipment = {
          ...values,
          id: newId,
        };
        setEquipment([...equipment, newEquipment]);
        message.success('Thiết bị đã được thêm thành công');
      } else {
        // Update existing equipment
        const updatedEquipment = equipment.map(item => 
          item.id === values.id ? values : item
        );
        setEquipment(updatedEquipment);
        message.success('Thiết bị đã được cập nhật thành công');
      }
      setIsModalVisible(false);
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
        const IconComponent = record.icon;
        return (
          <Space>
            {IconComponent && <IconComponent style={{ color: record.color }} />}
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