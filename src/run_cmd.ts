import { execSync } from "child_process";
import { FaableContext } from "./FaableContext";

export const run_cmd = (ctx: FaableContext) => (command: string) => {
  if (ctx.enable_debug) {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } else {
    execSync(command);
  }
};
