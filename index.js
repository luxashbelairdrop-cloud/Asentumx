const axios = require('axios');

// ===================================================
// KONFIGURASI (Sudah terisi otomatis dengan data Anda)
// ===================================================
const TG_TOKEN = "8885582629:AAHnpfXC9Oo2mp1qiQzYM5v4QKNctzThsf8"; 
const TG_CHAT_ID = "6769005722"; 
const VALIDATOR_ADDRESS = "ase184mtgnywqqzzlh2s6t9jz5ntd2en0t7j42ztz6"; 
const SERVER_NAME = "Maxlayer-PaaS-Monitor";

// Fungsi mengirim pesan ke Telegram
async function sendTelegram(pesan) {
    const url = `https://telegram.org{TG_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: TG_CHAT_ID,
            text: `[${SERVER_NAME}] 🤖\n${pesan}`,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error('Gagal mengirim ke Telegram:', error.message);
    }
}

// Fungsi utama mengambil data dari Jaringan Publik Asentum
async function monitoringNode() {
    console.log("Memulai pengecekan status via Explorer API...");
    try {
        // Mengambil data publik validator langsung dari API Explorer resmi Asentum
        const response = await axios.get(`https://asentum.com{VALIDATOR_ADDRESS}`);
        const data = response.data;

        // Menyesuaikan struktur data berdasarkan respons API Asentum
        const status = data.status || "Unknown"; 
        const balance = data.bonded_stake || "0"; 
        const earnings = data.rewards_earned || "0";

        // Menampilkan alamat singkat (Contoh: ase184...ztz6)
        const shortAddress = `${VALIDATOR_ADDRESS.substring(0, 6)}...${VALIDATOR_ADDRESS.slice(-4)}`;

        const pesan = `📊 *Laporan Status Node Asentum (PaaS Monitored)*:\n\n` +
                      `🔹 *Validator:* \`\${shortAddress}\`\n` +
                      `🔹 *Status:* ${status === 'active' ? '🟢 Active' : '🔴 Offline/Inactive'}\n` +
                      `🔹 *Total Stake:* ${balance} ASE\n` +
                      `🔹 *Total Rewards:* ${earnings} ASE`;

        await sendTelegram(pesan);
    } catch (error) {
        console.error('Gagal mengambil data dari API:', error.message);
        await sendTelegram(`⚠️ *Koneksi Gagal:* Tidak dapat mengambil data dari Explorer Asentum. Pastikan alamat validator benar.`);
    }
}

// Memulai siklus di PaaS
function mulaiAplikasi() {
    console.log("Skrip monitoring PaaS aktif...");
    sendTelegram("✅ Skrip monitoring berbasis API sukses dideploy di Maxlayer PaaS! Laporan aktif setiap 2 jam.");
    
    // Jalankan monitoring pertama saat deploy selesai
    monitoringNode();
    
    // Interval 2 jam (7200000 ms)
    setInterval(monitoringNode, 7200000);
}

mulaiAplikasi();

