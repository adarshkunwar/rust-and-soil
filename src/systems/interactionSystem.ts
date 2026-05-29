export function handleInteraction(game: any, key: string) {
  const tile = game.map[game.player.y]?.[game.player.x];

  if (!tile) return;

  if (key !== "e") return;

  if (tile.type === "grass") {
    tile.type = "tilled";
    return;
  }

  if (tile.type === "tilled" && !tile.crop) {
    tile.crop = {
      type: "carrot",
      stage: "seed",
      growth: 0,
    };

    return;
  }

  if (tile.crop) {
    tile.crop.growth = 100;
    tile.crop.stage = "ready";
  }
}
