import React from 'react'


// A list item with a button to show a given country's details.
const Country = ({ country, setFilter }) =>
  <li>
    {country.name} 
    <button onClick={() => setFilter(country.name)}>
      show
    </button>
  </li>

// A list of Country components.
const Countries = ({ countries, setFilter }) => 
  <div>
    {countries.map(country => 
      <Country 
        key={country.alpha3Code} 
        country={country} 
        setFilter={setFilter}/>
    )}
  </div> 


export default Countries