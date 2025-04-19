// src/pages/site-layout/SiteLayoutPage.tsx
import React, { useState } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { SaveOutlined, DownloadOutlined, UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import SiteLayoutCanvas from './components/SiteLayoutCanvas';
import { Shape } from './types';
import html2canvas from 'html2canvas';

const { Title } = Typography;

const SiteLayoutPage: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes);
    console.log('Shapes changed:', newShapes);
  };

  const handleSelectShape = (shape: Shape | null) => {
    setSelectedShape(shape);
    console.log('Selected shape:', shape);
  };

  const exportAsImage = async () => {
    const element = document.querySelector('.konvajs-content canvas') as HTMLElement;
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element);
      
      // Tạo link tải xuống
      const link = document.createElement('a');
      link.download = `site-layout-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Mặt bằng công trường</Title>
        <Space>
          <Button icon={<SaveOutlined />} type="primary">
            Lưu mặt bằng
          </Button>
          <Button icon={<FileImageOutlined />} onClick={exportAsImage}>
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
    </div>
  );
};

export default SiteLayoutPage;