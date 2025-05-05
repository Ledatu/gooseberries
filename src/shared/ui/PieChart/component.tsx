import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import {FC} from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    title: string;
    plainData: number[];
    labels: string[];
    backgroundColor: string[];
    borderColor: string[];
}

export const PieChart: FC<PieChartProps> = ({
    title,
    plainData,
    backgroundColor,
    borderColor,
    labels,
}) => {
    const data = {
        labels,
        datasets: [
            {
                label: title,
                data: plainData,
                backgroundColor,
                borderColor,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return <Pie data={data} options={options} />;
};
