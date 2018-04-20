'use strict';
// const data = require('./db/notes');
// const simDB = require('./db/simDB'); 
// const notes = simDB.initialize(data);  

console.log('Hello Noteful!');

//EXPRESS APP CODE HERE...

//import express
const express = require('express');
const {PORT} = require('./config');
const morgan = require('morgan');
const notesRouter = require('./router/notes.router');

//init epress app
const app = express();

//log requests, must be placed before static so it can be captured into html
app.use(morgan('common'));

//retrieve static assets in public
app.use(express.static('public'));

//parse request body
app.use(express.json());

app.use('/api', notesRouter);

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if (require.main === module){
  app.listen(PORT, function(){
    console.info(`Server is listining on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;