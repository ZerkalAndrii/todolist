document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const toggleAllBtn = document.getElementById('toggleAllBtn');
    const taskList = document.getElementById('taskList');
    const dateWidget = document.getElementById('date');
    const weatherWidget = document.getElementById('weather');
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    // Clock widget
    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secondDegrees = ((seconds / 60) * 360) + 90;
        const minuteDegrees = ((minutes / 60) * 360) + 90;
        const hourDegrees = ((hours / 12) * 360) + 90;

        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Date widget
    function updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const ukrainianDate = now.toLocaleDateString('uk-UA', options);
        dateWidget.textContent = ukrainianDate;
    }
    updateDate();

    // Weather widget
    const API_KEY = '8e570da2873e1c2071d035501258efe9';
    const CITY = 'Lviv';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;
            weatherWidget.textContent = `Temperature: ${temperature}°C, ${weatherDescription}`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

    let tasks = [];

    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            const label = document.createElement('label');
            label.textContent = task.description;
            li.appendChild(checkbox);
            li.appendChild(label);
            li.classList.toggle('completed', task.completed);
            checkbox.addEventListener('change', function() {
                task.completed = this.checked;
                saveTasks();
                renderTasks();
            });
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks();
            });
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const description = taskInput.value.trim();
        if (description) {
            const task = { description, completed: false };
            tasks.push(task);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    clearAllBtn.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        renderTasks();
    });

    toggleAllBtn.addEventListener('click', () => {
        const allCompleted = tasks.every(task => task.completed);
        tasks.forEach(task => task.completed = !allCompleted);
        saveTasks();
        renderTasks();
    });
});
