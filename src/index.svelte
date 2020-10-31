<style>
  .svlt-grid-container {
    position: relative;
  }
</style>

<div class="svlt-grid-container" style="height: {containerHeight}px" bind:this={container}>
  {#each items as item, i (item.id)}
    <MoveResize
      on:repaint={handleRepaint}
      id={item.id}
      index={i}
      resizable={item.resizable}
      draggable={item.draggable}
      {xPerPx}
      {yPerPx}
      width={Math.min(getComputedCols, item.w) * xPerPx - gap * 2}
      height={item.h * yPerPx - gap * 2}
      top={item.y * yPerPx + gap}
      left={item.x * xPerPx + gap}
      {gap}
      {item}
      min={item.min}
      max={item.max}
      {dynamic}
      cols={getComputedCols}>
      <slot {item} index={i} />
    </MoveResize>
  {/each}
</div>

<script>
  import { getContainerHeight } from "./utils/container.js";
  import { responsiveItems, moveItem, getItemById } from "./utils/item.js";
  import { onMount, createEventDispatcher } from "svelte";
  import { debounce, getColumnFromBreakpoints } from "./utils/other.js";

  import MoveResize from "./MoveResize/index.svelte";

  const dispatch = createEventDispatcher();

  export let items;
  export let rowHeight;
  export let cols;
  export let gap = 10;
  export let breakpoints = [];
  export let dynamicCols = true;

  export let debounceUpdate = 100;
  export let debounceResize = 100;
  export let dynamic = true;

  let getComputedCols;

  let container;

  let xPerPx = 0;
  let yPerPx = rowHeight;

  let documentWidth;

  let containerWidth;

  $: containerHeight = getContainerHeight(items, yPerPx);

  let prevCols;

  $: {
    if (prevCols !== cols && dynamicCols) {
      xPerPx = containerWidth / cols;
    }
    prevCols = cols;
  }

  const onResize = debounce(() => {
    if (breakpoints.length) {
      items = responsiveItems(items, getComputedCols);
    }

    dispatch("resize", {
      cols: getComputedCols,
      xPerPx,
      yPerPx,
      width: containerWidth,
    });
  }, debounceResize);

  onMount(() => {
    const sizeObserver = new ResizeObserver(entries => {
      let width = entries[0].contentRect.width;

      if (width === containerWidth) return;

      getComputedCols = getColumnFromBreakpoints(breakpoints, width, cols);

      xPerPx = width / getComputedCols;

      if (!containerWidth) {
        if (breakpoints.length) {
          items = responsiveItems(items, getComputedCols);
        }

        dispatch("mount", {
          cols: getComputedCols,
          xPerPx,
          yPerPx, // same as rowHeight
        });
      } else {
        onResize();
      }

      containerWidth = width;
    });

    sizeObserver.observe(container);

    return () => sizeObserver.disconnect();
  });

  const updateMatrix = ({ detail }) => {
    let activeItem = getItemById(detail.id, items).item;

    if (activeItem) {
      activeItem = Object.assign(activeItem, detail.shadow);
      items = moveItem(activeItem, items, getComputedCols, detail.clone);

      if (detail.onUpdate) detail.onUpdate();

      dispatch("change", {
        unsafeItem: activeItem,
        id: activeItem.id,
      });
    }
  };

  const handleRepaint = debounce(updateMatrix, debounceUpdate);
</script>
