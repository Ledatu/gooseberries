import {getLocaleDateString} from '@/utilities/getRoundValue';
import {AdvertDateData} from '../types';
export const getStatsForChart = (
    stats: AdvertDateData[],
    nameOfColumns: {[key: string]: string},
): Record<string, number | string>[] => {
    const statsForChart: Record<string, string | number>[] = [];
    for (let i = stats.length - 1; i >= 0; i--) {
        const obj: Record<string, string | number> = {};
        const stat = stats[i];
        for (const key of Object.keys(stat)) {
            if (key === 'date') {
                obj[nameOfColumns[key]] = getLocaleDateString(new Date(stat[key]));
            } else if (nameOfColumns[key] !== undefined) {
                obj[nameOfColumns[key]] = stat[key];
            } else {
                // console.log(key)
            }
        }
        statsForChart.push(obj);
    }
    // console.log(statsForChart)
    return statsForChart;
};
