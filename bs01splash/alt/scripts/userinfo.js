function getUserInfo() {
  var userInfo = new XMLHttpRequest();
  userInfo.onreadystatechange = function() {
      if (userInfo.readyState == 4 && userInfo.status == 200) {
          setUserInfo(JSON.parse(userInfo.responseText));
      }
  };
  //Note that we can't use JSONP (i.e. putting the below URL in a script tag and setting a callback function),
  //because if we do, it will always return as if the user is logged out.
  //See https://www.mediawiki.org/wiki/API:Data_formats#Callback_restrictions
  userInfo.open("GET", "http://biosector01.com/wiki/api.php?action=query&meta=userinfo&uiprop=hasmsg|blockinfo&format=json", true);
  userInfo.send();
}

function setUserInfo(response) {
  var avatarElement = document.getElementById("avatar"),
      linkElement = document.getElementById("user-link");

  //determine which avatar to use
  if (response.query.userinfo.anon === undefined) {
    //if logged in
    if (response.query.userinfo.blockid === undefined) {
      //if not blocked
      avatarElement.setAttribute("src", "img/avatar-user.png");
      avatarElement.setAttribute("title", "You are logged in as " + response.query.userinfo.name);
    } else {
      avatarElement.setAttribute("src", "img/avatar-blocked.png");
      avatarElement.setAttribute("title", "You are blocked from editing");
    }

    //determine whether or not to show a new messages notification and to change the url from the user page to user talk
    if (response.query.userinfo.messages !== undefined) {
      //if there are new messages
      avatarElement.setAttribute("title", "You have new messages");
      linkElement.classList.toggle("new-messages");
      linkElement.setAttribute("href", "http://biosector01.com/wiki/index.php/User_talk:" + response.query.userinfo.name);
    } else {
      linkElement.setAttribute("href", "http://biosector01.com/wiki/index.php/User:" + response.query.userinfo.name);
    }
  }
}
