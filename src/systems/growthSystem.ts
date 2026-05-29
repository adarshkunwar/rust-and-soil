export function updateGrowth(game: any) {
  for (const row of game.map) {
    for (const tile of row) {
      if (!tile.crop) continue;

      tile.crop.growth += 1;

      if (tile.crop.growth >= 30) {
        tile.crop.stage = "growing";
      }

      if (tile.crop.growth >= 60) {
        tile.crop.stage = "ready";
      }
    }
  }
}
