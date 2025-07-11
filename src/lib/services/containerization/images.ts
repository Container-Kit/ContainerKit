import {Command} from "@tauri-apps/plugin-shell";
import {validateCommandOutput} from "$lib/services/containerization/utils";
import type {Output} from "$lib/services/containerization/models";

export async function getAllImages(): Promise<Output> {
    const command = Command.create("container", [
        "image",
        "ls",
        "--format",
        "json",
    ])
    const output = await command.execute();
    return validateCommandOutput(output)
}