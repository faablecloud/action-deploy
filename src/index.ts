import { deploy_action } from "./deploy/deploy_action";
import { get_context } from "./lib/FaableContext";
import * as path from "path";
import { log } from "./log";
import { setFailed } from "@actions/core";
const pkg = require(path.join(__dirname, "../package.json"));

const main = async () => {
  log.info(`🚀 faable.com ${pkg.name} - ${pkg.version}`);
  console.log(process.env);
  const ctx = get_context();
  try {
    await deploy_action(ctx);
  } catch (error: any) {
    log.error((error as Error).message);
    setFailed(error);
    process.exit(-1);
  }
};

main();
