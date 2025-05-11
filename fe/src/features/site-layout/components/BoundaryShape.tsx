// Cập nhật BoundaryShape.tsx
import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from '../types';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Html } from 'react-konva-utils';

interface BoundaryShapeProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Shape) => void;
  onContextMenu?: (e: KonvaEventObject<PointerEvent>) => void;
}

const BoundaryShape: React.FC<BoundaryShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  onContextMenu
}) => {
  const groupRef = useRef<any>(null);

  // Dash line style for boundary
  const dashPattern = [10, 5];
  
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên các phần tử khác
    onChange({
      ...shape,
      isLocked: !shape.isLocked,
    });
  };

  const formatDimension = (size: number) => {
    return `${size}px`;
  };

  return (
    <Group
      ref={groupRef}
      x={shape.x}
      y={shape.y}
      draggable={!shape.isLocked}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
      onContextMenu={onContextMenu}
    >
      {/* Boundary rectangle with dashed stroke */}
      <Rect
        width={shape.width}
        height={shape.height}
        fill="transparent"
        stroke={isSelected ? "#1677ff" : "#000"}
        strokeWidth={isSelected ? 2 : 1.5}
        dash={dashPattern}
        strokeScaleEnabled={false}
        perfectDrawEnabled={false}
        strokeHitEnabled={true}
        strokeDashOffset={0}
        strokeEnabled={true}
        strokeDashArray={dashPattern}
        cornerRadius={0}
        opacity={isSelected ? 1 : 0.8}
      />
      
      {/* Name label at top */}
      <Rect
        x={10}
        y={10}
        width={Math.min(shape.name?.length || 0 * 8 + 40, 300)}
        height={30}
        fill="rgba(255, 255, 255, 0.85)"
        cornerRadius={3}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={15}
        y={18}
        text={shape.name || 'Ranh giới'}
        fontSize={14}
        fontFamily="Arial"
        fill="#000"
        width={290}
        ellipsis={true}
      />
      
      {/* Width indicator at bottom */}
      <Rect
        x={shape.width / 2 - 50}
        y={shape.height - 30}
        width={100}
        height={24}
        fill="rgba(255, 255, 255, 0.85)"
        cornerRadius={3}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={shape.width / 2 - 45}
        y={shape.height - 25}
        text={`Rộng: ${formatDimension(shape.width)}`}
        fontSize={12}
        fontFamily="Arial"
        fill="#333"
        align="center"
      />
      
      {/* Height indicator at right */}
      <Rect
        x={shape.width - 90}
        y={shape.height / 2 - 12}
        width={80}
        height={24}
        fill="rgba(255, 255, 255, 0.85)"
        cornerRadius={3}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={shape.width - 85}
        y={shape.height / 2 - 7}
        text={`Dài: ${formatDimension(shape.height)}`}
        fontSize={12}
        fontFamily="Arial"
        fill="#333"
        align="center"
      />
      
      {/* Lock indicator */}
      <Html
        divProps={{
          style: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
          }
        }}
      >
        <div 
          onClick={handleToggleLock}
          style={{ 
            cursor: 'pointer',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          {shape.isLocked ? 
            <LockOutlined style={{ color: '#f5222d', fontSize: '14px' }} /> : 
            <UnlockOutlined style={{ color: '#1677ff', fontSize: '14px' }} />
          }
        </div>
      </Html>
    </Group>
  );
};

export default BoundaryShape;