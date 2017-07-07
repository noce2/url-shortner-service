/* eslint linebreak-style: ["error", "windows"]*/
const DbConnection = require('./dbConnection').DbConnection;

function ShortenedUrl(_dbUrl, _dbname, _collectionName){
  this.dbConnection = new DbConnection(_dbUrl, _dbname, _collectionName);
}

ShortenedUrl.prototype.shorten = function (input){
  // Returns a new ShortenedUrl Object
  
  // Checks to see that the input matches the format of a url
  const urlRegExpFormat = /((?:(?:https?:\/\/)|(?:(?:www|\w+)\.))\w+\.[a-z](?:\.[a-z])?\/?(?:.+)?)/g;
  if (urlRegExpFormat.test(input)) {
    // call the db method that stores this and return the output format
    // return this.dbConnection.collection(this.)
    // check if it already exists
    const proposedShortVersion = Math.floor((Math.random() * 10000))+1;
    const dbRecord = this.dbConnection.addNew(input, proposedShortVersion);
    return (dbRecord
      .then((writeResult) => {
        return this.output(writeResult.ops[0].original, writeResult.ops[0].shortened, null);
      })
      .catch((err) => {
        throw err;
      })
    );
    //return new ShortenedUrl(dbRecord.original, dbRecord.shortened);
  } 
  //
  const error = 'invalid url format';
  return Promise.resolve(this.output(input, null, error));
};


ShortenedUrl.prototype.original = function(input) { 
  const correspondingDoc = this.dbConnection.find(input);
  return correspondingDoc
    .then((_success) => {
      if(_success === null){
        return Promise.resolve(this.output(null, null, 'no url found'));
      }
      return Promise.resolve(this.output(_success.original, _success.shortened, null));
    })
    .catch(function(err){
      throw err;
    });
};

ShortenedUrl.prototype.output = function(original, shortened, error) {
  let result = {};
  result.original = original;
  
  if(error) {
    result.error = error;
  } else {
    result.shortened = shortened;
  }
  console.log(result);
  return result;
};
module.exports.ShortenedUrl = ShortenedUrl;
