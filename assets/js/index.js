'use strict'

import { apiKey } from './api.js'

const weatherOutput = document.querySelector('.weather-output')
const forecastOutput = document.querySelector('.weather-forecast')
const inputSection = document.querySelector('.input-section')
const inputCity = document.querySelector('#city')
const checkBtn = document.querySelector('.check')
const burger = document.querySelector('.hamburger')
const headline = document.querySelector('.country-name')
const tempsOutput = document.querySelector('.temps')
const tempsSection = document.querySelector('.temps-section')

let currentTime
let lon
let lat

// # calculate different timezones

const getLocalTime = (localTimeInS, timeZone) => {
  const offSetInMs = new Date().getTimezoneOffset() * 60 * 1000
  const date1 = new Date(localTimeInS * 1000)
  const localDate = new Date(date1.getTime() + offSetInMs + timeZone * 1000)
  return localDate
}

// #default cities

const showDefaultCity = () => {
  fetchWeather()
}

// # weather fetch
const fetchWeather = () => {
  if (lat === undefined) {
    lat = 48.13
    lon = 11.57
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`)
    .then(response => {
      if (!response.ok) {
        throw new Error('something went wrong')
      }
      return response.json()
    })
    .then(data => {
      console.log(data)
      currentTime = getLocalTime(Date.now() / 1000, data.timezone)
      const sunsetTime = getLocalTime(data.sys.sunset, data.timezone)
      const sunriseTime = getLocalTime(data.sys.sunrise, data.timezone)
      let img

      if (data.weather[0].main === 'Clouds') {
        img = `<img src="./assets/img/sunnycloudy.png" alt="cloudy">`
        if (currentTime < 6 && currentTime > 18) {
          img = `<img src="./assets/img/nightcloudy.png" alt="cloudy">`
        }
      } else if (data.weather[0].main === 'Rain') {
        img = `<img src="./assets/img/rainy.png" alt="rainy">`
      } else if (data.weather[0].main === 'Clear') {
        img = `<img src="./assets/img/sunny.png" alt="rainy">`
      } else if (data.weather[0].main === 'Rain') {
        img = `<img src="./assets/img/rainy.png" alt="rainy">`
      } else if (data.weather[0].main === 'Fog') {
        img = `<img src="./assets/img/sunnycloudy.png" alt="cloudy">`
        if (currentTime < 6 && currentTime > 18) {
          img = `<img src="./assets/img/nightcloudy.png" alt="cloudy">`
        }
      }

      const cityHtml = `${data.name}`
      const tempsHtml = `${img}
      <p class="temps-amount">${data.main.temp.toFixed(1)}°C</p>`
      const weatherHtml = `
      
        <div>
        <p>Local time: ${new Date(currentTime).toLocaleTimeString('de')}</p>
        <p>Feels like: ${data.main.feels_like}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Sunrise ${new Date(sunriseTime).toLocaleTimeString('de')}</p>
        </div>
        <div>
        <p>Pressure: ${data.main.pressure} hpa</p>
        <p>Windspeed: ${data.wind.speed}Km/h</p>
        <p>Cloudiness: ${data.weather[0].main}</p>
        <p>Sunset ${new Date(sunsetTime).toLocaleTimeString('de')}</p>
        </div>
        
        
        `
      weatherOutput.innerHTML = weatherHtml
      headline.innerHTML = cityHtml
      tempsOutput.innerHTML = tempsHtml
    })
    .catch(error => console.log(error))
}

// # general function, fetches

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
      .then(fetchWeather)
      .catch(error => console.log(error))
      .then(() => {
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`,
        )
          .then(response => {
            if (!response.ok) {
              throw new Error('something went wrong')
            }
            return response.json()
          })
          .then(dataForecast => {
            console.log(dataForecast)
          })
      })
  }
}

// # enter event
const onKeypress = event => {
  if (event.key === 'Enter') {
    checkWeather()
  }
}

// const windowLoad = () => {
//   if (inputCity && inputCity.value) {
//     inputCity.classList.add('has-content')
//   }
// }
// #event listener

const theme = () => {
  const dateNow = new Date().getHours()
  if (dateNow > 6 && dateNow < 18) {
    document.body.classList.add('day')
    document.body.classList.remove('night')
  } else {
    document.body.classList.add('night')
    document.body.classList.remove('day')
  }
}
theme()

window.addEventListener('load', showDefaultCity, () => {})

document.querySelector('.back').addEventListener('click', () => {
  inputCity.value = ''
  inputSection.classList.remove('hide')
  tempsSection.classList.add('hide')
  weatherOutput.classList.add('hide')
  headline.classList.add('hide')
})

// inputSection.addEventListener('keypress', onKeypress)
checkBtn.addEventListener('click', checkWeather)
checkBtn.addEventListener('click', () => {
  headline.classList.remove('hide')
  inputSection.classList.add('hide')
  tempsSection.classList.remove('hide')
  weatherOutput.classList.remove('hide')
})
