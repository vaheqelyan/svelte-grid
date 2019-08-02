import { getClosestToRow } from "./item.js";

export function getContainerHeight(items, yPerPx) {
	return Math.max(getClosestToRow(items), 2) * yPerPx;
}
