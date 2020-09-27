import { makeMatrix, makeMatrixFromItemsIgnore, findCloseBlocks, findItemsById, makeMatrixFromItems } from "./matrix.js";
import { getRowsCount } from "./other.js";

export function filterStatics(items) {
  return items.filter(value => !value.static);
}

export function responsiveItems(items, cols) {
  return items.map(val => {
    const breakpoint = val.breakpoints[cols];
    if (breakpoint) {
      return { ...val, ...breakpoint };
    }
    return val;
  });
}

export function getItemById(id, items) {
  const index = items.findIndex(value => value.id === id);

  return {
    index,
    item: items[index],
  };
}

export function findFreeSpaceForItem(matrix, item, items = []) {
  const cols = matrix[0].length;
  const w = Math.min(cols, item.w);
  let xNtime = cols - w;

  for (var i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (var j = 0; j < xNtime + 1; j++) {
      const sliceA = row.slice(j, j + w);
      const empty = sliceA.every(val => val === undefined);
      if (empty) {
        const isEmpty = matrix.slice(i, i + item.h).every(a => a.slice(j, j + w).every(n => n === undefined));

        if (isEmpty) {
          return { y: i, x: j };
        }
      }
    }
  }

  return {
    y: getRowsCount(items),
    x: 0,
  };
}

function assignPosition(item, position, value) {
  return value.id === item.id ? { ...item, ...position } : value;
}

const replaceItem = (item, cachedItem, value) => (value.id === item.id ? cachedItem : value);

export function moveItem($item, items, cols, originalItem) {
  let matrix = makeMatrixFromItemsIgnore(items, [$item.id], getRowsCount(items), cols);

  const closeBlocks = findCloseBlocks(items, matrix, $item);
  let closeObj = findItemsById(closeBlocks, items);

  const fixed = closeObj.find(value => value.fixed);

  if (fixed) {
    if (originalItem) {
      return items.map(replaceItem.bind(null, $item, originalItem));
    }
  }

  matrix = makeMatrixFromItemsIgnore(items, closeBlocks, getRowsCount(items), cols);

  let tempItems = items;

  let tempCloseBlocks = closeBlocks;

  let exclude = [];

  closeObj.forEach(item => {
    let position = findFreeSpaceForItem(matrix, item, tempItems);
    exclude.push(item.id);

    if (position) {
      tempItems = tempItems.map(assignPosition.bind(null, item, position));
      let getIgnoreItems = tempCloseBlocks.filter(value => exclude.indexOf(value) === -1);

      matrix = makeMatrixFromItemsIgnore(tempItems, getIgnoreItems, getRowsCount(tempItems), cols);
    }
  });

  return tempItems;
}

export function normalize(items, col) {
  let result = items.slice();

  result.forEach(value => {
    if (!value.static) {
      result = moveItem(value, result, col, { ...value });
    }
  });

  return result;
}

export function adjust(items, col) {
  let matrix = makeMatrix(getRowsCount(items), col);

  let res = [];

  items.forEach(item => {
    let position = findFreeSpaceForItem(matrix, item, items);

    res.push({ ...item, ...position });

    matrix = makeMatrixFromItems(res, getRowsCount(res), col);
  });

  return res;
}
