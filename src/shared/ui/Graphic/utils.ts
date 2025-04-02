import {GET_DEFAULT_X_AXIS_CONFIG} from '@/shared/ui/Graphic/config';

export const timeToHHMM = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

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
                yAxisID: yAxes.includes(category) ? `y${index + 1}` : 'y',
                tension: 0,
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
                color: '#ffffff',
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
        };
    }

    yAxes.forEach((category, index) => {
        const axisKey =
            categories.length >= yAxes.length && yAxes.length === 1 ? 'y' : `y${index + 1}`;

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

export const hideLineOnClickPlugin = {
    id: 'hideLineOnClick',
    beforeEvent(chart: any, args: any) {
        const event = args.event;
        if (event.type === 'click') {
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

                meta.hidden =
                    meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : null;
                chart.update();
            }
        }
    },
};
