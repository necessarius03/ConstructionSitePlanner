import React, { useState, useEffect } from 'react';
import { Button, Space, Tooltip, Drawer, List, Typography, Tag, Progress as AntProgress, Empty, Spin, Modal, message } from 'antd';
import { 
  FieldTimeOutlined, 
  LinkOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import ProgressService, { Progress, ProgressStatus } from '../../../services/ProgressService';
import ProgressFormModal from '../components/ProgressFormModal';
import ProgressZoneLinkModal from './ProgressZoneLinkModal';
import { Shape } from '../../site-layout/types';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface ProgressSidebarProps {
  visible: boolean;
  onClose: () => void;
  shapes: Shape[];
  onShapesUpdate?: (updatedShapes: Shape[]) => void;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  visible,
  onClose,
  shapes,
  onShapesUpdate
}) => {
  const { id: siteLayoutId } = useParams<{ id: string }>();
  
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
  const [formModalMode, setFormModalMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    if (visible && siteLayoutId) {
      fetchProgressList();
    }
  }, [visible, siteLayoutId]);

  const fetchProgressList = async () => {
    if (!siteLayoutId) return;
    
    try {
      setLoading(true);
      const data = await ProgressService.getProgressBySiteLayout(siteLayoutId);
      setProgressList(data);
    } catch (error) {
      console.error('Error fetching progress list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = () => {
    setFormModalMode('add');
    setSelectedProgress(null);
    setIsFormModalVisible(true);
  };

  const handleEditProgress = (progress: Progress) => {
    setFormModalMode('edit');
    setSelectedProgress(progress);
    setIsFormModalVisible(true);
  };

  const handleDeleteProgress = (progress: Progress) => { 
    confirm({
        title: 'Bạn có chắc chắn muốn xóa tiến độ này?',
        content: 'Hành động này không thể hoàn tác.',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
        try { 
            setLoading(true);
            await ProgressService.deleteProgress(progress.id);
            message.success('Đã xóa tiến độ thành công');
            await fetchProgressList();
        } catch (error) {
            console.error('Error deleting progress:', error);
            message.error('Không thể xóa tiến độ');
        } finally {
            setLoading(false);
        }
        }
    });
    }

  const handleSaveProgress = async (values: any) => {
    if (!siteLayoutId) return;
    
    try {
      const progressData = {
        ...values,
        siteLayoutId,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        actualStartDate: values.actualStartDate ? values.actualStartDate.toISOString() : undefined,
        actualEndDate: values.actualEndDate ? values.actualEndDate.toISOString() : undefined
      };
      
      delete progressData.dateRange;
      
      if (formModalMode === 'add') {
        await ProgressService.createProgress(progressData);
      } else if (selectedProgress) {
        await ProgressService.updateProgress(selectedProgress.id, progressData);
      }
      
      setIsFormModalVisible(false);
      fetchProgressList();
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleLinkToZone = (selectedProgress?: Progress) => {
    if (selectedProgress) {
      setSelectedProgress(selectedProgress);
    }
    setIsLinkModalVisible(true);
  };

  const handleSaveLink = async (progressId: string, zoneId: string) => {
    try {
      const progress = progressList.find(p => p.id === progressId);
      if (!progress) return;
      
      const updateData = {
        ...progress,
        zoneShapeId: zoneId
      };
      
      // Convert dates back to ISO strings
      updateData.startDate = new Date(progress.startDate).toISOString();
      updateData.endDate = new Date(progress.endDate).toISOString();
      if (updateData.actualStartDate) {
        updateData.actualStartDate = new Date(progress.actualStartDate!).toISOString();
      }
      if (updateData.actualEndDate) {
        updateData.actualEndDate = new Date(progress.actualEndDate!).toISOString();
      }
      
      await ProgressService.updateProgress(progressId, updateData as any);
      
      setIsLinkModalVisible(false);
      fetchProgressList();
      
      // Update shape visualization if callback exists
      if (onShapesUpdate) {
        // Find linked shape and update it
        const updatedShapes = shapes.map(shape => {
          if (shape.id.toString() === zoneId) {
            return {
              ...shape,
              progressLinked: true
            };
          }
          return shape;
        });
        
        onShapesUpdate(updatedShapes);
      }
    } catch (error) {
      console.error('Error linking progress to zone:', error);
    }
  };

  const getStatusTag = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return <Tag icon={<ClockCircleOutlined />} color="default">Chưa bắt đầu</Tag>;
      case 'in_progress':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Đang thực hiện</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Hoàn thành</Tag>;
      case 'delayed':
        return <Tag icon={<ExclamationCircleOutlined />} color="error">Bị trễ</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  return (
    <>
      <Drawer
        title="Quản lý tiến độ công trường"
        placement="right"
        onClose={onClose}
        open={visible}
        width={500}
        extra={
          <Space>
            <Button 
              type="primary" 
              onClick={handleAddProgress}
            >
              Thêm tiến độ
            </Button>
            <Button 
              onClick={() => handleLinkToZone()}
              icon={<LinkOutlined />}
            >
              Liên kết khu vực
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : progressList.length > 0 ? (
          <List
            dataSource={progressList}
            renderItem={(item) => (
              <List.Item
                className="mb-3 border rounded-md p-3"
                // style={{ 
                //   borderLeft: `4px solid ${item.color}`,
                //   backgroundColor: item.status === 'delayed' ? '#fff1f0' : 'white'
                // }}
                actions={[
                  <Tooltip title="Chỉnh sửa" key="edit">
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEditProgress(item)} 
                    />
                  </Tooltip>,
                  <Tooltip title={item.zoneShapeId ? "Thay đổi liên kết khu vực" : "Liên kết với khu vực"} key="link">
                    <Button 
                      type="text" 
                      icon={<LinkOutlined />} 
                      onClick={() => handleLinkToZone(item)} 
                      style={{ color: item.zoneShapeId ? "#1677ff" : undefined }}
                    />
                  </Tooltip>,
                  <Tooltip title="Xóa" key="delete">
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteProgress(item)} 
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex justify-between items-center">
                      <Text strong>{item.name}</Text>
                      {getStatusTag(item.status)}
                    </div>
                  }
                  description={
                    <div>
                      <div className="text-sm text-gray-500 mb-2">{item.description}</div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <Text type="secondary" className="text-xs">
                          {dayjs(item.startDate).format('DD/MM/YYYY')} - {dayjs(item.endDate).format('DD/MM/YYYY')}
                        </Text>
                        <div className="flex items-center">
                          <Text type="secondary" className="text-xs mr-2">{item.completionPercentage}%</Text>
                          <AntProgress 
                            percent={item.completionPercentage} 
                            status={item.status === 'delayed' ? 'exception' : undefined}
                            size="small" 
                            style={{ width: 80 }}
                          />
                        </div>
                      </div>

                      {item.zoneShapeId ? (
                        <Tag color="blue" icon={<LinkOutlined />}>
                          Đã liên kết với khu vực {shapes.find(s => s.id.toString() === item.zoneShapeId)?.name || item.zoneShapeId}
                        </Tag>
                      ) : (
                        <Tag color="default">Chưa liên kết</Tag>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="Chưa có tiến độ nào được tạo"
            className="mt-10"
          >
            <Button type="primary" onClick={handleAddProgress}>
              Thêm tiến độ
            </Button>
          </Empty>
        )}
        
        <div className="mt-4">
          <Button 
            type="dashed" 
            block 
            icon={<FieldTimeOutlined />} 
            onClick={() => window.open(`/progress/dashboard/${siteLayoutId}`, '_blank')}
          >
            Mở dashboard tiến độ
          </Button>
        </div>
      </Drawer>

      <ProgressFormModal
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onSave={handleSaveProgress}
        progress={selectedProgress}
        mode={formModalMode}
        siteLayoutId={siteLayoutId!}
      />

      <ProgressZoneLinkModal
        visible={isLinkModalVisible}
        onCancel={() => setIsLinkModalVisible(false)}
        onSave={handleSaveLink}
        progress={progressList}
        shapes={shapes}
        loading={loading}
        preselectedProgressId={selectedProgress?.id}
      />
    </>
  );
};

export default ProgressSidebar;