// [{
//     "color": "#ffbe5c",
//     "type": "column",
//     "data": [
//         null,
//         4.8
//     ],
//     "id": "1",
//     "name": "Этот артикул",
//     "scale": "y"
// },
//     {
//         "id": "0",
//         "name": "Рейтинг",
//         "data": [
//             4.7,
//             4.8,
//             4.9,
//             5
//         ],
//         "color": "#9a63d1",
//         "scale": "y"
//     }
// ]

type YagrFormat = {
    color: string;
    data: (number | null)[];
    id: string;
    name: string;
}[];

type ChartPieFormat = {
    plainData: number[];
    backgroundColor: string[];
    labels: string[];
    borderColor: string[];
};

export const convertYagrToChartPie = (data: YagrFormat): ChartPieFormat => {
    const currentElement = data.find((obj) => obj.name === 'Этот артикул');
    const otherElements = data.filter((obj) => obj.name !== 'Этот артикул');
    if (!currentElement || otherElements.length === 0) {
        throw new Error('Incorrect data format for to convert Yagr Format to ChartJS Pie Format ');
    }

    const currentElementValue: number = currentElement.data.filter((data) => data !== null)[0];
    const otherElementsValue: number[] = (() => {
        const tempData: number[] = [];

        otherElements.forEach((element) =>
            tempData.concat(element.data.filter((element) => element !== null)),
        );

        return tempData;
    })();

    const otherElementsLength: number = otherElementsValue.length;
    const allElementsLength: number = otherElementsLength + 1;

    return {
        plainData: [currentElementValue, ...otherElementsValue],
        borderColor: new Array(allElementsLength).fill('#000000'),
        labels: ['Этот артикул', ...new Array(otherElementsLength).fill('Рейтинг')],
        backgroundColor: ['#ffbe5c', ...new Array(otherElementsLength).fill('#9a63d1')],
    };
};
