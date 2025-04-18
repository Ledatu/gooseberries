import {GET_DEFAULT_X_AXIS_CONFIG} from '@/shared/ui/Graphic/config';

export const formatDateTime = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year}\n${hours}:${minutes}`;
};

const DEFAULT_LINE_TENSION: number = 0.45;

export const formatChartData = (
    data: Record<string, number | string>[],
    yAxes: string[] = [],
    colors: Record<string, string> = {},
    lineTension: number = DEFAULT_LINE_TENSION,
) => {
    const formattedData = data.map((item) => ({
        ...item,
        'Дата и время': formatDateTime(new Date(item['Дата и время'])),
    }));

    const categories = Object.keys(formattedData[0] || {}).filter(
        (category) => category !== 'Дата и время',
    );

    return {
        labels: formattedData.map((item) => item['Дата и время']),
        datasets: categories.map((category, index) => {
            const filteredData = formattedData.map((item) => {
                // @ts-ignore
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
                yAxisID: yAxes.includes(category) ? `y${yAxes.indexOf(category) + 1}` : 'y',
                tension: lineTension,
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: true,
                hidden: false,
            };
        }),
    };
};

export const createScalesConfig = (categories: string[], yAxes: string[], isDark: boolean) => {
    const scales: Record<string, any> = {
        x: GET_DEFAULT_X_AXIS_CONFIG(isDark),
    };

    const hasNonAxisCategories = categories.some((category) => !yAxes.includes(category));
    if (hasNonAxisCategories) {
        scales.y = {
            type: 'linear' as const,
            display: true,
            position: 'left',
            ticks: {
                color: isDark ? '#ffffff' : '#000',
            },
            grid: {
                color: 'rgba(47,5,5,0.1)',
            },
            min: 0,
            beginAtZero: true,
        };
    }

    yAxes.forEach((category, index) => {
        const axisKey = `y${index + 1}`;

        scales[axisKey] = {
            type: 'linear' as const,
            display: true,
            position: index % 2 === 0 ? 'left' : 'right',
            title: {
                display: true,
                text: category,
                color: isDark ? '#ffffff' : '#000',
            },
            ticks: {
                color: isDark ? '#ffffff' : '#000',
            },
            grid: {
                drawOnChartArea: index === 0,
                color: 'rgba(255, 255, 255, 0.1)',
            },
        };
    });

    return scales;
};
