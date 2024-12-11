import sessionless from 'sessionless-node';
import removeJavaScript from './src/react-native-eemove-javascript.js';

const safeTeleportationParser = {
  getTeleportalPubKey: (url) => {
    const search = url.indexOf('?') !== -1 ? url.split('?')[1] : false;
    if(!search) {
      return null;
    }

    return new URLSearchParams(search).get('pubKey');
  },

  getTeleportTag: async (url) => {
    const teleporterPubKey = safeTeleportationParser(url);
    
    const html = await fetch(url);
    const htmlContent = await html.text();

    const cleanHTML = removeJavaScript(html);
    const teleports = cleanHTML.window.document.getElementsByTagName("teleport");

    if(!teleports || teleports.length === 0) {
      return null;
    }

    const teleported = teleports[0];

    const teleportTag = {
      html: teleported.textContent(),
      signature: teleported.getAttribute('signature'),
      teleporterPubKey,
      message: teleported.getAttribute('message'),
      spell: teleported.getAttribute('spell'),
      amount: teleported.getAttribute('amount')
    };

    return teleportTag;
  },

  isValidTag: (teleportTag) => {
    return sessionless.verify(teleportTag.signature, teleportTag.message, teleportTag.pubKey);
  }
};

export default safeTeleportationParser;
