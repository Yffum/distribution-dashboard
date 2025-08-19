import * as Pokemon from './pokemon.js';

const ctx = document.getElementById('cdfChart').getContext('2d');

const chartTopPadding = 150;

// Static page content based on theme
export const pageContent = {
    "title": "Geometric CDF Visualizer",
    "description": "Visualizing the probability of success over repeated Bernoulli trials."
};

let chartTitle = 'Geometric CDF';
let chartSubtitle = '';



function getCssColor(varName) {
    return getComputedStyle(document.documentElement)
           .getPropertyValue(varName).trim();
}

const COLORS = {
    primary: getCssColor('--color-primary'),
    secondary: getCssColor('--color-secondary'),
    accentGreen: getCssColor('--color-accent-green'),
    accentRed: getCssColor('--color-accent-red'),
    bgCard: getCssColor('--color-bg-card'),
    bgGreen: getCssColor('--color-bg-green'),
    bgRed: getCssColor('--color-bg-red'),
    textMain: getCssColor('--color-text-main'),
    textMuted: getCssColor('--color-text-muted'),
    vUnlikely: getCssColor('--color-v-unlikely'),
    unlikely: getCssColor('--color-unlikely'),
    even: getCssColor('--color-even'),
    likely: getCssColor('--color-likely'),
    vLikely: getCssColor('--color-v-likely'),
    certain: getCssColor('--color-certain')
};

function geometricCDF(p, nMax) {
    const cdf = [];
    for (let n = 1; n <= nMax; n++) {
        cdf.push(1 - Math.pow(1 - p, n));
    }
    return cdf;
}

function computeMaxN(p, threshold=0.99) {
    // Returns the first value at which the function evaluates to .99
    return Math.ceil(Math.log(1 - threshold) / Math.log(1 - p));
}

export function updateParametersDefault() {
    console.log('updateParametersNone');
    let p = parseFloat(pInput.value);
    let title = `Geometric CDF for p=${p}`;
    // If p is valid, add subtitle
    if (!isNaN(p) && p > 0) {
        const mean = Math.round(1 / p); // round to 2 decimals
        let subtitle = `Expected Number of Attempts: ${mean.toLocaleString()}`
        updateChartLabels(title, subtitle);
        return;
    }
    // If p is not valid just add title
    updateChartLabels(title, chartSubtitle);
    updateChart();
}

export function updateChartLabels(title, subtitle) {
    console.log('updateChartLabels');
    chartTitle = title;
    if (subtitle) {
        chartSubtitle = subtitle;
    }
}

// Get p from pInput and plot chart
export function updateChart() {
    // Get p input
    let p = parseFloat(pInput.value);

    // Clamp p to allowed range
    if (p != 0) {
        p = Math.max(0.0001, Math.min(p, 0.1));
        if (parseFloat(pInput.value) != p) {
            pInput.value = p;
        }
    }

    // Set max n to first value at which cdf >= 99%
    const nMax = computeMaxN(p);

    // Calculate data
    const labels = Array.from({length: nMax}, (_, i) => i + 1);
    const data = geometricCDF(p, nMax);

    // Set min to first value at which cdf >= 5%
    let minX = 1;
    for (let i = 0; i < data.length; i++) {
        if (data[i] < 0.05) minX = labels[i];
        else break;
    }

    // Set chart
    cdfChart.options.scales.x.min = minX;
    cdfChart.data.labels = labels;
    cdfChart.data.datasets[0].data = data;
    cdfChart.update();
}

// Adapts interface for mobile/desktop based on window width
function updateInterfaceScale() {
    const container = document.getElementById('chartContainer');
    const isMobile = window.innerWidth <= 750;

    // Shrink content by scale, and then stretch container by widthScale
    const scale = 0.5;
    const widthScale = 2.2;
    if (isMobile) {
        const offset = ((widthScale - 1) * 50) / (scale * widthScale);
        container.style.transform = `scale(${scale}) translateX(-${offset}%)`;
        container.style.width = `${widthScale*100}%`
    } else {
        container.style.transform = 'scale(1)';
        container.style.width = '100%';
    }
}

const topLeftTitlePlugin = {
    id: 'topLeftTitle',
    beforeDraw(chart) {
        const { ctx } = chart;
        const p = parseFloat(pInput.value);
        const titlePadding = 25;
        const subtitleSpacing = 35;

        ctx.save();


        // Dynamically adjust font size based on title length
        let titleFontSize = 24;
        if (chartTitle.length > 30) {
            titleFontSize = 20; // smaller if too long
        } else if (chartTitle.length > 50) {
            titleFontSize = 18; // even smaller if very long
        }

        ctx.font = `bold ${titleFontSize}px sans-serif`;
        ctx.fillStyle = COLORS.textMain;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Title
        ctx.fillText(
            chartTitle, 
            titlePadding*2, 
            titlePadding);

        // Subtitle
        ctx.font = '16px sans-serif';
        ctx.fillText(
            chartSubtitle, 
            titlePadding*2, 
            titlePadding + subtitleSpacing
        );

        ctx.restore();
    }
};

