'use strict'

import { apiKey } from './api.js'

const weatherOutput = document.querySelector('.weather-output')
const inputSection = document.querySelector('.input-section')
const inputCity = document.querySelector('#city')
const checkBtn = document.querySelector('.check')

let lon
let lat

const getLocalTime = (localTimeInS, timeZone) => {
  const offSetInMs = new Date().getTimezoneOffset() * 60 * 1000
  const date1 = new Date(localTimeInS * 1000)
  const localDate = new Date(date1.getTime() + offSetInMs + timeZone * 1000)
  return localDate.toLocaleTimeString('de', {
    hours: '2 digit',
    minutes: '2 digit',
    seconds: '2 digit',
  })
}

const checkWeather = () => {
  const cityValue = inputCity.value.toLowerCase()

  if (cityValue === undefined) {
    return
  } else if (cityValue !== undefined) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${apiKey}`)
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
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`,
        )
          .then(response => {
            if (!response.ok) {
              throw new Error('something went wrong')
            }
            return response.json()
          })
          .then(data => {
            console.log(data)
            const currentTime = getLocalTime(Date.now() / 1000, data.timezone)
            const sunsetTime = getLocalTime(data.sys.sunset, data.timezone)
            const sunriseTime = getLocalTime(data.sys.sunrise, data.timezone)
            const weatherHtml = `
            <div>
              <h2>Weather in</h2>
              <h2> ${data.name}</h2>
              <p>Weather:  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"> ${
              data.main.temp
            } °C</p>
              <p>Feels like: ${data.main.feels_like}</p>
              <p>Local time: ${currentTime}</p>
              <p>Humidity: ${data.main.humidity}%</p>
              <p>Cloudiness: ${data.weather[0].main}</p>
              <p>Pressure: ${data.main.pressure} hpa</p>
              <p>Sunrise ${sunriseTime}</p>
              <p>Sunset ${sunsetTime}</p>
              <p>Windspeed: ${data.wind.speed}Km/h</p>
              <p>Geo coordinates: ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
              </div>
              `
            weatherOutput.innerHTML = weatherHtml
          })
          .catch(error => console.log(error)),
      )
      .catch(error => console.log(error))
      .then(() => {
        fetch(
          `https//:api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`,
        )
      })
  }
}

const onKeypress = event => {
  if (event.key === 'Enter') {
    checkWeather()
  }
}

inputSection.addEventListener('keypress', onKeypress)
checkBtn.addEventListener('click', checkWeather)
