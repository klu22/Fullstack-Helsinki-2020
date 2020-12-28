// person.js - Connect to MongoDB and define Person schema.
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)

mongoose.connect(url, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('connected to MongoDB')
}).catch(error => {
  console.log(`error connecting to MongoDB: ${error.message}`)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    minlength: 8
  }
})
personSchema.plugin(uniqueValidator)

// toJSON is a pre-processor for JSON.stringify()
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // add str ID
    delete returnedObject._id // remove non-str ID
    delete returnedObject.__v // remove versioning
  }
})

module.exports = mongoose.model('Person', personSchema)