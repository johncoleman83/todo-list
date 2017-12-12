/**
 * fbAsyncInit
 * Facebook API Initializer
 */
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

(function (d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));

/**
 * Login
 * handles Facebook API for Login
 */
function Login () {
  FB.login(function (response) {
    if (response.authResponse) {
      getUserInfo();
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {scope: 'email,user_likes,user_videos'});
}

/**
 * Logout
 * calls Facebook API for logout
 */
function Logout () {
  FB.logout(function () { document.location.reload(); });
}
