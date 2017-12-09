const localhost = "http://localhost:5001/api";
const remotehost = "https://cecinestpasun.site/api";
const domain = localhost;

var rJSON = {
  "allTasks": undefined,
  "userInfo": {
    "name": undefined,
    "fbid": undefined,
    "email": undefined
  }
}

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
 * buildFBHTML
 * creates the Facebook header and login sections with custom data
 * @userName {String} the users name
 * @userId {String} the users facebook ID
 * @userEmail {String} the users email from FB
 * @imgHTML {String} the users image link
 */
function buildFBHTML (userName, userId, userEmail, imgHTML) {
  let userBar = [
    '<br><input class="btn blue darken-1" ',
    'type="button" value="Logout" onclick="Logout();"/>'
  ];
  let headerImgName = [
    imgHTML, '<h4 id="header-theme"><i>' + userName + '</i></h4>'
  ]
  let headerIdEmail = [
    '<b>id:</b> ' + userId + '<br><b>email:</b> ' + userEmail
  ]
  let imgName = $('#header-img-name');
  let idEmail = $('#header-id-email');
  let status = $('#status');
  imgName.text('');
  idEmail.text('')
  status.text('');
  imgName.append(headerImgName.join(''));
  idEmail.append(headerIdEmail.join(''));
  status.append(userBar.join(''));
}

/**
 * buildFBError
 * renders error if there is one
 * @code {Int} the error code
 * @message {String} the error message
 */
function buildFBError(code, message) {
  $('#status').text('');
  let userBar = [
    '<strong>ERROR login failure</strong><br>',
    '<strong>' + code + '</strong><br>',
    '<p>' + message + '</p>'
  ];
  $('#status').append(userBar.join(''));
}

/**
 * getRequestLoadTodoList
 * makes get request to backend to check for user data
 */
function getRequestLoadTodoList () {
  $.ajax({
    url: domain + '/' + rJSON['userInfo']['fbid'],
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      let newData
      if (data['error'] == undefined) {
	for (let key in data) {
	  if (!data.hasOwnProperty(key)) { continue; }
	  allTasks[key] = data[key];
	}
	$('#save-message').text('');
	newData = [
	  '<div class="left">',
	  '<i class="fa fa-tasks" aria-hidden="true"></i>',
	  '  Tasks Loaded!</div>'
	]
	$('#save-message').append(newData.join(''))
	todoApp.renderAllTasks();
      } else {
	$('#save-message').text('');
	let message = data['error']
	newData = [
	  '<div class="left">',
	  '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>',
	  message + '</div>'
	]
	$('#save-message').append(newData.join(''))
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

/**
 * getUserInfo
 * makes Facebook API request to get all user information
 */
function getUserInfo () {
  FB.api('/me?fields=name,email,id', function (response) {
    if (response.error == undefined) {
      let userName = response.name;
      let userId = response.id;
      let userEmail = response.email
      rJSON['userInfo']['name'] = userName;
      rJSON['userInfo']['fbid'] = userId;
      rJSON['userInfo']['email'] = userEmail;
      FB.api('/me/picture?type=normal', function (response2) {
	let userPhoto = response2.data.url;
	rJSON['userInfo']['photo'] = userPhoto;
	let imgHTML =
	    '<img id="header-image" class="left" src="' + userPhoto + '"/>';
	buildFBHTML(userName, userId, userEmail, imgHTML);
	getRequestLoadTodoList();
      });
    } else {
      buildFBError(response.code, response.error.message);
    }
  });
}

/**
 * Logout
 * calls Facebook API for logout
 */
function Logout () {
  FB.logout(function () { document.location.reload(); });
}

/**
 * checkFacebookStatus
 * checks user Facebook login/ authentication status
 */
function checkFacebookStatus () {
  $('#save-message').text('');

  FB.getLoginStatus(function(res){
    if ( res.status == "unknown" ){
      $('#fb-status-message').text('Logged Out');
    } else if ( res.status === 'connected' ) {
      getUserInfo()
      $('#fb-status-message').text('');
      let fbConnect =
	  '<i class="fa fa-facebook-square"></i> Connected to Facebook';
      $('#fb-status-message').append(fbConnect);
    }
  });
  FB.Event.subscribe('auth.authResponseChange', function (response) {
    if (response.status === 'connected') {
      $('#fb-status-message').text('Connected to Facebook');
    } else if (response.status === 'not_authorized') {
      $('#fb-status-message').text('Failed to Connect');
    } else {
      $('#fb-status-message').text('Logged Out');
    }
  });
}

/**
 * postRequestSaveTodoList
 * saves Todo list on backend if authenticated
 */
function postRequestSaveTodoList () {
  let newData
  if (typeof rJSON['userInfo']['name'] == 'undefined' ||
      typeof rJSON['userInfo']['fbid'] == 'undefined' ||
      typeof rJSON['userInfo'] ['email'] == 'undefined') {
    $('#save-message').text('');
    newData = [
      '<div class="left">',
      '<i class="fa fa-exclamation-triangle left" aria-hidden="true"></i>',
      ' you must authenticate to save!</div>'
    ]
    $('#save-message').append(newData.join(''));
  } else {
    rJSON['allTasks'] = allTasks;
    $.ajax({
      url: domain,
      type: 'POST',
      data: JSON.stringify(rJSON),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
	let message;
	if (data['error'] == undefined) {
	  message = data['success'];
	  $('#save-message').text('');
	  newData = [
	    '<div class="left">',
	    '<i class="fa fa-telegram" aria-hidden="true"></i>',
	    ' ' + message + '</div>'
	  ]
	  $('#save-message').append(newData.join(''));
	} else {
	  message = data['error'];
	  $('#save-message').text('');
	  newData = [
	    '<div class="left">',
	    '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>',
	    message + '</div>'
	  ]
	  $('#save-message').append(newData.join(''));
	}
      },
      error: function (data) {
	console.log(data);
      }
    });
  }
}

$(document).ready(function () {
  $(document).on('fbload', checkFacebookStatus);
  $('#saveTodoList').on('click', postRequestSaveTodoList );
});
