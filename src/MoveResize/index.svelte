<style>
  .svlt-grid-item {
    touch-action: none;
    position: absolute;
    background: #f1f1f1;
    will-change: auto;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .svlt-grid-resizer {
    user-select: none;
    width: 20px;
    height: 20px;
    position: absolute;
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

  .no-user {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    user-select: none;
  }

  .active {
    z-index: 3;
    cursor: grabbing;
  }

  .shadow-active {
    z-index: 2;
  }

  .svlt-grid-shadow {
    position: absolute;
    background: red;
    will-change: transform;
    background: pink;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .transition {
    transition: all 0.2s;
  }
</style>

<div
  on:pointerdown={item && item.custom ? null : draggable && pointerdown}
  class="svlt-grid-item"
  class:transition={!active}
  class:active
  class:no-user={active}
  style="width: {active ? cloneBound.width : width}px; height:{active ? cloneBound.height : height}px; transform: translate({active ? cloneBound.left : left}px, {active ? cloneBound.top : top}px);">
  <slot {pointerdown} />
  {#if resizable}
    <div class="svlt-grid-resizer" on:pointerdown={resizePointerDown} />
  {/if}
</div>

{#if active}
  <div class="svlt-grid-shadow transition shadow-active" style=" width: {shadow.w * xPerPx - gapX * 2}px; height: {shadow.h * yPerPx - gapY * 2}px; transform: translate({shadow.x * xPerPx + gapX}px, {shadow.y * yPerPx + gapY}px); " />
{/if}

<script>
  import { createEventDispatcher, beforeUpdate } from "svelte";

  const dispatch = createEventDispatcher();

  export let width;
  export let height;
  export let left;
  export let top;

  export let resizable;
  export let draggable;

  export let id;

  export let xPerPx;
  export let yPerPx;

  export let gapX;
  export let gapY;
  export let item;
  export let dynamic;

  export let max;
  export let min;

  export let cols;

  let shadow = {};

  let active = false;

  let debounce = false;

  let initX, initY;

  let xyRef = { x: left, y: top };
  let newXY = { x: 0, y: 0 };

  let cloneBound = { width, height, top, left };

  const inActivate = () => {
    active = false;
    dispatch("pointerup", {
      id,
    });
  };

  let repaint = (cb) => {
    dispatch("repaint", {
      id,
      shadow,
      onUpdate: cb,
    });
  };

  beforeUpdate(() => {
    if (xPerPx && !debounce && item) {
      xyRef = { x: left, y: top };
      shadow = { x: item.x, y: item.y, w: item.w, h: item.h };

      debounce = true;
    }
  });

  const pointerdown = ({ pageX, pageY, clientX, clientY }) => {
    initX = pageX;
    initY = pageY;

    cloneBound = { width, height, top, left };

    debounce = false;

    active = true;

    window.addEventListener("pointermove", pointermove);
    window.addEventListener("pointerup", pointerup);
    window.addEventListener("pointercancel", pointerup);
  };

  const pointermove = ({ pageX, pageY, clientX, clientY }) => {
    newXY = { x: initX - pageX, y: initY - pageY };
    cloneBound.left = xyRef.x - newXY.x;
    cloneBound.top = xyRef.y - newXY.y;

    let gridX = Math.round(cloneBound.left / xPerPx);
    let gridY = Math.round(cloneBound.top / yPerPx);

    shadow.x = Math.max(Math.min(gridX, cols - shadow.w), 0);
    shadow.y = Math.max(gridY, 0);

    if (dynamic) repaint();
  };

  const pointerup = (e) => {
    xyRef.x -= newXY.x;
    xyRef.y -= newXY.y;

    window.removeEventListener("pointerdown", pointerdown);
    window.removeEventListener("pointermove", pointermove);
    window.removeEventListener("pointerup", pointerup);
    window.removeEventListener("pointercancel", pointerup);

    repaint(inActivate);
  };

  // Resize

  let resizeInitX, resizeInitY;

  let initialWidth = 0;
  let initialHeight = 0;

  const resizePointerDown = (e) => {
    e.stopPropagation();
    const { pageX, pageY } = e;

    resizeInitX = pageX;
    resizeInitY = pageY;

    initialWidth = width;
    initialHeight = height;
    cloneBound = { width, height, top, left };

    active = true;
    const { x, y, w, h } = item;
    shadow = { x, y, w, h };

    window.addEventListener("pointermove", resizePointerMove);
    window.addEventListener("pointerup", resizePointerUp);
    window.addEventListener("pointercancel", resizePointerUp);
  };

  const resizePointerMove = ({ pageX, pageY }) => {
    cloneBound.width = initialWidth + pageX - resizeInitX;
    cloneBound.height = initialHeight + pageY - resizeInitY;

    // Get max col number
    let maxWidth = cols - shadow.x;
    maxWidth = Math.min(max.w, maxWidth) || maxWidth;

    // Limit bound
    cloneBound.width = Math.max(Math.min(cloneBound.width, maxWidth * xPerPx - gapX * 2), min.w * xPerPx - gapX * 2);
    cloneBound.height = Math.max(cloneBound.height, min.h * yPerPx - gapY * 2);

    if (max.h) {
      cloneBound.height = Math.min(cloneBound.height, max.h * yPerPx - gapY * 2);
    }
    // Limit col & row
    shadow.w = Math.round(cloneBound.width / xPerPx);
    shadow.h = Math.round(cloneBound.height / yPerPx);

    if (dynamic) repaint();
  };

  const resizePointerUp = (e) => {
    e.stopPropagation();

    repaint(inActivate);

    window.removeEventListener("pointermove", resizePointerMove);
    window.removeEventListener("pointerup", resizePointerUp);
    window.removeEventListener("pointercancel", resizePointerUp);
  };
</script>
