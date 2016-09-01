window.onload = function() {
  //getPodcastRSS();
  getBackgroundData();
  //getUserInfo();
  var searchSuggestions = new MWSearchSuggestions({"wiki": "http://biosector01.com/wiki/"});
  document.getElementById("sidebar-opener").addEventListener("click", function() {
    document.body.classList.toggle("sidebar-open"); //IE 10+
  });
  document.getElementById("fade-overlay").addEventListener("click", function() {
    document.body.classList.remove("sidebar-open"); //IE 10+
  });
};
