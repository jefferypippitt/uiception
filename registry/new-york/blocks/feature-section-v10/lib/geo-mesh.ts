import type { FeatureIconId } from "./features"

export type Vec3 = readonly [number, number, number]

export type GeoMesh = {
  vertices: readonly Vec3[]
  edges: readonly (readonly [number, number])[]
}

export type ProjectedPoint = {
  x: number
  y: number
  z: number
  index: number
}

const VIEW_CX = 240
const VIEW_CY = 180
const VIEW_SCALE = 1.48

/** Shared lattice — identical topology lets vertices morph between shapes. */
export const MESH_RINGS = 15
export const MESH_SEGMENTS = 18

export function projectVertices(
  vertices: readonly Vec3[],
  rotateY = 0
): ProjectedPoint[] {
  const cos = Math.cos(rotateY)
  const sin = Math.sin(rotateY)

  return vertices.map((vertex, index) => {
    const [x, y, z] = vertex
    const rx = x * cos - z * sin
    const rz = x * sin + z * cos
    const depth = 1 + rz * 0.0028
    const tilt = y * 0.08

    return {
      x: VIEW_CX + (rx / depth) * VIEW_SCALE,
      y: VIEW_CY + ((y + tilt) / depth) * VIEW_SCALE,
      z: rz,
      index,
    }
  })
}

/** Same projection as {@link projectVertices}, writing into `out` in place to avoid per-frame allocation. */
export function projectVerticesInto(
  vertices: readonly Vec3[],
  rotateY: number,
  out: ProjectedPoint[]
): ProjectedPoint[] {
  const cos = Math.cos(rotateY)
  const sin = Math.sin(rotateY)

  for (let index = 0; index < vertices.length; index++) {
    const [x, y, z] = vertices[index]!
    const rx = x * cos - z * sin
    const rz = x * sin + z * cos
    const depth = 1 + rz * 0.0028
    const tilt = y * 0.08

    const point = out[index]
    if (point) {
      point.x = VIEW_CX + (rx / depth) * VIEW_SCALE
      point.y = VIEW_CY + ((y + tilt) / depth) * VIEW_SCALE
      point.z = rz
      point.index = index
    } else {
      out[index] = {
        x: VIEW_CX + (rx / depth) * VIEW_SCALE,
        y: VIEW_CY + ((y + tilt) / depth) * VIEW_SCALE,
        z: rz,
        index,
      }
    }
  }

  out.length = vertices.length
  return out
}

function gridEdges(ringCount: number, segmentCount: number): (readonly [number, number])[] {
  const edges: (readonly [number, number])[] = []
  const indexAt = (ring: number, segment: number) =>
    ring * segmentCount + (((segment % segmentCount) + segmentCount) % segmentCount)

  for (let ring = 0; ring < ringCount; ring++) {
    for (let segment = 0; segment < segmentCount; segment++) {
      edges.push([indexAt(ring, segment), indexAt(ring, segment + 1)])
      edges.push([indexAt(ring, segment), indexAt(ring + 1, segment)])
    }
  }

  return edges
}

type ShapeSample = {
  ring: number
  segment: number
  tRing: number
  tSeg: number
  angle: number
}

function sampleGrid(ring: number, segment: number): ShapeSample {
  return {
    ring,
    segment,
    tRing: ring / MESH_RINGS,
    tSeg: segment / MESH_SEGMENTS,
    angle: (segment / MESH_SEGMENTS) * Math.PI * 2,
  }
}

/** Wireframe sphere — security / trust boundary. */
function sphereVertex({ tRing, angle }: ShapeSample): Vec3 {
  const phi = tRing * Math.PI
  const radius = 88
  const y = Math.cos(phi) * radius
  const ringRadius = Math.sin(phi) * radius

  return [
    Math.cos(angle) * ringRadius,
    y,
    Math.sin(angle) * ringRadius,
  ]
}

/**
 * Soft cube (superellipsoid) — one shared workspace / source of truth.
 * Same spherical parameterization as the secure sphere, then L^p-normalized
 * toward a cube so morphs stay continuous.
 */
function cubeVertex({ tRing, angle }: ShapeSample): Vec3 {
  const phi = tRing * Math.PI
  const sx = Math.sin(phi) * Math.cos(angle)
  const sy = Math.cos(phi)
  const sz = Math.sin(phi) * Math.sin(angle)
  const p = 5
  const norm = Math.pow(
    Math.abs(sx) ** p + Math.abs(sy) ** p + Math.abs(sz) ** p,
    1 / p
  )
  const radius = 88
  const scale = norm > 0 ? radius / norm : radius

  return [sx * scale, sy * scale, sz * scale]
}

/**
 * Dual helix — two parallel lanes that wind together without colliding.
 * A peanut cross-section twists up the Y axis so both strands stay one
 * continuous lattice (no hard strand picks that break morphs).
 */
