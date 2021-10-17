import { copySync } from "fs-extra";
import * as path from "path";
import { setup_dependencies_in_cache } from "./cache";
import { FaableContext, get_context } from "../lib/FaableContext";
import { run_cmd, spawn_cmd } from "../lib/run_cmd";
import { logger } from "../log";

const log = logger.child({ name: "deploy" });

const copy_files = () => {
  const templates = path.join(__dirname, "..", "..", "templates");
  const dst = process.cwd();
  copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
  copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};

interface DeployOptions {
  upload: boolean;
  cache: boolean;
}

export const deploy_action = async (
  ctx: FaableContext,
  options: DeployOptions = { upload: true, cache: true }
) => {
  if (ctx.enable_debug) {
    console.log(ctx);
  }
  const cmd = run_cmd(ctx);

  // Prepare setup
  log.info("🥤 Building docker image...");
  copy_files();

  // Install dependencies
  if (options.cache) {
    try {
      await setup_dependencies_in_cache(ctx);
    } catch (error) {
      log.error("Cannot setup cache");
    }
  } else {
    log.info("🔁 Skipped github cache");
  }

  const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;

  // Execute build
  spawn_cmd(ctx)("docker", [
    "build",
    `--build-arg`,
    `arg_NPM_RUN_COMMAND="${ctx.npm_start_command}"`,
    `--build-arg`,
    `arg_NPM_BUILD_COMMAND="${ctx.npm_build_command}"`,
    `-t`,
    tag,
    ".",
  ]);
  log.info(`✅ Build ${ctx.faable_app_name} successful`);

  // cmd(
  //   `docker build --build-arg arg_NPM_RUN_COMMAND=${ctx.npm_start_command} --build-arg arg_NPM_BUILD_COMMAND=${ctx.npm_build_command} -t ${tag} .`
  // );

  if (options.upload) {
    // Registry login
    cmd(
      `echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`
    );
    // Upload the image to faable registry
    cmd(`docker push ${tag}`);

    log.info("✅ Successfully deployed to FaableCloud");
  } else {
    log.info("🔁 Skipped upload");
  }
};
