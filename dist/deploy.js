"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
child_process_1.execSync("ls -als", { stdio: "inherit" });
child_process_1.execSync("docker ps", { stdio: "inherit" });
console.log("HAHA");
