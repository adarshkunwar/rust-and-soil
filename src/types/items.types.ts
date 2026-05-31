export type EntityType = "seed" | "crop";

export type SeedType = "wheat seed";
export type CropType = "wheat";
export type ItemType = SeedType | CropType;

export interface BaseItem {
  id: string;
  name: ItemType;
  type: EntityType;
  buyPrice: number;
  sellPrice: number;
}

export interface SeedItem extends BaseItem {
  type: "seed";
  growTime: number;
  produces: string;
}

export interface CropItem extends BaseItem {
  type: "crop";
}
