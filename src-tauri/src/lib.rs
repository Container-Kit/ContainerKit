use specta_typescript::Typescript;
use tauri_specta::{Builder, collect_commands};

#[tauri::command]
#[specta::specta] // < You must annotate your commands
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let spectabuilder = Builder::<tauri::Wry>::new().commands(collect_commands![greet]);

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
        .invoke_handler(spectabuilder.invoke_handler())
        .setup(move |app| {
            spectabuilder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
