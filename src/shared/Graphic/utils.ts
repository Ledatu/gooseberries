import {GET_DEFAULT_X_AXIS_CONFIG} from './config';

const DEFAULT_LINE_TENSION: number = 0.2;

export const formatChartData = (
    data: Record<string, number | string>[],
    yAxes: Record<string, string> = {},
    colors: Record<string, string> = {},
    lineTension: number = DEFAULT_LINE_TENSION,
) => {
    const formattedData = data.map((item) => ({
        ...item,
        'Дата и время': new Date(item['Дата и время']).toLocaleString('ru-RU'),
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
                yAxisID: yAxes[category] ?? 'y',
                tension: lineTension,
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: true,
                hidden: false,
            };
        }),
    };
};

export const createScalesConfig = (
    categories: string[],
    yAxes: Record<string, string>,
    isDark: boolean,
) => {
    const scales: Record<string, any> = {
        x: GET_DEFAULT_X_AXIS_CONFIG(isDark),
    };

    const hasNonAxisCategories = categories.some((category) => !yAxes[category]);
    if (hasNonAxisCategories) {
        scales.y = {
            type: 'linear' as const,
            display: true,
            position: 'left',
            ticks: {
                color: isDark ? '#ffffffd9' : '#000000d9',
            },
            grid: {
                color: 'rgba(47, 5, 5, 0.1)',
            },
            min: 0,
            beginAtZero: true,
        };
    }

    Object.keys(yAxes).forEach((category, index) => {
        const axisKey = yAxes[category];
        console.log('creating axis', category);

        scales[axisKey] = {
            type: 'linear' as const,
            display: category.includes('_scale'),
            position: index % 2 === 0 ? 'left' : 'right',
            title: {
                display: true,
                text: category,
                color: isDark ? '#ffffffd9' : '#000000d9',
            },
            ticks: {
                color: isDark ? '#ffffffd9' : '#000000d9',
            },
            grid: {
                drawOnChartArea: index === 0,
                color: 'rgba(255, 255, 255, 0.1)',
            },
        };
    });

    return scales;
};
