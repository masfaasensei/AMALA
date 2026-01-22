// 1. DATA MASTER
const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" }
];

const keutamaan = {
    "Shalat Shubuh Berjamaah": "Mendapat jaminan perlindungan Allah sepanjang hari.",
    "Shalat Tahajud/Witir": "Waktu paling mustajab dan kemuliaan bagi seorang mukmin.",
    "Sedekah Subuh": "Dua malaikat mendoakan ganti bagi yang berinfak.",
    "Membaca Al-Qur'an (Min. 1 Halaman)": "Setiap satu hurufnya bernilai sepuluh kebaikan.",
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

// LOAD DATA
let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || defaultTasks;
let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];
let userName = localStorage.getItem('amalaUserName') || "";

// FUNGSI TOAST (PESAN MELAYANG)
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(container) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3500);
    }
}

// FUNGSI TOGGLE (KLIK CENTANG)
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    
    if (task.done) {
        const audio = document.getElementById('sound-success');
        if(audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
        
        const infoHadits = keutamaan[task.text] || keutamaan["default"];
        showToast(`MasyaAllah! ✨\n${infoHadits}`);
    }
    renderTasks();
}

// RENDER TAMPILAN
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if(!taskList) return;
    taskList.innerHTML = '';
    
    // Cek Nama
    if (!userName) {
        userName = prompt("Siapa namamu?") || "Hamba Allah";
        localStorage.setItem('amalaUserName', userName);
    }
    document.querySelector('.tagline').innerText = `Semangat beramal, ${userName}!`;

    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <span class="info-btn" onclick="alert('${keutamaan[task.text] || keutamaan['default']}')">ⓘ</span>
        `;
        taskList.appendChild(div);
    });
    
    updateUI();
}

function updateUI() {
    const completed = tasks.filter(t => t.done).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';

    document.getElementById('total-days').innerText = history.length;
    const points = history.reduce((sum, h) => sum + h.score, 0) + percent;
    document.getElementById('total-points').innerText = points;

    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

function resetDay() {
    if (confirm("Simpan rekap dan mulai hari baru?")) {
        const score = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
        history.unshift({ date: new Date().toLocaleDateString('id-ID'), score: score });
        localStorage.setItem('amalaHistory', JSON.stringify(history));
        
        tasks = defaultTasks.map(t => ({...t, done: false}));
        renderTasks();
    }
}

// DARK MODE
function toggleDarkMode() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('amalaTheme', theme);
}

document.addEventListener('DOMContentLoaded', renderTasks);
