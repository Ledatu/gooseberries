import React from 'react';
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor?: string;
            borderWidth?: number;
        }[];
    };
    title: string;
    yAxisLabel: string;
}

export const BarChartComponent: React.FC<BarChartProps> = ({data, title, yAxisLabel}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                position: 'nearest' as const,
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('ru-RU').format(context.parsed.y);
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
            x: {
                display: false,
                grid: {
                    display: false,
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0,
                },
            },
        },
        hover: {
            mode: 'index' as const,
            intersect: false,
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return <Bar options={options} data={data} />;
};
