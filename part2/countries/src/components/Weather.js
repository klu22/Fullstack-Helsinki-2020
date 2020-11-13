import React, { useState, useEffect } from 'react'
import axios from 'axios'


// Weather details for a given city.
const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  // Get weather data from API.
  useEffect(() => {
    axios
      .get(`http://api.weatherapi.com/v1/current.json` +
        `?key=${process.env.REACT_APP_WEATHER_API_KEY}` +
        `&q=${city}`)
      .then(response => {
        console.log(`response is ${JSON.stringify(response)}`)
        setWeather(response.data.current)})
  },
  [city])

  // Show a placeholder until weather has been updated.
  return (
    <div>
      {!weather ? (
        <p>Loading the weather...</p>
       ) : (
        <>
          <h2>Weather in {city}</h2>
          <p>temperature: {weather.temp_c} Celsius</p>
          <img src={weather.condition.icon} alt="weather forecast"/>
          <p>wind: {weather.wind_mph} mph, direction {weather.wind_dir}</p>
        </>
       )}
    </div>
  )
}


export default Weather