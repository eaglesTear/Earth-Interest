# Earth-Interest
An informative, educational and interesting app utilising Node package APIs. Access basic information on any country in the world.

To load the file, just head to localhost/3000 in your browser with your express.js server running.

Run app.js and then load the html pages.

Uses 'bootstrap-select' to style the dropdown menus.

I discovered some errors in the node packages I used, such as undefined data in its arrays. 
I have looped through these and skipped them via 'continue', so as not to display "undefined" in the country select array.

There are two main search sections in the nav: both allow the selection of countries and the returning of information, but each one returns different data.
