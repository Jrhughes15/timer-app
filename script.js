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

function showAddTimerModal() {
    document.getElementById('add-timer-modal').style.display = 'block';
}

function closeAddTimerModal() {
    document.getElementById('add-timer-modal').style.display = 'none';
}

function toggleTimerInputs() {
    const timerType = document.getElementById('timer-type').value;
    document.getElementById('until-input').style.display = timerType === 'until' ? 'block' : 'none';
    document.getElementById('set-input').style.display = timerType === 'set' ? 'block' : 'none';
}

function addTimer() {
    const name = document.getElementById('timer-name').value;
    const timerType = document.getElementById('timer-type').value;
    let targetTime;
    let displayTarget;

    if (timerType === 'until') {
        const time = document.getElementById('timer-time').value;
        targetTime = new Date();
        const [hours, minutes, seconds] = time.split(':').map(Number);
        targetTime.setHours(hours);
        targetTime.setMinutes(minutes);
        targetTime.setSeconds(seconds);
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
    newTimer.className = 'timer';

    const timerId = `timer-${Date.now()}`;
    newTimer.innerHTML = `
        <h2>${name || 'Extra Timer'}</h2>
        <div>Target Time: ${displayTarget}</div>
        <div id="${timerId}-display">00:00:00</div>
        <button onclick="stopExtraTimer('${timerId}')">Stop</button>
        <button onclick="clearExtraTimer('${timerId}')">Clear</button>
    `;
    extraTimers.appendChild(newTimer);

    startExtraTimer(timerId, targetTime.toISOString());
    closeAddTimerModal();
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

function stopExtraTimer(timerId) {
    clearInterval(window[`${timerId}Interval`]);
}

function clearExtraTimer(timerId) {
    const timerElement = document.getElementById(`${timerId}-display`).parentElement;
    timerElement.remove();
    stopExtraTimer(timerId);
}

function updateCurrentTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = `Current Time: ${formatFullTime(now)}`;
}

function updateDisplay(display, seconds) {
    display.textContent = formatTime(seconds);
    display.style.color = seconds <= 10 ? 'red' : seconds <= 30 ? 'blue' : 'black';
    display.style.fontWeight = seconds <= 30 ? 'bold' : 'normal';
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();