#[cfg(debug_assertions)]
use specta_typescript::Typescript;
use tauri_specta::{Builder, collect_commands};

use crate::commands::registry::run_container_command_with_stdin;

// mods
mod commands;

include!(concat!("../migrations", "/generated_migrations.rs"));

#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let migrations = load_migrations();

    let spectabuilder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![greet, run_container_command_with_stdin]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    spectabuilder
        .export(Typescript::default(), "../src/lib/models/bindings.ts")
        .expect("Failed to export typescript bindings");

    #[cfg(debug_assertions)]
    let builder = tauri::Builder::default().plugin(tauri_plugin_devtools::init());
    #[cfg(not(debug_assertions))]
    let builder = tauri::Builder::default();

    builder
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        //         .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        //         .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:container-kit.db", migrations)
                .build(),
        )
        .invoke_handler(spectabuilder.invoke_handler())
        .setup(move |app| {
            spectabuilder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
