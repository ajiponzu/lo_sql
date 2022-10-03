use sqlx::{error::DatabaseError, pool, Database, MySql, Pool};
use std::sync::Mutex;
use tauri::State;

pub struct MySqlPool(pub Mutex<Option<Pool<MySql>>>);

pub async fn get_new_pool<DB: Database>(db_url: &str) -> Option<Pool<DB>> {
    pool::PoolOptions::<DB>::new()
        .max_connections(20)
        .connect(db_url)
        .await
        .ok()
}

pub fn get_mysql_pool(pool: State<'_, MySqlPool>) -> Option<Pool<MySql>> {
    pool.0.lock().ok()?.as_ref().cloned()
}

fn result_to_jsonstr<T: serde::Serialize>(data: &Vec<T>) -> String {
    serde_json::to_string(data)
        .unwrap_or_else(|_| "failed converting json format string.....".to_string())
}

fn get_db_error_message(db_error: Option<&dyn DatabaseError>) -> String {
    db_error
        .map(|msg| msg.message().to_string())
        .unwrap_or_else(|| "error_message: empty".to_string())
}

#[derive(sqlx::FromRow, Debug, serde::Serialize)]
struct TableName {
    _name: Option<String>,
}

pub async fn get_mysql_table_names(pool: &Pool<MySql>, db_name: &str) -> Result<String, String> {
    let table_names = sqlx::query_as::<_, TableName>(
        "SELECT table_name as _name FROM information_schema.tables WHERE table_schema = ?",
    )
    .bind::<String>(db_name.to_string())
    .fetch_all(pool)
    .await;

    table_names
        .map(|names| result_to_jsonstr(&names))
        .map_err(|e| get_db_error_message(e.as_database_error()))
}

#[derive(sqlx::FromRow, Debug, serde::Serialize)]
struct ColumnName {
    _name: Option<String>,
}

pub async fn get_mysql_column_names(
    pool: &Pool<MySql>,
    db_name: &str,
    table_name: &str,
) -> Result<String, String> {
    let column_names = sqlx::query_as::<_, ColumnName>(
        "SELECT column_name as _name FROM information_schema.columns WHERE table_schema = ? and table_name = ?",
    )
    .bind::<String>(db_name.to_string())
    .bind::<String>(table_name.to_string())
    .fetch_all(pool)
    .await;

    column_names
        .map(|names| result_to_jsonstr(&names))
        .map_err(|e| get_db_error_message(e.as_database_error()))
}

#[derive(sqlx::FromRow, Debug, serde::Serialize)]
struct TableDetail {
    _engine: Option<String>,
    _rows: Option<u64>,
    _size: Option<u64>,
    _created_time: chrono::DateTime<chrono::Local>,
    _updated_time: Option<chrono::NaiveDateTime>,
}

pub async fn get_mysql_table_details(
    pool: &Pool<MySql>,
    db_name: &str,
    table_name: &str,
) -> Result<String, String> {
    let table_details = sqlx::query_as::<_, TableDetail>(
        "SELECT engine as _engine, table_rows as _rows, data_length as _size, create_time as _created_time, update_time as _updated_time FROM information_schema.tables WHERE table_schema = ? and table_name = ?",
    )
    .bind::<String>(db_name.to_string())
    .bind::<String>(table_name.to_string())
    .fetch_all(pool)
    .await;

    table_details
        .map(|details| result_to_jsonstr(&details))
        .map_err(|e| get_db_error_message(e.as_database_error()))
}

#[derive(sqlx::FromRow, Debug, serde::Serialize)]
struct ColumnDetail {
    _name: Option<String>,
    _nullable: String,
    _char_max_len: Option<i64>,
    _num_precision: Option<u64>,
    _type: String,
    _key_prop: String, // essentially, this is enum.. but, string is only allowable.
    _extra: Option<String>,
}

pub async fn get_mysql_column_details(
    pool: &Pool<MySql>,
    db_name: &str,
    table_name: &str,
) -> Result<String, String> {
    let column_details = sqlx::query_as::<_, ColumnDetail>(
        "SELECT column_name as _name, is_nullable as _nullable, character_maximum_length as _char_max_len, numeric_precision as _num_precision, column_type as _type, column_key as _key_prop, extra as _extra FROM information_schema.columns WHERE table_schema = ? and table_name = ?",
    )
    .bind::<String>(db_name.to_string())
    .bind::<String>(table_name.to_string())
    .fetch_all(pool)
    .await;

    column_details
        .map(|details| result_to_jsonstr(&details))
        .map_err(|e| get_db_error_message(e.as_database_error()))
}

#[derive(sqlx::FromRow, Debug, serde::Serialize)]
struct TableData {
    _data: Option<String>,
}

pub async fn get_mysql_table_data(
    pool: &Pool<MySql>,
    db_name: &str,
    table_name: &str,
    column_names: Vec<&str>,
) -> Result<String, String> {
    let mut concat_arg = String::new();
    for column_name in column_names {
        let mut add_name = format!(
            "'\"{0}\": ', '\"', IFNULL(CAST(`{0}` AS CHAR(1000) CHARACTER SET utf8), 'undefined data'), '\"'",
            column_name
        );
        add_name = if concat_arg.is_empty() {
            add_name
        } else {
            format!(", ',', {}", &add_name)
        };
        concat_arg += &add_name;
    }
    let sql = format!(
        "SELECT CONCAT('{}', {}, \'{}\') as _data from {}.{}",
        "{\"_json\": {", concat_arg, "}}", db_name, table_name
    );
    let table_data_list = sqlx::query_as::<_, TableData>(&sql).fetch_all(pool).await;

    println!("{:?}", &table_data_list);

    table_data_list
        .map(|data_list| result_to_jsonstr(&data_list))
        .map_err(|e| get_db_error_message(e.as_database_error()))
}
