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

app.post('/movies/', async (req, res) => {
  const movieDetails = req.body
  console.log(movieDetails)
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

// API 3

app.get('/movies/:movieId/', async (req, res) => {
  const {movieId} = req.params
  const movieQuery = `SELECT  * FROM movie WHERE movie_id = ${movieId};`
  const movieArray = await db.get(movieQuery)
  res.send(movieArray)
})

//API 4

app.put('/movies/:movieid/', async (req, res) => {
  const {movieid} = req.params
  const movieDetails = req.body
  const {directorId, movieName, leadActor} = movieDetails
  const putQuery = `UPDATE movie SET director_id = ${directorId},
  movie_name = '${movieName}',lead_actor = '${leadActor}';`
  await db.run(putQuery)
  res.send('Movie Details Updated')
})

// API 5
// DELETE THE MOVIE...

app.delete('/movies/:movieid/', async (req, res) => {
  const {movieid} = req.params
  console.log(movieid)
  const deleteQuery = `DELETE FROM movie WHERE movie_id = ${movieid};`
  try {
    await db.run(deleteQuery)
    res.send('Movie Removed')
  } catch (err) {
    console.log(`${err.message}`)
  }
})

// API 6
// Getting the list of directors...

app.get('/directors/', async (req, res) => {
  const directorQuery = `SELECT * FROM director;`
  const dbResponse = await db.all(directorQuery)
  res.send(
    dbResponse.map(function (dbObject) {
      return {
        directorId: dbObject.director_id,
        directorName: dbObject.director_name,
      }
    }),
  )
})

// API 7
// Returns list of movies directed by specific director....

app.get('/directors/:directorid/movies', async (req, res) => {
  const {directorid} = req.params
  const movieQuery = `SELECT movie_name FROM movie WHERE director_id = ${directorid};`
  const queryResponse = await db.all(movieQuery)
  res.send(
    queryResponse.map(function (obj) {
      return {
        movieName: obj.movie_name,
      }
    }),
  )
})

module.exports = app
