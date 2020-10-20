
$(document).ready(function () {

  console.log("Ajai Gill 1015577")
  console.log("Information about sql injection and input sanitization:")
  console.log("One way you can prevent sql injection is to use prepared statements with parameterized queries. parameterized queries force devs to define sql code then pass in each parameter into the query. This allows the database to distinguish between code and data. Prepared statements prevent hackers from being able to change the intent of a query even if they manage to submit sql commands.")
  console.log("Another way you can prevent sql injection is to use stored procedures. This is very similar to parameterized queries but with stored procedures the sql commands are stored in the database and then called by the application. This is as good as parameterized queries.")
  console.log("Another way is to validate input or input sanitization. Validation is focusing on the fact that if inputs by the user target certain tables or columns that the code should catch this and ask for better inputs. the input should be processed in the front end before it reaches the database. Smart coding is needed for input validation to work. input sanitization is a little different where you look for aspects of the user input and remove the code, if there is any. This is best approached with tools already developed because it can be very difficult on your own. However it is not guarunteed to work everytime in every scenario.");
  console.log("There are more ways to prevent attack but the best ways are to use prepared statements with parameterized queries or stored procedures.")
  console.log("this information was obtained at https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html")

	$("#Login").click(function(event){

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
          if(result.error != 1)
          {
            location.reload(true);
          }
          else
          {
            $("#RequestResult").html(result.message);
          }
        }
  		});
    }
	});

  $("#GetBusinesses").click(function(event){

    var data = {location : $("#Location").val()}

    if(data.location === "")
    {
      $("#RequestResult").html('The field is empty');
    }
    else{
      $.ajax({
  		  type: "POST",
  		  url: '/getBusinesses',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
  		  success: function(result){

            let table = '<table class="table table-striped table-dark"><thead><tr><th scope="col">Name</th><th scope="col">Location</th><th scope="col">Rating</th><th scope="col">Image</th></tr></thead><tbody>'

            for (var i = 0; i < result.businesses.length; i++) {
              const htmlString = '<tr><td>' + result.businesses[i].name + '</td><td>' + result.businesses[i].location.address1 + '</td><td>' + result.businesses[i].rating + '</td><td><img src="' + result.businesses[i].image_url + '" style="width:150px;height:150px;"></img></td></tr>';

              table = table + htmlString;
            }

            table.concat('</tbody></table>');
            $("#RequestResult").html(table);
        }
  		});
    }
	});

  $("#Logout").click(function(event){
      $.ajax({
  		  type: "DELETE",
  		  url: '/user',
  		  success: function(result){
          location.reload(true);
        }
  		});
	});

});
