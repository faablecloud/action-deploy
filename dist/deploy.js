"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path = require("path");
const core = require("@actions/core");
const copy_files = () => {
    const templates = path.join(__dirname, "..", "templates");
    const dst = process.cwd();
    fs_extra_1.copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
    fs_extra_1.copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};
const get_context = () => {
    return {
        faable_app_name: core.getInput("faable_app_name", { required: true }),
        faable_api_key: process.env.FAABLE_API_KEY,
        faable_user: core.getInput("faable_user", { required: true }),
        enable_debug: core.getInput("enable_debug") ? true : false,
    };
};
const run_cmd = (ctx) => (command) => {
    if (ctx.enable_debug) {
        console.log(`Running: ${command}`);
        child_process_1.execSync(command, { stdio: "inherit" });
    }
    else {
        child_process_1.execSync(command);
    }
};
const main = () => {
    const ctx = get_context();
    if (ctx.enable_debug) {
        console.log(ctx);
    }
    const cmd = run_cmd(ctx);
    // Prepare setup
    console.log("🥤 Building docker image...");
    copy_files();
    // Execute build
    const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;
    cmd(`docker build -t ${tag} .`);
    cmd(`echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin`);
    cmd(`docker push ${tag}`);
    console.log("✅ Successfully deployed to FaableCloud");
    console.log(`✅ https://${ctx.faable_app_name}.app.faable.com`);
};
main();
