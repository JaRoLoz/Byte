export type Coords2 = { x: number; y: number };
export type Coords3 = { x: number; y: number; z: number };
export type Coords4 = { x: number; y: number; z: number; w: number };

export const parseVector2 = (coords: Coords2): Vector2 => vector2(coords.x, coords.y);
export const parseVector3 = (coords: Coords3): Vector3 => vector3(coords.x, coords.y, coords.z);
export const parseVector4 = (coords: Coords4): Vector4 => vector4(coords.x, coords.y, coords.z, coords.w);
