/* eslint linebreak-style: ["error", "windows"]*/
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const ShortenedUrl = require('./shortenedUrl.class').ShortenedUrl;

const testDbname = 'test';
const testCollection = 'shortenedUrls';
const testDbUrl = 'mongodb://localhost:27017/';
const testShortenedUrl = new ShortenedUrl(testDbUrl, testDbname, testCollection);

describe('Shortened Url class Tests', function () {
  describe('Given the Shortened Url class is setup correctly', function() {
    it('should have its own property "url"', function() {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(testShortenedUrl, 'dbConnection'), true);
    });
    it('should have its instance of dbConnection\'s "url" set to the test value', function() {
      assert.strictEqual(testShortenedUrl.dbConnection.url, `${testDbUrl}${testDbname}`);
    });
    it('should have a method original', function () {
      assert.strictEqual(typeof (testShortenedUrl.original), 'function');
    });
    it('should have a method shorten', function () {
      assert.strictEqual(typeof (testShortenedUrl.shorten), 'function');
    });
    it('should have a method output', function () {
      assert.strictEqual(typeof (testShortenedUrl.output), 'function');
    });
  });

  describe('the Shortened Url class functionality tests', function(){
    let testDb;
    before('create DB connection', function(){
      return MongoClient.connect(testDbUrl + testDbname).then(function(db){
        testDb = db;
        return testDb;
      }).catch(function(err){
        if (err) throw err;
      });
    });

    describe('given no url has been shortened', function(){
      beforeEach('empty db', function(){
        // console.log(testDb);
        return testDb.dropCollection(testCollection).catch(function(err){
          if (!(err.message === 'ns not found')) {
            throw err;
          } 
        });
      });
      it('should create a shortened url and add it to the db when a valid url is passed', function(done){
        // const collection = testDb.collection(testCollection);
        const validUrl = 'www.google.com';
        const result = testShortenedUrl.shorten(validUrl);
        // console.log(result);
        result.then(function(success){
          
          assert.strictEqual(success.original, 'www.google.com', 'did not store test url');
          assert(success.shortened, 'no shortened property');
          done();
        })
          .catch(function(err){
            throw err;
          });
        
      });
      it('should not create a shortened url and not add anything to the db when an invalid url is passed', function(done){
        // const collection = testDb.collection(testCollection);
        const invalidUrl = 'google.com';
        const result = testShortenedUrl.shorten(invalidUrl);
        // console.log(result);
        result.then(function(success){
          
          assert.strictEqual(success.original, 'google.com', 'did not store test url');
          assert(success.error, 'no generated error message');
          assert(!success.shortened, 'shortened property is present');
          done();
        })
          .catch(function(err){
            throw err;
          });
        
      });
    });

    describe('given a url has been shortened and is stored', function(){
      const previouslyInsertedUrl = 'www.google.com';
      let resultingShortenedUrl;
      beforeEach('empty Db and add a document', function(){
        return testDb.dropCollection(testCollection)
          .then(function(success){
            return success;
          }, function(rejection){
            if(!(rejection.message === 'ns not found')){
              throw rejection;
            } else {
              return Promise.resolve('collection not there')
            }
          })
          .then(function(_success){
            return testShortenedUrl.shorten(previouslyInsertedUrl);
          })
          .then(function(_success){
            
            resultingShortenedUrl = _success.shortened;
                     
          })
          .catch(function(err){
            if (!(err.message === 'ns not found')) {
              throw err;
            }
          });
      });
      it('should shorten a new url if it is valid', function(done){
        let newUrlToShorten = 'www.freecodecamp.com';
        testShortenedUrl.shorten(newUrlToShorten)
          .then(function(success){
            assert.strictEqual(success.original,newUrlToShorten, 'shortened urls are not the same');
            assert(success.shortened, 'did not creat a new shortUrl');
            const currentDocs = testDb.collection(testCollection).find().toArray();
            currentDocs
              .then(function(docs){
                assert.strictEqual(docs.length, 2, 'there aren\'t 2 records in db');
                done();
              })
              .catch(function(err){
                throw err;
              });
          });
      });
      it('should not shorten a new url if it is not valid', function(done){
        let newUrlToShorten = 'freecodecamp.com';
        testShortenedUrl.shorten(newUrlToShorten)
          .then(function(success){
            assert.strictEqual(success.original,newUrlToShorten, 'shortened urls are not the same');
            assert(!success.shortened, 'created a new shortened url');
            const currentDocs = testDb.collection(testCollection).find().toArray();
            currentDocs
              .then(function(docs){
                assert.strictEqual(docs.length, 1, 'there is more than 1 record in db');
                done();
              })
              .catch(function(err){
                throw err;
              });
          });
      });
      it.skip('should return the existing shortened url if .shorten is called with an original url that already exists in the db', function(done){
        const shortenedAgain = testShortenedUrl.shorten(previouslyInsertedUrl);
        shortenedAgain
          .then(function(fulfilled){
            return testDb.collection(testCollection).find({ original: previouslyInsertedUrl }).toArray();
          })
          .then(function(docs){
            assert.strictEqual(docs.length, 1, 'more than one entry for the previously inserted url exists');
            done();
          }).catch(function(err){
            throw err;
          });
      });
      it('should the return original url if .original is called for a shortened url exists in the db', function(done){
        
        const result = testShortenedUrl.original(resultingShortenedUrl);
        result
          .then(function(_success){
            assert.strictEqual(_success.success, previouslyInsertedUrl, 'it did not return the original url');
            done();
          })
          .catch(function(err){
            throw err;
          });
      });
      
    });
    after('close DB connection', function(done){
      testDb.close();
      done();
    });
  });
});

