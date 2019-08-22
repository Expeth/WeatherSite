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
        $.ajax({
            type: "POST",
            url: apiUri,
            success: (data, status) => {
                let sunrise = new Date(data.sys.sunrise);
                let sunset = new Date(data.sys.sunset);

                $(".weather-info")[0].innerText = "Surnise: " + sunrise.toLocaleTimeString();
                $(".weather-info")[1].innerText = "Sunset: " + sunset.toLocaleTimeString();;
                $(".weather-info")[2].innerText = "Duration: " + new Date(sunset - sunrise).toLocaleTimeString();

                $(".weather-status")[0].innerText = data.weather[0].main;
                $(".weather-temp")[0].innerText = parseInt(data.main.temp - 273) + " *C";
                $(".weather-icon")[0].src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            },
            error: () => {
                return404Page();
            }
        });
    }

    function setHourlyForecastInfo(apiUri) {
        $.ajax({
            type: "POST",
            url: apiUri,
            success: (data, status) => {
                $("#hourly").html("");
                for (let i = 0; i < 6; i++) {
                    let weatherCard = document.createElement('div');
                    weatherCard.innerHTML = `<div class="weather-card">
                                                <card class="weather-card-body">
                                                    <div class="column-container">
                                                        <img class="weather-icon">
                                                        <p class="weather-status">Sunny</p>
                                                        <p class="weather-temp">Sunny</p>
                                                        <p class="forecast-datetime">Sunny</p>
                                                    </div>
                                                </card>
                                            </div>`;

                    $("#hourly").append(weatherCard);

                    $(".forecast-datetime")[i+1].innerText = data.list[i].dt_txt;
                    $(".weather-status")[i+1].innerText = data.list[i].weather[0].main;
                    $(".weather-temp")[i+1].innerText = parseInt(data.list[i].main.temp - 273) + " *C";
                    $(".weather-icon")[i+1].src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
                }
            },
            error: () => {
                return404Page();
            }
        });
    }

    function return404Page() {
        $(".weather-section")[0].innerHTML =

            `<div id="notfound">
		    <div class="notfound">
			    <div class="notfound-404">
				    <h3>Oops! Page not found</h3>
				    <h1><span>4</span><span>0</span><span>4</span></h1>
			    </div>
			    <h2>we are sorry, but the page you requested was not found</h2>
		    </div>
	    </div>`;
    }
});