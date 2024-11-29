use safe_teleportation_parser::{SafeTeleportationTag};

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
        false => Ok(SafeTeleportationTag::new("https://www.example.com".to_string()).await)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_teleported_html])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
