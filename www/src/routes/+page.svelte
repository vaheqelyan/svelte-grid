<style>
.demo-widget {
  background: #f1f1f1;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-container {
  max-width: 800px;
  width: 100%;
}
.resizer {
  position: absolute;
  bottom: 5px;
  right: 5px;
  cursor: move;
}
</style>

<div class=demo-container>
  <Grid bind:items={items} rowHeight={100} let:item let:dataItem {cols} let:resizePointerDown let:movePointerDown>
    <div class=demo-widget on:pointerdown={movePointerDown}>
      {dataItem.id}

      <div class=resizer on:pointerdown={resizePointerDown}>
        ☞ Resize me
      </div>
    </div>
  </Grid>
</div>

<script lang="ts">
import Grid from '../../../src/index.svelte'
import gridHelp from "../../../src/utils/helper.js";

const uuid = () => crypto.randomUUID()

let items = [
  {
    6: gridHelp.item({ 
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    }),
    id: uuid(),
  },

  {
    6: gridHelp.item({
      x: 2,
      y: 0,
      w: 2,
      h: 2,
    }),
    id: uuid(),
  },
];

const cols = [
  [ 1200, 6 ],
];
</script>
