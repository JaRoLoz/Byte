import { IntRange } from "./generic";

export type DuiHandle = string;
export type TextureIndex = number;

export type Pixel = [x: number, y: number];
export type RGBA = [red: IntRange<0, 256>, green: IntRange<0, 256>, blue: IntRange<0, 256>, alpha: IntRange<0, 256>];
export type RGB = [red: IntRange<0, 256>, green: IntRange<0, 256>, blue: IntRange<0, 256>];

export type ImageFilePath = string;
export type Base64Image = string;