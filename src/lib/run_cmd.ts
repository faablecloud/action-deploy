import { execSync, spawnSync } from "child_process";
import { FaableContext } from "./FaableContext";

export const run_cmd = (ctx: FaableContext) => (command: string) => {
  if (ctx.enable_debug) {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } else {
    execSync(command);
  }
};

export const spawn_cmd =
  (ctx: FaableContext) => (cmd: string, args?: string[]) => {
    try {
      const process = spawnSync(cmd, args, {
        stdio: "inherit",
        shell: true,
      });
      if (process.status != 0) {
        const out = process.output.toString();
        console.log(out);
        throw new Error(`Bad Exit ${process.status}`);
      }
    } catch (error) {
      console.log(error);
      const params = args ? args.join(" ") : "";
      throw new Error(`Error running command ${cmd} with ${params}`);
    }
  };
