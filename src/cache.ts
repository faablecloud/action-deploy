import fs from "fs-extra";
import md5 from "md5";
import { saveCache, restoreCache } from "@actions/cache";
import { FaableContext } from "./FaableContext";
import { run_cmd } from "./run_cmd";

const file_hash = async (filePath: string) => {
  const buf = await fs.readFile(filePath);
  return md5(buf);
};

export const setup_dependencies_in_cache = async (ctx: FaableContext) => {
  const paths = ["node_modules"];
  const key = `faable-build-${file_hash("yarn.lock")}`;
  const cacheKey = await restoreCache(paths, key, ["faable-build-"]);
  if (cacheKey) {
    console.log(`Restored previous cache`);
  } else {
    console.log(`no previous cache found`);
  }

  run_cmd(ctx)(`yarn install --production=false --frozen-lockfile`);

  // Save cached node_modules

  const cacheId = await saveCache(paths, key);
  console.log(`Saved node_modules cache id:${cacheId} key:${key}`);
};
