// fe/src/features/site-layout/components/ProgressZone3D.tsx
import React, { useRef, useMemo } from 'react';
import { Text, Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Shape } from '../types';
import { Progress } from '../../../services/ProgressService';

interface ProgressZone3DProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (shape: Shape) => void;
  progress?: Progress;
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
}

const ProgressZone3D: React.FC<ProgressZone3DProps> = ({
  shape,
  isSelected,
  onSelect,
  onUpdate,
  progress,
  viewMode
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const progressBarRef = useRef<THREE.Mesh>(null);

  // Convert 2D coordinates to 3D
  const position3D: [number, number, number] = [
    shape.x / 10,
    0,
    shape.y / 10
  ];

  const size3D = {
    width: shape.width / 10,
    height: progress ? (progress.completionPercentage / 100) * 8 : 2, // Dynamic height based on progress
    depth: shape.height / 10
  };

  // Animate progress bar growth
  useFrame((state, delta) => {
    if (progressBarRef.current && progress) {
      const targetHeight = (progress.completionPercentage / 100) * 8;
      const currentHeight = progressBarRef.current.scale.y;
      const newHeight = THREE.MathUtils.lerp(currentHeight, targetHeight, delta * 2);
      progressBarRef.current.scale.y = newHeight;
    }
  });

  // Get zone color based on type and progress
  const getZoneColor = () => {
    if (isSelected) return '#ff6b35';

    if (progress) {
      switch (progress.status) {
        case 'completed':
          return '#2ecc71';
        case 'in_progress':
          return '#3498db';
        case 'delayed':
          return '#e74c3c';
        default:
          return '#95a5a6';
      }
    }

    // Default colors by zone type
    switch (shape.type) {
      case 'zone':
        return '#4caf50';
      case 'storage':
        return '#9c27b0';
      case 'material':
        return '#ffc107';
      case 'path':
        return '#ff5722';
      default:
        return '#666666';
    }
  };

  // Get zone type label
  const getZoneLabel = () => {
    switch (shape.type) {
      case 'zone':
        return 'Khu vực thi công';
      case 'storage':
        return 'Kho chứa';
      case 'material':
        return 'Vật liệu';
      case 'path':
        return 'Đường đi';
      default:
        return 'Khu vực';
    }
  };

  // Render progress information
  const renderProgressInfo = () => {
    if (viewMode !== 'progress' || !progress) return null;

    return (
      <group>
        {/* Progress percentage */}
        <Text
          position={[0, size3D.height + 2, 0]}
          fontSize={1.2}
          color={getZoneColor()}
          anchorX="center"
          anchorY="middle"
        >
          {`${progress.completionPercentage}%`}
        </Text>

        {/* Progress status */}
        <Text
          position={[0, size3D.height + 3.5, 0]}
          fontSize={0.8}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          {getStatusLabel(progress.status)}
        </Text>

        {/* Responsible person */}
        {progress.responsiblePerson && (
          <Text
            position={[0, size3D.height + 4.5, 0]}
            fontSize={0.6}
            color="#666"
            anchorX="center"
            anchorY="middle"
          >
            {progress.responsiblePerson}
          </Text>
        )}
      </group>
    );
  };

  // Render safety indicators
  const renderSafetyIndicators = () => {
    if (viewMode !== 'safety') return null;

    const hasSafetyNotes = shape.notes && shape.notes.trim().length > 0;
    const safetyColor = hasSafetyNotes ? '#e74c3c' : '#2ecc71';

    return (
      <group>
        {/* Safety zone overlay */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size3D.width + 1, size3D.depth + 1]} />
          <meshBasicMaterial 
            color={safetyColor} 
            transparent 
            opacity={0.3}
          />
        </mesh>

        {/* Safety status indicator */}
        <mesh position={[size3D.width / 2, 3, size3D.depth / 2]}>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color={safetyColor} />
        </mesh>
      </group>
    );
  };

  // Get status label in Vietnamese
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Chưa bắt đầu';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'delayed':
        return 'Bị trễ';
      default:
        return status;
    }
  };

  // Render material storage visualization
  const renderMaterialStorage = () => {
    if (shape.type !== 'material' && shape.type !== 'storage') return null;

    const stackHeight = Math.min(size3D.height * 2, 6);
    const stackCount = Math.floor(stackHeight / 1.5);

    return (
      <group>
        {Array.from({ length: stackCount }, (_, i) => (
          <Box
            key={i}
            args={[size3D.width * 0.8, 1, size3D.depth * 0.8]}
            position={[0, 0.5 + i * 1.2, 0]}
          >
            <meshStandardMaterial 
              color={getZoneColor()} 
              transparent 
              opacity={0.7}
            />
          </Box>
        ))}
      </group>
    );
  };

  // Render path visualization
  const renderPathVisualization = () => {
    if (shape.type !== 'path') return null;

    return (
      <group>
        {/* Path surface */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size3D.width, size3D.depth]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* Path markings */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size3D.width * 0.1, size3D.depth]} />
          <meshBasicMaterial color="#fff" />
        </mesh>

        {/* Direction arrows */}
        {Array.from({ length: 3 }, (_, i) => (
          <mesh
            key={i}
            position={[0, 0.07, -size3D.depth / 2 + (i + 1) * (size3D.depth / 4)]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.3, 1]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        ))}
      </group>
    );
  };

  return (
    <group
      ref={groupRef}
      position={position3D}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Main zone structure */}
      {shape.type === 'material' || shape.type === 'storage' ? (
        renderMaterialStorage()
      ) : shape.type === 'path' ? (
        renderPathVisualization()
      ) : (
        /* Regular zone */
        <Box
          ref={progressBarRef}
          args={[size3D.width, size3D.height, size3D.depth]}
          position={[0, size3D.height / 2, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color={getZoneColor()} 
            transparent 
            opacity={0.7}
          />
        </Box>
      )}

      {/* Zone name label */}
      <Text
        position={[0, Math.max(size3D.height, 2) + 0.5, 0]}
        fontSize={1}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {shape.name || getZoneLabel()}
      </Text>

      {/* Progress information */}
      {renderProgressInfo()}

      {/* Safety indicators */}
      {renderSafetyIndicators()}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(size3D.width, size3D.depth) + 1, Math.max(size3D.width, size3D.depth) + 1.5]} />
          <meshBasicMaterial color="#ff6b35" />
        </mesh>
      )}

      {/* Working area indicator for zones */}
      {(shape.type === 'zone' && viewMode === 'overview') && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size3D.width + 2, size3D.depth + 2]} />
          <meshBasicMaterial 
            color={getZoneColor()} 
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}

      {/* Progress timeline indicator */}
      {progress && viewMode === 'progress' && (
        <group position={[size3D.width / 2 + 2, 1, 0]}>
          <Text
            fontSize={0.6}
            color="#666"
            anchorX="left"
            anchorY="middle"
          >
            {`Bắt đầu: ${new Date(progress.startDate).toLocaleDateString()}`}
          </Text>
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.6}
            color="#666"
            anchorX="left"
            anchorY="middle"
          >
            {`Kết thúc: ${new Date(progress.endDate).toLocaleDateString()}`}
          </Text>
        </group>
      )}
    </group>
  );
};

export default ProgressZone3D;