
const identifierInput = document.getElementById('identifier');
const passwordInput = document.getElementById('password');
const arrowIdentifier = document.getElementById('arrow-identifier');
const arrowPassword = document.getElementById('arrow-password');
const weirdLetters = document.querySelector('.login-container > form > p > span')
const terminalScreen = document.querySelector('.terminal-screen');
const robot = document.querySelector('.robot');
const robotDiv = document.querySelector('.robot');

const terminalTitles = ['Initializing...', 'LOGGING IN', 'USER TAKING SO LONG', 'maybe soon......'];

let robotFocus = false;

function init() {
    identifierInput.addEventListener('focus', () => {
        arrowIdentifier.style.color = 'rgb(44, 187, 187)';
        arrowIdentifier.style.transform = 'translateY(-50%) translateX(6px)';
        robotFocus = true;
        sideEye();
    });
    identifierInput.addEventListener('blur', () => {
        arrowIdentifier.style.color = 'white';
        arrowIdentifier.style.transform = 'translateY(-50%) translateX(0)';
        robotFocus = false;
        loseFocus();
        robotAnimation()
    });
    passwordInput.addEventListener('focus', () => {
        arrowPassword.style.color = 'rgb(44, 187, 187)';
        arrowPassword.style.transform = 'translateY(-50%) translateX(6px)';
        robotFocus = true;
        passRobotEye();
    });
    passwordInput.addEventListener('blur', () => {
        arrowPassword.style.color = 'white';
        arrowPassword.style.transform = 'translateY(-50%) translateX(0)';
        robotFocus = false;
        loseFocus();
        robotAnimation();
    });

    document.body.addEventListener('mousemove', robotAnimation);

    setInterval(hashedLettersAnimation, 85);
    setInterval(terminalScreenAnimation, 600);

    makeRobot(robot)
}

function hashedLettersAnimation() {
    const letters = ['!', '@', '#', '$', '%', '&', '?'];
    let out = "";
    for (let i = 0; i < 6; i++) {
        out = out + letters[Math.floor(Math.random() * letters.length)]
    }

    weirdLetters.textContent = out;
}

function terminalScreenAnimation() {
    const children = terminalScreen.children;

    if (children.length <= 4) {
        const title = document.createElement("h3");
        title.textContent = terminalTitles[children.length - 1];
        terminalScreen.appendChild(title);
    } else {
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id === "user") continue;
            children[i].remove();
        }
    }
}

