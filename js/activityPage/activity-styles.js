
/*
    this file just contains the styles, animation and painting of the robot div
    nothing that important just event listeners.
*/
const robotDiv = document.querySelector('.robot');
let robotFocus = false;

function init() {
    document.body.addEventListener('mousemove', robotAnimation);
    makeRobot(robotDiv);
}

function makeRobot(robotDiv) {
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

function robotAnimation(e) {
    if (robotFocus) return;

    const rect = robotDiv.getBoundingClientRect();
    const children = robotDiv.children;
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