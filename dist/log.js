'use strict';

const core = require("@actions/core");
const log = {
    error: core.error,
    info: core.info,
    notice: core.notice,
    warning: core.warning,
    debug: core.debug,
};

exports.log = log;
