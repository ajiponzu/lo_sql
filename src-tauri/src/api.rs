mod db;

pub use db::MySqlPool;
use sqlx::MySql;
use tauri::State;

use self::db::get_mysql_pool;

#[tauri::command(async)]
pub async fn login(db_name: &str, pool: State<'_, MySqlPool>) -> Result<String, String> {
    let user = "root";
    let password = "password";
    let host = "127.0.0.1";
    let port = "3306";

    let database_url = format!(
        "mysql://{}:{}@{}:{}/{}",
        user, password, host, port, db_name
    );

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

#[tauri::command(async)]
pub async fn show_mysql_tables(
    db_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = match get_mysql_pool(pool) {
        Some(pool) => pool,
        None => return Err("failed getting mysql pool".to_string()),
    };

    db::get_mysql_table_names(&pool, db_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_table_details(
    db_name: &str,
    table_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = match get_mysql_pool(pool) {
        Some(pool) => pool,
        None => return Err("failed getting mysql pool".to_string()),
    };

    db::get_mysql_table_details(&pool, db_name, table_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_column_details(
    db_name: &str,
    table_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = match get_mysql_pool(pool) {
        Some(pool) => pool,
        None => return Err("failed getting mysql pool".to_string()),
    };

    db::get_mysql_column_details(&pool, db_name, table_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_table_data(
    db_name: &str,
    table_name: &str,
    column_names: Vec<&str>,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = match get_mysql_pool(pool) {
        Some(pool) => pool,
        None => return Err("failed getting mysql pool".to_string()),
    };

    db::get_mysql_table_data(&pool, db_name, table_name, column_names).await
}
