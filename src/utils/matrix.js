import { getLastItemStats } from "./other.js";

export const makeMatrix = (rows, cols) => Array.from(Array(rows), () => new Array(cols)); // make 2d array

export function makeMatrixFromItems(items, _row = getLastItemStats(items), _col) {
  let matrix = makeMatrix(_row, _col);
  for (var i = 0; i < items.length; i++) {
    const value = items[i];
    const { x, y, w, h, responsive: { valueW } } = value;

    for (var j = y; j < y + h; j++) {
      const row = matrix[j];
      for (var k = x; k < x + (w - valueW); k++) {
        row[k] = value;
      }
    }
  }
  return matrix;
}

export function findCloseBlocks(items, matrix, curObject) {
  const { w, h, x, y, responsive: { valueW } } = curObject;
  const tempR = matrix.slice(y, y + h);
  let result = []; // new Set()
  for (var i = 0; i < tempR.length; i++) {
    let tempA = tempR[i].slice(x, x + (w - valueW));
    result = [...result, ...tempA.map(val => val && val.id).filter(val => val)];
  }
  return [...result.filter((item, pos) => result.indexOf(item) == pos)];
  // return [...new Set(result)];
}

export function clearIdsFromMatrix(closeBlocks, matrix) {
  let reMap = matrix.map(row => {
    return row.map(cel => {
      if (cel) {
        if (closeBlocks.indexOf(cel.id) !== -1) {
          return null;
        } else {
          return cel;
        }
      }
    });
  });

  return reMap;
}

export function clearItemFromMatrix(item, matrix) {
  return matrix.map(row => {
    return row.map(cel => {
      if (cel) {
        if (cel.id === item.id) {
          return null;
        } else {
          return cel;
        }
      }
    });
  });
}

export function makeMatrixFromItemsIgnore(
  items,
  ignoreList,
  _row, //= getLastItemStats(items)
  _col,
) {
  let matrix = makeMatrix(_row, _col);
  for (var i = 0; i < items.length; i++) {
    const value = items[i];
    const { x, y, w, h, id, responsive: { valueW } } = value;

    if (ignoreList.indexOf(id) === -1) {
      for (var j = y; j < y + h; j++) {
        const row = matrix[j];
        if (row) {
          for (var k = x; k < x + (w - valueW); k++) {
            row[k] = value;
          }
        }
      }
    }
  }
  return matrix;
}

export function findItemsById(closeBlocks, items) {
  return items.filter(value => closeBlocks.indexOf(value.id) !== -1);
}

export function reOrderItemsFromMatrix(matrix) {
  var currentId,
    items = [];
  for (var i = 0; i < matrix.length; i++) {
    var row = matrix[i];
    var len = row.length;
    for (var j = 0; j < len; j++) {
      var column = row[j];
      if (column) {
        var { id, w } = column;
        if (currentId !== id) {
          items.push(column);
          currentId = id;
          len += w;
        }
      }
    }
  }
  return items;
}
