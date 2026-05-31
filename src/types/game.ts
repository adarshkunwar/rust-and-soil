import type { Tile } from "../world/tileTypes";
import type { ToolType } from "./tools";

export type Map = Tile[][];

export type Game = {
  map: Map;
  player: {
    x: number;
    y: number;
    speed: number;
    direction: "up" | "down" | "left" | "right";
  };
  selectedTool: ToolType;
};
