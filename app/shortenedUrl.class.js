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
    let urlRegExpFormat = /((?:(?:https?:\/\/)|(?:(?:www|\w+)\.))\w+\.\w+(?:\.\w+)?\/?(?:.+)?)/g
    let shortVersion;
    return new ShortenedUrl(input, shortVersion);
};


ShortenedUrl.original = (input) => {
    let 
};

module.exports.ShortenedUrl = ShortenedUrl;
