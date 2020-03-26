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
  .margin-b {
    margin-bottom: 10px;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 10px;
    cursor: pointer;
  }
</style>

<svelte:head>
  <title>Example — Add/Remove</title>
  <meta name="description" content="Svelte-grid — Example — Add/Remove" />
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage,example,examples,samples,add,remove,dynamic" />
  <meta name="author" content="Vahe Araqelyan" />
</svelte:head>

<h1>Add/Remove</h1>

<p>
  <a href="examples/responsive">→ Responsive</a>
</p>

<p>
  <a href="examples/static">← Static element</a>
</p>

<p>This demo shows what happens when items are dynamically added and removed.</p>

<div class="link">
  <a href={`${openInSource}/add_remove.svelte`} target="_blank">View this example's source</a>
  <a href="https://svelte.dev/repl/6f3685b564d74eb0812cfe10e41f3186?version=3.7.1" target="_blank">Open in repl</a>
</div>

<div class="margin-b">
  <button on:click={add}>Add (random size)</button>
  <button on:click={addAt}>Add (at specefic position)</button>
  <label>
    <input type="checkbox" bind:checked={adjustAfterRemove} />
    Adjust elements after removing an item
  </label>
</div>

<Grid bind:items={items} {cols} let:item rowHeight={100} gap={10}>
  <div class="content" style="background: #ccc; border: 1px solid black;">
    <span on:click={remove.bind(null, item)} class="close">✕</span>
    <!-- close x -->
    {item.id}
  </div>
</Grid>

<script>
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper/index.mjs";
  import map from "lodash.map";
  import { openInSource } from "./github.js";

  const id = () =>
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9);

  function generateLayout(col) {
    return map(new Array(3), function(item, i) {
      const y = Math.ceil(Math.random() * 4) + 1;
      return gridHelp.item({
        x: (i * 2) % col,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        id: id(),
      });
    });
  }

  const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

  let adjustAfterRemove = false;

  let cols = 10;
  // Just generate messy layout
  let layout = generateLayout(cols);
  // Helper function which normalize. you need to pass items and columns
  let items = gridHelp.resizeItems(layout, cols);

  /*
    Add random item to our grid, using helper functions
    Very easy
  */
  function add() {
    let newItem = gridHelp.item({
      w: Math.round(randomNumberInRange(1, 4)),
      h: Math.round(randomNumberInRange(1, 4)),
      x: 0,
      y: 0,
      id: id(),
    });

    let findOutPosition = gridHelp.findSpaceForItem(newItem, items, cols); // find out where to place

    items = [...items, ...[{ ...newItem, ...findOutPosition }]];
  }

  function addAt() {
    let newItem = gridHelp.item({
      w: Math.round(randomNumberInRange(1, 4)),
      h: Math.round(randomNumberInRange(1, 4)),
      x: 3,
      y: 0,
      id: id(),
    });
    items = gridHelp.appendItem(newItem, items, cols);
  }

  // Remove an item (Very easy)
  function remove(item, event) {
    items = items.filter(value => value.id !== item.id);
    if (adjustAfterRemove) {
      items = gridHelp.resizeItems(items, cols);
    }
  }
</script>
