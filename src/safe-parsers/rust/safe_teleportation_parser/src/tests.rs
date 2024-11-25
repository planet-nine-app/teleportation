use crate::{SafeTeleportationTag, TeleportTag};
use sessionless::hex::IntoHex;
use std::collections::HashMap;
use serde_json::json;
use serde_json::Value;

#[actix_rt::test]
async fn test_safe_teleportation_parser() {

    let safe_teleportation_tag = SafeTeleportationTag::new("http://localhost:2970/safe-parser.html".to_string()).await;

    async fn get_teleportation_html(tag: &SafeTeleportationTag) -> Option<String> {
        let html_as_string = tag.get_inner_html();

dbg!(&html_as_string);

        assert_eq!(
            html_as_string,
            "\n    <div>foo</div>\n  "
        );

        Some(html_as_string)
    }

    get_teleportation_html(&safe_teleportation_tag).await;
}

