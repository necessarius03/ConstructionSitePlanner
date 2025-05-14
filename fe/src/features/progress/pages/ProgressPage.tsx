import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Table, Space, Tag, Progress as AntProgress, message, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressService, { Progress, ProgressStatus } from '../../../services/ProgressService';
import SiteLayoutService from '../../../services/SiteLayoutService';
import ProgressFormModal from '../components/ProgressFormModal';

const { Title } = Typography;
const { confirm } = Modal;

const ProgressPage: React.FC = () => {
  const { siteLayoutId } = useParams<{ siteLayoutId: string }>();
  const navigate = useNavigate();
  
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
  const [siteLayoutName, setSiteLayoutName] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (siteLayoutId) {
      fetchProgressList();
      fetchSiteLayoutName();
    } else {
      message.error('Không tìm thấy mã mặt bằng');
      navigate('/site-layout');
    }
  }, [siteLayoutId]);

  const fetchProgressList = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getProgressBySiteLayout(siteLayoutId!);
      setProgressList(data);
    } catch (error) {
      console.error('Error fetching progress list:', error);
      message.error('Không thể tải danh sách tiến độ công trường');
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteLayoutName = async () => {
    try {
      const layout = await SiteLayoutService.getLayoutById(siteLayoutId!);
      setSiteLayoutName(layout.name);
    } catch (error) {
      console.error('Error fetching site layout:', error);
    }
  };

  const showAddModal = () => {
    setModalMode('add');
    setSelectedProgress(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record: Progress) => {
    setModalMode('edit');
    setSelectedProgress(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tiến độ này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await ProgressService.deleteProgress(id);
          message.success('Đã xóa tiến độ thành công');
          fetchProgressList();
        } catch (error) {
          console.error('Error deleting progress:', error);
          message.error('Không thể xóa tiến độ');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      const progressData = {
        ...values,
        siteLayoutId: siteLayoutId!,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        actualStartDate: values.actualStartDate ? values.actualStartDate.toISOString() : undefined,
        actualEndDate: values.actualEndDate ? values.actualEndDate.toISOString() : undefined
      };
      
      delete progressData.dateRange;
      
      if (modalMode === 'add') {
        await ProgressService.createProgress(progressData);
        message.success('Đã thêm tiến độ thành công');
      } else if (selectedProgress) {
        await ProgressService.updateProgress(selectedProgress.id, progressData);
        message.success('Đã cập nhật tiến độ thành công');
      }
      
      setIsModalVisible(false);
      fetchProgressList();
    } catch (error) {
      console.error('Error saving progress:', error);
      message.error('Có lỗi xảy ra khi lưu tiến độ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ProgressStatus) => {
    try {
      setLoading(true);
      await ProgressService.updateStatus(id, status);
      message.success('Đã cập nhật trạng thái tiến độ');
      fetchProgressList();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return <Tag icon={<MinusCircleOutlined />} color="default">Chưa bắt đầu</Tag>;
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

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Progress) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.description}</div>
        </div>
      )
    },
    {
      title: 'Thời gian',
      key: 'timeframe',
      render: (text: string, record: Progress) => {
        const start = dayjs(record.startDate).format('DD/MM/YYYY');
        const end = dayjs(record.endDate).format('DD/MM/YYYY');
        
        const actualStart = record.actualStartDate 
          ? dayjs(record.actualStartDate).format('DD/MM/YYYY')
          : null;
          
        const actualEnd = record.actualEndDate
          ? dayjs(record.actualEndDate).format('DD/MM/YYYY')
          : null;
          
        const isDelayed = dayjs().isAfter(dayjs(record.endDate)) && record.status !== 'completed';
        
        return (
          <div>
            <div className="flex items-center">
              <CalendarOutlined className="mr-1 text-gray-500" />
              <span>
                Kế hoạch: {start} - {end}
              </span>
            </div>
            {(actualStart || actualEnd) && (
              <div className="text-xs mt-1">
                {actualStart && <span>Bắt đầu: {actualStart}</span>}
                {actualStart && actualEnd && <span> | </span>}
                {actualEnd && <span>Kết thúc: {actualEnd}</span>}
              </div>
            )}
            {isDelayed && record.status !== 'delayed' && (
              <Tag color="error" className="mt-1">Đã quá hạn</Tag>
            )}
          </div>
        );
      }
    },
    {
      title: 'Tiến độ',
      key: 'completion',
      render: (text: string, record: Progress) => (
        <AntProgress 
          percent={record.completionPercentage} 
          size="small" 
          status={record.status === 'delayed' ? 'exception' : undefined}
          style={{ width: 120 }}
        />
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProgressStatus) => getStatusTag(status),
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'responsiblePerson',
      key: 'responsiblePerson',
      render: (person: string) => person || '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text: string, record: Progress) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            type="text"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            type="text"
            danger
          />
          {record.status !== 'completed' && (
            <Tooltip title="Đánh dấu hoàn thành">
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'completed')}
                type="text"
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status !== 'in_progress' && record.status !== 'completed' && (
            <Tooltip title="Đánh dấu đang thực hiện">
              <Button
                icon={<ClockCircleOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'in_progress')}
                type="text"
                style={{ color: '#1677ff' }}
              />
            </Tooltip>
          )}
          {record.status !== 'delayed' && (
            <Tooltip title="Đánh dấu bị trễ">
              <Button
                icon={<ExclamationCircleOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'delayed')}
                type="text"
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={2}>Quản lý tiến độ công trường</Title>
          <div className="text-gray-500">
            Mặt bằng: {siteLayoutName || 'Đang tải...'}
          </div>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          >
            Thêm tiến độ
          </Button>
          <Button 
            onClick={() => navigate(`/site-layout/${siteLayoutId}`)}
          >
            Quay lại mặt bằng
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={progressList}
          rowKey="id"
          loading={loading}
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>

      <ProgressFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
        progress={selectedProgress}
        mode={modalMode}
        siteLayoutId={siteLayoutId!}
      />
    </div>
  );
};

export default ProgressPage;