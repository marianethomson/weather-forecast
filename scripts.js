//global for the api key - openWeather API
var apiKey = "02df0e102c5eae2f143e987b3da9595b";

var infoStatus = document.querySelector("#status");
var currentWeatherCard = document.querySelector("#current");
var historyArr = [];

//if returns more than one city with arg, asks user to choose which city
//passes search argument to position stack api to get longitude and latitude for weather query
function searchCity() {
  var param = getSearchParam();
  var weatherAPICall =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    param +
    "&appid=" +
    apiKey;
  //if no search arg is provided
  if (param.length == 0) {
    infoStatus.textContent = "Use the geolocation button or inform a city";
  } //make call
  else {
    fetch(weatherAPICall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            getWeather(longitude, latitude);
          });
        } else {
          infoStatus.textContent = "Error: " + response.statusText;
        }
      })
      .catch(function (error) {
        infoStatus.textContent = "Unable to connect to search your location";
      });
  }
}

//get search arg
function getSearchParam() {
  var param = document.querySelector("#search").value.trim();
  return param;
}

//displays the list of cities found
function displayCity(obj) {
  var displayInteraction = document.querySelector("#display");
  var displayLine = document.createElement("p");
  var displayEl = document.createElement("a");
  var displayTxt = obj;
  //creates the links for each city
  displayEl.append(displayTxt);
  displayLine.appendChild(displayEl);
  displayInteraction.appendChild(displayLine);
}

function getWeather(longitude, latitude) {
  var weatherAPICall =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=minutely,hourly&&appid=" +
    apiKey +
    "&units=metric";

  fetch(weatherAPICall)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          infoStatus.textContent = "";
          displayWeather(data);
          addToHistory(data.timezone);
          historyArr.push(JSON.stringify(data.timezone));
        });
      } else {
        infoStatus.textContent = "Error: " + response.statusText;
      }
    })
    .catch(function (error) {
      infoStatus.textContent = "Unable to connect to Weather server";
    });
}

//divide geolocation and getWeather
function geolocation() {
  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getWeather(longitude, latitude);
  }

  function error() {
    infoStatus.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    infoStatus.textContent = "Geolocation is not supported by your browser";
  } else {
    infoStatus.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
//helper function to get dates from Unix to human readable
function dateUnixToHuman(unixTime) {
  var options = { day: "numeric", month: "numeric", year: "numeric" };
  var milliseconds = unixTime * 1000;
  var dateObject = new Date(milliseconds);
  return dateObject.toLocaleString("en-AU", options);
}

function displayWeather(obj) {
  var rangeForecast = 5;
  var pCityName = document.createElement("p");
  var pCurrentTemp = document.createElement("p");
  var pCurrentHumid = document.createElement("p");
  var pCurrentUVI = document.createElement("p");
  var pCurrentWindSpeed = document.createElement("p");
  var iconEl = document.createElement("img");
  var currentDate = dateUnixToHuman(obj.current.dt);
  var currentUVI = obj.current.uvi;
  //creates the information block for current day
  iconEl.src =
    "http://openweathermap.org/img/wn/" +
    obj.current.weather[0].icon +
    "@2x.png";
  pCityName.textContent =
    "Current Weather On " + extractCityName(obj.timezone) + ", " + currentDate;
  pCurrentTemp.textContent = "Temperature: " + obj.current.temp + " \xB0C";
  pCurrentHumid.textContent = "Humidity: " + obj.current.humidity + " %";
  pCurrentUVI.textContent = "UVI: " + currentUVI + " %";
  pCurrentWindSpeed.textContent =
    "Wind Speed: " + obj.current.wind_speed + " Km/h";

  currentWeatherCard.append(pCityName);
  currentWeatherCard.append(iconEl);
  currentWeatherCard.append(pCurrentTemp);
  currentWeatherCard.append(pCurrentHumid);
  currentWeatherCard.append(pCurrentUVI);
  currentWeatherCard.append(pCurrentWindSpeed);
  makeVisible(currentWeatherCard);
  uviBGColour(currentUVI, currentWeatherCard);

  //starts at index 1 because the current weather already covers weather for today
  //iteration to fill forecast
  for (i = 1; i <= rangeForecast; i++) {
    var weatherCard = document.querySelector("#weather");
    var divForecastEl = document.createElement("div");
    var pForecastDate = document.createElement("p");
    var pForecastTempMin = document.createElement("p");
    var pForecastTempMax = document.createElement("p");
    var pForecastHumid = document.createElement("p");
    var pForecastUVI = document.createElement("p");
    var pForecastWindSpeed = document.createElement("p");
    var iconEl = document.createElement("img");
    var forecastDate = dateUnixToHuman(obj.daily[i].dt);
    var forecastUVI = obj.daily[i].uvi;

    pForecastDate.textContent = forecastDate;
    pForecastTempMax.textContent =
      "Maximum Temperature: " + obj.daily[i].temp.max + " \xB0C";
    pForecastTempMin.textContent =
      "Minimum Temperature: " + obj.daily[i].temp.min + " \xB0C";
    pForecastHumid.textContent = "Humidity: " + obj.daily[i].humidity + " %";
    pForecastUVI.textContent = "UVI: " + forecastUVI + " %";
    pForecastWindSpeed.textContent =
      "Wind Speed: " + obj.daily[i].wind_speed + " Km/h";
    iconEl.src =
      "http://openweathermap.org/img/wn/" +
      obj.daily[i].weather[0].icon +
      "@2x.png";

    divForecastEl.append(pForecastDate);
    divForecastEl.append(iconEl);
    divForecastEl.append(pForecastTempMax);
    divForecastEl.append(pForecastTempMin);
    divForecastEl.append(pForecastHumid);
    divForecastEl.append(pForecastUVI);
    divForecastEl.append(pForecastWindSpeed);
    divForecastEl.classList.add("tile", "is-child", "box");
    weatherCard.appendChild(divForecastEl);
    uviBGColour(forecastUVI, divForecastEl);
  }
}

function extractCityName(obj) {
  var cityName = obj.split("/").pop();
  return cityName;
}

function uviBGColour(obj, el) {
  //low
  if (obj < 2) {
    el.classList.add("low");
  } //medium
  else if (obj >= 3 && obj <= 5) {
    el.classList.add("medium");
  } //high
  else {
    el.classList.add("high");
  }
}

function addToHistory(location) {
  var history = document.querySelector("#history");
  var location = JSON.stringify(historyArr);
  localStorage.setItem("location", location);
  var button = document.createElement("button");
  button.classList.add("button", "is-medium", "location");
  button.append(location);
  history.appendChild(button);
}

//clear form
function clearForm() {
  var parentDiv = document.querySelector("#weather");
  var currentDiv = document.querySelector("#current");
  var forecastDiv = document.getElementsByClassName(".forecast");
  parenttDiv.parentNode.removeChild(currentDiv);
  parentDiv.parentNode.removeChild(forecastDiv);
}
//not fully implemented
/* function clearHistory(location) {
  var button = document
    .createElement("button")
    .addClass("button is-large is-danger");
  var buttonTxt = "Clear History";
  storage.removeItem(location);
}
 */
function makeVisible(el) {
  el.classList.remove("is-hidden");
}

//event listener for geolocation button, executes geoFindMe
document
  .querySelector("#find-me")
  .addEventListener("click", geolocation, clearForm);

//event listener for search button, executes searchCity
document
  .querySelector("#search-btn")
  .addEventListener("click", searchCity, clearForm);

//event listener for history button
document
  .getElementsByClassName("location")
  .addEventListener("click", searchCity, clearForm);
