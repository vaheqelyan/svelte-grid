<style>
	.sample {
		width: 100%;
		height: 100%;
		background: white;
		border: 1px solid rgba(147, 128, 108, 0.25);
	}
	video {
		max-width: 100%;
		width: 100%;
		height: 80%;
	}
	.text-block {
		padding:2% 4%;
		height: 20%;
	}
	
	:global(.svlt-grid-container){
		background: white!important;
	}

	:global(.svlt-grid-shadow){
		background: pink;
	}

	h3 {
		text-transform:capitalize;
		text-decoration: overline;	
	}
</style>

<h1>Examples</h1>

<svelte:head>
  <title>Svelte-grid — Examples</title>
</svelte:head>


<Grid {items} bind:items={items} {cols} let:item={item} gap={10} {breakpoints}>
	<div class=sample>
		<video controls={false} autoplay loop>
	  <source src={`${cloudinary}/${item.id}.webm`} type="video/webm">
	  Your browser does not support the video tag.
	</video>
		<div class=text-block>
			<h3><a href={`examples/${item.id}`}>{item.id} example</a></h3>
		</div>
	</div>	
</Grid>

<script>
	import Grid from 'svelte-grid'
	import gridHelp from 'svelte-grid/build/helper'

const cloudinary = 'https://res.cloudinary.com/dmtrk3yns/video/upload/v1565264291/svelte-grid'

	let items = [
		gridHelp.item({x:0,y:0,w:2,h:2,id:'basic', resizable: false}),
		gridHelp.item({x:2,y:0,w:2,h:2,id:'static', resizable: false}),
		gridHelp.item({x:0,y:2,w:2,h:2,id:'gap', resizable: false}),
		gridHelp.item({x:2,y:2,w:2,h:2,id:'add_remove', resizable: false}),
		gridHelp.item({x:0,y:4,w:2,h:2,id:'responsive', resizable: false}),
		gridHelp.item({x:2,y:4,w:2,h:2,id:'min_max', resizable: false}),
	]
	let cols = 4;

	const breakpoints = [
		[740, 1]
	]
</script>