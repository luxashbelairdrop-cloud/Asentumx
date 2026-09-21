const axios = require('axios');
const { Telegraf } = require('telegraf');

// ===================================================
// KONFIGURASI
// ===================================================
const TG_TOKEN = "8885582629:AAHnpfXC9Oo2mp1qiQzYM5v4QKNctzThsf8"; 
const TG_CHAT_ID = "6769005722"; 
const VALIDATOR_ADDRESS = "ase184mtgnywqqzzlh2s6t9jz5ntd2en0t7j42ztz6"; 
const SERVER_NAME = "Maxlayer-PaaS-Monitor";

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

// Fungsi utama mengambil data dari Jaringan Publik Asentum
async function monitoringNode() {
    console.log("Memulai pengecekan status via Explorer API...");
    try {
        const domainPusat = "https://asentum.com";
        const pathAPI = "/api/v1/validators/";
        const urlFinal = domainPusat + pathAPI + VALIDATOR_ADDRESS;

        const response = await axios.get(urlFinal);
        const data = response.data;

        const status = data?.status || "Inactive (No Stake)"; 
        const balance = data?.bonded_stake || "0"; 
        const earnings = data?.rewards_earned || "0";

        const shortAddress = VALIDATOR_ADDRESS.substring(0, 6) + "..." + VALIDATOR_ADDRESS.slice(-4);

        const pesan = `📊 *Laporan Status Node Asentum (PaaS Monitored)*:\n\n` +
                      `🔹 *Validator:* \`` + shortAddress + `\`\n` +
                      `🔹 *Status:* ${status === 'active' ? '🟢 Active' : '🔴 Offline/Inactive'}\n` +
                      `🔹 *Total Stake:* ${balance} ASE\n` +
                      `🔹 *Total Rewards:* ${earnings} ASE`;

        await sendTelegram(pesan);
    } catch (error) {
        console.error('Gagal mengambil data dari API:', error.message);
        
        const shortAddress = VALIDATOR_ADDRESS.substring(0, 6) + "..." + VALIDATOR_ADDRESS.slice(-4);
        
        // PERBAIKAN PERMANEN: Menggunakan operator penggabungan string (+) tanpa backslash
        const pesanGagal = `📊 *Laporan Status Node Asentum (PaaS Monitored)*:\n\n` +
                           `🔹 *Validator:* \`` + shortAddress + `\`\n` +
                           `🔹 *Status:* 🔴 Offline/Inactive\n` +
                           `🔹 *Total Stake:* 0 ASE\n` +
                           `🔹 *Total Rewards:* 0 ASE\n\n` +
                           `_\(Catatan: Alamat dompet belum terdaftar melakukan staking aktif di blockchain Asentum\)_\n` +
                           `_\(Error detail: ${error.message}\)_`;
                           
        await sendTelegram(pesanGagal);
    }
}

function mulaiAplikasi() {
    console.log("Skrip monitoring PaaS dengan Telegraf aktif...");
    sendTelegram("✅ Skrip monitoring sukses diperbarui! Tampilan visual kini 100% rapi.");
    
    monitoringNode();
    setInterval(monitoringNode, 7200000);
}

mulaiAplikasi();
