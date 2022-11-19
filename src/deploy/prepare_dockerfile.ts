import fs from "fs-extra";
import Handlebars from "handlebars";

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

export const prepare_dockerfile = async (
  data: DockerTemplate = default_build,
  write_to: string
) => {
  const templates_dir = __dirname + "/templates";
  const docker_tpl = await fs.readFile(`${templates_dir}/Dockerfile.hbs`);

  // Compose template with data and write to path
  const template = Handlebars.compile(docker_tpl.toString());
  const dockerfile = template(data);
  await fs.writeFile(dockerfile, write_to);

  return;
};
