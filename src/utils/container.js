import { getLastItemStats } from "./other.js";

export function getContainerHeight(items, yPerPx) {
  return Math.max(getLastItemStats(items), 2) * yPerPx;
}
