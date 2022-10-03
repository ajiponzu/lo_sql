mod db;

pub use db::MySqlPool;
use sqlx::MySql;
use tauri::State;

use self::db::get_mysql_pool;

#[tauri::command(async)]
pub async fn login(
    user_name: &str,
    password: &str,
    port: &str,
    db_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let database_url = format!(
        "mysql://{}:{}@{}:{}/{}",
        user_name, password, "localhost", port, db_name
    );

    let pool_new = db::get_new_pool::<MySql>(&database_url)
        .await
        .ok_or_else(|| "connection failed.....".to_string())?;

    {
        let mut guard = pool
            .0
            .lock()
            .map_err(|e| format!("{e}: connection failed....."))?;
        *guard = Some(pool_new);
    }

    Ok("connect.....".to_string())
}

#[tauri::command(async)]
pub async fn show_mysql_tables(
    db_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = get_mysql_pool(pool).ok_or_else(|| "failed getting mysql pool".to_string())?;

    db::get_mysql_table_names(&pool, db_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_columns(
    db_name: &str,
    table_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = get_mysql_pool(pool).ok_or_else(|| "failed getting mysql pool".to_string())?;

    db::get_mysql_column_names(&pool, db_name, table_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_table_details(
    db_name: &str,
    table_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = get_mysql_pool(pool).ok_or_else(|| "failed getting mysql pool".to_string())?;

    db::get_mysql_table_details(&pool, db_name, table_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_column_details(
    db_name: &str,
    table_name: &str,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = get_mysql_pool(pool).ok_or_else(|| "failed getting mysql pool".to_string())?;

    db::get_mysql_column_details(&pool, db_name, table_name).await
}

#[tauri::command(async)]
pub async fn show_mysql_table_data(
    db_name: &str,
    table_name: &str,
    column_names: Vec<&str>,
    pool: State<'_, MySqlPool>,
) -> Result<String, String> {
    let pool = get_mysql_pool(pool).ok_or_else(|| "failed getting mysql pool".to_string())?;

    db::get_mysql_table_data(&pool, db_name, table_name, column_names).await
}
