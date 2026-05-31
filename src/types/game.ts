import type { Tile } from "../world/tileTypes";
import type { ItemType } from "./items.types";
import type { ToolType } from "./tools";

export type Map = Tile[][];

export type Game = {
  map: Map;
  player: {
    x: number;
    y: number;
    speed: number;
    direction: "up" | "down" | "left" | "right";
    power: number;
  };
  selectedTool: ToolType;
  inventory: Record<ItemType, number>;
};
