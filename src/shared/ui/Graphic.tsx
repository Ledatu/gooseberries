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

export const Graphic: FC<GraphicProps> = ({data, className, yAxes = [], colors = {}}) => {
    const formattedData = data.map((item) => ({
        ...item,
        'Дата и время': new Date(item['Дата и время']).toLocaleString(),
    }));

    const calculateCategories = (): string[] => {
        if (formattedData.length === 0) return [];
        return Object.keys(formattedData[0]).filter((category) => category !== 'Дата и время');
    };

    const categories = calculateCategories();

    const chartData = {
        labels: formattedData.map((item) => item['Дата и время']), // Ось X (даты)
        datasets: categories.map((category, index) => ({
            label: category,
            // @ts-ignore
            data: formattedData.map((item) => Number(+item[category])),
            borderColor: colors[category] || `hsl(${(index * 360) / categories.length}, 70%, 50%)`, // Используем переданный цвет или генерируем его
            yAxisID: yAxes.includes(category) ? `y${index + 1}` : 'y', // Используем базовую ось Y для категорий, не указанных в yAxes
            tension: 0.4,
        })),
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Дата и время',
                },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Базовая ось Y',
                },
            },
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
                                  },
                                  grid: {
                                      drawOnChartArea: index === 0,
                                  },
                              };
                          }
                          return acc;
                      },
                      {} as Record<string, any>,
                  )
                : {}), // Создаем дополнительные оси только если yAxes не пустой
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: ${value}`;
                    },
                },
                titleColor: '#fff',
                xAlign: 'right',
            },
        },
    };

    return (
        <div className={cn('w-[100%] h-[100%] mt-10', className)}>
            <Line data={chartData} options={options as any} className={'h-100%'} />
        </div>
    );
};
