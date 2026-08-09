const showActivityBtn = document.getElementById('show-activity');
const terminal = document.querySelector('.terminal');
const terminalScreen = document.querySelector('.terminal-screen');

const terminalHomeParent = terminal ? terminal.parentNode : null;
const terminalHomeNextSibling = terminal ? terminal.nextSibling : null;

const activityBackdrop = document.createElement('div');
activityBackdrop.className = 'activity-dialog-backdrop';

export function showActivity(latestActivity = []) {
    if (!terminal || !showActivityBtn) return;

    makeBoxes(latestActivity)
    showActivityBtn.addEventListener('click', () => {
        toggleActivity();
    });

    activityBackdrop.addEventListener('click', () => {
        if (terminal.classList.contains('activity')) {
            toggleActivity();
        }
    });
}

function toggleActivity() {
    terminal.classList.toggle('activity')

    const activities = document.querySelectorAll('.activity-container');
    if (terminal.classList.contains('activity')) {
        document.querySelector('.terminal > header > h2').textContent = 'ACTIVITY';
        showActivityBtn.textContent = 'HIDE ACTIVITY';
        activities.forEach(activity => {
            activity.classList.add('show');
        });

        document.body.appendChild(activityBackdrop);
        document.body.appendChild(terminal);
        requestAnimationFrame(() => activityBackdrop.classList.add('show'));
    } else {
        document.querySelector('.terminal > header > h2').textContent = 'AUDIT RATIO';
        showActivityBtn.textContent = 'VIEW ACTIVITY';
        activities.forEach(activity => {
            activity.classList.remove('show');
        });

        activityBackdrop.classList.remove('show');
        terminalHomeParent.insertBefore(terminal, terminalHomeNextSibling);
        activityBackdrop.remove();
    }
}

function makeBoxes(latestActivity = []) {
    for (let i = 0; i < latestActivity.length; i++) {
        const div = document.createElement('div');
        div.classList.add('activity-container');

        const name = document.createElement('h2');
        name.textContent = latestActivity[i].object.name;
        div.appendChild(name);

        const xp = document.createElement('h2');
        let amount = (latestActivity[i].amount / 1000).toFixed(2);
        if (amount > 0) {
            xp.textContent = '+';
            xp.classList.add('gain');
        }
        if (amount < 0) {
            xp.textContent = '-';
            xp.classList.add('lose')
        }

        xp.textContent += `${amount}kb`;
        div.appendChild(xp);

        terminalScreen.appendChild(div);
    }
}