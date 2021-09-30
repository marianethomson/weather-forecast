/* 
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city */

//free text search
//if returns more than one city with arg, asks user to choose which city
//passes latitude and longitude for weather query

function displayCity() {}

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

//divide geolocation and getWeather
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
      "&exclude=minutely,hourly&&appid=02df0e102c5eae2f143e987b3da9595b&units=metric";

    fetch(weatherAPICall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            status.textContent = "";
            displayWeather(data);
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
//helper function to get dates from Unix to human readable
function dateUnixToHuman(unixTime) {
  var milliseconds = unixTime * 1000;
  var dateObject = new Date(milliseconds);
  return dateObject.toLocaleString();
}

function displayWeather(obj) {
  var currentWeatherCard = document.querySelector("#current");
  var displayLine = document.createElement("p");
  var rangeForecast = 5;
  var cityName = extractCityName(obj.timezone);
  var currentDate = dateUnixToHuman(obj.current.dt);
  var currentIcon = obj.current.weather.icon;
  var currentTemperature = obj.current.temp;
  var currentHumidity = obj.current.humidity;
  var currentUVI = obj.current.uvi;
  var currentWindSpeed = obj.current.wind_speed;

  cityName = displayLine.append(cityName);
  currentDate = displayLine.append(currentDate);
  currentIcon = displayLine.append(currentIcon);
  currentTemperature = displayLine.append(currentTemperature);
  currentHumidity = displayLine.append(currentHumidity);
  currentUVI = displayLine.append(currentUVI);
  currentWindSpeed = displayLine.append(currentWindSpeed);

  currentWeatherCard.appendChild(
    cityName,
    currentDate,
    currentIcon,
    currentTemperature,
    currentHumidity,
    currentUVI,
    currentWindSpeed
  );

  //class column is-one
  //weather: Array(1)0:
  //description: "moderate rain"
  //icon: "10d"
  //id: 501
  //main: "Rain"
}

function extractCityName(obj) {
  var cityName = obj.split("/").pop();
  return cityName;
}

function uviBGColour(obj) {
  //low
  if (obj < 2) {
    //is-primary
  } //medium
  else if (obj >= 3 && obj <= 5) {
    //is-alert
  } //high
  else {
    //is-warning
  }
}

function addToHistory(location, position) {
  localStorage.setItem("location", "position");
  var button = document
    .createElement("button")
    .addClass("button is-large location");
  button.append(location);
}

//event listener for geolocation button, executes geoFindMe
document
  .querySelector("#find-me")
  .addEventListener("click", geolocationGetWeather);

//event listener for search button, executes searchCity
document.querySelector("#search-btn").addEventListener("click", searchCity);

//event listener for history button
//document.querySelectorAll(".location").addEventListener("click");
