#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod api;
use std::sync::Mutex;

fn main() {
    tauri::Builder::default()
        .manage(api::MySqlPool(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            api::greet,
            api::greet2,
            api::show_mysql_tables
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
