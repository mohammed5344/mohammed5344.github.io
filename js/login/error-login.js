const body = document.body;
const robotDiv = document.querySelector('.robot');
let stopFollowing = false;

export function errorGlowing(error = '') {

    stopFollowing = true;
    showErrorNotification(error);
    [...robotDiv.children].forEach(pixel => {
        if (pixel.style.backgroundColor === 'rgb(34, 32, 53)') {
            pixel.style.backgroundColor = 'rgb(131, 31, 31)';
        }
    });

    let opacity = 0.05;
    let range = -0.05;

    const loop = setInterval(() => {
        body.style.setProperty(
            "--scanline-bg",
            `repeating-linear-gradient(
        to bottom,
        rgba(255, 0, 0, ${opacity}) 0px,
        rgba(255, 0, 0, ${opacity}) 1px,
        transparent 1px,
        transparent 3px
    )`
        );

        opacity += range;

        if (opacity <= 0.1) range = 0.05;
        if (opacity >= 0.8) range = -0.05;
    }, 70);

    setTimeout(() => {
        clearInterval(loop);

        body.style.setProperty("--scanline-bg", `
    repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.025) 0px,
        rgba(255, 255, 255, 0.025) 1px,
        transparent 1px,
        transparent 3px
    )

    
`   );
        [...robotDiv.children].forEach(pixel => {
            if (pixel.style.backgroundColor === 'rgb(131, 31, 31)') {
                pixel.style.backgroundColor = 'rgb(34, 32, 53)';
            }
        });
    }, 4000);
}

export function showErrorNotification(error = '') {
    const errorNotification = document.querySelector('.error-notification');
    const title = errorNotification.querySelector('h2');

    if (error === '') {
        error = 'Error: invalid user information';
    }

    title.textContent = error;

    errorNotification.classList.add('show');

    setTimeout(() => {
        errorNotification.classList.remove('show');
    }, 4000);
}