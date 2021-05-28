"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup_dependencies_in_cache = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const md5_1 = __importDefault(require("md5"));
const cache_1 = require("@actions/cache");
const run_cmd_1 = require("./run_cmd");
const file_hash = async (filePath) => {
    const buf = await fs_extra_1.default.readFile(filePath);
    return md5_1.default(buf);
};
const setup_dependencies_in_cache = async (ctx) => {
    const paths = ["node_modules"];
    const key = `faable-build-${file_hash("yarn.lock")}`;
    const cacheKey = await cache_1.restoreCache(paths, key, ["faable-build-"]);
    if (cacheKey) {
        console.log(`Restored previous cache`);
    }
    else {
        console.log(`no previous cache found`);
    }
    run_cmd_1.run_cmd(ctx)(`yarn install --production=false --frozen-lockfile`);
    // Save cached node_modules
    const cacheId = await cache_1.saveCache(paths, key);
    console.log(`Saved node_modules cache ${cacheId}`);
};
exports.setup_dependencies_in_cache = setup_dependencies_in_cache;
