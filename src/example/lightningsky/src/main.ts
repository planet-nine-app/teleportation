import { invoke } from "@tauri-apps/api/core";
import { BskyAgent } from "@atproto/api";
import config from "./config.json";

let logger: HTMLElement | null;



const getFeed = async () => {
logger.textContent = 'getting here at least';
    try {
      const agent = new BskyAgent({
	service: 'https://bsky.social'
      });
      const session = await agent.login({
	identifier: config.email,
	password: config.password
      });
      const feed = await agent.getAuthorFeed({
	actor: agent.did,
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
  console.log(item);
  logger.textContent = logger.textContent + '\n' + item.post.record.text;
      });

  // get facets, check facets for uris, check uris for teleport tags, render teleport tags

  logger.textContent = logger.textContent + '\n' + "nothing went wrong at least " + JSON.stringify(feed.data.feed.length);

  /*    const teleportedHTML = await invoke("get_teleported_html", {
	url: "http://localhost:2970/safe-parser.html"
      });

  logger.textContent = "nothing went wrong at least " + teleportedHTML;

      const foo = document.createElement('div');
      foo.innerHTML = teleportedHTML;
      document.appendChild(foo);*/

    } catch(err) {
logger.textContent = err;
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  logger = document.querySelector("#logger");
  document.querySelector("#get-feed")?.addEventListener("click", (e) => {
    e.preventDefault();
    getFeed();
  });
});

  /* posting    await agent.post({
	text: "Once this works, all bets are off. #planetnineisablueskydevnow",
	createdAt: new Date().toISOString()
      });*/

  /* getTimeline    const feed = await agent.getTimeline({
	limit: 5
      });*/