export function makeRobot(robotDiv) {
    const robotArrayColor = [
        ['', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'],
        ['#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', , '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', , '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#ffffff', '#ffffff', '#222035', '#222035', '#222035', '#222035', '#ffffff', '#ffffff', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#ffffff', '#5ecee4', '#222035', '#222035', '#222035', '#222035', '#ffffff', '#5ecee4', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#222035', '#222035', '#222035', '#5ecee4', '#5ecee4', '#5ecee4', '#222035', '#222035', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#222035', '#000000', '#e0e0e0', '#000000'],
        ['#000000', '#bdbdbd', '#bdbdbd', '#bdbdbd', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#e0e0e0', '#000000'],
        ['', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'],
    ];

    for (let i = 0; i < robotArrayColor.length; i++) {
        for (let j = 0; j < robotArrayColor[i].length; j++) {
            const div = document.createElement('div');
            div.textContent = '.';
            div.style.color = 'transparent';
            div.style.backgroundColor = robotArrayColor[i][j];
            robotDiv.appendChild(div);
        }
    }

}

function sideEye() {
    const children = robotDiv.children;
    children[89].style.backgroundColor = '#222035';
    children[88].style.backgroundColor = '#222035';
    children[94].style.backgroundColor = '#222035';
    children[95].style.backgroundColor = '#222035';
    children[108].style.backgroundColor = '#222035';
    children[109].style.backgroundColor = '#222035';
    children[115].style.backgroundColor = '#222035';
    children[114].style.backgroundColor = '#222035';

    children[71].style.backgroundColor = '#ffffff';
    children[70].style.backgroundColor = '#ffffff';
    children[76].style.backgroundColor = '#ffffff';
    children[77].style.backgroundColor = '#ffffff';
    children[90].style.backgroundColor = 'white';
    children[91].style.backgroundColor = 'white';
    children[97].style.backgroundColor = 'white';
    children[96].style.backgroundColor = 'white';

    children[71].style.backgroundColor = '#5ecee4';
    children[77].style.backgroundColor = '#5ecee4';
}

function loseFocus() {
    const children = robotDiv.children;

    children[71].style.backgroundColor = '#222035';
    children[70].style.backgroundColor = '#222035';
    children[76].style.backgroundColor = '#222035';
    children[77].style.backgroundColor = '#222035';
    children[90].style.backgroundColor = '#222035';
    children[91].style.backgroundColor = '#222035';
    children[97].style.backgroundColor = '#222035';
    children[96].style.backgroundColor = '#222035';

    children[71].style.backgroundColor = '#222035';
    children[77].style.backgroundColor = '#222035';

    children[109].style.backgroundColor = '#222035';
    children[108].style.backgroundColor = '#222035';
    children[114].style.backgroundColor = '#222035';
    children[115].style.backgroundColor = '#222035';
    children[128].style.backgroundColor = '#222035';
    children[129].style.backgroundColor = '#222035';
    children[135].style.backgroundColor = '#222035';
    children[134].style.backgroundColor = '#222035';

    children[128].style.backgroundColor = '#222035';
    children[134].style.backgroundColor = '#222035';
}

function passRobotEye() {
    const children = robotDiv.children;
    children[89].style.backgroundColor = '#222035';
    children[88].style.backgroundColor = '#222035';
    children[94].style.backgroundColor = '#222035';
    children[95].style.backgroundColor = '#222035';
    children[108].style.backgroundColor = '#222035';
    children[109].style.backgroundColor = '#222035';
    children[115].style.backgroundColor = '#222035';
    children[114].style.backgroundColor = '#222035';

    children[109].style.backgroundColor = '#ffffff';
    children[108].style.backgroundColor = '#ffffff';
    children[114].style.backgroundColor = '#ffffff';
    children[115].style.backgroundColor = '#ffffff';
    children[128].style.backgroundColor = 'white';
    children[129].style.backgroundColor = 'white';
    children[135].style.backgroundColor = 'white';
    children[134].style.backgroundColor = 'white';

    children[128].style.backgroundColor = '#5ecee4';
    children[134].style.backgroundColor = '#5ecee4';
}

function robotAnimation(e) {
    if (robotFocus) return;

    const rect = robot.getBoundingClientRect();
    const children = robot.children;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;


    if (!e) {
        children[89].style.backgroundColor = '#ffffff';
        children[88].style.backgroundColor = '#ffffff';
        children[94].style.backgroundColor = '#ffffff';
        children[95].style.backgroundColor = '#ffffff';
        children[108].style.backgroundColor = 'white';
        children[109].style.backgroundColor = 'white';
        children[115].style.backgroundColor = 'white';
        children[114].style.backgroundColor = 'white';

        children[89].style.backgroundColor = '#5ecee4';
        children[95].style.backgroundColor = '#5ecee4';
        return;
    }
    if (e.clientX > centerX && e.clientY < centerY) {
        children[89].style.backgroundColor = '#ffffff';
        children[88].style.backgroundColor = '#ffffff';
        children[94].style.backgroundColor = '#ffffff';
        children[95].style.backgroundColor = '#ffffff';
        children[108].style.backgroundColor = 'white';
        children[109].style.backgroundColor = 'white';
        children[115].style.backgroundColor = 'white';
        children[114].style.backgroundColor = 'white';

        children[89].style.backgroundColor = '#5ecee4';
        children[95].style.backgroundColor = '#5ecee4';
    } else if (e.clientX < centerX && e.clientY < centerY) {
        children[89].style.backgroundColor = '#ffffff';
        children[88].style.backgroundColor = '#ffffff';
        children[94].style.backgroundColor = '#ffffff';
        children[95].style.backgroundColor = '#ffffff';
        children[108].style.backgroundColor = 'white';
        children[109].style.backgroundColor = 'white';
        children[115].style.backgroundColor = 'white';
        children[114].style.backgroundColor = 'white';

        children[88].style.backgroundColor = '#5ecee4';
        children[94].style.backgroundColor = '#5ecee4';
    } else if (e.clientX < centerX && e.clientY > centerY) {
        children[89].style.backgroundColor = '#ffffff';
        children[88].style.backgroundColor = '#ffffff';
        children[94].style.backgroundColor = '#ffffff';
        children[95].style.backgroundColor = '#ffffff';
        children[108].style.backgroundColor = 'white';
        children[109].style.backgroundColor = 'white';
        children[115].style.backgroundColor = 'white';
        children[114].style.backgroundColor = 'white';

        children[108].style.backgroundColor = '#5ecee4';
        children[114].style.backgroundColor = '#5ecee4';
    } else {
        children[89].style.backgroundColor = '#ffffff';
        children[88].style.backgroundColor = '#ffffff';
        children[94].style.backgroundColor = '#ffffff';
        children[95].style.backgroundColor = '#ffffff';
        children[108].style.backgroundColor = 'white';
        children[109].style.backgroundColor = 'white';
        children[115].style.backgroundColor = 'white';
        children[114].style.backgroundColor = 'white';

        children[109].style.backgroundColor = '#5ecee4';
        children[115].style.backgroundColor = '#5ecee4';
    }




}

init();