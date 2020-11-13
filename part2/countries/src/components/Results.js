import React from 'react'
import Countries from './Countries.js'
import CountryDetails from './CountryDetails.js'


// Search results.
const Results = ({ items, filter, setFilter }) => {
  if (filter === '') return <div></div>

  // Filtered items.
  const filtered = items.filter(
    item => 
      item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
  )

  if (filtered.length > 10) {
    return <div>Too many matches, specify another filter.</div>
  } else if (filtered.length === 0) {
    return <div>No matches found.</div>
  } else if (filtered.length === 1) {
    return <CountryDetails country={filtered[0]}/>
  } else {
    return <Countries countries={filtered} setFilter={setFilter}/>
  }
}


export default Results