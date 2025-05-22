/// <reference types="vite/client" />

/// <reference types="vite/client" />
/// <reference types="three" />

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

// Three.js global types
declare global {
  namespace THREE {
    interface Vector3 {
      x: number;
      y: number;
      z: number;
    }
    
    interface Quaternion {
      x: number;
      y: number;
      z: number;
      w: number;
    }
  }
}

// React Three Fiber types
declare module '@react-three/fiber' {
  interface ThreeElements {
    // Geometries
    boxGeometry: ReactThreeFiber.Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
    sphereGeometry: ReactThreeFiber.Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    cylinderGeometry: ReactThreeFiber.Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
    coneGeometry: ReactThreeFiber.Object3DNode<THREE.ConeGeometry, typeof THREE.ConeGeometry>;
    planeGeometry: ReactThreeFiber.Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
    ringGeometry: ReactThreeFiber.Object3DNode<THREE.RingGeometry, typeof THREE.RingGeometry>;
    
    // Materials
    meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, [THREE.MeshStandardMaterialParameters?]>;
    meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, [THREE.MeshBasicMaterialParameters?]>;
    meshLambertMaterial: ReactThreeFiber.MaterialNode<THREE.MeshLambertMaterial, [THREE.MeshLambertMaterialParameters?]>;
    
    // Objects
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
    
    // Lights
    ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: ReactThreeFiber.Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
  }
}