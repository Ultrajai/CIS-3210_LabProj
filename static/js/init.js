//var sessionID = -1;

$(document).ready(function () {

  console.log("Ajai Gill 1015577")

	$("#PostUser").click(function(event){

    var data = {username : $("#username").val(), password : $("#password").val()}

    if(data.username === "" || data.password === "")
    {
      $("#RequestResult").html('One or more fields are empty');
    }
    else{
      $.ajax({
  		  type: "POST",
  		  url: '/user',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
  		  success: function(result){
          $("#RequestResult").html(result);
        }
  		});
    }
	});

  $("#GetUser").click(function(event){
      $.ajax({
  		  type: "GET",
  		  url: '/user',
  		  success: function(result){

          var html = "<table class='table table-dark'><tr><th>Username</th><th>Password</th></tr>"
          for (var i = 0; i < result.results.length; i++) {
            html = html + "<tr><td>" + result.results[i][0] + "</td><td>" + result.results[i][1] + "<td></tr>";
          }

          html = html + "</table>"

          $("#RequestResult").html(result.message +"<br>"+html);

          //sessionID = result.sessionID;
        }
  		});
	});

  $("#PutUser").click(function(event){

    var data = {username : $("#username").val(), oldPassword : $("#oldPassword").val(), newPassword : $("#newPassword").val()}

    if(data.username === "" || data.oldPassword === "" || data.newPassword === '')
    {
      $("#RequestResult").html('One or more fields are empty');
    }
    else{
      $.ajax({
  		  type: "PUT",
  		  url: '/user',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
  		  success: function(result){
          $("#RequestResult").html(result);
        }
  		});
    }
	});

  $("#DeleteUser").click(function(event){

    var data = {username : $("#username").val(), password : $("#password").val()}

    if(data.username === "" || data.password === "")
    {
      $("#RequestResult").html('One or more fields are empty');
    }
    else{
      $.ajax({
  		  type: "DELETE",
  		  url: '/user',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
  		  success: function(result){
          $("#RequestResult").html(result);
        }
  		});
    }
  });
});
