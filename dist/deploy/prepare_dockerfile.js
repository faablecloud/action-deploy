'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var index = require('../node_modules/fs-extra/lib/index.js');
var index$1 = require('../node_modules/handlebars/lib/index.js');
var require$$1 = require('path');

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

const default_build = {
    from_image: "node:18.12.0",
    enablebuild: true,
    build_script: "build",
    start_script: "start",
};
const templates_dir = require$$1__namespace.join(__dirname, "../../templates");
const dockerfile = index.default.readFileSync(`${templates_dir}/Dockerfile.hbs`)
    .toString();
const docker_template = index$1.default.compile(dockerfile);
const prepare_dockerfile = (data = default_build) => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
    // Compose template with data and write to path
    const dockerfile = docker_template(data);
    yield index.default.writeFile(dockerfile, "./Dockerfile");
    return;
});

exports.prepare_dockerfile = prepare_dockerfile;
