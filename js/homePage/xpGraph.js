import { fetchPiscineTransactions } from "./xpGraphQuery.js";
import { fetchModuleTransactions } from "./moduleQuery.js";
import {
    PISCINE_CONFIG,
    MODULE_MODE,
    filterPiscineTransactions,
    filterByPeriod,
    buildXpProgression,
    computeStats,
} from "./xpGraphData.js";
import { XP_LOGOS } from "./xpGraphLogos.js";

const VIEW_WIDTH = 760;
const VIEW_HEIGHT = 300;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PLOT_WIDTH = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_HEIGHT = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;

const dom = {
    wrapper: document.getElementById('graphModule'),
    root: document.getElementById('xpGraph'),
    logo: document.getElementById('xpGraphLogo'),
    sub: document.getElementById('xpGraphSub'),
    statusDot: document.getElementById('xpStatusDot'),
    statusText: document.getElementById('xpStatusText'),
    modeSelector: document.getElementById('xpModeSelector'),
    periodSelector: document.getElementById('xpPeriodSelector'),
    totalValue: document.getElementById('xpTotalValue'),
    countValue: document.getElementById('xpCountValue'),
    avgValue: document.getElementById('xpAvgValue'),
    body: document.getElementById('xpGraphBody'),
    svg: document.getElementById('xpGraphSvg'),
    gridLines: document.getElementById('xpGridLines'),
    areaPath: document.getElementById('xpAreaPath'),
    linePath: document.getElementById('xpLinePath'),
    hoverGroup: document.getElementById('xpHoverGroup'),
    hoverLine: document.getElementById('xpHoverLine'),
    hoverDot: document.getElementById('xpHoverDot'),
    hoverCapture: document.getElementById('xpHoverCapture'),
    tooltip: document.getElementById('xpGraphTooltip'),
    tooltipDate: document.getElementById('xpTooltipDate'),
    tooltipGain: document.getElementById('xpTooltipGain'),
    tooltipTotal: document.getElementById('xpTooltipTotal'),
    empty: document.getElementById('xpGraphEmpty'),
    loading: document.getElementById('xpGraphLoading'),
    error: document.getElementById('xpGraphError'),
    errorMessage: document.getElementById('xpErrorMessage'),
};

const state = {
    mode: 'js',
    period: 'start',
    rawExerciseTransactions: [],
    rawModuleTransactions: [],
    currentPoints: [],
    hasFetched: false,
    isLoading: false,
    isError: false,
};

function formatXp(amount) {
    const value = (amount || 0) / 1000;
    return `${value.toFixed(2)} KB`;
}

function formatDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '--';
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function setStatus(text) {
    if (dom.statusText) {
        dom.statusText.textContent = text;
    }
}

function setPanelState(panelState) {
    const panels = [dom.empty, dom.loading, dom.error];
    panels.forEach((panel) => panel && panel.classList.remove('visible'));

    if (dom.svg) {
        dom.svg.style.opacity = panelState === 'chart' ? '1' : '0';
    }
    if (dom.tooltip) {
        dom.tooltip.classList.remove('visible');
    }

    if (panelState === 'empty' && dom.empty) {
        dom.empty.classList.add('visible');
    } else if (panelState === 'loading' && dom.loading) {
        dom.loading.classList.add('visible');
    } else if (panelState === 'error' && dom.error) {
        dom.error.classList.add('visible');
    }
}

function applyTheme(modeKey) {
    if (!dom.root) return;
    
    const themeTarget = dom.wrapper || dom.root;
    themeTarget.setAttribute('data-theme', modeKey);
    
    const config = PISCINE_CONFIG[modeKey] || (modeKey === MODULE_MODE.key ? MODULE_MODE : null);
    if (dom.sub && config) {
        dom.sub.textContent = config.label;
    }
    if (dom.logo && XP_LOGOS[modeKey]) {
        dom.logo.innerHTML = XP_LOGOS[modeKey];
    }

    if (dom.modeSelector) {
        dom.modeSelector.querySelectorAll('.xp-mode-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.mode === modeKey);
        });
    }

    applyPeriodAvailability(modeKey);
}

// this function apply visibility for the buttons (because there is options only for module)...
function applyPeriodAvailability(modeKey) {
    if (!dom.periodSelector) return;
    const isModule = modeKey === MODULE_MODE.key;
    dom.periodSelector.querySelectorAll('.xp-period-btn').forEach((btn) => {
        btn.classList.toggle('hidden', !isModule && btn.dataset.period !== 'start');
    });
}

