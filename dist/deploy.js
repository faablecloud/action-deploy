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
const fs_extra_1 = require("fs-extra");
const path = __importStar(require("path"));
const cache_1 = require("./cache");
const FaableContext_1 = require("./FaableContext");
const run_cmd_1 = require("./run_cmd");
const copy_files = () => {
    const templates = path.join(__dirname, "..", "templates");
    const dst = process.cwd();
    fs_extra_1.copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
    fs_extra_1.copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};
const main = async () => {
    const ctx = FaableContext_1.get_context();
    if (ctx.enable_debug) {
        console.log(ctx);
    }
    const cmd = run_cmd_1.run_cmd(ctx);
    // Prepare setup
    console.log("🥤 Building docker image...");
    copy_files();
    // Install dependencies
    await cache_1.setup_dependencies_in_cache(ctx);
    // Execute build
    const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;
    cmd(`echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`);
    cmd(`docker build --build-arg arg_NPM_RUN_COMMAND=${ctx.npm_start_command} --build-arg arg_NPM_BUILD_COMMAND=${ctx.npm_build_command} -t ${tag} .`);
    cmd(`docker push ${tag}`);
    console.log("✅ Successfully deployed to FaableCloud");
    console.log(`✅ https://${ctx.faable_app_name}.app.faable.com`);
};
main().catch((e) => {
    console.log(e);
    process.exit(-1);
});
