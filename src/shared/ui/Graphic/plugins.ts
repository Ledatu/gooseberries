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
