import {FC, useRef} from 'react';
import {Line} from 'react-chartjs-2';
import {cn} from '@/lib/cn';
import zoomPlugin from 'chartjs-plugin-zoom';
import {Chart as ChartJS} from 'chart.js';
import {
    CHART_JS_REGISTER_COMPONENTS,
    DEFAULT_CHART_OPTIONS,
    DEFAULT_LEGEND_CONFIG,
    DEFAULT_TOOLTIP_CONFIG,
    ZOOM_CONFIG,
} from './config';
import {formatChartData, createScalesConfig, hideLineOnClickPlugin} from './utils';

ChartJS.register(...CHART_JS_REGISTER_COMPONENTS, zoomPlugin);

interface GraphicProps {
    data: Record<string, number | string>[];
    className?: string;
    yAxes?: string[];
    colors?: Record<string, string>;
}

export const Graphic: FC<GraphicProps> = ({data, className, yAxes = [], colors = {}}) => {
    const chartRef = useRef<any>(null);

    const chartData = formatChartData(data, yAxes, colors);
    const categories: string[] = chartData.datasets.map((dataset) => dataset.label);

    const options = {
        ...DEFAULT_CHART_OPTIONS,
        scales: createScalesConfig(categories, yAxes),
        plugins: {
            legend: {
                ...DEFAULT_LEGEND_CONFIG,
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
                    plugins={[hideLineOnClickPlugin]}
                    style={{width: '100%', height: '100%'}}
                />
            </div>
        </div>
    );
};
