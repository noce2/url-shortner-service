/* eslint linebreak-style: ["error", "windows"]*/
const MongoClient = require('mongodb').MongoClient;

// const dbName = 'shortenedUrlApp';
// const collectionName = 'shortenedUrls';
// const url = `mongodb://localhost:27017/${dbName}`;
/*const collectionValidatior = {
  $and: [
    { original: { $type: 'string' } },
    { shortened: { $type: 'number' } },
  ],
};*/

function DbConnection(_dbUrl, _dbname, _collectionName) {
  this.url = _dbUrl + _dbname;
  this.collectionName = _collectionName;
}

DbConnection.prototype.addNew = function(_original, _shortened) {
  const _colName = this.collectionName;
  return this.makeConnection()
    .then(function (fulfilledDb) {
      const collection = fulfilledDb.collection(_colName);
      return collection.insertOne({
        original: _original,
        shortened: _shortened,
      })
        .then(function (fulfilled) {
          fulfilledDb.close();
          return Promise.resolve(fulfilled);
        }, function (rejected) {

        });
    }, function (rejected) {
      if (rejected) throw rejected;
    }).catch(function (err){
      throw err;
    });
};

DbConnection.prototype.makeConnection = function() {
  return MongoClient.connect(this.url);
}

module.exports.DbConnection = DbConnection;
