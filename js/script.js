$(() => {
    var apiKey = "2e72a9d069c99e3204b2ef530bca53be";
    var lat = 50.6;
    var lon = 30.5;

    getLocation();

    $("button").on("click", (e) => {
        let city = document.getElementById('searchCity').value;
        setCurrentForecastInfo(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`);
        setHourlyForecastInfo(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`);
    });

    function getLocation() {
        let getForecastByLocation = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}`;
        let getHourlyForecast = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${apiKey}`;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (location) {
                lat = location.coords.latitude;
                lon = location.coords.longitude;
                setCurrentForecastInfo(getForecastByLocation);
                setHourlyForecastInfo(getHourlyForecast);
            }, () => {
                setCurrentForecastInfo(getForecastByLocation);
                setHourlyForecastInfo(getHourlyForecast);
            });
        }
        else {
            setCurrentForecastInfo(getForecastByLocation);
            setHourlyForecastInfo(getHourlyForecast);
        }
    }

    function setCurrentForecastInfo(apiUri) {
        $.get(apiUri, (data, status) => {
            let sunrise = new Date(data.sys.sunrise);
            let sunset = new Date(data.sys.sunset);

            $(".weather-info")[0].innerText = "Surnise: " + sunrise.toLocaleTimeString();
            $(".weather-info")[1].innerText = "Sunset: " + sunset.toLocaleTimeString();;
            $(".weather-info")[2].innerText = "Duration: " + new Date(sunset - sunrise).toLocaleTimeString();

            $(".weather-status")[0].innerText = data.weather[0].main;
            $(".weather-temp")[0].innerText = parseInt(data.main.temp - 273) + " *C";
            $(".weather-icon")[0].src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        });
    }

    function setHourlyForecastInfo(apiUri) {
        $.get(apiUri, (data, status) => {
            for (let i = 1; i < 7; i++) {
                $(".forecast-datetime")[i].innerText = data.list[i].dt_txt;
                $(".weather-status")[i].innerText = data.list[i].weather[0].main;
                $(".weather-temp")[i].innerText = parseInt(data.list[i].main.temp - 273) + " *C";
                $(".weather-icon")[i].src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
            }
        });
    }
});