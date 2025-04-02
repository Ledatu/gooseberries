import {FC, useRef} from 'react';
import {Line} from 'react-chartjs-2';
import {cn} from '@/lib/cn';
import zoomPlugin from 'chartjs-plugin-zoom';
import {Chart as ChartJS} from 'chart.js';
import {
    CHART_JS_REGISTER_COMPONENTS,
    DEFAULT_CHART_OPTIONS,
    GET_DEFAULT_LEGEND_CONFIG,
    DEFAULT_TOOLTIP_CONFIG,
    ZOOM_CONFIG,
} from './config';
import {formatChartData, createScalesConfig} from './utils';
import {useTheme} from '@gravity-ui/uikit';
import {hideLineOnClickPlugin, verticalLinePlugin} from '@/shared/ui/Graphic/plugins';

ChartJS.register(...CHART_JS_REGISTER_COMPONENTS, zoomPlugin);

interface GraphicProps {
    data: Record<string, number | string>[];
    className?: string;
    yAxes?: string[];
    colors?: Record<string, string>;
    removedEntities?: string[];
}

/**
 * Компонент для отображения линейного графика с возможностью масштабирования и настройки.
 *
 * param {Object} props - Свойства компонента.
 *
 * props.data: Record<string, number | string>[] - Данные для отображения на графике.
 *        Каждый элемент массива представляет собой объект с данными для конкретного момента времени.
 *        Ключи объекта - названия сущностей, значения - соответствующие значения.
 *
 * props.className: string - Дополнительные CSS-классы для контейнера графика.
 *
 * props.yAxes: string[] - Массив названий сущностей, для которых нужно создать
 *        отдельные оси Y. Если не указано, все сущности будут отображаться на одной оси.
 *
 * props.colors: Record<string, string> - Объект с цветами для линий разных сущностей.
 *        Ключи - названия сущностей, значения - цвет в формате CSS (hex, rgb, или название).
 *
 * props.removedEntities: string[] - Массив названий сущностей, которые нужно
 *        исключить из отображения на графике.
 */
export const Graphic: FC<GraphicProps> = ({
    data,
    className,
    yAxes = [],
    colors,
    removedEntities = [],
}) => {
    const theme = useTheme();
    const chartRef = useRef<any>(null);

    const filteredData = data.map((item) => {
        const filteredItem: Record<string, number | string> = {};
        for (const key in item) {
            if (!removedEntities.includes(key)) {
                filteredItem[key] = item[key];
            }
        }
        return filteredItem;
    });

    const chartData = formatChartData(filteredData, yAxes, colors);
    const categories: string[] = chartData.datasets.map((dataset) => dataset.label);

    const options = {
        ...DEFAULT_CHART_OPTIONS,
        scales: createScalesConfig(categories, yAxes, theme === 'dark'),
        plugins: {
            legend: {
                ...GET_DEFAULT_LEGEND_CONFIG(theme === 'dark'),
                onClick: (_e: never, legendItem: any, legend: any) => {
                    const index = legendItem.datasetIndex;
                    const chart = legend.chart;
                    const meta = chart.getDatasetMeta(index);

                    meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                    chart.update();
                },
            },
            tooltip: DEFAULT_TOOLTIP_CONFIG,
            zoom: ZOOM_CONFIG,
        },
    };

    const handleResetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    return (
        <div
            className={cn('w-full h-full relative', className)}
            style={{
                height: '45em',
                backdropFilter: 'blur(48px)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <button
                onClick={handleResetZoom}
                className="absolute top-2 opacity-70 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm z-10 hover:bg-gray-700 transition-colors"
            >
                Сбросить масштаб
            </button>
            <div style={{flex: 1, position: 'relative'}}>
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={options as any}
                    plugins={[hideLineOnClickPlugin, verticalLinePlugin]}
                    style={{width: '100%', height: '100%'}}
                />
            </div>
        </div>
    );
};
