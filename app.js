// Load express server, body parser, countriesDB and world-countries-capitals & ejs
const express = require("express");
const bodyParser = require("body-parser");
const country = require("countryjs");
const wcc = require("world-countries-capitals");
const ejs = require("ejs");

// Invoke express functionality
const app = express();

// Initialise ejs templating as express view engine
app.set("view engine", "ejs");

// Allow sending of static pages via express
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

// Store random country to as user choice and display random country on home page
let random;
// Access country objects for both node packages
const allCountries = wcc.getAllCountries();
const allCountriesList2 = country.all();

/* User makes first request to server, they get the search page (home / index). This is rendered via EJS. A 'random' and 'allCountries' data var is passed into the index page, in order to allow both a random country to be shown as an option in the dropdown select, and for all the countries to be looped through to create the dropdown menu. */ 
app.get("/", (request, response) => {

    random = wcc.getRandomCountry();

    response.render("index", {
        random: random,
        allCountries: allCountries
    });
    
});

// Render second country search page via link: User can access different data here
app.get("/extras", (req, res) => {

    res.render("extras", {
        allCountriesList2: allCountriesList2
    });

});

// Send back second country data set depending on user country choice
app.post("/extras", (req, res) => {

    // Render the country name in caps for title of page
    let countryUpperCase;
    
    // Ready a new array to hold node package country data
    const countryData2 = [];
    // Wiki link for country is dynamic and set by user, so var is not fixed 
    let countryLink;
    // Set the heading text to display along with the actual country timezone 
    let timezones = "Timezones:";
    
    // Set the headings for each data type, corresonding with the 'allCountries2' data array
    const items = ["Native Name:", "Demonym:", "Population:", "Region:", "Subregion:", timezones, "Provinces:", "Wiki:"];

    // Store users input from the dropdown menu
    let userInput2 = req.body.userInput2;

    for (let i = 0; i < allCountriesList2.length; i++) {
        
        if (userInput2 === allCountriesList2[i].name) {
            countryData2.push(
                allCountriesList2[i].nativeName,
                allCountriesList2[i].demonym,
                allCountriesList2[i].population,
                allCountriesList2[i].region,
                allCountriesList2[i].subregion,
                allCountriesList2[i].timezones,
                allCountriesList2[i].provinces);
            
            countryUpperCase = allCountriesList2[i].name.toUpperCase();
            countryLink = allCountriesList2[i].wiki;
        }
        
        for (let i = 0; i < countryData2.length; i++) {
            if (countryData2[i] === null) {
         items[5] = `Timezone data is not available for ${countryUpperCase}`;
    }
        }
        
    }
    
    res.render("country2", {
        allCountriesList2: allCountriesList2,
        countryData2: countryData2,
        countryUpperCase: countryUpperCase,
        countryLink: countryLink,
        items: items
    });
});

// Process form / user input & return country page with requested data
app.post("/", (req, res) => {

    // Store a random country, should a user wish to use that option
    random = wcc.getRandomCountry();

    // Try and safely catch user input and server errors
    try {

        // Store user input
        const userInput = req.body.userInput;
        // Enable user input as the parameter for country selection
        const countryData = wcc.getCountryDetailsByName(userInput);
        // Note CAP letter here to differentiate from package 'country' method
        const Country = countryData[0];

        let landlocked;

        const countryDataArray = [
            Country.country,
            "Capital City: " + Country.capital,
            "Currency: " + Country.currency,
            "Famous for: " + Country.famous_for,
            "Drive Direction: " + Country.drive_direction,
            "Area: " + Country.area.mi2 + " (km2)",
            "Constitution: " + Country.constitutional_form,
        ];

        // Render the country name in caps for title of page
        const countryUpperCase = countryDataArray[0].toUpperCase();
        // Store the country's flag object
        const flag = Country.flag;

        if (Country.is_landlocked === true) {
            landlocked = "landlocked and has no access to any oceans or seas";
        } else {
            landlocked = "not landlocked and has access to oceans or seas";
        }
        // Send the landlocked message to data array for iteration and output
        countryDataArray.push(`This country is ${landlocked}`);

        res.render("country", {
            random: random,
            countryDataArray: countryDataArray,
            landlocked: landlocked,
            flag: flag,
            Country: Country.country,
            countryUpperCase: countryUpperCase,
            allCountries: allCountries,
        });

    } catch (err) {
        res.sendFile(__dirname + "/error.html");
    }

});

app.post("/error.html", (request, response) => {
    response.redirect("/");
});

// Wait for a valid connection & verify server is operating
app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
