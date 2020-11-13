import React from 'react'
import Weather from './Weather.js'


// Details of a given country.
const CountryDetails = ({ country }) => 
  <div>
    <h1>{country.name}</h1>
    <p>capital: {country.capital}</p>
    <p>population: {country.population}</p>
    <h2>Languages</h2>
    <ul>
      {country.languages.map(lang => 
        <li key={lang.iso639_1}>{lang.name}</li>
      )}
    </ul>
    <img src={country.flag} width="160" height="99" alt="country's flag"/>
    <Weather city={country.capital}/>
  </div>


export default CountryDetails