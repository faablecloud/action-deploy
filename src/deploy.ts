import { execSync } from "child_process";
import { copySync } from "fs-extra";
import * as path from "path";
import * as core from "@actions/core";

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

  // Execute build
  execSync("ls -als", { stdio: "inherit" });
  execSync(`docker build -t ${tag} .`, { stdio: "inherit" });
  execSync(`docker images`, { stdio: "inherit" });

  core.setOutput("status", "✅ Successfully deployed to FaableCloud");
  core.setOutput("status", `✅ https://${app_name}.app.faable.com`);
};

main();
