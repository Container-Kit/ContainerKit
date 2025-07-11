import type { ChildProcess } from "@tauri-apps/plugin-shell";
import type { Output } from "./models.js";

export function validateCommandOutput(output: ChildProcess<string>): Output {
  if (output.code === null) {
    return {
      error: true,
      message: "Process was terminated by a signal on Unix",
      stderr: output.stderr,
      stdout: output.stdout,
    };
  }

  if (!output.stdout) {
    return {
      error: true,
      message: "Error processing stdout",
      stderr: output.stderr,
      stdout: output.stdout,
    };
  }

  return {
    error: false,
    message: "Command executed successfully",
    stderr: output.stderr,
    stdout: output.stdout,
  };
}
