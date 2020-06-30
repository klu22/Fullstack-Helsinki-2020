import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const selectAnother = () => 
    setSelected(Math.floor(Math.random() * anecdotes.length))

  const castVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {anecdotes[selected]} <br />
        has {votes[selected]} votes <br />
        <button onClick={castVote}>vote</button>
        <button onClick={selectAnother}>next anecdote</button>
      </p>
      <h1>Anecdote with most votes</h1>
      <p>
        {anecdotes[votes.indexOf(Math.max(...votes))]} <br />
        has {votes[votes.indexOf(Math.max(...votes))]} votes
      </p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)