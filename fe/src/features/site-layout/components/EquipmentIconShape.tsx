// src/features/site-layout/components/EquipmentIconShape.tsx
import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Image as KonvaImage } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Group as KonvaGroup } from 'konva/lib/Group';
import { Shape } from '../types';
import { getImageUrl } from '../../../constants/equipmentImages';
import useImage from 'use-image';

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
  
  // Lấy URL hình ảnh dựa trên iconName
  const imageUrl = getImageUrl(shape.iconName);
  
  // Load hình ảnh
  const [image, status] = useImage(imageUrl);
  
  // Kích thước và vị trí của icon
  const iconSize = Math.min(shape.width, shape.height) * 0.7;
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

  // Xử lý transform
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    if (!groupRef.current) return;
    
    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    
    // Reset scale sau khi đã áp dụng
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...shape,
      x: node.x(),
      y: node.y(),
      rotation: rotation,
      width: Math.max(5, shape.width * scaleX),
      height: Math.max(5, shape.height * scaleY),
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
      onTransformEnd={handleTransformEnd}
      onClick={onSelect}
      onTap={onSelect}
      onContextMenu={onContextMenu}
    >
      {/* Background rectangle - transparent with border */}
      <Rect
        width={shape.width}
        height={shape.height}
        fill="transparent"
        opacity={1}
        cornerRadius={5}
        stroke={shape.fill || "#000000"}
        strokeWidth={1.5}
        hitStrokeWidth={4}
      />
      
      {/* Highlight when selected */}
      {isSelected && (
        <Rect
          width={shape.width}
          height={shape.height}
          fill="transparent"
          cornerRadius={5}
          strokeWidth={2}
          stroke="#0096ff"
          hitStrokeWidth={4}
        />
      )}
      
      {/* Equipment icon - sử dụng KonvaImage để hiển thị hình ảnh */}
      {status === 'loaded' && image && (
        <KonvaImage
          image={image}
          x={iconX}
          y={iconY}
          width={iconSize}
          height={iconSize}
        />
      )}
      
      {/* Fallback khi không load được hình ảnh */}
      {(status !== 'loaded' || !image) && (
        <Text
          x={0}
          y={iconY}
          width={shape.width}
          height={iconSize}
          text={shape.name?.charAt(0) || 'E'}
          fontSize={iconSize * 0.8}
          fill={shape.fill}
          align="center"
          verticalAlign="middle"
        />
      )}
      
      {/* Notes indicator */}
      {hasNotes && (
        <Text
          x={shape.width - 20}
          y={5}
          text="📝"
          fontSize={16}
          fill="#000"
        />
      )}
      
      {/* Name text */}
      <Text
        x={0}
        y={textY}
        width={shape.width}
        text={shape.name || ''}
        fontSize={12}
        fill="#000000"
        align="center"
      />
    </Group>
  );
};

export default EquipmentIconShape;