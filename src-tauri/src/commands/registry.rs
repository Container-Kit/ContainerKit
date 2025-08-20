use crate::types::CommandResult;
use std::{os::unix::process::ExitStatusExt, process::Command};

// Copied from https://github.com/ducheharsh/apple-container-desktop/blob/main/src-tauri/src/lib.rs
#[tauri::command]
#[specta::specta]
pub async fn run_container_command_with_stdin(
    args: Vec<String>,
    stdin: String,
) -> Result<CommandResult, String> {
    use std::io::Write;
    use std::process::Stdio;

    let container_cli = "container".to_string();

    let mut child = Command::new(&container_cli)
        .args(&args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn command: {}", e))?;

    if let Some(stdin_handle) = child.stdin.as_mut() {
        stdin_handle
            .write_all(stdin.as_bytes())
            .map_err(|e| format!("Failed to write to stdin: {}", e))?;
        stdin_handle
            .flush()
            .map_err(|e| format!("Failed to flush stdin: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Failed to wait for command: {}", e))?;

    let result = CommandResult {
        signal: output.status.signal(),
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        code: output.status.code(),
    };

    Ok(result)
}
