'use strict';

var child_process = require('child_process');
var log = require('../log.js');

const get_cmd = (ctx) => (cmd, args) => {
    try {
        if (ctx.enable_debug) {
            log.log.debug(`Running: ${cmd}`);
        }
        const process = child_process.spawnSync(cmd, args, {
            stdio: ctx.enable_debug ? "inherit" : "ignore",
            shell: true,
        });
        if (process.status != 0) {
            const out = process.output.toString();
            console.debug(out);
            throw new Error(`Bad Exit ${process.status}`);
        }
    }
    catch (error) {
        log.log.error(error);
        const params = args ? args.join(" ") : "";
        throw new Error(`Error running command ${cmd} with ${params}`);
    }
};

exports.get_cmd = get_cmd;
