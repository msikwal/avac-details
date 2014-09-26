'use strict';

(function () {
  var ANALYST_RATING_MAP = {
    'notavailable': '',
    'notratable': '\u220F',
    'underreview': '\u02C6',
    'negative': '\u00C1',
    'neutral': '\u2030',
    'bronze': '\u00B4',
    'silver': '\u201E',
    'gold': '\u0152',
    '0': '',
    '1': '\u220F',
    '2': '\u02C6',
    '3': '\u00C1',
    '4': '\u2030',
    '5': '\u00B4',
    '6': '\u201E',
    '7': '\u0152'
  };
  var STYLE_BOX_MAP = {
    '1':'1',
    '2':'4',
    '3':'7',
    '4':'2',
    '5':'5',
    '6':'8',
    '7':'3',
    '8':'6',
    '9':'9',
    '0':'0',
  };

  /*  Internal properties and functions */
  /*  any regexes required are defined here so they are not duplicated in memory by being defined in a function */
  var nbspRegexp = /\s(\s+)\s/g,
  /*  function to check if a value is a string, and that the string is not empty */
  isString = function (string) {
    return (typeof string === 'string' && string !== '' && string !== '—');
  },
  /*  function to check if a value is a number, and that the number is not NaN or infinity */
  isNumber = function (number) {
    return (typeof number === 'number' && isFinite(number));
  },
  /*  numeraljs applies the numeraljs library as a filter for formatting numbers */
  numeraljs = function (input, format, cap) {
    var pos;

    if ((isString(input) && isFinite(Number(input))|| isNumber(input)) && isString(format)) {
      if (typeof cap === 'number' && Number(input) > cap && format.charAt(format.length-1) !== 'a') {
        if (format.indexOf('.') >= 0 && format.indexOf('0') >= 0) {
          pos = format.lastIndexOf('0');
          format = format.substring(0,pos) + format.substring(pos+1);
        }
        format += 'a';
      }
      return numeral(input).format(format);
    } else {
      return input;
    }
  },
  /* momentjs applies the momentjs library as a filter, optionally accepts a timezone so changing the timezone
     won't cause tests to fail (for example: test is being run on a server in a different timezone) */
  momentjs = function (input, format, zone) {
    if ( typeof zone === 'undefined') {
      zone = moment().zone();
    }

    if ((isString(input) || isNumber(input)) && isString(format)) {
      /*  some services return a non-standard date format, which will result in Invalid date
          in this instance, we normalize the date format before applying the format specified in the filter */
      if (moment(input).format('M/D/YY h:mmA') === 'Invalid date') {
        input =  moment(input, 'YYYY-MM-DD hh:mm:ss ZZ').utc().format('YYYY-MM-DD\\THH:mm:ss\\Z');
      }
      return moment(input).zone(zone).format(format);
    } else {
      return input;
    }
  },
  /*  shortBarometerLabel converts format ThreeMonth or OneDay into 3M or 1D,
      if true is provided for optional argument dump, unrecognized input return false
      this is used to filter unexpected barometers from the list of small market barometers */
   shortBarometerLabel = function (input, dump) {
    var str = input.toLowerCase(),
    modified = 0,
    map = {
      'one': 1,
      'three': 3,
      'day': 'D',
      'week': 'W',
      'month': 'M',
      'year': 'Y'
    },
    item;

    /*  for pivitoal bug 70303536, remove trailing 's' in short labels */
    if (str.charAt(str.length-1) === 's') {
      str = str.substring(0, str.length - 1);
    }

    for (item in map) {
      if (map.hasOwnProperty(item)) {
        if (str.indexOf(item) >= 0) {
          str = str.replace(item, map[item]);
          modified++;
        }
      }
    }
    if (dump && modified < 2) {
      str = null;
    }
    return str;
  },
  /*  preserve Nbsp function converts three or more spaces into a collection of non-breaking spaces with normal spaces on either side
      so they will not be condensed into a single space by the browser, but will also wrap correctly */
  preserveNbsp = function (input) {
    return input.replace(nbspRegexp, function (match, middleSpaces) {
      var out = ' ',
      mdSpLn = middleSpaces.length,
      i;

      for (i = 0; i < mdSpLn; i++) {
        out += '&nbsp;';
      }
      out += ' ';
      return out;
    });
  },
  /*  returns the absolute value of a number, for displaying negative numbers without the - symbol */
  absVal = function (input) {
    var abs = Math.abs(Number(input)),
    ret = input;

    if (isFinite(abs)) {
      ret = abs;
    }

    return ret;
  },
  /*   for sections where null data is supposed to be displayed as an mdash, this will find any form of null value and replace it with an mdash */
  mDash = function (input) {
    /*  values of 0 are now converted to mdash as well, I may need to make a second condition that allows zeros */
    if ((typeof input === 'undefined' || input === null || input === '') || (typeof input === 'number' && (!isFinite(input) || input === 0))) {
      input = '\u2014';
    }
    return input;
  },
  mDashHTML = function (input) {
    var dashed = mDash(input);

    if (dashed !== input) {
      dashed = '<span class="mdash">' + dashed + '</span>';
      /*  I was hitting an issue where ng-bind-html (needed to display this filter) was not displaying content without html,
          editing this to wrap other values in an span with no class fixed the issue */
    } else {
      dashed = '<span>' + dashed + '</span>';
    }
    return dashed;
  },
  /*  applies a <b> tag around specific characters of a string, used for highlighting the string that was searched for in 
      search results.  The skip argument should be included when search characters can be non-consecutive */
  boldString = function (input, search, skip) {
    var replace,
    searches = [search.toLowerCase(), search.toUpperCase()],
    searLen = searches.length,
    i,
    prossInput = function () {
      for (i=0; i<searLen; i++) {
        replace = '<b>' + searches[i] + '</b>';
        input = input.split(searches[i]).join(replace);
      }
    };

    if (typeof input === 'string') {
      if (search.length > 1) {
        searches.push(search.charAt(0).toUpperCase() + search.slice(1));
        searLen= searches.length;
      }

      if (typeof skip === 'boolean') {
        if (!skip || search.length > 1) {
          prossInput();
        }
      } else {
        prossInput();
      }
    }

    return input;
  },
  /*  Short method to trigger the non-consecutive functionality of boldString */
  boldOver2 = function (input, search) {
    return boldString(input, search, true);
  },
  /*  Takes a star rating number and converts it into the characters that will tringger stars in a the mstar symbol font */
  starRating = function (inputRating, type) {
    var rating = '',
    typeMap = {
      filled: 'Q',
      outline: 'W'
    },
    i;

    if (typeof type !== 'string') {
      type = 'filled';
    }

    if (typeof inputRating === 'string') {
      inputRating = parseInt(inputRating, 10);
    }
    if (typeof inputRating === 'number') {
      for (i=0; i<inputRating; i++) {
        rating += typeMap[type];
      }
    }
    return rating;
  },
  isShieldRating = function (input) {
    if (typeof input !== 'string') {
      input = String(input);
    }
    input = input.toLowerCase();

    var isRating = ANALYST_RATING_MAP.hasOwnProperty(input);
    return isRating;
  },
  /*  Takes a bronze/silver/gold/etc rating number and converts it into the characters that will tringger shiled ratings in a the 
      mstar symbol font.  Also accepts numeric equivilants of bronze/sliver/gold/etc */
  shieldRating = function (inputRating) {
    var rating = '';

    if (typeof inputRating !== 'string') {
      inputRating = String(inputRating);
    }
    inputRating = inputRating.toLowerCase();

    if (ANALYST_RATING_MAP.hasOwnProperty(inputRating)) {
      rating = ANALYST_RATING_MAP[inputRating];
    }

    return rating;
  },
  styleBox = function (input) {
    var output = '';

    if (typeof input !== 'string') {
      input = String(input);
    }
    input = input.toLowerCase();

    if (STYLE_BOX_MAP.hasOwnProperty(input)) {
      output = STYLE_BOX_MAP[input];
    }

    return output;
  },
  /*  calculates difference between price and yesterdayPrice and returns the CSS class that will color code 
      red or green accordingly.  I don't believe it is possible for the values to be equal, but if they are, 
      no class will be applied and the text will be grey */
  priceChangeDirection = function (price, yesterdayPrice) {
    var cssClass = '';

    if (price > yesterdayPrice) {
      cssClass = 'up';
    } else if (price < yesterdayPrice) {
      cssClass = 'down';
    }

    return cssClass;
  },
  /*  calculates difference between price and yesterdayPrice and returns the character that will trigger an 
  up or down arrow in the symbols font.  I don't believe it is possible for the values to be equal, but if they are, 
      the arrow will be omittted */
  priceChangeArrow = function (price, yesterdayPrice) {
    return priceChangeDirection(price, yesterdayPrice).replace('up', ']').replace('down', '[');
  },
  capitalizeWord = function (word) {
    var firstChar = word.substr(0,1);
    var remaining = word.substr(1);
    return firstChar.toUpperCase() + remaining.toLowerCase();
  },
  titleCaseExceptions = ['a', 'an', 'and', 'at', 'of', 'or', 'the', 'to'],
  titleCaseWord = function (word) {
    var output = (titleCaseExceptions.indexOf(word) < 0) ? capitalizeWord(word) : word.toLowerCase();
    return output;
  },
  titleCasePhrase = function (input) {
    if (typeof input !== 'string') { input = ''; }

    // title-case each word, keeping titleCaseExceptions as lower-case
    var output = input.replace(/\b[a-z]\S*/gi, titleCaseWord);

    // ensure first character is capitalized regardless of whether it is one of
    // the titleCaseExceptions
    var firstChar = output.substr(0,1);
    var remaining = output.substr(1);
    output = firstChar.toUpperCase() + remaining;

    return output;
  };
/*functions from above can be used as a angular filter, an angular service module, or both*/
  angular.module('formatterService', [])
  /* the first argument to .filter is the name you want to use to invoke the filter in your template html
     the second agrument is a function that returns the function from above you want to use as your fliter */
    .filter('numeraljs', function () {
      return numeraljs;
    })
    .filter('momentjs', function () {
      return momentjs;
    })
    .filter('shortBarometerLabel', function () {
      return shortBarometerLabel;
    })
    .filter('preserveNbsp', function () {
      return preserveNbsp;
    })
    .filter('absVal', function () {
      return absVal;
    })
    .filter('mDash', function () {
      return mDash;
    })
    .filter('mDashHTML', function () {
      return mDashHTML;
    })
    .filter('boldString', function () {
      return boldString;
    })
    .filter('boldOver2', function () {
      return boldOver2;
    })
    .filter('starRating', function () {
      return starRating;
    })
    .filter('shieldRating', function () {
      return shieldRating;
    })
    .filter('styleBox', function () {
      return styleBox;
    })
    .filter('titleCase', function () {
      return titleCasePhrase;
    })
    /* the first argument to .factory is FormatterService, the name that can be passed into controllers.
       The second argument is a function returning an object containing all of the functions from above to be accesable via the service */
    .factory('FormatterService', function () {
      return {
        isShieldRating: isShieldRating,
        shortBarometerLabel: shortBarometerLabel,
        starRating: starRating,
        shieldRating: shieldRating,
        styleBox: styleBox,
        priceChangeDirection: priceChangeDirection,
        priceChangeArrow: priceChangeArrow,
        titleCase: titleCasePhrase,
        validateEmail: function (email, scope, isInvalid) {
          var regex = /^[a-z0-9._%+-]+@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i,
          result = regex.test(email);

          if (isObject(scope)) {
            if (typeof email === 'string' && email !== '') {
              if (result === true) {
                scope[isInvalid] = false;
              } else {
                scope[isInvalid] = true;
              }
            } else {
              scope[isInvalid] = null;
            }
          }

          return result;
        },
        validatePass: function (pass, scope, errors) {
          var ret = false,
          regex = {
            length: function (input) {
              return /^.{8,24}$/.test(input);
            },
            alphaAndNum: function (input) {
              return /([a-z].*[0-9]|[0-9].*[a-z])/i.test(input);
            },
            noRepeat: function (input) {
              var ret = true,
              noSequential= function (input) {
                var SEQUENTIALS = {
                  'a': 'abcd',
                  'b': 'bcde',
                  'c': 'cdef',
                  'd': 'defg',
                  'e': 'efgh',
                  'f': 'fghi',
                  'g': 'ghij',
                  'h': 'hijk',
                  'i': 'ijkl',
                  'j': 'jklm',
                  'k': 'klmn',
                  'l': 'lmno',
                  'm': 'mnop',
                  'n': 'nopq',
                  'o': 'opqr',
                  'p': 'pqrs',
                  'q': 'qrst',
                  'r': 'rstu',
                  's': 'stuv',
                  't': 'tuvw',
                  'u': 'uvwx',
                  'v': 'vwxy',
                  'w': 'wxyz',
                  '0': '0123',
                  '1': '1234',
                  '2': '2345',
                  '3': '3456',
                  '4': '4567',
                  '5': '5678',
                  '6': '6789',
                  '7': '7890',
                },
                found = false,
                i=0,
                ch,
                slice;

                while (!found && i<input.length - 3) {
                  ch = input.charAt(i).toLowerCase();
                  slice = input.substr(i, 4).toLowerCase();
                  
                  found = (slice === SEQUENTIALS[ch]);
                  ++i;
                }
                return found;
              };

              if (/(.)\1\1\1/.test(input) || noSequential(input)) {
                ret = false;
              }
              return ret;
            }
          },
          prop;

          if (typeof pass === 'string' && pass !== '') {
            ret = true;
            for (prop in regex) {
              if (!regex[prop](pass)) {
                ret = false;
                if (isObject(scope[errors])) {
                  scope[errors][prop] = true;
                }
              }
            }
          }
          return ret;
        }
      };
    });
}());