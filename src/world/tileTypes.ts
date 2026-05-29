import type { Crop } from "./cropTypes";

export type TileType = "grass" | "tilled" | "watered";

export type Tile = {
  x: number;
  y: number;
  type: TileType;
  crop?: Crop;
};
