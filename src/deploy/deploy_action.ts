import fs from "fs-extra";
import { FaableContext, get_context } from "../lib/FaableContext";
import { get_cmd } from "../lib/run_cmd";
import { log } from "../log";

const copy_files = () => {
  const templates = __dirname + "/templates";
  const dst = process.cwd();
  fs.copySync(`${templates}/Dockerfile.hbs`, `${dst}/Dockerfile`);
  fs.copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
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
    log.debug(ctx);
  }
  const cmd = get_cmd(ctx);

  // Prepare setup
  log.info("🥤 Building image...");
  copy_files();

  const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;

  // Execute build
  cmd("docker", ["build", `-t`, tag, "."]);
  log.info(`✅ Build ${ctx.faable_app_name} successful`);

  if (options.upload) {
    // Registry login
    cmd(
      `echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`
    );
    // Upload the image to faable registry
    cmd(`docker push ${tag}`);

    log.info("✅ Successfully deployed to FaableCloud");
  } else {
    log.warning("🔁 Skipped upload");
  }
};
