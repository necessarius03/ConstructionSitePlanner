import React, { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Button, Row, Col, message } from 'antd';
import { ArrowLeftOutlined, BarChartOutlined, UnorderedListOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressService, { Progress } from '../../../services/ProgressService';
import SiteLayoutService from '../../../services/SiteLayoutService';
import ProgressSummary from '../components/ProgressSummary';
import ProgressList from '../components/ProgressList';
import ProgressTimeline from '../components/ProgressTimeline';
import ProgressGanttChart from '../components/ProgressGanttChart';
import ProgressFormModal from '../components/ProgressFormModal';
import ProgressVisualization from '../components/ProgressVisualization';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProgressDashboardPage: React.FC = () => {
  const { siteLayoutId } = useParams<{ siteLayoutId: string }>();
  const navigate = useNavigate();
  
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
  const [siteLayoutName, setSiteLayoutName] = useState<string>('');
  const [siteLayout, setSiteLayout] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('summary');

  useEffect(() => {
    if (siteLayoutId) {
      fetchProgressList();
      fetchSiteLayoutData();
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

  const fetchSiteLayoutData = async () => {
    try {
      const layout = await SiteLayoutService.getLayoutById(siteLayoutId!);
      setSiteLayout(layout);
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

  const showEditModal = (progress: Progress) => {
    setModalMode('edit');
    setSelectedProgress(progress);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await ProgressService.deleteProgress(id);
      fetchProgressList();
    } catch (error) {
      console.error('Error deleting progress:', error);
    } finally {
      setLoading(false);
    }
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

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setLoading(true);
      await ProgressService.updateStatus(id, status as any);
      message.success('Đã cập nhật trạng thái tiến độ');
      fetchProgressList();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(`/site-layout/${siteLayoutId}`)}
            style={{ marginRight: 12 }}
          >
            Quay lại mặt bằng
          </Button>
          <div>
            <Title level={2}>Dashboard tiến độ</Title>
            <div className="text-gray-500">
              Mặt bằng: {siteLayoutName || 'Đang tải...'}
            </div>
          </div>
        </div>
        <Button 
          type="primary" 
          onClick={showAddModal}
        >
          Thêm tiến độ
        </Button>
      </div>

      <ProgressSummary 
        progress={progressList} 
        siteLayoutName={siteLayoutName}
        onEditProgress={showEditModal}
      />

      <Card className="mt-6">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 16 }}
          tabBarExtraContent={
            <Button onClick={fetchProgressList}>Làm mới</Button>
          }
        >
          <TabPane 
            tab={<span><UnorderedListOutlined /> Danh sách</span>} 
            key="list"
          >
            <ProgressList 
              progress={progressList}
              loading={loading}
              onEdit={showEditModal}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </TabPane>
          <TabPane 
            tab={<span><FieldTimeOutlined /> Dòng thời gian</span>} 
            key="timeline"
          >
            <ProgressTimeline 
              progress={progressList}
              loading={loading}
              onAdd={showAddModal}
              onEdit={showEditModal}
            />
          </TabPane>
          <TabPane 
            tab={<span><BarChartOutlined /> Biểu đồ Gantt</span>} 
            key="gantt"
          >
            <ProgressGanttChart 
              progress={progressList}
              loading={loading}
              onAdd={showAddModal}
              onRefresh={fetchProgressList}
            />
          </TabPane>
          <TabPane 
            tab={<span><BarChartOutlined /> Trực quan hóa</span>} 
            key="visualization"
          >
            <ProgressVisualization 
              progress={progressList}
              siteLayout={siteLayout}
              loading={loading}
            />
          </TabPane>
        </Tabs>
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

export default ProgressDashboardPage;