// this function control which key is selected (in styling)
function applyActivePeriod(periodKey) {
    if (!dom.periodSelector) return;
    dom.periodSelector.querySelectorAll('.xp-period-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.period === periodKey);
    });
}

function buildGridLines() {
    if (!dom.gridLines) return;
    dom.gridLines.innerHTML = '';
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const y = PAD_TOP + (PLOT_HEIGHT / steps) * i;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(PAD_LEFT));
        line.setAttribute('x2', String(VIEW_WIDTH - PAD_RIGHT));
        line.setAttribute('y1', String(y));
        line.setAttribute('y2', String(y));
        line.setAttribute('class', 'xp-grid-line');
        dom.gridLines.appendChild(line);
    }
}

function computeScales(points) {
    const first = points[0];
    const last = points[points.length - 1];
    const minTime = first.date.getTime();
    const maxTime = last.date.getTime();
    const maxTotal = Math.max(last.total, 1);

    return {
        xFor(date) {
            if (maxTime === minTime) {
                return PAD_LEFT + PLOT_WIDTH / 2;
            }
            const t = (date.getTime() - minTime) / (maxTime - minTime);
            return PAD_LEFT + t * PLOT_WIDTH;
        },
        yFor(total) {
            const t = total / maxTotal;
            return PAD_TOP + PLOT_HEIGHT - t * PLOT_HEIGHT;
        },
    };
}

function renderChart(points) {
    buildGridLines();
    
    const plotPoints = [{ date: points[0].date, total: 0, gain: 0, synthetic: true }, ...points];
    const scales = computeScales(points);
    
    let lineD = '';
    plotPoints.forEach((point, index) => {
        const x = scales.xFor(point.date);
        const y = scales.yFor(point.total);
        lineD += `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)} `;
    });

    const lastX = scales.xFor(plotPoints[plotPoints.length - 1].date);
    const firstX = scales.xFor(plotPoints[0].date);
    const baseline = VIEW_HEIGHT - PAD_BOTTOM;
    const areaD = `${lineD}L ${lastX.toFixed(2)},${baseline} L ${firstX.toFixed(2)},${baseline} Z`;

    dom.linePath.setAttribute('d', lineD.trim());
    dom.areaPath.setAttribute('d', areaD);

    state.currentPoints = points;
    state.currentScales = scales;

    setPanelState('chart');
}

function hideHover() {
    if (dom.hoverGroup) dom.hoverGroup.classList.remove('visible');
    if (dom.tooltip) dom.tooltip.classList.remove('visible');
}

function findNearestPoint(viewX) {
    const points = state.currentPoints;
    const scales = state.currentScales;
    if (!points || points.length === 0 || !scales) return null;

    let closest = points[0];
    let closestDist = Math.abs(scales.xFor(points[0].date) - viewX);

    for (let i = 1; i < points.length; i++) {
        const dist = Math.abs(scales.xFor(points[i].date) - viewX);
        if (dist < closestDist) {
            closest = points[i];
            closestDist = dist;
        }
    }
    return closest;
}


function handlePointerMove(evt) {
    if (!state.currentPoints || state.currentPoints.length === 0) return;
    const rect = dom.svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;

    // I don't understand this part very well but it just means we are converting the position we get
    // to the svg position
    const viewX = ((clientX - rect.left) / rect.width) * VIEW_WIDTH;
    const point = findNearestPoint(viewX);
    if (!point) return;

    const x = state.currentScales.xFor(point.date);
    const y = state.currentScales.yFor(point.total);
    
    dom.hoverLine.setAttribute('x1', String(x));
    dom.hoverLine.setAttribute('x2', String(x));

    dom.hoverDot.setAttribute('cx', String(x));
    dom.hoverDot.setAttribute('cy', String(y));

    dom.hoverGroup.classList.add('visible');

    dom.tooltipDate.textContent = formatDate(point.date);
    dom.tooltipGain.textContent = `+${formatXp(point.gain)}`;
    dom.tooltipTotal.textContent = `TOTAL ${formatXp(point.total)}`;

    const leftPct = (x / VIEW_WIDTH) * 100;
    const topPct = (y / VIEW_HEIGHT) * 100;
    dom.tooltip.style.left = `${leftPct}%`;
    dom.tooltip.style.top = `${topPct}%`;
    dom.tooltip.classList.add('visible');

    const bodyRect = dom.body.getBoundingClientRect();
    const tooltipRect = dom.tooltip.getBoundingClientRect();
    if (tooltipRect.right > bodyRect.right) {
        dom.tooltip.style.transform = 'translate(-100%, -110%)';
    } else if (leftPct < 12) {
        dom.tooltip.style.transform = 'translate(0%, -110%)';
    } else {
        dom.tooltip.style.transform = 'translate(-50%, -110%)';
    }
}

