// Constsants
const nowTime = new Date();

// used for syncing modals with images
const index = {'count': 0};

window.fbAsyncInit = function () {
  FB.init({
    appId: '131891487494882', // our FB app
    channelUrl: 'https://www.cecinestpasun.site/',
    status: true, // check login status
    cookie: true,
    xfbml: true
  });

  FB.Event.subscribe('auth.authResponseChange', function (response) {
    if (response.status === 'connected') {
      document.getElementById('message').innerHTML = '<br>Connected to Facebook';
    } else if (response.status === 'not_authorized') {
      document.getElementById('message').innerHTML = '<br>Failed to Connect';
    } else {
      document.getElementById('message').innerHTML = '<br>Logged Out';
    }
  });
};

function Login () {
  FB.login(function (response) {
    if (response.authResponse) {
      getUserInfo();
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {scope: 'email,user_likes,user_videos'});
}
function getUserInfo () {
  FB.api('/me?fields=name,email,id', function (response) {
    console.log(response);
    if (response.error == undefined) {
      let userBar = [
        '<b>Name</b> : ' + response.name + '<br>',
        '<b>id: </b>' + response.id + '<br>',
        '<b>email: </b>' + response.email + '<br>',
        '<input type="button" value="Get Photo" onclick="getPhoto();"/>  ',
        '<input type="button" value="Logout" onclick="Logout();"/>',
        '<div id="fb_profile_image"></div>'
      ];
      document.getElementById('status').innerHTML = userBar.join('');
    } else {
      let userBar = [
        '<strong>ERROR login failure</strong><br>',
        '<strong>' + response.code + '</strong><br>',
        '<p>' + response.error.message + '</p>'
      ];
      document.getElementById('status').innerHTML = userBar.join('');
    }
  });
}

function getPhoto () {
  FB.api('/me/picture?type=normal', function (response) {
    var str = "<br/><b>Pic</b> : <img src='" + response.data.url + "'/>";
    document.getElementById('fb_profile_image').innerHTML = str;
  });
}

function Logout () {
  FB.logout(function () { document.location.reload(); });
}

// Load the SDK asynchronously
(function (d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));
