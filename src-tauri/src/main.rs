#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[derive(sqlx::FromRow, Debug)]
struct TableInf {
    pub name: String,
}

#[tauri::command]
async fn greet(name: &str) -> Result<String, ()> {
    let user = "root";
    let password = "password";
    let host = "127.0.0.1";
    let port = "3306";

    let database_url = format!("mysql://{}:{}@{}:{}/{}", user, password, host, port, &name);

    let pool_ret = sqlx::mysql::MySqlPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await;
    let message_wrap: Result<String, ()> = match pool_ret {
        Ok(pool) => {
            println!("db_connected....");
            let table_infs = sqlx::query_as::<_, TableInf>(
                "select table_name as name from information_schema.tables where table_schema = ?",
            )
            .bind::<String>(name.to_string())
            .fetch_all(&pool)
            .await;
            match table_infs {
                Ok(inf) => Result::Ok(format!("tables: {:?}", inf)),
                Err(e) => Result::Ok(format!("sql_execute_error: {}", e.to_string())),
            }
        }
        Err(e) => Result::Ok(format!("sql_execute_error: {}", e.to_string())),
    };
    message_wrap
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
