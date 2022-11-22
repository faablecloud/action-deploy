import { setFailed } from "@actions/core";
import { spawnSync } from "child_process";
import { log } from "../log";
import { FaableContext } from "./FaableContext";

export const get_cmd =
  (ctx: FaableContext) => (cmd: string, args?: string[]) => {
    try {
      if (ctx.enable_debug) {
        log.debug(`Running: ${cmd}`);
      }
      const process = spawnSync(cmd, args, {
        stdio: ctx.enable_debug ? "inherit" : "ignore",
        shell: true,
      });
      if (process.status != 0) {
        const out = process.output.toString();
        log.debug(out);
        throw new Error(`Bad Exit ${process.status}`);
      }
    } catch (error: any) {
      log.error(error as Error);
      const params = args ? args.join(" ") : "";
      const failure = `Error running command ${cmd} with ${params}`;
      setFailed(failure);
      throw new Error(failure);
    }
  };
