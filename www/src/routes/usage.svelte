<style>
.scroll {
  overflow-x: auto;
}

pre {
 white-space: pre-wrap;
 word-wrap: break-word; 
}

	table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  /*border: 1px solid #dddddd;*/
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  /*background-color: #dddddd;*/
}
</style>

<svelte:head>
  <title>Svelte-grid — Usage</title>
    <!-- <meta name="description" content=""/> -->
  <meta name="keywords" content="draggable,resizable,grid,layout,responsive,breakpoints,Svelte,svelte,svelte.js,sveltejs,usage"/>
  <meta name="author" content="Vahe Araqelyan"/>
</svelte:head>

<h1>Usage</h1>

<hr/>

<p>Use <b>Grid</b> like any other component.</p>

<p>The basic example</p>

<code>
  <pre>{`
    <script>
      import Grid from 'svelte-grid'
      import gridHelp from 'svelte-grid/build/helper'

      let items = [gridHelp.item({x:0,y:0,h:1,w:1, id:'unique_id'})]
    </script>
    <Grid items={items} cols={3} bind:items={items} let:item={item}>
      <div>{item.id}</div>
    </Grid>
  `}</pre>
</code>

<p><a href=examples>See more examples</a></p>

<hr/>

<h2>How to style</h2>

<p>Right now this is a problem for sveltejs</p>

<p>But you can apply styles to a selector globally, use the <b>:global(...)</b> modifier.</p>

<p>For example</p>

<code>
  <pre>
    {`
<style>
  :global(.svlt-grid-container) {
    background: red;
  }
</style>`}
  </pre>
</code>

<p>Here are the class names</p>

<ul>
  <li><code>.svlt-grid-container</code> — Class name for container grid</li>
  <li><code>.svlt-grid-item</code> — Slot shell class name</li>
  <li><code>.svlt-grid-shadow</code> — Class name for the back shadow when resizing or moving an element</li>
  <li><code>.svlt-grid-resizer</code> — Class name for resizer</li>
  <li><code>.svlt-grid-resizer::after</code> — Class name for resizer</li>
  <li><code>.svlt-grid-transition</code> — Apply the transition to the grid</li>
</ul>

<h2>How to animate</h2>

<code>
  <pre>
    {`
<style>
  :global(.svlt-grid-transition > .svlt-grid-item) {
    transition: transform 0.2s;
  }
</style>
    `}
  </pre>
</code>

<p>You can also set the useTransform property to true if you want to use CSS3 translate() instead of the top/left position.</p>

<h2>Helper functions</h2>

<hr/>

<p>The helper function is located in <code>svelte-grid/build/helper/index.mjs</code></p>

<b>Sample</b>
<code>
	<pre>{`import gridHelp from 'svelte-grid/build/helper'`}</pre>
</code>

<h3>What's in there?</h3>

<p>Well there are several functions that will help you manage the grid elements</p>

<b><code><pre>{`gridHelp.item(item: Object)`}</pre></code></b>

<p>Returns an object with the properties necessary to create a widget</p>

<p>This is actually an object for a single widget</p>

<code>
	<pre>
		{`{
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  drag: { top: null, left: null, dragging: false },
  resize: { width: null, height: null, resizing: false },
  responsive: { valueW: 0 },
  draggable: Boolean,
  resizable: Boolean,
  draggable: Boolean,
  max: {
    w: 0,
    h: 0
  },
  min: {
    w: 0,
    h: 0
  },
  static: Boolean
}

`}
	</pre>
</code>

<p>Example of use</p>

<code>
  <pre>
    {`
const items = [
  gridHelp.item({
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    draggable: false,
    max: { w: 2 }
  })
];
    `}
  </pre>
</code>

<hr/>

<b><code><pre>{`gridHelp.findSpaceForItem(item: Object, items: Array<Object>, cols: Number)`}</pre></code></b>

