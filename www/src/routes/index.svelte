<style>
  .content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border-bottom-right-radius: 3px;
  }

  :global(*) {
    user-select: none;
  }
  :global(body) {
    overflow:scroll;
    margin: 0;
  }
  :global(.svlt-grid-resizer::after){
    border-color: white!important;
  }

  :global(.svlt-grid-shadow) {
    background: pink;
    border-radius: 6px;
    border-bottom-right-radius: 3px;
    transition: top 0.2s, left 0.2s;
  }

  .welcome {
    text-align: center;
  }
</style>

<script>
import Grid from "svelte-grid";
import { makeItem, gridHelp } from "svelte-grid/build/helper/index.mjs";
import map from "lodash.map";

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

<svelte:head>
  <title>Svelte-grid — A draggable and resizable grid layout with responsive breakpoints, for Svelte.</title>
  <meta name="description" content="A draggable and resizable grid layout with responsive breakpoints, for Svelte."/>
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs"/>
  <meta name="author" content="Vahe Araqelyan"/>
</svelte:head>

<div class=welcome>
  <h1>Svelte-grid</h1>
  <h4>A draggable and resizable grid layout with responsive breakpoints, for Svelte.</h4>
</div>

<Grid {breakpoints} gap={10} {items} bind:items={items} {cols} rowHeight={100} let:item={item}>
	<div class=content style="background: {item.static ? '#ccccee' : item.data}"></div>
</Grid>