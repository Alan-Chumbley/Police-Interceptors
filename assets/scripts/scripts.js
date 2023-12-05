// // GLOBALS -----------------------------------------------------------

// // API KEY VARIABLES
// const GEO_KEY = "8e65421b6e97a45d703a871ea4e78c3a";
// // Search bar location - set to london to start, docs state we can also use post codes in the search
// let city = "nn1";
// let latLon;
  
// // Blocker: -- API call cost etc, do we want to use the api or use the iframe:
// /**
// <iframe
//     width="600"
//     height="450"
//     style="border:0"
//     loading="lazy"
//     allowfullscreen
//     referrerpolicy="no-referrer-when-downgrade"
//     src="https://www.google.com/maps/embed/v1/place?key=API_KEY
//     &q=Space+Needle,Seattle+WA">
// </iframe>
//  */
// const GOOGLE_KEY = "";

// // Police API no longer needs key
// const POLICE_KEY = "";
// // IMPORTANT TO NOTE: when searching 1992 I came up with 0 results, api logged 501 and 501, the data
// // doesnt exist, so we will need to find out specifically how far back we can go to prevent errors
// // by user trying to search D.O.B data, because apparently I am now too old to see crime where I was 
// // born :'( 
// let monthSearched = "2021-01";
// let crimeData;

// // API CALLS AND DATA HANDLING

// // handle returned data from calls
// function handleData(data, apiName) {
//     // console.log("handle data lat: ", data.lat, data.lon);

//     // switch data structure depending on api call
//     switch(apiName) {
//         // geocoder call
//         case "geoCode":
//             // assign global variable
//             latLon = {latitude: data.lat, longitude: data.lon};
//             // console.log("latLon = " + latLon.longitude + " " + latLon.longitude);
//             return;
//         // google maps handling - current blocker
//         case "googleMap":
//             return "google data";
//         // police data handling
//         case "policeApi":
//             // update global with data as current returned array
//             crimeData = data;
//             console.log("Police data: ", crimeData); 
//             tally(crimeData);
//             return;
//         default:
//             return "error in handling of data";
//     }

// }

// // create re-usable api call, takes api, apikey as args
// async function callAPI(apiName, apiKey) {
//     // declare storage value and path
//     let path;

//     // change api path dependent on api name
//     switch(apiName) {
//         // Geocoder pathing
//         case "geoCode":
//             // check if location is postcode input (check for numbers)
//             if (/\d/.test(city)) {
//                 // search postcode
//                 path = "http://api.openweathermap.org/geo/1.0/zip?zip=" + city + ",GB&appid=" + apiKey;   
//             } else {
//                 // search city name -- BUG FOUND -- LOCATION ON POST CODE SEARCHED BUT NOT WITH CITY NAMES!! -- unsure why but will work on a fix
//                 path = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",GB&appid=" + apiKey;   
//             }
//                 break;
//         // Google map pathing
//         case "googleMap":
//             path = "";
//             console.log(path);
//             break;
//         case "policeApi":
//             // This link functions correctly and we have the data as a huge (835 total for just NN1) array of objects, need to figure out how to filter through it all
//             path = "https://data.police.uk/api/crimes-street/all-crime?lat=" + latLon.latitude + "&lng=" + latLon.longitude + "&date=" + monthSearched;
//             break;
//         default:
//             path = "";
//             console.log("error, no api link found");
//             return;
//     }

//     // fetch the currently assigned path
//     await fetch(path)
//         // handle response
//         .then(response => {
//             // catch failed status response 
//             if (!response.ok) {
//                 // handle error message
//                 const message = `An error occurred: ${response.status} from ${apiName}`;
//                 throw new Error(message);        
//             }
//             // json formatting
//             return response.json();
//         })
//         // handle data
//         .then(data => {
//             // handle data separately, return value assigned within that funciton.
//             // console.log(data);
//             handleData(data, apiName);
//             return;
//         })
//         // further catch error status
//         .catch(error => console.log(apiName + " " + error));
// }

// // call api for geocoded location, assign lat / lon object on return value
// callAPI("geoCode", GEO_KEY);

// function apiDelayedCall() {
//     setTimeout(() => {
//         callAPI("policeApi", POLICE_KEY);
//     }, 3000);
// }

// apiDelayedCall();

// //serach button ======
// $("#search-button").on("click", function(event) { //click event listener to the search button
//     event.preventDefault();
//     console.log("Button Clicked!");
//     var location = $('#search-input').val();
//     console.log("USER INPUT Location: " + location);

//     //checks to see if #searc- button element clicked and says sets it to true
//     $(this).data('clicked', true); 
// });


// var input = document.getElementById("search-input");
// input.addEventListener("keypress", function(event) {
//     if (event.key === "Enter") {
//     event.preventDefault();
//     console.log("Location by Enter: " + input.value);

//       // Check if the button was clicked before Enter was pressed- could be used for mobile 
//     var buttonClicked = $("#search-button").data('clicked');
//     if (!buttonClicked) {
//         console.log("Enter key pressed without button click");
//         //if button is not clicked then let the console know 
//     }
//     }
// });




// //   map key - ALANS API- please don't run an infinite loop $$$
// mapboxgl.accessToken = 'pk.eyJ1IjoiY2h1bWJhIiwiYSI6ImNscGw5a2k1NjAxemwybG83ZmE0ZGplYmYifQ.1MecnWfHuhj0e8vo1cYCkw';


