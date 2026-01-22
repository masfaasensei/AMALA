// Konfigurasi Kutipan
const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari & Muslim" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Tumbuhlah lebih baik dari dirimu yang kemarin.", source: "AMALA" },
    { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.", source: "HR. Ahmad" },
    { text: "Jadikan sabar dan shalat sebagai penolongmu.", source: "Al-Baqarah: 45" }
];

// Load Data Awal
let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || [
    { id: 1, text: "Shalat Shubuh Berjamaah", done: false },
    { id: 2, text: "Shalat Dhuhur Berjamaah", done: false },
    { id: 3, text: "Shalat Ashar Berjamaah", done: false },
    { id: 4, text: "Shalat Maghrib Berjamaah", done: false }, // Tadi kurang koma di sini
    { id: 5, text: "Shalat Isya Berjamaah", done: false },
    { id: 6, text: "Shalat Dhuha", done: false },
    { id: 7, text: "Shalat Tahajjud", done: false },
    { id: 8, text: "Shalat Witir", done: false },
    { id: 9, text: "Tilawah Al Quran", done: false },
    { id: 10, text: "Murojaah Hafalan", done: false },
    { id: 11, text: "Puasa Sunnah", done: false },
    { id: 12, text: "Dzikir Pagi", done: false },
    { id: 13, text: "Dzikir Sore", done: false },
    { id: 14, text: "Sedekah", done: false },
    { id: 15, text: "Membaca Buku", done: false },
    { id: 16, text: "Mendengarkan Kajian", done: false },
    { id: 17, text: "Mengucapkan Salam", done: false },
    { id: 18, text: "Menabung", done: false },
    { id: 19, text: "Membaca Shalawat", done: false }
];

// Render Halaman
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <button onclick="deleteTask(${task.id})" style="margin-left:auto; background:none; border:none; color:#ff4444; cursor:pointer; font-weight:bold;">✕</button>
        `;
        taskList.appendChild(div);
    });
    
    updateProgress();
    updateGarden();
    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

// Logika Interaksi
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        if (task.done) {
            const audio = document.getElementById('sound-success');
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log("Audio play blocked"));
            }
        }
    }
    renderTasks();
}

function addTask() {
    const input = document.getElementById('new-task-input');
    if (input && input.value.trim() !== "") {
        tasks.push({ id: Date.now(), text: input.value, done: false });
        input.value = "";
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function updateProgress() {
    const completed = tasks.filter(t => t.done).length;
    const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    const fill = document.getElementById('progress-fill');
    const txt = document.getElementById('progress-percent');
    if (fill) fill.style.width = percent + '%';
    if (txt) txt.innerText = percent + '%';
}

function updateGarden() {
    const completed = tasks.filter(t => t.done).length;
    const plant = document.getElementById('plant-container');
    const status = document.getElementById('garden-status');
    if (!plant || !status) return;

    if (completed === 0) {
        plant.innerText = "🌱";
        status.innerText = "Benihmu baru saja ditanam.";
    } else if (completed <= 5) { // Disesuaikan karena daftar tugas lebih banyak
        plant.innerText = "🌿";
        status.innerText = "Kebunmu mulai bertumbuh.";
    } else if (completed < tasks.length) {
        plant.innerText = "🌳";
        status.innerText = "MasyaAllah, kebunmu semakin rimbun!";
    } else {
        plant.innerText = "🌸";
        status.innerText = "Luar biasa! Hari ini kebunmu berbunga.";
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('amalaTheme', newTheme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

function resetDay() {
    if (confirm("Mulai hari baru? Semua centang akan dikosongkan.")) {
        tasks.forEach(t => t.done = false);
        renderTasks();
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('amalaTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    const quoteTxt = document.getElementById('daily-quote');
    const quoteSrc = document.getElementById('quote-source');
    if (quoteTxt && quoteSrc) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteTxt.innerText = `"${quotes[randomIndex].text}"`;
        quoteSrc.innerText = `— ${quotes[randomIndex].source}`;
    }
    
    renderTasks();
});
