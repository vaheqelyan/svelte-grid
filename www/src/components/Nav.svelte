<style>
  @media only screen and (max-width: 530px) {
    .nav {
      justify-content: normal !important;
    }
    .nav-i {
      margin: auto !important;
    }
  }

  @media only screen and (max-width: 260px) {
    .nav {
      overflow-x: scroll;
      overflow-y: hidden;
    }
    .nav-i {
      margin: 0 !important;
      padding: 0 10px;
    }
  }

  .nav {
    width: 100%;
    display: flex;
    padding: 10px 0;
    justify-content: center;
  }
  .nav-i {
    margin: 0 2em;
    cursor: pointer;
    text-decoration: none;
  }
  .active {
    font-weight: 500;
    text-decoration: underline;
  }
</style>

<div class="nav">
  <a href="/" class="nav-i">Home</a>
  <a href="examples" class="nav-i" class:active={segment === 'examples'}>Examples</a>
  <a href="usage" class="nav-i" class:active={segment === 'usage'}>Usage</a>
  <a href="features" class="nav-i" class:active={segment === 'features'}>Features</a>
  <a href="https://github.com/vaheqelyan/svelte-grid" target="_blank" class="nav-i">GitHub</a>
</div>

<script>
  export let segment;
</script>
