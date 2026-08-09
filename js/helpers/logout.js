import { eraseCookie } from "./cookies.js";

const btn = document.querySelector('.logout-btn');
if (btn) {
    btn.addEventListener('click', () => {
        eraseCookie('token', '/');
        window.location.href = '/login/';
    });
}
