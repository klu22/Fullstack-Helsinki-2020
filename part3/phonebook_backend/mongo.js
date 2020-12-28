// mongo.js - Just for experimenting with MongoDB
const mongoose = require('mongoose')


const argv = process.argv
if (argv.length !== 3 && argv.length !== 5) {
  console.log(`
    Usage:
    node mongo.js [password] -- show all phonebook entries
    node mongo.js [password] [name] [num] -- add a new entry
  `)
  process.exit(1)
}

const password = argv[2]
const url =
  `mongodb+srv://user_kevin:${password}@cluster0.zgqs4.mongodb.net` +
  '/phonebook-part3?retryWrites=true&w=majority'
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

// omitting ID for now since not sure how to reconcile with existing ID system
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

const showAll = () => {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person =>
      console.log(`${person.name}, ${person.number}`)
    )
    mongoose.connection.close()
  })
}

const addNew = (name_str, phone_str) => {
  const person = new Person({
    name: name_str,
    number: phone_str
  })
  person.save().then(() => {
    console.log(`Added ${name_str}, ${phone_str} to phonebook.`)
    mongoose.connection.close()
  })
}

if (argv.length === 3) {
  showAll()
} else {
  addNew(argv[3], argv[4])
}
