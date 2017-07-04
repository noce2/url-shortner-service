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
          if (!(err.message === 'ns not found')){
            throw err;
          } 
        })
      });
      it('should enter only one record in db when one is inserted', function(done){
        const collection = testDb.collection(testCollection);
        const result = testDbConnection.addNew('www.google.com','5000');
        result.then(function(success){
          assert(success.insertedCount, 1);
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

