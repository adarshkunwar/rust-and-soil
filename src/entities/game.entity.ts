import { TOOLS } from "../constants/tools.const";
import type { Game } from "../types/game";
import { createMap } from "../world/map";

export const game: Game = {
  map: createMap(),
  player: {
    x: 5,
    y: 5,
    speed: 0.1,
    direction: "up",
    power: 60,
  },
  selectedTool: TOOLS.hoe,
  inventory: {
    wheat: 2,
    "wheat seed": 10,
  },
};
