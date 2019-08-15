export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function getTranslate(str) {
  str = str.slice(10, -3);

  var getIndex = str.indexOf("px, ");

  var x = +str.slice(0, getIndex);

  var y = +str.slice(getIndex + 4);
  return { x, y };
}

export function getCordinates(event) {
  const pageX = event.changedTouches ? event.changedTouches[0].pageX : event.pageX;
  const pageY = event.changedTouches ? event.changedTouches[0].pageY : event.pageY;
  return { pageX, pageY };
}

export function getRowsCount(items) {
  return Math.max(...items.map(val => val.y + val.h), 1);
}

export const getColumnFromBreakpoints = (breakpoints, windowWidth, cols, initCols) => {
  var found = false,
    tempCols = cols;
  if (breakpoints) {
    for (var i = breakpoints.length - 1; i >= 0; i--) {
      const [resolution, cols] = breakpoints[i];

      if (windowWidth <= resolution) {
        found = true;
        tempCols = cols;
        break;
      }
    }
  }

  if (!found) {
    tempCols = initCols;
  }

  return tempCols;
};
