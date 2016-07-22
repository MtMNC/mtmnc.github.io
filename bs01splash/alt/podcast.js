window.onload = function() {

  function getPodcastRSS() {
    var podcastRSS = new XMLHttpRequest();
    podcastRSS.onreadystatechange = function() {
        if (podcastRSS.readyState == 4 && podcastRSS.status == 200) {
            outputPodcastData(podcastRSS);
        }
    };
    //Since the RSS feed is on another domain and the feed lacks the appropriate
    //Access-Control-Allow-Origin header, we can't pull it with plain old JS.
    //However, PHP doesn't have the same restriction. Instead of requesting the
    //feed itself, we request a PHP file on our domain that then requests the
    //RSS file for us. Problem solved. Proxy code: https://github.com/abdul/php-proxy
    podcastRSS.open("GET", "proxy.php?url=http%3A%2F%2Fwww.bs01podcast.com%2Ffeed%2F", true);
    podcastRSS.send();
  }

  function outputPodcastData(podcastRSS) {
    var titleElement = document.getElementById("podcast-name"),
        descriptionElement = document.getElementById("podcast-description"),
        linkElement = document.getElementById("podcast-link");
    var xml = podcastRSS.responseXML;
    var blogPosts = xml.getElementsByTagName("item");
    //the latest episode's title is written in the latest blog post's <title>
    var title = blogPosts[0].getElementsByTagName("title")[0].firstChild.nodeValue;
    //the latest episode's description in written in the latest blog post's <itunes:subtitle>
    var description = blogPosts[0].getElementsByTagNameNS("*", "subtitle")[0].firstChild.nodeValue;
    //the latest episode's link is written in the latest blog post's <link>
    var link = blogPosts[0].getElementsByTagName("link")[0].firstChild.nodeValue;
    alert(title + " " + description + " " + link);
  }

  getPodcastRSS();

}
