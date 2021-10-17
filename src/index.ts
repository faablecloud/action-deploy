import { deploy_action } from "./deploy/deploy_action";
import { get_context } from "./lib/FaableContext";
import pkg from "../package.json";

const main = () => {
  console.log(`🚀 FaableCloud ${pkg.name} - ${pkg.version}`);
  const ctx = get_context();
  try {
    deploy_action(ctx);
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
};
main();
