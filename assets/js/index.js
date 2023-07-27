'use strict'

// 956a2497a65c68420a0a17e6efc0dddc

const weatherOutput = document.querySelector('.weather-output')
const inputSection = document.querySelector('.input-section')
const inputCountry = document.querySelector('#country')
const inputCity = document.querySelector('#city')
const checkBtn = document.querySelector('.check')

let lon
let lat

const checkWeather = () => {
  const countryValue = inputCountry.value.toLowerCase()
  const cityValue = inputCity.value.toLowerCase()

  if (cityValue === undefined && countryValue === undefined) {
    return
  } else if (cityValue !== undefined) {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityValue},${countryValue}&limit=1&appid=956a2497a65c68420a0a17e6efc0dddc`,
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('something went wrong')
        }
        return response.json()
      })
      .then(data => {
        lat = data[0].lat
        lon = data[0].lon
      })
      .then(() =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=956a2497a65c68420a0a17e6efc0dddc&units=metric&lang=de`,
        )
          .then(response => {
            if (!response.ok) {
              throw new Error('something went wrong')
            }
            return response.json()
          })
          .then(data => {
            console.log(data)
            const weatherHtml = `
        <h2>Weather in</h2>
        <h2> ${data.name}</h2>
        <p>Weather:  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"> ${data.main.temp}</p>
        <p>Local time</p>
        <p>Cloudiness: ${data.weather[0].main}</p>
        <p>Pressure: ${data.main.pressure}</p>
        <p>Sunrise ${data.sys.sunrise}</p>
        <p>Sunset ${data.sys.sunset}</p>
        <p>Windspeed: ${data.wind.speed}Km/h</p>
        <p>Geo coords: lan: ${lat.toFixed(2)}, - lon: ${lon.toFixed(2)}</p>
      `
            weatherOutput.innerHTML = weatherHtml
          })
          .catch(error => console.log(error)),
      )
      .catch(error => console.log(error))
  }
}

const onKeypress = event => {
  if (event.key === 'Enter') {
    checkWeather()
  }
}

inputSection.addEventListener('keypress', onKeypress)
checkBtn.addEventListener('click', checkWeather)
