// src/pages/site-layout/components/CanvasToolbar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { CanvasToolbarProps, ShapeType } from '../types';

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddShape,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const shapeTypes: ShapeType[] = ['equipment', 'material', 'zone', 'storage', 'path'];

  return (
    <div className="flex justify-between p-4 border-b">
      <div className="flex gap-2">
        {shapeTypes.map(type => (
          <Button
            key={type}
            onClick={() => onAddShape(type)}
            variant="outline"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="ghost"
        >
          Undo
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          variant="ghost"
        >
          Redo
        </Button>
      </div>
    </div>
  );
};