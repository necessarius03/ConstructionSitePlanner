// src/features/site-layout/pages/SiteLayoutPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  message, 
  Modal, 
  Spin,
  Alert,
  Tooltip
} from 'antd';
import { 
  SaveOutlined, 
  FileImageOutlined, 
  FolderOpenOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import SiteLayoutCanvas from '../components/SiteLayoutCanvas';
import { Shape } from '../types';
import html2canvas from 'html2canvas';
import SiteLayoutService from '../../../services/SiteLayoutService';
import SaveLayoutModal from '../components/SaveLayoutModal';
import LoadLayoutModal from '../components/LoadLayoutModal';
import { equipmentData } from '../../../data/equipment-data';

const { Title } = Typography;
const { confirm } = Modal;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const SiteLayoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for layout data
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [currentLayout, setCurrentLayout] = useState<any | null>(null);
  
  // UI state
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isLoadModalVisible, setIsLoadModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load layout when component mounts or id changes
  useEffect(() => {
    if (id) {
      fetchLayout(id);
    }
  }, [id]);

  // Fetch layout data from the API
  const fetchLayout = async (layoutId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const layout = await SiteLayoutService.getLayoutById(layoutId);
      
      // Process the shapes to include icon components for equipment
      const processedShapes = layout.shapes.map((shape: any) => {
        if (shape.type === 'equipment' && shape.equipmentId) {
          const equipment = equipmentData.find(e => e.id === shape.equipmentId);
          if (equipment) {
            return {
              ...shape,
              iconComponent: equipment.icon
            };
          }
        }
        return shape;
      });
      
      setShapes(processedShapes);
      setCurrentLayout(layout);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error fetching layout:', error);
      setError('Không thể tải mặt bằng. Vui lòng thử lại sau.');
      message.error('Không tìm thấy bản thiết kế');
      
      // Navigate back to main page if there's an error
      if (id) {
        navigate('/site-layout');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle shape changes
  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes);
    setHasUnsavedChanges(true);
  };

  // Handle shape selection
  const handleSelectShape = (shape: Shape | null) => {
    setSelectedShape(shape);
  };

  // Open save modal
  const handleSaveLayout = () => {
    setIsSaveModalVisible(true);
  };

  // Save layout to the API
  const handleSaveConfirm = async (values: { name: string; description: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const shapesForSaving = shapes.map(shape => {
        const { iconComponent, ...shapeCopy } = shape as any;
        return {
          ...shapeCopy,
          id: String(shapeCopy.id),
      };
      });
      
      if (currentLayout) {
        // Update existing layout
        const updated = await SiteLayoutService.updateLayout(currentLayout.id, {
          name: values.name,
          description: values.description,
          shapes: shapesForSaving
        });
        
        setCurrentLayout(updated);
        message.success('Đã cập nhật bản thiết kế');
      } else {
        // Create new layout
        const newLayout = await SiteLayoutService.createLayout({
          name: values.name,
          description: values.description,
          shapes: shapesForSaving
        });
        
        setCurrentLayout(newLayout);
        navigate(`/site-layout/${newLayout.id}`);
        message.success('Đã lưu bản thiết kế mới');
      }
      
      setHasUnsavedChanges(false);
      setIsSaveModalVisible(false);
    } catch (error) {
      console.error('Error saving layout:', error);
      setError('Không thể lưu mặt bằng. Vui lòng thử lại sau.');
      message.error('Lỗi khi lưu bản thiết kế');
    } finally {
      setIsLoading(false);
    }
  };

  // Open load modal
  const handleLoadLayout = () => {
    setIsLoadModalVisible(true);
  };

  // Handle selection from load modal
  const handleLoadConfirm = (selectedLayoutId: string) => {
    if (hasUnsavedChanges) {
      confirm({
        title: 'Bạn có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có muốn lưu thay đổi hiện tại trước khi tải bản thiết kế khác không?',
        okText: 'Lưu',
        cancelText: 'Không lưu',
        onOk() {
          setIsSaveModalVisible(true); // Open save modal
        },
        onCancel() {
          navigateToLayout(selectedLayoutId);
        }
      });
    } else {
      navigateToLayout(selectedLayoutId);
    }
    
    setIsLoadModalVisible(false);
  };

  // Navigate to a specific layout
  const navigateToLayout = (layoutId: string) => {
    navigate(`/site-layout/${layoutId}`);
  };

  // Export canvas as image
  const exportAsImage = async () => {
    const element = document.querySelector('.konvajs-content canvas') as HTMLElement;
    if (!element) {
      message.error('Không tìm thấy phần tử canvas');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const canvas = await html2canvas(element);
      
      const link = document.createElement('a');
      const layoutName = currentLayout?.name || 'site-layout';
      link.download = `${layoutName}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      message.success('Đã xuất ảnh thành công');
    } catch (error) {
      console.error('Error exporting image:', error);
      message.error('Lỗi khi xuất ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new layout
  const createNewLayout = () => {
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

  // Reset to a blank layout
  const resetLayout = () => {
    setShapes([]);
    setCurrentLayout(null);
    setSelectedShape(null);
    setHasUnsavedChanges(false);
    navigate('/site-layout');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={2}>
            {currentLayout ? currentLayout.name : 'Mặt bằng công trường mới'}
            {hasUnsavedChanges && <span className="text-sm text-orange-500 ml-2">(Chưa lưu)</span>}
          </Title>
          {currentLayout && (
            <p className="text-gray-500">
              Cập nhật lần cuối: {new Date(currentLayout.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <Space>
          <Button 
            icon={<PlusOutlined />} 
            onClick={createNewLayout}
          >
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
            loading={isLoading}
          >
            {currentLayout ? 'Lưu' : 'Lưu mới'}
          </Button>
          <Button 
            icon={<FileImageOutlined />} 
            onClick={exportAsImage}
            disabled={isLoading || shapes.length === 0}
          >
            Xuất ảnh
          </Button>
        </Space>
      </div>
      
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          closable
          className="mb-4"
          onClose={() => setError(null)}
        />
      )}
      
      {isLoading && id ? (
        <div className="flex justify-center items-center h-96">
          <Space direction="vertical" align="center">
            <Spin indicator={antIcon} />
            <p>Đang tải mặt bằng...</p>
          </Space>
        </div>
      ) : (
        <Card className="mt-4 relative" bodyStyle={{ padding: '0' }}>
          <div className="h-[calc(100vh-220px)]">
            <SiteLayoutCanvas 
              initialShapes={shapes}
              onShapesChange={handleShapesChange}
              onSelectShape={handleSelectShape}
            />
          </div>
        </Card>
      )}

      {/* Modal to save layout */}
      <SaveLayoutModal
        visible={isSaveModalVisible}
        initialValues={{
          name: currentLayout?.name || '',
          description: currentLayout?.description || ''
        }}
        onCancel={() => setIsSaveModalVisible(false)}
        onSave={handleSaveConfirm}
      />

      {/* Modal to load layout */}
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