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
