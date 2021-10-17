import test from "ava";

import { FaableContext } from "../lib/FaableContext";
import { deploy_action } from "../deploy/deploy_action";

test("deploy", async (t) => {
  const ctx: FaableContext = {
    faable_app_name: "test",
    faable_api_key: "1234",
    faable_user: "test",
    enable_debug: false,
    npm_build_command: "build",
    npm_start_command: "start",
  };
  await deploy_action(ctx, { cache: false, upload: false });
  t.pass();
});
