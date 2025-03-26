import {
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

export const CHART_JS_REGISTER_COMPONENTS = [
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
];

export const DEFAULT_CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
};

export const DEFAULT_X_AXIS_CONFIG = {
    display: true,
    title: {
        display: false,
        text: 'Дата и время',
    },
    ticks: {
        maxTicksLimit: 10,
        autoSkip: true,
        maxRotation: 0,
        minRotation: 0,
        color: '#ffffff',
    },
    grid: {
        color: 'rgba(255, 255, 255, 0.1)',
    },
};

export const DEFAULT_LEGEND_CONFIG = {
    position: 'bottom' as const,
    labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        color: '#ffffff',
        font: {
            family: 'sans-serif',
            size: 12,
            weight: 'normal',
        },
    },
};

export const DEFAULT_TOOLTIP_CONFIG = {
    callbacks: {
        label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return isNaN(value) ? `${label}: N/A` : `${label}: ${value}`;
        },
    },
    titleColor: '#ffffff',
    bodyColor: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    xAlign: 'right',
    yAlign: 'center',
    position: 'nearest',
};

export const ZOOM_CONFIG = {
    pan: {
        enabled: true,
        mode: 'xy',
        modifierKey: 'shift',
    },
    zoom: {
        wheel: {
            enabled: true,
        },
        pinch: {
            enabled: true,
        },
        mode: 'x',
        drag: {
            enabled: true,
            backgroundColor: 'rgba(198,198,198,0.2)',
            borderColor: 'rgba(183,183,183,0.8)',
            borderWidth: 1,
        },
    },
    limits: {
        x: {min: 'original', max: 'original'},
        y: {min: 'original', max: 'original'},
    },
};
