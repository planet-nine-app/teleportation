mod structs;

#[cfg(test)]
mod tests;

use reqwest::{Client, Response};
use scraper::{Html, Selector, ElementRef};
use serde::{Deserialize, Serialize};
use sessionless::hex::IntoHex;
use sessionless::{Sessionless, Signature};
use std::collections::HashMap;
use crate::structs::{TeleportTag};

#[derive(Serialize, Deserialize)]
pub struct SafeTeleportationTag {
    pub url: String,
    pub signature: String,
    pub teleporter_pub_key: String,
    pub message: String,
    pub html: String,
    pub teleportal_pub_key: String
}

fn get_teleportal_pub_key(url: &String) -> Option<String> {
  let teleportal_pub_key = url.split('?')
          .nth(1)?
          .split('&')
          .find(|pair| pair.starts_with("pubKey="))
          .map(|pair| pair.split('=').nth(1).unwrap_or("").to_string());

  teleportal_pub_key
}

impl SafeTeleportationTag {
    pub async fn new(url: String) -> Self {
        let teleportal_pub_key = get_teleportal_pub_key(&url).unwrap_or("".to_string());

        let html_content = match reqwest::get(&url).await {
	    Ok(r) => r.text().await.unwrap_or_else(|_| "".to_string()),
	    Err(_) => "bop".to_string()
	};

        let teleport_tag = TeleportTag::new(Some(html_content));

        Self {
            url,
            html: get_inner_html(&teleport_tag),
            signature: teleport_tag.signature,
            teleporter_pub_key: teleport_tag.teleporter_pub_key,
            message: teleport_tag.message,
            teleportal_pub_key
        }
    }
}

pub fn get_inner_html(teleport_tag: &TeleportTag) -> String {
    let selector = Selector::parse("teleport").unwrap();
dbg!(&teleport_tag.html);
    if let Some(teleported) = teleport_tag.html.select(&selector).next() {
	teleported.inner_html()
    } else {
	"foo".to_string()
    }
}
