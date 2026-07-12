const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🔮",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now();
        
       
        const message = await conn.sendMessage(from, { text: '🚀 *𝙥𝙞𝙣𝙜𝙞𝙣𝙜 𝘽𝙡𝙖𝙘𝙠 𝙌𝙪𝙚𝙚𝙣 𝙈𝙙 𝙫1...*' }, { quoted: mek });
        
        const endTime = Date.now();
        const ping = endTime - startTime;
        
        
        const pingText = `╭━━━〔 Ｂʟᴀᴄᴋ Ｑᴜᴇᴇɴ Ｍᴅ Ｖ1 〕━━━┈⊷
┃ 🏓 𝐏 𝐎 𝐍 𝐆 !
╰━━━━━━━━━━━━━━━┈⊷

⭔ 𝙎𝙥𝙚𝙚𝙙 : ${ping}ms
⭔ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙁𝙖𝙨𝙩 & 𝘼𝙘𝙩𝙞𝙫𝙚 🟢

*© Ｂʟᴀᴄᴋ Ｑᴜᴇᴇɴ Ｍᴅ Ｖ1*`;

        
        await conn.sendMessage(from, { text: pingText }, { quoted: message });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
})
cmd({
    pattern: "gay",
    desc: "Check gay percentage.",
    category: "fun",
    react: "🏳️‍🌈",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        
        let targetNumber = senderNumber;
        let targetJid = sender;

        if (m.quoted) {
            targetNumber = m.quoted.sender.split('@')[0];
            targetJid = m.quoted.sender;
        } else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            targetJid = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
            targetNumber = targetJid.split('@')[0];
        }

        let responseText = '';

        
        if (targetNumber === "9476111111") {
            responseText = `*🏳️‍🌈 ɢᴀʏ ᴄʜᴇᴄᴋᴇʀ 🏳️‍🌈*\n\n👤 ᴜsᴇʀ : @${targetNumber}\n📊 ɢᴀʏ ᴘᴇʀᴄᴇɴᴛᴀɢᴇ : *0%*\n\n😎 මේයා නම් සිරාම කොල්ලෙක්! කිසිම අවුලක් නෑ. (100% Straight)`;
        } else {
            
            const percentage = Math.floor(Math.random() * 101);
            let comment = '';
            
            if (percentage === 0) comment = "😎 නියම කොල්ලෙක්! (100% Straight)";
            else if (percentage < 30) comment = "හොඳයි හොඳයි, ලොකු අවුලක් නෑ! 😌";
            else if (percentage < 60) comment = "පොඩි සැකයක් තියෙනවා... හැරෙන පොට නම් හරි නෑ වගේ 🤔";
            else if (percentage < 90) comment = "අම්මෝ... මූගෙන් පරිස්සමින් ඉන්න ඕන! 😬";
            else comment = "අප්පටසිරි! සිරාම ඩයල් එකක්නේ. ළඟින්වත් තියාගන්න එපා... 🏃‍♂️💨";

            responseText = `*🏳️‍🌈 ɢᴀʏ ᴄʜᴇᴄᴋᴇʀ 🏳️‍🌈*\n\n👤 ᴜsᴇʀ : @${targetNumber}\n📊 ɢᴀʏ ᴘᴇʀᴄᴇɴᴛᴀɢᴇ : *${percentage}%*\n\n${comment}`;
        }

        
        await conn.sendMessage(from, { 
            text: responseText, 
            mentions: [targetJid] 
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
})
