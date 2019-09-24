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
  <title>Example — Static</title>
  <meta name="description" content="Svelte-grid — Example — Static" />
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage,example,examples,samples,static" />
  <meta name="author" content="Vahe Araqelyan" />
</svelte:head>

<h1>Static</h1>

<p>
  <a href="examples/gap">→ Gap</a>
</p>
<p>
  <a href="examples/static">← Basic</a>
</p>

<p>This demo sets an item to static. Static elements cannot be moved or resized. Other elements move themselves around a static element.</p>

<div class="link">
  <a href={`${openInSource}/static.svelte`} target="_blank">View this example's source</a>
  <a href="https://svelte.dev/repl/9023ed6cd43540bc995e1c84fbc90836?version=3.7.1" target="_blank">Open in repl</a>
</div>

<Grid {items} bind:items cols={8} let:item rowHeight={100}>
  <div class="content" style="background: {item.static ? '#cce' : '#ccc'};border:1px solid black;">{item.id}</div>
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

  let items = [gridHelp.item({ x: 0, y: 0, w: 2, h: 2, id: id() }), gridHelp.item({ x: 2, y: 0, w: 3, h: 2, id: id(), static: true }), gridHelp.item({ x: 5, y: 0, w: 3, h: 3, id: id() })];
</script>
