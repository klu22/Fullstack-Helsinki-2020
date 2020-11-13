import React from 'react'


const Header = ({ name }) => 
  <h1>{name}</h1>

const Part = ({ part }) => 
  <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) =>
  <div>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </div>

const Total = ({ parts }) => {
  const counts = parts.map(part => part.exercises)
  const total = counts.reduce((a, b) => a + b)
  return (
    <p>
      <b>Total of {total} exercises</b>
    </p>
  )
}

const Course = ({ course }) =>
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>  


export default Course