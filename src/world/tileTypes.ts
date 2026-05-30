import type { TileType } from "../types/tools";
import type { Crop } from "./cropTypes";

export type Tile = {
  x: number;
  y: number;
  type: TileType;
  crop?: Crop;
};
