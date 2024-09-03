let tasks = [];
const alarmSound = document.getElementById('alarmSound');
const currentTimeDisplay = document.getElementById('currentTime');

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const timeInput = document.getElementById('timeInput');
    const task = taskInput.value.trim();
    const time = timeInput.value;

    if (task && time) {
        tasks.push({ task, time });
        tasks.sort((a, b) => a.time.localeCompare(b.time));
        saveTasks();
        renderTasks();
        taskInput.value = '';
        timeInput.value = '';
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // Crear y agregar los títulos solo una vez
    const headers = document.createElement('div');
    headers.className = 'task-headers';
    headers.innerHTML = `
        <div class="task-time-header">
            <strong>Hora</strong>
        </div>
        <div class="task-description-header">
            <strong>Descripción</strong>
        </div>
    `;
    taskList.appendChild(headers);

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
                <div class="task-content">
                    <span class="task-time">${task.time}</span>
                    <span class="task-description">${task.task}</span>
                </div>
                <button onclick="deleteTask(${index})">Eliminar</button>
            `;
        taskList.appendChild(taskItem);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function checkAlarms() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    tasks.forEach((task, index) => {
        if (task.time === currentTime && now.getSeconds() < 3) {
            alarmSound.play();

            const taskItems = document.querySelectorAll('.task-item');
            taskItems[index].classList.add('alarm-active');

            alert(`¡Es hora de: ${task.task}!`);

            setTimeout(() => {
                alarmSound.pause();
                alarmSound.currentTime = 0;
            }, 3000);

            setTimeout(() => {
                taskItems[index].classList.remove('alarm-active');
            }, 60000);
        }
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Cargar tareas al iniciar la aplicación
loadTasks();

// Actualizar la hora actual cada segundo
setInterval(updateCurrentTime, 1000);

// Verificar las alarmas cada segundo
setInterval(checkAlarms, 1000);

// Verificar y actualizar inmediatamente al cargar la página
updateCurrentTime();
checkAlarms();