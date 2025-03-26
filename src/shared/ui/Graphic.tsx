import {FC} from 'react';
import {Line} from 'react-chartjs-2';
import {cn} from '@/lib/cn';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraphicProps {
    data: Record<string, number | string>[];
    className?: string;
    yAxes?: string[];
    colors?: Record<string, string>;
}

const timeToHHMM = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const Graphic: FC<GraphicProps> = ({data, className, yAxes = [], colors = {}}) => {
    const formattedData = data.map((item) => ({
        ...item,
        'Дата и время': timeToHHMM(new Date(item['Дата и время'])),
    }));

    const calculateCategories = (): string[] => {
        if (formattedData.length === 0) return [];
        return Object.keys(formattedData[0]).filter((category) => category !== 'Дата и время');
    };

    const categories = calculateCategories();

    const chartData = {
        labels: formattedData.map((item) => item['Дата и время']),
        datasets: categories.map((category, index) => {
            const filteredData = formattedData.map((item) => {
                const value = Number(+item[category]);
                return value === 0 ? NaN : value;
            });

            return {
                label: category,
                data: filteredData,
                borderColor:
                    colors[category] || `hsl(${(index * 360) / categories.length}, 70%, 50%)`,
                backgroundColor:
                    colors[category] || `hsl(${(index * 360) / categories.length}, 70%, 50%)`,
                yAxisID: yAxes.includes(category) ? `y${index + 1}` : 'y',
                tension: 0,
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: true,
                hidden: false, // Добавляем начальное состояние видимости
            };
        }),
    };

    const hideLineOnClickPlugin = {
        id: 'hideLineOnClick',
        beforeEvent(chart: any, args: any) {
            const event = args.event;
            if (event.type === 'click') {
                // Получаем элементы под курсором
                const elements = chart.getElementsAtEventForMode(
                    event,
                    'nearest',
                    {intersect: true},
                    false,
                );

                if (elements.length > 0) {
                    const element = elements[0];
                    const datasetIndex = element.datasetIndex;
                    const meta = chart.getDatasetMeta(datasetIndex);

                    // Переключаем видимость
                    meta.hidden =
                        meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : null;

                    // Обновляем chart
                    chart.update();
                }
            }
        },
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            x: {
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
            },
            ...(categories.length > yAxes.length && {
                y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#ffffff',
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                },
            }),
            ...(yAxes.length > 0
                ? categories.reduce(
                      (acc, category, index) => {
                          if (yAxes.includes(category)) {
                              acc[`y${index + 1}`] = {
                                  type: 'linear' as const,
                                  display: true,
                                  position: index % 2 === 0 ? 'left' : 'right',
                                  title: {
                                      display: true,
                                      text: category,
                                      color: '#ffffff',
                                  },
                                  ticks: {
                                      color: '#ffffff',
                                  },
                                  grid: {
                                      drawOnChartArea: index === 0,
                                      color: 'rgba(255, 255, 255, 0.1)',
                                  },
                              };
                          }
                          return acc;
                      },
                      {} as Record<string, any>,
                  )
                : {}),
        },
        plugins: {
            legend: {
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
                onClick: (e: any, legendItem: any, legend: any) => {
                    const index = legendItem.datasetIndex;
                    const chart = legend.chart;
                    const meta = chart.getDatasetMeta(index);

                    meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;

                    chart.update();
                },
            },
            tooltip: {
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
            },
        },
    };

    return (
        <div
            className={cn('w-full h-full', className)}
            style={{height: '100%', minHeight: '400px'}}
        >
            <Line
                data={chartData}
                options={options as any}
                style={{width: '100%', height: '100%'}}
                plugins={[hideLineOnClickPlugin]}
            />
        </div>
    );
};
