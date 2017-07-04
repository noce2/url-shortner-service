/* eslint linebreak-style: ["error", "windows"]*/
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const DbConnection = require('./dbConnection').DbConnection;

const testDbname = 'test';
const testCollection = 'shortenedUrls';
const testDbUrl = 'mongodb://localhost:27017/'; 

const testDbConnection = new DbConnection(testDbUrl, testDbname, testCollection);

describe('DbConnection Tests', function () {
  describe('the testDbConnection should be setup correctly', function() {
    it('should have its own property "url"', function() {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(testDbConnection, 'url'), true);
    });
    it('should have its "url" set to test value', function() {
      assert.strictEqual(testDbConnection.url, `${testDbUrl}${testDbname}`);
    });
    it('should have its own property "collectionName"', function() {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(testDbConnection, 'collectionName'), true);
    });
    it('should have a method addNew', function () {
      assert.strictEqual(typeof (testDbConnection.addNew), 'function');
    });
  });

  describe('the actual DB functionality tests', function(){
    let testDb;
    before('create DB connection', function(){
      return MongoClient.connect(testDbUrl+testDbname).then(function(db){
        testDb = db;
        return testDb;
      }).catch(function(err){
        if (err) throw err;
      });
    });

    describe('given the database is empty', function(){
      beforeEach('empty db', function(){
        // console.log(testDb);
        return testDb.dropCollection(testCollection).catch(function(err){
          if (!(err.message === 'ns not found')) {
            throw err;
          } 
        })
      });
      it('should enter one record in the db when addNew method is called with args', function(done){
        const collection = testDb.collection(testCollection);
        const result = testDbConnection.addNew('www.google.com','5000');
        result.then(function(success){
          assert.strictEqual(success.insertedCount, 1);
          assert.strictEqual(success.ops[0].original, 'www.google.com');
          assert.strictEqual(success.ops[0].original, 'www.google.com');
          done();
        })
          .catch(function(err){
            throw err;
          });
        
      });

    });

    describe('given the database already contains a record', function(){
      beforeEach('empty Db and add a record', function(){
        return testDb.dropCollection(testCollection)
          .then(function(success){
            return success;
          }, function(rejection){
            if(!(err.message === 'ns not found')){
              throw err;
            } else {
              return Promise.resolve('collection not there')
            }
          })
          .then(function(_success){
            return testDbConnection.addNew('www.google.com','5000');
          })
          .catch(function(err){
            if (!(err.message === 'ns not found')) {
              throw err;
            }
          });
      });
      it('should insert contain another new record when addNew is called', function(done){
        testDbConnection.addNew('www.freecodecamp.com', '6000')
          .then(function(success){
            assert.strictEqual(success.insertedCount,1,'one document was not inserted');
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
      })
    });
    after('close DB connection', function(done){
      testDb.close();
      done();
    });
  });
});

