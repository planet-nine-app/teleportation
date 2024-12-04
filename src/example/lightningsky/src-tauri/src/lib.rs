use serde_json::json;
use tauri_plugin_fs::FsExt;
use safe_teleportation_parser::SafeTeleportationTag;
use sessionless::hex::FromHex;
use sessionless::{Sessionless, PrivateKey};
use fount_rs::{Fount, FountUser};
use bdo_rs::{BDO, Spellbook};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn get_teleported_html(url: String) -> Result<SafeTeleportationTag, String> {
    let safe_teleportation_tag = SafeTeleportationTag::new(url).await;
    match safe_teleportation_tag.is_valid_tag() {
        true => Ok(safe_teleportation_tag),
        false => Ok(SafeTeleportationTag::new("https://www.example.com".to_string()).await),
    }
}

async fn get_sessionless() -> Result<Sessionless, String> {
    let sessionless = Sessionless::from_private_key(PrivateKey::from_hex("b75011b167c5e3a6b0de97d8e1950cd9548f83bb67f47112bed6a082db795496").expect("private key"));
    Ok(sessionless)    
} 

#[tauri::command]
async fn create_fount_user() -> Result<FountUser, String> {
    let s = get_sessionless().await;
    match s {
        Ok(sessionless) => {
            let fount = Fount::new(Some("https://livetest.fount.allyabase.com/".to_string()), Some(sessionless));
            let _user = fount.create_user().await;
dbg!(&_user);
            return match _user {
                Ok(user) => Ok(user),
                Err(_) => Err("no user".to_string())
            }
        },
        Err(_) => Err("no user".to_string())
    }
}

#[tauri::command]
async fn get_spellbooks() -> Result<Vec<Spellbook>, String> {
    let s = get_sessionless().await;
    let private_bdo = json!({
       "bar": "bar"
    });
    let hash = "magicsky".to_string();
    match s {
        Ok(sessionless) => {
            let bdo = BDO::new(Some("https://livetest.bdo.allyabase.com/".to_string()), Some(sessionless));
            // Clone the values we need before the await
            let uuid = match bdo.create_user(&hash, &private_bdo).await {
                Ok(user) => user.uuid,
                Err(_) => return Ok(Vec::new())
            };
dbg!("does it get to here?");
            
            // Now use the cloned uuid
            match bdo.get_spellbooks(&uuid, &hash).await {
                Ok(spellbooks) => {
dbg!("spellbooks {}", &spellbooks);                    
                   Ok(spellbooks)
                }
                Err(err) => {
dbg!("err {}", err);
                    Ok(Vec::new())
                }
            }
        },
        Err(_) => Ok(Vec::new())
    }
}

#[tauri::command(rename_all = "snake_case")]
async fn cast_spell(spell: String, total_cost: u32, mp: bool) {
dbg!("{}, {}, {}", spell, total_cost, mp);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_teleported_html, create_fount_user, get_spellbooks, cast_spell])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
