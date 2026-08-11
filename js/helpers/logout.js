import { eraseCookie } from "./cookies.js";


/*
    simply just delete the token for logging out
*/
const btn = document.querySelector('.logout-btn');
if (btn) {
    btn.addEventListener('click', () => {
        eraseCookie('token', '/');
        window.location.href = '/login/';
    });
}
