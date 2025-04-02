import {GET_DEFAULT_X_AXIS_CONFIG} from '@/shared/ui/Graphic/config';
import { MinMaxValue } from './types';

export const timeToHHMM = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const filterDataByMinMax = (
        data: Record<string, string | number>[],
        minMaxes: MinMaxValue,
): Record<string, string | number>[] => {
    console.log("BEFORE DATA", data)
    const valueKeys = Object.keys(minMaxes);
    if (valueKeys.length === 0) {
        return data;
    }

    for (let item of data) {
        for (let key of valueKeys) {
            if (
                minMaxes[key].min &&
                !Number.isNaN(+item[key]) &&
                item[key] &&
                +item[key] < minMaxes[key].min
            ) {
                delete item[key];
                continue;
            }
            if (
                minMaxes[key].max &&
                !Number.isNaN(item[key]) &&
                item[key] &&
                +item[key] > minMaxes[key].max
            ) {
                delete item[key];
            }
        }
    }

    console.log("AFTER DATA", data)

    return data;
}

export const formatChartData = (
    data: Record<string, number | string>[],
    yAxes: string[] = [],
    colors: Record<string, string> = {},
) => {
    const formattedData = data.map((item) => ({
        ...item,
        'Дата и время': timeToHHMM(new Date(item['Дата и время'])),
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
                tension: 0,
                pointRadius: 0,
                borderWidth: 2,
                spanGaps: false,
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
