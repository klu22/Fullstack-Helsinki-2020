import React from 'react'


const Person = ({ person, deletionFn }) => 
  <li>
    {person.name} {person.number}
    <button onClick={() => deletionFn(person.id)}>
      delete
    </button>
  </li>

const Persons = ({ toShow, deletionFn }) =>
  <ul>
    {toShow.map(person => 
      <Person key={person.id} person={person} deletionFn={deletionFn}/>
    )}
  </ul>


export default Persons