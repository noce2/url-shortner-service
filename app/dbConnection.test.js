/* eslint linebreak-style: ["error", "windows"]*/
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const DbConnection = require('./dbConnection').DbConnection;

const testDbname = 'test';
const testCollection = 'shortenedUrls';
const testDbUrl = 'mongodb://localhost:27017/';

const testDbConnection = new DbConnection(testDbUrl, testDbname, testCollection);

describe('DbConnection Tests', () => {
  describe('the testDbConnection should be setup correctly', () => {
    it('should have its own property "url"', () => {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(testDbConnection, 'url'), true);
    });
    it('should have its "url" set to test value', () => {
      assert.strictEqual(testDbConnection.url, `${testDbUrl}${testDbname}`);
    });
    it('should have its own property "collectionName"', () => {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(testDbConnection, 'collectionName'), true);
    });
    it('should have a method addNew', () => {
      assert.strictEqual(typeof (testDbConnection.addNew), 'function');
    });
  });

  describe('the actual DB functionality tests', () => {
    let testDb;
    before('create DB connection', () => MongoClient.connect(testDbUrl + testDbname).then((db) => {
      testDb = db;
      return testDb;
    }).catch((err) => {
      if (err) throw err;
    }));

    describe('given the database is empty', () => {
      beforeEach('empty db', () => {
        // console.log(testDb);
        return testDb.dropCollection(testCollection).catch((err) => {
          if (!(err.message === 'ns not found')) {
            throw err;
          }
        });
      });
      it('should enter one record in the db when addNew method is called with args', (done) => {
        // const collection = testDb.collection(testCollection);
        const result = testDbConnection.addNew('www.google.com', '5000');
        result.then((success) => {
          assert.strictEqual(success.insertedCount, 1);
          assert.strictEqual(success.ops[0].original, 'www.google.com');
          assert.strictEqual(success.ops[0].shortened, '5000');
          done();
        })
          .catch((err) => {
            throw err;
          });
      });
    });

    describe('given the database already contains a document', () => {
      beforeEach('empty Db and add a document', () => testDb.dropCollection(testCollection)
        .then(success => success, (rejection) => {
          if (!(rejection.message === 'ns not found')) {
            throw rejection;
          } else {
            return Promise.resolve('collection not there');
          }
        })
        .then(_success => testDbConnection.addNew('www.google.com', '5000'))
        .catch((err) => {
          if (!(err.message === 'ns not found')) {
            throw err;
          }
        }));
      it('should insert another new document when addNew is called', (done) => {
        testDbConnection.addNew('www.freecodecamp.com', '6000')
          .then((success) => {
            assert.strictEqual(success.insertedCount, 1, 'one document was not inserted');
            const currentDocs = testDb.collection(testCollection).find().toArray();
            currentDocs
              .then((docs) => {
                assert.strictEqual(docs.length, 2, 'there aren\'t 2 records in db');
                done();
              })
              .catch((err) => {
                throw err;
              });
          });
      });
      it('should return the same document when find is called with the short url', (done) => {
        const result = testDbConnection.find('5000');
        result
          .then((success) => {
            assert.strictEqual(success.original, 'www.google.com', 'did not return right record');
            assert.strictEqual(success.shortened, '5000', 'did not find right short record');
            assert.ok(success._id, 'has a mongodb id');
            done();
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    after('close DB connection', (done) => {
      testDb.close();
      done();
    });
  });
});