// its so clear no need to explain bro
function attachHoverEvents() {
    if (!dom.hoverCapture) return;
    dom.hoverCapture.addEventListener('pointermove', handlePointerMove);
    dom.hoverCapture.addEventListener('pointerleave', hideHover);
    dom.hoverCapture.addEventListener('pointerdown', handlePointerMove);
}

function recalculateAndRender(options = {}) {
    if (state.isLoading) {
        setPanelState('loading');
        return;
    }
    if (state.isError) {
        setPanelState('error');
        return;
    }

    const isModule = state.mode === MODULE_MODE.key;
    const sourceTransactions = isModule
        ? state.rawModuleTransactions
        : filterPiscineTransactions(state.rawExerciseTransactions, state.mode);

    let periodTransactions = filterByPeriod(sourceTransactions, state.period);
    let points = buildXpProgression(periodTransactions);

    
    if (points.length === 0 && state.period !== 'start' && sourceTransactions.length > 0 && !options.skipFallback) {
        state.period = 'start';
        applyActivePeriod('start');
        periodTransactions = filterByPeriod(sourceTransactions, state.period);
        points = buildXpProgression(periodTransactions);
    }

    const stats = computeStats(points);

    dom.totalValue.textContent = formatXp(stats.total);
    dom.countValue.textContent = String(stats.count);
    dom.avgValue.textContent = formatXp(stats.average);

    if (points.length === 0) {
        state.currentPoints = [];
        setPanelState('empty');
        return;
    }

    renderChart(points);
}

function setMode(modeKey) {
    const isValidMode = Boolean(PISCINE_CONFIG[modeKey]) || modeKey === MODULE_MODE.key;
    if (!isValidMode || modeKey === state.mode) {
        applyActivePeriod(state.period);
        return;
    }
    state.mode = modeKey;
    if (modeKey !== MODULE_MODE.key) {
        state.period = 'start';
    }
    applyTheme(modeKey);
    applyActivePeriod(state.period);
    hideHover();
    recalculateAndRender();
}

function setPeriod(periodKey) {
    if (periodKey === state.period) return;
    if (state.mode !== MODULE_MODE.key && periodKey !== 'start') return;
    state.period = periodKey;
    applyActivePeriod(periodKey);
    hideHover();
    recalculateAndRender();
}

// this function add event listeners for the buttons in the graph
function attachControlEvents() {
    if (dom.modeSelector) {
        dom.modeSelector.addEventListener('click', (evt) => {
            const btn = evt.target.closest('.xp-mode-btn');
            if (!btn) return;
            setMode(btn.dataset.mode);
        });
    }

    if (dom.periodSelector) {
        dom.periodSelector.addEventListener('click', (evt) => {
            const btn = evt.target.closest('.xp-period-btn');
            if (!btn) return;
            setPeriod(btn.dataset.period);
        });
    }

    if (dom.error) {
        dom.error.addEventListener('click', () => {
            loadData();
        });
    }
}

async function loadData() {
    state.isLoading = true;
    state.isError = false;
    setStatus('LOADING');
    setPanelState('loading');

    try {        
        const exerciseTransactions = await fetchPiscineTransactions();
        const moduleTransactions = await fetchModuleTransactions();

        state.rawExerciseTransactions = Array.isArray(exerciseTransactions) ? exerciseTransactions : [];
        state.rawModuleTransactions = Array.isArray(moduleTransactions) ? moduleTransactions : [];

        state.isLoading = false;
        state.hasFetched = true;
        setStatus('ONLINE');
        recalculateAndRender();
    } catch (err) {
        console.error(err);
        state.isLoading = false;
        state.isError = true;
        setStatus('ERROR');
        if (dom.errorMessage) {
            dom.errorMessage.textContent = 'Could not load XP data. Tap to retry.';
        }
        setPanelState('error');
    }
}

export function initXpGraph() {
    if (!dom.root) {
        return;
    }

    applyTheme(state.mode);
    applyActivePeriod(state.period);
    attachControlEvents();
    attachHoverEvents();
    loadData();
}
