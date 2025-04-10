import {useEffect, useState} from 'react';
import {ClusterData} from '../api/mapper';
import {useAdvertsWordsModal} from './AdvertsWordsModalContext';
import {getMedian} from '@/utilities/getMedian';
import {compare} from '@/components/TheTable';

export interface InfoForDescription {
    isPhrasesExcludedByMinus?: boolean;
    isPhrasesSelectedByPlus?: boolean;
    includesPhrases?: string[];
    notIncludesPhrases?: string[];
    rules: Rules[];
    excluded: boolean;
}

interface ClustersTableContext {
    data: ClusterData[];
    footerData: ClusterData;
    showDzhem: boolean;
    setShowDzhem: (arg: boolean) => void;
    filteredData: ClusterData[];
    filterTableData: Function;
    filterByButton: (val: any, key: any, compMode: string) => void;
    setFilters: (filters: any) => void;
    filters: any;
    getInfoForDescription: (cluster: string, row: any, excluded: boolean) => InfoForDescription;
}

const calcFooter = (clusterData: ClusterData[]): ClusterData => {
    const avgKeys = ['ctr', 'cpc'];
    const medianKeys = [
        'openToCartCurrent',
        'openToOrderPercent',
        'cartToOrderCurrent',
        'avgPositionCurrent',
        'visibilityCurrent',
        'drr',
        'cpo',
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
        drr: 0,
        cpo: 0,
        profitSum: 0,
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
    summaryData.cluster = `Всего кластеров: ${clusterData.length}`;
    return summaryData;
};

export const useClustersTableContext = (): ClustersTableContext => {
    const {stats, template} = useAdvertsWordsModal();
    const [data, setData] = useState(stats);
    useEffect(() => {
        setData(stats);
    }, [stats]);

    const [showDzhem, setShowDzhem] = useState(true);

    // useEffect(() => {
    //     showDzhem
    //         ? setColumnsData(columns)
    //         : setColumnsData(columns.filter((column) => notDzhem.includes(column.name)));
    // }, [showDzhem, columns]);
    const [filters, setFilters] = useState({undef: true});

    const filterByButton = (val: any, key: any, compMode = 'include') => {
        (filters as any)[key] = {val: String(val), compMode: compMode} as any;
        setFilters({...filters});
        filterTableData(filters);
    };

    const [filteredData, setFilteredData] = useState(stats);
    const [footer, setFooter] = useState(calcFooter(filteredData));
    useEffect(() => {
        setFooter(calcFooter(filteredData));
    }, [filteredData]);
    const filterTableData = (withfFilters: any = {}, tableData: any = []) => {
        const temp = [] as any;
        for (const tempTypeRow of tableData.length ? tableData : data) {
            let addFlag = true;
            const useFilters: any = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
                if (filterArg == 'undef' || !filterData || filterArg == 'byWarehouses') continue;
                if (filterData['val'] == '') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) temp.push(tempTypeRow);
        }

        // temp.sort((a: any, b: any) => {
        //     if (!a || !b) return false;
        //     if (!a.art || !b.art) return false;
        //     return a.art.localeCompare(b.art, 'ru-RU');
        // });
        setFilteredData(temp);
    };

    const getInfoForDescription = (
        cluster: string,
        row: any,
        excluded: boolean,
    ): InfoForDescription => {
        if (excluded) {
            const isPhrasesExcludedByMinus = template.phrasesExcludedByMinus.includes(cluster);
            const includesPhrases = template.includes.filter((value) => cluster.includes(value));
            const notIncludesPhrases = template.notIncludes.filter((value) =>
                cluster.includes(value),
            );

            const rules: Rules[] = template.rules.filter((rule) => {
                const ruleName = rule.key;
                if (
                    row['views'] >= rule.viewsThreshold &&
                    ((rule.biggerOrEqual && row[ruleName] >= rule.val) ||
                        (!rule.biggerOrEqual && row[ruleName] <= rule.val))
                )
                    return true;
                return false;
            });
            return {
                isPhrasesExcludedByMinus,
                includesPhrases,
                notIncludesPhrases,
                rules,
                excluded,
            };
        } else {
            const isPhrasesSelectedByPlus = template.phrasesSelectedByPlus.includes(cluster);
            const includesPhrases = template.includes.filter((value) => cluster.includes(value));
            const rules: Rules[] = template.rules.filter((rule) => {
                const ruleName = rule.key;
                if (
                    row['views'] >= rule.viewsThreshold &&
                    ((rule.biggerOrEqual && row[ruleName] >= rule.val) ||
                        (!rule.biggerOrEqual && row[ruleName] < rule.val))
                )
                    return true;
                return false;
            });
            return {isPhrasesSelectedByPlus, includesPhrases, rules, excluded};
        }
    };

    return {
        filteredData,
        filterTableData,
        filterByButton,
        setFilters,
        filters,
        footerData: footer,
        data: data,
        showDzhem: showDzhem,
        setShowDzhem: setShowDzhem,
        getInfoForDescription: getInfoForDescription,
    };

    // Fetch data when advertId changes
};
