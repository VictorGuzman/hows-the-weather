/* On Document Ready */
$(document).ready(function() {
  getWheatherInfo();
});

/* Retrieves all weather info based on IP coords */
function getWheatherInfo() {
  var ipInfoUrl = "http://ipinfo.io";
  $.getJSON(ipInfoUrl, function(data) {
    weatherApiCall(data.city, data.country);
  });
}

/* Calls the weather API with the given coords */
function weatherApiCall(city, country) {
  var openWeatherApiUrl = "http://api.openweathermap.org/data/2.5/weather?";
  var locationParams = "q=" + city + "," + country;
  var unitParam = "&units=imperial";
  var openWeatherApiKey = "&APPID=2d74c94193307c75761e2fb370b58cc1";
  var openWeatherApiCall = openWeatherApiUrl + locationParams + unitParam + openWeatherApiKey;
  $.getJSON(openWeatherApiCall, function(data) {
    var weatherData = {};
    var baseImgUrl = "https://openweathermap.org/img/w/";
    weatherData["tempCel"] = Math.round(data.main.temp);
    weatherData["tempFah"] = Math.round((weatherData.tempCel * 9) / 5 + 32);
    weatherData["country"] = data.sys.country;
    weatherData["city"] = data.name;
    weatherData["shortDesc"] = data.weather[0].main;
    weatherData["longDesc"] = data.weather[0].description;
    drawWeatherInfo(weatherData);
  });
}

/* Draw the weather info in the DOM */
function drawWeatherInfo(weatherData) {
  drawLocationInfo(weatherData.city, weatherData.country);
  drawIcon(weatherData.longDesc);
  drawTemp(weatherData.tempCel, weatherData.tempFah);
}

/* Draw the location info */
function drawLocationInfo(city, country) {
  var cityTitle = "<h1>" + city + "</h1>"
  var countryTitle = "<h2>" + country + "</h2>"
  var locationHtml = cityTitle + countryTitle
  $("#location-wrapper").html(locationHtml);
}

/* Draw the weather icon */
function drawIcon(desc) {
  var iconClasses = {
    "thunderstorm with light rain": "wi wi-thunderstorm",
    "thunderstorm with rain": "wi wi-thunderstorm",
    "thunderstorm with heavy rain": "wi wi-thunderstorm",
    "light thunderstorm": "wi wi-thunderstorm",
    "thunderstorm": "wi wi-thunderstorm",
    "heavy thunderstorm": "wi wi-thunderstorm",
    "ragged thunderstorm": "wi wi-thunderstorm",
    "thunderstorm with light drizzle": "wi wi-thunderstorm",
    "thunderstorm with drizzle": "wi wi-thunderstorm",
    "thunderstorm with heavy drizzle": "wi wi-thunderstorm",

    "light intensity drizzle": "wi wi-sprinkle",
    "drizzle": "wi wi-sprinkle",
    "heavy intensity drizzle": "wi wi-sprinkle",
    "light intensity drizzle rain": "wi wi-sprinkle",
    "drizzle rain": "wi wi-sprinkle",
    "heavy intensity drizzle rain": "wi wi-sprinkle",
    "shower rain and drizzle": "wi wi-sprinkle",
    "heavy shower rain and drizzle": "wi wi-sprinkle",
    "shower drizzle": "wi wi-sprinkle",

    "light rain": "wi wi-rain",
    "moderate rain": "wi wi-rain",
    "heavy intensity rain": "wi wi-rain",
    "very heavy rain": "wi wi-rain",
    "extreme rain": "wi wi-rain",

    "freezing rain": "wi wi-rain-wind",
    "light intensity shower rain": "wi wi-rain-wind",
    "shower rain": "wi wi-rain-wind",
    "heavy intensity shower rain": "wi wi-rain-wind",
    "ragged shower rain": "wi wi-rain-wind",

    "light snow": "wi wi-snow",
    "snow": "wi wi-snow",
    "heavy snow": "wi wi-snow",
    "sleet": "wi wi-snow",
    "shower sleet": "wi wi-snow",
    "light rain and snow": "wi wi-snow",
    "rain and snow": "wi wi-snow",
    "light shower snow": "wi wi-snow",
    "shower snow": "wi wi-snow",
    "heavy shower snow": "wi wi-snow",

    "mist": "wi wi-windy",
    "smoke": "wi wi-windy",
    "haze": "wi wi-windy",
    "sand, dust whirls": "wi wi-windy",
    "fog": "wi wi-windy",
    "sand": "wi wi-windy",
    "dust": "wi wi-windy",
    "volcanic ash": "wi wi-windy",
    "squalls": "wi wi-windy",
    "tornado": "wi wi-tornado",

    "clear sky": "wi wi-day-sunny",

    "few clouds": "wi wi-cloud",
    "scattered clouds": "wi wi-cloud",
    "broken clouds": "wi wi-cloud",
    "overcast clouds": "wi wi-cloudy",

    "tropical storm": "wi wi-storm-showers",
    "hurricane": "wi wi-hurricane"
  };

  // Changes clear sky icons and background when in night
  var currentTime = new Date();
  var currentTimeHours = currentTime.getHours();
  if ((currentTimeHours >= 18 && currentTimeHours <= 23) || (currentTimeHours >= 0 && currentTimeHours <= 5)) {
    $("body").addClass("night-mode");
    iconClasses["clear sky"] = "wi wi-night-clear";
  }

  var iconHtml = "<i class=\"" + iconClasses[desc] + "\"></i>";
  var titleDesc = titleCase(desc);
  var descHtml = "<h2>" + titleDesc + "</h2>"
  $("#icon-wrapper").html(iconHtml + descHtml);
}

/* Draw temperature */
function drawTemp(tempCel, tempFah) {
  var celClass = "wi wi-celsius";
  var fahClass = "wi wi-fahrenheit";
  var tempCelHtml = "<div id=\"cel-info\">" + tempCel + "<i class=\"" + celClass + "\"></i></div>"
  var tempFahHtml = "<div id=\"fah-info\" class=\"hidden\">" + tempFah + "<i class=\"" + fahClass + "\"></i></div>"
  var switcherHtml = "<h2 id=\"temp-switcher\" class=\"fah\"><i class=\"" + fahClass + "\"></i></h2>"
  var tempWrapperhtml = tempCelHtml + tempFahHtml + switcherHtml;
  $("#temp-wrapper").html(tempWrapperhtml);
  // Temp switcher click event
  $("#temp-switcher").on("click", function() {
    if ($(this).hasClass("fah")) {
      $("#fah-info").removeClass("hidden");
      $("#cel-info").addClass("hidden");
      $(this).removeClass("fah");
      $(this).addClass("cel");
      var newSitcherHtml = "<i class=\"" + celClass + "\"></i>"
      $(this).html(newSitcherHtml);
    } else  {
      $("#fah-info").addClass("hidden");
      $("#cel-info").removeClass("hidden");
      $(this).addClass("fah");
      $(this).removeClass("cel");
      var newSitcherHtml = "<i class=\"" + fahClass + "\"></i>"
      $(this).html(newSitcherHtml);
    }
  });
}

/* Title case a string */
function titleCase(str) {
  str_arr = str.split(" ");
  upcase_arr = str_arr.map(function(e) {
    return titlize(e);
  });
  return upcase_arr.join(" ");
}

/* Titlize a word*/
function titlize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}