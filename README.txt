How to run/access:
    1) To run this website copy this "flask run --host=0.0.0.0 --port=15577" into the command prompt and press enter
    2) Access the website at CIS*3210.socs.uoguelph.ca:15577

Added Features:
  - A favourite button on all restaurants
  - you can only save favourites when logged in
      - favouriting without an account literally does nothing
  - You can then take a look at a page called user directory where all user favourited
    restaurants are displayed
      - you must click load favourites in the accordion if you want to view
  - Any instance of a business you have favourited will be displayed as favourited already
  - Unfavouriting is as simple as clicking the favourite button again

Issue to look out for:
  - The API used may not always respond and so an error will be displayed in the console
      - Restarting the server will fix the issue usually (just do it until it works without error)
