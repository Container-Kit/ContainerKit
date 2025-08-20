use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct CommandResult {
    pub signal: Option<i32>,
    pub stdout: String,
    pub stderr: String,
    pub code: Option<i32>,
}
