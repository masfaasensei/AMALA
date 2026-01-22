// 1. KONFIGURASI DATA
const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Tumbuhlah lebih baik dari dirimu yang kemarin.", source: "Amala" }
];

const keutamaan = {
    "Shalat Shubuh Berjamaah": "Mendapat jaminan perlindungan Allah sepanjang hari.",
    "Shalat Tahajud/Witir": "Waktu paling mustajab dan kemuliaan bagi seorang mukmin.",
    "Sedekah Subuh": "Dua malaikat mendoakan ganti yang berlipat bagi yang berinfak.",
    "Membaca Al-Qur'an (Min. 1 Halaman)": "Setiap satu hurufnya bernilai sepuluh kebaikan.",
    "Membaca Al-Mulk (Sebelum Tidur)": "Penyelamat dan penghalang dari siksa kubur.",
    "Shalat Dhuha": "Sedekah bagi setiap persendian tubuh.",
    "Dzikir Pagi": "Perlindungan dari gangguan setan hingga sore hari.",
    "Dzikir Petang": "Perlindungan dari gangguan setan hingga pagi hari.",
    "Istighfar (Min. 70x)": "Membuka pintu rezeki dan menghapus kesedihan.",
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

let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || defaultTasks;
let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];
let userName = localStorage.getItem('amalaUserName') || "";

// 2. FUNGSI TOAST (PESAN MELAYANG)
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return; 
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

// 3. RENDER TAMPILAN
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if(!taskList) return;
    taskList.innerHTML = '';
    
    // Sapaan Nama
    if (!userName) {
        userName = prompt("Boleh tahu siapa namamu?") || "Hamba Allah";
        localStorage.setItem('amalaUserName', userName);
    }
    const tagline = document.querySelector('.tagline');
    if(tagline) tagline.innerText = `Semangat beramal hari ini, ${userName}!`;

    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <span class="info-btn" onclick="showInfo('${task.text}')">ⓘ</span>
            <button onclick="deleteTask(${task.id})" style="margin-left:auto; background:none; border:none; color:#ff6b6b; cursor:pointer;">✕</button>
        `;
        taskList.appendChild(div);
    });
    
    updateUI();
}

// 4. LOGIKA INTERAKSI
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    
    if (task.done) {
        // Suara
        const audio = document.getElementById('sound-success');
        if(audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
        
        // Pesan Reward & Hadits
        const motivasi = ["MasyaAllah!", "Alhamdulillah!", "Satu kebaikan lagi!", "Terus istiqomah!"];
        const randomMotivasi = motivasi[Math.floor(Math.random() * motivasi.length)];
        const infoHadits = keutamaan[task.text] || keutamaan["default"];
        
        showToast(`${randomMotivasi} ✨\nKeutamaan: ${infoHadits}`);
    }
    
    renderTasks();
}

function showInfo(taskName) {
    const info = keutamaan[taskName] || keutamaan["default"];
    alert(`Keutamaan: ${info}`);
}

function addTask() {
    const input = document.getElementById('new-task-input');
    if (input && input.value.trim()) {
        tasks.push({ id: Date.now(), text: input.value, done: false });
        input.value = "";
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function updateUI() {
    const completed = tasks.filter(t => t.done).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    
    const fill = document.getElementById('progress-fill');
    const txtPercent = document.getElementById('progress-percent');
    if(fill) fill.style.width = percent + '%';
    if(txtPercent) txtPercent.innerText = percent + '%';

    const plant = document.getElementById('plant-container');
    if(plant) {
        if (percent === 0) plant.innerText = "🌱";
        else if (percent < 50) plant.innerText = "🌿";
        else if (percent < 100) plant.innerText = "🌳";
        else plant.innerText = "🌸";
    }

    const totalDays = document.getElementById('total-days');
    const totalPts = document.getElementById('total-points');
    if(totalDays) totalDays.innerText = history.length;
    
    const totalPointsAcc = history.reduce((sum, h) => sum + h.score, 0) + (percent);
    if(totalPts) totalPts.innerText = totalPointsAcc;

    const histList = document.getElementById('history-list');
    if(histList) {
        histList.innerHTML = history.length ? '<h4>Rekap 7 Hari Terakhir</h4>' : '';
        history.slice(0, 7).forEach(h => {
            const d = document.createElement('div');
            d.className = 'history-item';
            d.innerHTML = `<span>${h.date}</span><span>⭐ ${h.score}</span>`;
            histList.appendChild(d);
        });
    }

    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

function resetDay() {
    const completed = tasks.filter(t => t.done).length;
    const score = Math.round((completed / tasks.length) * 100);
    
    if (confirm(`Simpan skor hari ini (${score}) dan reset checklist?`)) {
        const today = new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        history.unshift({ date: today, score: score });
        localStorage.setItem('amalaHistory', JSON.stringify(history));
        
        tasks.forEach(t => t.done = false);
        renderTasks();
        showToast("Rekap disimpan! Mari mulai hari baru. 🌙");
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('amalaTheme', theme);
    const btn = document.getElementById('theme-toggle');
    if(btn) btn.innerText = theme === 'dark' ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('amalaTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const btn = document.getElementById('theme-toggle');
        if(btn) btn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
    }
