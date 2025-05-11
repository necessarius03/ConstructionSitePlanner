// src/features/site-layout/components/EquipmentIconShape.tsx
import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Image } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Group as KonvaGroup } from 'konva/lib/Group';
import { Shape } from '../types';
import { FileTextOutlined } from '@ant-design/icons';
import { Html } from '../../../lib/react-konva-utils';
import useImage from 'use-image';
import { getImageUrl } from '../../../constants/equipmentImages';

interface EquipmentIconShapeProps {
  shape: Shape;
  isSelected: boolean;
  isLocked?: boolean;
  onChange: (newAttrs: Shape) => void;
  onSelect: () => void;
  onContextMenu?: (e: KonvaEventObject<PointerEvent>) => void;
}

const EquipmentIconShape: React.FC<EquipmentIconShapeProps> = ({
  shape,
  isSelected,
  isLocked = false,
  onChange,
  onSelect,
  onContextMenu
}) => {
  const groupRef = useRef<KonvaGroup>(null);
  
  // Lấy URL hình ảnh từ iconName
  const imageUrl = shape.iconName ? getImageUrl(shape.iconName) : '';
  
  // Load hình ảnh từ URL
  const [image, status] = useImage(imageUrl);

  // Kích thước và vị trí của icon
  const iconSize = Math.min(shape.width, shape.height) * 0.6;
  const iconX = (shape.width - iconSize) / 2;
  const iconY = (shape.height - iconSize) / 2 - 10;
  const textY = shape.height / 2 + iconSize / 2 - 5;

  const hasNotes = shape.notes && shape.notes.trim().length > 0;

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      ref={groupRef}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      rotation={shape.rotation || 0}
      draggable={!isLocked}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
      onContextMenu={onContextMenu}
    >
      {/* Background rectangle */}
      <Rect
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        opacity={shape.opacity}
        cornerRadius={5}
        strokeWidth={isSelected ? 2 : 0}
        stroke={isSelected ? "#0096ff" : "transparent"}
      />
      
      {/* Equipment image */}
      {image && status === 'loaded' ? (
        <Image
          image={image}
          x={iconX}
          y={iconY}
          width={iconSize}
          height={iconSize}
        />
      ) : shape.iconComponent && (
        // Fallback to icon component if image fails to load
        <Html
          divProps={{
            style: {
              position: 'absolute',
              top: `${iconY}px`,
              left: `${iconX}px`,
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
          }}
        >
          <shape.iconComponent style={{ fontSize: iconSize, color: '#ffffff' }} />
        </Html>
      )}
      
      {/* Notes indicator */}
      {hasNotes && (
        <Html
          divProps={{
            style: {
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '16px',
              height: '16px',
              background: '#fff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }
          }}
        >
          <FileTextOutlined style={{ fontSize: '12px', color: shape.fill }} />
        </Html>
      )}
      
      {/* Name text */}
      <Text
        x={0}
        y={textY}
        width={shape.width}
        text={shape.name || ''}
        fontSize={12}
        fill="#ffffff"
        align="center"
      />
    </Group>
  );
};

export default EquipmentIconShape;