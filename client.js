const backendHost = 'localhost:3000';
const backendURL = `http://${backendHost}`;

async function session_open() {
    let res = await fetch(`${backendURL}/session_open`);
    let sid = await res.text();
    let ws = new WebSocket(`ws://${backendHost}/socket?sid=${sid}&sender=1`);

    // Check if the websocket connection succeeded;
    if (ws.readyState == 3) {
        return null;
    }

    // Change URL to be sharing URL
    history.pushState('', '', `?sid=${sid}`);

    return { sid: sid, ws: ws };
}

function session_close(ws) {
    ws.close();
}

function session_connect(sid) {
    return new WebSocket(`ws://${backendHost}/socket?sid=${sid}&sender=0`);
}

async function gen_key() {
    let key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256, }, true, ['encrypt', 'decrypt']);
    let jwk = await crypto.subtle.exportKey('jwk', key);
    location.hash = btoa(JSON.stringify(jwk));
    return jwk;
}
