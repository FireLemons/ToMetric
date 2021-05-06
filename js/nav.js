Vue.component("site-nav", {
  mounted: function() {
    M.Modal.init(document.querySelectorAll('.modal'))
    console.log("E")
  },
  template: `
      <header>
        <nav id="nav" class="grey darken-3">
          <div class="nav-wrapper">
            <a href="./" class="brand-logo">ToMetric</a>
            <ul class="right">
              <li><a class="modal-trigger" href="#about-modal">About</a></li>
              <li><a class="" href="options.html"><i class="material-icons left">settings</i>Options</a></li>
            </ul>
          </div>
        </nav>
        <div id="about-modal" class="modal grey darken-3">
          <div class="modal-content white-text">
            <h4>About ToMetric</h4>
            <p>A game for developing the ability to estimate the metric equivalent of a customary unit</p>
          </div>
          <div class="modal-footer grey darken-3">
            <a href="#!" class="modal-close btn-flat white-text">Close</a>
          </div>
        </div>
      </header>`
});
