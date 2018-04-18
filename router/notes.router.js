'use strict';
const express = require('express');
const router = express.Router();
const data = require('.././db/notes');
const simDB = require('.././db/simDB'); 
const notes = simDB.initialize(data);  

router.get('/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

router.get('/notes/:id',(req, res,next) => {
  let id = req.params.id;
  // id = Number(id);
  // console.log('The id is', id);
  notes.find(id, (err, returnNote) => {
    if (err) {
      return next(err);
    } 
    if (returnNote) {
      res.json(returnNote);
    } else {
      next(); //goes to 404
    }
    // res.status(404).json({message: err});
    //res.status(404).json({message: 'Not Found'}); 
  });
});


router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err); //looks for next function with err, our err handler at the bottom
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id, err => {
    if (err) {
      return next(err);
    }  
    res.sendStatus(204);
  });
});

module.exports = router;