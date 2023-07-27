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
const logoSection = document.querySelector('.logo')

let lon
let lat

const getLocalTime = (localTimeInS, timeZone) => {
  const offSetInMs = new Date().getTimezoneOffset() * 60 * 1000
  const date1 = new Date(localTimeInS * 1000)
  const localDate = new Date(date1.getTime() + offSetInMs + timeZone * 1000)
  return localDate.toLocaleTimeString('de', {
    hours: '2 digit',
    minutes: '2 digit',
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
            let img

            if (data.weather[0].main === 'Clouds') {
              img = `<img src="./assets/img/sunnycloudy.png" alt="cloudy">`
            } else if (data.weather[0].main === 'Rain') {
              img = `<img src="./assets/img/rainy.png" alt="rainy">`
            } else if (data.weather[0].main === 'Clear') {
              img = `<img src="./assets/img/sunny.png" alt="rainy">`
            } else if (data.weather[0].main === 'Rain') {
              img = `<img src="./assets/img/rainy.png" alt="rainy">`
            }

            const countryHtml = `${data.name}`
            const tempsHtml = `${img}
            <p class="temps-amount">${data.main.temp.toFixed(1)}°C</p>`
            const weatherHtml = `
            
              <div>
              <p>Local time: ${currentTime}</p>
              <p>Feels like: ${data.main.feels_like}</p>
              <p>Humidity: ${data.main.humidity}%</p>
              <p>Sunrise ${sunriseTime}</p>
              </div>
              <div>
              <p>Pressure: ${data.main.pressure} hpa</p>
              <p>Windspeed: ${data.wind.speed}Km/h</p>
              <p>Cloudiness: ${data.weather[0].main}</p>
              <p>Sunset ${sunsetTime}</p>
              </div>
              
              
              `
            weatherOutput.innerHTML = weatherHtml
            headline.innerHTML = countryHtml
            tempsOutput.innerHTML = tempsHtml
          })
          .catch(error => console.log(error)),
      )
      .catch(error => console.log(error))
    // .then(() => {
    //   fetch(
    //     `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`,
    //   )
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('something went wrong')
    //       }
    //       return response.json()
    //     })
    //     .then(dataForecast => {
    //       console.log(dataForecast)
    //     })
    // })
  }
}

const onKeypress = event => {
  if (event.key === 'Enter') {
    checkWeather()
  }
}

// const windowLoad = () => {
//   $('.col-3 input').val('')

//   $('.input-effect input').focusout(function () {
//     if ($(this).val() != '') {
//       $(this).addClass('has-content')
//     } else {
//       $(this).removeClass('has-content')
//     }
//   })
// }

burger.addEventListener('click', () => {
  inputCity.value = ''
  inputSection.classList.toggle('hide')
  tempsSection.classList.add('hide')
  weatherOutput.classList.add('hide')
  headline.classList.add('hide')
  logoSection.classList.remove('hide')
})

inputSection.addEventListener('keypress', onKeypress)
checkBtn.addEventListener('click', checkWeather)
checkBtn.addEventListener('click', () => {
  headline.classList.remove('hide')
  inputSection.classList.add('hide')
  tempsSection.classList.remove('hide')
  weatherOutput.classList.remove('hide')
  logoSection.classList.add('hide')
})
