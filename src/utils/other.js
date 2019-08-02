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