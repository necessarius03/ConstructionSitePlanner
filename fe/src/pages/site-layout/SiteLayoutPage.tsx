// src/pages/site-layout/SiteLayoutPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, message, Modal, Form, Input } from 'antd';
import { 
  SaveOutlined, 
  DownloadOutlined, 
  FileImageOutlined, 
  FolderOpenOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import SiteLayoutCanvas from './components/SiteLayoutCanvas';
import { Shape } from './types';
import html2canvas from 'html2canvas';
import SiteLayoutService, { SiteLayout } from '../../services/SiteLayoutService';
import SaveLayoutModal from './components/SaveLayoutModal';
import LoadLayoutModal from './components/LoadLayoutModal';

const { Title } = Typography;
const { confirm } = Modal;

const SiteLayoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [currentLayout, setCurrentLayout] = useState<SiteLayout | null>(null);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isLoadModalVisible, setIsLoadModalVisible] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tải layout khi có ID
  useEffect(() => {
    if (id) {
      const layout = SiteLayoutService.getLayoutById(id);
      if (layout) {
        setShapes(layout.shapes);
        setCurrentLayout(layout);
        setHasUnsavedChanges(false);
      } else {
        message.error('Không tìm thấy bản thiết kế');
        navigate('/site-layout');
      }
    }
  }, [id, navigate]);

  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes);
    setHasUnsavedChanges(true);
  };

  const handleSelectShape = (shape: Shape | null) => {
    setSelectedShape(shape);
  };

  const handleSaveLayout = () => {
    setIsSaveModalVisible(true);
  };

  const handleSaveConfirm = (values: { name: string; description: string }) => {
    try {
      if (currentLayout) {
        // Cập nhật layout hiện tại
        const updated = SiteLayoutService.updateLayout(currentLayout.id, {
          name: values.name,
          description: values.description,
          shapes
        });
        
        if (updated) {
          setCurrentLayout(updated);
          message.success('Đã cập nhật bản thiết kế');
        }
      } else {
        // Tạo layout mới
        const newLayout = SiteLayoutService.createLayout(
          values.name,
          values.description,
          shapes
        );
        
        setCurrentLayout(newLayout);
        navigate(`/site-layout/${newLayout.id}`);
        message.success('Đã lưu bản thiết kế mới');
      }
      
      setHasUnsavedChanges(false);
      setIsSaveModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi lưu bản thiết kế');
    }
  };

  const handleLoadLayout = () => {
    setIsLoadModalVisible(true);
  };

  const handleLoadConfirm = (selectedLayoutId: string) => {
    // Kiểm tra nếu có thay đổi chưa lưu
    if (hasUnsavedChanges) {
      confirm({
        title: 'Bạn có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có muốn lưu thay đổi hiện tại trước khi tải bản thiết kế khác không?',
        okText: 'Lưu',
        cancelText: 'Không lưu',
        onOk() {
          setIsSaveModalVisible(true); // Mở modal lưu
        },
        onCancel() {
          // Tiếp tục tải mà không lưu
          navigateToLayout(selectedLayoutId);
        }
      });
    } else {
      navigateToLayout(selectedLayoutId);
    }
    
    setIsLoadModalVisible(false);
  };

  const navigateToLayout = (layoutId: string) => {
    navigate(`/site-layout/${layoutId}`);
  };

  const exportAsImage = async () => {
    const element = document.querySelector('.konvajs-content canvas') as HTMLElement;
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element);
      
      // Tạo link tải xuống
      const link = document.createElement('a');
      const layoutName = currentLayout?.name || 'site-layout';
      link.download = `${layoutName}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      message.success('Đã xuất ảnh thành công');
    } catch (error) {
      console.error('Error exporting image:', error);
      message.error('Lỗi khi xuất ảnh');
    }
  };

  const createNewLayout = () => {
    // Kiểm tra nếu có thay đổi chưa lưu
    if (hasUnsavedChanges) {
      confirm({
        title: 'Bạn có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có muốn lưu thay đổi hiện tại trước khi tạo bản thiết kế mới?',
        okText: 'Lưu',
        cancelText: 'Không lưu',
        onOk() {
          setIsSaveModalVisible(true);
        },
        onCancel() {
          resetLayout();
        }
      });
    } else {
      resetLayout();
    }
  };

  const resetLayout = () => {
    setShapes([]);
    setCurrentLayout(null);
    setHasUnsavedChanges(false);
    navigate('/site-layout');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={2}>
            {currentLayout ? currentLayout.name : 'Mặt bằng công trường mới'}
          </Title>
          {currentLayout && (
            <p className="text-gray-500">
              Cập nhật lần cuối: {new Date(currentLayout.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <Space>
          <Button onClick={createNewLayout}>
            Tạo mới
          </Button>
          <Button 
            icon={<FolderOpenOutlined />} 
            onClick={handleLoadLayout}
          >
            Mở
          </Button>
          <Button 
            icon={<SaveOutlined />} 
            type="primary"
            onClick={handleSaveLayout}
          >
            {currentLayout ? 'Lưu' : 'Lưu mới'}
          </Button>
          <Button 
            icon={<FileImageOutlined />} 
            onClick={exportAsImage}
          >
            Xuất ảnh
          </Button>
        </Space>
      </div>
      
      <Card className="mt-4">
        <SiteLayoutCanvas 
          initialShapes={shapes}
          onShapesChange={handleShapesChange}
          onSelectShape={handleSelectShape}
        />
      </Card>

      {/* Modal lưu layout */}
      <SaveLayoutModal
        visible={isSaveModalVisible}
        initialValues={{
          name: currentLayout?.name || '',
          description: currentLayout?.description || ''
        }}
        onCancel={() => setIsSaveModalVisible(false)}
        onSave={handleSaveConfirm}
      />

      {/* Modal tải layout */}
      <LoadLayoutModal
        visible={isLoadModalVisible}
        onCancel={() => setIsLoadModalVisible(false)}
        onSelect={handleLoadConfirm}
        currentLayoutId={currentLayout?.id}
      />
    </div>
  );
};

export default SiteLayoutPage;