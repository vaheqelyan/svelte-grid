export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function getCordinates(event, clientY = false) {
  const { touches: ev = event } = event;

  const isTouch = ev.constructor === TouchList;
  let pageX = isTouch ? ev[0].pageX : ev.pageX;
  let pageY = isTouch ? ev[0].pageY : ev.pageY;

  if (clientY) {
    let clientY = isTouch ? ev[0].clientY : ev.clientY;
    return { pageY, pageX, clientY };
  }
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
