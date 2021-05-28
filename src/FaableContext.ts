import * as core from "@actions/core";

export type FaableContext = {
  faable_app_name: string;
  faable_api_key: string;
  faable_user: string;
  enable_debug: boolean;
};

export const get_context = (): FaableContext => {
  return {
    faable_app_name: core.getInput("faable_app_name", { required: true }),
    faable_api_key: core.getInput("faable_api_key", { required: true }),
    faable_user: core.getInput("faable_user", { required: true }),
    enable_debug: core.getInput("enable_debug") ? true : false,
  };
};
