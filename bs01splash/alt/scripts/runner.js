window.onload = function() {
  //getPodcastRSS();
  getBackgroundData();
  //getUserInfo();
  var searchSuggestions = new MWSearchSuggestions({"wiki": "http://biosector01.com/wiki/"});
  var searchBox = searchSuggestions.searchInputElement;
  searchBox.addEventListener("input", function() {
    searchSuggestions.update(this.value);
  });
  document.getElementById("sidebar-opener").addEventListener("click", function() {
    document.body.classList.toggle("sidebar-open");
  });
  document.getElementById("fade-overlay").addEventListener("click", function() {
    document.body.classList.remove("sidebar-open");
  });
}
