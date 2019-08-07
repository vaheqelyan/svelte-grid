<style>
  .content {
    width:100%;
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
  :global(.svlt-grid-container){
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

<script>
  import Grid from 'svelte-grid/src/index.svelte'
  import {makeItem} from 'svelte-grid/build/helper/index.mjs'
  import {openInSource} from './github.js'


  const id = () =>
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

  let items = [
  makeItem({x:0,y:0,w:2,h:2,id:id()}),
  makeItem({x:2,y:0,w:3,h:2,id:id(), static:true}),
  makeItem({x:5,y:0,w:3,h:3,id:id()})
  ]

</script>

<svelte:head>
  <title>Example — Gap</title>
    <meta name="description" content="Svelte-grid — Example — Gap"/>
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage,example,examples,samples,gap,margin"/>
  <meta name="author" content="Vahe Araqelyan"/>
</svelte:head>


<h1>Gap</h1>

<p><a href=examples/add_remove>→ Add/Remove</a></p>
<p><a href=examples/static>← Basic</a></p>

<p>In this example we set the gap between rows and columns to 10px</p>

<div class=link>
  <a href={`${openInSource}/gap.svelte`} target=_blank>View this example's source</a>
  <a href="https://svelte.dev/repl/7a51dcc6fa574b1dbe6130cda428c039?version=3.7.1" target=_blank>Open in repl</a>
</div>

<Grid {items} bind:items={items} cols={8} let:item={item} rowHeight={100} gap={10}>
  <div class=content style="background: {item.static ? '#cce' : '#ccc'};border:1px solid black;">{item.id}</div>
</Grid>