import { getCookie } from "../helpers/cookies.js";
import { renderAvatar } from "../helpers/avatar.js";

const ATTR_CANDIDATES = {
    degree: ['degree'],
    gender: ['gender', 'genders', 'sex'],
    phoneNumber: ['phonenumber', 'phone', 'tel', 'mobile'],
    dateOfBirth: ['dateofbirth', 'dob', 'birthdate'],
    emergencyTel: ['emergencytel', 'emergencynumber', 'emergencyphone', 'emergencycontact'],
};

function getAttrValue(attrs, candidates) {
    if (!attrs) return null;
    for (const key of Object.keys(attrs)) {
        for (const candidate of candidates) {
            if (key.toLowerCase() === candidate.toLowerCase()) {
                const value = attrs[key];
                if (value === null || value === undefined || value === '') return null;
                return value;
            }
        }
    }
    return null;
}

function formatDate(value) {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value === null || value === undefined || value === '' ? 'N/A' : value;
}

async function fetchUser(token) {
    const resp = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                {
                    user {
                        id
                        login
                        email
                        attrs
                        firstName
                        lastName
                        createdAt
                    }
                }
            `,
        }),
    });

    if (!resp.ok) {
        throw new Error(`request failed with status ${resp.status}`);
    }

    const { data, errors } = await resp.json();
    if (errors) {
        throw new Error('graphql error');
    }

    const user = Array.isArray(data.user) ? data.user[0] : data.user;
    if (!user) {
        throw new Error('no user data');
    }
    return user;
}

function renderUser(user) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A';

    setText('profileFullName', fullName);
    setText('profileLogin', user.login ? `@${user.login}` : 'N/A');
    setText('profileId', user.id);
    setText('profileEmail', user.email);
    setText('profileJoined', formatDate(user.createdAt));

    const attrs = user.attrs || {};
    setText('profileDegree', getAttrValue(attrs, ATTR_CANDIDATES.degree));
    setText('profileGender', getAttrValue(attrs, ATTR_CANDIDATES.gender));
    setText('profilePhone', getAttrValue(attrs, ATTR_CANDIDATES.phoneNumber));
    setText('profileDob', formatDate(getAttrValue(attrs, ATTR_CANDIDATES.dateOfBirth)));
    setText('profileEmergencyTel', getAttrValue(attrs, ATTR_CANDIDATES.emergencyTel));

    const avatarCanvas = document.getElementById('profileAvatar');
    renderAvatar(avatarCanvas, user.login || user.id || 'user');
}

async function init() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    try {
        const user = await fetchUser(token);
        renderUser(user);
    } catch (err) {
        console.error(err);
        const errorEl = document.getElementById('profileError');
        if (errorEl) errorEl.classList.add('visible');
    }
}

init();
