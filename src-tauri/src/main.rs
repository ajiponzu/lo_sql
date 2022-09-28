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
            api::login,
            api::show_mysql_tables,
            api::show_mysql_table_details,
            api::show_mysql_column_details,
            api::show_mysql_table_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
