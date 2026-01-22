// ==========================================
// 1. DATA & KONFIGURASI
// ==========================================
const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Dunia ini ladang, akhirat tempat memanen.", source: "Amala" }
];

const keutamaan = {
    "Shalat Shubuh Berjamaah": "Mendapat jaminan perlindungan Allah sepanjang hari.",
    "Shalat Tahajud/Witir": "Waktu paling mustajab dan kemuliaan bagi seorang mukmin.",
    "Sedekah Subuh": "Dua malaikat mendoakan ganti yang berlipat bagi yang berinfak.",
    "Membaca Al-Qur'an (Min. 1 Halaman)": "Setiap satu hurufnya bernilai sepuluh kebaikan.",
    "Membaca Al-Mulk (Sebelum Tidur)": "Penyelamat dan penghalang dari siksa kubur.",
    "default": "Amalan istiqomah sangat dicintai Allah."
};

const defaultTasks = [
    { id: 1, text: "Shalat Shubuh Berjamaah", done: false },
    { id: 2, text: "Shalat Dzuhur Berjamaah", done: false },
    { id: 3, text: "Shalat Ashar Berjamaah", done: false },
    { id: 4, text: "Shalat Maghrib Berjamaah", done: false },
    { id: 5, text: "Shalat Isya Berjamaah", done: false },
    { id: 6, text: "Shalat Rawatib (Qabliyah/Ba'diyah)", done: false },
    { id: 7, text: "Shalat Tahajud/Witir", done: false },
    { id: 8, text: "Shalat Dhuha", done: false },
    { id: 9, text: "Sedekah Subuh", done: false },
    { id: 10, text: "Membaca Al-Qur'an (Min. 1 Halaman)", done: false },
    { id: 11, text: "Dzikir Pagi", done: false },
    { id: 12, text: "Dzikir Petang", done: false },
    { id: 13, text: "Membaca Al-Mulk (Sebelum Tidur)", done: false },
    { id: 14, text: "Berbakti/Mendoakan Orang Tua", done: false },
    { id: 15, text: "Menjaga Wudhu", done: false },
    { id: 16, text: "Membaca Shalawat (Min. 10x)", done: false },
    { id: 17, text: "Istighfar (Min. 70x)", done: false },
    { id: 18, text: "Menahan Marah/Sabar", done: false },
    { id: 19, text: "Memberi Salam/Senyum", done: false }
];

// Inisialisasi Data dari Penyimpanan HP (LocalStorage)
let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || defaultTasks;
let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];
let userName = localStorage.getItem('amalaUserName') || "";

// ==========================================
// 2. FUNGSI TOGGLE TASK (INTI APLIKASI)
// ==========================================
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.done = !task.done; // Mengubah status (centang/tidak)

    if (task.done) {
        // Efek Suara
        const audio = document.getElementById('sound-success');
        if(audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
        
        // Pilih Pesan Motivasi Acak
        const motivasi = ["MasyaAllah!", "Alhamdulillah!", "Luar Biasa!", "Satu Langkah Surga!", "Terus Istiqomah!"];
        const randomMotivasi = motivasi[Math.floor(Math.random() * motivasi.length)];
        
        // Ambil Hadits
        const infoHadits = keutamaan[task.text] || keutamaan["default"];
        
        // Munculkan Pesan Melayang (Toast)
        showToast(`${randomMotivasi} ✨\n${infoHadits}`);
    }
    
    renderTasks(); // Gambar ulang tampilan
}

// ==========================================
// 3. FUNGSI PENDUKUNG (RENDER & UI)
// ==========================================
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    if(!taskList) return;
    taskList.innerHTML = '';
    
    // Sapaan Nama
    if (!userName) {
        userName = prompt("Boleh tahu siapa namamu?") || "Hamba Allah
