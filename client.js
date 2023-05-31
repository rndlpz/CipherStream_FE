const backendHost = 'localhost:3000';
const backendURL = `http://${backendHost}`;

async function session_open() {
    let res = await fetch(`${backendURL}/session_open`);
    let sid = await res.text();
    let ws = new WebSocket(`ws://${backendHost}/socket?sid=${sid}&sender=1`);

    // Go back to index if ws closes
    ws.onclose = (_) => {
        location.search = '';
        location.pathname = '/';
        return;
    };

    // Change URL to be sharing URL
    history.pushState('', '', `/share.html?sid=${sid}`);

    // Generate session key
    let key = await gen_key();

    return { sid: sid, ws: ws, key: key };
}

function session_close(ws) {
    ws.close();
}

async function session_connect(sid) {
    let ws = await new WebSocket(`ws://${backendHost}/socket?sid=${sid}&sender=0`);

    // Go back to index if ws closes
    ws.onclose = (_) => {
        location.search = '';
        location.pathname = '/';
        return;
    };

    return;
}

async function gen_key() {
    let key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256, }, true, ['encrypt', 'decrypt']);
    let jwk = await crypto.subtle.exportKey('jwk', key);
    location.hash = btoa(JSON.stringify(jwk));
    return jwk;
}

async function sender() {
    let conn = await session_open();
}

async function receiver() {
    let params = new URLSearchParams(location.search);
    let sid = params.sid;
    let key = location.hash;
    let ws = await session_connect(sid);
}

async function main() {
    if (location.pathname === '/share.html') {
        receiver();
    } else {
        sender();
    }
}

main();