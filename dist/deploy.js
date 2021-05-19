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
    const dockerfile_src = path_1.default.join(__dirname, "..", "templates/Dockerfile.template");
    const dockerfile_dst = path_1.default.join(process.cwd(), "Dockerfile");
    console.log("Copy", dockerfile_src, dockerfile_dst);
    fs_extra_1.copySync(dockerfile_src, dockerfile_dst);
    child_process_1.execSync("ls -als", { stdio: "inherit" });
    child_process_1.execSync("docker build .", { stdio: "inherit" });
};
main();
