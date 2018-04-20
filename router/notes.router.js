'use strict';
const express = require('express');
const router = express.Router();
const data = require('.././db/notes');
const simDB = require('.././db/simDB'); 
const notes = simDB.initialize(data);  

// router.get('/notes', (req, res, next) => {
//   const {searchTerm} = req.query;

//   notes.filter(searchTerm, (err, list) => {
//     if (err) {
//       return next(err); // goes to error handler
//     }
//     res.json(list); // responds with filtered array
//   });
// });

router.get('/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm) 
    .then (list => {
      return res.json(list);
    })
    .catch (err => {
      next(err); // goes to error handler
    });// responds with filtered array);
});

router.get('/notes/:id',(req, res,next) => {
  let id = req.params.id;
  // id = Number(id);
  // console.log('The id is', id);
  notes.find(id)
    .then(returnNote => {
      if (returnNote) {
        res.json(returnNote);
      } else {
        next(); //goes to 404
      }
    })
    .catch(err => {
      next(err);
    });
  // res.status(404).json({message: err});
  //res.status(404).json({message: 'Not Found'}); 
});


router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
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

  notes.create(newItem)
    .then (item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
    })
    .catch (err => {
      next(err);
    });
});

router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id, (err) => {
    if (err) {
      return next (err);
    }
    res.sendStatus(204);
  });
});

module.exports = router;