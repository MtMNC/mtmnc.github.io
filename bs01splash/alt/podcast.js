window.onload = function() {

  function getPodcastRSS() {
    var podcastRSS = new XMLHttpRequest();
    podcastRSS.onreadystatechange = function() {
        if (podcastRSS.readyState == 4 && podcastRSS.status == 200) {
            outputPodcastData(podcastRSS);
        }
    };
    //Since the RSS feed is on another domain feedburner.com) and the feed lacks the appropriate
    //Access-Control-Allow-Origin header, we can't pull it with plain old JS. Instead of
    //requesting the feed itself, we let Yahoo! Query Language do the work for us. It'll process
    //the RSS, pull out the titles, descriptions, and links for us, then return them. Problem
    //solved. Credit to Derek Gathright on StackOverflow: http://stackoverflow.com/a/2679304
    podcastRSS.open("GET", "https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20link%2C%20itunes%3Asubtitle%20from%20rss%20where%20url%3D'https%3A%2F%2Ffeeds.feedburner.com%2FBS01Podcast%3Fformat%3Dxml'&diagnostics=true", true);
    podcastRSS.send();
  }

  function outputPodcastData(podcastRSS) {
    var titleElement = document.getElementById("podcast-name"),
        descriptionElement = document.getElementById("podcast-description"),
        linkElement = document.getElementById("podcast-link")
        textWrapperElement = document.getElementById("podcast-text");
    var xml = podcastRSS.responseXML;
    var blogPosts = xml.getElementsByTagName("item");
    //the latest episode's title is written in the latest blog post's <title>
    var title = blogPosts[0].getElementsByTagName("title")[0].firstChild.nodeValue;
    //the latest episode's description in written in the latest blog post's <itunes:subtitle>
    //Unfortunately for whatever reason it won't work as expected if we try to grab itunes:subtitle
    //directly, so instead we grab tags in any namespace that have the name "subtitle." The only
    //one that has the name "subtitle" is "itunes:subtitle" though, so we still get what we want.
    var description = blogPosts[0].getElementsByTagNameNS("*", "subtitle")[0].firstChild.nodeValue;
    //the latest episode's link is written in the latest blog post's <link>
    var link = blogPosts[0].getElementsByTagName("link")[0].firstChild.nodeValue;

    titleElement.textContent = title;
    descriptionElement.textContent = description;
    linkElement.setAttribute("href", link);
    textWrapperElement.classList.remove("hidden"); //doesn't have IE 8 support
  }

  getPodcastRSS();

}
