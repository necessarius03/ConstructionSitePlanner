// fe/src/features/site-layout/components/Boundary3D.tsx
import React, { useRef, useMemo } from 'react';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Shape } from '../types';
import { Progress } from '../../../services/ProgressService';

interface Boundary3DProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (shape: Shape) => void;
  progress: Progress[];
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
}

const Boundary3D: React.FC<Boundary3DProps> = ({
  shape,
  isSelected,
  onSelect,
  onUpdate,
  progress,
  viewMode
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Convert 2D coordinates to 3D
  const position3D: [number, number, number] = [
    shape.x / 10,
    0,
    shape.y / 10
  ];

  const size3D = {
    width: shape.width / 10,
    height: 0.1, // Very thin boundary
    depth: shape.height / 10
  };

  // Calculate progress for this boundary
  const boundaryProgress = useMemo(() => {
    const linkedProgress = progress.filter(p => p.zoneShapeId === shape.id.toString());
    if (linkedProgress.length === 0) return null;

    const totalProgress = linkedProgress.reduce((sum, p) => sum + p.completionPercentage, 0);
    const avgProgress = totalProgress / linkedProgress.length;
    const hasDelayed = linkedProgress.some(p => p.status === 'delayed');
    const allCompleted = linkedProgress.every(p => p.status === 'completed');

    return {
      percentage: avgProgress,
      hasDelayed,
      allCompleted,
      taskCount: linkedProgress.length,
      tasks: linkedProgress
    };
  }, [progress, shape.id]);

  // Get boundary color based on progress and view mode
  const getBoundaryColor = () => {
    if (isSelected) return '#ff6b35';

    if (viewMode === 'progress' && boundaryProgress) {
      if (boundaryProgress.hasDelayed) return '#e74c3c';
      if (boundaryProgress.allCompleted) return '#2ecc71';
      if (boundaryProgress.percentage > 0) return '#3498db';
    }

    return '#666666';
  };

  // Create boundary corner points
  const boundaryPoints = useMemo(() => {
    const halfWidth = size3D.width / 2;
    const halfDepth = size3D.depth / 2;
    
    return [
      new THREE.Vector3(-halfWidth, 0.2, -halfDepth),
      new THREE.Vector3(halfWidth, 0.2, -halfDepth),
      new THREE.Vector3(halfWidth, 0.2, halfDepth),
      new THREE.Vector3(-halfWidth, 0.2, halfDepth),
      new THREE.Vector3(-halfWidth, 0.2, -halfDepth), // Close the loop
    ];
  }, [size3D.width, size3D.depth]);

  // Create progress visualization
  const renderProgressVisualization = () => {
    if (viewMode !== 'progress' || !boundaryProgress) return null;

    const progressHeight = (boundaryProgress.percentage / 100) * 5;
    const progressColor = boundaryProgress.hasDelayed ? '#e74c3c' : '#3498db';

    return (
      <group>
        {/* Progress bar visualization */}
        <mesh position={[0, progressHeight / 2, 0]}>
          <boxGeometry args={[size3D.width, progressHeight, size3D.depth]} />
          <meshStandardMaterial 
            color={progressColor} 
            transparent 
            opacity={0.3}
            wireframe={false}
          />
        </mesh>
        
        {/* Progress percentage text */}
        <Text
          position={[0, progressHeight + 1, 0]}
          fontSize={1.5}
          color={progressColor}
          anchorX="center"
          anchorY="middle"
        >
          {`${Math.round(boundaryProgress.percentage)}%`}
        </Text>

        {/* Task count indicator */}
        <Text
          position={[0, progressHeight + 2.5, 0]}
          fontSize={1}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          {`${boundaryProgress.taskCount} công việc`}
        </Text>
      </group>
    );
  };

  // Create safety zones visualization
  const renderSafetyZones = () => {
    if (viewMode !== 'safety') return null;

    const hasSafetyNotes = shape.notes && shape.notes.trim().length > 0;
    const safetyColor = hasSafetyNotes ? '#e74c3c' : '#2ecc71';

    return (
      <group>
        {/* Safety zone indicator */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size3D.width, size3D.depth]} />
          <meshBasicMaterial 
            color={safetyColor} 
            transparent 
            opacity={0.2}
          />
        </mesh>

        {/* Safety status text */}
        <Text
          position={[0, 1, 0]}
          fontSize={1.2}
          color={safetyColor}
          anchorX="center"
          anchorY="middle"
        >
          {hasSafetyNotes ? 'Có cảnh báo an toàn' : 'Khu vực an toàn'}
        </Text>
      </group>
    );
  };

  // Create measurement labels
  const renderMeasurements = () => {
    if (viewMode !== 'overview' && !isSelected) return null;

    return (
      <group>
        {/* Width measurement */}
        <Text
          position={[0, 0.5, -size3D.depth / 2 - 2]}
          fontSize={0.8}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          {`${Math.round(shape.width)}px`}
        </Text>

        {/* Height measurement */}
        <Text
          position={[size3D.width / 2 + 2, 0.5, 0]}
          fontSize={0.8}
          color="#666"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]}
        >
          {`${Math.round(shape.height)}px`}
        </Text>
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
    >
      {/* Main boundary outline */}
      <Line
        points={boundaryPoints}
        color={getBoundaryColor()}
        lineWidth={isSelected ? 3 : 2}
        dashed={true}
        dashScale={2}
        dashSize={1}
        gapSize={0.5}
      />

      {/* Boundary corner markers */}
      {boundaryPoints.slice(0, -1).map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color={getBoundaryColor()} />
        </mesh>
      ))}

      {/* Boundary name label */}
      <Text
        position={[-size3D.width / 2, 1, -size3D.depth / 2]}
        fontSize={1.2}
        color="#333"
        anchorX="left"
        anchorY="middle"
      >
        {shape.name || 'Ranh giới công trường'}
      </Text>

      {/* Progress visualization */}
      {renderProgressVisualization()}

      {/* Safety zones */}
      {renderSafetyZones()}

      {/* Measurements */}
      {renderMeasurements()}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(size3D.width, size3D.depth) + 2, Math.max(size3D.width, size3D.depth) + 2.5]} />
          <meshBasicMaterial color="#ff6b35" />
        </mesh>
      )}

      {/* Ground plane for this boundary */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size3D.width, size3D.depth]} />
        <meshLambertMaterial 
          color="#f0f0f0" 
          transparent 
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

export default Boundary3D;