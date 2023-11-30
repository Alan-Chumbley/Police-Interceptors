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
            latLon = {latitude: data.lat, longitude: data.lon};
            console.log("latLon = " + latLon.longitude + " " + latLon.longitude);
            return;
        // police data handling
        case "policeApi":
            // update global with data as current returned array
            crimeData = data;
            console.log("Police data: ", crimeData);
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
            } else {
                // search city name -- BUG FOUND -- LOCATION ON POST CODE SEARCHED BUT NOT WITH CITY NAMES!! -- unsure why but will work on a fix
                path = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",GB&appid=" + apiKey;   
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

// MAPBOX CALLS AND DATA HANDLING ---------------------------------------------------------------------------

// map key - ALANS API- please don't run an infinite loop $$$ - no worries wont do that, Ian :P 
// AccessToken syntax for API key within MapBox
mapboxgl.accessToken = MAPBOX_KEY;

// fetch users current location
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
    // console.log(map[0]);
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
