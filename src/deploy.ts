import { execSync } from "child_process";

execSync("ls -als", { stdio: "inherit" });
execSync("docker ps", { stdio: "inherit" });

console.log("HAHA");
