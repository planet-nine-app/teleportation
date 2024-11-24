mod structs;

#[cfg(test)]
mod tests;

use reqwest::{Client, Response};
use serde::{Deserialize, Serialize};
use sessionless::hex::IntoHex;
use sessionless::{Sessionless, Signature};
use std::collections::HashMap;


