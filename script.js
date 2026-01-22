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

const keutamaan = {
    "Shalat Shubuh Berjamaah": "Mendapat jaminan perlindungan Allah sepanjang hari.",
    "default": "Kebaikan kecil yang istiqomah dicintai Allah."
};

let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || defaultTasks;
let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];
let userName = localStorage.getItem('amalaUserName') || "";

function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if(!task) return;
    task.done = !task.done;
    if (task.done) {
        const audio = document.getElementById('sound-success');
        if(audio) { audio.currentTime = 0; audio.play().catch(()=>{}); }
        const msg = keutamaan[task.text] || keutamaan["default"];
        showToast("MasyaAllah! ✨\n" + msg);
    }
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    if(!list) return;
    list.innerHTML = '';
    
    if (!userName) {
        userName = prompt("Boleh tahu siapa namamu?") || "Hamba Allah";
        localStorage.setItem('amalaUserName', userName);
    }
    
    const tagline = document.querySelector('.tagline');
    if(tagline) tagline.innerText = "Semangat beramal, " + userName + "!";

    tasks.forEach(t => {
        const div = document.createElement('div');
        div.className = "task-item " + (t.done ? "done" : "");
        div.innerHTML = '<input type="checkbox" ' + (t.done ? "checked" : "") + ' onchange="toggleTask(' + t.id + ')"><span>' + t.text + '</span>';
        list.appendChild(div);
    });
    updateUI();
}

function updateUI() {
    const done = tasks.filter(t => t.done).length;
    const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    
    const fill = document.getElementById('progress-fill');
    if(fill) fill.style.width = percent + '%';
    
    const txtPercent = document.getElementById('progress-percent');
    if(txtPercent) txtPercent.innerText = percent + '%';
    
    const txtDays = document.getElementById('total-days');
    if(txtDays) txtDays.innerText = history.length;
    
    const points = history.reduce((s, h) => s + h.score, 0) + percent;
    const txtPoints = document.getElementById('total-points');
    if(txtPoints) txtPoints.innerText = points;

    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

function resetDay() {
    if(confirm("Simpan rekap dan mulai hari baru?")) {
        const done = tasks.filter(t => t.done).length;
        const score = Math.round((done / tasks.length) * 100);
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
