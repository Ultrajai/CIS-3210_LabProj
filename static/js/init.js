const favourited = [];
let user = '';

function loadReviews(element)
{
  $(element).hide()

  $.ajax({
    type: "POST",
    url: '/getReviews',
    data: JSON.stringify({ID: element.attributes['data-id'].value}),
    dataType: 'json',
    contentType: 'application/json',
    success: function(response){

      $('#' +element.attributes['data-to'].value).empty();

      for (var i = 0; i < response.reviews.length; i++) {
        $('#' +element.attributes['data-to'].value).append('<blockquote class="blockquote text-center"><p class="mb-0">' + response.reviews[i].text + '</p><footer class="blockquote-footer">' + response.reviews[i].user.name + '(' + response.reviews[i].rating + ' Star Rating)</footer></blockquote>');
      }

  }});
}

function favourite(element)
{

  if(element.attributes['data-favourited'].value == 'false')
  {
    $.ajax({
      type: "POST",
      url: '/favourite',
      data: JSON.stringify({storeID: element.attributes['data-id'].value}),
      dataType: 'json',
      contentType: 'application/json'
    });

    favourited.push(element.attributes['data-id'].value);

    element.attributes['data-favourited'].value = 'true';
    element.attributes['class'].value = 'btn btn-outline-primary active'
  }
  else {
    $.ajax({
      type: "DELETE",
      url: '/favourite',
      data: JSON.stringify({storeID: element.attributes['data-id'].value}),
      dataType: 'json',
      contentType: 'application/json'
    });

    favourited.splice(favourited.indexOf(element.attributes['data-id'].value), 0);

    element.attributes['data-favourited'].value = 'false';
    element.attributes['class'].value = 'btn btn-outline-primary'
  }
}

$(document).ready(function () {

  console.log("Ajai Gill 1015577");
  /*console.log("Information about sql injection and input sanitization:")
  console.log("One way you can prevent sql injection is to use prepared statements with parameterized queries. parameterized queries force devs to define sql code then pass in each parameter into the query. This allows the database to distinguish between code and data. Prepared statements prevent hackers from being able to change the intent of a query even if they manage to submit sql commands.")
  console.log("Another way you can prevent sql injection is to use stored procedures. This is very similar to parameterized queries but with stored procedures the sql commands are stored in the database and then called by the application. This is as good as parameterized queries.")
  console.log("Another way is to validate input or input sanitization. Validation is focusing on the fact that if inputs by the user target certain tables or columns that the code should catch this and ask for better inputs. the input should be processed in the front end before it reaches the database. Smart coding is needed for input validation to work. input sanitization is a little different where you look for aspects of the user input and remove the code, if there is any. This is best approached with tools already developed because it can be very difficult on your own. However it is not guarunteed to work everytime in every scenario.");
  console.log("There are more ways to prevent attack but the best ways are to use prepared statements with parameterized queries or stored procedures.")
  console.log("this information was obtained at https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html")*/

  $.ajax({
    type: "PUT",
    url: '/favourite',
    data: JSON.stringify({username: user}),
    dataType: 'json',
    contentType: 'application/json',
    success: function(response){
      for (var i = 0; i < response.ids.length; i++) {
        favourited.push(response.ids[i][0]);
      }
    }
  });

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
          user = data.username;

          if(result.error != 1)
          {
            location.reload(true);
          }
        }
  		});
    }
	});

  $("#GetBusinesses").click(function(event){

    let data = {location : $("#Location").val(), limit: $("#amount").val()}

    if(!(data.location === "")){
      $.ajax({
  		  type: "POST",
  		  url: '/getBusinesses',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
  		  success: function(result){
            let cards = [];
            let rows = [];
            let modals = [];

            $("#container").empty();
            $("#modalList").empty();

            for (let i = 0; i < result.businesses.length; i++) {

              if(favourited.includes(result.businesses[i].id))
              {
                const cardHtml ='<div class="card"><img class="card-img-top" width="208" height="208" src="' + result.businesses[i].image_url + '" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + result.businesses[i].name + '</h5><a href="#" class="btn btn-primary" data-toggle="modal" data-target="#modal' + i + '">Reviews</a><button data-id="' + result.businesses[i].id + '" data-favourited="true" type="button" onclick="favourite(this)" class="btn btn-outline-primary active"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg></button></div></div>';
                let modalHtml = '<div class="modal fade blackText" id="modal' + i + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalTitle">' + result.businesses[i].name + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="modalBody"><a type="button" class="btn btn-link" href="' + result.businesses[i].url + '">Yelp Page</a><h1>Reviews</h1><button type="button" class="btn btn-primary" onclick="loadReviews(this)" data-to="reviewBody' + i + '" data-id="' + result.businesses[i].id + '">Load Reviews</button><div id="reviewBody' + i + '"></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>';

                cards.push(cardHtml);
                modals.push(modalHtml);
              }
              else {
                const cardHtml ='<div class="card"><img class="card-img-top" width="208" height="208" src="' + result.businesses[i].image_url + '" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + result.businesses[i].name + '</h5><a href="#" class="btn btn-primary" data-toggle="modal" data-target="#modal' + i + '">Reviews</a><button data-id="' + result.businesses[i].id + '" data-favourited="false" type="button" onclick="favourite(this)" class="btn btn-outline-primary"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg></button></div></div>';
                let modalHtml = '<div class="modal fade blackText" id="modal' + i + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalTitle">' + result.businesses[i].name + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="modalBody"><a type="button" class="btn btn-link" href="' + result.businesses[i].url + '">Yelp Page</a><h1>Reviews</h1><button type="button" class="btn btn-primary" onclick="loadReviews(this)" data-to="reviewBody' + i + '" data-id="' + result.businesses[i].id + '">Load Reviews</button><div id="reviewBody' + i + '"></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>';

                cards.push(cardHtml);
                modals.push(modalHtml);
              }

            }


            for (let i = 0; i < cards.length;) {
              let rowHtml = '<div class="card-deck">';
              rowHtml = rowHtml + cards[i];

              if((i + 1) < cards.length)
              {
                rowHtml = rowHtml + cards[i + 1];
              }

              if((i + 2) < cards.length)
              {
                rowHtml = rowHtml + cards[i + 2];
              }

              i = i + 3;
              rowHtml = rowHtml + '</div>';
              rows.push(rowHtml);
            }

            for (let i = 0; i < rows.length; i++) {
              $("#container").append(rows[i]);
            }

            for (let i = 0; i < modals.length; i++) {
              $("#modalList").append(modals[i]);
            }
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
