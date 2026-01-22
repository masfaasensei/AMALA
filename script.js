// 1. DATA KUTIPAN & KEUTAMAAN AMAL
const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Satu langkah kecil adalah awal perjalanan besar.", source: "Amala" },
    { text: "Tumbuhlah lebih baik dari dirimu yang kemarin.", source: "Amala" }
];

const keutamaan = {
    "Shalat Tepat Waktu": "Cahaya di hari kiamat dan pembeda mukmin. (HR. Ahmad)",
    "Sedekah Subuh": "Dua malaikat berdoa: 'Ya Allah, berikan ganti bagi yang berinfak'. (HR. Bukhari)",
    "Membaca Al-Qur'an 1 Halaman": "Satu hurufnya sepuluh kebaikan. (HR. Tirmidzi)",
    "Tersenyum": "Senyummu di hadapan saudaramu adalah sedekah. (HR. Tirmidzi)",
    "default": "Kebaikan kecil yang istiqomah sangat dicintai Allah."
};

// 2. LOAD DATA DARI STORAGE
let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || [
    { id: 1, text: "Shalat Tepat Waktu", done: false },
    { id: 2, text: "Sedekah Subuh", done: false },
    { id: 3, text: "Membaca Al-Qur'an 1 Halaman", done: false }
];

let history = JSON.parse(localStorage.getItem('amalaHistory')) || [];

// 3. FUNGSI TAMPILAN (RENDER)
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if(!taskList) return;
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <span class="info-btn" onclick="showInfo('${task.text}')" style="cursor:pointer; margin-left:8px; color:#89a894">ⓘ</span>
            <button onclick="deleteTask(${task.id})" style="margin-left:auto; background:none; border:none; color:#ff6b6b; cursor:pointer;">✕</button>
        `;
        taskList.appendChild(div);
    });
    
    updateUI();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    if (task.done) {
        const sound = document.getElementById('sound-success');
        if(sound) { sound.currentTime = 0; sound.play().catch(() => {}); }
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
    
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';

    const plant = document.getElementById('plant-container');
    const status = document.getElementById('garden-status');
    if (percent === 0) { plant.innerText = "🌱"; status.innerText = "Siap beramal?"; }
    else if (percent < 50) { plant.innerText = "🌿"; status.innerText = "Terus bertumbuh!"; }
    else if (percent < 100) { plant.innerText = "🌳"; status.innerText = "Hampir berbunga!"; }
    else { plant.innerText = "🌸"; status.innerText = "Luar biasa!"; }

    document.getElementById('total-days').innerText = history.length;
    const totalPoints = history.reduce((sum, h) => sum + h.score, 0) + (percent);
    document.getElementById('total-points').innerText = totalPoints;

    const histList = document.getElementById('history-list');
    histList.innerHTML = history.length ? '<h4 style="margin:10px 0 5px">7 Hari Terakhir</h4>' : '';
    history.slice(0, 7).forEach(h => {
        const d = document.createElement('div');
        d.className = 'history-item';
        d.style = "display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid #eee; padding:4px 0";
        d.innerHTML = `<span>${h.date}</span><span>⭐ ${h.score}</span>`;
        histList.appendChild(d);
    });

    localStorage.setItem('am
