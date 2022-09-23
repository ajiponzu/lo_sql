mod db;

pub use db::MySqlPool;
use sqlx::MySql;
use tauri::State;

use self::db::get_mysql_pool;

#[derive(sqlx::FromRow, Debug)]
struct TableInf {
    pub _name: String,
}

#[tauri::command]
pub async fn greet(name: &str, pool: State<'_, MySqlPool>) -> Result<String, String> {
    let user = "root";
    let password = "password";
    let host = "127.0.0.1";
    let port = "3306";

    let database_url = format!("mysql://{}:{}@{}:{}/{}", user, password, host, port, name);

    let pool_new = match db::get_new_pool::<MySql>(&database_url).await {
        Some(pool_new) => pool_new,
        None => {
            return Err("connection failed.....".to_string());
        }
    };

    {
        let mut guard = match pool.0.lock() {
            Ok(guard) => guard,
            Err(e) => {
                return Err(format!("{e}: connection failed....."));
            }
        };
        *guard = Some(pool_new);
    }

    Ok("connect.....".to_string())
}

#[tauri::command]
pub async fn greet2(name: &str, pool: State<'_, MySqlPool>) -> Result<String, String> {
    let pool = match get_mysql_pool(pool) {
        Some(pool) => pool,
        None => panic!("todo!"),
    };

    let table_infs = sqlx::query_as::<_, TableInf>(
        "select table_name as _name from information_schema.tables where table_schema = ?",
    )
    .bind::<String>(name.to_string())
    .fetch_all(&pool)
    .await;

    match table_infs {
        Ok(inf) => Ok(format!("{:?}", inf)),
        Err(e) => Err(format!("sql_execute_error: {}", e.to_string())),
    }
}
