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

  describe('Actual Database Tests', function() {
    let testDb;
    before('set up connection to DB', function(done) {
      MongoClient.connect(testDbUrl + testDbname, function(err, db){
        if(err) throw err;
        testDb = db;
        db.on('error', function (_err){
          if(_err) throw _err;
          
        });
        done();
      });

    });

    describe('given the DB is empty and a document is inserted', function () {
      beforeEach('emptying db', function (done) {
        testDb.dropCollection(testCollection, function (_err){
          if (_err) throw _err;
          done();
        })
      }, function (err){
        if(err) throw err;
      });

      it('should add the document', function (done){
        const result = testDbConnection.addNew('www.google.com', '5000');
        result.then(function (fulfilled){
          assert.strictEqual(fulfilled.insertedCount, 1);
          assert.strictEqual(fulfilled.ops[0].original,'www.google.com');
          assert.strictEqual(fulfilled.ops[0].shortened,'5000');
          done();
        }, function (rejected){
          if (rejected) throw rejected;
        }); 
      });
    });

    describe('Given the DB contains a url, when the user tries to insert it again', function () {
      let result;
      beforeEach('emptying db and adding record', function (done) {
        testDb.dropCollection(testCollection)
          .then(function(fulfilled){
            result = testDbConnection.addNew('www.google.com', '5000');
            done();
          })
          .catch(function (err){
            throw err;
          });
      });

      it('Should not add another document', function (done){
        const secondResult = testDbConnection.addNew('www.google.com', '5000');
        secondResult.then(function(fulfilled){
          assert.strictEqual(fulfilled.insertedCount, 0);
          done();
        })
        .catch(function(err){
          throw err;
        })
      });
    });

    
      
    after('close db', function(done) {
      testDb.close();
      done();
    });
  });
});
