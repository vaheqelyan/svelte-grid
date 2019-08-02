import { makeMatrix, makeMatrixFromItemsIgnore, findCloseBlocks,findItemsById } from "./matrix.js";

export function filterStatics(items) {
  return items.filter(value => !value.static);
}

export function adjustItem(matrix, item, items = [], cols) {
  const { w: width } = item;

  let valueW = item.responsive.valueW;
  for (var i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (var j = 0; j < row.length; j++) {
      const empty = row.findIndex(val => val === undefined); // super dirty to check (empty for undefined)
      if (empty !== -1) {
        var z = row.slice(empty);
        var n = z.length;
        for (var x = 0; x < z.length; x++) {
          if (z[x] !== undefined) {
            n = x;
            break;
          }
        } // super dirty to check (empty for undefined)

        valueW = Math.max(width - n, 0);

        return {
          y: i,
          x: empty,
          responsive: { valueW },
        };
      }
    }
  }

  valueW = Math.max(width - cols, 0);
  return {
    y: getLastItemStats(items),
    x: 0,
    responsive: { valueW },
  };
}


export function resizeItems(items, col, rows = getLastItemStats(items)) {
  let matrix = makeMatrix(rows, col);
  items.forEach((item, index) => {
    let ignore = items.slice(index + 1).map(val => val.id);
    let position = adjustItem(matrix, item, items, col);

    items = items.map(value => (value.id === item.id ? { ...item, ...position } : value));

    matrix = makeMatrixFromItemsIgnore(items, ignore, getLastItemStats(items), col);
  });

  return items;
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
  let xNtime = cols - (item.w - item.responsive.valueW);

  for (var i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (var j = 0; j < xNtime + 1; j++) {
      const sliceA = row.slice(j, j + (item.w - item.responsive.valueW));
      const empty = sliceA.every(val => val === undefined);
      if (empty) {
        const isEmpty = matrix.slice(i, i + item.h).every(a => a.slice(j, j + (item.w - item.responsive.valueW)).every(n => n === undefined));

        if (isEmpty) {
          return { y: i, x: j };
        }
      }
    }
  }

  return {
    y: getLastItemStats(items),
    x: 0,
  };
}

function assignPosition(item,position,value) {
  return value.id ===item.id ? {...item,...position} : value
}



export function moveItem($item, items, cols, originalPosition) {
 let matrix = makeMatrixFromItemsIgnore(items, [$item.id], getLastItemStats(items), cols)

 const closeBlocks = findCloseBlocks(items, matrix, $item)
 let closeObj = findItemsById(closeBlocks, items);

 const statics = closeObj.find(value => value.static);

 if(statics) {
  let position;
  
  if(originalPosition) {
    position = originalPosition
  } else {
         let matrix = makeMatrixFromItemsIgnore(items, [$item.id], getLastItemStats(items), cols)
          position = findFreeSpaceForItem(matrix,$item,items)
  }

    return items.map(assignPosition.bind(null, $item, position));

  
 }

 matrix = makeMatrixFromItemsIgnore(items, closeBlocks, getLastItemStats(items), cols);

  let tempItems = items;

  let tempCloseBlocks = closeBlocks; 

  let exclude = [];

  closeObj.forEach(item=> {
    let position = findFreeSpaceForItem(matrix, item, tempItems);

    exclude.push(item.id);

    if (position) {
      tempItems = tempItems.map(assignPosition.bind(null, item, position))
      let getIgnoreItems = tempCloseBlocks.filter(value => exclude.indexOf(value) === -1);

      matrix = makeMatrixFromItemsIgnore(tempItems, getIgnoreItems, getLastItemStats(items), cols);
    }

  })

  return tempItems
}