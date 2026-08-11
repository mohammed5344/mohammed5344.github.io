export const PISCINE_CONFIG = {
    go: {
        key: 'go',
        label: 'GO PISCINE',
        pathMatch: ['bh-piscine', 'piscine-go', 'go-piscine'],
        buttonLabel: 'GO',
    },
    js: {
        key: 'js',
        label: 'JS PISCINE',
        pathMatch: ['piscine-js', 'js-piscine'],
        buttonLabel: 'JS',
    },
    rust: {
        key: 'rust',
        label: 'RUST PISCINE',
        pathMatch: ['piscine-rust', 'rust-piscine'],
        buttonLabel: 'RUST',
    },
};

export const MODULE_MODE = {
    key: 'module',
    label: 'PROJECT XP',
    buttonLabel: 'MODULE',
};

export const PERIOD_CONFIG = {
    start: { key: 'start', label: 'SINCE START', months: null },
    '1m': { key: '1m', label: '1 MONTH', months: 1 },
    '3m': { key: '3m', label: '3 MONTHS', months: 3 },
    '6m': { key: '6m', label: '6 MONTHS', months: 6 },
    '12m': { key: '12m', label: '12 MONTHS', months: 12 },
};

function getPathsForExercise(exercise) {
    if (!exercise || !exercise.object || !Array.isArray(exercise.object.paths)) {
        return [];
    }
    return exercise.object.paths
        .map((p) => (p && typeof p.path === 'string' ? p.path : ''))
        .filter(Boolean);
}

export function detectPiscine(exercise) {
    const paths = getPathsForExercise(exercise);
    if (paths.length === 0) {
        return null;
    }
    for (const rawPath of paths) {
        const path = rawPath.toLowerCase();
        for (const key of Object.keys(PISCINE_CONFIG)) {
            const matchers = PISCINE_CONFIG[key].pathMatch;
            const patterns = Array.isArray(matchers) ? matchers : [matchers];
            if (patterns.some((pattern) => path.includes(pattern.toLowerCase()))) {
                return key;
            }
        }
    }
    return null;
}

export function filterPiscineTransactions(exerciseTransactions, piscineKey) {
    if (!Array.isArray(exerciseTransactions)) {
        return [];
    }
    const config = PISCINE_CONFIG[piscineKey];
    if (!config) {
        return [];
    }

    const seen = new Set();
    const result = [];

    for (const tx of exerciseTransactions) {
        if (!tx || tx.object?.type !== 'exercise') {
            continue;
        }
        if (typeof tx.amount !== 'number' || !tx.createdAt) {
            continue;
        }
        if (detectPiscine(tx) !== piscineKey) {
            continue;
        }
        const dedupeKey = `${tx.createdAt}-${tx.amount}-${tx.object?.name || ''}`;
        if (seen.has(dedupeKey)) {
            continue;
        }
        seen.add(dedupeKey);
        result.push(tx);
    }

    return result;
}

export function filterByPeriod(transactions, periodKey) {
    const period = PERIOD_CONFIG[periodKey] || PERIOD_CONFIG.start;
    if (!period.months) {
        return transactions;
    }
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - period.months);
    return transactions.filter((tx) => {
        const date = new Date(tx.createdAt);
        return !Number.isNaN(date.getTime()) && date >= cutoff;
    });
}

export function buildXpProgression(transactions) {
    const valid = transactions.filter(
        (tx) =>
            tx &&
            typeof tx.amount === 'number' &&
            tx.createdAt &&
            !Number.isNaN(new Date(tx.createdAt).getTime())
    );
    
    const sorted = [...valid].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let cumulative = 0;
    const points = [];
    
    for (const tx of sorted) {
        cumulative += tx.amount;
        points.push({
            date: new Date(tx.createdAt),
            gain: tx.amount,
            total: cumulative,
            name: tx.object?.name || '',
        });
    }

    return points;
}

export function computeStats(points) {
    if (!points || points.length === 0) {
        return { total: 0, count: 0, average: 0 };
    }
    const total = points[points.length - 1].total;
    const count = points.length;
    const average = total / count;
    return { total, count, average };
}
