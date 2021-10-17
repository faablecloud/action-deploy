import { execSync, spawnSync } from "child_process";
import { logger } from "../log";
import { FaableContext } from "./FaableContext";

const log = logger.child({ name: "cmd" });

export const run_cmd = (ctx: FaableContext) => (command: string) => {
  if (ctx.enable_debug) {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } else {
    const fs = execSync(command);
  }
};

export const spawn_cmd =
  (ctx: FaableContext) => (cmd: string, args?: string[]) => {
    try {
      const process = spawnSync(cmd, args, {
        stdio: "inherit",
      });
      if (process.status != 0) {
        const out = process.output.toString();
        log.info(out);
        throw new Error(`Bad Exit ${process.status}`);
      }
    } catch (error) {
      console.log(error);
      throw new Error(`Error running command ${cmd} with ${args?.join(" ")}`);
    }
  };
