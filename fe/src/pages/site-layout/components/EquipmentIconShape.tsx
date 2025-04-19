// src/pages/site-layout/components/EquipmentIconShape.tsx
import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Group as KonvaGroup } from 'konva/lib/Group';
import { Shape } from '../types';
import { Html } from 'react-konva-utils';

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
  const IconComponent = shape.iconComponent;

  useEffect(() => {
    if (isSelected && groupRef.current) {
      // Kích hoạt transformer nếu cần
    }
  }, [isSelected]);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Tính toán vị trí của icon và văn bản
  const iconSize = Math.min(shape.width, shape.height) * 0.5;
  const iconX = shape.width / 2 - iconSize / 2;
  const iconY = shape.height / 2 - iconSize / 2 - 10;
  const textY = shape.height / 2 + iconSize / 2 - 5;

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
      
      {/* Icon using HTML */}
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