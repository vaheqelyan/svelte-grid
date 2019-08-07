<style>
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

<h2>Helper functions</h2>

<hr/>

<p>You can import helper functions from <code>svelte-grid/build/helper/index.mjs</code></p>

<b>Sample</b>
<code>
	<pre>{`import {gridHelp} from 'svelte-grid/build/helper/index.mjs'`}</pre>
</code>

<h3>What's in there?</h3>

<p>Well there are several functions that will help you manage the grid elements</p>

<b><code><pre>{`makeItem(item: Object)`}</pre></code></b>

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
  min: {
    w: 0,
    h: 0
  },
  max: {
    w: 0,
    h: 0
  },
  static: Boolean
}

`}
	</pre>
</code>

<hr/>

<b><code><pre>{`gridHelp.findSpaceForItem(item: Object, items: Array<Object>, cols: Number)`}</pre></code></b>

<hr/>

<b><code><pre>{`gridHelp.appendItem(item: Object, items: Array<Object>, cols: Number)`}</pre></code></b>

<hr/>

<b><code><pre>{`gridHelp.findSpaceForItem(item: Object, cols: Number, rows: Number)`}</pre></code></b>

<hr/>



<h2>Props</h2>

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
  
</table>