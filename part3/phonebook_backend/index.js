require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

// Specify format for printing requests to console
morgan.token(
  'body',
  (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '.'
)
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name) {return res.status(400).json({error: 'Name missing.'})}
  if (!body.number) {return res.status(400).json({error: 'Number missing.'})}
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  if (!body.name) {return res.status(400).json({error: 'Name missing.'})}
  if (!body.number) {return res.status(400).json({error: 'Number missing.'})}
  const person = {
    name: body.name,
    number: body.number
  }
  const options = {
    new: true,
    runValidators: true
  }
  Person.findByIdAndUpdate(req.params.id, person, options)
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(_ => res.status(204).end())
    .catch(err => next(err))
})

// Returns current UTC time as a string.
const now = () => {
  const time = new Date()
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'UTC'
  }
  return new Intl.DateTimeFormat('en-US', options).format(time)
}

app.get('/info', (req, res, next) => {
  Person.count({})
    .then(count => {
      res.type('text/plain')
      res.send(
        `Phonebook has info for ${count} people` +
        '\n\n' + `${now()} UTC`
      )
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)