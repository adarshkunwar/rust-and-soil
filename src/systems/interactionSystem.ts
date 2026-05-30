import type { Game } from "../types/game";
import type { Tile } from "../world/tileTypes";

export function handleInteraction(game: Game, key: string) {
  const tile: Tile = game.map[game.player.y]?.[game.player.x];
  const { selectedTool: tool } = game;

  if (!tile) return;

  if (key !== "e") return;

  if (tile.type === "weed" && tool === "hoe") {
    tile.type = "tilled";
    return;
  }

  if (tile.type === "tilled" && !tile.crop && tool === "seed") {
    tile.type = "planted";
    tile.crop = {
      type: "carrot",
      stage: "seed",
      growth: 0,
    };
    return;
  }

  if (tile.crop && tool === "hand") {
    tile.crop.growth = 100;
    tile.crop.stage = "ready";
  }
}
