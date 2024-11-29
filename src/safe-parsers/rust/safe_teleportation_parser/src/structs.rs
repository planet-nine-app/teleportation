use scraper::{Html, Selector, ElementRef};
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use regex::{Regex};

pub struct TeleportTag {
    pub signature: String,
    pub teleporter_pub_key: String, 
    pub message: String,
    pub html: Html
}

impl TeleportTag {
    pub fn new(resp: Option<String>) -> Self {
        let unwrapped_response = resp.unwrap_or("".to_string());

        let safe_html = remove_javascript(&unwrapped_response);
        let document = Html::parse_document(&safe_html);
        let selector = Selector::parse("teleport").unwrap();

        if let Some(teleport_tag) = document.select(&selector).next() {
	     let attributes: HashMap<String, String> = teleport_tag
		.value()
		.attrs()
		.map(|(k, v)| (k.to_string(), v.to_string()))
		.collect();
	       
             let empty_string = "".to_string();
             let signature = attributes.get("signature").unwrap_or(&empty_string);
             let teleporter_pub_key = attributes.get("pubkey").unwrap_or(&empty_string);
             let message = attributes.get("message").unwrap_or(&empty_string);

             Self {
                 signature: signature.to_string(),
                 teleporter_pub_key: teleporter_pub_key.to_string(),
                 message: message.to_string(),
                 html: document
             }
        } else {
            Self {
                signature: "".to_string(),
                message: "".to_string(),
                teleporter_pub_key: "".to_string(),
                html: document
            }
        }
    }
}

fn remove_javascript(html: &str) -> String {
    let mut document = Html::parse_document(html);
    
    let js_events = [
        "onabort", "onanimationcancel", "onanimationend", "onanimationiteration", 
        "onanimationstart", "onauxclick", "onblur", "oncancel", "oncanplay", 
        "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu", 
        "oncopy", "oncuechange", "oncut", "ondblclick", "ondrag", "ondragend", 
        "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", 
        "ondurationchange", "onemptied", "onended", "onerror", "onfocus", 
        "onformdata", "ongotpointercapture", "oninput", "oninvalid", "onkeydown", 
        "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", 
        "onloadstart", "onlostpointercapture", "onmousedown", "onmouseenter", 
        "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", 
        "onpaste", "onpause", "onplay", "onplaying", "onpointercancel", 
        "onpointerdown", "onpointerenter", "onpointerleave", "onpointermove", 
        "onpointerout", "onpointerover", "onpointerup", "onprogress", 
        "onratechange", "onreset", "onresize", "onscroll", "onsecuritypolicyviolation", 
        "onseeked", "onseeking", "onselect", "onselectionchange", "onselectstart", 
        "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", 
        "ontoggle", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart", 
        "ontransitioncancel", "ontransitionend", "ontransitionrun", "ontransitionstart", 
        "onvolumechange", "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration", 
        "onwebkitanimationstart", "onwebkittransitionend", "onwheel"
    ];

    let mut content = document.root_element().html();

    if let Ok(script_selector) = Selector::parse("script") {
        for element in document.select(&script_selector) {
            content = content.replace(&element.html(), "");
        }
    }

    if let Ok(noscript_selector) = Selector::parse("noscript") {
        for element in document.select(&noscript_selector) {
            content = content.replace(&element.html(), "");
        }
    }

    if let Ok(url_selector) = Selector::parse("[href], [src], [data]") {
        let js_url_regex = Regex::new(r"^(?:javascript|data):").unwrap();
        
        document.select(&url_selector)
            .collect::<Vec<_>>()
            .iter()
            .for_each(|element| {
                let mut element = element.clone();
                for attr in ["href", "src", "data"].iter() {
                    if let Some(value) = element.value().attr(attr) {
                        if js_url_regex.is_match(value.trim()) {
                            content = content.replace(&element.html(), "");
                        }
                    }
                }
            });
    }

    if let Ok(style_selector) = Selector::parse("[style]") {
        let expression_regex = Regex::new(r"expression\s*\(").unwrap();
        
        document.select(&style_selector)
            .collect::<Vec<_>>()
            .iter()
            .for_each(|element| {
                let mut element = element.clone();
                if let Some(style) = element.value().attr("style") {
                    if expression_regex.is_match(style) {
                        content = content.replace(&element.html(), "");
                    }
                }
            });
    }

    content
}

