import { Command } from "@tauri-apps/plugin-shell";
import type { Output } from "./models";
import { validateCommandOutput } from "./utils";

export async function createContainer(name: string, image: string): Promise<void> {
  // const command = new Command(`docker create --name ${name} ${image}`);
  // await command.execute();
}

export async function getAllContainers(): Promise<Output> {
  const command = Command.create("container", [
    "ls",
    "-a",
    "--format",
    "json",
  ])
  const output = await command.execute();
  return validateCommandOutput(output)
}

export async function startContainer(id: string): Promise<Output> {
  const command = Command.create("container", ["start", id]);
  const output = await command.execute();
  return validateCommandOutput(output);
}

export async function stopContainer(id: string): Promise<Output> {
  const command = Command.create("container", ["stop", id]);
  const output = await command.execute();
  return validateCommandOutput(output);
}

export async function removeContainer(id: string): Promise<Output> {
  const command = Command.create("container", ["rm", id]);
  const output = await command.execute();
  return validateCommandOutput(output);
}
