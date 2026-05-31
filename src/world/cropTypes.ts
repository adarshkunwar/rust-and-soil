export type CropStage = "seed" | "growing" | "ready";

export type Crop = {
  type: "wheat";
  stage: CropStage;
  growth: number;
};
