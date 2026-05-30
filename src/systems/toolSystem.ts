import type { Game } from "../types/game";
import type { ToolType } from "../types/tools";
import type { Tile } from "../world/tileTypes";

export function applyTool(game: Game) {
  let tile: Tile = game.map[game.player.y]?.[game.player.x];
  if (!tile) return;

  const tool: ToolType = game.selectedTool;

  console.log("TOOL:", tool, tile);

  // HOE → till ground
  if (tool === "hoe") {
    if (tile.type === "weed") {
      tile.type = "tilled";
    }
    return;
  }

  // SEED → plant crop
  if (tool === "seed") {
    if (tile.type === "tilled" && !tile.crop) {
      tile.type = "planted";
      tile.crop = {
        type: "carrot",
        stage: "seed",
        growth: 0,
      };
    }
    return;
  }

  // HAND → harvest
  if (tool === "hand") {
    if (tile.type === "ready") {
      tile.crop = undefined;
      tile.type = "weed";
    }
    return;
  }
}
