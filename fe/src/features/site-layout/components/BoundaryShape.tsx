// src/features/site-layout/components/BoundaryShape.tsx
import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from '../types';

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

  const dashPattern = [10, 5];
  
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleToggleLock = () => {
    onChange({
      ...shape,
      isLocked: !shape.isLocked,
    });
  };

  const formatDimension = (size: number) => {
    return `${Math.round(size)}`;
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
      <Rect
        x={10}
        y={-9}
        width={Math.min((shape.name?.length || 0) * 7 + 20, 300)}
        height={18}
        fill="white"
        cornerRadius={0}
        perfectDrawEnabled={false}
      />
      
      <Rect
        width={shape.width}
        height={shape.height}
        fill="transparent"
        stroke={isSelected ? "#1677ff" : "#000"}
        strokeWidth={isSelected ? 2 : 1.5}
        dash={dashPattern}
        hitStrokeWidth={4}
        perfectDrawEnabled={false}
        cornerRadius={0}
        opacity={isSelected ? 1 : 0.8}
      />
      
      <Text
        x={14}
        y={-7}
        text={shape.name || 'Ranh giới'}
        fontSize={11}
        fontFamily="Arial"
        fill="#000"
        width={290}
        ellipsis={true}
        align="left"
      />
      
      <Rect
        x={shape.width / 2 - 50}
        y={shape.height -5}
        width={80}
        height={18}
        fill="white"
        cornerRadius={0}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={shape.width / 2 - 20}
        y={shape.height - 5}
        text={formatDimension(shape.width)}
        fontSize={10}
        fontFamily="Arial"
        fill="#333"
        align="center"
      />
      
      <Rect
        x={shape.width - 5}
        y={shape.height / 2 - 30}
        width={18}
        height={50}
        fill="white"
        cornerRadius={0}
        perfectDrawEnabled={false}
      />
      
      <Text
        x={shape.width - 5}
        y={shape.height / 2 + 5}
        text={formatDimension(shape.height)}
        fontSize={10}
        fontFamily="Arial"
        fill="#333"
        rotation={-90}
        align="center"
      />
      
      {/* Lock/unlock button */}
      {/* <Group 
        x={shape.width - 30}
        y={10}
        onClick={handleToggleLock}
      >
        <Rect
          width={24}
          height={24}
          fill="#ffffff"
          cornerRadius={12}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
        />
        <Text
          x={0}
          y={0}
          width={24}
          height={24}
          text={shape.isLocked ? "🔒" : "🔓"}
          fontSize={14}
          align="center"
          verticalAlign="middle"
        />
      </Group> */}
    </Group>
  );
};

export default BoundaryShape;