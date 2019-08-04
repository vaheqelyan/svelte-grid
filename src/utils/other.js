export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function getLastItemStats(items) {
  return Math.max(...items.map(val => val.y + val.h), 1);
}

export const getColumnFromBreakpoints = (breakpoints,windowWidth, cols, initCols) => {
      var found=false,tempCols=cols;
    if(breakpoints) {

      for (var i = breakpoints.length - 1; i >= 0; i--) {
      const [resolution, cols] = breakpoints[i]

      if(windowWidth <= resolution) {
        found = true
        tempCols=cols
        break;
      }
    }
  }

    if(!found) { tempCols=initCols }

      return tempCols

}