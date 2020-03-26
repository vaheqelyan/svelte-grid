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
  <title>Example — Basic</title>
  <meta name="description" content="Svelte-grid — Example — Basic" />
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage,example,examples,samples,basic,showcase" />
  <meta name="author" content="Vahe Araqelyan" />
</svelte:head>

<h1>Basic</h1>

<a href="examples/static">→ Static element</a>

<p>Try dragging the elements around.</p>

<p>This is a basic, non-responsive layout with dragging and resizing. Usage is very simple.</p>

<div class="link">
  <a target="_blank" href={`${openInSource}/basic.svelte`}>View this example's source</a>
  <a target="_blank" href="https://svelte.dev/repl/35a506b9456d463ab441841859e1bb9f?version=3.7.1">Open in repl</a>
</div>

<Grid bind:items={items} cols={4} let:item rowHeight={100}>
  <div class="content" style="background: #ccc; border: 1px solid black;">{item.id}</div>
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

  let items = [gridHelp.item({ x: 0, y: 0, w: 2, h: 2, id: id() }), gridHelp.item({ x: 2, y: 0, w: 2, h: 2, id: id() })];
</script>
