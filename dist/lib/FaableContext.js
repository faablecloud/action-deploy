'use strict';

require('../node_modules/@actions/core/lib/core.js');
var core = require('../_virtual/core.js');

const get_context = () => {
    return {
        faable_app_name: core.__exports.getInput("faable_app_name", { required: true }),
        faable_api_key: core.__exports.getInput("faable_api_key", { required: true }),
        faable_user: core.__exports.getInput("faable_user", { required: true }),
        enable_debug: core.__exports.getInput("enable_debug") ? true : false,
        npm_build_command: core.__exports.getInput("npm_build_command") || "build",
        npm_start_command: core.__exports.getInput("npm_start_command") || "start",
    };
};

exports.get_context = get_context;
