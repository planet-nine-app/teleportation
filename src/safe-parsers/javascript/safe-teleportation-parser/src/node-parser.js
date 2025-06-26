import sessionless from 'sessionless-node';
import removeJavaScript from './node-remove-javascript.js';

const safeTeleportationParser = {
  getTeleportalPubKey: (url) => {
console.log('url is ', url);
    const search = url.indexOf('?') !== -1 ? url.split('?')[1] : false;
    if(!search) {
console.log('no search, returning');
      return null;
    }
console.log('search is ', search);

    return new URLSearchParams(search).get('pubKey');
  },

  getTeleportTag: async (url) => {
    const teleporterPubKey = safeTeleportationParser.getTeleportalPubKey(url);
console.log('teleporterPubKey is', teleporterPubKey);
    
    const html = await fetch(url);
    const htmlContent = await html.text();
//console.log('html content is', htmlContent);

    const cleanHTML = removeJavaScript(htmlContent);
//console.log(cleanHTML);
    const teleports = cleanHTML.window.document.getElementsByTagName("teleport");
//console.log(teleports);
//console.log(Array.from(teleports));

    if(!teleports || teleports.length === 0) {
console.log('there are no teleports so we are returning null.');
      return null;
    }

    const teleported = teleports[0];
console.log(teleported);

    const teleportTag = {
      html: teleported.innerHTML,
      signature: teleported.getAttribute('signature'),
      teleporterPubKey,
      message: teleported.getAttribute('message'),
      spell: teleported.getAttribute('spell'),
      amount: teleported.getAttribute('amount')
    };

    return teleportTag;
  },

  isValidTag: (teleportTag) => {
    return sessionless.verifySignature(teleportTag.signature, teleportTag.message, teleportTag.teleporterPubKey);
  }
};

export default safeTeleportationParser;
