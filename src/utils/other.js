export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function getRowsCount(items, cols) {
  const getItemsMaxHeight = items.map((val) => {
    const item = val[cols];

    return (item && item.y) + (item && item.h) || 0;
  });

  return Math.max(...getItemsMaxHeight, 1);
}

export const getColumn = (containerWidth, columns) => {
  try {
    let [_, cols] = columns
      .slice()
      .reverse()
      .find((value) => {
        const [width, cols] = value;
        return containerWidth <= width;
      });
    return cols;
  } catch {
    return columns[columns.length - 1];
  }
};
