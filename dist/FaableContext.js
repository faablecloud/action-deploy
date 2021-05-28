"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_context = void 0;
const core = __importStar(require("@actions/core"));
const get_context = () => {
    return {
        faable_app_name: core.getInput("faable_app_name", { required: true }),
        faable_api_key: core.getInput("faable_api_key", { required: true }),
        faable_user: core.getInput("faable_user", { required: true }),
        enable_debug: core.getInput("enable_debug") ? true : false,
        npm_build_command: core.getInput("npm_build_command") || "build",
        npm_start_command: core.getInput("npm_start_command") || "start",
    };
};
exports.get_context = get_context;
