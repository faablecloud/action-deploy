"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path = require("path");
const FaableContext_1 = require("./FaableContext");
const run_cmd_1 = require("./run_cmd");
const cache_1 = require("@actions/cache");
const copy_files = () => {
    const templates = path.join(__dirname, "..", "templates");
    const dst = process.cwd();
    fs_extra_1.copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
    fs_extra_1.copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};
const setup_dependencies = async (ctx) => {
    const paths = ["node_modules"];
    const key = "yarn-last-build";
    const cacheKey = await cache_1.restoreCache(paths, key, [key]);
    if (cacheKey) {
        console.log(`Restored previous cache`);
    }
    else {
        console.log(`no previous cache found`);
    }
    run_cmd_1.run_cmd(ctx)(`yarn install --production=false --frozen-lockfile`);
    const cacheId = await cache_1.saveCache(paths, key);
    console.log(`Saved node_modules cache ${cacheId}`);
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
    await setup_dependencies(ctx);
    // Execute build
    const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;
    cmd(`echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`);
    cmd(`docker build -t ${tag} .`);
    cmd(`docker push ${tag}`);
    console.log("✅ Successfully deployed to FaableCloud");
    console.log(`✅ https://${ctx.faable_app_name}.app.faable.com`);
};
main();
