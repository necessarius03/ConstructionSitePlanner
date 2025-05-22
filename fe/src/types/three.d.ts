// fe/src/types/three.d.ts
declare module 'three' {
  export * from 'three/build/three.module.js';
}

declare module 'three/examples/jsm/*' {
  const content: any;
  export = content;
}

declare module '@react-three/fiber' {
  import { Object3D, Material, Geometry } from 'three';
  import { ReactNode, Ref } from 'react';

  export interface ThreeElements {
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    boxGeometry: Node<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
    sphereGeometry: Node<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    cylinderGeometry: Node<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
    planeGeometry: Node<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
    meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
  }

  export interface Object3DNode<T, P> extends Partial<T> {
    attach?: string;
    ref?: Ref<T>;
    key?: React.Key;
    onUpdate?: (self: T) => void;
    children?: ReactNode;
    onClick?: (event: any) => void;
    onPointerOver?: (event: any) => void;
    onPointerOut?: (event: any) => void;
    onPointerDown?: (event: any) => void;
    onPointerUp?: (event: any) => void;
    onPointerMove?: (event: any) => void;
  }

  export interface Node<T, P> extends Partial<T> {
    attach?: string;
    ref?: Ref<T>;
    key?: React.Key;
    onUpdate?: (self: T) => void;
    args?: ConstructorParameters<P>;
  }

  export interface MaterialNode<T extends Material, P> extends Node<T, P> {
    attach?: string;
  }

  export function Canvas(props: {
    children: ReactNode;
    camera?: any;
    gl?: any;
    shadows?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onCreated?: (state: any) => void;
  }): JSX.Element;

  export function useFrame(callback: (state: any, delta: number) => void, priority?: number): void;
  export function useThree(): any;
  export function useLoader<T>(loader: any, input: any): T;
}

declare module '@react-three/drei' {
  import { ReactNode } from 'react';
  import * as THREE from 'three';

  export function OrbitControls(props?: any): JSX.Element;
  export function Text(props: {
    children?: ReactNode;
    position?: [number, number, number];
    rotation?: [number, number, number];
    color?: string;
    fontSize?: number;
    anchorX?: 'left' | 'center' | 'right';
    anchorY?: 'top' | 'middle' | 'bottom';
  }): JSX.Element;
  
  export function Box(props: {
    args?: [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    children?: ReactNode;
    ref?: any;
    onClick?: (event: any) => void;
    onPointerOver?: (event: any) => void;
    onPointerOut?: (event: any) => void;
  }): JSX.Element;

  export function Cylinder(props: {
    args?: [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    children?: ReactNode;
  }): JSX.Element;

  export function Cone(props: {
    args?: [number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    children?: ReactNode;
  }): JSX.Element;

  export function Sphere(props: {
    args?: [number];
    position?: [number, number, number];
    children?: ReactNode;
    userData?: any;
  }): JSX.Element;

  export function Line(props: {
    points: THREE.Vector3[];
    color?: string;
    lineWidth?: number;
    dashed?: boolean;
    dashScale?: number;
    dashSize?: number;
    gapSize?: number;
    transparent?: boolean;
    opacity?: number;
  }): JSX.Element;

  export function Grid(props: {
    args?: [number, number];
    cellSize?: number;
    cellThickness?: number;
    cellColor?: string;
    sectionSize?: number;
    sectionThickness?: number;
    sectionColor?: string;
    fadeDistance?: number;
    fadeStrength?: number;
  }): JSX.Element;

  export function Sky(props: {
    distance?: number;
    sunPosition?: [number, number, number];
    inclination?: number;
    azimuth?: number;
    turbidity?: number;
    rayleigh?: number;
  }): JSX.Element;

  export function Environment(props?: any): JSX.Element;
  export function PerspectiveCamera(props?: any): JSX.Element;
  export function Group(props: { children?: ReactNode; [key: string]: any }): JSX.Element;
}

// Global THREE namespace
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}