//free text search
//if returns more than one city with arg, asks user to choose which city
//passes latitude and longitude for weather query

function searchCity(param) {
  var param = document.querySelector("#search").value.trim();
  var status = document.querySelector("#status");
  var positionStackAPICall =
    "http://api.positionstack.com/v1/forward?access_key=4dd878d958e12c4195c43f670c7a0e87&query=" +
    param;

  //if no search arg is provided
  if (param.length == 0) {
    status.textContent =
      "Use the geolocation button or inform and address or city";
  } //make call
  else {
    fetch(positionStackAPICall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            var responseSize = data.data.length;
            //if returns more than one city, user chooses which one
            if (responseSize > 1) {
              status.textContent =
                "More than one location found. Please select one:";
              for (i = 0; i < responseSize; i++) {
                var displayInteraction = document.querySelector("#display");
                var displayLine = document.createElement("p");
                var displayEl = document.createElement("a");
                var displayTxt = data.data[i].label;
                //creates the links for each city
                displayEl.append(displayTxt);
                displayLine.appendChild(displayEl);
                displayInteraction.appendChild(displayLine);
                document
                  .querySelector("a")
                  .addEventListener("click", function (event) {
                    event.preventDefault;
                    var longitude = data.data[i].longitude;
                    var latitude = data.data[i].latitude;
                    var position = [longitude, latitude];
                    console.log(position);
                    return position;
                  });
              }
            } else {
              //create array position for lat and lon, return position}
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
