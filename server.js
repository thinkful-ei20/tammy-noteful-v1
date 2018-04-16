'use strict';
const data = require('./db/notes');

console.log('Hello Noteful!');

//EXPRESS APP CODE HERE...

//import express
const express = require('express');

//init epress app
const app = express();

//retrieve static assets in public
app.use(express.static('public'));

// app.get('/api/notes/',(req, res) => {
//   res.json(data);
// });
  

app.get('/api/notes/?',(req, res) => {
  let searchTerm = req.query.searchTerm;
  console.log(searchTerm);
  let filteredData = data.filter(item => item.title.includes(searchTerm));
  res.json(filteredData);
});

app.get('/api/notes/:id',(req, res) => {
  let id = req.params.id;
  console.log(id);
  let returnNote = data.find(item => item.id === Number(id));
  res.json(returnNote);
});


app.listen(8080, function(){
  console.info(`Server is listining on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});