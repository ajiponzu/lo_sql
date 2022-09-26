use sqlx::{pool, Database, MySql, Pool};
use std::sync::Mutex;
use tauri::State;

pub struct MySqlPool(pub Mutex<Option<Pool<MySql>>>);

pub async fn get_new_pool<DB: Database>(db_url: &str) -> Option<Pool<DB>> {
    let pool_ret = pool::PoolOptions::<DB>::new()
        .max_connections(20)
        .connect(&db_url)
        .await;

    match pool_ret {
        Ok(pool) => Some(pool),
        Err(_e) => None,
    }
}

pub fn get_mysql_pool(pool: State<'_, MySqlPool>) -> Option<Pool<MySql>> {
    let guard = match pool.0.lock() {
        Ok(guard) => guard,
        Err(_e) => {
            return None;
        }
    };

    match guard.as_ref() {
        Some(pool) => Some(pool.clone()),
        None => None,
    }
}

pub fn result_to_jsonstr<T: serde::Serialize>(data: &Vec<T>) -> String {
    let ret = serde_json::to_string(data);
    match ret {
        Ok(json_str) => json_str,
        Err(_e) => "failed converting json format string.....".to_string(),
    }
}

#[derive(sqlx::FromRow, Debug, serde::Serialize)]
struct TableName {
    _name: String,
}

pub async fn get_mysql_table_names(pool: &Pool<MySql>, db_name: &str) -> Option<String> {
    let table_names = sqlx::query_as::<_, TableName>(
        "SELECT table_name as _name FROM information_schema.tables WHERE table_schema = ?",
    )
    .bind::<String>(db_name.to_string())
    .fetch_all(pool)
    .await;

    match table_names {
        Ok(names) => Some(result_to_jsonstr(&names)),
        Err(_e) => None,
    }
}
