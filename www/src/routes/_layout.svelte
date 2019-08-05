<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	div {
		padding: 10px 16px;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<div><slot></slot></div>
