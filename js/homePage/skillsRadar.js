const SVG_NS = "http://www.w3.org/2000/svg";
const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = 108;
const RINGS = 5;
const LABEL_OFFSET = 26;

const dom = {
    svg: document.getElementById("skillsRadarSvg"),
    grid: document.getElementById("skillsRadarGrid"),
    axes: document.getElementById("skillsRadarAxes"),
    shape: document.getElementById("skillsRadarShape"),
    dots: document.getElementById("skillsRadarDots"),
    labels: document.getElementById("skillsRadarLabels"),
    empty: document.getElementById("skillsRadarEmpty"),
};

function formatSkillName(type) {
    const raw = type.replace(/^skill_/, "");
    return raw
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

const TOP_SKILLS_COUNT = 6;

function extractSkills(transactions) {
    const seen = new Map();
    for (const t of transactions || []) {
        if (seen.has(t.type)) continue;
        seen.set(t.type, {
            key: t.type,
            label: formatSkillName(t.type),
            amount: t.amount || 0,
        });
    }
    return Array.from(seen.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, TOP_SKILLS_COUNT)
        .sort((a, b) => a.label.localeCompare(b.label));
}

function pointOnCircle(angle, radius) {
    return {
        x: CENTER + radius * Math.cos(angle),
        y: CENTER + radius * Math.sin(angle),
    };
}

function makeEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
    return el;
}

function angleFor(index, count) {
    return (Math.PI * 2 * index) / count - Math.PI / 2;
}

function renderGrid(count) {
    dom.grid.innerHTML = "";
    for (let ring = 1; ring <= RINGS; ring++) {
        const r = (RADIUS / RINGS) * ring;
        const points = [];
        for (let i = 0; i < count; i++) {
            const p = pointOnCircle(angleFor(i, count), r);
            points.push(`${p.x},${p.y}`);
        }
        dom.grid.appendChild(
            makeEl("polygon", {
                points: points.join(" "),
                class: "skills-radar-ring",
            })
        );
    }
}

function renderAxesAndLabels(skills) {
    dom.axes.innerHTML = "";
    dom.labels.innerHTML = "";

    skills.forEach((skill, i) => {
        const angle = angleFor(i, skills.length);
        const outer = pointOnCircle(angle, RADIUS);

        dom.axes.appendChild(
            makeEl("line", {
                x1: CENTER,
                y1: CENTER,
                x2: outer.x,
                y2: outer.y,
                class: "skills-radar-axis",
            })
        );

        const labelPoint = pointOnCircle(angle, RADIUS + LABEL_OFFSET);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const anchor = Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";
        const baseline = Math.abs(sin) < 0.25 ? "middle" : sin > 0 ? "hanging" : "auto";

        const label = makeEl("text", {
            x: labelPoint.x,
            y: labelPoint.y,
            class: "skills-radar-label",
            "text-anchor": anchor,
            "dominant-baseline": baseline,
        });
        label.textContent = skill.label.toUpperCase();
        dom.labels.appendChild(label);
    });
}

function renderShape(skills, maxValue) {
    const points = skills.map((skill, i) => {
        const angle = angleFor(i, skills.length);
        const r = maxValue === 0 ? 0 : (skill.amount / maxValue) * RADIUS;
        return pointOnCircle(angle, r);
    });

    dom.shape.setAttribute("points", points.map((p) => `${p.x},${p.y}`).join(" "));

    dom.dots.innerHTML = "";
    points.forEach((p) => {
        dom.dots.appendChild(
            makeEl("circle", {
                cx: p.x,
                cy: p.y,
                r: 3,
                class: "skills-radar-point",
            })
        );
    });
}

export function renderSkillsRadar(data) {
    if (!dom.svg) return;

    const skills = extractSkills(data && data.skillTransactions);

    if (!skills.length) {
        dom.svg.classList.add("hidden");
        dom.empty.classList.add("visible");
        return;
    }

    dom.svg.classList.remove("hidden");
    dom.empty.classList.remove("visible");

    const maxAmount = Math.max(100, ...skills.map((s) => s.amount));
    renderGrid(skills.length);
    renderAxesAndLabels(skills);
    renderShape(skills, maxAmount);
}