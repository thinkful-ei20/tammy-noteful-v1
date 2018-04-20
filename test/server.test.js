'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('New check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2+2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function () {
  it('should return index page when GET request "/" called', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function () {
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('GET /api/notes', function () {
  it('should return the default of 10 notes as an array', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(10);
      });
  });

  it('should return an array of objects with keys id, title, and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys(
            'id', 'title', 'content');
        });
      });
  });

  it('should return the correct search results for a valid query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=life')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(1);
        expect(res.body[0]).to.be.an('object');
      });
  });

  it('should return an empty array for an incorrect query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=68675')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});

describe('GET api/notes/:id', function () {
  it('should return correct note object with id, titie and content for a given id', function () {
    return chai.request(app)
      .get('/api/notes/1001')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id','title','content');
        expect(res.body.id).to.equal(1001);
        expect(res.body.title).to.equal('What the government doesn\'t want you to know about cats');
      });
  });

  it('should respond with a 404 for invalid id', function () {
    return chai.request(app)
      .get('/api/notes/9000')
      .then(function (res) {
        expect(res).to.have.status(404);
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res.body.message).to.include('Not Found');
      });
  });
});

describe('POST api/notes', function () {
  it('should create and return a new item with location header when provided valid data', function () {
    const newPost = {
      'title': 'Hello, I am a new post.',
      'content' : 'I don\'t have much to say',
    };
    return chai.request(app)
      .post('/api/notes/')
      .send(newPost)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res).to.have.header('location');
        expect(res.body).to.be.a('object');
        
        expect(res.body).to.include.keys('id','title','content');
        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newPost.title);
        expect(res.body).to.equal(newPost.content);
      });
  });

  // it('should create and return a new item with location header when provided valid data', function () {
  //   const newPost = {
  //     'content' : 'I don\'t have much to say',
  //   };
  // });
  // done();
});