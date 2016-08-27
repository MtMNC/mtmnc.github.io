function getBackgroundData() {
  var backgroundApiCall = new XMLHttpRequest();
  backgroundApiCall.onreadystatechange = function() {
      if (backgroundApiCall.readyState == 4 && backgroundApiCall.status == 200) {
          setBackground(backgroundApiCall);
      }
  };
  //Since the HTML is on another domain (biosector01.com) and the HTML lacks the appropriate
  //Access-Control-Allow-Origin header FOR NOW, we can't pull it with plain old JS. Instead of
  //requesting the HTML itself, we let Yahoo! Query Language do the work for us. It'll process
  //the HTML, pull out the divs, then return them. Problem solved. Credit to Derek Gathright
  //on StackOverflow: http://stackoverflow.com/a/2679304
  backgroundApiCall.open("GET", "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Fbiosector01.com%2Fwiki%2Findex.php%3Ftitle%3DUser%3AMorris_the_Mata_Nui_Cow%2FSandbox2%26action%3Drender%27%20and%20xpath%3D%22%2F%2Fdiv%22", true);
  backgroundApiCall.send();

}

function setBackground(backgroundData) {
  var imageElement = document.body,
      exploreLinkElement = document.getElementById("explore-link"),
      exploreLinkNameElement = document.getElementById("explore-name"),
      gradientElement = document.getElementById("main-gradient");
  var xml = backgroundData.responseXML;

  //pick a random node (containing an image, link, and two colors) to use
  var nodes = xml.getElementsByTagName("div");
  var numberOfNodes = nodes.length;
  //pick random number between 1 and numberOfNodes (both inclusive)
  var randomNode = Math.floor(Math.random() * (numberOfNodes)) + 1;
  //the node count starts at 0, so subtract 1 from randomNode to get the node we want
  var nodeToUse = nodes[randomNode - 1];

  //get the two subnodes, i.e. spans in the html, that are required (background image, explore link)
  var imageSubnode = nodeToUse.firstChild,
      exploreSubnode = imageSubnode.nextSibling;
  //get the image's URL
  var imageURL = imageSubnode.firstChild.getAttribute("href");
  //set the body's background image to the image we just got
  imageElement.style.backgroundImage = "url(" + imageURL + ")";
  //get the explore link's URL and text
  var exploreLinkURL = exploreSubnode.firstChild.getAttribute("href"),
      exploreLinkText = exploreSubnode.firstChild.firstChild.nodeValue;
  //set the explore link's URL and text to the values we just got
  exploreLinkElement.href = exploreLinkURL;
  exploreLinkNameElement.textContent = exploreLinkText;
  exploreLinkElement.style.visibility = "visible";

  //get the two optional subnodes (color 1, color 2) if they are both there, i.e. there are at least 4 subnodes
  if (nodeToUse.childElementCount >= 4) {
    var color1Subnode = exploreSubnode.nextSibling,
        color2Subnode = color1Subnode.nextSibling;
    //get the colors for the background gradient
    var color1 = color1Subnode.firstChild.nodeValue,
        color2 = color2Subnode.firstChild.nodeValue;
    //set the background gradient's colors to the values we just got
    gradientElement.setAttribute("style",
                                 "background-image: -webkit-linear-gradient(135deg, " + color1 + ", " + color2 + ");" +
                                 "background-image: -moz-linear-gradient(135deg, " + color1 + ", " + color2 + ");" +
                                 "background-image: -o-linear-gradient(135deg, " + color1 + ", " + color2 + ");" +
                                 "background-image: linear-gradient(135deg, " + color1 + ", " + color2 + ");"
                                );
  }
}
