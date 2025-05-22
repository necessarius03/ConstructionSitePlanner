// fe/src/features/site-layout/components/Equipment3D.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder, Cone, Group } from '@react-three/drei';
import * as THREE from 'three';
import { Shape } from '../types';

interface Equipment3DProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (shape: Shape) => void;
  viewMode: 'overview' | 'equipment' | 'progress' | 'safety';
}

const Equipment3D: React.FC<Equipment3DProps> = ({
  shape,
  isSelected,
  onSelect,
  onUpdate,
  viewMode
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation for active equipment
  useFrame((state, delta) => {
    if (groupRef.current && isAnimating) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Convert 2D coordinates to 3D
  const position3D: [number, number, number] = [
    shape.x / 10, // Scale down for 3D world
    0,
    shape.y / 10
  ];

  const size3D = {
    width: shape.width / 10,
    height: Math.max(shape.height / 10, 2), // Minimum height for visibility
    depth: shape.width / 10
  };

  // Get color based on view mode and selection state
  const getColor = () => {
    if (isSelected) return '#ff6b35';
    if (hovered) return '#4a90e2';
    
    switch (viewMode) {
      case 'safety':
        return shape.notes ? '#e74c3c' : '#2ecc71'; // Red if has safety notes
      case 'progress':
        return shape.equipmentId ? '#3498db' : '#95a5a6'; // Blue if assigned to progress
      default:
        return shape.fill || '#666666';
    }
  };

  // Create 3D model based on equipment type
  const renderEquipmentModel = () => {
    const color = getColor();
    
    switch (shape.iconName) {
      case 'TOWER_CRANE':
        return (
          <group>
            {/* Base */}
            <Box args={[size3D.width, 0.5, size3D.depth]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Tower */}
            <Cylinder args={[0.5, 0.5, 20]} position={[0, 10, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            {/* Jib */}
            <Box args={[15, 0.3, 0.3]} position={[7.5, 20, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Counter-jib */}
            <Box args={[8, 0.3, 0.3]} position={[-4, 20, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Hook */}
            <Cylinder args={[0.2, 0.2, 1]} position={[12, 18, 0]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
          </group>
        );

      case 'EXCAVATOR':
        return (
          <group>
            {/* Body */}
            <Box args={[size3D.width, 2, size3D.depth]} position={[0, 1, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Arm */}
            <Box args={[4, 0.5, 0.5]} position={[2, 2.5, 0]} rotation={[0, 0, -0.3]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Bucket */}
            <Box args={[1.5, 1, 1]} position={[4, 1.5, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Tracks */}
            <Box args={[size3D.width + 1, 0.8, 1]} position={[0, 0.4, 1.5]}>
              <meshStandardMaterial color="#333" />
            </Box>
            <Box args={[size3D.width + 1, 0.8, 1]} position={[0, 0.4, -1.5]}>
              <meshStandardMaterial color="#333" />
            </Box>
          </group>
        );

      case 'CONCRETE_MIXER':
        return (
          <group>
            {/* Chassis */}
            <Box args={[size3D.width, 1, size3D.depth]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Drum */}
            <Cylinder args={[1.5, 1.5, 4]} position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 6]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            {/* Chute */}
            <Box args={[0.5, 0.5, 3]} position={[0, 1.5, 2.5]} rotation={[-0.5, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );

      case 'BULLDOZER':
        return (
          <group>
            {/* Body */}
            <Box args={[size3D.width, 2, size3D.depth]} position={[0, 1, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Blade */}
            <Box args={[size3D.width + 1, 2.5, 0.3]} position={[0, 1.25, size3D.depth / 2 + 0.5]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Tracks */}
            <Box args={[size3D.width, 0.8, 1]} position={[0, 0.4, 1]}>
              <meshStandardMaterial color="#333" />
            </Box>
            <Box args={[size3D.width, 0.8, 1]} position={[0, 0.4, -1]}>
              <meshStandardMaterial color="#333" />
            </Box>
          </group>
        );

      case 'FORKLIFT':
        return (
          <group>
            {/* Body */}
            <Box args={[size3D.width, 1.5, size3D.depth]} position={[0, 0.75, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Mast */}
            <Box args={[0.3, 4, 0.3]} position={[0, 2, size3D.depth / 2 - 0.5]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Forks */}
            <Box args={[0.2, 0.2, 2]} position={[-0.5, 1, size3D.depth / 2 + 1]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.2, 0.2, 2]} position={[0.5, 1, size3D.depth / 2 + 1]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );

      case 'DUMP_TRUCK':
        return (
          <group>
            {/* Cab */}
            <Box args={[2, 2.5, size3D.depth]} position={[-size3D.width / 2 + 1, 1.25, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Bed */}
            <Box args={[size3D.width - 2, 2, size3D.depth]} position={[1, 1.5, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.8, 0.8, 0.3]} position={[-size3D.width / 2 + 0.5, 0.8, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.8, 0.8, 0.3]} position={[-size3D.width / 2 + 0.5, 0.8, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.8, 0.8, 0.3]} position={[size3D.width / 2 - 0.5, 0.8, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.8, 0.8, 0.3]} position={[size3D.width / 2 - 0.5, 0.8, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
          </group>
        );

      default:
        // Generic equipment representation
        return (
          <Box args={[size3D.width, size3D.height, size3D.depth]} position={[0, size3D.height / 2, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
        );
    }
  };

  // Working area visualization
  const renderWorkingArea = () => {
    if (viewMode !== 'safety' && viewMode !== 'overview') return null;
    
    const workingRadius = Math.max(size3D.width, size3D.depth) * 2;
    
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[workingRadius * 0.8, workingRadius]} />
        <meshBasicMaterial 
          color={isSelected ? '#ff6b35' : '#4a90e2'} 
          transparent 
          opacity={0.2} 
        />
      </mesh>
    );
  };

  // Equipment label
  const renderLabel = () => {
    if (viewMode === 'overview' && !isSelected && !hovered) return null;
    
    return (
      <Text
        position={[0, size3D.height + 2, 0]}
        fontSize={1}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {shape.name || 'Equipment'}
      </Text>
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
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Main Equipment Model */}
      <group castShadow receiveShadow>
        {renderEquipmentModel()}
      </group>

      {/* Working Area */}
      {renderWorkingArea()}

      {/* Equipment Label */}
      {renderLabel()}

      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size3D.width + 1, size3D.width + 1.2]} />
          <meshBasicMaterial color="#ff6b35" />
        </mesh>
      )}

      {/* Status Indicators */}
      {shape.notes && viewMode === 'safety' && (
        <mesh position={[size3D.width / 2 + 1, size3D.height + 1, 0]}>
          <sphereGeometry args={[0.3]} />
          <meshBasicMaterial color="#e74c3c" />
        </mesh>
      )}

      {/* Animation indicator for active equipment */}
      {isAnimating && (
        <mesh position={[0, size3D.height + 3, 0]}>
          <coneGeometry args={[0.3, 1]} />
          <meshBasicMaterial color="#2ecc71" />
        </mesh>
      )}
    </group>
  );
};

export default Equipment3D;