<p>Find out where to place the widget in the grid by calculating from left to right returns an object of two properties x and y.<code>{`{ x: Number, y: Number}`}</code></p>
<p>You need to assign the returned result and then only concat it with an array of objects</p>
<p><a href=examples/add_remove>See example</a></p>

<hr/>

<b><code><pre>{`gridHelp.appendItem(item: Object, items: Array<Object>, cols: Number)`}</pre></code></b>

<p>Returns an array of objects, including an item that should have been added to your grid.</p>

<p>Suppose you want to add an element at a specific position in the grid. But what if the position is not empty and the intended element covers other widgets in the grid.</p>
<p>You need to find another place for them too.</p>

<p>This function will find out if the newly inserted widget covers other widgets. If so, it will find a place for them and return an array of objects</p>

<p><a href=examples/add_remove>See example</a></p>

<hr/>

<b><code><pre>{`gridHelp.resizeItems(item: Object, cols: Number, rows: Number)`}</pre></code></b>

<p>Returns the array of objects</p>

<p>This is mainly used to keep your grid responsive.</p>
<p>It will find a new location and resize the widget based on the column size</p>

<p><a href=https://github.com/vaheqelyan/svelte-grid/blob/master/www/src/routes/index.svelte target=_blank>See example</a></p>

<hr/>



<h2>Props</h2>

<div class=scroll>
<table>
  <tr>
    <th>Prop</th>
    <th>Type</th>
    <th>Description</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr>
    <td>items</td>
    <td>{`Array<Object>`}</td>
    <td>items is an array of objects, see the demos for more complete usage</td>
    <td>[]</td>
    <td>✔</td>
  </tr>
  <tr>
    <td>cols</td>
    <td>Number</td>
    <td>Number of columns in layout.</td>
    <td>0</td>
    <td>✔</td>
  </tr>
  <tr>
    <td>gap</td>
    <td>Number</td>
    <td>Margin between items in px.</td>
    <td>0</td>
    <td>✘</td>
  </tr>
  <tr>
    <td>gap</td>
    <td>Number</td>
    <td>Margin between items in px.</td>
    <td>0</td>
    <td>✘</td>
  </tr>
  <tr>
    <td>rowHeight</td>
    <td>Number</td>
    <td>Rows have a static height</td>
    <td>150</td>
    <td>✘</td>
  </tr>
  <tr>
    <td>dragDebounceMs</td>
    <td>Number</td>
    <td>Grid calculation debounce</td>
    <td>350</td>
    <td>✘</td>
  </tr>

    <tr>
    <td>breakpoints</td>
    <td>{`Array<Array<Number>>`}</td>
    <td>Make the grid responsive</td>
    <td><pre>...</pre></td>
    <td>✘</td>
  </tr>
  <tr>
    <td>useTransform</td>
    <td>{`Boolean`}</td>
    <td>Uses CSS3 translate() instead of position top/left.</td>
    <td><pre>false</pre></td>
    <td>✘</td>
  </tr>
  <tr>
    <td>fillEmpty</td>
    <td>{`Boolean`}</td>
    <td>Fills empty spaces with a widget if the widget fits in an empty space</td>
    <td><pre>true</pre></td>
    <td>✘</td>
  </tr>

  <tr>
    <td>on:resize</td>
    <td>{`Function<void>`}</td>
    <td>The event is triggered when the grid is resized based on the document size</td>
    <td><pre>...</pre></td>
    <td>✘</td>
  </tr>
    <tr>
    <td>on:adjust</td>
    <td>{`Function<void>`}</td>
    <td>The event is triggered when the grid is adjusted, when resizing, or when dragging</td>
    <td><pre>...</pre></td>
    <td>✘</td>
  </tr>
  
</table>
</div>

<p>Have questions ?</p>

<p><a href=https://github.com/vaheqelyan/svelte-grid/issues/new target=_blank>Open an issue</a></p>