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
        faable_app_name: core.getInput("faable_app_name"),
        faable_api_key: core.getInput("faable_api_key"),
    };
};
const main = () => {
    console.log("Building docker image");
    copy_files();
    console.log("Files copied");
    const ctx = get_context();
    const tag = `registry.faable.com/${ctx.faable_app_name}`;
    // Execute build
    child_process_1.execSync("ls -als", { stdio: "inherit" });
    child_process_1.execSync(`docker build -t ${tag} .`, { stdio: "inherit" });
    child_process_1.execSync(`docker images`, { stdio: "inherit" });
    core.setOutput("status", "✅ Successfully deployed to FaableCloud");
    core.setOutput("status", `✅ https://${ctx.faable_app_name}.app.faable.com`);
};
main();