//    //current location
// navigator.geolocation.getCurrentPosition(success, error, {
//     enableHighAccuracy: true
// })

// function success(position) {
//     console.log("Current Location: " && position); //resurns users location
//     setupMap([position.coords.longitude, position.coords.latitude])
    
//     var autoUserLocation = position;
//     localStorage.setItem("autoLocation", JSON.stringify(autoUserLocation));
//     var autoUserLocationData = JSON.parse(localStorage.getItem('autoLocation'));
//     console.log("Local Storage Location: "&& autoUserLocationData);
// }
//   //if user disables access to location, provide a default
// function error() {
//     setupMap([-0.083094, 51.511177])
// }

//   //map settings centered to be more intuitive
// function setupMap(center) {
//     var map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/mapbox/streets-monochrome-v11",
//      center: center, //centre location on page
//     zoom: 14

//     })
// }
// //hide elements after click

// //gets rid of search button
// var onSearch = document.querySelector('.input-group');
// onSearch.addEventListener("oninput", () =>{
// if (onSearch.style.display === 'block' && onSearch.style.display === ''){
//     onSearch.style.display ='none';
    
// }else { onSearch.style.display = 'none';

//   }
// })



// // on search map change 
// // var onSearchMap = document.querySelector('map');
// // onSearch.addEventListener("oninput", () =>{
// // if (onSearch.style.width === '100%vh' && onSearch.style.width === '100%vw'){
// //     onSearch.style.height ='50%vh' && onSearch.style.width = '50%vw';
    
// // }else { onSearch.style.display = 'none';

// //   }
// // })




// //make map dark mode
// // function darkMode(center) {
// //     var darkMap = new mapboxgl.Map({
// //     container: "map",
// //     style: "mapbox://styles/chumba/clplcytui00w201po42tje31h",
// //      center: center, //centre location on page
// //     zoom: 14

// //     })
// // }

// // var themeswitcher =
// // themeswitcher.addEventListener("click", function() {
// //     if (mapMode === "light") {
// //         // Switch to dark mode (show iframe)
// //         mapMode.style ="mapbox://styles/chumba/clplcytui00w201po42tje31h"
// //         darkMap.style.display = 'block';

// //         mode = "light";

// //     } else {
// //         // Switch to light mode (hide iframe)
// //         darkMap.style.display = 'none';
// //         mapMode.style.display ='block' ;
// //         mode = "dark";
// //     }
// // });



//   //Tally up number of crimes by creating variable for each
//   //For loop to tally up total adding one each other
//   //if/else statement to work out if the data matches the data presented in the table
//   //access text of number of crimes - get element by ID = type of crime variable


//   function tally(data) {

//   var antiSocialBehaviour = 0;
//   var burglary = 0;
//   var drugs = 0;
//   var vehicleCrime = 0;
//   var violentCrime = 0;

//   for (let index = 0; index < data.length; index++) {
//     const category = data[index].category;
//   if (category === "anti-social-behaviour") {
//     antiSocialBehaviour += 1;
//   }  
//   else if (category === "burglary") {
//     burglary += 1;
//   }
//   else if (category === "drugs") {
//     drugs += 1; 
//   }
//   else if (category === "vehicle-crime") {
//     vehicleCrime += 1;
//   }
//   else if (category === "violent-crime") {
//    violentCrime += 1;
//   }
//   }
//   document.getElementById("crime1").innerText = antiSocialBehaviour;
//   document.getElementById("crime2").innerText = burglary;
//   document.getElementById("crime3").innerText = drugs;
//   document.getElementById("crime4").innerText = vehicleCrime;
//   document.getElementById("crime5").innerText = violentCrime;

  
// }

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

  //map settings centered to be more intuitive
function setupMap(center) {
    var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-monochrome-v11",
    center: center, //centre location on page
    zoom: 14

    })
    return map;
}
//hide elements after click

//gets rid of search button
var onSearch = document.querySelector('.input-group');
    onSearch.addEventListener("oninput", () =>{
    if (onSearch.style.display === 'block' && onSearch.style.display === ''){
        onSearch.style.display ='none';
    }else { 
        onSearch.style.display = 'none';
    }
})



// on search map change 
var onSearchMap = document.querySelector('map');
// onSearch.addEventListener("oninput", () =>{
//     if (onSearch.style.width === '100%vh' && onSearch.style.width === '100%vw'){
//         onSearch.style.height ='50%vh' && onSearch.style.width = '50%vw';
//     }else { 
//         onSearch.style.display = 'none';
//     }
// })




// make map dark mode
function darkMode(center) {
    var darkMap = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/chumba/clplcytui00w201po42tje31h",
     center: center, //centre location on page
    zoom: 14

    })
}

var themeswitcher = document.getElementById('themeSwitcherbtn');
themeswitcher.addEventListener("click", function() {
    if (mapMode === "light") {
        // Switch to dark mode (show iframe)
        mapMode.style ="mapbox://styles/chumba/clplcytui00w201po42tje31h"
        darkMap.style.display = 'block';

        mode = "light";

    } else {
        // Switch to light mode (hide iframe)
        darkMap.style.display = 'none';
        mapMode.style.display ='block' ;
        mode = "dark";
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

// function calls 

callAPI("geoCode", GEO_KEY);