import { invoke } from "@tauri-apps/api/core";
import { BskyAgent } from "@atproto/api";
import config from "./config.json";

const LINK_TYPE = "app.bsky.richtext.facet#link";
let logger: HTMLElement | null;
let teleportationSVG;

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
    feed.data.feed.forEach(async item => {
      let teleportedURI;

      let postHTML = `
	<h3>${item.post.author.displayName}</h3>
	<br>
	<p>${item.post.record.text}</p>
      `;

      item.post.record.facets.forEach(facet => {
//logger.textContent += '\n' + JSON.stringify(facet) + '\n';
        facet.features && facet.features.forEach(feature => {
	  if(feature.$type === LINK_TYPE) {
logger.textContent += '<br>Should set a uri<br>';
	    teleportedURI = feature.uri;
	  }
        });
      });

      const postDiv = document.createElement('div');

      if(teleportedURI) {
	const teleportTag = await invoke("get_teleported_html", {
	  url: teleportedURI
	});    
console.log('teleportTag', teleportTag);
	if(teleportTag.html.length > 5) {
	  postHTML += teleportTag.html;
          postDiv.setAttribute("style", "position: relative;");
          postDiv.innerHTML = postHTML;
          postDiv.appendChild(teleportationSVG);
	} else {
          postDiv.innerHTML = postHTML;
        }
      } 

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
};

window.addEventListener("DOMContentLoaded", async () => {
  logger = document.querySelector("#logger");
  document.querySelector("#get-feed")?.addEventListener("click", (e) => {
    e.preventDefault();
    getFeed();
  });

  const fountUser = await invoke("create_fount_user");
console.log(fountUser);

  teleportationSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  teleportationSVG.setAttribute("style", "position: absolute;top:0;left:0;width:100%;height:100%;");
  teleportationSVG.setAttribute("x", "0");
  teleportationSVG.setAttribute("y", "0");
  teleportationSVG.setAttribute("width", "100%");
  teleportationSVG.setAttribute("height", "100%");
  teleportationSVG.setAttribute("viewBox", "0 0 400 300");

  teleportationSVG.innerHTML = `<!-- Definitions for filters and animations -->
    <defs>
      <!-- Glow filter -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
	<feGaussianBlur stdDeviation="4" result="blur"/>
	<feFlood flood-color="#00ffff" flood-opacity="0.5"/>
	<feComposite in2="blur" operator="in"/>
	<feMerge>
	  <feMergeNode/>
	  <feMergeNode in="SourceGraphic"/>
	</feMerge>
      </filter>

      <!-- Ripple effect -->
      <filter id="ripple" x="-20%" y="-20%" width="140%" height="140%">
	<feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" seed="1" result="turbulence">
	  <animate attributeName="baseFrequency"
	    values="0.02;0.015;0.02"
	    dur="10s"
	    repeatCount="indefinite"/>
	</feTurbulence>
	<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10"/>
      </filter>

      <!-- Gradient for the border -->
      <linearGradient id="borderGradient" gradientUnits="userSpaceOnUse">
	<stop offset="0%" stop-color="#00ffff">
	  <animate attributeName="stop-color"
	    values="#00ffff;#0088ff;#00ffff"
	    dur="2s"
	    repeatCount="indefinite"/>
	</stop>
	<stop offset="100%" stop-color="#0088ff">
	  <animate attributeName="stop-color"
	    values="#0088ff;#00ffff;#0088ff"
	    dur="2s"
	    repeatCount="indefinite"/>
	</stop>
	<animateTransform attributeName="gradientTransform"
	  type="rotate"
	  from="0 200 150"
	  to="360 200 150"
	  dur="10s"
	  repeatCount="indefinite"/>
      </linearGradient>
    </defs>

    <!-- Teleportation border -->
    <path d="M20,20 h360 v260 h-360 Z" 
      fill="none" 
      stroke="url(#borderGradient)" 
      stroke-width="4"
      filter="url(#glow) url(#ripple)"
    >
      <!-- Dash array animation -->
      <animate attributeName="stroke-dasharray"
	values="0,1500;1500,1500"
	dur="15s"
	repeatCount="indefinite"/>
      <!-- Dash offset animation -->
      <animate attributeName="stroke-dashoffset"
	from="1500"
	to="0"
	dur="15s"
	repeatCount="indefinite"/>
    </path>

    <!-- Particle effects -->
    <g>
      <circle r="2" fill="#00ffff" filter="url(#glow)">
	<animateMotion 
	  path="M20,20 h360 v260 h-360 Z"
	  dur="5s"
	  repeatCount="indefinite"/>
      </circle>
      <circle r="2" fill="#0088ff" filter="url(#glow)">
	<animateMotion 
	  path="M20,20 h360 v260 h-360 Z"
	  dur="5s"
	  begin="2.5s"
	  repeatCount="indefinite"/>
      </circle>
    </g>
  </svg>`;

});

  /* posting    await agent.post({
	text: "Once this works, all bets are off. #planetnineisablueskydevnow",
	createdAt: new Date().toISOString()
      });*/

  /* getTimeline    const feed = await agent.getTimeline({
	limit: 5
      });*/

