const users = [];
const delay = ms => new Promise(res => setTimeout(res, ms));
let modalNum = 0;


function loadFavourites(element){

  $(element).hide();
  $("#container"+element.attributes['data-place'].value).append('<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>');

  $.ajax({
    type: "PUT",
    url: '/favourite',
    data: JSON.stringify({username: element.attributes['data-username'].value}),
    dataType: 'json',
    contentType: 'application/json',
    success: async function(response){

      let cards = [];
      let rows = [];
      let modals = [];


      for (var i = 0; i < response.ids.length; i++) {

        id = response.ids[i][0];

        await $.ajax({
          type: "POST",
          url: '/getOneBusiness',
          data: JSON.stringify({ID: id}),
          dataType: 'json',
          contentType: 'application/json',
          success: function(result){
            if(favourited.includes(response.ids[i][0]))
            {
              const cardHtml ='<div class="card blackText"><img class="card-img-top" width="208" height="208" src="' + result.image_url + '" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + result.name + '</h5><a href="#" class="btn btn-primary" data-toggle="modal" data-target="#modal' + modalNum + i + '">Reviews</a><button data-id="' + result.id + '" data-favourited="true" type="button" onclick="favourite(this)" class="btn btn-outline-primary active"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg></button></div></div>';
              let modalHtml = '<div class="modal fade blackText" id="modal' + modalNum + i + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalTitle">' + result.name + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="modalBody"><a type="button" class="btn btn-link" href="' + result.url + '">Yelp Page</a><h1>Reviews</h1><button type="button" class="btn btn-primary" onclick="loadReviews(this)" data-to="reviewBody' + modalNum + i + '" data-id="' + result.id + '">Load Reviews</button><div id="reviewBody' + modalNum + i + '"></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>';

              cards.push(cardHtml);
              modals.push(modalHtml);
            }
            else {
              const cardHtml ='<div class="card blackText"><img class="card-img-top" width="208" height="208" src="' + result.image_url + '" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + result.name + '</h5><a href="#" class="btn btn-primary" data-toggle="modal" data-target="#modal' + modalNum + i + '">Reviews</a><button data-id="' + result.id + '" data-favourited="false" type="button" onclick="favourite(this)" class="btn btn-outline-primary"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg></button></div></div>';
              let modalHtml = '<div class="modal fade blackText" id="modal' + modalNum + i + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalTitle">' + result.name + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="modalBody"><a type="button" class="btn btn-link" href="' + result.url + '">Yelp Page</a><h1>Reviews</h1><button type="button" class="btn btn-primary" onclick="loadReviews(this)" data-to="reviewBody' + modalNum + i + '" data-id="' + result.id + '">Load Reviews</button><div id="reviewBody' + modalNum + i + '"></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>';

              cards.push(cardHtml);
              modals.push(modalHtml);
            }

          }});

        await delay(2000); // delay 2 seconds
      }

      modalNum += response.ids.length;
      console.log(modalNum)

      for (let j = 0; j < cards.length;) {
        let rowHtml = '<div class="card-deck">';
        rowHtml = rowHtml + cards[j];

        if((j + 1) < cards.length)
        {
          rowHtml = rowHtml + cards[j + 1];
        }

        if((j + 2) < cards.length)
        {
          rowHtml = rowHtml + cards[j + 2];
        }

        j = j + 3;
        rowHtml = rowHtml + '</div>';
        rows.push(rowHtml);
      }

      $("#container"+element.attributes['data-place'].value).empty()

      for (let j = 0; j < rows.length; j++) {
        $("#container"+element.attributes['data-place'].value).append(rows[j]);
      }

      for (let j = 0; j < modals.length; j++) {
        $("#modalList").append(modals[j]);
      }
    }
  });
}

$(document).ready(function () {

  $.ajax({
    type: "GET",
    url: '/user',
    success: function(response){
      for (var i = 0; i < response.users.length; i++) {
        users.push(response.users[i]);
        const cardHTML = '<div class="card"><div class="card-header" id="heading' + i + '"><h5 class="mb-0"><button class="btn btn-link" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">' + response.users[i] + '\'s favourites</button></h5></div><div id="collapse' + i + '" class="collapse" aria-labelledby="heading' + i + '" data-parent="#accordion"><div class="card-body"><div class="container" id="container' + i + '"></div><button type="button" class="btn btn-primary" data-place="' + i + '" data-username="' + response.users[i] + '" onclick="loadFavourites(this)" >Load Favourites</button></div></div></div>';
        $('#accordion').append(cardHTML);
      }
    }});

});
