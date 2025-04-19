import {FC, useRef, useState, useCallback} from 'react';
import {Line} from 'react-chartjs-2';
import {cn} from '@/lib/cn';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  Legend,
  TimeScale,
} from 'chart.js';
import {
  DEFAULT_CHART_OPTIONS,
  GET_DEFAULT_LEGEND_CONFIG,
  DEFAULT_TOOLTIP_CONFIG,
  ZOOM_CONFIG,
} from './config';
import {formatChartData, createScalesConfig} from './utils';
import {useTheme} from '@gravity-ui/uikit';
import {hideLineOnClickPlugin, verticalLinePlugin} from './plugins';

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Legend,
  TimeScale,
  zoomPlugin,
);

// @ts-ignore
Tooltip.positioners.nextTo = function (elements, eventPosition) {
  const tooltip = this as unknown as {width?: number};
  const offset = tooltip.width ? tooltip.width + 10 : 10;
  
  return {
    x: eventPosition.x - offset,
    y: eventPosition.y,
    xAlign: 'left',
    yAlign: 'center',
  };
};

export type MinMaxValue = Record<string, {min?: number; max?: number}>;

interface GraphicProps {
  data: Record<string, number | string>[];
  className?: string;
  yAxes?: string[];
  colors?: Record<string, string>;
  removedEntities?: string[];
  minMaxValues?: MinMaxValue;
}

export const Graphic: FC<GraphicProps> = ({
  data,
  className,
  yAxes = [],
  colors,
  removedEntities = [],
  minMaxValues,
}) => {
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [showResetZoom, setShowResetZoom] = useState(true);

  const filterDataByMinMax = useCallback(
    (data: Record<string, string | number>[], minMaxes: MinMaxValue) => {
      const valueKeys = Object.keys(minMaxes);
      if (valueKeys.length === 0) return data;

      return data.map(item => {
        const newItem = {...item};
        for (const key of valueKeys) {
          const value = Number(newItem[key]);
          if (isNaN(value)) continue;

          if (minMaxes[key].min !== undefined && value < minMaxes[key].min!) {
            delete newItem[key];
          } else if (minMaxes[key].max !== undefined && value > minMaxes[key].max!) {
            delete newItem[key];
          }
        }
        return newItem;
      });
    },
    [],
  );

  const handleResetZoom = useCallback(() => {
    chartRef.current?.resetZoom();
    setShowResetZoom(false);
  }, []);

  const filteredData = useCallback(() => {
    let result = data.map(item => {
      const filteredItem: Record<string, number | string> = {};
      for (const key in item) {
        if (!removedEntities.includes(key)) {
          filteredItem[key] = item[key];
        }
      }
      return filteredItem;
    });

    if (minMaxValues) {
      result = filterDataByMinMax(result, minMaxValues);
    }

    return result;
  }, [data, removedEntities, minMaxValues, filterDataByMinMax]);

  const chartData = formatChartData(filteredData(), yAxes, colors);
  const categories: string[] = chartData.datasets.map(dataset => dataset.label);

  const getTooltipConfig = useCallback(
    () => ({
      ...DEFAULT_TOOLTIP_CONFIG,
      position: 'nextTo' as const,
      xAlign: 'left',
      yAlign: 'center',
    }),
    [],
  );

  const options = {
    ...DEFAULT_CHART_OPTIONS,
    scales: createScalesConfig(categories, yAxes, theme === 'dark'),
    plugins: {
      legend: {
        ...GET_DEFAULT_LEGEND_CONFIG(theme === 'dark'),
      },
      tooltip: getTooltipConfig(),
      zoom: {
        ...ZOOM_CONFIG,
      },
    },
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
      {showResetZoom && (
        <button
          onClick={handleResetZoom}
          className="absolute top-2 opacity-70 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm z-10 hover:bg-gray-700 transition-colors"
        >
          Сбросить масштаб
        </button>
      )}
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