const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const config = require('./config');
const mongoose = require('mongoose');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    Browsers,
    delay
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_BASE_PATH = './sessions';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cloud25588_db_user:RQxEbZhj74uGOtb4@cluster0.pptbqdr.mongodb.net/newdtzm01?appName=Cluster0';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('𝐌ᴏɴɢᴏ𝐃𝐁 𝐂ᴏɴɴᴇᴄᴛᴇᴅ ✅ '))
    .catch(err => console.log('❌ 𝐌ᴏɴɢᴏ𝐃𝐁 ᴇʀʀᴏ:', err));

const SessionSchema = new mongoose.Schema({ sessionId: String, data: Object });
const Session = mongoose.model('fgfgfgdfgdfd', SessionSchema);

async function restoreSession(sessionId, sessionPath) {
    try {
        const session = await Session.findOne({ sessionId });
        if (!session) return false;
        await fs.ensureDir(sessionPath);
        for (const file in session.data) {
            await fs.writeFile(path.join(sessionPath, file), session.data[file]);
        }
        return true;
    } catch (err) { return false; }
}

async function saveSession(sessionId, sessionPath) {
    try {
        if (!await fs.pathExists(sessionPath)) return;
        const files = await fs.readdir(sessionPath);
        let data = {};
        for (const file of files) {
            data[file] = await fs.readFile(path.join(sessionPath, file), 'utf-8');
        }
        await Session.findOneAndUpdate({ sessionId }, { data }, { upsert: true });
    } catch (err) {}
}

async function Pair(number, res = null) {
    const xnumber = number.replace(/[^0-9]/g, '');
    const sessionId = `yasas_${xnumber}`;
    const sessionPath = path.join(SESSION_BASE_PATH, sessionId);

    await restoreSession(sessionId, sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Desktop'),
    });

    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
        await delay(1500);
        const code = await sock.requestPairingCode(xnumber);
        if (res) res.json({ code: code });
    } else {
        if (res) res.json({ error: 'Already registered' });
    }

    sock.ev.on('connection.update', async (update) => {
        if (update.connection === 'open') {
            await delay(5000);
            await saveSession(sessionId, sessionPath);
        }
    });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/pair', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.json({ error: 'Number is required' });
    await Pair(number, res);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
