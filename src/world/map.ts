import { type Tile } from "./tileTypes";

export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 15;

export const createMap = (): Tile[][] => {
  const map: Tile[][] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === MAP_WIDTH - 1) {
        row.push({
          x,
          y,
          type: "water",
          crop: undefined,
        });
      } else {
        row.push({
          x,
          y,
          type: "weed",
          crop: undefined,
        });
      }
    }
    map.push(row);
  }

  return map;
};
