import { getCookie, writeCookie } from "../helpers/cookies.js";
import { errorGlowing } from "./error-login.js";

const loginForm = document.getElementById('login-form');
const identifierInput = document.getElementById('identifier');
const passwordInput = document.getElementById('password');

export function init() {
    let validUser;
    checkRegistration().then(result => {
        validUser = result;
        if (validUser) {
            window.location.href = "/home/";
        }
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const credentials = btoa(`${identifierInput.value}:${passwordInput.value}`);
        const resp = await fetch("https://learn.reboot01.com/api/auth/signin", {
            method: "POST",
            headers: {
                Authorization: `Basic ${credentials}`
            },
        });

        let token = await resp.text();
        token = token.replace(/^"|"$/g, "");
        if (token.indexOf("error") != -1) {
            errorGlowing();
            return;
        }

        writeCookie("token", token, "1", "/");
        window.location.pathname = '/home/';
    });
}

async function checkRegistration() {
    const token = getCookie("token");
    if (!token) {
        return false;
    }

    try {
        const resp = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
          query {
            user {
              email
            }
          }
        `,
            }),
        });

        if (!resp.ok) {
            return false;
        }

        const data = await resp.json();

        if (data.errors) {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
}

init();

