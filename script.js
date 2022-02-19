var lat ;
var lon ;
//Open Weather API Key
const weatherApiKey = "0e77635c6216ca5b05c70fc04d8b3e67";

var searchInput = document.querySelector("#userInput");
var search ;

//Pull and append Data from search
function handleSubmit(event) {
    event.preventDefault();
    search = searchInput.value.trim();
    searchInput.value = "";
    localStorage.setItem("search", search);
    getApi(search);
    // renderHistory();
}

//Pull and append data from history
// function handleHistory(event) {
//     if (!event.target.matches('historyBtn')){
//         var btn = event.target;
//         search = btn.getAttribute('data-search');
//         console.log(search);
//         getApi(search);
//         googleCall(search);
//     }
// }

//Pulls search history and saves data to a button
// function renderHistory() {
//     var searchHistory = localStorage.getItem("search");
//         const historyItem = document.createElement("button");
//         historyItem.setAttribute("type", "button");
//         historyItem.setAttribute("class", "historyBtn btn btn-secondary m-2");
//         historyItem.setAttribute("data-search", searchHistory);
//         historyItem.innerHTML = searchHistory;
//         $('#historyEl').append(historyItem);
// }

//api to get lat and lon for weather
function getApi(search) {
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${weatherApiKey}`;
    fetch(requestUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        cityNameValue = data[0]["name"];
        getLatLon(data[0]);
    })
    .catch( error => console.log(error) )
    .finally( console.log('finished with fetch') )
}

//API to get weather data
function getLatLon(location) {
    var { lat, lon } = location;
    var latLonUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${weatherApiKey}`;
    
    fetch(latLonUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            const currentDate = new Date(data['current']['dt'] * 1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            let date= month + '/' + day + '/' + year;
            let dayImg = data.current.weather[0].icon;
            let dayImgEl = document.createElement('img');
            dayImgEl.setAttribute('class', "bigImg");

            dayImgEl.setAttribute('src', "https://openweathermap.org/img/wn/" + dayImg + '@2x.png');
            dayImgEl.setAttribute('alt', data.current.weather[0].description);

            document.getElementById('current-date').innerHTML = date;
            document.getElementById('current-icon').append(dayImgEl);
            document.getElementById('current-temp').innerHTML += k2f(data.current.temp) + " &#176F";
            document.getElementById('current-humidity').innerHTML += data.current.humidity + "%";
            document.getElementById('current-windSpeed').innerHTML += data.current.wind_speed + " MPH";

        let fiveDayForecast = document.querySelectorAll('div[id^=forecastCard]');
            console.log(fiveDayForecast);
            console.log(fiveDayForecast.length);

    //for loop for 5-day cards
        for (var i=0; i<fiveDayForecast.length; i++){
            const currentDate = new Date(data.daily[i]['dt'] * 1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            let date= month + '/' + day + '/' + year;
            
            let dayImg = data.daily[i].weather[0].icon;
            let dayImgEl = document.createElement('img');
            dayImgEl.setAttribute("class", "img");
            dayImgEl.setAttribute('src', "https://openweathermap.org/img/wn/" + dayImg + '@2x.png');
            dayImgEl.setAttribute('alt', data.daily[i].weather[0].description);

            let dateEl = document.createElement('h5');
            dateEl.setAttribute("class", "cardText");
            let currentTempEl = document.createElement('p');
            currentTempEl.setAttribute("class", "cardText");
            let humidityEl = document.createElement('p');
            humidityEl.setAttribute("class", "cardText");
            let windSpeedEl = document.createElement('p');
            windSpeedEl.setAttribute("class", "cardText");

            dateEl.textContent = date;
            currentTempEl.textContent = "Current Temp: " + k2f(data.daily[i].temp.day) + " ℉";
            windSpeedEl.textContent= "Wind Speed: " + data.daily[i].wind_speed + " MPH";
            humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
            
            
            fiveDayForecast[i].innerHTML = "";
            fiveDayForecast[i].append(dateEl);
            fiveDayForecast[i].append(dayImgEl);
            fiveDayForecast[i].append(currentTempEl);
            fiveDayForecast[i].append(windSpeedEl);
            fiveDayForecast[i].append(humidityEl);
            
        }
})
}
//Function to convert temp
function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

//Event Listeners
$('.searchBtn').on('click', handleSubmit);
// $(document).on('click', '.historyBtn', handleHistory);