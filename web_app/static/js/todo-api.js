/* API */
const localhost = "http://localhost:5001/";
const remotehost = "https://cecinestpasun.site/";
const domain = localhost;

var rJSON = {
  "allTasks": allTasks,
  "name": userName,
  "id": userId,
  "email": userEmail,
  "photo": userPhoto
}

function saveTodoList () {
  $.ajax({
    url: domain,
    type: 'POST',
    data: JSON.stringify(rJSON),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      //console.log('success');
      //console.log(data);
    },
    error: function (data) {
      //console.log('error');
      //console.log(data);
    }
  });
}


$(document).ready(function () {
  $('#saveTodoList').on('click', saveTodoList );
});
