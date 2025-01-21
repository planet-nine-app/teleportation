import { parseDocument } from 'htmlparser2';
import render from 'dom-serializer';

let foo = `<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.00, maximum-scale=1.00, minimum-scale=1.00">

  <!--these are the tags that create the web preview card. You can use og:, or twitter: tags or both-->
  <meta name="twitter:title" content="A Brief History of Teleportation">
  <meta name="description" content="Purchase via Magicsky today!">
  <meta name="twitter:description" content="Purchase via Magicsky today!">
  <meta name="twitter:image" content="https://livetest.addie.allyabase.com/bar/ABHoT.png">

  <title>Planet Nine</title>

</head>

<body>
<br>
<br>
<teleport pubkey="021da4f9d1be318303468d162cd5326e8fda987b4f6dd1c9f56ebb87d97c461866" signature="46401c7c10aa06f1ab88978700fec632b62d5091844be45372eb6771dd976cdb7ba2956107a49f045d042f63ac3926407e8505da007f0f136af25fb5c8e9cf90" message="The Ballad of Johnny Cowboy" spell="aBriefHistoryOfTeleportation" amount="2000">
<div style="width:100%;overflow:hidden;">
  <img style="width:100%;height:auto;" src="https://livetest.addie.allyabase.com/bar/ABHoT.png">
</div>
<script type="text/javascript">
	window.addEventListener('DOMContentLoaded', () => {
		console.log('the on load gets called');
	const search = window.location.search.slice(1, window.location.search.length);
	const pubKey = search.split('=').pop();
	if(pubKey === '03b1625f8c93479a70179e443f199e8f4b2afb6edc645f1165681e01850fdb4ccf') {
          window.alert('HERE IS WHERE YOU WOULD DOWNLOAD');
        }
	});
</script>
</teleport>


</body></html>`

const dom = parseDocument(foo);
console.log(dom);

const getTeleportTag = (html) => {
  const dom = parseDocument(foo);

  const retrieveTeleportTag = (node) => {
    if(node.name === 'teleport') {
      return node;
    } else if(node.children) {
      return node.children.reduce((a, c) => retrieveTeleportTag(c) ? retrieveTeleportTag(c) : a, null);
    }
    return null;
  };

console.log('dom', dom);
console.log('dom.name', dom.name);
console.log('dom.childrn', dom.children);
  const teleportTag = retrieveTeleportTag(dom);
console.log(teleportTag);

  const innerHTML = render(teleportTag.children);
console.log(innerHTML);
};

getTeleportTag(foo);
