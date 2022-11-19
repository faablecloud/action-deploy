import { spawnSync } from "child_process";
import { FaableContext } from "./FaableContext";

export const get_cmd =
  (ctx: FaableContext) => (cmd: string, args?: string[]) => {
    try {
      if (ctx.enable_debug) {
        console.log(`Running: ${cmd}`);
      }
      const process = spawnSync(cmd, args, {
        stdio: ctx.enable_debug ? "inherit" : "ignore",
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
