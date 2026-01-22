// 1. Inisialisasi Data Amalan
let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || [];

// Daftar 18 Amalan Sesuai Permintaan Anda
const defaultTasks = [
    "Shalat Shubuh Berjamaah",
    "Shalat Dhuhur Berjamaah",
    "Shalat Ashar Berjamaah",
    "Shalat Maghrib Berjamaah",
    "Shalat Isya Berjamaah",
    "Shalat Dhuha",
    "Shalat Tahajjud",
    "Shalat Witir",
    "Membaca Al-Quran",
    "Murojaah Hafalan",
    "Puasa Sunnah",
    "Dzikir Pagi",
    "Dzikir Sore",
    "Bersedekah",
    "Membaca Buku",
    "Mendengarkan Kajian",
    "Mengucapkan Salam kepada Orang Lain",
    "Menabung",
    "Membaca Shalawat"
];

// Jika pengguna baru (data kosong), masukkan daftar default
if (tasks.length === 0) {
    tasks = defaultTasks.map(t => ({ text: t, done: false }));
    saveTasks();
}

// 2. Fungsi Utama
function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = `task-item ${task.done ? 'done' : ''}`;
        item.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
            <span>${task.text}</span>
            <button onclick="deleteTask(${index})">✕</button>
        `;
        list.appendChild(item);
    });
    updateProgress();
}

function addTask() {
    const input = document.getElementById('new-task-input');
    if (input.value.trim() !== '') {
        tasks.push({ text: input.value, done: false });
        input.value = '';
        saveTasks();
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    if (tasks[index].done) {
        document.getElementById('sound-success').play();
    }
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Hapus amalan ini?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

// 3. Sistem Progress & Kebun Digital
function updateProgress() {
    const total = tasks.length;
    const doneCount = tasks.filter(t => t.done).length;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';
    
    updatePlant(percent);
}

function updatePlant(percent) {
    const plant = document.getElementById('plant-container');
    const status = document.getElementById('garden-status');
    
    if (percent === 0) {
        plant.innerText = '🌱';
        status.innerText = 'Niatkan harimu, mulai melangkah!';
    } else if (percent < 30) {
        plant.innerText = '🌿';
        status.innerText = 'Terus pupuk kebaikanmu.';
    } else if (percent < 60) {
        plant.innerText = '🌳';
        status.innerText = 'Kebunmu tumbuh dengan subur!';
    } else if (percent < 100) {
        plant.innerText = '🌳✨';
        status.innerText = 'Sedikit lagi menuju mekar!';
    } else {
        plant.innerText = '🌸🌳🌸';
        status.innerText = 'Maa Syaa Allah! Kebunmu penuh bunga hari ini.';
    }
}

// 4. Reset Harian
function resetDay() {
    if (confirm('Mulai hari baru? Semua centang akan direset.')) {
        tasks = tasks.map(t => ({ ...t, done: false }));
        // Jika list kosong, kembalikan ke default
        if (tasks.length === 0) {
            tasks = defaultTasks.map(t => ({ text: t, done: false }));
        }
        saveTasks();
        renderTasks();
    }
}

// 5. Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    document.getElementById('theme-toggle').innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

// Jalankan saat halaman dibuka
renderTasks();
