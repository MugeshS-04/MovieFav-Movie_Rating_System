const express = require('express')
const BodyParser = require('body-parser')
const path = require('path')
const insertData = require('./db')

const app = express()
app.use(BodyParser.urlencoded({extended: true}))

const Port = 3000

app.use(express.static('public'));


app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'Main.html',))
})

app.post('/add-movie', async (req, res) => {
    try {
        const movieData = {
            Name: req.body.Name,
            Movie: req.body.Movie,
            Rating: req.body.Rating
        }

        console.log("Form Data Received:", movieData)

        await insertData(movieData)

        res.send('<h2>Movie Added Successfully!</h2> <a href="/">Go Back</a>')
    }
    catch(error)
    {
        console.log("Failed to add!, ",error)
        res.status(500).send('<h1>Failed to add the movies</h1> <a href="/">Try Again</a>')
    }
})

app.listen(Port, ()=> console.log("Server is listening on the port 3000"))


