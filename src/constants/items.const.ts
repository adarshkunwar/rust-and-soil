import type { CropItem, SeedItem } from "../types/items.types";

export const SEEDS: SeedItem[] = [
  {
    id: "carrot_seed",
    name: "carrot seed",
    type: "seed",
    buyPrice: 5,
    sellPrice: 0,
    growTime: 10,
    produces: "carrot",
  },
  {
    id: "potato_seed",
    name: "potato seed",
    type: "seed",
    buyPrice: 8,
    sellPrice: 0,
    growTime: 15,
    produces: "potato",
  },
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
    id: "carrot",
    name: "carrot",
    type: "crop",
    buyPrice: 0,
    sellPrice: 10,
  },
  {
    id: "potato",
    name: "potato",
    type: "crop",
    buyPrice: 0,
    sellPrice: 14,
  },
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
