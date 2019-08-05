<style>
  .content {
    width: 100%;
    height: 100%;
  }

  :global(*) {
    user-select: none;
  }
  :global(body) {
    overflow:scroll;
    margin: 0;
  }
  :global(.backShadow){
    background:red!important;
  }
</style>

<script>
import Grid from "svelte-grid/src/index.svelte";
import { makeItem, gridHelp } from "svelte-grid/build/helper/index.mjs";
import map from "lodash.map";
import result from "lodash.result";

const id = () =>
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

const random = (min, max) => Math.random() * (max - min) + min;

const randomHexColorCode = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};
let items = [];

function generateLayout(col) {
  return map(new Array(20), function(item, i) {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      ...makeItem({
        x: (i * 2) % col,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        id: id()
      }),
      ...{ data: randomHexColorCode() }
    };
  });
}

var cols = 15;

items = generateLayout(cols);
items = gridHelp.resizeItems(items, cols);

let breakpoints = [[1000, 10], [700, 5], [500, 3], [400, 1]];

</script>

<Grid {breakpoints} gap={10} {items} bind:items={items} {cols} rowHeight={100} let:item={item}>
	<div class=content style="background: {item.static ? '#ccccee' : item.data}"></div>
</Grid>