const mongoose = require('mongoose')

const url = "mongodb://127.0.0.1:27017/MovieDB"


async function connectDB()
{
    try{
        mongoose.connect(url)
        console.log("Connection is successful!")
    }
    catch(error)
    {
        console.log("Connection is Failed! ,",error)
    }
}
connectDB()

//mongoose.connect(url, {}).then(()=> console.log("Connection is successful")).catch((error) => console.log("Connection is failed!"));

const movieschema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },

    Movie: {
        type: String,
        required: true
    },

    Rating : {
        type: Number,
        min: 1,
        max: 10
    }
})


const Movie = mongoose.model('User_Ratings', movieschema)

// Insert Function
async function insertData(data) {
    const newmovies = new Movie(data)
    await newmovies.save();
    console.log("Movie added:", newmovies)
}

module.exports = insertData