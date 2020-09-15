$(document).ready(function () {

	var links = null;

  // Load Links
	clippy.load('Links', function(agent) {
			agent.show();


			//Link's ears go whoop
	    $('#alert-button').click(function () {
				agent.play('Alert');
	    });

			//Link smears your screen with paint *sigh*
			$('#artsy-button').click(function () {
				agent.play('GetArtsy');
	    });

		});
});
