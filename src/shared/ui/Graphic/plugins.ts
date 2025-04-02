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

        // Получаем положение и высоту легенды, если она есть
        const legend = chart.legend;
        const legendHeight = legend ? legend.height : 0;
        const legendTop = legend ? legend.top : 0;
        
        // Определяем нижнюю границу для линий (не заходить в легенду)
        const bottomLimit = legend && legendTop > chartArea.bottom ? chartArea.bottom : chartArea.bottom - legendHeight;

        datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (!meta.hidden) {
                const data = dataset.data as (number | null)[];
                const xAxis = chart.scales.x;
                const yAxisID = (dataset as any).yAxisID || 'y';
                const yAxis = chart.scales[yAxisID];

                const zeroPixel = yAxis.getPixelForValue(0);
                // Ограничиваем нижнюю точку линии, чтобы не заходила в легенду
                const adjustedZeroPixel = Math.min(zeroPixel, bottomLimit);

                data.forEach((value, index) => {
                    if (value !== null && !isNaN(value)) {
                        const prevValue = index > 0 ? data[index - 1] : null;
                        const nextValue = index < data.length - 1 ? data[index + 1] : null;

                        if (!prevValue && !nextValue) {
                            const x = xAxis.getPixelForValue(index);
                            const yValuePixel = yAxis.getPixelForValue(value);

                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = (dataset.borderColor as string) || '#000';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([25, 25]);

                            // Используем adjustedZeroPixel вместо zeroPixel
                            ctx.moveTo(x, adjustedZeroPixel);
                            ctx.lineTo(x, yValuePixel);

                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                });
            }
        });
    },
};