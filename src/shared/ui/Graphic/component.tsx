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
import {Button, useTheme} from '@gravity-ui/uikit';
import {hideLineOnClickPlugin, verticalLinePlugin} from './plugins';
import {registerNextToPositioner} from '@/shared/chartPlugins/tooltipPosition';

registerNextToPositioner();

ChartJS.register(...CHART_JS_REGISTER_COMPONENTS, zoomPlugin);

export type MinMaxValue = Record<string, {min?: number; max?: number}>;

interface GraphicProps {
    data: Record<string, number | string>[];
    className?: string;
    yAxes?: Record<string, string>;
    colors?: Record<string, string>;
    removedEntities?: string[];
    minMaxValues?: MinMaxValue;
    useVerticalLines?: boolean;
    hiddenByDefault?: Record<string, boolean>;
}

export const Graphic: FC<GraphicProps> = ({
    data,
    className,
    yAxes = {},
    colors,
    removedEntities = [],
    minMaxValues,
    useVerticalLines,
    hiddenByDefault = {}
}) => {
    const theme = useTheme();
    const chartRef = useRef<any>(null);

    const filterDataByMinMax = (
        data: Record<string, string | number>[],
        minMaxes: MinMaxValue,
    ): Record<string, string | number>[] => {
        const valueKeys = Object.keys(minMaxes);
        if (valueKeys.length === 0) {
            return data;
        }

        for (let item of data) {
            for (let key of valueKeys) {
                if (
                    minMaxes[key].min &&
                    !Number.isNaN(+item[key]) &&
                    item[key] &&
                    +item[key] < minMaxes[key].min
                ) {
                    delete item[key];
                    continue;
                }
                if (
                    minMaxes[key].max &&
                    !Number.isNaN(item[key]) &&
                    item[key] &&
                    +item[key] > minMaxes[key].max
                ) {
                    delete item[key];
                }
            }
        }

        return data;
    };

    let filteredData = data.map((item) => {
        const filteredItem: Record<string, number | string> = {};
        for (const key in item) {
            if (!removedEntities.includes(key)) {
                filteredItem[key] = item[key];
            }
        }
        return filteredItem;
    });

    filteredData = filterDataByMinMax(filteredData, minMaxValues || {});

    const chartData = formatChartData(filteredData, yAxes, colors, hiddenByDefault);
    // const categories: string[] = chartData.datasets.map((dataset) => dataset.label);

    const options = {
        ...DEFAULT_CHART_OPTIONS,
        scales: createScalesConfig(colors, yAxes, theme === 'dark'),
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
            tooltip: {
                ...DEFAULT_TOOLTIP_CONFIG,
                backgroundColor: theme === 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeee',
                bodyColor: theme === 'dark' ? '#ffffffd9' : '#000000d9',
                titleColor: theme === 'dark' ? '#ffffffd9' : '#000000d9',
                position: 'nextTo',
                titleFont: {
                    size: 15,
                    weight: 700,
                },
                bodyFont: {
                    size: 13,
                    weight: 700,
                },
            },
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
            className={cn('w-full h-full', className)}
            style={{
                gap: 8,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div>
                <Button size="l" pin="circle-circle" onClick={handleResetZoom} selected>
                    Сбросить масштаб
                </Button>
            </div>
            <div style={{width: '100%', height: 'calc(100% - 96px)'}}>
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={options as any}
                    plugins={[hideLineOnClickPlugin as any].concat(
                        useVerticalLines ? [verticalLinePlugin] : [],
                    )}
                    style={{width: '100%', height: '100%'}}
                />
            </div>
        </div>
    );
};
