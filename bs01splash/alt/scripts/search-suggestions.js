var mostRecentlyUpdatedMWSearchSuggestions = null;

function MWSearchSuggestions(settings) {
  this.wiki = "https://en.wikipedia.org/w/",
  this.searchInputElement = document.getElementById("search-input-query"),
  this.suggestionsOutputElement = document.getElementById("search-suggestions"),
  this.maxSuggestionCount = 5,
  this.suggestionLinkClass = "search-suggestion-link",
  this.apiCall = null,
  this.apiCallFinished = true;
  if (settings !== undefined) {
    if (settings.hasOwnProperty("wiki")) {
      this.wiki = settings.wiki;
    }
    if (settings.hasOwnProperty("searchInputElement")) {
      this.searchInputElement = settings.searchInputElement;
    }
    if (settings.hasOwnProperty("suggestionsOutputElement")) {
      this.suggestionsOutputElement = settings.suggestionsOutputElement;
    }
    if (settings.hasOwnProperty("maxSuggestionCount")) {
      this.maxSuggestionCount = settings.maxSuggestionCount;
    }
    if (settings.hasOwnProperty("suggestionLinkClass")) {
      this.suggestionLinkClass = settings.suggestionLinkClass;
    }
  }
}

MWSearchSuggestions.prototype.update = function(newText) {
  //don't send another API call if the last one hasn't finished yet
  if (!this.apiCallFinished) {
      return;
  }
  //Assign this MWSearchSuggestions object to a global variable. The JSONP callback function does not run
  //in the context of any particular object. We also can't get it to run on this particular object, since
  //we have no way of knowing what var this object is stored in, so we can't pass in the var name into
  //the URL that will cause the callback function to run. Instead, if we store this object in a global
  //variable, the global callback function can perform operations on this particular object.
  mostRecentlyUpdatedMWSearchSuggestions = this;

  //see http://stackoverflow.com/a/2067584, http://stackoverflow.com/a/6879319 for why a script element is used
  this.apiCall = document.createElement("script");
  this.apiCall.src = this.wiki + "api.php?action=opensearch&search=" + newText
    + "&redirects=resolve&limit=" + this.maxSuggestionCount + "&callback=updateSearchDropdown";
  document.head.appendChild(this.apiCall);
  this.apiCallFinished = false;
}

function updateSearchDropdown(suggestions) {
  //searchResults[1] contains page titles of suggestions;
  //no greater than this.maxSuggestionCount
  var numberOfSuggestions = suggestions[1].length,
      suggestionTitle,
      suggestionLink;

  document.head.removeChild(mostRecentlyUpdatedMWSearchSuggestions.apiCall);
  mostRecentlyUpdatedMWSearchSuggestions.apiCallFinished = true;
  mostRecentlyUpdatedMWSearchSuggestions.suggestionsOutputElement.textContent = "";

  for (var i = 0; i < numberOfSuggestions; i++) {
    suggestionTitle = suggestions[1][i];
    suggestionLink = suggestions[3][i];
    mostRecentlyUpdatedMWSearchSuggestions.suggestionsOutputElement.appendChild(mostRecentlyUpdatedMWSearchSuggestions.makeSuggestionLink(suggestionTitle, suggestionLink));
  }
  //We're done messing with the MWSearchSuggestions object that was most recently updated,
  //so we reset the variable that points to it.
  mostRecentlyUpdatedMWSearchSuggestions = null;
}

MWSearchSuggestions.prototype.makeSuggestionLink = function(title, link) {
  var searchResultLink = document.createElement("a");
  searchResultLink.href = link;
  searchResultLink.className = this.suggestionLinkClass;
  //note on textContent: http://stackoverflow.com/a/24428100
  searchResultLink.textContent = title;
  return searchResultLink;
}