function helixVertex({ tRing, angle }: ShapeSample): Vec3 {
  const turns = 2.1
  const twist = tRing * Math.PI * 2 * turns
  const height = (tRing - 0.5) * 172

  const sharpness = 3.2
  const lobe = Math.tanh(sharpness * Math.cos(angle))
  const separation = 30
  const baseRadius = 15
  const pinch = 0.58
  const localRadius = baseRadius * (1 - pinch * (1 - lobe * lobe))

  const localX = lobe * separation + Math.cos(angle) * localRadius
  const localZ = Math.sin(angle) * localRadius * 0.72

  const cos = Math.cos(twist)
  const sin = Math.sin(twist)

  return [
    localX * cos - localZ * sin,
    height,
    localX * sin + localZ * cos,
  ]
}

/** Torus lattice — signals / notifications. */
function torusVertex({ tRing, angle }: ShapeSample): Vec3 {
  const majorRadius = 72
  const minorRadius = 26
  const majorAngle = tRing * Math.PI * 2
  const cx = Math.cos(majorAngle) * majorRadius
  const cz = Math.sin(majorAngle) * majorRadius
  const nx = Math.cos(majorAngle) * Math.cos(angle)
  const ny = Math.sin(angle)
  const nz = Math.sin(majorAngle) * Math.cos(angle)

  return [
    cx + nx * minorRadius,
    ny * minorRadius,
    cz + nz * minorRadius,
  ]
}

const shapeBuilders: Record<FeatureIconId, (sample: ShapeSample) => Vec3> = {
  flow: cubeVertex,
  branch: helixVertex,
  signal: torusVertex,
  secure: sphereVertex,
}

function buildShapeVertices(icon: FeatureIconId): Vec3[] {
  const build = shapeBuilders[icon]
  const vertices: Vec3[] = []

  for (let ring = 0; ring <= MESH_RINGS; ring++) {
    for (let segment = 0; segment < MESH_SEGMENTS; segment++) {
      vertices.push(build(sampleGrid(ring, segment)))
    }
  }

  return vertices
}

function centerVertices3D(vertices: readonly Vec3[]): Vec3[] {
  let ox = 0
  let oy = 0
  let oz = 0

  for (const [x, y, z] of vertices) {
    ox += x
    oy += y
    oz += z
  }

  const count = vertices.length
  ox /= count
  oy /= count
  oz /= count

  return vertices.map(([x, y, z]) => [x - ox, y - oy, z - oz] as const)
}

function getProjectedMaxDim(vertices: readonly Vec3[]): number {
  const projected = projectVertices(vertices, 0)
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const point of projected) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }

  return Math.max(maxX - minX, maxY - minY)
}

/** Scale every shape to match the secure sphere footprint in the panel. */
function matchShapeToReference(vertices: readonly Vec3[], referenceMaxDim: number): Vec3[] {
  const centered = centerVertices3D(vertices)
  const maxDim = getProjectedMaxDim(centered)
  const scale = maxDim > 0 ? referenceMaxDim / maxDim : 1

  return centered.map(([x, y, z]) => [x * scale, y * scale, z * scale] as const)
}

function buildNormalizedShapeCache(): Record<FeatureIconId, readonly Vec3[]> {
  const referenceVertices = centerVertices3D(buildShapeVertices("secure"))
  const referenceMaxDim = getProjectedMaxDim(referenceVertices)

  return {
    flow: matchShapeToReference(buildShapeVertices("flow"), referenceMaxDim),
    branch: matchShapeToReference(buildShapeVertices("branch"), referenceMaxDim),
    signal: matchShapeToReference(buildShapeVertices("signal"), referenceMaxDim),
    secure: referenceVertices,
  }
}

const normalizedShapeCache = buildNormalizedShapeCache()

export function getShapeVertices(icon: FeatureIconId): readonly Vec3[] {
  return normalizedShapeCache[icon]
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

/** In-place lerp — avoids allocating a new tuple every GSAP tick. */
export function lerpVec3Into(out: Vec3, a: Vec3, b: Vec3, t: number): void {
  ;(out as [number, number, number])[0] = a[0] + (b[0] - a[0]) * t
  ;(out as [number, number, number])[1] = a[1] + (b[1] - a[1]) * t
  ;(out as [number, number, number])[2] = a[2] + (b[2] - a[2]) * t
}

const unifiedEdges = gridEdges(MESH_RINGS, MESH_SEGMENTS)

export const unifiedMesh: GeoMesh = {
  vertices: normalizedShapeCache.secure,
  edges: unifiedEdges,
}

/** @deprecated Use getShapeVertices + unifiedMesh.edges */
export const geoMeshes = {
  flow: { vertices: normalizedShapeCache.flow, edges: unifiedEdges },
  branch: { vertices: normalizedShapeCache.branch, edges: unifiedEdges },
  signal: { vertices: normalizedShapeCache.signal, edges: unifiedEdges },
  secure: { vertices: normalizedShapeCache.secure, edges: unifiedEdges },
} as const
