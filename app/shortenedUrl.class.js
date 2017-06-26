/* eslint linebreak-style: ["error", "windows"]*/

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
    let shortVersion;
    return new ShortenedUrl(input, shortVersion);
  } 
  //
  const error = 'invalid url format';
  return new ShortenedUrl(input, undefined, error);
};


ShortenedUrl.original = (input) => {
    
};

module.exports.ShortenedUrl = ShortenedUrl;
