const api_key = 'd0819098122ce24daf1baca31c4a8c1b';

let time = document.querySelector('.time');
let ampm = document.getElementById('am-pm');
let date = document.querySelector('.date');
let timezone_country = document.querySelector('.timezone-country');
let country = document.querySelector('.country');
let condition = document.querySelector('.condition');
let humidity = document.querySelector('.humidity');
let wind = document.querySelector('.wind-speed');
let sunrise = document.querySelector('.sunrise');
let sunset = document.querySelector('.sunset');
let temp = document.querySelector('.temp');
let future_weather_data = document.querySelector('.future-weather-data');
let main_img = document.querySelector(".main-img");

let city_name = document.getElementById("city-name");
let button = document.getElementById("button");
let city_setup = document.querySelector(".city");


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(function () {
    const time1 = new Date();
    const month = time1.getMonth();
    const date1 = time1.getDate();
    const day = time1.getDay();
    const hour = time1.getHours();
    const minute = time1.getMinutes();
    const hrsin12format = hour >= 13 ? hour % 12 : hour;
    const am_pm_data = hour >= 12 ? 'PM' : 'AM';

    time.innerHTML = (hrsin12format < 10 ? '0' + hrsin12format : hrsin12format) + ':' + (minute < 10 ? '0' + minute : minute) + ' ' + `<span id="am-pm">${am_pm_data}</span>`

    date.innerHTML = days[day] + ', ' + date1 + ' ' + months[month]

}, 1000);

window.addEventListener('load', function () {
    let lat;
    let lon;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${api_key}&units=metric`;
            fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
                showWeatherData(data);
                backgroundChange(data["current"]["weather"][0]["main"]);

            })
        });
    }
    else {
        alert("Your browser not supports geolocation api");
    }

})

function showWeatherData(data) {
    timezone_country.innerText = data.timezone;
    country.innerHTML = data.lat + ' N , ' + data.lon + ' E ';
    humidity.innerText = data.current.humidity;
    wind.innerHTML = data.current.wind_speed;
    temp.innerHTML = `${data.current.temp}&#176;C`;
    condition.innerText = data["current"]["weather"][0]["main"];
    console.log(data["current"]["weather"][0]["icon"]);
    main_img.setAttribute("src", `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`)
    sunrise.innerHTML = `${window.moment(data.current.sunrise * 1000).format('HH:mm a')}`;
    sunset.innerHTML = `${window.moment(data.current.sunset * 1000).format('HH:mm a')}`;

    let otherDayForcast = '';
    data.daily.forEach((day, index) => {
        if (index >= 1) {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `;
        }


    })

    future_weather_data.innerHTML = otherDayForcast;

}

let url1;
let url2;
button.addEventListener("click", function () {
    let lat1;
    let lon1;
    url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city_name.value}&appid=${api_key}&units=metric`;
    console.log(`Hi there ${city_name.value}`);
    fetch(url1).then((response) => {
        return response.json();
    }).then((data1) => {
        if (data1.cod == "404") {
            alert("Data not found, Please enter valid city Name");
            city_name.value = "";
        }
        else {
            lat1 = data1.coord.lat;
            lon1 = data1.coord.lon;
            city_setup.innerText = `in ${data1.name}`;
            url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat1}&lon=${lon1}&exclude=hourly,minutely&appid=${api_key}&units=metric`;
            fetch(url2).then((response) => {
                return response.json();
            }).then((data2) => {
                console.log(data2)
                showWeatherData1(data2);
                backgroundChange(data2["current"]["weather"][0]["main"]);
            })
            city_name.value = "";

        }
    });


});


function showWeatherData1(data) {
    timezone_country.innerText = data.timezone;
    country.innerHTML = data.lat + ' N , ' + data.lon + ' E ';
    humidity.innerText = data.current.humidity;
    wind.innerHTML = data.current.wind_speed;
    temp.innerHTML = `${data.current.temp}&#176;C`;
    condition.innerText = data["current"]["weather"][0]["main"];
    console.log(data["current"]["weather"][0]["icon"]);
    main_img.setAttribute("src", `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`)
    sunrise.innerHTML = `${window.moment(data.current.sunrise * 1000).format('HH:mm a')}`;
    sunset.innerHTML = `${window.moment(data.current.sunset * 1000).format('HH:mm a')}`;

    let otherDayForcast = '';
    data.daily.forEach((day, index) => {
        if (index >= 1) {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `;
        }


    })

    future_weather_data.innerHTML = otherDayForcast;

}

function backgroundChange(data) {
    console.log(data)
    if (data == 'Clear') {
        document.body.style.backgroundImage = "url(./images/clear.jpg)";
    } else if (data == 'Clouds' || data == "Fog" || data == "Tornado" || data == "Haze") {
        document.body.style.backgroundImage = "url(./images/cloud.jpg)";
    } else if (data == 'Rain' || data == "Drizzle") {
        document.body.style.backgroundImage = "url(./images/rain2.jpg)";
    }
    else if (data == 'Snow') {
        document.body.style.backgroundImage = "url(./images/snow3.jpg)";
    }
    else if (data == "Mist") {
        document.body.style.backgroundImage = "url(./images/mist.jpg)";
    }
    else {
        document.body.style.backgroundImage = "url(./images/background-1.jpg)";
    }
}


