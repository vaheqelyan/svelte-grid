<style>
  .content {
    width: 100%;
    height: 100%;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: large;
  }
  :global(.svlt-grid-shadow) {
    background: pink;
  }
  :global(.svlt-grid-container) {
    background: #eee;
  }
  .link {
    display: flex;
    padding-bottom: 20px;
  }
  .link a {
    margin-left: 10px;
  }
</style>

<svelte:head>
  <title>Example — Min/Max resize</title>
  <meta name="description" content="Svelte-grid — Example — Min/Max resize" />
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage,example,examples,samples,min,max,resize,limit,control" />
  <meta name="author" content="Vahe Araqelyan" />
</svelte:head>

<h1>Min/Max resize</h1>

<p>
  <a href="examples/localStorage">→ LocalStorage</a>
</p>
<p>
  <a href="examples/static">← Responsive</a>
</p>

<p>Control how much can user resize the item.</p>

<div class="link">
  <a href={`${openInSource}/min_max.svelte`} target="_blank">View this example's source</a>
  <a href="https://svelte.dev/repl/2cf339cc1dc14223a1457e386195e52d?version=3.7.1" target="_blank">Open in repl</a>
</div>

<Grid {items} bind:items cols={8} let:item rowHeight={100}>
  <div class="content" style="background: {item.static ? '#cce' : '#ccc'};border:1px solid black;">{item.id} max width:{item.max.w}</div>
</Grid>

<script>
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper/index.mjs";
  import { openInSource } from "./github.js";

  const id = () =>
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9);

  // makeItem({...,max:{w:number,h:number}, max: { w:number, h:number } })
  let items = [gridHelp.item({ x: 0, y: 0, w: 2, h: 2, id: id(), max: { w: 2 } }), gridHelp.item({ x: 2, y: 0, w: 3, h: 2, id: id(), max: { w: 3 } }), gridHelp.item({ x: 5, y: 0, w: 3, h: 3, id: id(), max: { w: 4 } })];
</script>
