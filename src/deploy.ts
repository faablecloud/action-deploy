import { execSync } from "child_process";
import { copySync } from "fs-extra";
import path from "path";

const main = () => {
  console.log("Building docker image");
  const dockerfile_src = path.join(
    __dirname,
    "..",
    "templates/Dockerfile.template"
  );
  const dockerfile_dst = path.join(process.cwd(), "Dockerfile");
  console.log("Copy", dockerfile_src, dockerfile_dst);
  copySync(dockerfile_src, dockerfile_dst);
  execSync("ls -als", { stdio: "inherit" });
  execSync("docker build .", { stdio: "inherit" });
};

main();
