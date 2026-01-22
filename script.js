// 1. Konfigurasi Kutipan
const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari & Muslim" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Tumbuhlah lebih baik dari dirimu yang kemarin.", source: "AMALA" },
    { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.", source: "HR. Ahmad" },
    { text: "Jadikan sabar dan shalat sebagai penolongmu.", source: "Al-Baqarah: 45" }
];

// 2. Daftar 19 Tugas Utama (Master Data)
const masterTasks = [
    { id: 1, text: "Shalat Shubuh Berjamaah", done: false },
    { id: 2, text: "Shalat Dhuhur Berjamaah", done: false },
    { id: 3, text: "Shalat Ashar Berjamaah", done: false },
    { id: 4, text: "Shalat Maghrib Berjamaah", done: false },
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

// 3. Logika Memori (LocalStorage) & Reset Otomatis Versi Lama
let savedTasks = JSON.parse(localStorage.getItem('amalaTasks'));

// JIKA data kosong ATAU jumlah tugas kurang dari 10 (berarti versi lama 2 tugas)
if (!savedTasks || savedTasks.length < 10) {
    localStorage.setItem('amalaTasks', JSON.stringify(masterTasks));
    savedTasks = masterTasks;
}

let tasks = savedTasks;

// 4. Fungsi Render (Menampilkan ke Layar)
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        `;
        taskList.appendChild(div);
    });
    
    updateProgress();
    updateGarden();
    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

// 5. Logika Interaksi (Centang, Tambah, Hapus)
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        if (task.done) {
            const audio = document.getElementById('sound-success');
            if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
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

// 6. Logika Progress & Kebun
function updateProgress() {
    const completed = tasks.filter(t => t.done).length;
    const percent = tasks.length > 0 ? Math.round((completed / tasks.length) *
