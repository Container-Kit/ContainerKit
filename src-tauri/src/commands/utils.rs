use std::io::Read;
use std::os::unix::process::ExitStatusExt;
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter};
use tokio::task;

#[derive(Clone, serde::Serialize, specta::Type)]
#[serde(tag = "type", content = "data", rename_all = "camelCase")]
pub enum StreamChunk {
    Stdout(String),
    Stderr(String),
}

/// Run `container <args>`, emitting `StreamChunk` payloads on `event_name` as
/// output arrives. Resolves with the exit code once the process finishes.
#[tauri::command]
#[specta::specta]
pub async fn stream_container_command(
    app: AppHandle,
    args: Vec<String>,
    event_name: String,
) -> Result<Option<i32>, String> {
    let mut child = Command::new("container")
        .args(&args)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn command: {}", e))?;

    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    let stderr = child.stderr.take().ok_or("Failed to capture stderr")?;

    // Drain both pipes concurrently so neither can fill up and block the child.
    let stdout_task = spawn_pipe_reader(stdout, app.clone(), event_name.clone(), StreamChunk::Stdout);
    let stderr_task = spawn_pipe_reader(stderr, app, event_name, StreamChunk::Stderr);

    let status = task::spawn_blocking(move || child.wait())
        .await
        .map_err(|e| e.to_string())?
        .map_err(|e| format!("Failed to wait for command: {}", e))?;

    let _ = stdout_task.await;
    let _ = stderr_task.await;

    Ok(status.code().or(status.signal()))
}

fn spawn_pipe_reader<R>(
    pipe: R,
    app: AppHandle,
    event_name: String,
    wrap: fn(String) -> StreamChunk,
) -> task::JoinHandle<()>
where
    R: Read + Send + 'static,
{
    task::spawn_blocking(move || {
        let mut pipe = pipe;
        let mut buffer = [0u8; 4096];
        loop {
            match pipe.read(&mut buffer) {
                Ok(0) | Err(_) => break,
                Ok(bytes_read) => {
                    let chunk = String::from_utf8_lossy(&buffer[..bytes_read]).to_string();
                    if app.emit(&event_name, wrap(chunk)).is_err() {
                        break;
                    }
                }
            }
        }
    })
}
