"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_context = void 0;
const core = require("@actions/core");
const get_context = () => {
    return {
        faable_app_name: core.getInput("faable_app_name", { required: true }),
        faable_api_key: core.getInput("faable_api_key", { required: true }),
        faable_user: core.getInput("faable_user", { required: true }),
        enable_debug: core.getInput("enable_debug") ? true : false,
    };
};
exports.get_context = get_context;
