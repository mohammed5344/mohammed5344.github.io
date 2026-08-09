import { getCookie } from "../helpers/cookies.js";

async function init() {
    const token = getCookie("token");
    if (!token) {
        console.error("Could not read token");
        return;
    }

    try {
        const resp = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query {
                    transaction {
                        type
                        amount
                        objectId
                        object {
                        type
                            name
                        }
                        createdAt
                    }
                }
                `
            })
        });

        const { data, errors } = await resp.json();

        if (errors) {
            console.error(errors);
            return;
        }

        makeTransaction(data)
        setupInteractiveTerminals();

    } catch (err) {
        console.error(err);
    }
}

function makeTransaction(data) {
    let totalXP = 0;
    let level = -1;
    let successCount = 0;
    let failCount = 0;
    const screen = document.querySelector('.screen-content');

    data.transaction.reverse().forEach(transaction => {
        if (transaction.type == 'level' && level == -1) {
            level = transaction.amount;
            return;
        }
        
        if (
            transaction.type !== "xp" ||
            (transaction.object.type !== "project" &&
                transaction.object.type !== "piscine")
        ) {
            return;
        }

        const card = document.createElement("div");
        card.classList.add("card");

        if (transaction.amount < 0) {
            card.classList.add("negative");
            failCount++;
        } else {
            successCount++;
        }
        totalXP += transaction.amount;

        const title = document.createElement("h3");
        title.textContent = transaction.object.name;

        const xp = document.createElement("p");
        xp.textContent = `XP: ${(transaction.amount / 1000).toFixed(2)} KB`;

        const id = document.createElement("p");
        id.textContent = `Object ID: ${transaction.objectId}`;

        const date = document.createElement("p");
        date.textContent = new Date(transaction.createdAt).toLocaleDateString();

        card.append(title, xp, id, date);
        screen.appendChild(card);
    });

    document.querySelector(".xp-terminal .terminal-screen h3").textContent =
        `${Math.round(((totalXP / 1000).toFixed(2))).toLocaleString()} KB`;

    document.querySelector(".level-terminal .terminal-screen h3").textContent =
        level;

    document.querySelector(".success-terminal .terminal-screen h3").textContent =
        successCount;

    document.querySelector(".fail-terminal .terminal-screen h3").textContent =
        failCount;
}

function setupInteractiveTerminals() {
    const terminals = document.querySelectorAll(".terminal");

    terminals.forEach(terminal => {
        terminal.addEventListener("click", () => {
            terminals.forEach(t => {
                if (t !== terminal) t.classList.remove("active");
            });
            terminal.classList.toggle("active");
        });
    });
}

init();