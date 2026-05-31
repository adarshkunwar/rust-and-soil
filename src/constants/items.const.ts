import type { CropItem, SeedItem } from "../types/items.types";

export const SEEDS: SeedItem[] = [
  {
    id: "wheat_seed",
    name: "wheat seed",
    type: "seed",
    buyPrice: 8,
    sellPrice: 0,
    growTime: 15,
    produces: "potato",
  },
];

export const CROPS: CropItem[] = [
  {
    id: "wheat",
    name: "wheat",
    type: "crop",
    buyPrice: 0,
    sellPrice: 14,
  },
];

export const ITEMS = {
  seeds: SEEDS,
  crops: CROPS,
};
