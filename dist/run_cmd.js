"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_cmd = void 0;
const child_process_1 = require("child_process");
const run_cmd = (ctx) => (command) => {
    if (ctx.enable_debug) {
        console.log(`Running: ${command}`);
        child_process_1.execSync(command, { stdio: "inherit" });
    }
    else {
        child_process_1.execSync(command);
    }
};
exports.run_cmd = run_cmd;
