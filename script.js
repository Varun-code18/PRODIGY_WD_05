const apiKey = config.API_KEY; // and load it from a config file or env var


function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return;

  document.getElementById("loading").style.display = "block";
  document.getElementById("weather").innerHTML = "";

  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentURL)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error("City not found");

      const card = `
        <div class="weather-card">
          <h2>${data.name}, ${data.sys.country}</h2>
          <p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" /> ${data.weather[0].main}</p>
          <p>🌡️ Temp: ${data.main.temp} °C</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>💨 Wind: ${data.wind.speed} m/s</p>
        </div>
      `;
      document.getElementById("weather").innerHTML = card;
    })
    .catch(() => {
      document.getElementById("weather").innerHTML = `<p>City not found. Please try again.</p>`;
    })
    .finally(() => {
      document.getElementById("loading").style.display = "none";
    });

  fetch(forecastURL)
    .then(res => res.json())
    .then(data => {
      const daily = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) {
          daily[date] = item;
        }
      });

      let forecastHTML = `<div class="forecast"><h3>3-Day Forecast</h3>`;
      const dates = Object.keys(daily).slice(1, 4);
      dates.forEach(date => {
        const item = daily[date];
        forecastHTML += `
          <div class="forecast-day">
            <strong>${new Date(date).toDateString()}</strong><br>
            ${item.weather[0].main} | Temp: ${item.main.temp} °C
          </div>
        `;
      });
      forecastHTML += `</div>`;
      document.getElementById("weather").innerHTML += forecastHTML;
    });
}
