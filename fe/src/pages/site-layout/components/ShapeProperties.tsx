// src/pages/site-layout/components/ShapeProperties.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShapePropertiesProps } from '../types';

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  shape,
  onUpdate,
  onDelete
}) => {
  if (!shape) return null;

  return (
    <div className="w-64 p-4 border-l">
      <h3 className="font-semibold mb-4">Properties</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={shape.name || ''}
            onChange={(e) => onUpdate({ ...shape, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Width</Label>
          <Input
            type="number"
            value={shape.width}
            onChange={(e) => onUpdate({ ...shape, width: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Height</Label>
          <Input
            type="number"
            value={shape.height}
            onChange={(e) => onUpdate({ ...shape, height: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Rotation</Label>
          <Input
            type="number"
            value={shape.rotation || 0}
            onChange={(e) => onUpdate({ ...shape, rotation: Number(e.target.value) })}
          />
        </div>

        <Button
          variant="destructive"
          onClick={() => onDelete(shape.id)}
          className="w-full"
        >
          Delete Shape
        </Button>
      </div>
    </div>
  );
};