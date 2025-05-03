// src/lib/react-konva-utils.tsx
import React, { useRef, useEffect } from 'react';
import { Group } from 'react-konva';
import ReactDOM from 'react-dom';
import Konva from 'konva';

interface HtmlProps {
  children: React.ReactNode;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
}

export const Html: React.FC<HtmlProps> = ({ children, divProps = {}, style }) => {
  const groupRef = useRef<Konva.Group>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    // Tạo container element nếu chưa có
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      
      // Áp dụng style mặc định
      Object.assign(containerRef.current.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        visibility: 'hidden',
        zIndex: '1000',
        pointerEvents: 'none'
      });
      
      document.body.appendChild(containerRef.current);
    }

    const updatePosition = () => {
      if (!groupRef.current || !containerRef.current) return;
      
      // Lấy vị trí tuyệt đối của group
      const transform = groupRef.current.getAbsoluteTransform();
      
      // Tọa độ trong không gian page của điểm (0, 0) trong group
      const pos = transform.point({ x: 0, y: 0 });
      
      // Lấy stage và scale của nó
      const stage = groupRef.current.getStage();
      if (!stage) return;
      
      const stageBox = stage.container().getBoundingClientRect();
      
      // Áp dụng vị trí và style cho container
      Object.assign(containerRef.current.style, {
        visibility: 'visible',
        transform: `translate(${stageBox.left + pos.x}px, ${
          stageBox.top + pos.y
        }px) rotate(${groupRef.current.rotation()}deg)`,
        transformOrigin: 'top left',
        ...style
      });
    };

    // Cập nhật vị trí ngay khi mount
    updatePosition();
    
    // Lấy stage và đăng ký sự kiện
    const stage = groupRef.current.getStage();
    if (stage) {
      stage.on('contentTransform', updatePosition);
      stage.on('resize', updatePosition);
    }
    
    // Đăng ký sự kiện cho group
    groupRef.current.on('xChange yChange', updatePosition);
    groupRef.current.on('rotationChange', updatePosition);
    groupRef.current.on('scaleXChange scaleYChange', updatePosition);
    groupRef.current.on('visibleChange', updatePosition);

    // Cleanup
    return () => {
      if (stage) {
        stage.off('contentTransform', updatePosition);
        stage.off('resize', updatePosition);
      }
      
      if (groupRef.current) {
        groupRef.current.off('xChange yChange', updatePosition);
        groupRef.current.off('rotationChange', updatePosition);
        groupRef.current.off('scaleXChange scaleYChange', updatePosition);
        groupRef.current.off('visibleChange', updatePosition);
      }
      
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, [style]);

  return (
    <Group ref={groupRef}>
      {containerRef.current && 
        ReactDOM.createPortal(
          <div {...divProps}>{children}</div>,
          containerRef.current
        )}
    </Group>
  );
};