const express = require('express')
const app = express() //sets up server
const videos = require('./routes/videos') //imports video routes
const fs = require('fs')
require('dotenv').config()
const PORT = process.env.PORT

//middlewear that parses JSON 
app.use(express.json())
app.use(express.static("public"));

//app.use((req, res, next) =>{} console.log("..") next())

app.use('/videos', videos)

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})


