overlayBox
==========
<p>This a new overlay Jquery Plugin.<br/>
It has a simple configuration, fast plugin and compatible the all modern browser.</p>

<div>
<h3>
  Support Browsers:
</h3>
<ul>
  <li>IE9 and above</li>
  <li>Chrome</li>
  <li>Firefox</li>
</ul>
</div>

<div>
<h3>
  Configuration:
</h3>
  <p>
    <h4>Options</h4>
    <ul>
      <li>
        layoutId: ''; This is a contentId, where the page begin. This optional. 
      </li>
      <li>
        closeBtnId: '#overlay-close'; This is a close button DOM id and default value.
      </li>
      <li>
        contentBlockWidth: ''; The overlay content block of width.
      </li>
      <li>
        onOverlayLoaded: function(el); This is a function property. This run, when the overlay is displayed.
      </li>
      <li>
        onOverlayClosed: function(); This is an another function property. This run, when the overlay is closed.
      </li>
    </ul>
  </p>
  <p>
    <h4>HtmlData (3 property)</h4>
    <ul>
      <li>
        1. $(this); Where the element has a click event. 
      </li>
      <li>
        2. Just a string or html template.
      </li>
      <li>
        3. Server data configuration(Ajax).
        <ul>
          <li>
            method: ''; POST or GET
          </li>
          <li>
            dataType: ''; HTML, JSON, ETC. Like Jquery.
          </li>
          <li>
            url: ''; Data url
          </li>
          <li>
            loaderIcon: ''; LoaderIcon url
          </li>
          <li>
            loaderId: ''; Loader DOM Id name
          </li>
          <li>
            error_404_html: ''; HTML template
          </li>
        </ul>
      </li>
    </ul>
  </p>
</div>

<div>
<h3>
  Demos:
</h3>
<p>
  You find 3 demo page in the Demos folder.
  <br/>
  Note: If click on the overlay - not on the overlay content - the overlay is closed.
</p>
</div>
