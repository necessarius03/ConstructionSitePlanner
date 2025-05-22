// fe/src/features/site-layout/components/TransportFlow3D.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { Shape } from '../types';
import { Progress } from '../../../services/ProgressService';

interface TransportFlow3DProps {
  shapes: Shape[];
  progress: Progress[];
}

interface TransportRoute {
  from: THREE.Vector3;
  to: THREE.Vector3;
  type: 'material' | 'equipment' | 'waste';
  intensity: number; // 0-1, based on progress activity
}

const TransportFlow3D: React.FC<TransportFlow3DProps> = ({
  shapes,
  progress
}) => {
  const flowRef = useRef<THREE.Group>(null);

  // Generate transport routes based on layout
  const transportRoutes = useMemo(() => {
    const routes: TransportRoute[] = [];
    
    // Get different types of zones
    const materialZones = shapes.filter(s => s.type === 'material' || s.type === 'storage');
    const workZones = shapes.filter(s => s.type === 'zone');
    const equipmentShapes = shapes.filter(s => s.type === 'equipment');
    const pathShapes = shapes.filter(s => s.type === 'path');

    // Material to work zones
    materialZones.forEach(materialZone => {
      workZones.forEach(workZone => {
        const distance = Math.sqrt(
          Math.pow(materialZone.x - workZone.x, 2) + 
          Math.pow(materialZone.y - workZone.y, 2)
        );
        
        // Only create routes for nearby zones
        if (distance < 500) {
          const workProgress = progress.find(p => p.zoneShapeId === workZone.id.toString());
          const intensity = workProgress ? workProgress.completionPercentage / 100 : 0.3;
          
          routes.push({
            from: new THREE.Vector3(materialZone.x / 10, 0.5, materialZone.y / 10),
            to: new THREE.Vector3(workZone.x / 10, 0.5, workZone.y / 10),
            type: 'material',
            intensity
          });
        }
      });
    });

    // Equipment to work zones
    equipmentShapes.forEach(equipment => {
      workZones.forEach(workZone => {
        const distance = Math.sqrt(
          Math.pow(equipment.x - workZone.x, 2) + 
          Math.pow(equipment.y - workZone.y, 2)
        );
        
        if (distance < 300) {
          const workProgress = progress.find(p => p.zoneShapeId === workZone.id.toString());
          const intensity = workProgress && workProgress.status === 'in_progress' ? 0.8 : 0.2;
          
          routes.push({
            from: new THREE.Vector3(equipment.x / 10, 1, equipment.y / 10),
            to: new THREE.Vector3(workZone.x / 10, 1, workZone.y / 10),
            type: 'equipment',
            intensity
          });
        }
      });
    });

    return routes;
  }, [shapes, progress]);

  // Animate flow particles
  useFrame((state) => {
    if (flowRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Animate flow indicators
      flowRef.current.children.forEach((child, index) => {
        if (child.userData.isFlowParticle) {
          const route = transportRoutes[Math.floor(index / 3)];
          if (route) {
            const t = (time * route.intensity + index * 0.1) % 1;
            const position = new THREE.Vector3().lerpVectors(route.from, route.to, t);
            child.position.copy(position);
            
            // Hide particle when intensity is very low
            child.visible = route.intensity > 0.1;
          }
        }
      });
    }
  });

  // Get route color based on type
  const getRouteColor = (type: string) => {
    switch (type) {
      case 'material':
        return '#ffa726';
      case 'equipment':
        return '#42a5f5';
      case 'waste':
        return '#ef5350';
      default:
        return '#666666';
    }
  };

  // Create curved path between two points
  const createCurvedPath = (from: THREE.Vector3, to: THREE.Vector3) => {
    const distance = from.distanceTo(to);
    const midPoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    midPoint.y += distance * 0.1; // Add curve height
    
    const curve = new THREE.QuadraticBezierCurve3(from, midPoint, to);
    return curve.getPoints(20);
  };

  return (
    <group ref={flowRef}>
      {/* Render transport routes */}
      {transportRoutes.map((route, index) => {
        const points = createCurvedPath(route.from, route.to);
        const color = getRouteColor(route.type);
        const opacity = Math.max(route.intensity, 0.2);
        
        return (
          <group key={index}>
            {/* Route line */}
            <Line
              points={points}
              color={color}
              lineWidth={2}
              transparent
              opacity={opacity}
            />

            {/* Direction arrow at end */}
            <Cone
              args={[0.3, 1]}
              position={route.to}
              rotation={[0, Math.atan2(route.to.x - route.from.x, route.to.z - route.from.z), 0]}
            >
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </Cone>

            {/* Animated flow particles */}
            {Array.from({ length: 3 }, (_, particleIndex) => (
              <Sphere
                key={`particle-${index}-${particleIndex}`}
                args={[0.2]}
                userData={{ isFlowParticle: true }}
              >
                <meshBasicMaterial 
                  color={color} 
                  transparent 
                  opacity={opacity * 0.8}
                />
              </Sphere>
            ))}

            {/* Flow intensity indicator */}
            {route.intensity > 0.5 && (
              <group position={new THREE.Vector3().addVectors(route.from, route.to).multiplyScalar(0.5)}>
                <Sphere args={[0.5]}>
                  <meshBasicMaterial 
                    color={color} 
                    transparent 
                    opacity={0.3}
                  />
                </Sphere>
              </group>
            )}
          </group>
        );
      })}

      {/* Main transport hubs */}
      {shapes
        .filter(s => s.type === 'storage' || (s.type === 'equipment' && s.iconName === 'DUMP_TRUCK'))
        .map(hub => (
          <group key={`hub-${hub.id}`} position={[hub.x / 10, 0, hub.y / 10]}>
            {/* Hub indicator */}
            <Sphere args={[1]}>
              <meshBasicMaterial 
                color="#ffeb3b" 
                transparent 
                opacity={0.4}
              />
            </Sphere>
            
            {/* Pulsing effect for active hubs */}
            <Sphere args={[1.5]}>
              <meshBasicMaterial 
                color="#ffeb3b" 
                transparent 
                opacity={0.1}
              />
            </Sphere>
          </group>
        ))
      }

      {/* Traffic congestion indicators */}
      {transportRoutes
        .filter(route => route.intensity > 0.7)
        .map((route, index) => {
          const midPoint = new THREE.Vector3().addVectors(route.from, route.to).multiplyScalar(0.5);
          midPoint.y += 2;
          
          return (
            <group key={`congestion-${index}`} position={midPoint}>
              <Sphere args={[0.8]}>
                <meshBasicMaterial 
                  color="#ff5722" 
                  transparent 
                  opacity={0.6}
                />
              </Sphere>
            </group>
          );
        })
      }

      {/* Path efficiency indicators */}
      {shapes
        .filter(s => s.type === 'path')
        .map(path => {
          const connectedRoutes = transportRoutes.filter(route => {
            const pathCenter = new THREE.Vector3(path.x / 10, 0, path.y / 10);
            const routeCenter = new THREE.Vector3().addVectors(route.from, route.to).multiplyScalar(0.5);
            return pathCenter.distanceTo(routeCenter) < 5;
          });
          
          const avgIntensity = connectedRoutes.length > 0 
            ? connectedRoutes.reduce((sum, route) => sum + route.intensity, 0) / connectedRoutes.length
            : 0;
          
          const efficiencyColor = avgIntensity > 0.7 ? '#f44336' : avgIntensity > 0.4 ? '#ff9800' : '#4caf50';
          
          return (
            <group key={`path-efficiency-${path.id}`} position={[path.x / 10, 0.1, path.y / 10]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[path.width / 10, path.height / 10]} />
                <meshBasicMaterial 
                  color={efficiencyColor} 
                  transparent 
                  opacity={0.3}
                />
              </mesh>
            </group>
          );
        })
      }

      {/* Loading/Unloading zones */}
      {shapes
        .filter(s => s.type === 'material' && s.name?.includes('tập kết'))
        .map(zone => (
          <group key={`loading-${zone.id}`} position={[zone.x / 10, 1, zone.y / 10]}>
            {/* Loading indicator */}
            <Cone args={[1, 2]} rotation={[Math.PI, 0, 0]}>
              <meshBasicMaterial 
                color="#2196f3" 
                transparent 
                opacity={0.7}
              />
            </Cone>
          </group>
        ))
      }
    </group>
  );
};

export default TransportFlow3D;