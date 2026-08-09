const codeSnippets = [
    'const x = 42;',
    'let user = null;',
    'function login() {}',
    'if (err) throw err;',
    'query { user { id } }',
    'mutation Login {}',
    'type Query {',
    'resolver: (root) =>',
    '<div class="app">',
    '<script src="main.js">',
    '</html>',
    '<body>',
    'func main() {',
    'package main',
    'import "net/http"',
    'go func() {',
    'router.HandleFunc()',
    'db.Query(ctx, sql)',
    'w.Write([]byte)',
    'json.Marshal(v)',
    'return &User{}',
    'fmt.Println("ok")',
    'defer conn.Close()',
    'select { case }',
    'export default App',
    'async function fetchUser()',
    'await res.json();',
    'addEventListener("click")',
    'document.querySelector()',
    'new WebSocket(url)',
    '{ token: null }',
    'localStorage.setItem()',
    '<input type="text">',
    '<form action="/api">',
    'const app = express();',
    'app.listen(8080)',
];

const floatingLayer = document.getElementById('floatingCodeLayer');
const floatingItems = [];
const ITEM_COUNT = 22;

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createFloatingItem() {
    const el = document.createElement('div');
    el.className = 'floating-code-item';
    el.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];

    const width = window.innerWidth;
    const height = window.innerHeight;

    const item = {
        el,
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.35, 0.35),
        vy: randomBetween(-0.35, 0.35),
        opacity: randomBetween(0.5, 0.8),
        rotation: randomBetween(-15, 15),
        scale: randomBetween(0.85, 1.3),
    };

    el.style.opacity = item.opacity;
    floatingLayer.appendChild(el);
    floatingItems.push(item);
}

function updateFloatingItems() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    floatingItems.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;

        if (item.x < -150 || item.x > width + 150) {
            item.vx *= -1;
            item.x = Math.max(-150, Math.min(width + 150, item.x));
        }
        if (item.y < -50 || item.y > height + 50) {
            item.vy *= -1;
            item.y = Math.max(-50, Math.min(height + 50, item.y));
        }

        item.el.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scale(${item.scale})`;
    });

    requestAnimationFrame(updateFloatingItems);
}

function initFloatingCode() {
    for (let i = 0; i < ITEM_COUNT; i++) {
        createFloatingItem();
    }
    requestAnimationFrame(updateFloatingItems);
}

initFloatingCode();
