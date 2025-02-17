import { invoke } from "@tauri-apps/api/core";
import { BskyAgent } from "@atproto/api";
import config from "./config.json";
import { create, mkdir, readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
//import * as fs from "@tauri-apps/plugin-fs";

const LINK_TYPE = "app.bsky.richtext.facet#link";
let logger: HTMLElement | null;
let teleportationSVG;
let fountUser;
let spellbooks = [{"spellbookName":"livetest","aBriefHistoryOfTeleportation":{"cost":2000,"destinations":[{"stopName":"product page","stopURL":"https://livetest.julia.allyabase.com/magic/spell/aBriefHistoryOfTeleportation"},{"stopName":"fount","stopURL":"https://livetest.fount.allyabase.com/resolve/aBriefHistoryOfTeleportation"}]}}];

  try {
  const fountUserString = await readTextFile('fount/user.json', {
    baseDir: BaseDirectory.AppLocalData,
  });
console.log('contents', fountUserString);
  fountUser = JSON.parse(fountUserString);
  } catch(err) {
console.log('problem', err);
    try {
      fountUser = await invoke("create_fount_user");
      await mkdir('', {baseDir: BaseDirectory.AppLocalData});
      await mkdir('fount', {baseDir: BaseDirectory.AppLocalData});
  //    await create('fount/user', { baseDir: BaseDirectory.AppLocalData })
      await writeTextFile('fount/user.json', JSON.stringify(fountUser), {
	baseDir: BaseDirectory.AppLocalData,
      });
    } catch(err) {
  console.warn(err);
    }
  }

console.log('HERE /iS WINDOW LOCATION', window.location.origin);
console.log(window.location.search);
let query = {};
if(window.location.search) {
  const sliceQ = window.location.search.slice(1, window.location.search.length);
  const searches = sliceQ.split("&");
  const paramTuples = searches.map(search => search.split("="));
  paramTuples.forEach(tuple => query[tuple[0]] = tuple[1]);

  console.log('query', query);

  window.purchases = window.purchases || {foo: {}};
  query.teleportTag = JSON.stringify({
    amount: query.amount,
    spell: query.spell,
    mp: query.mp !== 'false'
  });
  query.foo = 'bar';
console.log('condition', query.teleportTag && !window.purchases.foo[query.foo]);
  if(query.teleportTag && !window.purchases.foo[query.foo]) {
  console.log('in the if');
    window.purchases.foo[query.foo] = true;
    window.teleportTag = JSON.parse(query.teleportTag);
    if(!window.teleportTag) {
      console.log('no tag saved');
    } else {
  console.log('about to cast spell');
      const teleportTag = window.teleportTag;
      try {
	const spell = {spell: teleportTag.spell, total_cost: +teleportTag.amount, mp: !!teleportTag.mp, fount_user: fountUser, destination: spellbooks[0][teleportTag.spell].destinations[0].stopURL, gateway_users: [query.referrer]};
	console.log(spell);
        const success = await invoke('cast_spell', spell);
        console.log('spell success', success);
  //      const success = await invoke('cast_spell', {spell: teleportTag.spell, total_cost: +teleportTag.amount, mp: !!teleportTag.mp, fount_user: fountUser, destination: spellbooks[0][teleportTag.spell].destinations[0].stopURL});
    //    console.log(success);
      } catch(err) {
  console.warn(err);
      }
    }
  } 
}

const getFeed = async () => {
console.log('getFeed called');
logger.textContent = 'getting here at least';
  try {
    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    const session = await agent.login({
      identifier: config.email,
      password: config.password
    });
    const notifications = await agent.listNotifications({limit: 10})
console.log('notifications', notifications);
console.log('data.notifications', notifications.data.notifications);
    const postURIs = notifications.data.notifications.filter(notification => notification.uri.indexOf('post') !== -1).map($ => $.uri);
    const osfPosts = await agent.getPosts({uris: postURIs});
console.log('osfPosts', osfPosts);
    const feed = await agent.getAuthorFeed({
      actor: agent.did,
      limit: 5
    });
    feed.data.feed = [...new Set([...feed.data.feed, ...osfPosts.data.posts])];
    feed.data.feed.forEach(async item => {
      let teleportedURI;
      if(!item.post) {
        item = {post: item};
      }
console.log(item);
console.log(item.post);
console.log(JSON.stringify(item));

      let postHTML = `
	<h3>${item.post.author.displayName}</h3>
	<br>
	<p>${item.post.record.text}</p>
      `;

      if(item && item.post && item.post.record && item.post.record.facets) {
console.log(item.post.record.facets);
	item.post.record.facets.forEach(facet => {
  //logger.textContent += '\n' + JSON.stringify(facet) + '\n';
	  facet.features && facet.features.forEach(feature => {
	    if(feature.$type === LINK_TYPE) {
  logger.textContent += '<br>Should set a uri<br>';
	      teleportedURI = feature.uri;
	    }
	  });
	});
      }

      const postDiv = document.createElement('div');

      if(teleportedURI) {
	const teleportTag = await invoke("get_teleported_html", {
	  url: teleportedURI
	});    
console.log('teleportTag', teleportTag);
	if(teleportTag.html.length > 5) {
          const split = teleportedURI.split('?');
          const referrer = split.length > 1 ? split[1].split('=')[1] : '';
	  postHTML += teleportTag.html;
          postDiv.setAttribute("style", "position: relative; cursor: pointer;");
          postDiv.innerHTML = postHTML;
          const svgClone = teleportationSVG.cloneNode(true);
          postDiv.appendChild(svgClone);
          const scrollAlert = document.getElementById("scroll-alert-message");
          scrollAlert.innerHTML = `Forsooth and forswain, for ${item.post.author.displayName} has connected a teleportal for to cast ${teleportTag.spell} for ${(teleportTag.amount / 100).toFixed(2)} ${teleportTag.mp ? 'MP' : 'dollars'}.`; 
          const feed = document.getElementById("feed");
          const scrollOverlay = document.getElementById("scrollOverlay");
          const clone = scrollOverlay.cloneNode(true);
          try {
            feed.removeChild(scrollOverlay);
          } catch(err) {

          }
          postDiv.appendChild(clone);
	  svgClone.addEventListener('click', async () => {
console.log('clicked!');
            window.showSpellAlert();
	    //await invoke('cast_spell', {spell: teleportTag.spell, total_cost: +teleportTag.amount, mp: !!teleportTag.mp});
	  });
          window.accept = async () => {
/*            window.getPaymentIntentWithoutSplits(+teleportTag.amount, 'USD')
              .then(() => console.log('should have intent'))
              .catch(console.warn);*/
            console.log('Elven magic cast!');
//            await invoke('cast_spell', {spell: teleportTag.spell, total_cost: +teleportTag.amount, mp: true /*!!teleportTag.mp*/, fount_user: fountUser, destination: spellbooks[0][teleportTag.spell].destinations[0].stopURL});
            window.updateConfirmPayment(teleportTag, referrer);
            document.getElementById("payment-form").setAttribute("style", "display: visible;");
            window.teleportTag = teleportTag;
            window.confirmPayment();
            hideSpellAlert();
          };
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

console.log('about to add event listener');

const init = async () => {
  console.log('DOMContent has been loaded');

  window.showSpellAlert = () => {
    const overlay = document.getElementById('scrollOverlay');
    console.log('Before:', overlay.style.display);
    overlay.style.display = 'flex';
    console.log('After:', overlay.style.display);
  };

  window.hideSpellAlert = () => {
    document.getElementById('scrollOverlay').style.display = 'none';
  };

  document.getElementById('scrollOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
	hideSpellAlert();
    }
  });

  logger = document.querySelector("#logger");
  document.querySelector("#get-feed")?.addEventListener("click", (e) => {
console.log('clicked get feed');
    e.preventDefault();
    getFeed();
  });

  //spellbooks = await invoke("get_spellbooks");
console.log(fountUser);
console.log('spellbooks', spellbooks);

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

};

if(document.readyState !== 'loading') {
  await init();
} else {
  window.addEventListener("DOMContentLoaded", init);
}

console.log('after event listener');

  /* posting    await agent.post({
	text: "Once this works, all bets are off. #planetnineisablueskydevnow",
	createdAt: new Date().toISOString()
      });*/

  /* getTimeline    const feed = await agent.getTimeline({
	limit: 5
      });*/


