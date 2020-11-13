import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Results from './components/Results.js'


const App = () => {
  // Array of country objects.
  const [countries, setCountries] = useState([])
  // String for filtering country names.
  const [countryFilter, setCountryFilter] = useState('')

  const handleCountryFilterChange = e => {setCountryFilter(e.target.value)}

  // Initialize countries array from API.
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
    },
    [])

  return (
    <>
      <form>
        find countries: <input
          value={countryFilter}
          onChange={handleCountryFilterChange}
        />
      </form>
      <Results
        filter={countryFilter}
        setFilter={setCountryFilter}
        items={countries}/>
    </>
  )
}


export default App;
