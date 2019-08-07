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
	import Grid from 'svelte-grid'
	import {makeItem,gridHelp} from 'svelte-grid/build/helper/index.mjs'
  import map from 'lodash.map'
  
  import {openInSource} from './github.js'

	const id = () =>
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

    function generateLayout(col) {
  return map(new Array(20), function(item, i) {
    const y = Math.ceil(Math.random() * 4) + 1;
    return makeItem({
        x: (i * 2) % col,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        id: id()
      })
  });
}

const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;
  
  let adjustAfterRemove = false;

  let cols = 10;
  // Just generate messy layout
  let layout = generateLayout(cols)
	// Helper function which normalize. you need to pass items and columns
  let items = gridHelp.resizeItems(layout, cols) 
  // Apply breakpoints
  let breakpoints = [ [1100, 5], [800, 4], [530, 1] ]
</script>

<svelte:head>
  <title>Example — Add/Remove</title>
    <meta name="description" content="Svelte-grid — Example — Add/Remove"/>
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage,example,examples,samples,responsive,breakpoints"/>
  <meta name="author" content="Vahe Araqelyan"/>
</svelte:head>


<h1>Responsive</h1>

<p><a href=examples/min_max>→ Min/Max resize</a></p>

<p><a href=examples/add_remove>← Add/Remove</a></p>

<p>When in responsive mode, you should supply at least one breakpoint via the breakpoint property.</p>

<p>Note. Breakpoint should be a nested array with tuple value.</p>

<pre>
  {@html `let breakpoints = [ [ 1100, 5 ], [800, 4], [530, 1] ]`}
</pre>

<pre>
  {@html `[ [ breakpoint<number>, cols<number>] ]`}
</pre>

<div class=link>
	<a href={`${openInSource}/responsive.svelte`} target=_blank>View this example's source</a>
	<a href="https://svelte.dev/repl/2cf339cc1dc14223a1457e386195e52d?version=3.7.1" target=_blank>Open in repl</a>
</div>

<Grid {breakpoints} {items} bind:items={items} {cols} let:item={item} rowHeight={100} gap={10}>
	<div class=content style="background: #ccc; border: 1px solid black;">
    {item.id}
  </div>
</Grid>