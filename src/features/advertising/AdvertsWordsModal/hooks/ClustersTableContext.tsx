import {useEffect, useState} from 'react';
import {ClusterData} from '../api/mapper';
import {useAdvertsWordsModal} from './AdvertsWordsModalContext';
import {getMedian} from '@/utilities/getMedian';
import {ColumnData} from '../ui/ActiveClustersTable';

interface ClustersTableContext {
    data: ClusterData[];
    footer: ClusterData;
    showDzhem: boolean;
    setShowDzhem: (arg: boolean) => void;
    columns: ColumnData[];
}

const calcFooter = (clusterData: ClusterData[]): ClusterData => {
    const avgKeys = ['ctr', 'cpc'];
    const medianKeys = [
        'openToCartCurrent',
        'openToOrderPercent',
        'cartToOrderCurrent',
        'avgPositionCurrent',
        'visibilityCurrent',
    ];
    let summaryData: ClusterData = {
        addToCartCurrent: 0,
        addToCartPercentile: 0,
        avgPositionCurrent: 0,
        cartToOrderCurrent: 0,
        cartToOrderPercentile: 0,
        clicks: 0,
        cluster: '',
        cpc: 0,
        ctr: 0,
        frequencyCurrent: 0,
        openCardCurrent: 0,
        openCardPercentile: 0,
        openToCartCurrent: 0,
        openToCartPercentile: 0,
        openToOrderPercent: 0,
        ordersCurrent: 0,
        ordersPercentile: 0,
        preset: '',
        totalFrequency: 0,
        totalSum: 0,
        views: 0,
        visibilityCurrent: 0,
        weekFrequency: 0,
    };
    for (const data of clusterData) {
        for (const [key, value] of Object.entries(data)) {
            if (typeof summaryData[key] === 'number' && typeof value === 'number') {
                (summaryData[key] as number) += value;
            }
        }
    }
    for (const key of avgKeys) summaryData[key] = (summaryData[key] as number) / clusterData.length;
    const median = getMedian(clusterData, summaryData);
    for (const key of medianKeys) summaryData[key] = median[key];
    return summaryData;
};

const notDzhem = [
    'clicks',
    'ctr',
    'cpc',
    'cluster',
    'clicks',
    'views',
    'presets',
    'totalFrequency',
    'preset',
    'totalSum',
];

export const useClustersTableContext = (columns: ColumnData[]): ClustersTableContext => {
    const {stats} = useAdvertsWordsModal();
    const [data, setData] = useState(stats);
    const [footer, setFooter] = useState(calcFooter(data));
    useEffect(() => {
        setData(stats);
    }, [stats]);
    useEffect(() => {
        setFooter(calcFooter(data));
    }, [data]);
    const [columnsData, setColumnsData] = useState(columns);
    const [showDzhem, setShowDzhem] = useState(true);

    useEffect(() => {
        showDzhem
            ? setColumnsData(columns)
            : setColumnsData(columns.filter((column) => notDzhem.includes(column.name)));
    }, [showDzhem]);

    return {
        footer: footer,
        data: data,
        columns: columnsData,
        showDzhem: showDzhem,
        setShowDzhem: setShowDzhem,
    };

    // Fetch data when advertId changes
};
