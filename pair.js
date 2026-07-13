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
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_BASE_PATH = './sessions';

// MongoDB සම්බන්ධ කිරීම
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cloud25588_db_user:RQxEbZhj74uGOtb4@cluster0.pptbqdr.mongodb.net/newdtzm01?appName=Cluster0';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ 𝐌ᴏɴɢᴏ𝐃𝐁 𝐂ᴏɴɴᴇᴄᴛᴇᴅ'))
    .catch(err => console.log('❌ 𝐌ᴏɴɢᴏ𝐃𝐁 ᴇʀʀᴏ:', err));

const delay = ms => new Promise(res => setTimeout(res, ms));

// Pair Function එක
async function Pair(number, res) {
    const xnumber = number.replace(/[^0-9]/g, '');
    const sessionId = `yasas_${xnumber}`;
    const sessionPath = path.join(SESSION_BASE_PATH, sessionId);

    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Desktop')
    });

    try {
        if (!sock.authState.creds.registered) {
            await delay(1500);
            const code = await sock.requestPairingCode(xnumber);
            
            if (res && !res.headersSent) {
                return res.send(`
                    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                        <h2>Your WhatsApp Pairing Code:</h2>
                        <h1 style="color: #25D366; font-size: 50px;">${code}</h1>
                        <p>Copy this code and paste it in WhatsApp Linked Devices.</p>
                    </div>
                `);
            }
        } else {
            if (res && !res.headersSent) res.send("Session already exists for this number.");
        }
    } catch (err) {
        console.error("Pairing Error: ", err);
        if (res && !res.headersSent) res.send("Error creating pairing code. Please try again.");
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log(`✅ Session ${sessionId} connected successfully!`);
        } else if (connection === 'close') {
            console.log(`❌ Connection closed for ${sessionId}`);
        }
    });
}

// Routes
app.get('/pair', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.send('Please provide a number: /pair?number=947xxxxxxxx');
    await Pair(number, res);
});

app.get('/', (req, res) => {
    res.send('Bot Server is Running! Use /pair?number=YOUR_NUMBER to pair.');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
