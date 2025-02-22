'use client';

const getMedianOfArray = (array: any) => {
    const arr = [...new Set<any>(array)];
    arr.sort((a, b) => a - b);
    return arr[Math.round(arr.length / 2)];
};
export const getMedian = (cluster: any, obj: any) => {
    const median: any = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
        const arr = cluster.map((item: any) => item[key]);
        median[key] = getMedianOfArray(arr);
    }
    return median;
};
