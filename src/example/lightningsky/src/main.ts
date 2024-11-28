import { invoke } from "@tauri-apps/api/core";
import { BskyAgent } from "@atproto/api";
import config from "./config.json";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

const greet = async () => {
    greetMsgEl.textContent = 'getting here at least';
  if (greetMsgEl && true) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    try {
    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    const session = await agent.login({
      identifier: config.email,
      password: config.password
    });
/*    await agent.post({
      text: "Once this works, all bets are off. #planetnineisablueskydevnow",
      createdAt: new Date().toISOString()
    });*/
    const feed = await agent.getTimeline({
      limit: 5
    });
    feed.data.feed.forEach(item => {
      let postHTML = `
        <h3>${item.post.author.displayName}</h3>
        <br>
        <p>${item.post.record.text}</p>
      `;
      const postDiv = document.createElement('div');
      postDiv.innerHTML = postHTML;
      document.getElementById('feed').appendChild(postDiv);
    });
greetMsgEl.textContent = "nothing went wrong at least " + JSON.stringify(feed.data.feed.length);

/*    const teleportedHTML = await invoke("get_teleported_html", {
      url: "http://localhost:2970/safe-parser.html"
    });

greetMsgEl.textContent = "nothing went wrong at least " + teleportedHTML;

    const foo = document.createElement('div');
    foo.innerHTML = teleportedHTML;
    document.appendChild(foo);*/

    } catch(err) {
//greetMsgEl.textContent = err;
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#get-feed")?.addEventListener("click", (e) => {
    e.preventDefault();
    greet();
  });
});
