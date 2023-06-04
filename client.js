const backendHost = 'localhost:3000';
const backendURL = `http://${backendHost}`;
const chunkSize = 134217728; // 128 MiB

const downloads = new Map();

// Opens a session with the backend server
// Opens a websocket to send file data through
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

// Closes the session
function session_close(ws) {
    ws.close();
}

// Connects to an existing session, to be used by the receiver
async function session_connect(sid) {
    let ws = new WebSocket(`ws://${backendHost}/socket?sid=${sid}&sender=0`);

    // Go back to index if ws closes
    ws.onclose = (_) => {
        location.search = '';
        location.pathname = '/';
        return;
    };

    return ws;
}

// Generate the encryption key for sending files, change URL anchor to allow for sharing
async function gen_key() {
    let key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256, }, true, ['encrypt', 'decrypt']);
    let jwk = await crypto.subtle.exportKey('jwk', key);
    location.hash = btoa(JSON.stringify(jwk));
    return jwk;
}

// A bit of explanation on the packet format
// First comes the IV in plaintext
// Next is the encrypted data, starting with packet type
// Packet type is either '0' or '1', metadata or file data respectively
// Metadata packets contain the file name, size, and UUID
// Data packets contain UUID and the data of a chunk of the file
async function send_file(conn, file) {

    // This UUID is to uniquely identify the file in case there are multiple files being sent
    const fileUUID = crypto.randomUUID();

    let metadata = {
        name: file.name,
        size: file.size,
        fileUUID: fileUUID,
    };

    const key = await crypto.subtle.importKey('jwk', conn.key, 'AES-GCM', true, ['encrypt', 'decrypt']);
    let metadataIV = crypto.getRandomValues(new Uint8Array(12));
    // We don't want to leak the filename here!
    let metadataEncrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: metadataIV },
        key,
        '0' + JSON.stringify(metadata)
    );

    await conn.ws.send(new Blob([metadataIV, metadataEncrypted]));

    for (let i = 0; i < file.size; i += chunkSize) {
        let chunk = file.slice(i, i + chunkSize);
        let iv = crypto.getRandomValues(new Uint8Array(12));
        let encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            new Blob(['1', fileUUID, await chunk.arrayBuffer()])
        );

        // JSON is bloat
        // I want the chunk metadata and chunk data to be sent in a single transaction,
        // but encoding the data to Base64 and sending it as a JSON object would have too much overhead
        // The UUID is a fixed length, and the IV is always 12 bytes
        conn.ws.send(new Blob([iv, encrypted]));
    }
}

async function sender() {
    let conn = await session_open();
    let fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (ev) => {
        const fileList = fileInput.files;
        for (let file of fileList) {
            send_file(conn, file);
        }
    });
}

async function receiver() {
    let params = new URLSearchParams(location.search);
    console.log(location.search);
    let sid = params.get('sid');
    let jwk = JSON.parse(atob(location.hash.substring(1)));
    let key = await crypto.subtle.importKey('jwk', jwk, 'AES-GCM', true, ['encrypt', 'decrypt']);
    let ws = await session_connect(sid);

    ws.onmessage = (ev) => {

    };
}

async function main() {
    console.log('Client starting.');
    if (location.pathname === '/share.html') {
        receiver();
    } else {
        sender();
    }
}

window.onload = main;