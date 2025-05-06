import {Chart} from 'chart.js';

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

export const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDraw(chart: Chart) {
        const ctx = chart.ctx;
        const datasets = chart.data.datasets;
        const chartArea = chart.chartArea;

        datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (!meta.hidden) {
                const data = dataset.data as (number | null)[];
                const xAxis = chart.scales.x;
                const yAxisID = (dataset as any).yAxisID || 'y';
                const yAxis = chart.scales[yAxisID];

                const color = (dataset.borderColor as string).slice(0, 7) + '69' || '#0000000f';

                data.forEach((value, index) => {
                    if (value !== null && !isNaN(value)) {
                        const prevValue = index > 0 ? data[index - 1] : null;
                        const nextValue = index < data.length - 1 ? data[index + 1] : null;

                        if (!prevValue && !nextValue) {
                            const x = xAxis.getPixelForValue(index);

                            const yStart = chartArea.bottom;
                            const yEnd = yAxis.getPixelForValue(value);

                            const clampedY = Math.min(
                                Math.max(yEnd, chartArea.top),
                                chartArea.bottom,
                            );

                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = color;

                            ctx.lineWidth = 15;
                            ctx.moveTo(x, yStart);
                            ctx.lineTo(x, clampedY);

                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                });
            }
        });
    },
};
