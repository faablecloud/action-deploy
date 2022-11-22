'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
require('../node_modules/fs-extra/lib/index.js');
var run_cmd = require('../lib/run_cmd.js');
var log = require('../log.js');
var prepare_dockerfile = require('./prepare_dockerfile.js');

const deploy_action = (ctx, options = { upload: true, cache: true }) => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
    if (ctx.enable_debug) {
        log.log.debug(ctx);
    }
    const cmd = run_cmd.get_cmd(ctx);
    // Prepare setup
    log.log.info("🥤 Building image...");
    yield prepare_dockerfile.prepare_dockerfile();
    // copy_files();
    const tag = `harbor.app.faable.com/${ctx.faable_user}/${ctx.faable_app_name}`;
    // Execute build
    cmd("docker", ["build", `-t`, tag, "."]);
    log.log.info(`✅ Build ${ctx.faable_app_name} successful`);
    if (options.upload) {
        // Registry login
        cmd(`echo "${ctx.faable_api_key}" | docker login --username faablecloud#${ctx.faable_user}+deployment --password-stdin harbor.app.faable.com`);
        // Upload the image to faable registry
        cmd(`docker push ${tag}`);
        log.log.info("✅ Successfully deployed to FaableCloud");
    }
    else {
        log.log.warning("🔁 Skipped upload");
    }
});

exports.deploy_action = deploy_action;
