//set variables
let apiKey = '3441eea49fb0c2d562c42313024e998f';
let savedSearches = [];

// make a list of serached cities
let searchHistoryList = function (cityName) {
    //no duplicate cities
    $('.past-search:contains("' + cityName + '")').remove();

    //create entry with city name
    let searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    //create container for each entry
    let searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    //append entry to container, and container to search history container
    searchEntryContainer.append(searchHistoryEntry);
    let searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (savedSearches.length > 0) {
        let previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }
    //add city name to array of searches
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    //reset search input
    $("#city-input").val("");
};

//load saved history entries into the container
let loadSearchHistory = function () {
    //get previous searches
    let savedSearchHistory = localStorage.getItem("savedSearches");

    //return if no previous searches
    if (!savedSearchHistory) {
        return false;
    }

    //parse each history
    savedSearchHistory = JSON.parse(savedSearchHistory);

    //go through array and make entry for each item
    for (i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};

//button event listener
$("#search-form").on("submit", function (event) {
    event.preventDefault();

    //get name of city
    let cityName = $("#city-input").val();

    //ensure something is entered into search box
    if (cityName === "" || cityName == null) {
        alert("Please enter a name of a city.");
        event.preventDefault();
    } else {
        //add to search history list and display weather conditions
        currentWeatherSection(cityName);
        fiveDayForecastSection(cityName);
    }

    //reset search input
    $("#city-input").val("");
});

let currentWeatherSection = function (cityName) {
    //get and data from API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function (responce) {
            return responce.json();
        })
        .then(function (responce) {
            //get lattitude and longtitude
            let cityLon = responce.coord.lon;
            let cityLat = responce.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=3441eea49fb0c2d562c42313024e998f`)
            .then(function(responce) {
                return responce.json();
            })
            //get data from this responce and apply to current weather section
            .then(function(responce) {
                searchHistoryList(cityName);

                //add weather container
                let currentWeatherConainer = $("#weather-data");
                currentWeatherConainer.addClass("current-weather-container");

                //add city name, date, and icon to section
                let currentTitle = $("#current-title");
                let currentDay = moment().format("M/D/YYYY");
                currentTitle.text(`${cityName} (${currentDay})`);
                let currentIcon = $("#current-weather-icon");
                currentIcon.addClass("current-weather-icon");
                let currentIconCode = responce.weather[0].icon;
                currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

                // add current temp
                let currentTemperature = $("#current-temperature");
                currentTemperature.text("Temperature: " + responce.main.temp + "\u00B0F");

                // add current humidity
                let currentHumidity = $("#current-humidity");
                currentHumidity.text("Humidity : " + responce.main.humidity + "%");

                //add current wind speed
                let currentWindSpeed = $("#current-wind-speed");
                currentWindSpeed.text("Wind Speed: " + responce.wind.speed + " MPH");
            })
        })
    
    .catch(function(error) {
        //reset serach input
        $("#city-input").val("");

        // alert there was an error
        alert("We could not find the city you searched for. Please try again with a valid city.");
    });
};

// called when history entry is clicked
$("#search-history-container").on("click", "p", function() {
    let previousCityName = $(this).text();
    currentWeatherSection(previousCityName);
    fiveDayForecastSection(previousCityName);

    let previousCityClicked = $(this);
    previousCityClicked.remove();
});

loadSearchHistory();