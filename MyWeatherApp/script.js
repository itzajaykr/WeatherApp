const url =
	'https://api.openweathermap.org/data/2.5/weather';
const apiKey =
	'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
	weatherFn('Dhanbad'); 
});

async function weatherFn(cName) {
	const iconElement = document.getElementById('weather-icon');
	const temp =
		`${url}?q=${cName}&appid=${apiKey}&units=metric`;
	try {
		 
		const res = await fetch(temp);
		const data = await res.json();
		const iconCode = data.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
		 iconElement.src = iconUrl;

		if (res.ok) {
			weatherShowFn(data);
		} else {
			alert('Invalid City. Please enter a correct city to get the Weather data');
		}
	} catch (error) {
		console.error('Error fetching weather data:', error);
	}
}

function weatherShowFn(data) {
	$('#city-name').text(data.name);
	$('#date').text(moment().
		format('MMMM Do YYYY, h:mm:ss a'));
	$('#temperature').
		html(`${Math.round(data.main.temp)}°C`);
	$('#description').
		text(data.weather[0].description);
	$('#pressure').
	html(`Pressure: ${data.main.pressure} hPA`);	
	$('#wind-speed').
		html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#city-input-btn').on('click', function () {
    let cityName = $('#city-input').val();
    if (cityName) {
        weatherFn(cityName);
    } else {
        alert("Please enter a city name.");
    }
});

	$('#weather-info').fadeIn();
}