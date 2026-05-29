export type CropStage = "seed" | "growing" | "ready";

export type Crop = {
  type: "carrot";
  stage: CropStage;
  growth: number;
};
