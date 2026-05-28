'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── 에라별 라이팅 컬러 (과거=웜앰버, 현재=쿨화이트) ──
const ERA_COLORS = [
  { bg: '#0A0806', ambient: '#3D1F08', point: '#C87840', intensity: 0.6 }, // ~2011
  { bg: '#090B0D', ambient: '#0F1A28', point: '#4090C0', intensity: 0.7 }, // 2010~2001
  { bg: '#0A0A08', ambient: '#1A1A0A', point: '#A09060', intensity: 0.65 }, // 2000~1991
  { bg: '#0C0908', ambient: '#2A1808', point: '#B06030', intensity: 0.55 }, // 1990~1981
  { bg: '#0A0806', ambient: '#301A08', point: '#C07030', intensity: 0.5 },  // 1980~1971
  { bg: '#080808', ambient: '#1A1006', point: '#A06020', intensity: 0.45 }, // 1970~1961
  { bg: '#070605', ambient: '#150E05', point: '#805018', intensity: 0.4 },  // 1960~1951
];

const ERA_LABELS = ['~2011', '2010~01', '2000~91', '1990~81', '1980~71', '1970~61', '1960~51'];

interface OrbProps {
  rotation: number;
  activeEra: number;
}

function OrbMesh({ rotation, activeEra }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const eraColor = ERA_COLORS[activeEra] ?? ERA_COLORS[0];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation * 0.8;
      meshRef.current.rotation.x = Math.sin(rotation * 0.3) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = rotation;
    }
  });

  const pointColor = new THREE.Color(eraColor.point);
  const ambientColor = new THREE.Color(eraColor.ambient);

  return (
    <>
      {/* 환경광 */}
      <ambientLight color={ambientColor} intensity={0.4} />

      {/* 포인트 라이트 (상단 좌측 — 반사 하이라이트) */}
      <pointLight
        color={pointColor}
        intensity={eraColor.intensity * 2}
        position={[-3, 3, 3]}
        distance={12}
      />
      {/* 후면 림 라이트 */}
      <pointLight
        color={pointColor}
        intensity={eraColor.intensity * 0.4}
        position={[4, -1, -3]}
        distance={10}
      />

      {/* 3D Orb */}
      <Sphere ref={meshRef} args={[1.8, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={new THREE.Color(0.06, 0.04, 0.02)}
          roughness={0.35}
          metalness={0.6}
          envMapIntensity={0.8}
        />
      </Sphere>

      {/* 글로우 후광 */}
      <Sphere args={[2.05, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={pointColor}
          transparent
          opacity={0.04}
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* 연도 링 텍스트 */}
      <group ref={ringRef}>
        {ERA_LABELS.map((label, i) => {
          const angle = (i / ERA_LABELS.length) * Math.PI * 2 - Math.PI / 2;
          const rx = Math.cos(angle) * 3.2;
          const rz = Math.sin(angle) * 3.2;
          const isActive = i === activeEra;
          return (
            <Text
              key={label}
              position={[rx, 0, rz]}
              rotation={[0, -angle + Math.PI / 2, 0]}
              fontSize={isActive ? 0.22 : 0.14}
              color={isActive ? eraColor.point : 'rgba(255,255,255,0.2)'}
              font="/fonts/NotoSansKR-Regular.woff"
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          );
        })}
      </group>

      {/* 궤도 링 */}
      <mesh rotation={[Math.PI / 2 + 0.15, 0, 0]}>
        <torusGeometry args={[3.2, 0.005, 4, 120]} />
        <meshBasicMaterial color={eraColor.point} transparent opacity={0.15} />
      </mesh>
    </>
  );
}

interface OrbSceneProps {
  rotation: number;
  activeEra: number;
}

export default function OrbScene({ rotation, activeEra }: OrbSceneProps) {
  const eraColor = ERA_COLORS[activeEra] ?? ERA_COLORS[0];

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={[eraColor.bg]} />
      <OrbMesh rotation={rotation} activeEra={activeEra} />
    </Canvas>
  );
}
