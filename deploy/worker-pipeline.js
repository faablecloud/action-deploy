/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 344:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const EE = __nccwpck_require__(614)
const { pipeline, PassThrough } = __nccwpck_require__(413)

// This file is not checked by the code coverage tool,
// as it is not reliable.

/* istanbul ignore file */

module.exports = async function ({ targets }) {
  const streams = await Promise.all(targets.map(async (t) => {
    let fn
    try {
      const toLoad = 'file://' + t.target
      fn = (await __nccwpck_require__(454)(toLoad)).default
    } catch (error) {
      // See this PR for details: https://github.com/pinojs/thread-stream/pull/34
      if ((error.code === 'ENOTDIR' || error.code === 'ERR_MODULE_NOT_FOUND')) {
        fn = require(t.target)
      } else {
        throw error
      }
    }
    const stream = await fn(t.options)
    return stream
  }))
  const ee = new EE()

  const stream = new PassThrough({
    autoDestroy: true,
    destroy (err, cb) {
      // destroying one stream is enough
      streams[0].destroy(err)
      ee.on('error', cb)
      ee.on('closed', cb)
    }
  })

  pipeline(stream, ...streams, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      ee.emit('error', err)
      return
    }

    ee.emit('closed')
  })

  return stream
}


/***/ }),

/***/ 454:
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
webpackEmptyAsyncContext.id = 454;
module.exports = webpackEmptyAsyncContext;

/***/ }),

/***/ 614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(344);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;