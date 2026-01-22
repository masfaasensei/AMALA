const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Satu langkah kecil adalah awal perjalanan besar.", source: "Amala" }
];

const keutamaan = {
    "Shalat Tepat Waktu": "Cahaya di hari kiamat dan pembeda mukmin.",
    "Sedekah Subuh": "Didoakan malaikat setiap pagi.",
    "Membaca Al-Qur'an": "Satu hurufnya sepuluh kebaikan.",
    "default": "Kebaikan yang mendatangkan ketenangan hati."
};

let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || [
    { id: 1, text: "Shalat Tepat Waktu", done: false },
    { id: 2, text: "Sedekah Subuh", done: false },
    { id: 3, text: "Membaca Al-Qur'an 1 Halaman", done: false }
];

let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
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

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    if (task.done) document.getElementById('sound-success').play().catch(() => {});
    renderTasks();
}

function showInfo(taskName) {
    const info = keutamaan[taskName] || keutamaan["default"];
    alert(`Keutamaan: ${info}`);
}

function addTask() {
    const input = document.getElementById('new-task-input');
    if (input.value.trim()) {
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
    // Progress
    const completed = tasks.filter(t => t.done).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';

    // Garden
    const plant = document.getElementById('plant-container');
    if (percent === 0) plant.innerText = "🌱";
    else if (percent < 50) plant.innerText = "🌿";
    else if (percent < 100) plant.innerText = "🌳";
    else plant.innerText = "🌸";

    // Stats
    document.getElementById('total-days').innerText = history.length;
    const totalPoints = history.reduce((sum, h) => sum + h.score, 0) + (percent);
    document.getElementById('total-points').innerText = totalPoints;

    // History
    const histList = document.getElementById('history-list');
    histList.innerHTML = history.length ? '<h4>Rekap 7 Hari Terakhir</h4>' : '';
    history.slice(0, 7).forEach(h => {
        const d = document.createElement('div');
        d.className = 'history-item';
        d.innerHTML = `<span>${h.date}</span><span>⭐ ${h.score}</span>`;
        histList.appendChild(d);
    });

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
        alert("Bintang disimpan! Mari mulai hari baru dengan semangat.");
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('amalaTheme', theme);
    document.getElementById('theme-toggle').innerText = theme === 'dark' ? '☀️' : '🌙';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('amalaTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-toggle').innerText = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').innerText = `"${q.text}"`;
    document.getElementById('quote-source').innerText = `— ${q.source}`;
    renderTasks();
});
