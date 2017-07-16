/* eslint linebreak-style: ["error", "windows"]*/

const testRequest = require('supertest');
const expectJS = require('expect.js');
const myapp = require('../app.js').myapp;

describe('Server Tests', () => {
  describe('Normal Functionality Tests', () => {
    describe('When the client visits /', () => {
      it('should serve an html page in the body', (done) => {
        testRequest(myapp)
          .get('/')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200, done);
      });
    });
    let appendedShort;
    describe('When the client visits /reducirlo/ with an appended url after', () => {
      const appendedUrl = 'www.facebook.com';
      const responseType = /json/;
      it('should return the appended url and a shortened url\n', (done) => {
        testRequest(myapp)
          .get(`/reducirlo/${appendedUrl}`)
          .expect('Content-Type', responseType)
          .expect((res) => {
            expectJS(res.body).to.have.keys('original', 'shortened');
          })
          .expect((res) => {
            // here I set the appended url to a value ot be used in the test
            appendedShort = res.body.shortened;
          })
          .expect(200, done);
      });
    });
    describe('when the client visits /redigirme/ with an appended shorturl that exists', () => {
      it('should redirect the client to the appropriate original url\n', (done) => {
        testRequest(myapp)
          .get(`/redigirme/${appendedShort}`)
          .expect('Location', 'http://www.facebook.com')
          .expect(307, done);
      });
    });
    describe('when the client visits /redigirme/ with an appended shorturl that does not exist', () => {
      const appendedShort = 'r1HsLYxS';
      it('should send a json response containing the original and an error\n', (done) => {
        testRequest(myapp)
          .get(`/redigirme/${appendedShort}`)
          .expect('Content-Type', /json/)
          .expect((res) => {
            expectJS(res.body).to.have.keys('original', 'error');
          })
          .expect(200, done);
      });
    });
  });
});
