#[cfg(debug_assertions)]
use specta_typescript::Typescript;
use tauri_specta::{Builder, collect_commands};

use crate::commands::registry::run_container_command_with_stdin;
use crate::commands::shell::get_default_shell;
use crate::commands::system::execute_with_elevated_command;
use crate::commands::utils::stream_container_command;

// mods
mod commands;
mod types;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let spectabuilder = Builder::<tauri::Wry>::new().commands(collect_commands![
        run_container_command_with_stdin,
        execute_with_elevated_command,
        get_default_shell,
        stream_container_command
    ]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    spectabuilder
        .export(Typescript::default(), "../src/lib/models/bindings.ts")
        .expect("Failed to export typescript bindings");

    #[cfg(debug_assertions)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_devtools::init());
    #[cfg(not(debug_assertions))]
    let builder = tauri::Builder::default();

    builder
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_pty::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        // .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        //         .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(spectabuilder.invoke_handler())
        .setup(move |app| {
            spectabuilder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
