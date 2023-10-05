require('dotenv').config()
const express = require('express')
const app = express()
const People = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')


app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('data', (request) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39,23,6423122'
    }
]

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)


app.get('/api/persons', (request, response) => {
    People.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info',async (request, response) => {
    const len = await People.countDocuments()
    const aika = new Date()
    response.send('Phonebook has info for ' + len + ' people' + '<p>' + aika + '</p>')
})

app.get('/api/persons/:id', (request, response, next) => {
    People.findById(request.params.id)
    .then(person => {response.json(person)})
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    People.findByIdAndRemove(request.params.id)
    .then(result=>{response.status(204).end()})
    .catch(error => next(error))


})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const personObject = new People ({
        name: body.name,
        number: body.number
    })

    personObject.save().then(saved => {
        response.json(saved)
    }).catch(error => { next(error)})

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    People.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(result => {response.json(result)})
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// ok