const core = require("@actions/core");

export const log = {
  error: core.error,
  info: core.info,
  notice: core.notice,
  warning: core.warning,
  debug: core.debug,
};
