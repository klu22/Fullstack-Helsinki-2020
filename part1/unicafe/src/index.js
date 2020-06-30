import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({ name, onClick }) => 
  <button onClick={onClick}>{name}</button>

const Statistic = ({ text, value }) => 
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>

const Statistics = ({ parts }) => {
  if (parts[3] > 0) {return (
    <table>
      <h1>statistics</h1>
      <tbody>
        <Statistic text="good" value={parts[0]} />
        <Statistic text="neutral" value={parts[1]} />
        <Statistic text="bad" value={parts[2]} />
        <Statistic text="all" value={parts[3]} />
        <Statistic text="average" value={parts[4]} />
        <Statistic text="positive" value={parts[5] + " %"} />
      </tbody>
    </table>
    )
  }
  else return (
    <div>
      <h1>statistics</h1>
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  
  const parts = [good, neutral, bad, all, (good-bad)/all, (good/all)*100]

  const onClick = buttonName => () => {
    if (buttonName == "good") {setGood(good + 1)}
    else if (buttonName == "neutral") {setNeutral(neutral + 1)}
    else {setBad(bad + 1)};
    setAll(all + 1)
  }

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button name="good" onClick={onClick("good")} />
        <Button name="neutral" onClick={onClick("neutral")} />
        <Button name="bad" onClick={onClick("bad")} />
      </div>
      <Statistics parts={parts} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)