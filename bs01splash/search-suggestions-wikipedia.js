window.onload = function() {

  this.MWSearchSuggestions = {
    wiki: "https://en.wikipedia.org/w/",
    searchInputElement: document.getElementById("search-input-query"),
    suggestionsOutputElement: document.getElementById("search-suggestions"),
    maxSuggestionCount: 5,
    suggestionLinkClass: "search-suggestion-link",
    apiCall: null,
    apiCallFinished: true,
    setup: function(wiki, searchInputElement, suggestionsOutputElement, maxSuggestionCount) {
      this.wiki = wiki;
      this.searchInputElement = searchInputElement;
      this.suggestionsOutputElement = suggestionsOutputElement;
      this.maxSuggestionCount = maxSuggestionCount;
    },
    update: function(newText) {
      //don't send another API call if the last one hasn't finished yet
      if (!this.apiCallFinished) {
          return;
      }
      //see http://stackoverflow.com/a/2067584, http://stackoverflow.com/a/6879319 for why a script element is used
      this.apiCall = document.createElement("script");
      this.apiCall.src = this.wiki + "api.php?action=opensearch&search=" + newText
        + "&redirects=resolve&limit=" + this.maxSuggestionCount + "&callback=MWSearchSuggestions.updateSearchDropdown";
      document.head.appendChild(this.apiCall);
      this.apiCallFinished = false;
    },
    updateSearchDropdown: function(suggestions) {
      //searchResults[1] contains page titles of suggestions;
      //no greater than this.maxSuggestionCount
      var numberOfSuggestions = suggestions[1].length,
          suggestionTitle,
          suggestionLink;

      document.head.removeChild(this.apiCall);
      this.apiCallFinished = true;
      this.suggestionsOutputElement.textContent = "";

      for (var i = 0; i < numberOfSuggestions; i++) {
        suggestionTitle = suggestions[1][i];
        suggestionLink = suggestions[3][i];
        this.suggestionsOutputElement.appendChild(this.makeSuggestionLink(suggestionTitle, suggestionLink));
      }
    },
    makeSuggestionLink: function(title, link) {
      var searchResultLink = document.createElement("a");
      searchResultLink.href = link;
      searchResultLink.className = this.suggestionLinkClass;
      //note on textContent: http://stackoverflow.com/a/24428100
      searchResultLink.textContent = title;
      return searchResultLink;
    }
  }

  var searchBox = document.getElementById("search-input-query");
  searchBox.addEventListener("input", function() {
    MWSearchSuggestions.update(this.value);
  });
}
