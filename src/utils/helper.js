import { makeMatrixFromItems } from "../utils/matrix.js";
import { findFreeSpaceForItem, resizeItems, moveItem } from "../utils/item.js";
import { getLastItemStats } from "./other.js";

function makeItem(item) {
  return {
    ...item,
    ...{
      drag: { top: null, left: null, dragging: false },
      resize: { width: null, height: null, resizing: false },
      responsive: { valueW: 0 },
      min: {
        ...item.min,
      },
      max: {
        ...item.max,
      },
    },
  };
}

const gridHelp = {
  findSpaceForItem(item, items, cols) {
    let matrix = makeMatrixFromItems(items, getLastItemStats(items), cols);

    let position = findFreeSpaceForItem(matrix, item, items);
    return position;
  },

  appendItem(item, items, cols) {
    return moveItem(item, [...items, ...[item]], cols);
  },

  resizeItems(items, col, rows) {
    return resizeItems(items, col, rows);
  },

  item(obj) {
    return makeItem(obj);
  },
};

export default gridHelp;
