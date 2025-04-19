// src/pages/site-layout/SiteLayoutPage.tsx
import React, { useState } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { SaveOutlined, ExportOutlined } from '@ant-design/icons';
import SiteLayoutCanvas from './components/SiteLayoutCanvas';
import { Shape } from './types';

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

  const handleSaveLayout = () => {
    // Lưu layout hiện tại
    const layoutData = {
      shapes,
      timestamp: new Date().toISOString(),
      id: 'layout-' + Date.now()
    };
    
    // Trong thực tế, bạn sẽ gửi dữ liệu này đến API
    console.log('Saving layout:', layoutData);
    // TODO: Implement API call to save layout
  };
  
  const handleExportLayout = () => {
    // Export layout ra file
    const dataStr = JSON.stringify(shapes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'layout-' + new Date().toISOString() + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Mặt bằng công trường</Title>
        
        <Space>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSaveLayout}
          >
            Lưu mặt bằng
          </Button>
          <Button 
            icon={<ExportOutlined />}
            onClick={handleExportLayout}
          >
            Xuất file
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