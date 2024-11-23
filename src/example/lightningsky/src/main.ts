import { invoke } from "@tauri-apps/api/core";
import { BskyAgent } from "@atproto/api";
import config from "./config.json";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

const greet = async () => {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
    try {
    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    const session = await agent.login({
      identifier: config.email,
      password: config.password
    });
    await agent.post({
      text: "Once this works, all bets are off. #planetnineisablueskydevnow",
      createdAt: new Date().toISOString()
    });
greetMsgEl.textContent = "nothing went wrong at least";
    } catch(err) {
greetMsgEl.textContent = err;
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
