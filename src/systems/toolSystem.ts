import type { Game } from "../types/game";
import type { ToolType } from "../types/tools";
import type { Tile } from "../world/tileTypes";

export function applyTool(game: Game, openShop: () => void) {
  let tile: Tile = game.map[game.player.y]?.[game.player.x];
  if (!tile) return;

  const tool: ToolType = game.selectedTool;

  if (tile.type === "store") openShop();

  if (tool === "hoe") {
    if (tile.type === "weed") {
      tile.type = "tilled";
    }
    return;
  }

  // SEED → plant crop
  if (tool === "seed") {
    if (tile.type === "tilled" && !tile.crop) {
      if (game.inventory["wheat seed"] > 0) {
        tile.type = "planted";
        tile.crop = {
          type: "wheat",
          stage: "seed",
          growth: 0,
        };
        game.inventory["wheat seed"] = game.inventory["wheat seed"] - 1;
      }
    }
    return;
  }

  // HAND → harvest
  if (tool === "hand") {
    if (tile.type === "ready") {
      tile.crop = undefined;
      tile.type = "weed";
      game.inventory["wheat"] = game.inventory["wheat"] + 1;
    }
    return;
  }
}
