'use strict';

var tslib_es6 = require('./node_modules/tslib/tslib.es6.js');
var deploy_action = require('./deploy/deploy_action.js');
var FaableContext = require('./lib/FaableContext.js');
var require$$1 = require('path');
var log = require('./log.js');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var require$$1__namespace = /*#__PURE__*/_interopNamespaceDefault(require$$1);

const pkg = require(require$$1__namespace.join(__dirname, "../package.json"));
const main = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
    log.log.info(`🚀 faable.com ${pkg.name} - ${pkg.version}`);
    const ctx = FaableContext.get_context();
    try {
        yield deploy_action.deploy_action(ctx);
    }
    catch (error) {
        log.log.error(error);
        process.exit(-1);
    }
});
main();
