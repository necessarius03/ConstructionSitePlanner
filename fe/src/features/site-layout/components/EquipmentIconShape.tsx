// src/features/site-layout/components/EquipmentIconShape.tsx
import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Group as KonvaGroup } from 'konva/lib/Group';
import { Shape } from '../types';
import { FileTextOutlined } from '@ant-design/icons';
import { Html } from '../../../lib/react-konva-utils';
import * as AntdIcons from '@ant-design/icons';

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

  // Get Icon component from iconName
  const IconComponent = shape.iconName 
    ? (AntdIcons[shape.iconName as keyof typeof AntdIcons] as React.ComponentType) 
    : undefined;

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
      
      {/* Equipment icon */}
      {IconComponent && (
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
          <IconComponent style={{ fontSize: iconSize, color: '#ffffff' }} />
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