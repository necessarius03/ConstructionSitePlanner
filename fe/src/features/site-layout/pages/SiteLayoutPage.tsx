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
  LoadingOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import SiteLayoutCanvas from '../components/SiteLayoutCanvas';
import { Shape } from '../types';
import html2canvas from 'html2canvas';
import SiteLayoutService from '../../../services/SiteLayoutService';
import SaveLayoutModal from '../components/SaveLayoutModal';
import LoadLayoutModal from '../components/LoadLayoutModal';
import { getImageUrl } from '../../../constants/equipmentImages';
import ProgressSidebar from '../../progress/components/ProgressSidebar';
import { FieldTimeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const SiteLayoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [currentLayout, setCurrentLayout] = useState<any | null>(null);
  
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isLoadModalVisible, setIsLoadModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isProgressSidebarVisible, setIsProgressSidebarVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLayout(id);
    }
  }, [id]);

  const fetchLayout = async (layoutId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const layout = await SiteLayoutService.getLayoutById(layoutId);
      console.log("Loaded layout data:", layout);
      
      const processedShapes = layout.shapes.map((shape: any) => {
        const processedShape = {
          ...shape,
          id: Number(shape.id),
          x: Number(shape.x),
          y: Number(shape.y),
          width: Number(shape.width),
          height: Number(shape.height),
          opacity: shape.opacity !== undefined ? Number(shape.opacity) : 1,
          rotation: shape.rotation !== undefined ? Number(shape.rotation) : 0,
          isLocked: shape.isLocked || false,
          isSelected: false
        };
        
        if (shape.type === 'equipment') {
          return {
            ...processedShape,
            fill: shape.fill || '#1677ff',
            equipmentId: shape.equipmentId || undefined,
            iconName: shape.iconName || undefined
          };
        } else if (shape.type === 'boundary') {
          return {
            ...processedShape,
            fill: 'transparent',
          };
        } else {
          return processedShape;
        }
      });
      
      console.log("Processed shapes:", processedShapes);
      
      setShapes(processedShapes);
      setCurrentLayout(layout);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error fetching layout:', error);
      setError('Không thể tải mặt bằng. Vui lòng thử lại sau.');
      message.error('Không tìm thấy bản thiết kế');
      
      if (id) {
        navigate('/site-layout');
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSaveConfirm = async (values: { name: string; description: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const shapesForSaving = shapes.map(shape => {
        console.log("Saving shape with iconName:", shape.iconName);
        return {
          id: String(shape.id),
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          fill: shape.fill,
          opacity: shape.opacity,
          type: shape.type,
          name: shape.name || '',
          notes: shape.notes || '',
          rotation: shape.rotation || 0,
          isLocked: shape.isLocked || false,
          iconName: shape.iconName || '',
          equipmentId: shape.equipmentId ? String(shape.equipmentId) : undefined
        };
      });
      
      if (currentLayout) {
        const updated = await SiteLayoutService.updateLayout(currentLayout.id, {
          name: values.name,
          description: values.description,
          shapes: shapesForSaving
        });
        
        setCurrentLayout(updated);
        message.success('Đã cập nhật bản thiết kế');
      } else {
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

  const handleLoadLayout = () => {
    setIsLoadModalVisible(true);
  };

  const handleLoadConfirm = (selectedLayoutId: string) => {
    if (hasUnsavedChanges) {
      confirm({
        title: 'Bạn có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có muốn lưu thay đổi hiện tại trước khi tải bản thiết kế khác không?',
        okText: 'Lưu',
        cancelText: 'Không lưu',
        onOk() {
          setIsSaveModalVisible(true);
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

  const navigateToLayout = (layoutId: string) => {
    navigate(`/site-layout/${layoutId}`);
  };

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
          {currentLayout && (
            <Button
              icon={<FieldTimeOutlined />}
              onClick={() => setIsProgressSidebarVisible(true)}
            >
              Tiến độ
            </Button>
          )}
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

      <SaveLayoutModal
        visible={isSaveModalVisible}
        initialValues={{
          name: currentLayout?.name || '',
          description: currentLayout?.description || ''
        }}
        onCancel={() => setIsSaveModalVisible(false)}
        onSave={handleSaveConfirm}
        isLoading={isLoading}
      />

      <LoadLayoutModal
        visible={isLoadModalVisible}
        onCancel={() => setIsLoadModalVisible(false)}
        onSelect={handleLoadConfirm}
        currentLayoutId={currentLayout?.id}
      />

      {currentLayout && (
        <ProgressSidebar
          visible={isProgressSidebarVisible}
          onClose={() => setIsProgressSidebarVisible(false)}
          shapes={shapes}
          onShapesUpdate={handleShapesChange}
        />
      )}
    </div>
  );
};

export default SiteLayoutPage;