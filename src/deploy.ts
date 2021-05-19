import { execSync } from "child_process";
import { copySync } from "fs-extra";
import path from "path";
import core from "@actions/core";

const copy_files = () => {
  const templates = path.join(__dirname, "..", "templates");
  const dst = path.join(process.cwd(), "Dockerfile");
  copySync(`${templates}/Dockerfile.template`, `${dst}/Dockerfile`);
  copySync(`${templates}/entrypoint.sh`, `${dst}/entrypoint.sh`);
};

const main = () => {
  console.log("Building docker image");
  copy_files();
  console.log("Files copied");
  const app_name = core.getInput("app_name");
  const tag = `registry.faable.com/${app_name}`;
  execSync("ls -als", { stdio: "inherit" });
  execSync(`docker build -t ${tag} .`, { stdio: "inherit" });
  execSync(`docker images`, { stdio: "inherit" });
};

main();
