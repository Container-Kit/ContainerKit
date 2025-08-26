use crate::types::CommandResult;
use elevated_command::Command;
use std::process::Command as StdCommand;

#[tauri::command]
#[specta::specta]
pub async fn execute_with_elevated_command(
    command: String,
    args: Vec<String>,
) -> Result<CommandResult, String> {
    let is_elevated = Command::is_elevated();

    let mut cmd = StdCommand::new(&command);
    cmd.args(&args);

    let output = if is_elevated {
        cmd.output().map_err(|e| e.to_string())?
    } else {
        let mut elevated_cmd = Command::new(cmd);
        elevated_cmd.name("ContainerKit".to_string());
        elevated_cmd.icon(include_bytes!("../../icons/icon.icns").to_vec());
        elevated_cmd.output().map_err(|e| e.to_string())?
    };

    use std::os::unix::process::ExitStatusExt;

    Ok(CommandResult {
        signal: output.status.signal(),
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        code: output.status.code(),
    })
}
