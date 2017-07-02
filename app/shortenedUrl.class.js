/* eslint linebreak-style: ["error", "windows"]*/
const dbConnection = require('./dbConnection').dbConnection;
function ShortenedUrl(original, shortened, error) {
  this.original = original;

  if(error) {
    this.error = error;
  } else {
    this.shortened = shortened;
  }
  
}

ShortenedUrl.shorten = (input) => {
  // Returns a new ShortenedUrl Object

  // Checks to see that the input matches the format of a url
  const urlRegExpFormat = /((?:(?:https?:\/\/)|(?:(?:www|\w+)\.))\w+\.[a-z](?:\.[a-z])?\/?(?:.+)?)/g
  if (urlRegExpFormat.test(input)) {
    // call the db method that stores this and return a shortened version
    const proposedShortVersion = Math.floor((Math.random() * 10000))+1;
    const dbRecord = dbConnection.addNew(input, proposedShortVersion);
    console.log(dbRecord);
    //return new ShortenedUrl(dbRecord.original, dbRecord.shortened);
    return new ShortenedUrl(dbRecord.original, dbRecord.shortened);
  } 
  //
  const error = 'invalid url format';
  return new ShortenedUrl(input, undefined, error);
};


ShortenedUrl.original = (input) => {
    
};

module.exports.ShortenedUrl = ShortenedUrl;
