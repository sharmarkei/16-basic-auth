'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
}

describe('Auth Routes', function () {
  describe('POST: /api/signup', function () {
    describe('with a valid body', function () {
      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
          .send(exampleUser)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.text).to.be.a('string');
            done();
          });
      });
    });

    describe('with an invalid request', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a 400', done => {
        request.post(`${url}/api/signup`)
        .send({username: 'shark', password: 'password'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with an invalid request', function () {
      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });
      
      it('should return a 404', done => {
        request.post(`${url}/api/yeye`)
          .send(exampleUser)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  });

  describe('GET: /api/signin', function () {
    describe('with a valid body', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then(user => user.save())
          .then(user => {
            this.tempUser = user;
            done();
          });
      });

      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      }); 

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
          .auth('exampleuser', '1234')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
      });
    });

    describe('with a invalid body', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then(user => user.save())
          .then(user => {
            this.tempUser = user;
            done();
          });
      });

      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });

      it('should return a 401', done => {
        request.get(`${url}/api/signin`)
          .auth('exampleuser', 'ahahah')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    });

    describe('with an invalid route', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then(user => user.save())
          .then(user => {
            this.tempUser = user;
            done();
          });
      });

      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });

      it('should return a 404', done => {
        request.get(`${url}/api/yaga`)
          .auth('exampleuser', '1234')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });
  
