import { getRowsCount } from "./other.js";

export function getContainerHeight(items, yPerPx) {
  return getRowsCount(items) * yPerPx;
}
