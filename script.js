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

let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || defaultTasks;
let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];
let userName = localStorage.getItem('amalaUserName') || "";

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    if (task.done) {
        document.getElementById('sound-success').play().catch(()=>{});
        const msg = keutamaan[task.text] || keutamaan["default"];
        showToast(`MasyaAllah! ✨\nKeutamaan: ${msg}`);
    }
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    
    if (!userName) {
        userName = prompt("Siapa namamu?") || "Hamba Allah";
        localStorage.setItem('amalaUserName', userName);
    }
    document.querySelector('.tagline').innerText = `Semangat beramal, ${userName}!`;

    tasks.forEach(t => {
        const div = document.createElement('div');
        div.className = `task-item ${t.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${t.id})">
            <span>${t.text}</span>
        `;
        list.appendChild(div);
    });
    updateUI();
}

function updateUI() {
    const done = tasks.filter(t => t.done).length;
    const percent = Math.round((done / tasks.length) * 100);
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';
    document.getElementById('total-days').innerText = history.length;
    const pts = history.reduce((s, h) => s + h.score, 0) + percent;
    document.getElementById('total-points').innerText = pts;
    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

function resetDay() {
    if(confirm("Selesaikan hari ini dan simpan rekap?")) {
        const score = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
        history.unshift({ date: new Date().toLocaleDateString(), score: score });
        localStorage.setItem('amalaHistory', JSON.stringify(history));
        tasks = defaultTasks.map(t => ({...t, done: false}));
        renderTasks();
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', renderTasks);
