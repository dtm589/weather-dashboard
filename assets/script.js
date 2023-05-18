//set variables
let apiKey = '3441eea49fb0c2d562c42313024e998f';
let savedSearches = [];

// make a list of serached cities
let searchHistoryList = function (cityName) {
    //no duplicate cities
    $('.past-search:containes("' + cityName + '")').remove();

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

    //go through array and make entry for each item
    for (i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};

//button event listener
$("#search-form").on("sumbit", function (event) {
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
});