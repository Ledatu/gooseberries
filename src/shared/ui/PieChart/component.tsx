import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import {FC} from 'react';
import {useTheme} from '@gravity-ui/uikit';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    title: string;
    initialLabel: string;
    plainData: number[];
    labels: string[];
    backgroundColor: string[];
    borderColor: string[];
}

export const PieChart: FC<PieChartProps> = ({
    title,
    initialLabel,
    plainData,
    backgroundColor,
    borderColor,
    labels,
}) => {
    const data = {
        labels,
        datasets: [
            {
                label: initialLabel,
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

    const theme = useTheme();

    return (
        <div>
            <h5
                style={{color: theme === 'dark' ? '#ffffff59' : '#333'}}
                className={'line-clamp-1 text-[14px] font-bold ml-3 mb-4'}
            >
                {title}
            </h5>
            <Pie data={data} options={options} className={'bg-auto'} />
        </div>
    );
};
