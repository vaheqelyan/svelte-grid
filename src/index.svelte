<style>
   .container {
    position: relative;
    background: yellow;
    width: 100%;
  }
  .item {
    touch-action:none;
    word-break: break-all;
    position: absolute;
    background: #ccc;
    border: 1px solid;
    z-index: 1000;
  }

.backShadow {
  background: #f2bfbf;
  position: absolute;
}


  .resizer {
  user-select: none;
 width: 20px;
  height: 20px; 
  /*background: #ccc; */
  position:absolute; 
  right: 0; 
  bottom: 0; 
  cursor: se-resize; 
}

.resizer::after {
      content: "";
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 5px;
    height: 5px;
    border-right: 2px solid rgba(0, 0, 0, 0.4);
    border-bottom: 2px solid rgba(0, 0, 0, 0.4);
}
</style>

<svelte:window on:resize={ debounce(onResize,300) } />

<div class=container bind:this={container} style="height: {ch}px">
  {#each items as item, i (item.id)}

    <div on:mousedown={dragOnMouseDown.bind(this, item.id)}
        on:touchstart={dragOnMouseDown.bind(this, item.id)}
        class=item style="
        width: {item.resize.resizing ? item.resize.width : ((item.w * xPerPx) - gap * 2) - (item.responsive.valueW*xPerPx)}px;
        height: {item.resize.resizing ? item.resize.height : (item.h * yPerPx) - gap * 2}px;
        top: {item.drag.dragging ? item.drag.top : (item.y * yPerPx) + gap}px;
        left: {item.drag.dragging ? item.drag.left : (item.x * xPerPx) + gap}px;
        z-index: {item.drag.dragging || item.resize.resizing ? 1000 : 100};
        opacity: {item.resize.resizing ? 0.5 : 1}
        "
        >

          <slot {item} index={i}></slot>
          <div class="resizer" 
          on:touchstart={resizeOnMouseDown.bind(this,item.id)} 
          on:mousedown={resizeOnMouseDown.bind(this,item.id)}
          ></div>
        </div>


  {/each}

  {#if shadow.active}
    <div class=backShadow style="
    width:{((shadow.w * xPerPx) - gap * 2) - (shadow.responsive.valueW*xPerPx)}px;
    height:{(shadow.h * yPerPx) - gap * 2}px;
    top: {(shadow.y * yPerPx) + gap}px;
    left: {(shadow.x * xPerPx) + gap}px">{shadow.id} {shadow.responsive.valueW}</div>
  {/if}
</div>

<script>
import { onMount, beforeUpdate,createEventDispatcher } from "svelte";

import { resizeItems, getItemById, findFreeSpaceForItem, filterStatics, moveItem } from "./utils/item.js";
import { getContainerHeight } from "./utils/container.js";
import { debounce, getLastItemStats } from "./utils/other.js";
import { makeMatrixFromItems, findCloseBlocks, makeMatrixFromItemsIgnore, clearItemFromMatrix, findItemsById,reOrderItemsFromMatrix } from "./utils/matrix.js";

export let colWidth;
export let items = [];
export let cols = 0;
export let dragDebounceMs = 350;
export let gap = 0;
export let rowHeight;

let rows = getLastItemStats(items);
let container;

let currItemNode;
let bound;
let xPerPx;
let currentItemIndex;

let resizeNoDynamicCalc;

let shadow = {
  w: 0,
  h: 0,
  x: 0,
  y: 0,
  active: false,
  id: null,
  responsive:{valueW:0,valueH:0},
  min:{},
  max:{}
};


const yPerPx = rowHeight;

let currentItemId;
let focuesdItem;
let num;

let containerHeight;

let matrix = makeMatrixFromItems(items, getLastItemStats(items), cols);

  
const dispatch = createEventDispatcher();

function onResize(e) {
  const newBound = container.getBoundingClientRect();
  var nC = Math.round(newBound.width / colWidth)

  dispatch('resize', {
    cols:nC
  });

  bound = newBound

  xPerPx = bound.width / nC;

  items = resizeItems(items, nC);
}
let cacheXperPx;
let ch = getContainerHeight(items, yPerPx);
let docH;
onMount(() => {
  docH = window.innerHeight;
  bound = container.getBoundingClientRect();
  var nC = Math.round(bound.width / colWidth)
  dispatch('resize', {
    cols:nC
  });
  xPerPx = bound.width / nC;
  cacheXperPx=xPerPx
});

// resize

let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;

function resizeOnMouseDown(id, e) {
  e.stopPropagation();

  const { touches: ev = e } = e;
  const isTouch = ev.constructor === TouchList;
  let pageX = isTouch ? ev[0].pageX : ev.pageX;
  let pageY = isTouch ? ev[0].pageY : ev.pageY;

  const { item, index } = getItemById(id, items);

  currentItemIndex = index;

  focuesdItem = item;

  cacheItem = {...item}

  resizeNoDynamicCalc = item.h + item.y === getLastItemStats(items);

  shadow = {...shadow,...focuesdItem,...{active:true}}

  if (item.static) {
    return;
  }

  resizeStartX = pageX - bound.x;
  resizeStartY = pageY - bound.y;

  resizeStartWidth = (item.w * xPerPx) - (gap * 2) - (focuesdItem.responsive.valueW * xPerPx);

  resizeStartHeight = (item.h * yPerPx) - (gap * 2);


  window.addEventListener("mousemove", resizeOnMouseMove, false);
  window.addEventListener("touchmove", resizeOnMouseMove, false);

  window.addEventListener("mouseup", resizeOnMouseUp, false);
  window.addEventListener("touchend", resizeOnMouseUp, false);
}

function resizeOnMouseMove(e) {
  const { touches: ev = e } = e;
  const isTouch = ev.constructor === TouchList;
  let pageX = isTouch ? ev[0].pageX : ev.pageX;
  let pageY = isTouch ? ev[0].pageY : ev.pageY;

  let clientY = isTouch ? ev[0].clientY : ev.clientY;

  pageX = pageX - bound.x;
  pageY = pageY - bound.y;

  if (docH - clientY <= 15) {
    scroll({
      behavior: "smooth",
      top: scrollY + yPerPx
    });
    passCall = true;
  } else {
    passCall = false;
  }

  if (clientY < 0 && scrollY > 0) {
    passCall = true;
    scroll({
      behavior: "smooth",
      top: scrollY - yPerPx
    });
  } else {
    passCall = false;
  }


  const height = resizeStartHeight + pageY - resizeStartY;
  const width = resizeStartWidth + (pageX - resizeStartX)

  const {responsive:{valueW} } = focuesdItem;

  let wRes = Math.round(width / xPerPx) + valueW

  const {h:minHeight=1,w:minWidth=1} = focuesdItem.min
  const {h:maxHeight,w:maxWidth = ((cols - focuesdItem.x)+valueW)} = focuesdItem.max

  wRes = Math.min(Math.max(wRes,minWidth),maxWidth)/* min max*/

  let hRes = Math.round(height/yPerPx)
  if(maxHeight) {
    hRes = Math.min(hRes,maxHeight)
  }
  hRes = Math.max(hRes,minHeight)

  shadow = {...shadow, ...{w:wRes, h:hRes}} 

  items[currentItemIndex].resize.resizing = true;
  items[currentItemIndex].resize.width = width;
  items[currentItemIndex].resize.height = height;

  items[currentItemIndex].w = wRes;
  items[currentItemIndex].h = hRes;

  if (!resizeNoDynamicCalc || passCall) {
    debounceRecalculateGridPosition();
  }
}

function resizeOnMouseUp(e) {
  e.stopPropagation();
  if (focuesdItem && focuesdItem.static) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  items[currentItemIndex].resize.resizing = false;
  items[currentItemIndex].resize.width = 0;
  items[currentItemIndex].resize.height = 0;

  window.removeEventListener("mousemove", resizeOnMouseMove, false);
  window.removeEventListener("touchmove", resizeOnMouseMove, false);

  window.removeEventListener("mouseup", resizeOnMouseUp, false);
  window.removeEventListener("touchend", resizeOnMouseUp, false);

  shadow = {...shadow, ... {w:0,h:0,x:0,y:0,active:false,id:null,responsive:{valueW:0,valueH:0}}, min:{},max:{} } 

  recalculateGridPosition("up");

  focuesdItem = undefined;
  passCall = false;
  resizeNoDynamicCalc = false;
}

// drag
let dragX = 0,
  dragY = 0;

const debounceRecalculateGridPosition = debounce(recalculateGridPosition, dragDebounceMs);

let isLast;
let cacheItem = {};

function dragOnMouseDown(id, e) {
  e.stopPropagation()
  const { touches: ev = e } = e;


  const isTouch = ev.constructor === TouchList;
  let pageX = isTouch ? ev[0].pageX : ev.pageX;
  let pageY = isTouch ? ev[0].pageY : ev.pageY;

  const { item, index } = getItemById(id, items);
  if (item.static) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  
  currentItemIndex = index;


  focuesdItem = item;
  cacheItem = {...item}
  
  isLast = getLastItemStats(items) === item.y + item.h;

  shadow = { ...shadow, ...item, active: true }; 

  

  let {
    currentTarget: { offsetLeft, offsetTop }
  } = e;

  pageX = pageX - bound.x;
  pageY = pageY - bound.y;

  dragX = pageX - offsetLeft;

  dragY = pageY - offsetTop;


  if (item) {
    window.addEventListener("mousemove", dragOnMove, false);
    window.addEventListener("touchmove", dragOnMove, false);

    window.addEventListener("mouseup", dragOnMouseUp, false);
    window.addEventListener("touchend", dragOnMouseUp, false);
  } else {
    console.warn("Can not get item");
  }
}

let passCall = false;

function dragOnMove(e) {
  e.stopPropagation()
  const { touches: ev = e } = e;
  const isTouch = ev.constructor === TouchList;
  let pageX = isTouch ? ev[0].pageX : ev.pageX;
  let pageY = isTouch ? ev[0].pageY : ev.pageY;

  let clientY = isTouch ? ev[0].clientY : ev.clientY;

  const y = pageY - bound.y;
  const x = pageX - bound.x;

  if (docH - clientY <= 15) {
    scroll({
      behavior: "smooth",
      top: scrollY + focuesdItem.h * yPerPx
    });
    passCall = true;
  } else {
    passCall = false;
  }

  if (clientY < 0 && scrollY >= 0) {
    passCall = true;
    scroll({
      behavior: "smooth",
      top: scrollY - yPerPx
    });
  } else {
    passCall = false;
  }


  let xRes = Math.round((x - dragX) / xPerPx);
  let yRes = Math.round((y - dragY) / yPerPx);

  xRes = Math.max(xRes,0)

  yRes = Math.max(yRes, 0);

  items[currentItemIndex].drag.top = y - dragY;
  items[currentItemIndex].drag.left = x - dragX;

  items[currentItemIndex].drag.dragging = true;

  shadow = {...shadow, ...{x:xRes,y:yRes}}
  items[currentItemIndex].x = xRes;
  items[currentItemIndex].y = yRes;

  if (!passCall) {
    debounceRecalculateGridPosition();
  }
}

function dragOnMouseUp(e) {
  if (focuesdItem && focuesdItem.static) {
    return;
  }

  window.removeEventListener("mousemove", dragOnMove, false);
  window.removeEventListener("touchmove", dragOnMove, false);

  window.removeEventListener("mouseup", dragOnMouseUp, false);
  window.removeEventListener("touchend", dragOnMouseUp, false);

  items[currentItemIndex].drag.dragging = false;
  items[currentItemIndex].drag.top = 0;
  items[currentItemIndex].drag.left = 0;

  dragX = 0;
  dragY = 0;

  shadow = {...shadow, ...{w:0,h:0,x:0,y:0,active:false,id:null}} 
  
  recalculateGridPosition("up");

  passCall = false;
  focuesdItem = undefined;
}


// Will work on this, need to make code cleaner
function recalculateGridPosition(action) {
  const dragItem = items[currentItemIndex];


  items = moveItem(dragItem, items, cols, cacheItem);

  dispatch('recalculate', {
    focuesdItem: dragItem
  });

}

beforeUpdate(() => {
  if (!focuesdItem) {
    ch = getContainerHeight(items, yPerPx);
  }
});


</script>