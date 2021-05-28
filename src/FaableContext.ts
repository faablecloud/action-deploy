import * as core from "@actions/core";

export type FaableContext = {
  faable_app_name: string;
  faable_api_key: string;
  faable_user: string;
  enable_debug: boolean;
  npm_build_command: string;
  npm_start_command: string;
};

export const get_context = (): FaableContext => {
  return {
    faable_app_name: core.getInput("faable_app_name", { required: true }),
    faable_api_key: core.getInput("faable_api_key", { required: true }),
    faable_user: core.getInput("faable_user", { required: true }),
    enable_debug: core.getInput("enable_debug") ? true : false,
    npm_build_command: core.getInput("npm_build_command") || "build",
    npm_start_command: core.getInput("npm_start_command") || "start",
  };
};
