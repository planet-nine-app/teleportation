use crate::{SafeTeleportationTag, TeleportTag};
use sessionless::hex::IntoHex;
use std::collections::HashMap;
use serde_json::json;
use serde_json::Value;

#[actix_rt::test]
async fn test_safe_teleportation_parser() {

    let bad_tag = SafeTeleportationTag::new("http://localhost:2970/safe-parser.html".to_string()).await;
    let good_tag = SafeTeleportationTag::new("http://localhost:2970/safe-parser-with-the-goods.html".to_string()).await;

    async fn check_teleportation_html(tag: &SafeTeleportationTag) -> Option<String> {
        let html_as_string = tag.html.clone();

dbg!(&html_as_string);

        assert_eq!(
            html_as_string,
            "\n    <div>foo</div>\n  "
        );

        Some(html_as_string)
    }

    fn check_bad_tag(tag: &SafeTeleportationTag) -> bool {
        let is_valid = tag.is_valid_tag();
        
        assert_eq!(
            is_valid,
            false
        );
 
        is_valid
    }

    fn check_good_tag(tag: &SafeTeleportationTag) -> bool {
        let is_valid = tag.is_valid_tag();
        
        assert_eq!(
            is_valid,
            true
        );
 
        is_valid
    }

    check_teleportation_html(&bad_tag).await;
    check_teleportation_html(&good_tag).await;

    check_bad_tag(&bad_tag);
    check_good_tag(&good_tag);
}

