var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const loggerFile = require('./middlewares/logger');

var moviesRouter = require('./routes/movies');
var productsRouter = require('./routes/products')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(loggerFile);


app.use('/api/movies', moviesRouter);
app.use('/api/products', productsRouter);

module.exports = app;

// HACER GIT CHECKOUT -B "FEAT/MONGO-MODELS"