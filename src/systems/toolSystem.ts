import type { ToolType } from "../types/tools";

export function applyTool(game: any) {
  const tile = game.map[game.player.y]?.[game.player.x];
  if (!tile) return;

  const tool: ToolType = game.selectedTool;

  console.log("TOOL:", tool, tile);

  // HOE → till ground
  if (tool === "hoe") {
    if (tile.type === "grass") {
      tile.type = "tilled";
    }
    return;
  }

  // SEED → plant crop
  if (tool === "seed") {
    if (tile.type === "tilled" && !tile.crop) {
      tile.crop = {
        type: "carrot",
        stage: "seed",
        growth: 0,
      };
    }
    return;
  }

  // WATER → speed up growth
  if (tool === "water") {
    if (tile.crop) {
      tile.crop.growth += 10;
    }
    return;
  }

  // HAND → harvest
  if (tool === "hand") {
    if (tile.crop && tile.crop.stage === "ready") {
      tile.crop = undefined;
    }
    return;
  }
}
