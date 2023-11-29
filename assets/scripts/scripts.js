// GLOBALS -----------------------------------------------------------

// API KEY VARIABLES
const GEO_KEY = "8e65421b6e97a45d703a871ea4e78c3a";
const GOOGLE_KEY = "";
const POLICE_KEY = "";

// Search bar location - set to london to start, docs state we can also use post codes in the search
let city = "nn1";
let latLon;

// API CALLS AND DATA HANDLING

// handle returned data from calls
function handleData(data, apiName) {
    // declare storage temp variable
    // let storage;
    console.log("handle data lat: ", data.lat);

    // switch data structure depending on api call
    switch(apiName) {
        case "geoCode":
            // assign storage as object
            storage = {latitude: data.lat, longitude: data.lon};
            // assign global variable
            latLon = storage;
            // console.log("latLon = " + latLon.longitude + " " + latLon.longitude);
            return;
        case "googleMap":
            return "google data";
        case "policeApi":
            return "police data";
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
        case "geoCode":
            // check if location is postcode input
            if (city.length === 3) {
                // search postcode
                path = "http://api.openweathermap.org/geo/1.0/zip?zip=" + city + ",GB&appid=" + apiKey;   
            } else {
                // search city name
                path = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",GB&appid=" + apiKey;   
            }
                break;
        case "googleMap":
            path = "googleMap api link";
            break;
        case "policeApi":
            path = "police api link";
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

// call api for geocoded location, assign lat / lon object on return value
callAPI("geoCode", GEO_KEY);
// let policeData = callAPI("policeApi", POLICE_KEY)