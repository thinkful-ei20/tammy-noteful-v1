'use strict';
const data = require('./db/notes');

console.log('Hello Noteful!');

//EXPRESS APP CODE HERE...

//import express
const express = require('express');
const {PORT} = require('./config');
const requestLogger = require('./middlewares/logger');

//init epress app
const app = express();

//retrieve static assets in public
app.use(express.static('public'));


app.use(requestLogger);


// app.get('/api/notes/',(req, res) => {
//   res.json(data);
// });

app.get('/api/notes',(req, res) => {
  let searchTerm = req.query.searchTerm;
  console.log("The search term is", searchTerm);
  let filteredData = data.filter(item => item.title.includes(searchTerm));
  res.json(filteredData);
});

app.get('/api/notes/:id',(req, res) => {
  let id = req.params.id;
  console.log("The id is", id);
  let returnNote = data.find(item => item.id === Number(id));
  if (!returnNote) {
    return res.status(404).json({message: 'Not Found'});
  }
  res.json(returnNote);
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

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.listen(PORT, function(){
  console.info(`Server is listining on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});