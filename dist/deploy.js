"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const core_1 = __importDefault(require("@actions/core"));
const copy_files = () => {
    const templates = path_1.default.join(__dirname, "..", "templates");
    const dst = path_1.default.join(process.cwd(), "Dockerfile");
    fs_extra_1.copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
    fs_extra_1.copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};
const main = () => {
    console.log("Building docker image");
    copy_files();
    console.log("Files copied");
    const app_name = core_1.default.getInput("app_name");
    const tag = `registry.faable.com/${app_name}`;
    child_process_1.execSync("ls -als", { stdio: "inherit" });
    child_process_1.execSync(`docker build -t ${tag} .`, { stdio: "inherit" });
    child_process_1.execSync(`docker images`, { stdio: "inherit" });
};
main();
