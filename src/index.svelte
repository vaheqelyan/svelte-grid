
<style>
  :global(body) {
    overflow: scroll;
  }

   .svlt-grid-container {
    position: relative;
  }

.svlt-grid-item {
  touch-action:none;
  position: absolute;
}

  .svlt-grid-shadow {
    position: absolute;
  }


  .svlt-grid-resizer {
    user-select: none;
    width: 20px;
    height: 20px; 
    position:absolute; 
    right: 0; 
    bottom: 0; 
    cursor: se-resize;
  }

  .svlt-grid-resizer::after {
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

<div class:svlt-grid-transition={!focuesdItem} class=svlt-grid-container bind:this={container} style="height: {ch}px">
  {#each items as item, i (item.id)}

    <div on:mousedown={item.draggable ? dragOnMouseDown.bind(this, item.id) : null}
        on:touchstart={item.draggable ? dragOnMouseDown.bind(this, item.id) : null}
        class=svlt-grid-item style="{useTransform ? `transform: translate(${item.drag.dragging ? item.drag.left : (item.x * xPerPx) + gap}px, ${item.drag.dragging ? item.drag.top : (item.y * yPerPx + gap)}px);` : ''};
        {!useTransform ? `top: ${item.drag.dragging ? item.drag.top : (item.y * yPerPx) + gap}px` : ''};
        {!useTransform ? `left: ${item.drag.dragging ? item.drag.left : (item.x * xPerPx) + gap}px` : ''};
        width: {item.resize.resizing ? item.resize.width : ((item.w * xPerPx) - gap * 2) - (item.responsive.valueW*xPerPx)}px;
        height: {item.resize.resizing ? item.resize.height : (item.h * yPerPx) - gap * 2}px;
        z-index: {item.drag.dragging || item.resize.resizing ? 3 : 1};
        opacity: {item.resize.resizing ? 0.5 : 1}">

          <slot {item} index={i}></slot>
          {#if item.resizable}
            <div class=svlt-grid-resizer 
          on:touchstart={resizeOnMouseDown.bind(this,item.id)} 
          on:mousedown={resizeOnMouseDown.bind(this,item.id)}
          ></div>
          {/if}
        </div>


  {/each}

  {#if shadow.active}
    <div class=svlt-grid-shadow style="{useTransform ? `transform: translate(${shadow.drag.dragging ? shadow.drag.left : (shadow.x * xPerPx) + gap}px, ${shadow.drag.dragging ? shadow.drag.top : (shadow.y * yPerPx + gap)}px);` : ''};
        {!useTransform ? `top: ${shadow.drag.dragging ? shadow.drag.top : (shadow.y * yPerPx) + gap}px` : ''};
        {!useTransform ? `left: ${shadow.drag.dragging ? shadow.drag.left : (shadow.x * xPerPx) + gap}px` : ''};
    width:{((shadow.w * xPerPx) - gap * 2) - (shadow.responsive.valueW*xPerPx)}px;
    height:{(shadow.h * yPerPx) - gap * 2}px;"></div>
  {/if}
</div>

<script>
import { onMount, beforeUpdate,createEventDispatcher } from "svelte";

import { resizeItems, getItemById, moveItem, findFreeSpaceForItem } from "./utils/item.js";
import { getContainerHeight } from "./utils/container.js";
import { debounce, getRowsCount, getColumnFromBreakpoints, getCordinates, getTranslate } from "./utils/other.js";
import { makeMatrixFromItemsIgnore } from "./utils/matrix.js";

export let useTransform = false;
export let items = [];
export let cols = 0;
export let dragDebounceMs = 350;
export let gap = 0;
export let rowHeight = 150;
export let breakpoints;
export let fillEmpty = true;

let container,
  focuesdItem,
  bound,
  xPerPx,
  currentItemIndex,
  getComputedCols,
  documentWidth,
  resizeNoDynamicCalc,
  yPerPx = rowHeight,
  initCols = cols,
  shadow = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    active: false,
    id: null,
    responsive: { valueW: 0 },
    min: {},
    max: {}
  },
  ch = getContainerHeight(items, yPerPx);

const dispatch = createEventDispatcher();

const getDocWidth = () => document.documentElement.clientWidth

function onResize() {

  let w = document.documentElement.clientWidth

  if(w !== documentWidth) {
    documentWidth = w;
    
    bound = container.getBoundingClientRect();

    let getCols = getColumnFromBreakpoints(breakpoints,w,cols,initCols)
    
    getComputedCols = getCols

    xPerPx = bound.width / getCols

    dispatch('resize', {
      cols:getCols,
      xPerPx,
      yPerPx // same as rowHeight
    });

    if(breakpoints) {
    	items = resizeItems(items, getCols);
    }

  } 

}


onMount(() => {
  bound = container.getBoundingClientRect();

  let getCols = getColumnFromBreakpoints(breakpoints, getDocWidth(), cols, initCols)
  
  getComputedCols = getCols

  documentWidth = document.documentElement.clientWidth

  if(breakpoints) {
    items = resizeItems(items, getCols)
  }

  xPerPx = bound.width / getCols

  dispatch('mount', {
    cols: getCols,
    xPerPx,
    yPerPx // same as rowHeight
  })

});

// resize

let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;

function resizeOnMouseDown(id, e) {
  e.stopPropagation();

  let {pageX,pageY} = getCordinates(e)

  const { item, index } = getItemById(id, items);

  currentItemIndex = index;

  focuesdItem = item;

  cacheItem = {...item}

  resizeNoDynamicCalc = item.h + item.y === getRowsCount(items);

  shadow = {...shadow,...focuesdItem,...{active:true}}

  resizeStartX = pageX - bound.x;
  resizeStartY = pageY - bound.y;

  resizeStartWidth = (item.w * xPerPx) - (gap * 2) - (focuesdItem.responsive.valueW * xPerPx);

  resizeStartHeight = (item.h * yPerPx) - (gap * 2);

  getComputedCols = getColumnFromBreakpoints(breakpoints, getDocWidth(), cols, initCols)

  window.addEventListener("mousemove", resizeOnMouseMove, false);
  window.addEventListener("touchmove", resizeOnMouseMove, false);

  window.addEventListener("mouseup", resizeOnMouseUp, false);
  window.addEventListener("touchend", resizeOnMouseUp, false);
}

function resizeOnMouseMove(e) {

  let {pageX,pageY}=getCordinates(e);

  pageX = pageX - bound.x;
  pageY = pageY - bound.y;

  const height = resizeStartHeight + pageY - resizeStartY;
  const width = resizeStartWidth + (pageX - resizeStartX)

  const {responsive:{valueW} } = focuesdItem;

  let wRes = Math.round(width / xPerPx) + valueW

  const {h:minHeight=1,w:minWidth=1} = focuesdItem.min
  const {h:maxHeight,w:maxWidth = ((getComputedCols - focuesdItem.x)+valueW)} = focuesdItem.max

  wRes = Math.min(Math.max(wRes,minWidth),maxWidth)/* min max*/

  let hRes = Math.round(height/yPerPx)
  if(maxHeight) {
    hRes = Math.min(hRes,maxHeight)
  }
  hRes = Math.max(hRes,minHeight)

  shadow = {...shadow, ...{w:wRes, h:hRes}} 

  let assignItem = items[currentItemIndex]
  items[currentItemIndex] = {
    ...assignItem,
    resize: {
      resizing:true,
      width,
      height
    },
    w:wRes,
    h:hRes
  }

  if (!resizeNoDynamicCalc) {
    debounceRecalculateGridPosition();
  }
}

function resizeOnMouseUp(e) {
  e.stopPropagation();

  let assignItem = items[currentItemIndex]
  items[currentItemIndex] = {
    ...assignItem,
    resize:{
      resizing:false,
      width:0,
      height:0
    }
  }

  window.removeEventListener("mousemove", resizeOnMouseMove, false);
  window.removeEventListener("touchmove", resizeOnMouseMove, false);

  window.removeEventListener("mouseup", resizeOnMouseUp, false);
  window.removeEventListener("touchend", resizeOnMouseUp, false);

  shadow = {...shadow, ... {w:0,h:0,x:0,y:0,active:false,id:null,responsive:{valueW:0}}, min:{},max:{} } 

  recalculateGridPosition("up");

  focuesdItem = undefined;
  resizeNoDynamicCalc = false;
}

// drag
let dragX = 0,
  dragY = 0;

const debounceRecalculateGridPosition = debounce(recalculateGridPosition, dragDebounceMs);

let cacheItem = {};

function dragOnMouseDown(id, e) {
  e.stopPropagation()
  let {pageX,pageY} = getCordinates(e)

  const { item, index } = getItemById(id, items);
  
  currentItemIndex = index;


  focuesdItem = item;
  cacheItem = {...item}
  
  shadow = { ...shadow, ...item, active: true }; 

  

  let { currentTarget } = e;

  let offsetLeft, offsetTop;

  if(useTransform) {
    const { x, y } = getTranslate(currentTarget.style.transform)
    offsetLeft = x
    offsetTop = y
  } else {
    offsetLeft = currentTarget.offsetLeft
    offsetTop = currentTarget.offsetTop
  }

  pageX = pageX - bound.x;
  pageY = pageY - bound.y;

  dragX = pageX - offsetLeft;

  dragY = pageY - offsetTop;

  getComputedCols = getColumnFromBreakpoints(breakpoints, getDocWidth(), cols, initCols)


  if (item) {
    window.addEventListener("mousemove", dragOnMove, false);
    window.addEventListener("touchmove", dragOnMove, false);

    window.addEventListener("mouseup", dragOnMouseUp, false);
    window.addEventListener("touchend", dragOnMouseUp, false);
  } else {
    console.warn("Can not get item");
  }
}


function dragOnMove(e) {
  e.stopPropagation()

  let {pageX,pageY} = getCordinates(e)

  const y = pageY - bound.y;
  const x = pageX - bound.x;

  let xRes = Math.round((x - dragX) / xPerPx);
  let yRes = Math.round((y - dragY) / yPerPx);

  xRes = Math.max(Math.min(xRes,getComputedCols-(focuesdItem.w- focuesdItem.responsive.valueW)),0)

  yRes = Math.max(yRes, 0);

  let assignItem = items[currentItemIndex];

  items[currentItemIndex] = {
    ...assignItem,
    drag:{
      dragging:true,
      top:y - dragY,
      left:x - dragX
    },
    x:xRes,
    y:yRes
  }

  shadow = {...shadow, ...{x:xRes,y:yRes}}

  debounceRecalculateGridPosition();
}

function dragOnMouseUp(e) {
  window.removeEventListener("mousemove", dragOnMove, false);
  window.removeEventListener("touchmove", dragOnMove, false);

  window.removeEventListener("mouseup", dragOnMouseUp, false);
  window.removeEventListener("touchend", dragOnMouseUp, false);

  let assignItem = items[currentItemIndex]
  items[currentItemIndex] = {
    ...assignItem,
    drag: {
      dragging: false,
      top: 0,
      left: 0
    },
  }

  dragX = 0;
  dragY = 0;

  shadow = {...shadow, ...{w:0,h:0,x:0,y:0,active:false,id:null}} 
  
  recalculateGridPosition("up");

  focuesdItem = undefined;
}


// Will work on this, need to make code cleaner
function recalculateGridPosition(action) {
  const dragItem = items[currentItemIndex];

  let getCols = getColumnFromBreakpoints(breakpoints, getDocWidth(), cols, initCols)
  let result = moveItem(dragItem, items, getCols, cacheItem);

  if(fillEmpty) {

    result.forEach(value => {
      if (value.id !== dragItem.id) {
        result = result.map($val =>
          $val.id === value.id
            ? {
                ...$val,
                ...findFreeSpaceForItem(
                  makeMatrixFromItemsIgnore(result, [value.id], getRowsCount(result), getCols),
                  value,
                  result
                )
              }
            : $val
        );
      }
    });
  }

  items = result

  dispatch('adjust', {
    focuesdItem: dragItem
  });

}

beforeUpdate(() => {
  if (!focuesdItem) {
    ch = getContainerHeight(items, yPerPx);
    if(cols !== initCols) {
      if(bound) {
        xPerPx = bound.width/cols
        initCols = cols
      }
    }
  }
});


</script>
