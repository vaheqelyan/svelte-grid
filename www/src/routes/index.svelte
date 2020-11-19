<style>
  .content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }

  :global(body) {
    overflow-y: scroll;
  }

  :global(.svlt-grid-resizer::after) {
    border-color: white !important;
  }

  :global(.svlt-grid-shadow) {
    border-radius: 6px;
  }

  :global(.svlt-grid-item) {
    border-radius: 6px;
  }

  .welcome {
    text-align: center;
  }
</style>

<svelte:head>
  <title>Svelte-grid — A draggable and resizable grid layout with responsive breakpoints, for Svelte.</title>
  <meta name="description" content="A draggable and resizable grid layout with responsive breakpoints, for Svelte." />
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs" />
  <meta name="author" content="Vahe Araqelyan" />
</svelte:head>

<div class="welcome">
  <h1>Svelte-grid</h1>
  <h4>A draggable and resizable grid layout with responsive breakpoints, for Svelte.</h4>
</div>

<Grid bind:items gap={10} {cols} rowHeight={100} let:dataItem>
  <div class="content" style="background: {dataItem.data};" />
</Grid>

<script>
  import Grid from "../../../src/index.svelte";
  import gridHelp from "../../../src/utils/helper.js";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };

  function generateLayout(col) {
    return new Array(20).fill(null).map(function (item, i) {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        16: gridHelp.item({ x: (i * 2) % col, y: Math.floor(i / 6) * y, w: 2, h: y }),
        id: id(),
        data: randomHexColorCode(),
      };
    });
  }

  let cols = [[1287, 16]];

  let items = gridHelp.adjust(generateLayout(16), 16);
</script>
