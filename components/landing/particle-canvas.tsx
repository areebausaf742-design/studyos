"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type ParticleCanvasProps = {
  count?: number;
  progress: number;
};

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  attribute float aSize;
  attribute vec3 aTarget;
  varying float vDepth;

  void main() {
    vec3 position = mix(position, aTarget, uProgress);
    float drift = sin(uTime * 0.18 + position.y * 0.05) * 0.018;
    position.x += drift + uPointer.x * 0.06;
    position.y += cos(uTime * 0.15 + position.x * 0.04) * 0.018 + uPointer.y * 0.04;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (95.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vDepth = clamp(1.0 - (-mvPosition.z / 12.0), 0.0, 1.0);
  }
`;

const fragmentShader = `
  varying float vDepth;
  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float circle = 1.0 - smoothstep(0.35, 0.5, length(centered));
    vec3 blue = vec3(0.45, 0.66, 0.95);
    vec3 violet = vec3(0.74, 0.65, 1.0);
    vec3 warm = vec3(0.95, 0.64, 0.46);
    vec3 color = mix(blue, violet, vDepth);
    color = mix(color, warm, smoothstep(0.92, 1.0, vDepth) * 0.18);
    gl_FragColor = vec4(color, circle * 0.78);
  }
`;

function createParticles(count: number) {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const i = index * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 5.4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.66;
    const z = (Math.random() - 0.5) * 1.8;
    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;

    const ringAngle = Math.random() * Math.PI * 2;
    const ringRadius = 2.4 + (Math.random() - 0.5) * 0.42;
    targets[i] = Math.cos(ringAngle) * ringRadius;
    targets[i + 1] = Math.sin(ringAngle) * ringRadius;
    targets[i + 2] = (Math.random() - 0.5) * 0.5;
    sizes[index] = 0.035 + Math.random() * 0.045;
  }

  return { positions, targets, sizes };
}

export default function ParticleCanvas({ count = 6000, progress }: ParticleCanvasProps) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();
  const data = useMemo(() => createParticles(count), [count]);

  useFrame((state) => {
    if (!material.current || !points.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uProgress.value = progress;
    material.current.uniforms.uPointer.value.lerp(pointer, 0.045);
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
    points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.035;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[data.targets, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: progress },
          uPointer: { value: new THREE.Vector2() },
        }}
      />
    </points>
  );
}
