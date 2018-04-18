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
    if (!err) {
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


module.exports = router;