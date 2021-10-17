/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 212:
/***/ ((module) => {

"use strict";


const WRITE_INDEX = 4
const READ_INDEX = 8

module.exports = {
  WRITE_INDEX,
  READ_INDEX
}


/***/ }),

/***/ 916:
/***/ ((module) => {

"use strict";


const MAX_TIMEOUT = 1000

function wait (state, index, expected, timeout, done) {
  const max = Date.now() + timeout
  let current = Atomics.load(state, index)
  if (current === expected) {
    done(null, 'ok')
    return
  }
  let prior = current
  const check = (backoff) => {
    if (Date.now() > max) {
      done(null, 'timed-out')
    } else {
      setTimeout(() => {
        prior = current
        current = Atomics.load(state, index)
        if (current === prior) {
          check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2)
        } else {
          if (current === expected) done(null, 'ok')
          else done(null, 'not-equal')
        }
      }, backoff)
    }
  }
  check(1)
}

// let waitDiffCount = 0
function waitDiff (state, index, expected, timeout, done) {
  // const id = waitDiffCount++
  // process._rawDebug(`>>> waitDiff ${id}`)
  const max = Date.now() + timeout
  let current = Atomics.load(state, index)
  if (current !== expected) {
    done(null, 'ok')
    return
  }
  const check = (backoff) => {
    // process._rawDebug(`${id} ${index} current ${current} expected ${expected}`)
    // process._rawDebug('' + backoff)
    if (Date.now() > max) {
      done(null, 'timed-out')
    } else {
      setTimeout(() => {
        current = Atomics.load(state, index)
        if (current !== expected) {
          done(null, 'ok')
        } else {
          check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2)
        }
      }, backoff)
    }
  }
  check(1)
}

module.exports = { wait, waitDiff }


/***/ }),

/***/ 525:
/***/ ((module) => {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(() => {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = () => ([]);
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 525;
module.exports = webpackEmptyAsyncContext;

/***/ }),

/***/ 13:
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";


const { workerData, parentPort } = __nccwpck_require__(13)
const { WRITE_INDEX, READ_INDEX } = __nccwpck_require__(212)
const { waitDiff } = __nccwpck_require__(916)

const {
  dataBuf,
  stateBuf
} = workerData

let destination

const state = new Int32Array(stateBuf)
const data = Buffer.from(dataBuf)

async function start () {
  let fn
  try {
    fn = (await __nccwpck_require__(525)(workerData.filename)).default
  } catch (error) {
    // A yarn user that tries to start a ThreadStream for an external module
    // provides a filename pointing to a zip file.
    // eg. require.resolve('pino-elasticsearch') // returns /foo/pino-elasticsearch-npm-6.1.0-0c03079478-6915435172.zip/bar.js
    // The `import` will fail to try to load it.
    // This catch block executes the `require` fallback to load the module correctly.
    // In fact, yarn modifies the `require` function to manage the zipped path.
    // More details at https://github.com/pinojs/pino/pull/1113
    // The error codes may change based on the node.js version (ENOTDIR > 12, ERR_MODULE_NOT_FOUND <= 12 )
    if ((error.code === 'ENOTDIR' || error.code === 'ERR_MODULE_NOT_FOUND') &&
     workerData.filename.startsWith('file://')) {
      fn = require(workerData.filename.replace('file://', ''))
    } else {
      throw error
    }
  }
  destination = await fn(workerData.workerData)

  destination.on('error', function (err) {
    parentPort.postMessage({
      code: 'ERROR',
      err
    })
  })

  destination.on('close', function () {
    // process._rawDebug('worker close emitted')
    const end = Atomics.load(state, WRITE_INDEX)
    Atomics.store(state, READ_INDEX, end)
    Atomics.notify(state, READ_INDEX)
    setImmediate(() => {
      process.exit(0)
    })
  })
}

// No .catch() handler,
// in case there is an error it goes
// to unhandledRejection
start().then(function () {
  parentPort.postMessage({
    code: 'READY'
  })

  process.nextTick(run)
})

function run () {
  const current = Atomics.load(state, READ_INDEX)
  const end = Atomics.load(state, WRITE_INDEX)

  // process._rawDebug(`pre state ${current} ${end}`)

  if (end === current) {
    if (end === data.length) {
      waitDiff(state, READ_INDEX, end, Infinity, run)
    } else {
      waitDiff(state, WRITE_INDEX, end, Infinity, run)
    }
    return
  }

  // process._rawDebug(`post state ${current} ${end}`)

  if (end === -1) {
    // process._rawDebug('end')
    destination.end()
    return
  }

  const toWrite = data.toString('utf8', current, end)
  // process._rawDebug('worker writing: ' + toWrite)

  const res = destination.write(toWrite)

  if (res) {
    Atomics.store(state, READ_INDEX, end)
    Atomics.notify(state, READ_INDEX)
    setImmediate(run)
  } else {
    destination.once('drain', function () {
      Atomics.store(state, READ_INDEX, end)
      Atomics.notify(state, READ_INDEX)
      run()
    })
  }
}

process.on('unhandledRejection', function (err) {
  parentPort.postMessage({
    code: 'ERROR',
    err
  })
  process.exit(1)
})

process.on('uncaughtException', function (err) {
  parentPort.postMessage({
    code: 'ERROR',
    err
  })
  process.exit(1)
})

})();

module.exports = __webpack_exports__;
/******/ })()
;