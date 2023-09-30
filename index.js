const express = require('express')
const app = express()
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


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const len = persons.length
    const aika = new Date()
    response.send('Phonebook has info for ' + len + ' people' + '<p>' + aika + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const person = request.body
    const found = persons.find(n => n.name === person.name)

    if (!person.name || !person.number) {
        return response.status(400).json({ error: 'name or number missing'})
    }
    
    if (found) {
        return response.status(400).json({ error: 'name must be unique'})
    }

    const personObject = {
        id: generateId(),
        name: person.name,
        number: person.number
    }

    persons = persons.concat(personObject)
    response.json(personObject)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})