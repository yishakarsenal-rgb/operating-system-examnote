"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Icosahedron, Torus, Octahedron, Dodecahedron } from "@react-three/drei"
import { useTheme } from "next-themes"
import type { Group, Mesh } from "three"

// Accent colors that echo the app's per-section palette
const PALETTE = ["#3b6fd6", "#1fae8a", "#e08a2b", "#9b6bd6", "#e0533b"]

type ShapeKind = "ico" | "torus" | "octa" | "dodeca"

interface ShapeConfig {
  kind: ShapeKind
  position: [number, number, number]
  scale: number
  color: string
  rotationSpeed: number
  floatSpeed: number
  floatIntensity: number
}

function makeShapes(): ShapeConfig[] {
  // Deterministic layout so SSR/CSR match and the scene stays balanced
  const kinds: ShapeKind[] = ["ico", "torus", "octa", "dodeca"]
  const configs: ShapeConfig[] = []
  const count = 16
  for (let i = 0; i < count; i++) {
    const t = i / count
    const angle = t * Math.PI * 2 * 2.2
    const radius = 4 + (i % 4) * 1.3
    configs.push({
      kind: kinds[i % kinds.length],
      position: [
        Math.cos(angle) * radius,
        Math.sin(angle * 0.8) * 3.2 + (i % 2 === 0 ? 0.6 : -0.6),
        -1.5 - (i % 4) * 1.4,
      ],
      scale: 0.75 + ((i * 7) % 5) * 0.22,
      color: PALETTE[i % PALETTE.length],
      rotationSpeed: 0.08 + ((i % 3) + 1) * 0.05,
      floatSpeed: 1 + (i % 3) * 0.4,
      floatIntensity: 0.8 + (i % 3) * 0.5,
    })
  }
  return configs
}

function Shape({ config, isDark }: { config: ShapeConfig; isDark: boolean }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * config.rotationSpeed
    meshRef.current.rotation.y += delta * config.rotationSpeed * 0.7
  })

  const material = (
    <meshStandardMaterial
      color={config.color}
      emissive={config.color}
      emissiveIntensity={isDark ? 0.45 : 0.2}
      roughness={0.3}
      metalness={0.2}
      transparent
      opacity={isDark ? 0.92 : 0.82}
      flatShading
    />
  )

  return (
    <Float
      speed={config.floatSpeed}
      rotationIntensity={0.6}
      floatIntensity={config.floatIntensity}
    >
      <group position={config.position} scale={config.scale}>
        {config.kind === "ico" && (
          <Icosahedron ref={meshRef} args={[1, 0]}>
            {material}
          </Icosahedron>
        )}
        {config.kind === "torus" && (
          <Torus ref={meshRef} args={[0.7, 0.28, 16, 32]}>
            {material}
          </Torus>
        )}
        {config.kind === "octa" && (
          <Octahedron ref={meshRef} args={[1, 0]}>
            {material}
          </Octahedron>
        )}
        {config.kind === "dodeca" && (
          <Dodecahedron ref={meshRef} args={[1, 0]}>
            {material}
          </Dodecahedron>
        )}
      </group>
    </Float>
  )
}

function Scene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<Group>(null)
  const shapes = useMemo(() => makeShapes(), [])

  // Gentle parallax drift of the whole field
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15
    groupRef.current.rotation.x = Math.cos(t * 0.04) * 0.08
  })

  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.8} />
      <directionalLight position={[5, 6, 4]} intensity={isDark ? 1 : 1.3} />
      <directionalLight
        position={[-6, -3, 2]}
        intensity={isDark ? 0.5 : 0.6}
        color={isDark ? "#6b8cff" : "#9ec5ff"}
      />
      <group ref={groupRef}>
        {shapes.map((config, i) => (
          <Shape key={i} config={config} isDark={isDark} />
        ))}
      </group>
    </>
  )
}

export function Background3D() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene isDark={isDark} />
      </Canvas>
      {/* Soft overlay to keep foreground text readable */}
      <div className="absolute inset-0 bg-background/25" />
    </div>
  )
}
