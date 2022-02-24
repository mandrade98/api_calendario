import express, { response } from 'express'

const app = express()

app.get('/', (request, response) => response.json({ message: 'API CALENDARIO' }))

app.listen('4000')
