$(document).ready(function () {

  console.log("Ajai Gill 1015577")

	$("#PostUser").click(function(event){

    var data = {username : $("#username").val(), password : $("#password").val()}
    console.log(data);

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
	});

  $("#GetUser").click(function(event){

    $.ajax({
		  type: "GET",
		  url: '/user',
		  success: function(result){
        $("#RequestResult").html(result);
      }
		});
	});

  $("#PutUser").click(function(event){

    $.ajax({
		  type: "PUT",
		  url: '/user',
		  success: function(result){
        $("#RequestResult").html(result);
      }
		});
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
