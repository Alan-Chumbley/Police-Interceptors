// GLOBALS ---------------------------------------------------------------------------------------------------

// API KEY VARIABLES
const GEO_KEY = "8e65421b6e97a45d703a871ea4e78c3a";
// Search bar location - set to london to start, docs state we can also use post codes in the search
let city = "nn1";
let latLon;


// NO LONGER GOOGLE, USING MAPBOX - Alans key, be careful
const MAPBOX_KEY = "pk.eyJ1IjoiY2h1bWJhIiwiYSI6ImNscGw5a2k1NjAxemwybG83ZmE0ZGplYmYifQ.1MecnWfHuhj0e8vo1cYCkw";
let map = [];

// Police API no longer needs key
const POLICE_KEY = "";
// IMPORTANT TO NOTE: when searching 1992 I came up with 0 results, api logged 501 and 501, the data
// doesnt exist, so we will need to find out specifically how far back we can go to prevent errors
// by user trying to search D.O.B data, because apparently I am now too old to see crime where I was 
// born :'( 
let monthSearched = "2021-01";
let crimeData;

// API CALLS AND DATA HANDLING ------------------------------------------------------------------------------

// handle returned data from calls
function handleData(data, apiName) {
    // console.log("handle data lat: ", data.lat, data.lon);

    // switch data structure depending on api call
    switch(apiName) {
        // geocoder call
        case "geoCode":
            // assign global variable
            if (/\d/.test(city)) {
                // search postcode
                latLon = {latitude: data.lat, longitude: data.lon};
                // console.log(latLon);
            } else {
                // search city name -- BUG FIXED -- structure of api return was different for the postcode vs the city name
                latLon = {latitude: data[0].lat, longitude: data[0].lon};
                // console.log(latLon);
            }
            return;
        // police data handling
        case "policeApi":
            // update global with data as current returned array
            crimeData = data;
            // console.log("Police data: ", crimeData); 
            tally(crimeData);
            return;
        default:
            return "error in handling of data";
    }

}

// create re-usable api call, takes api, apikey as args
async function callAPI(apiName, apiKey) {
    // declare storage value and path
    let path;

    // change api path dependent on api name
    switch(apiName) {
        // Geocoder pathing
        case "geoCode":
            // check if location is postcode input (check for numbers)
            if (/\d/.test(city)) {
                // search postcode
                path = "http://api.openweathermap.org/geo/1.0/zip?zip=" + city + ",GB&appid=" + apiKey;
                // console.log(path);
            } else {
                // search city name -- BUG FOUND -- LOCATION ON POST CODE SEARCHED BUT NOT WITH CITY NAMES!! -- unsure why but will work on a fix
                path = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",GB&appid=" + apiKey;   
                // console.log(path);
            }
            break;
        case "policeApi":
            // This link functions correctly and we have the data as a huge (835 total for just NN1) array of objects, need to figure out how to filter through it all
            path = "https://data.police.uk/api/crimes-street/all-crime?lat=" + latLon.latitude + "&lng=" + latLon.longitude + "&date=" + monthSearched;
            break;
        default:
            path = "";
            console.log("error, no api link found");
            return;
    }

    // fetch the currently assigned path
    await fetch(path)
        // handle response
        .then(response => {
            // catch failed status response 
            if (!response.ok) {
                // handle error message
                const message = `An error occurred: ${response.status} from ${apiName}`;
                throw new Error(message);        
            }
            // json formatting
            return response.json();
        })
        // handle data
        .then(data => {
            // handle data separately, return value assigned within that funciton.
            // console.log(data);
            handleData(data, apiName);
            return;
        })
        // further catch error status
        .catch(error => console.log(apiName + " " + error));
}

// Delayed call for data to ensure lat lon
function apiDelayedCall() {
    setTimeout(() => {
        callAPI("policeApi", POLICE_KEY);
        setupMap([latLon.longitude, latLon.latitude]);
    }, 3000);
}

apiDelayedCall();

//search button ======
$("#search-button").on("click", function(event) { //click event listener to the search button
    event.preventDefault();
    console.log("Button Clicked!");
    var location = $('#search-input').val();
    console.log("USER INPUT Location: " + location);

    //checks to see if #searc- button element clicked and says sets it to true
    $(this).data('clicked', true); 
});


var input = document.getElementById("search-input");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
    event.preventDefault();
    console.log("Location by Enter: " + input.value);

      // Check if the button was clicked before Enter was pressed- could be used for mobile 
    var buttonClicked = $("#search-button").data('clicked');
    if (!buttonClicked) {
        console.log("Enter key pressed without button click");
        //if button is not clicked then let the console know 
    }
    }
});




// //   map key - ALANS API- please don't run an infinite loop $$$
mapboxgl.accessToken = 'pk.eyJ1IjoiY2h1bWJhIiwiYSI6ImNscGw5a2k1NjAxemwybG83ZmE0ZGplYmYifQ.1MecnWfHuhj0e8vo1cYCkw';


   //current location
navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
});
// handle sucess call of geolocation
function success(position) {
    // function call for mapbox, current location
    setupMap([position.coords.longitude, position.coords.latitude])//
}
// if user disables access to location, provide a default
function error() {
    // default location
    setupMap([-0.083094, 51.511177]);
}


// function to create map on latlon 
function setupMap(lonlat) {
    // push new map to array (handle local storage for this)
    map.push(new mapboxgl.Map({
        // mapbox settings
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: lonlat, //centre location on page
        zoom: 14
    }));
    // console.log(map);
    console.log(map[0]);
}


// SEARCH BUTTON FUNCTIONS ----------------------------------------------------------------------------------

// handle search button click
$("#search-button").on("click", function(event){
    // console.log("Button Clicked!");
    // link up location to search with global
    city = $('#search-input').val();
    // call geocode
    callAPI("geoCode", GEO_KEY);
    // call delayed police data to ensure latLon update
    apiDelayedCall();
});

// handle search with return key same as search button
$("#search-input").on('keypress', function(event) {
    if (event.key == 'Enter') {
        // prevent form refresh default
        event.preventDefault();
        city = event.target.value;
        callAPI("geoCode", GEO_KEY);
        apiDelayedCall();
    }
    
});

  //map settings centered to be more intuitive
function setupMap(center) {
    var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
     center: center, //centre location on page
    zoom: 14
    
    })
    return map;
}
//hide elements after click

//gets rid of search button
//BLOCKER: bot submit and click events perform bugs
function hide() {
    
    var setupMap = document.getElementById('search-input').value;

    if (setupMap!== '') {
        // Hide the input if user has submitted location
        document.getElementById('search-group').style.display = 'none';
    }
}

// Add an event listener to the search button to trigger the 'hide()' function on click
document.getElementById('search-group').addEventListener('submit', hide);

//darkmode
var mapBox; 
var mode = "light"; //base variable. What is default map
var mapStyle = "mapbox://styles/mapbox/streets-v11"; // 
 // have to call the map setup back in order to 
function setupMap(center) { 
    mapBox = new mapboxgl.Map({
        container: "map", 
        style: mapStyle,
        center: center,
        zoom: 14
    });
}

 // Function changing map style
function changeMapStyle(style) {
    mapBox.setStyle(style);
}

 // Event listener for the theme switcher button
var themeSwitcherBtn = document.getElementById('themeSwitcherbtn');
themeSwitcherBtn.addEventListener('click', function() {
    //call back changemapstyle again if = light mode
    if (mode === "light") {
        mode = "dark";
        console.log("themeSwitcherbtn Clicked! "+ themeSwitcherBtn)
        //update the definition of dark with the dark styling
        changeMapStyle("mapbox://styles/mapbox/dark-v11");
        //else just light mode
    } else {
        mode = "light";
        changeMapStyle("mapbox://styles/mapbox/streets-v12");
    }
});


  //Tally up number of crimes by creating variable for each
  //For loop to tally up total adding one each other
  //if/else statement to work out if the data matches the data presented in the table
  //access text of number of crimes - get element by ID = type of crime variable


function tally(data) {

    var antiSocialBehaviour = 0;
    var burglary = 0;
    var drugs = 0;
    var vehicleCrime = 0;
    var violentCrime = 0;

    for (let index = 0; index < data.length; index++) {
        const category = data[index].category;
    if (category === "anti-social-behaviour") {
        antiSocialBehaviour += 1;
    }  
    else if (category === "burglary") {
        burglary += 1;
    }
    else if (category === "drugs") {
        drugs += 1; 
    }
    else if (category === "vehicle-crime") {
        vehicleCrime += 1;
    }
    else if (category === "violent-crime") {
    violentCrime += 1;
    }
    }
    document.getElementById("crime1").innerText = antiSocialBehaviour;
    document.getElementById("crime2").innerText = burglary;
    document.getElementById("crime3").innerText = drugs;
    document.getElementById("crime4").innerText = vehicleCrime;
    document.getElementById("crime5").innerText = violentCrime;

}

//Replace name of location by getting the searched name and display it inside of:
//"Top reported crimes in..." - created a span to hold this name.

//function getLocation () {}
//var locationName = getElementById("search-input").value;
//document.getElementById("nameofPlace").innerText = locationName;
//}
//Review this as it looks like a variable has already been created above.

// function calls 

callAPI("geoCode", GEO_KEY);

//load results after search btn clicked
var searchBtn = document.querySelector('#search-button');
var areaInfoDiv = document.querySelector('.areaInfo');
var mapDisplay = $('#map');

//display crime info on search
// Add event listener to the button for click event
searchBtn.addEventListener("click", () => {
    // Toggle the display of areaInfo div
    if (areaInfoDiv.style.display === 'none' || areaInfoDiv.style.display === '') {
        areaInfoDiv.style.display = 'flex';
    } else {
        areaInfoDiv.style.display = 'none';
    }
 
});



   
callAPI("geoCode", GEO_KEY);
