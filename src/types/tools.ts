import type { TOOLS } from "../constants/tools.const";

export type ToolType = (typeof TOOLS)[keyof typeof TOOLS];
export type TileType = "weed" | "tilled" | "planted" | "ready";
