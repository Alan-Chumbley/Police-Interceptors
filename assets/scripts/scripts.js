// GLOBALS -----------------------------------------------------------
// root div to check linked correctly
const ROOT_DIV = document.getElementById('root');

ROOT_DIV.innerText = "Hello World!";
ROOT_DIV.style.color = "white";

//serach button ======
$("#search-button").on("click", function(event){
    event.preventDefault();
    console.log("Button Clicked!");
var location = $('#search-input').val();
console.log("USER INPUT Location: " + location);

});



//   map key - ALANS API- please don't run an infinite loop $$$
mapboxgl.accessToken = 'pk.eyJ1IjoiY2h1bWJhIiwiYSI6ImNscGw5a2k1NjAxemwybG83ZmE0ZGplYmYifQ.1MecnWfHuhj0e8vo1cYCkw';
  

   //current location
   navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
  })
  
  function success(position) {
    console.log("Current Location: " && position); //resurns users location
    setupMap([position.coords.longitude, position.coords.latitude])
    
    var autoUserLocation = position;
    localStorage.setItem("autoLocation", JSON.stringify(autoUserLocation));
    var autoUserLocationData = JSON.parse(localStorage.getItem('autoLocation'));
    console.log("Local Storage Location: "&& autoUserLocationData);
  }
  //if user disables access to location, provide a default
  function error() {
    setupMap([-0.083094, 51.511177])
  }

  //map settings centered to be more intuitive
  function setupMap(center) {
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: center, //centre location on page
      zoom: 14 
      
    })
   
  }
  localStorage.setItem

  