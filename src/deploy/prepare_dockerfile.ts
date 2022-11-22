import * as fs from "fs-extra";
import Handlebars from "handlebars";
import * as path from "path";
export interface DockerTemplate {
  from_image: string;
  enablebuild?: boolean;
  build_script?: string;
  start_script?: string;
}

const default_build: DockerTemplate = {
  from_image: "node:18.12.0",
  enablebuild: true,
  build_script: "build",
  start_script: "start",
};

const templates_dir = path.join(__dirname, "../../templates");
const dockerfile = fs
  .readFileSync(`${templates_dir}/Dockerfile.hbs`)
  .toString();
const docker_template = Handlebars.compile(dockerfile);

export const prepare_dockerfile = async (
  data: DockerTemplate = default_build
) => {
  // Compose template with data and write to path
  const dockerfile = docker_template(data);
  await fs.writeFile(dockerfile, "./Dockerfile");
  return;
};
