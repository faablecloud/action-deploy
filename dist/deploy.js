"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const main = () => {
    console.log("Building docker image");
    const dockerfile = path_1.default.join(__dirname, "..", "templates/Dockerfile");
    fs_extra_1.copySync(dockerfile, process.cwd());
    console.log("Copied to ", dockerfile, process.cwd());
    child_process_1.execSync("ls -als", { stdio: "inherit" });
    child_process_1.execSync("docker build .", { stdio: "inherit" });
};
main();
