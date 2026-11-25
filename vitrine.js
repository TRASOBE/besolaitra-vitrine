(function () {
  var btn = document.getElementById("vitrine-menu-btn");
  var menu = document.getElementById("vitrine-menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var opening = menu.hasAttribute("hidden");
      if (opening) menu.removeAttribute("hidden"); else menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", String(opening));
    });
  }
  if (document.getElementById("vitrine-search") && window.PagefindUI) {
    var ui = new window.PagefindUI({ element: "#vitrine-search", showImages: false, showSubResults: true });
    var q = new URLSearchParams(location.search).get("q");
    if (q) ui.triggerSearch(q);
  }
})();
