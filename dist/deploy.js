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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const core = __importStar(require("@actions/core"));
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
    const app_name = core.getInput("app_name");
    const tag = `registry.faable.com/${app_name}`;
    // Execute build
    child_process_1.execSync("ls -als", { stdio: "inherit" });
    child_process_1.execSync(`docker build -t ${tag} .`, { stdio: "inherit" });
    child_process_1.execSync(`docker images`, { stdio: "inherit" });
    core.setOutput("status", "✅ Successfully deployed to FaableCloud");
    core.setOutput("status", `✅ https://${app_name}.app.faable.com`);
};
main();
