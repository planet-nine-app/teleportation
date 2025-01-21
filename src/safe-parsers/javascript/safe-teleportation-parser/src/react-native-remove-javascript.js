import { parseDocument } from 'htmlparser2';
import render from 'dom-serializer';

const getTeleportTag = (html) => {
  try {
    // Find the teleport tag and its attributes
    const teleportRegex = /<teleport([^>]*)>([\s\S]*?)<\/teleport>/i;
    const match = html.match(teleportRegex);
    
    if (!match) {
      console.log('No teleport tag found');
      return null;
    }

    // Parse attributes
    const attributesString = match[1];
    const attributes = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2];
    }

    // Get content and remove scripts
    let content = match[2];
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    content = content.trim();
    
    return {
      attributes,
      content
    };

  } catch (err) {
    console.error('Error processing HTML:', err);
    return null;
  }
};

const removeJavaScript = (html) => {
  return getTeleportTag(html);
};

export default removeJavaScript;
