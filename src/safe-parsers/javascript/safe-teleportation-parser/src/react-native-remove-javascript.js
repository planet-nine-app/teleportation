import parser from 'react-native-html-parser';
const DomParser = new parser.DOMParser();

const removeJavaScript = (html) => {
    const dom = new DomParser().parseFromString(html, 'text/html');
    const document = dom.window.document;
    
    const jsEvents = [
        "onabort", "onanimationcancel", "onanimationend", "onanimationiteration",
        "onanimationstart", "onauxclick", "onblur", "oncancel", "oncanplay",
        "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu",
        "oncopy", "oncuechange", "oncut", "ondblclick", "ondrag", "ondragend",
        "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop",
        "ondurationchange", "onemptied", "onended", "onerror", "onfocus",
        "onformdata", "ongotpointercapture", "oninput", "oninvalid", "onkeydown",
        "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata",
        "onloadstart", "onlostpointercapture", "onmousedown", "onmouseenter",
        "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup",
        "onpaste", "onpause", "onplay", "onplaying", "onpointercancel",
        "onpointerdown", "onpointerenter", "onpointerleave", "onpointermove",
        "onpointerout", "onpointerover", "onpointerup", "onprogress",
        "onratechange", "onreset", "onresize", "onscroll", "onsecuritypolicyviolation",
        "onseeked", "onseeking", "onselect", "onselectionchange", "onselectstart",
        "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate",
        "ontoggle", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart",
        "ontransitioncancel", "ontransitionend", "ontransitionrun", "ontransitionstart",
        "onvolumechange", "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration",
        "onwebkitanimationstart", "onwebkittransitionend", "onwheel"
    ];

    document.querySelectorAll('script, noscript').forEach(element => {
        element.remove();
    });

    const urlRegex = /^(?:javascript|data):/i;
    document.querySelectorAll('[href], [src], [data]').forEach(element => {
        ['href', 'src', 'data'].forEach(attr => {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr).trim();
                if (urlRegex.test(value)) {
                    element.remove();
                }
            }
        });
    });

    const expressionRegex = /expression\s*\(/i;
    document.querySelectorAll('[style]').forEach(element => {
        const style = element.getAttribute('style');
        if (style && expressionRegex.test(style)) {
            element.remove();
        }
    });

    document.querySelectorAll('*').forEach(element => {
        jsEvents.forEach(event => {
            if (element.hasAttribute(event)) {
                element.removeAttribute(event);
            }
        });
    });

    return dom;
}

export default removeJavaScript;
