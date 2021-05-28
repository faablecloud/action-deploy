import { copySync } from "fs-extra";
import * as path from "path";
import { setup_dependencies_in_cache } from "./cache";
import { FaableContext, get_context } from "./FaableContext";
import { run_cmd } from "./run_cmd";

const copy_files = () => {
  const templates = path.join(__dirname, "..", "templates");
  const dst = process.cwd();
  copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
  copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};

const main = async () => {
  const ctx = get_context();
  if (ctx.enable_debug) {
    console.log(ctx);
  }
  const cmd = run_cmd(ctx);

  // Prepare setup
  console.log("🥤 Building docker image...");
  copy_files();

  // Install dependencies
  await setup_dependencies_in_cache(ctx);

  // Execute build
  const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;
  cmd(
    `echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`
  );
  cmd(
    `docker build --build-arg arg_NPM_RUN_COMMAND=${ctx.npm_start_command} --build-arg arg_NPM_BUILD_COMMAND=${ctx.npm_build_command} -t ${tag} .`
  );
  cmd(`docker push ${tag}`);

  console.log("✅ Successfully deployed to FaableCloud");
  console.log(`✅ https://${ctx.faable_app_name}.app.faable.com`);
};

main().catch((e) => {
  console.log(e);
  process.exit(-1);
});
