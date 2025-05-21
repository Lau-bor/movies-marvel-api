var express = require('express');
const { ValidateCreateMovie, ValidateUpdateMovie } = require('../validators/movieValidator');
const { getAllMovies, createMovie, getMovieById, updateMovie, deleteOneMovie, findMoviesByFilters } = require('../controllers/movieController');
var router = express.Router();

/* router.get('/', getAllMovies) // GET movies listing */

router.get('/', (req, res, next) => {
    if(Object.keys(req.query).length > 0){
        findMoviesByFilters(req, res, next) // SI HAY QUERY PARAMS, BUSCA POR FILTROS
    } else {
        getAllMovies(req, res, next) // SI NO HAY QUERY PARAMS, DEVUELVE TODAS LAS MOVIES
    }
})

router.get('/:id', getMovieById) // GET one movie by id
router.post('/', ValidateCreateMovie, createMovie) // POST movies listing
router.put('/:id', ValidateUpdateMovie, updateMovie) // EDIT MOVIE
router.delete('/:id', deleteOneMovie) // DELETE MOVIE

module.exports = router;
