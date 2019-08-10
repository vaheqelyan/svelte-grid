import { getRowsCount } from "./other.js";

export function getContainerHeight(items, yPerPx) {
  return Math.max(getRowsCount(items), 2) * yPerPx;
}
