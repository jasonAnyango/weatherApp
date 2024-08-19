// Function to fetch the weather data
function getWeather() {
    // API Key from OpenWeatherMap
    const apiKey = 'YOUR-API-KEY'; // Enter your actual API key here
    const city = document.getElementById('cityName').value;
    // If the user has not entered a city...
    if (city === '') {
        alert('Please enter a city');
        return; // Exit the function
    }
    // If the user has entered a city...
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch the current weather from the currentWeatherUrl
    fetch(currentWeatherUrl)
    // Check the response status
        .then(response => {
            // If the response is not OK, throw an error
            if (!response.ok)
            {
                throw new Error('HTTP error! status: ${response.status}');
            }
            // If the response is OK, return the response
            return response.json();
        })
            .then(data => {
            console.log(data);
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch the forecast from the forecastUrl
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

// Function to display the weather information
function displayWeather(data) 
{
    // Assign the HTML elements to variables
    const tempInfo = document.getElementById('temperature');
    const weatherInfo = document.getElementById('info');
    const weatherIcon = document.getElementById('weatherIcon');
    const hourlyForecast = document.getElementById('hourly');

    // Clear the previous content from a previous search
    tempInfo.innerHTML = '';
    weatherInfo.innerHTML = '';
    hourlyForecast.innerHTML = '';

    // If the city is not found...
    if (data.cod === '404') 
    {
        // Display the error message in a <p> tag
        weatherInfo.innerHTML = `<p>${data.message}</p>`;
    } 
    // If the city is found...
    else 
    {
        // Set variables from data response
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert  from Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;
        // Set the HTML content
        tempInfo.innerHTML = temperatureHTML;
        weatherInfo.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        // Change the display of the weather icon
        showImage();
    }
}

// Function for displaying the hourly weather data
function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly');
    hourlyForecast.innerHTML = ''; // Clear previous forecast
    // Split the data received into intervals of 3 hours
    const next24Hours = hourlyData.slice(0, 8);
    
    next24Hours.forEach(item => {
        // Set variables from hourly data
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        // Create the HTML content
        const hourlyItemHtml = `
            <div class="hourlyItem">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        // Append the HTML content to the hourly forecast container
        hourlyForecast.innerHTML += hourlyItemHtml;
    });
}

// Function to change display of the weather icon
function showImage() 
{
    const weatherIcon = document.getElementById('weatherIcon');
    // Change the display of the weather icon from 'none' to 'block'
    weatherIcon.style.display = 'block';
}
