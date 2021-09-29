function searchCity(param) {
  var param = document.querySelector("#search").value.trim();
  if (param.length == 0) {
    var status = document.querySelector("#status");
    status.textContent =
      "Use the geolocation button or inform and address or city";
  } else {
    //hide API key
    var positionStackAPICall =
      "http://api.positionstack.com/v1/forward?access_key=4dd878d958e12c4195c43f670c7a0e87&query=" +
      param;

    fetch(positionStackAPICall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (response.length > 1) {
              status.textContent =
                "More than one location found. Please select one:";
              for (i = 0; i < response.length; i++) {
                //create element
                //pass content data.label
                //add event listener for click element
              }
            } else {
              //create array position for lat and lon, return position
              console.log(data);
              console.log(data.latitude);
              console.log(data.longitude);
            }
          });
        } else {
          status.textContent = "Error: " + response.statusText;
        }
      })
      .catch(function (error) {
        status.textContent = "Unable to connect to search your location";
      });
  }
}

function geolocationGetWeather() {
  var status = document.querySelector("#status");

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var weatherAPICall =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude=minutely,hourly&&appid=02df0e102c5eae2f143e987b3da9595b";
    //hide api key (git ignore?)
    status.textContent = "";

    fetch(weatherAPICall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            //displayweather
            console.log(data);
          });
        } else {
          status.textContent = "Error: " + response.statusText;
        }
      })
      .catch(function (error) {
        status.textContent = "Unable to connect to Weather server";
      });
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function displayWeather(dataIndex) {
  //class column is-one  7 columns
  //display today
  //get day and calculate 7 forward for name
  //weather: Array(1)0:
  //description: "moderate rain"
  //icon: "10d"
  //id: 501
  //main: "Rain"
  //feels like to celsius //create helper function
}

//event listener for geolocation button, executes geoFindMe
document
  .querySelector("#find-me")
  .addEventListener("click", geolocationGetWeather);

//event listener for search button, executes searchCity
document.querySelector("#search-btn").addEventListener("click", searchCity);
