import { execSync } from "child_process";
import { copySync } from "fs-extra";
import path from "path";

const main = () => {
  console.log("Building docker image");
  const dockerfile = path.join(__dirname, "..", "templates/Dockerfile");
  copySync(dockerfile, process.cwd());
  console.log("Copied to ", dockerfile, process.cwd());
  execSync("ls -als", { stdio: "inherit" });
  execSync("docker build .", { stdio: "inherit" });
};

main();
