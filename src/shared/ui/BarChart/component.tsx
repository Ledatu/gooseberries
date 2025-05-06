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
import {useTheme} from '@gravity-ui/uikit';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: (number | null)[];
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
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                position: 'nearest' as const,
                callbacks: {
                    label: function (context: any) {
                        if (context.parsed.y === null) return null;

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
                filter: function (tooltipItem: any) {
                    return tooltipItem.parsed.y !== null;
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => (value >= 1000 ? `${value / 1000}k` : value),
                },
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
            x: {
                display: false,
                stacked: true,
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

    const theme = useTheme();

    return (
        <div>
            <div
                style={{color: theme === 'dark' ? '#ffffff59' : '#333'}}
                className={'line-clamp-1 text-[14px] font-bold ml-3 mb-4 text-center'}
            >
                {title}
            </div>
            <Bar options={options as any} data={data} className={'mt-2'} />
        </div>
    );
};
