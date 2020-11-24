<style>
:global(#sapper) {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.content {
  flex: 1;
}
.container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}
</style>

<Ribbon />

<Nav {segment} />

<div class=content>
  <div class=container>
    <slot />
  </div>
</div>

<Footer />

<script>
  import Nav from "../components/Nav.svelte";
  import Ribbon from "../components/Ribbon.svelte";
  import Footer from "../components/Footer.svelte";

  export let segment;
</script>
