import React from 'react';
import { Card, Typography } from 'antd';
import SiteLayoutCanvas from './components/SiteLayoutCanvas';

const { Title } = Typography;

const SiteLayoutPage: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2}>Mặt bằng công trường</Title>
      <Card className="mt-4">
        <SiteLayoutCanvas 
          initialShapes={[]}
          onShapesChange={(shapes) => console.log('Shapes changed:', shapes)}
          onSelectShape={(shape) => shape && console.log('Selected shape:', shape)}
        />
      </Card>
    </div>
  );
};

export default SiteLayoutPage;
