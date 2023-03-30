require('dotenv').config()
const express = require('express')
require('./src/db/mongoose')
const cros = require('cors')
const userRoutes = require('./src/routes/user')
const reservationRoutes = require('./src/routes/reservation')

const app = express()
app.use(cros())

const port = process.env.PORT
app.use(express.json())

app.use(userRoutes)
app.use(reservationRoutes)


app.listen(port,()=>{console.log('server up on 3000');})