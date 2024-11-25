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

pub struct SafeTeleportationTag {
    pub url: String,
    pub teleport_tag: TeleportTag
}

impl SafeTeleportationTag {
    pub async fn new(url: String) -> Self {
        let html_content = match reqwest::get(&url).await {
	    Ok(r) => r.text().await.unwrap_or_else(|_| "".to_string()),
	    Err(_) => "bop".to_string()
	};

        let teleport_tag = TeleportTag::new(Some(html_content));

        Self {
            url,
            teleport_tag
        }
    }

    pub fn get_inner_html(&self) -> String {
        let selector = Selector::parse("teleport").unwrap();
        if let Some(teleported) = self.teleport_tag.html.select(&selector).next() {
            teleported.inner_html()
        } else {
            "".to_string()
        }
    }
}
