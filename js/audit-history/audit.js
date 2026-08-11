import { getCookie } from "../helpers/cookies.js";

async function getData() {
    const token = getCookie("token");

    if (!token) {
        console.error("could not read token");
        return [];
    }
    const username = await window.sessionStorage.username;
    try {
        const resp = await fetch(
            "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        query {
                            audit(
                                where: {
                                    auditor: {
                                        login: { _eq: "${username}" }
                                    },
                                    grade: {
                _is_null: false
            }
                                }
                                order_by: {
                                    updatedAt: desc
                                }
                            ) {
                                grade
                                attrs
                                auditor {
                                    login
                                }
                                group {
                                    captain {
                                        login
                                    }
                                    object {
                                        name
                                    }
                                }
                                updatedAt
                            }
                                
                        }
                    `,
                }),
            }
        );

        const { data, errors } = await resp.json();

        if (errors) {
            console.error(errors);
            return [];
        }
        
        return data.audit.map(audit => ({
            project: audit.group?.object?.name ?? "Unknown project",
            status: audit.grade >= 1 ? "pass" : "fail",
            result: audit.attrs ?? "",
            date: audit.updatedAt,
            auditor: audit.auditor?.login ?? "",
            captain: audit.group.captain?.login ?? "",
        }));

    } catch (err) {
        console.error(err);
        return [];
    }
}

function buildPinsRow(count, extraClass) {
    const row = document.createElement('div');
    row.className = 'ssd-pins' + (extraClass ? ' ' + extraClass : '');
    for (let i = 0; i < count; i++) {
        const pin = document.createElement('div');
        pin.className = 'ssd-pin';
        row.appendChild(pin);
    }
    return row;
}

function buildBars() {
    const bars = document.createElement('div');
    bars.className = 'ssd-bars';
    const heights = [70, 95, 55, 82, 60];
    heights.forEach(h => {
        const bar = document.createElement('div');
        bar.className = 'ssd-bar';
        bar.style.height = h + '%';
        bars.appendChild(bar);
    });
    return bars;
}

function buildCard(audit) {
    const card = document.createElement('div');
    card.className = 'ssd-card ' + audit.status;

    const pinsTop = buildPinsRow(7);

    const body = document.createElement('div');
    body.className = 'ssd-body';

    const panel = document.createElement('div');
    panel.className = 'ssd-panel';

    const led = document.createElement('div');
    led.className = 'ssd-led';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'ssd-eyebrow';
    eyebrow.textContent = 'Project';

    const project = document.createElement('div');
    project.className = 'ssd-project';
    project.textContent = audit.project;

    const divider = document.createElement('div');
    divider.className = 'ssd-divider';

    const metaRow = document.createElement('div');
    metaRow.className = 'ssd-meta-row';

    const owner = document.createElement('div');
    owner.className = 'ssd-owner';
    const ownerDot = document.createElement('span');
    ownerDot.className = 'ssd-owner-dot';
    const ownerText = document.createElement('span');
    ownerText.textContent = audit.captain || audit.auditor;
    owner.appendChild(ownerDot);
    owner.appendChild(ownerText);

    const status = document.createElement('div');
    status.className = 'ssd-status ' + audit.status;
    status.textContent = audit.status === 'pass' ? 'PASS' : 'FAIL';

    metaRow.appendChild(owner);
    metaRow.appendChild(status);

    const date = document.createElement('p');
    date.className = 'ssd-date';

    const auditDate = new Date(audit.date);

    date.textContent = auditDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    panel.appendChild(buildBars());
    panel.appendChild(led);
    panel.appendChild(eyebrow);
    panel.appendChild(project);
    panel.appendChild(divider);
    panel.appendChild(metaRow);
    panel.appendChild(date);

    body.appendChild(panel);

    const pinsBottom = buildPinsRow(7, 'bottom');

    card.appendChild(pinsTop);
    card.appendChild(body);
    card.appendChild(pinsBottom);

    return card;
}

function renderGrid(list) {
    const grid = document.getElementById('ssdGrid');
    grid.innerHTML = '';
    list.forEach(a => grid.appendChild(buildCard(a)));
}

async function initAudit() {
    const data = await getData();
    renderGrid(data);
}

initAudit();