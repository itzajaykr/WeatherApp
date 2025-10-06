const url = 'https://api.openweathermap.org/data/2.5/weather';
let apiKey = 'fb0a2f2517f8806a44108a84c4c254c1'; 
let locationBtn = document.getElementById('locationBtn'); 

$(document).ready(function () {
    weatherFn('Dhanbad'); 
    
    $('#city-input-btn').on('click', function () {
        let cityName = $('#city-input').val();
        if (cityName) {
            weatherFn(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });
});


async function weatherFn(cName) {
    const iconElement = document.getElementById('weather-icon');
    
    const fetchUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    
    try {
        const res = await fetch(fetchUrl);
        const data = await res.json();

        if (res.ok) {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            iconElement.src = iconUrl;
            
            weatherShowFn(data);
        } else {
            alert('Invalid location. Please enter a correct city or allow location access.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a')); 
    $('#temperature').html(`${Math.round(data.main.temp)}°C`);
    $('#description').text(data.weather[0].description);
    $('#pressure').html(`Pressure: ${data.main.pressure} hPA`);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    
    $('#weather-info').fadeIn();
}


function handleGeolocationError(error) {
    let message = 'Unable to retrieve your location.';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Permission Denied: Please allow location access to see your local weather.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
    }
    
    alert(`Geolocation Error: ${message}`);
    console.error(`Geolocation failed (${error.code}): ${error.message}`);
}


function getUserCoordinates() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        
        let REVERSE_GEOCODING_URL = 
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

        fetch(REVERSE_GEOCODING_URL)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch city name.');
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const cityName = data[0].name;
                    console.log('Geolocation City', cityName);
                    weatherFn(cityName); 
                } else {
                    alert('Could not determine city name from geolocation.');
                }
            }).catch(error => {
                console.error('Error in Geolocation:', error);
                alert('Failed to get weather for your location (API Error).');
            });

    }, handleGeolocationError, { enableHighAccuracy: true, timeout: 5000 });
}

locationBtn.addEventListener('click', getUserCoordinates);