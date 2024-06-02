let stopwatchInterval;
let stopwatchSeconds = 0;

function startStopwatch() {
    const display = document.getElementById('stopwatch-display');
    
    clearInterval(stopwatchInterval);

    stopwatchInterval = setInterval(() => {
        stopwatchSeconds++;
        display.textContent = formatTime(stopwatchSeconds);
    }, 1000);
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchSeconds = 0;
    document.getElementById('stopwatch-display').textContent = '00:00:00';
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatFullTime(date) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes}:${seconds} ${ampm}`;
}

function formatFullDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    return `Date: ${day} - ${month} - ${date.getMonth() + 1}/${dayNum}/${year}`;
}

function showAddTimerModal() {
    document.getElementById('add-timer-modal').style.display = 'block';
}

function closeAddTimerModal() {
    document.getElementById('add-timer-modal').style.display = 'none';
}

function showEditTimerModal(timerId) {
    const timer = document.getElementById(timerId);
    const name = timer.querySelector('.timer-title').innerText;
    const type = timer.dataset.type;
    const targetTime = timer.dataset.targetTime;
    const hours = timer.dataset.hours || 0;
    const minutes = timer.dataset.minutes || 0;
    const seconds = timer.dataset.seconds || 0;

    document.getElementById('edit-timer-id').value = timerId;
    document.getElementById('edit-timer-name').value = name;
    document.getElementById('edit-timer-type').value = type;
    
    if (type === 'until') {
        document.getElementById('edit-timer-time').value = targetTime;
    } else if (type === 'set') {
        document.getElementById('edit-set-hours').value = hours;
        document.getElementById('edit-set-minutes').value = minutes;
        document.getElementById('edit-set-seconds').value = seconds;
    }
    
    toggleEditTimerInputs();
    document.getElementById('edit-timer-modal').style.display = 'block';
}

function closeEditTimerModal() {
    document.getElementById('edit-timer-modal').style.display = 'none';
}

function toggleTimerInputs() {
    const timerType = document.getElementById('timer-type').value;
    document.getElementById('until-input').style.display = timerType === 'until' ? 'block' : 'none';
    document.getElementById('set-input').style.display = timerType === 'set' ? 'block' : 'none';
}

function toggleEditTimerInputs() {
    const timerType = document.getElementById('edit-timer-type').value;
    document.getElementById('edit-until-input').style.display = timerType === 'until' ? 'block' : 'none';
    document.getElementById('edit-set-input').style.display = timerType === 'set' ? 'block' : 'none';
}

function addTimer() {
    const name = document.getElementById('timer-name').value;
    const timerType = document.getElementById('timer-type').value;
    let targetTime;
    let displayTarget;

    if (timerType === 'until') {
        const time = document.getElementById('timer-time').value;
        targetTime = getNextTargetTime(time);
        displayTarget = formatFullTime(targetTime);
    } else if (timerType === 'set') {
        const hours = parseInt(document.getElementById('set-hours').value) || 0;
        const minutes = parseInt(document.getElementById('set-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('set-seconds').value) || 0;
        const now = new Date();
        targetTime = new Date(now.getTime() + ((hours * 3600 + minutes * 60 + seconds) * 1000));
        displayTarget = `${hours} hrs ${minutes} mins ${seconds} secs (${formatFullTime(targetTime)})`;
    }

    const extraTimers = document.getElementById('extra-timers');
    const newTimer = document.createElement('div');
    newTimer.className = 'timer-container-outer';
    newTimer.id = `timer-${Date.now()}`;
    newTimer.dataset.type = timerType;
    newTimer.dataset.targetTime = targetTime.toISOString();
    newTimer.dataset.hours = parseInt(document.getElementById('set-hours').value) || 0;
    newTimer.dataset.minutes = parseInt(document.getElementById('set-minutes').value) || 0;
    newTimer.dataset.seconds = parseInt(document.getElementById('set-seconds').value) || 0;

    const timerId = newTimer.id;
    newTimer.innerHTML = `
        <div class="timer-section timer-title">${name || 'Extra Timer'}</div>
        <div class="timer-section timer-info">
            <div>Target Time: ${displayTarget}</div>
            <div id="${timerId}-display" class="timer-display">00:00:00</div>
        </div>
        <div class="timer-section button-container-outer">
            <button onclick="clearExtraTimer('${timerId}')">Clear</button>
            <button onclick="showEditTimerModal('${timerId}')">Edit</button>
        </div>
    `;
    extraTimers.appendChild(newTimer);

    startExtraTimer(timerId, targetTime.toISOString());
    closeAddTimerModal();
}

function updateTimer() {
    const timerId = document.getElementById('edit-timer-id').value;
    const name = document.getElementById('edit-timer-name').value;
    const timerType = document.getElementById('edit-timer-type').value;
    let targetTime;
    let displayTarget;

    if (timerType === 'until') {
        const time = document.getElementById('edit-timer-time').value;
        targetTime = getNextTargetTime(time);
        displayTarget = formatFullTime(targetTime);
    } else if (timerType === 'set') {
        const hours = parseInt(document.getElementById('edit-set-hours').value) || 0;
        const minutes = parseInt(document.getElementById('edit-set-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('edit-set-seconds').value) || 0;
        const now = new Date();
        targetTime = new Date(now.getTime() + ((hours * 3600 + minutes * 60 + seconds) * 1000));
        displayTarget = `${hours} hrs ${minutes} mins ${seconds} secs (${formatFullTime(targetTime)})`;
    }

    const timer = document.getElementById(timerId);
    timer.dataset.type = timerType;
    timer.dataset.targetTime = targetTime.toISOString();
    timer.dataset.hours = parseInt(document.getElementById('edit-set-hours').value) || 0;
    timer.dataset.minutes = parseInt(document.getElementById('edit-set-minutes').value) || 0;
    timer.dataset.seconds = parseInt(document.getElementById('edit-set-seconds').value) || 0;

    timer.querySelector('.timer-title').innerText = name || 'Extra Timer';
    timer.querySelector('.timer-info div').innerText = `Target Time: ${displayTarget}`;
    timer.querySelector('.timer-display').innerText = '00:00:00';

    startExtraTimer(timerId, targetTime.toISOString());
    closeEditTimerModal();
}

function addPresetTimer(name, timeStr) {
    const targetTime = getNextTargetTime(timeStr);
    const displayTarget = formatFullTime(targetTime);

    const extraTimers = document.getElementById('extra-timers');
    const newTimer = document.createElement('div');
    newTimer.className = 'timer-container-outer';
    newTimer.id = `timer-${Date.now()}`;
    newTimer.dataset.type = 'until';
    newTimer.dataset.targetTime = targetTime.toISOString();

    const timerId = newTimer.id;

    const formattedName = name.includes('Saturday') || name.includes('Sunday') 
        ? name.replace(' ', '<br>') 
        : name;

    newTimer.innerHTML = `
        <div class="timer-section timer-title">${formattedName}</div>
        <div class="timer-section timer-info">
            <div>Target Time: ${displayTarget}</div>
            <div id="${timerId}-display" class="timer-display">00:00:00</div>
        </div>
        <div class="timer-section button-container-outer">
            <button onclick="clearExtraTimer('${timerId}')">Clear</button>
            <button onclick="showEditTimerModal('${timerId}')">Edit</button>
        </div>
    `;
    extraTimers.appendChild(newTimer);

    startExtraTimer(timerId, targetTime.toISOString());
}

function getNextTargetTime(timeStr) {
    const now = new Date();
    const targetTime = new Date(now);
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    targetTime.setHours(hours, minutes, seconds, 0);

    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime;
}

function startExtraTimer(timerId, targetTimeStr) {
    const targetTime = new Date(targetTimeStr);
    const display = document.getElementById(`${timerId}-display`);

    clearInterval(window[`${timerId}Interval`]);

    window[`${timerId}Interval`] = setInterval(() => {
        const now = new Date();
        const diff = targetTime - now;

        if (diff <= 0) {
            clearInterval(window[`${timerId}Interval`]);
            display.textContent = '00:00:00';
        } else {
            const seconds = Math.floor(diff / 1000);
            updateDisplay(display, seconds);
        }
    }, 1000);
}

function clearExtraTimer(timerId) {
    const timerElement = document.getElementById(timerId);
    clearInterval(window[`${timerId}Interval`]);
    timerElement.remove();
}

function updateCurrentTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = `Current Time: ${formatFullTime(now)}`;
    document.getElementById('current-date').textContent = formatFullDate(now);
}

function updateDisplay(display, seconds) {
    display.textContent = formatTime(seconds);
    display.style.color = seconds <= 10 ? 'red' : seconds <= 30 ? 'blue' : 'black';
    display.style.fontWeight = seconds <= 30 ? 'bold' : 'normal';
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();