const partitionPlugin = {
    id: 'partitionPlugin',
    beforeDatasetsDraw(chart) {
        const {ctx, chartArea: {top, bottom}, scales} = chart;
        const dataset = chart.data.datasets[0];
        const labels = chart.data.labels;
        const data = dataset.data;

        const minXValue = chart.options.scales.x.min ?? labels[0];
        let startIndex = labels.findIndex(v => v >= minXValue);
        if (startIndex === -1) startIndex = 0;

        let cutoffIndex = data.findIndex(v => v >= 0.5);
        if (cutoffIndex === -1) cutoffIndex = data.length - 1;
        cutoffIndex = Math.max(cutoffIndex, startIndex);

        function drawArea(color, startIdx, endIdx) {
            if (startIdx >= endIdx) return;
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(scales.x.getPixelForValue(labels[startIdx]), scales.y.getPixelForValue(0));
            for (let i = startIdx; i <= endIdx; i++) {
                const x = scales.x.getPixelForValue(labels[i]);
                const y = scales.y.getPixelForValue(data[i]);
                ctx.lineTo(x, y);
            }
            const lastX = scales.x.getPixelForValue(labels[endIdx]);
            ctx.lineTo(lastX, scales.y.getPixelForValue(0));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        drawArea(COLORS.bgGreen, startIndex, cutoffIndex);
        if (cutoffIndex < data.length - 1) {
            drawArea(COLORS.bgRed, cutoffIndex, data.length - 1);
        }
    }
};

const customLabelsPlugin = {
    id: 'customLabels',

    afterDatasetsDraw(chart) {
        const { ctx, data, scales } = chart;
        const dataset = data.datasets[0];
        ctx.save();

        const thresholds = [
            [0.1, 'Very Unlikely'],
            [0.3, 'Unlikely'],
            [0.5, 'Even Chance'],
            [0.7, 'Likely'],
            [0.9, 'Very Likely'],
            [0.99, 'Almost Certain']
        ];

        // Track label position and index for staggering
        let thresholdIdx = 0;
        let prevTextBottom = null;
        const labelHeight = 14 * 3;
        const minSpacing = 8;
        const lineBaseHeight = 50;

        // === Helpers ===
        function getColorForLabel(labelText) {
            switch (labelText) {
                case 'Very Unlikely': return COLORS.vUnlikely;
                case 'Unlikely': return COLORS.unlikely;
                case 'Even Chance': return COLORS.even;
                case 'Likely': return COLORS.likely;
                case 'Very Likely': return COLORS.vLikely;
                case 'Almost Certain': return COLORS.certain;
                default: return COLORS.primary;
            }
        }

        function drawConnectorLine(x, y, textY) {
            ctx.beginPath();
            ctx.strokeStyle = COLORS.primary;
            ctx.lineWidth = 2;
            ctx.moveTo(x, y);
            ctx.lineTo(x, textY + 5);
            ctx.stroke();
        }

        function drawLabelText(x, textY, value, labelText, attempts) {
            const percentLine = `(${Math.round(value * 100)}%)`;
            const probabilityLine = labelText;
            const attemptsLine = `${attempts.toLocaleString()} Attempts`;

            const lnSpace = 18;
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            ctx.fillText(probabilityLine, x, textY - lnSpace * 2);
            ctx.fillText(percentLine, x, textY - lnSpace);

            ctx.fillStyle = COLORS.primary;
            ctx.fillText(attemptsLine, x, textY);
        }

        function drawExtraLabel(index, text, color, dx = 0, dy = 0) {
            if (index === -1) return;
            const attempts = data.labels[index];
            const lx = scales.x.getPixelForValue(attempts) + dx;
            const ly = scales.y.getPixelForValue(0.1) + dy;
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = color;
            ctx.fillText(text, lx, ly);
        }

        // === Threshold Labels ===
        for (let i = 0; i < dataset.data.length && thresholdIdx < thresholds.length; i++) {
            const value = dataset.data[i];
            const [prob, labelText] = thresholds[thresholdIdx];

            if (value >= prob) {
                const x = scales.x.getPixelForValue(data.labels ? data.labels[i] : i + 1);
                const y = scales.y.getPixelForValue(value);
                const labelValue = chart.data.labels[i];

                ctx.fillStyle = getColorForLabel(labelText);

                // stagger vertically
                let textY = y - lineBaseHeight;
                if (prevTextBottom !== null && textY + labelHeight > prevTextBottom - minSpacing) {
                    textY = prevTextBottom - minSpacing - labelHeight;
                }
                prevTextBottom = textY;

                drawConnectorLine(x, y, textY);
                drawLabelText(x, textY, value, labelText, labelValue);

                thresholdIdx++;
            }
        }

        // === Lucky & Unlucky Labels ===
        drawExtraLabel(dataset.data.findIndex(v => v >= 0.3), 'Lucky', COLORS.accentGreen);
        drawExtraLabel(dataset.data.findIndex(v => v >= 0.7), 'Unlucky', COLORS.accentRed, 10);

        ctx.restore();
    }
};

const cdfChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Geometric CDF',
            data: [],
            fill: false,
            borderColor: COLORS.primary,
            borderWidth: 2,
            tension: 0,
            pointBackgroundColor: COLORS.primary,
            pointRadius: 0,
            pointHoverRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: chartTopPadding, right: 50 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return (context.parsed.y * 100).toFixed(1) + '%';
                    }
                }
            },
            title: {
                display: false,
                text: 'Geometric CDF Overview',
                align: 'start',         // left align
                color: COLORS.textMain,
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: { top: 10, bottom: 20 }
            }
        },
        scales: {
            x: {
                type: 'logarithmic',
                min: 5,
                ticks: { color: COLORS.textMain },
                title: {
                    display: true,
                    text: 'Number of Attempts',
                    color: COLORS.textMain,
                    font: { size: 16, weight: 'bold' }
                }
            },
            y: {
                min: 0,
                max: 1,
                ticks: {
                    callback: v => (v*100).toFixed(0) + '%',
                    color: COLORS.textMain
                },
                title: {
                    display: true,
                    text: 'Probability of Success',
                    color: COLORS.textMain,
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    },
    plugins: [topLeftTitlePlugin, partitionPlugin, customLabelsPlugin]
});

window.addEventListener('resize', updateInterfaceScale);

updateChart();
updateInterfaceScale();
