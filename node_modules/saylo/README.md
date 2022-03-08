# Saylo (turn on/off console.log)
![code coverage](https://img.shields.io/codecov/c/github/gbili/saylo.svg)
![version](https://img.shields.io/npm/v/saylo.svg)
![downloads](https://img.shields.io/npm/dm/saylo.svg)
![license](https://img.shields.io/npm/l/saylo.svg)

## Installation
To install this npm package do

```
npm i -P saylo
```

## Usage
Then from your javascript files import either `logger` or `log` directly with:
```javascript
//var logger = require('saylo');
import logger from 'saylo';
import { log } from 'saylo';
```

Then you can replace your console.log with either `log()` or `logger.log()`:
```javascript
import logger from 'saylo';

const a = 'Hey there how are you?';
const b = function() { 'any type goes' };
logger.log('my log output is: ', a, b); // 'my log output is: ', 'Hey there how are you?' , function () {'any type goes'}

logger.turnOff();
logger.log('my log output is: ', a, b); // no output

logger.turnOn();
logger.log('my log output is: ', a, b); // 'my log output is: ', 'Hey there how are you?' , function () {'any type goes'}
```

## Control through env vars
Before you load the logger module, you can set the environement variable `SAYLO_LOGGING` like:
```
process.env.SAYLO_LOGGING=1
// or
process.env.SAYLO_LOGGING=0
```
and it will turn the logger on or off. You can also store these in a `.env` file. In which case the `import 'dotenv/config';` statement will load them for you. (You need to `npm i -P dotenv` for this to work.

## Roadmap
Next step:
- Create logging sets and subsets, which you can turn on or off for finer control
  ```
  logger('level1').log('my string to log');
  logger('level2').log('my string to log');
  // or
  logger1.log('my string to log');
  logger2.log('my string to log');
  ```
