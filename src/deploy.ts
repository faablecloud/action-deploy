import { execSync } from "child_process";
import { copySync } from "fs-extra";
import * as path from "path";
import * as core from "@actions/core";

const copy_files = () => {
  const templates = path.join(__dirname, "..", "templates");
  const dst = process.cwd();
  copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
  copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};

type FaableContext = {
  faable_app_name: string;
  faable_api_key: string;
  faable_user: string;
  enable_debug: boolean;
};

const get_context = (): FaableContext => {
  return {
    faable_app_name: core.getInput("faable_app_name", { required: true }),
    faable_api_key: process.env.FAABLE_API_KEY as string,
    faable_user: core.getInput("faable_user", { required: true }),
    enable_debug: core.getInput("enable_debug") ? true : false,
  };
};

const run_cmd = (ctx: FaableContext) => (command: string) => {
  if (ctx.enable_debug) {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } else {
    execSync(command);
  }
};

const main = () => {
  const ctx = get_context();
  if (ctx.enable_debug) {
    console.log(ctx);
  }
  const cmd = run_cmd(ctx);
  // Prepare setup
  console.log("🥤 Building docker image...");
  copy_files();

  // Execute build
  const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;
  cmd(`docker build -t ${tag} .`);
  cmd(
    `echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin`
  );
  cmd(`docker push ${tag}`);

  console.log("✅ Successfully deployed to FaableCloud");
  console.log(`✅ https://${ctx.faable_app_name}.app.faable.com`);
};

main();
