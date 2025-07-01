use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

#[tauri::command]
#[specta::specta] // < You must annotate your commands
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![greet]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(Typescript::default(), "../src/lib/models/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
