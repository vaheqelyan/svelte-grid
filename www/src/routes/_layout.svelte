<style>
  :global(#sapper) {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  .content {
    flex: 1;
    padding: 4% 7%;
    /*padding:20% 100%;*/
  }
</style>

<Nav {segment} />

<div class="content">
  <slot />
</div>

<Footer />

<script>
  import Nav from "../components/Nav.svelte";
  import Footer from "../components/Footer.svelte";

  export let segment;
</script>
