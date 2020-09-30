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
  		  url: '/createUser',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
  		  success: function(result){
          $("#RequestResult").html(result);
        }
  		});
    }
	});

  $("#LoginUser").click(function(event){
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
          $("#RequestResult").html(result.message + " you are logged in as session #" + result.sessionID);
        }
  		});
    }
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

    $.ajax({
		  type: "DELETE",
		  url: '/user',
		  success: function(result){
        $("#RequestResult").html(result);
      }
		});
	});

});
