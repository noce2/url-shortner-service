/* eslint linebreak-style: ["error", "windows"]*/

const assert = require('assert');
const ShortenedUrl = require('./shortenedUrl.class').ShortenedUrl;

describe('Given that the Shortened Url class is available', function(){
  describe('When a url of the right format is passed to the shorten method', function(){
    const inputString = 'https://www.freecodecamp.com/';
    it('Should return an object containing properties original and shortened', function(){
      const result = Object.keys(ShortenedUrl.shorten(inputString));
      assert.deepStrictEqual(result, ['original','shortened']);
    });
  });
});
