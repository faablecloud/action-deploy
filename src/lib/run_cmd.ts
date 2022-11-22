import exec from "@actions/exec";

export const cmd = async (cmd: string, args?: string[]) => {
  let myOutput = "";
  let myError = "";

  const options: exec.ExecOptions = {};
  options.listeners = {
    stdout: (data: Buffer) => {
      myOutput += data.toString();
    },
    stderr: (data: Buffer) => {
      myError += data.toString();
    },
  };
  options.cwd = "./lib";

  await exec.exec(cmd, args, options);
  return myOutput;
};
