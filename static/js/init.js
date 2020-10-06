//var sessionID = -1;

$(document).ready(function () {

  console.log("Ajai Gill 1015577")
  console.log("Information about sql injection and input sanitization:")
  console.log("One way you can prevent sql injection is to use prepared statements with parameterized queries. parameterized queries force devs to define sql code then pass in each parameter into the query. This allows the database to distinguish between code and data. Prepared statements prevent hackers from being able to change the intent of a query even if they manage to submit sql commands.")
  console.log("Another way you can prevent sql injection is to use stored procedures. This is very similar to parameterized queries but with stored procedures the sql commands are stored in the database and then called by the application. This is as good as parameterized queries.")
  console.log("Another way is to validate input or input sanitization. Validation is focusing on the fact that if inputs by the user target certain tables or columns that the code should catch this and ask for better inputs. the input should be processed in the front end before it reaches the database. Smart coding is needed for input validation to work. input sanitization is a little different where you look for aspects of the user input and remove the code, if there is any. This is best approached with tools already developed because it can be very difficult on your own. However it is not guarunteed to work everytime in every scenario.");
  console.log("There are more ways to prevent attack but the best ways are to use prepared statements with parameterized queries or stored procedures.")
  console.log("this information was obtained at https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html")

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
