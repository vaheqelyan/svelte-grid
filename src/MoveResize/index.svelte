<style>
  .svlt-grid-item {
    touch-action: none;
    position: absolute;
    background: #f1f1f1;
    z-index: 1;
    will-change: transform;
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

  .svlt-grid-shadow {
    position: absolute;
    background: red;
    z-index: -1;
    will-change: transform;
    background: pink;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .transition {
    transition: all 0.2s;
  }
</style>

<div on:pointerdown={draggable && pointerdown} class="svlt-grid-item" class:transition={!active} class:active class:no-user={active} style="width: {width}px; height:{height}px; transform: translate({left}px, {top}px);">
  <slot />
  {#if resizable}
    <div class="svlt-grid-resizer" on:pointerdown={resizePointerDown} />
  {/if}
</div>

{#if active}
  <div class="svlt-grid-shadow transition" style=" width: {shadow.w * xPerPx - gap * 2}px; height: {shadow.h * yPerPx - gap * 2}px; transform: translate({shadow.x * xPerPx + gap}px, {shadow.y * yPerPx + gap}px); " />
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

  export let gap;
  export let item;

  export let max;
  export let min;

  export let cols;

  let shadow = { x: item.x, y: item.y, w: item.w, h: item.h };

  let active = false;

  let debounce = false;

  let initX, initY;

  let xyRef = { x: left, y: top };
  let newXY = { x: 0, y: 0 };

  let clone = { ...item };

  beforeUpdate(() => {
    if (xPerPx && !debounce) {
      xyRef = { x: left, y: top };

      shadow = { x: item.x, y: item.y, w: item.w, h: item.h };

      debounce = true;
    }
  });

  const pointerdown = ({ pageX, pageY, clientX, clientY }) => {
    initX = pageX;
    initY = pageY;

    clone = { ...item };

    debounce = false;

    active = true;

    window.addEventListener("pointermove", pointermove);
    window.addEventListener("pointerup", pointerup);
    window.addEventListener("pointercancel", pointerup);
  };

  const pointermove = ({ pageX, pageY, clientX, clientY }) => {
    newXY = { x: initX - pageX, y: initY - pageY };
    left = xyRef.x - newXY.x;
    top = xyRef.y - newXY.y;

    let gridX = Math.round(left / xPerPx);
    let gridY = Math.round(top / yPerPx);

    shadow.x = Math.max(Math.min(gridX, cols - shadow.w), 0);

    shadow.y = Math.max(gridY, 0);
  };

  const pointerup = e => {
    xyRef.x -= newXY.x;
    xyRef.y -= newXY.y;
    active = false;

    window.removeEventListener("pointerdown", pointerdown);
    window.removeEventListener("pointermove", pointermove);
    window.removeEventListener("pointerup", pointerup);
    window.removeEventListener("pointercancel", pointerup);

    dispatch("repaint", {
      id,
      shadow,
      clone,
    });
  };

  // Resize

  let resizeInitX, resizeInitY;

  let initialWidth = 0;
  let initialHeight = 0;

  const resizePointerDown = e => {
    e.stopPropagation();
    const { pageX, pageY } = e;

    resizeInitX = pageX;
    resizeInitY = pageY;

    initialWidth = width;
    initialHeight = height;
    clone = { ...item };

    active = true;
    const { x, y, w, h } = item;
    shadow = { x, y, w, h };

    window.addEventListener("pointermove", resizePointerMove);
    window.addEventListener("pointerup", resizePointerUp);
    window.addEventListener("pointercancel", resizePointerUp);
  };

  const resizePointerMove = ({ pageX, pageY }) => {
    width = initialWidth + pageX - resizeInitX;
    height = initialHeight + pageY - resizeInitY;

    shadow.w = Math.round(width / xPerPx);
    shadow.h = Math.round(height / yPerPx);

    let maxWidth = Math.min(max.w, cols) || cols;

    shadow.w = Math.max(Math.min(maxWidth, shadow.w), min.w);
    shadow.h = Math.max(shadow.h, min.h);

    if (max.h) {
      shadow.h = Math.min(max.h, shadow.h);
    }
  };

  const resizePointerUp = e => {
    e.stopPropagation();

    active = false;

    dispatch("repaint", {
      id,
      shadow,
      clone,
    });

    window.removeEventListener("pointermove", resizePointerMove);
    window.removeEventListener("pointerup", resizePointerUp);
    window.removeEventListener("pointercancel", resizePointerUp);
  };
</script>
