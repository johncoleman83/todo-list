// FB API initializer
window.fbAsyncInit = function () {
  FB.init({
    appId: '131891487494882',
    channelUrl: 'https://www.cecinestpasun.site/',
    status: true,
    cookie: true,
    xfbml: true
  });

  $(document).trigger('fbload');
};

// Load the SDK asynchronously
(function (d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));

function Login () {
  FB.login(function (response) {
    if (response.authResponse) {
      getUserInfo();
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {scope: 'email,user_likes,user_videos'});
}

function buildFBHTML (userName, userId, userEmail, imgHTML) {
  let userBar = [
    '<b>Name</b> : ' + userName + '<br>',
    '<b>id: </b>' + userId + '<br>',
    '<b>email: </b>' + userEmail + '<br>',
    '<input type="button" value="Logout" onclick="Logout();"/>',
    '<div id="fb_profile_image">' + imgHTML + '</div>'
  ];
  document.getElementById('status').innerHTML = userBar.join('');
}

function buildFBError(cod, message) {
  let userBar = [
    '<strong>ERROR login failure</strong><br>',
    '<strong>' + code + '</strong><br>',
    '<p>' + message + '</p>'
  ];
  document.getElementById('status').innerHTML = userBar.join('');
}

function getUserInfo () {
  FB.api('/me?fields=name,email,id', function (response) {
    if (response.error == undefined) {
      let userName = response.name;
      let userId = response.id;
      let userEmail = response.email
      FB.api('/me/picture?type=normal', function (response2) {
	let userPhoto = response2.data.url;
	let imgHTML = "<img src='" + userPhoto + "'/>";
	buildFBHTML(userName, userId, userEmail, imgHTML);
      });
    } else {
      buildFBError(response.code, response.error.message);
    }
  });
}

function Logout () {
  FB.logout(function () { document.location.reload(); });
}

function checkFacebookStatus () {

  FB.getLoginStatus(function(res){
    if ( res.status == "unknown" ){
      document.getElementById('message').innerHTML = '<br>Logged Out';
    } else if ( res.status === 'connected' ) {
      getUserInfo();
      document.getElementById('message').innerHTML = '<br>Connected to Facebook';
    }
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
}

$(document).ready(function () {
  $(document).on('fbload', checkFacebookStatus);
});
