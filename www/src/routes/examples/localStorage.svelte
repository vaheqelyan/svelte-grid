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

  .button {
    margin-bottom: 10px;
  }
</style>

<h1>LocalStorage</h1>

<p>
  <a href="https://github.com/vaheqelyan/svelte-grid/issues/new" target="_blank">👌 That's all, offer what to add</a>
</p>
<p>
  <a href="examples/min_max">← Min/Max resize</a>
</p>

<p>This simple demo synchronizes to localStorage.</p>
<p>Try moving and resizing elements, then reloading.</p>

<div class="link">
  <a target="_blank" href={`${openInSource}/localStorage.svelte`}>View this example's source</a>
</div>

<button on:click={reset} class="button">Reset layout</button>

<Grid on:adjust={onAdjust} {items} bind:items cols={4} let:item rowHeight={100}>
  <div class="content" style="background: #ccc; border: 1px solid;">{item.id}</div>
</Grid>

<script>
  import { openInSource } from "./github.js";
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper/index.mjs";

  const id = () =>
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9);

  let layoutOriginal = [gridHelp.item({ x: 0, y: 0, w: 2, h: 2, id: id() }), gridHelp.item({ x: 2, y: 0, w: 2, h: 2, id: id() })];
  let layout;

  if (typeof window !== "undefined") {
    if (!localStorage.getItem("layout")) {
      localStorage.setItem("layout", JSON.stringify(layoutOriginal));
    } else {
      layout = JSON.parse(localStorage.getItem("layout"));
    }
  }

  let items = layout;

  const onAdjust = () => {
    localStorage.setItem("layout", JSON.stringify(items));
  };

  const reset = () => {
    items = layoutOriginal;
    localStorage.setItem("layout", JSON.stringify(layoutOriginal));
  };
</script>
