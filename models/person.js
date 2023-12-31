require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODBURL

console.log('connecting to', url)

mongoose.connect(url)
.then( result => {console.log('connected to MongoDB')})
.catch((error) => {console.log('error connecting to MongoDB', error.message)})

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: function(v){
            return /^\d{2,3}-\d+$/.test(v)
        },
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
async function countDocumentsInCollection() {
    const count = await People.countDocuments()
}
module.exports = mongoose.model('People', personSchema)
