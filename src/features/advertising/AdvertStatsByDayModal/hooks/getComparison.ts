import {getLocaleDateString} from '@/utilities/getRoundValue';
import {AdvertDateData} from '../types/AdvertDateData';
import {getDefaultAdvertDateData} from '../config/getDefaultAdvertDateData';

export const getComparison = (data: AdvertDateData[]) => {
    const keys = Object.keys(getDefaultAdvertDateData());
    console.log('comp keys', keys);

    let comparison: {[key: string]: AdvertDateData} = {};
    for (let i = data.length - 1; i >= 0; i--) {
        const dateString = getLocaleDateString(data[i].date);
        if (i == data.length - 1) {
            comparison[dateString] = {...getDefaultAdvertDateData(), date: data[i].date};
        } else {
            const temp = getDefaultAdvertDateData();
            for (const key of keys) {
                temp[key] = (data[i][key] ?? 0) - (data[i + 1][key] ?? 0);
            }
            comparison[dateString] = temp;
        }
    }
    return comparison;
};
