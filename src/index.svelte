<style>
  .svlt-grid-container {
    position: relative;
  }
</style>

<div class="svlt-grid-container" style="height: {containerHeight}px" bind:this={container}>
  {#if xPerPx || !fastStart}
    {#each items as item, i (item.id)}
      <MoveResize
        on:repaint={handleRepaint}
        on:pointerup={pointerup}
        id={item.id}
        resizable={item[getComputedCols] && item[getComputedCols].resizable}
        draggable={item[getComputedCols] && item[getComputedCols].draggable}
        {xPerPx}
        {yPerPx}
        width={Math.min(getComputedCols, item[getComputedCols] && item[getComputedCols].w) * xPerPx - gapX * 2}
        height={(item[getComputedCols] && item[getComputedCols].h) * yPerPx - gapY * 2}
        top={(item[getComputedCols] && item[getComputedCols].y) * yPerPx + gapY}
        left={(item[getComputedCols] && item[getComputedCols].x) * xPerPx + gapX}
        item={item[getComputedCols]}
        min={item[getComputedCols] && item[getComputedCols].min}
        max={item[getComputedCols] && item[getComputedCols].max}
        {dynamic}
        cols={getComputedCols}
        {gapX}
        {gapY}
        let:pointerdown>
        {#if item[getComputedCols]}
          <slot {pointerdown} dataItem={item} item={item[getComputedCols]} index={i} />
        {/if}
      </MoveResize>
    {/each}
  {/if}
</div>

<script>
  import { getContainerHeight } from "./utils/container.js";
  import { moveItemsAroundItem, moveItem, getItemById } from "./utils/item.js";
  import { onMount, createEventDispatcher } from "svelte";
  import { debounce, getColumn } from "./utils/other.js";

  import MoveResize from "./MoveResize/index.svelte";

  const dispatch = createEventDispatcher();

  export let fillSpace = false;
  export let items;
  export let rowHeight;
  export let cols;
  export let gap = [10, 10];
  export let dynamicCols = true;
  export let fastStart = false;
  export let debounceUpdate = 100;
  export let debounceResize = 100;
  export let dynamic = false;

  let getComputedCols;

  let container;

  $: [gapX, gapY] = gap;

  let xPerPx = 0;
  let yPerPx = rowHeight;

  let documentWidth;

  let containerWidth;

  $: containerHeight = getContainerHeight(items, yPerPx, getComputedCols);

  let prevCols;

  $: {
    if (prevCols !== cols && dynamicCols) {
      xPerPx = containerWidth / cols;
    }
    prevCols = cols;
  }

  const pointerup = (ev) => {
    dispatch("pointerup", {
      id: ev.detail.id,
      cols: getComputedCols,
    });
  };

  const onResize = debounce(() => {
    dispatch("resize", {
      cols: getComputedCols,
      xPerPx,
      yPerPx,
      width: containerWidth,
    });
  }, debounceResize);

  onMount(() => {
    const sizeObserver = new ResizeObserver((entries) => {
      let width = entries[0].contentRect.width;

      if (width === containerWidth) return;

      getComputedCols = getColumn(width, cols);

      xPerPx = width / getComputedCols;

      if (!containerWidth) {
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
    let activeItem = getItemById(detail.id, items);

    if (activeItem) {
      activeItem = {
        ...activeItem,
        [getComputedCols]: {
          ...activeItem[getComputedCols],
          ...detail.shadow,
        },
      };

      if (fillSpace) {
        items = moveItemsAroundItem(activeItem, items, getComputedCols, getItemById(detail.id, items));
      } else {
        items = moveItem(activeItem, items, getComputedCols, getItemById(detail.id, items));
      }

      if (detail.onUpdate) detail.onUpdate();

      dispatch("change", {
        unsafeItem: activeItem,
        id: activeItem.id,
        cols: getComputedCols,
      });
    }
  };

  const handleRepaint = debounce(updateMatrix, debounceUpdate);
</script>
