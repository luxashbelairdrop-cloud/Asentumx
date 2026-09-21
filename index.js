const axios = require('axios');
const { Telegraf } = require('telegraf');

// ===================================================
// KONFIGURASI
// ===================================================
const TG_TOKEN = "8885582629:AAHnpfXC9Oo2mp1qiQzYM5v4QKNctzThsf8"; 
const TG_CHAT_ID = "6769005722"; 
const VALIDATOR_ADDRESS = "ase184mtgnywqqzzlh2s6t9jz5ntd2en0t7j42ztz6"; 
const SERVER_NAME = "Maxlayer-PaaS-Monitor";

// Inisialisasi Bot Telegram menggunakan Telegraf (Menggunakan library khusus)
const bot = new Telegraf(TG_TOKEN);

async function sendTelegram(pesan) {
    try {
        await bot.telegram.sendMessage(TG_CHAT_ID, `[${SERVER_NAME}] 🤖\n${pesan}`, {
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error('Gagal mengirim ke Telegram via Telegraf:', error.message);
    }
}

// Fungsi mengambil data dari Jaringan Publik Asentum
async function monitoringNode() {
    console.log("Memulai pengecekan status via Explorer API...");
    try {
        // Kita gunakan IP langsung (jika domain ://asentum.com juga terkena error DNS di Maxlayer)
        // Catatan: Jika API Asentum juga memblokir IP, kita tetap gunakan domain resminya
        const response = await axios.get(`https://://asentum.com/api/v1/validators/${VALIDATOR_ADDRESS}`);
        const data = response.data;

        const status = data.status || "Unknown"; 
        const balance = data.bonded_stake || "0"; 
        const earnings = data.rewards_earned || "0";

        const shortAddress = `${VALIDATOR_ADDRESS.substring(0, 6)}...${VALIDATOR_ADDRESS.slice(-4)}`;

        const pesan = `📊 *Laporan Status Node Asentum (PaaS Monitored)*:\n\n` +
                      `🔹 *Validator:* \`\${shortAddress}\`\n` +
                      `🔹 *Status:* ${status === 'active' ? '🟢 Active' : '🔴 Offline/Inactive'}\n` +
                      `🔹 *Total Stake:* ${balance} ASE\n` +
                      `🔹 *Total Rewards:* ${earnings} ASE`;

        await sendTelegram(pesan);
    } catch (error) {
        console.error('Gagal mengambil data dari API:', error.message);
        // Jika API Explorer Asentum ikut error ENOTFOUND, pesan ini akan dicetak di log Maxlayer
    }
}

function mulaiAplikasi() {
    console.log("Skrip monitoring PaaS dengan Telegraf aktif...");
    sendTelegram("✅ Skrip monitoring berbasis Telegraf sukses dideploy di Maxlayer PaaS! Laporan aktif setiap 2 jam.");
    
    monitoringNode();
    setInterval(monitoringNode, 7200000);
}

mulaiAplikasi();
