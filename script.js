const quotes = [
    { text: "Amalan yang paling dicintai Allah adalah yang rutin meskipun sedikit.", source: "HR. Bukhari & Muslim" },
    { text: "Jangan meremehkan kebaikan sekecil apa pun.", source: "HR. Muslim" },
    { text: "Tumbuhlah lebih baik dari dirimu yang kemarin.", source: "Amala" },
    { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.", source: "HR. Ahmad" },
    { text: "Jadikan sabar dan shalat sebagai penolongmu.", source: "Al-Baqarah: 45" }
];

let tasks = JSON.parse(localStorage.getItem('amalaTasks')) || [
    { id: 1, text: "Shalat Tepat Waktu", done: false },
    { id: 2, text: "Sedekah Subuh", done: false }
];

// --- FUNGSI UTAMA ---
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.done ? 'done' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <button onclick="deleteTask(${task.id})" style="margin-left:auto; background:none; border:none; color:red; cursor:pointer;">✕</button>
        `;
        taskList.appendChild(div);
    });
    updateProgress();
    updateGarden();
    localStorage.setItem('amalaTasks', JSON.stringify(tasks));
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    if (task.done) document.getElementById('sound-success').play();
    renderTasks();
}

function addTask() {
    const input = document.getElementById('new-task-input');
    if (input.value.trim() !== "") {
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
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';
}

function updateGarden() {
    const completed = tasks.filter(t => t.done).length;
    const plant = document.getElementById('plant-container');
    if (completed === 0) plant.innerText = "🌱";
    else if (completed <= 2) plant.innerText = "🌿";
    else if (completed < tasks.length) plant.innerText = "🌳";
    else plant.innerText = "🌸";
}

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('amalaTheme', newTheme);
    document.getElementById('theme-toggle').innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

function resetDay() {
    if (confirm("Mulai hari baru?")) {
        tasks.forEach(t => t.done = false);
        renderTasks();
    }
}

// Jalankan saat startup
const savedTheme = localStorage.getItem('amalaTheme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-toggle').innerText = savedTheme === 'dark' ? '☀️' : '🌙';
}
const randomIndex = Math.floor(Math.random() * quotes.length);
document.getElementById('daily-quote').innerText = `"${quotes[randomIndex].text}"`;
document.getElementById('quote-source').innerText = `— ${quotes[randomIndex].source}`;
renderTasks();