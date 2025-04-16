import {colors} from '@/pages/AnalyticsPage/config/colors';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

export const genYagrData = (
    currenrGraphMetrics: any,
    graphModalData: any,
    graphModalTimeline: any,
    columnDataObj: any,
) => {
    function linearRegression(x: any, y: any) {
        const n = x.length;
        const sumX = x.reduce((a: any, b: any) => a + b, 0);
        const sumY = y.reduce((a: any, b: any) => a + b, 0);
        const sumXY = x.map((xi: any, i: any) => xi * y[i]).reduce((a: any, b: any) => a + b, 0);
        const sumXX = x.map((xi: any) => xi * xi).reduce((a: any, b: any) => a + b, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const trendLine = x.map((xi: any) => slope * xi + intercept);
        return {slope, intercept, trendLine};
    }

    const graphModalDataTemp = [] as any[];
    const axesConfig: any = {};

    for (const metric of currenrGraphMetrics) {
        const metricData = graphModalData[metric];

        const {trendLine} = linearRegression(graphModalTimeline, metricData);
        const properTitle = columnDataObj[metric] ? columnDataObj[metric].placeholder : metric;
        const graphColor = colors[currenrGraphMetrics.indexOf(metric) % colors.length];
        const graphTrendColor = graphColor.slice(0, graphColor.length - 10) + '650-solid)';

        graphModalDataTemp.push({
            name: 'Тренд ' + properTitle,
            data: trendLine,
            color: graphTrendColor,
            precision: 0,
            id: '2',
            scale: 'r',
        });
        graphModalDataTemp.push({
            name: properTitle,
            data: metricData,
            type: 'column',
            // lineWidth: 2,
            id: '1',
            color: graphColor,
            scale: 'y',
        });
        axesConfig['y'] = {
            label: 'Значение',
            precision: 'auto',
            show: true,
        };
        axesConfig['r'] = {
            label: 'Тренд',
            precision: 'auto',
            side: 'right',
            show: true,
        };
    }

    return {
        data: {
            timeline: graphModalTimeline,
            graphs: [...graphModalDataTemp],
        },

        libraryConfig: {
            chart: {
                series: {
                    type: 'line',
                    interpolation: 'smooth',
                },
            },
            axes: {
                ...axesConfig,
                x: {
                    show: true,
                },
            },
            tooltip: {
                precision: 0,
            },
            title: {
                text: 'График по дням',
            },
        },
    } as YagrWidgetData;
};
