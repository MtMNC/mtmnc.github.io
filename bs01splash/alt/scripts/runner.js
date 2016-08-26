window.onload = function() {
  //getPodcastRSS();
  getBackgroundData();
  var searchSuggestions = new MWSearchSuggestions({"wiki": "http://biosector01.com/wiki/"});
  var searchBox = searchSuggestions.searchInputElement;
  searchBox.addEventListener("input", function() {
    searchSuggestions.update(this.value);
  });
}
