const SELECTED_ELEMENT_COLOR: string = '#ffbe5c';
const OTHER_COLORS: string[] = [
    '#9a63d1', // оригинальный фиолетовый
    '#5c8dff', // мягкий синий
    '#63d19a', // мятно-зеленый
    '#ff5c8d', // розовый
    '#5cd1d1', // бирюзовый
    '#d19a63', // коричнево-бежевый
    '#8d5cff', // насыщенный фиолетовый
    '#5cff8d', // ярко-зеленый
    '#ff8d5c', // коралловый
    '#d15cff', // пурпурный
];

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

    const currentElementValue: number = currentElement.data.find((data) => data !== null) as number;
    const otherElementsValue: number[] = otherElements.flatMap((element) =>
        element.data.filter((el): el is number => el !== null),
    );

    const otherElementsLength: number = otherElementsValue.length;
    // const allElementsLength: number = otherElementsLength + 1;

    return {
        plainData: [currentElementValue, ...otherElementsValue],
        borderColor: [
            SELECTED_ELEMENT_COLOR,
            ...new Array(otherElementsLength).fill(OTHER_COLORS[0]),
        ],
        labels: ['Этот артикул', ...new Array(otherElementsLength).fill('Рейтинг')],
        // backgroundColor: ['#ffbe5c', ...OTHER_COLORS.slice(0, otherElementsLength)],
        backgroundColor: ['#ffbe5c', ...new Array(otherElementsLength).fill(OTHER_COLORS[0])],
    };
};
