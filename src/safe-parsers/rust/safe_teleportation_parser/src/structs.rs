use scraper::{Html, Selector, ElementRef};
use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TeleportTag {
    pub signature: String,
    pub teleporter_pub_key: String, 
    pub teleportal_pub_key: String,
    pub html: HTML
}

impl TeleportTag {
    pub fn new(resp: &str) -> Self {
        let safe_html = remove_javascript(&resp);
        let document = Html::parse_document(&safe_html);
        let selector = Selector::parse("teleport").unwrap();
        let teleport_tags = document.select(&selector);

        if teleport_tags.len() > 0 {
            let teleport_tag = teleport_tags[0];

	     let attributes = teleport_tag
		.value()
		.attrs()
		.map(|(k, v)| (k.to_string(), v.to_string()))
		.collect();
	       
             let signature = attributes["signature"];
             let teleporter_pub_key = attributes["teleporterPubKey"];
             let teleportal_pub_key = attributes["teleportalPubKey"];

             Self {
                 signature,
                 teleporter_pub_key,
                 teleportal_pub_key,
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

    if let Ok(script_selector) = Selector::parse("script") {
        document.select(&script_selector)
            .collect::<Vec<_>>()
            .iter()
            .for_each(|element| element.remove());
    }

    if let Ok(noscript_selector) = Selector::parse("noscript") {
        document.select(&noscript_selector)
            .collect::<Vec<_>>()
            .iter()
            .for_each(|element| element.remove());
    }

    for event in js_events.iter() {
        if let Ok(selector) = Selector::parse(&format!("[{}]", event)) {
            document.select(&selector)
                .collect::<Vec<_>>()
                .iter()
                .for_each(|element| {
                    let mut element = element.clone();
                    element.remove_attribute(event);
                });
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
                            element.remove_attribute(attr);
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
                        element.remove_attribute("style");
                    }
                }
            });
    }

    document.html()
}

