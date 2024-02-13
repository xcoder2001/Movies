const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const filePath = path.join(__dirname, 'moviesData.db')
let db = null
app.use(express.json())

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at https://localhost:3000/')
    })
  } catch (err) {
    console.log(`Database error : ${err.message}`)
    process.exit(1)
  }
}

intializeDBAndServer()

//API 1
// Getting the list of movies in the mvie table....

app.get('/movies/', async (req, res) => {
  const moviesQuery = `SELECT  movie_name FROM movie;`
  const moviesArray = await db.all(moviesQuery)
  res.send(
    moviesArray.map(function (number) {
      return {movieName: number.movie_name}
    }),
  )
})

// API 2
// Creating a new movie in the movie table

app.post('/movies/', async (req, res) => {
  const movieDetails = req.body
  const {directorId, movieName, leadActor} = movieDetails

  const postQuery = `INSERT INTO movie (director_id,movie_name,lead_actor)
   VALUES (${directorId}, '${movieName}', '${leadActor}')`
  try {
    await db.run(postQuery)
    res.send('Movie Successfully Added')
  } catch (err) {
    console.log(`${err.message}`)
  }
})
