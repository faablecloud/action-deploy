import { FaableContext } from "../lib/FaableContext";
import { cmd } from "../lib/run_cmd";
import { log } from "../log";
import { prepare_dockerfile } from "../prepare_dockerfile";

interface DeployOptions {
  upload: boolean;
  cache: boolean;
}

export const deploy_action = async (
  ctx: FaableContext,
  options: DeployOptions = { upload: true, cache: true }
) => {
  if (ctx.enable_debug) {
    log.debug(JSON.stringify(ctx));
  }

  // Prepare setup
  log.info("🥤 Building image...");
  await prepare_dockerfile();
  // copy_files();

  const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;

  // Execute build
  await cmd("docker", ["build", `-t`, tag, "."]);
  log.info(`✅ Build ${ctx.faable_app_name} successful`);

  if (options.upload) {
    // Registry login
    await cmd("bash", [
      `echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`,
    ]);
    // Upload the image to faable registry
    await cmd("docker", ["push", tag]);

    log.info("✅ Deployed to FaableCloud");
  } else {
    log.warning("🔁 Skipped upload");
  }
};
