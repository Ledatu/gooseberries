'use client';
import {useEffect, useMemo, useRef, useState} from 'react';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';

settings.set({plugins: [YagrPlugin]});
import callApi, {getUid} from '@/utilities/callApi';
import axios, {CancelTokenSource} from 'axios';
import {getLocaleDateString, getNormalDateRange} from '@/utilities/getRoundValue';
import TheTable, {compare} from '@/components/TheTable';
import {RangePicker} from '@/components/RangePicker';
import {LogoLoad} from '@/components/logoLoad';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useCampaign} from '@/contexts/CampaignContext';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {useModules} from '@/contexts/ModuleProvider';
import {Note} from './NotesForArt/types';
import {StatisticsPanel} from '@/widgets/MassAdvert/overallStats/ui';
import {
    getAddToCardPercentColumn,
    getAddToCartCountColumn,
    getAvgPriceColum,
    getCardToOrderPercentColumn,
    getClicksColumn,
    getCPCColumn,
    getCPLColumn,
    getCPMColumn,
    getCpoColumn,
    getCRColumn,
    getCTRColumn,
    getDrrColumn,
    getDsiColumn,
    getOpenCardCountColumn,
    getOrdersColumn,
    getRomiColumn,
    getStocksColumn,
    getSumColumn,
    getSumOrdersColumn,
    getViewsColumn,
} from '@/widgets/MassAdvert/columnData/config/columns';
import {getPlacementsColumn} from '@/widgets/MassAdvert/columnData/config/placementsColumn';
import {getAnalyticsColumn} from '@/widgets/MassAdvert/columnData/config/analyticsColumn';
import {getArtColumn} from '@/widgets/MassAdvert/columnData/config/artColumn';
import {getAdvertsColumn} from '@/widgets/MassAdvert/columnData/config/advertsColumn';
import {getAutoSalesColumn} from '@/widgets/MassAdvert/columnData/config/autoSalesColumn';
import {MassAdvertPageSkeleton} from '@/components/Pages/MassAdvertPage/Skeleton';
import {campaignStore} from '@/shared/stores/campaignStore';
import {UpTableActions} from '@/widgets/MassAdvert/upTableActions/ui/widget';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        // console.log(docum, mode, selectValue);

        if (mode) {
            doc['campaigns'][selectValue] = docum['campaigns'][selectValue];
            doc['balances'][selectValue] = docum['balances'][selectValue];
            doc['plusPhrasesTemplates'][selectValue] = docum['plusPhrasesTemplates'][selectValue];
            doc['advertsPlusPhrasesTemplates'][selectValue] =
                docum['advertsPlusPhrasesTemplates'][selectValue];
            doc['adverts'][selectValue] = docum['adverts'][selectValue];
            // doc['placementsAuctions'][selectValue] = docum['placementsAuctions'][selectValue];
            doc['advertsSelectedPhrases'][selectValue] =
                docum['advertsSelectedPhrases'][selectValue];
            doc['advertsSchedules'][selectValue] = docum['advertsSchedules'][selectValue];
            doc['autoSales'][selectValue] = docum['autoSales'][selectValue];

            if (
                doc['dzhemData'] &&
                doc['dzhemData'][selectValue] &&
                docum['dzhemData'] &&
                docum['dzhemData'][selectValue]
            )
                doc['dzhemData'][selectValue] = docum['dzhemData'][selectValue];
        }
        setDocument(docum);
    }
    return doc;
};

export const MassAdvertPage = () => {
    const {
        setSummary,
        setSemanticsModalOpenFromArt,
        setAutoSalesModalOpenFromParent,
        setArtsStatsByDayData,
        setShowDzhemModalOpen,
        setAdvertsArtsListModalFromOpen,
        setShowArtStatsModalOpen,
        setFetchingDataFromServerFlag,
        setRkList,
        setRkListMode,
    } = campaignStore;
    const {showError} = useError();
    const {availablemodulesMap} = useModules();
    const permission: string = useMemo(() => {
        console.log(availablemodulesMap);

        return availablemodulesMap['massAdvert'];
    }, [availablemodulesMap]);
    const {selectValue, setSwitchingCampaignsFlag, sellerId} = useCampaign();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [advertBudgetRules, setAdvertBudgetRules] = useState<any>([]);
    const fetchAdvertBudgetRules = async () => {
        try {
            const response = await ApiClient.post('massAdvert/get-advert-budget-rules', {
                seller_id: sellerId,
            });
            if (!response?.data) {
                throw new Error('error while getting advertBudgetRules');
            }
            const temp = response?.data;
            setAdvertBudgetRules(temp);
        } catch (error: any) {
            console.error(error);
            showError(error);
        }
    };
    useEffect(() => {
        fetchAdvertBudgetRules();
    }, [sellerId]);

    useEffect(() => {
        if (!selectValue[0]) return;

        callApi('getAvailableAutoSaleNmIds', {
            seller_id: sellerId,
        })
            .then((res) => {
                if (!res) throw 'no response';
                const nmIds = res['data'] ?? {};
                setAvailableAutoSalesNmIds(nmIds ?? []);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [sellerId]);

    const [stocksByWarehouses, setStocksByWarehouses] = useState<any>({});
    useEffect(() => {
        const params = {seller_id: sellerId};
        callApi('getStocksByWarehouses', params).then((res) => {
            if (!res || !res['data']) return;

            setStocksByWarehouses(res['data']);
        });
    }, [sellerId]);

    const [selectedSearchPhrase, setSelectedSearchPhrase] = useState<string>('');
    const [filtersRK, setFiltersRK] = useState<any>({
        scheduleRules: false,
        budgetRules: false,
        phrasesRules: false,
        bidderRules: false,
        activeAdverts: false,
        pausedAdverts: false,
    });
    const [currentParsingProgress, setCurrentParsingProgress] = useState<any>({});

    const [fetchedPlacements, setFetchedPlacements] = useState<any>(undefined);

    const [filters, setFilters] = useState<any>({undef: false});

    const [availableAutoSalesNmIds, setAvailableAutoSalesNmIds] = useState([] as any[]);
    const [autoSalesProfits, setAutoSalesProfits] = useState<any>({});
    const [filterAutoSales, setFilterAutoSales] = useState(false);

    const [placementsDisplayPhrase, setPlacementsDisplayPhrase] = useState('');

    const [copiedAdvertsSettings, setCopiedAdvertsSettings] = useState({advertId: 0});

    const getNotes = async () => {
        try {
            const params = {seller_id: sellerId};
            const res = await ApiClient.post('massAdvert/notes/getNotes', params);
            console.log(res?.data);
            if (!res || !res.data) {
                throw new Error('Request without result');
            }
            setAllNotes(res.data);
        } catch (error) {
            console.error('Error while getting all notes', error);
        }
    };

    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    // const monthAgo = new Date(today);
    // monthAgo.setDate(monthAgo.getDate() - 30);

    const [dateRange, setDateRange] = useState([today, today]);

    const [allNotes, setAllNotes] = useState<{[key: string]: Note[]} | undefined>();
    const [reloadNotes, setReloadNotes] = useState<boolean>(true);
    useEffect(() => {
        if (reloadNotes) {
            console.log('privet kak del');
            getNotes();
            setReloadNotes(false);
        }
    }, [sellerId, reloadNotes]);

    const [pagesCurrent, setPagesCurrent] = useState(1);

    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);

    const [unvalidatedArts, setUnvalidatedArts] = useState<any[]>([]);
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(changedDoc, changedDocUpdateType, selectValue[0]);

    const getUnvalidatedArts = async () => {
        try {
            const params = {seller_id: sellerId, fields: ['prices', 'tax']};
            const response = await ApiClient.post('massAdvert/unvalidatedArts', params);
            if (!response?.data) {
                throw new Error('error while getting unvalidatedArts');
            }
            console.log('unvalidatedArts', response?.data?.unvalidatedArts);
            setUnvalidatedArts(response?.data?.unvalidatedArts);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUnvalidatedArts();
    }, [sellerId]);

    const updateColumnWidth = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        filterTableData({adverts: {val: '', mode: 'include'}}, data);
    };

    const filterTableData = (
        withfFilters: any = {},
        tableData: any = {},
        _filterAutoSales = undefined as any,
        datering = undefined,
    ) => {
        const [startDate, endDate] = datering ?? dateRange;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysBetween =
            Math.abs(
                startDate.getTime() -
                    (today.getTime() > endDate.getTime() ? endDate.getTime() : today.getTime()),
            ) /
            1000 /
            86400;

        const temp = [] as any;
        const usefilterAutoSales = _filterAutoSales ?? filterAutoSales;
        // console.log(
        //     tableData,
        //     data,
        //     Object.keys(tableData).length ? tableData : data,
        //     withfFilters['undef'] ? withfFilters : filters,
        // );

        for (const [art, info] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            const artInfo: any = info;
            if (!art || !artInfo) continue;

            const tempTypeRow: any = artInfo;
            tempTypeRow['placements'] =
                artInfo['placements'] == -1 ? 10 * 1000 : artInfo['placements'];

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            if (Object.values(filtersRK).includes(true)) useFilters['filtersRK'] = filtersRK;
            else delete useFilters['filtersRK'];

            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '' && filterArg != 'placements') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (flarg && fldata.trim() == '+') {
                    continue;
                } else if (fldata?.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (usefilterAutoSales && !availableAutoSalesNmIds.includes(tempTypeRow['nmId'])) {
                    addFlag = false;
                    break;
                }

                if (filterArg == 'art') {
                    const rulesForAnd = filterData['val'].split('+');
                    // console.log(rulesForAnd);

                    let wholeText = '';
                    for (const key of ['art', 'title', 'brand', 'nmId', 'imtId', 'object']) {
                        wholeText += tempTypeRow[key] + ' ';
                    }

                    const tags = tempTypeRow['tags'];
                    if (tags) {
                        for (const key of tags) {
                            wholeText += key + ' ';
                        }
                    }

                    let tempFlagInc = 0;
                    for (let k = 0; k < rulesForAnd.length; k++) {
                        const ruleForAdd = rulesForAnd[k];
                        if (ruleForAdd == '') {
                            tempFlagInc++;
                            continue;
                        }
                        if (
                            compare(wholeText, {
                                val: ruleForAdd,
                                compMode: filterData['compMode'],
                            })
                        ) {
                            tempFlagInc++;
                        }
                    }
                    if (tempFlagInc != rulesForAnd.length) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'filtersRK') {
                    const adverts = tempTypeRow['adverts'];

                    let add = false;
                    if (adverts)
                        for (const id of Object.keys(adverts)) {
                            const status = doc?.adverts?.[selectValue[0]]?.[id]?.status;

                            const hasStatusFilter =
                                filtersRK['activeAdverts'] || filtersRK['pausedAdverts'];
                            let byStatus = !hasStatusFilter;

                            if (filtersRK['activeAdverts'] && status != 9) continue;
                            else if (filtersRK['activeAdverts']) byStatus = true;

                            if (filtersRK['pausedAdverts'] && status != 11) continue;
                            else if (filtersRK['pausedAdverts']) byStatus = true;

                            if (
                                filtersRK['bidderRules'] &&
                                !doc?.advertsAutoBidsRules?.[selectValue[0]]?.[id] &&
                                byStatus
                            )
                                add = true;
                            if (filtersRK['budgetRules'] && !advertBudgetRules[id] && byStatus)
                                add = true;
                            if (
                                filtersRK['phrasesRules'] &&
                                !doc?.advertsPlusPhrasesTemplates?.[selectValue[0]]?.[id] &&
                                byStatus
                            )
                                add = true;
                            if (
                                filtersRK['scheduleRules'] &&
                                !doc?.advertsSchedules?.[selectValue[0]]?.[id] &&
                                byStatus
                            )
                                add = true;

                            if (
                                !filtersRK['bidderRules'] &&
                                !filtersRK['budgetRules'] &&
                                !filtersRK['phrasesRules'] &&
                                !filtersRK['scheduleRules'] &&
                                byStatus &&
                                hasStatusFilter
                            )
                                add = true;
                        }
                    if (!add) addFlag = false;
                } else if (filterArg == 'placements') {
                    if (filterData['val'] == '') {
                        setPlacementsDisplayPhrase('');
                        setSelectedSearchPhrase('');
                        continue;
                    }
                    const temp = isNaN(parseInt(filterData['val']));

                    if (temp) {
                        setPlacementsDisplayPhrase(filterData['val']);
                        if (placementsDisplayPhrase != filterData['val'])
                            setSelectedSearchPhrase('');
                    } else if (!compare(tempTypeRow[filterArg], filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'adverts') {
                    const rulesForAnd = [filterData['val']];
                    const adverts = tempTypeRow[filterArg];
                    // console.log(rulesForAnd);
                    let wholeText = '';
                    let wholeTextTypes = '';
                    if (adverts)
                        for (const [id, _] of Object.entries(adverts)) {
                            wholeText += id + ' ';
                            const advertData = doc?.adverts?.[selectValue[0]]?.[id];

                            if (advertData)
                                wholeTextTypes += advertData.type == 8 ? 'авто ' : 'поиск ';
                        }

                    const lwr = String(filterData['val']).toLocaleLowerCase().trim();
                    if (['авто', 'поиск'].includes(lwr)) {
                        if (wholeTextTypes.includes(lwr)) continue;
                    }
                    let tempFlagInc = 0;
                    for (let k = 0; k < rulesForAnd.length; k++) {
                        const ruleForAdd = rulesForAnd[k];
                        if (ruleForAdd == '') {
                            tempFlagInc++;
                            continue;
                        }
                        if (
                            compare(wholeText, {
                                val: ruleForAdd,
                                compMode: filterData['compMode'],
                            })
                        ) {
                            tempFlagInc++;
                        }
                    }
                    if (tempFlagInc != rulesForAnd.length) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'autoSales') {
                    const rentabelnost = getRoundValue(
                        autoSalesProfits[tempTypeRow['art']]?.rentabelnost,
                        1,
                        true,
                    );
                    if (!compare(rentabelnost, filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'semantics') {
                    if (!compare(tempTypeRow['plusPhrasesTemplate'], filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'avg_price') {
                    if (
                        !compare(
                            getRoundValue(tempTypeRow['sum_orders'], tempTypeRow['orders']),
                            filterData,
                        )
                    ) {
                        addFlag = false;
                        break;
                    }
                } else if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) {
                temp.push(tempTypeRow);
            }
        }

        temp.sort((a: any, b: any) => {
            return a.art.localeCompare(b.art, 'ru-RU');
        });
        const filteredSummaryTemp = {
            art: '',
            orders: 0,
            sum_orders: 0,
            sum: 0,
            views: 0,
            clicks: 0,
            drr: 0,
            ctr: 0,
            analytics: 0,
            profit: 0,
            rentabelnost: 0,
            cpc: 0,
            cpm: 0,
            cr: 0,
            uniqueImtIds: 0,
            stocks: 0,
            dsi: 0,
            cpo: 0,
            cpl: 0,
            adverts: 0,
            semantics: null,
            budget: 0,
            romi: 0,
            openCardCount: 0,
            addToCartPercent: 0,
            addToCartCount: 0,
            cartToOrderPercent: 0,
        };
        const uniqueAdvertsIds: any[] = [];
        const uniqueImtIds: any[] = [];
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            const imtId = row['imtId'];
            if (!uniqueImtIds.includes(imtId)) uniqueImtIds.push(imtId);

            const adverts = row['adverts'];
            if (adverts) {
                for (const id of Object.keys(adverts)) {
                    if (!uniqueAdvertsIds.includes(id)) uniqueAdvertsIds.push(id);
                }
            }
            filteredSummaryTemp.sum_orders += row['sum_orders'];
            filteredSummaryTemp.orders += row['orders'];
            filteredSummaryTemp.stocks += row['stocks'];
            filteredSummaryTemp.sum += row['sum'];
            filteredSummaryTemp.views += row['views'];
            filteredSummaryTemp.clicks += row['clicks'];
            // if (row['art'] == 'страйп/15/16-1406')
            //     console.log(
            //         row['profit'],
            //         filteredSummaryTemp.analytics,
            //         filteredSummaryTemp.analytics + Math.round(row['profit'] ?? 0),
            //     );
            filteredSummaryTemp.profit += Math.round(row['profit'] ?? 0);

            filteredSummaryTemp.budget += row['budget'] ?? 0;
            filteredSummaryTemp.openCardCount += row['openCardCount'];
            filteredSummaryTemp.addToCartCount += row['addToCartCount'];
        }
        filteredSummaryTemp.uniqueImtIds = Math.round(uniqueImtIds.length);

        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        filteredSummaryTemp.stocks = Math.round(filteredSummaryTemp.stocks);
        filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
        filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
        filteredSummaryTemp.adverts = uniqueAdvertsIds.length;

        filteredSummaryTemp.profit = Math.round(filteredSummaryTemp.profit);
        filteredSummaryTemp.rentabelnost = getRoundValue(
            filteredSummaryTemp.profit,
            filteredSummaryTemp.sum_orders,
            true,
        );
        filteredSummaryTemp.analytics = filteredSummaryTemp.rentabelnost;

        filteredSummaryTemp.openCardCount = Math.round(filteredSummaryTemp.openCardCount);
        filteredSummaryTemp.addToCartPercent = getRoundValue(
            filteredSummaryTemp.addToCartCount,
            filteredSummaryTemp.openCardCount,
            true,
        );
        filteredSummaryTemp.cartToOrderPercent = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.addToCartCount,
            true,
        );

        filteredSummaryTemp.drr = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.sum_orders,
            true,
            1,
        );
        filteredSummaryTemp.ctr = getRoundValue(
            filteredSummaryTemp.clicks,
            filteredSummaryTemp.views,
            true,
        );
        filteredSummaryTemp.cpc = getRoundValue(
            filteredSummaryTemp.sum / 100,
            filteredSummaryTemp.clicks,
            true,
            filteredSummaryTemp.sum / 100,
        );
        filteredSummaryTemp.cpm = getRoundValue(
            filteredSummaryTemp.sum * 1000,
            filteredSummaryTemp.views,
        );
        filteredSummaryTemp.cr = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.openCardCount,
            true,
        );
        filteredSummaryTemp.cpo = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.orders,
            false,
            filteredSummaryTemp.sum,
        );
        filteredSummaryTemp.cpl = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.addToCartCount,
            false,
            filteredSummaryTemp.sum,
        );

        filteredSummaryTemp.romi = getRoundValue(
            filteredSummaryTemp.profit,
            filteredSummaryTemp.sum,
            true,
        );

        filteredSummaryTemp.dsi = getRoundValue(
            filteredSummaryTemp.stocks,
            filteredSummaryTemp.orders / (daysBetween + 1),
        );

        setFilteredSummary(filteredSummaryTemp);
        setFilteredData(temp);
    };

    const getUniqueAdvertIdsFromThePage = () => {
        const lwr = filters['adverts']
            ? String(filters['adverts']['val']).toLocaleLowerCase().trim()
            : '';

        const uniqueAdverts: any = {};
        for (let i = 0; i < filteredData.length; i++) {
            const {adverts} = filteredData[i];
            if (!adverts) continue;

            for (const [id, _] of Object.entries(adverts)) {
                if (!id) continue;
                const advertData = doc?.adverts?.[selectValue[0]]?.[id];
                if (!advertData) continue;
                const {advertId, type} = advertData;
                if (!advertId) continue;

                if (lwr == 'авто' && type != 8) continue;
                else if (lwr == 'поиск' && ![6, 9].includes(type)) continue;

                uniqueAdverts[advertId] = {advertId: advertId};
            }
        }
        return uniqueAdverts;
    };

    const manageAdvertsActivityCallFunc = async (mode: string, advertId: any) => {
        const params: any = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {
                advertsIds: {},
                mode: mode,
            },
        };
        params.data.advertsIds[advertId] = {advertId: advertId};

        return await callApi('manageAdvertsActivity', params);
    };

    const filterByButton = (val: any, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val) + ' ', compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const calcByDayStats = (arts: any[]) => {
        const tempJson: any = {};

        const daysBetween =
            dateRange[1].getTime() / 86400 / 1000 - dateRange[0].getTime() / 86400 / 1000;

        const now = new Date();
        for (let i = 0; i <= daysBetween; i++) {
            const dateIter = new Date(dateRange[1]);
            dateIter.setDate(dateIter.getDate() - i);

            if (dateIter > now) continue;
            const strDate = getLocaleDateString(dateIter);

            if (!tempJson[strDate])
                tempJson[strDate] = {
                    date: dateIter,
                    orders: 0,
                    sum_orders: 0,
                    sum: 0,
                    views: 0,
                    clicks: 0,
                    drr: 0,
                    ctr: 0,
                    cpc: 0,
                    cpm: 0,
                    cr: 0,
                    cpo: 0,
                    openCardCount: 0,
                    addToCartCount: 0,
                    addToCartPercent: 0,
                    cartToOrderPercent: 0,
                    cpl: 0,
                };

            for (const _art of arts) {
                const {advertsStats, nmFullDetailReport} = doc.campaigns[selectValue[0]][_art];
                if (!advertsStats) continue;
                const dateData = advertsStats[strDate];
                if (!dateData) continue;

                tempJson[strDate].orders += dateData['orders'];
                tempJson[strDate].sum_orders += dateData['sum_orders'];
                tempJson[strDate].sum += dateData['sum'];
                tempJson[strDate].views += dateData['views'];
                tempJson[strDate].clicks += dateData['clicks'];

                const {openCardCount, addToCartCount} = nmFullDetailReport.statistics[strDate] ?? {
                    openCardCount: 0,
                    addToCartCount: 0,
                };

                tempJson[strDate].openCardCount += openCardCount ?? 0;
                tempJson[strDate].addToCartCount += addToCartCount ?? 0;
            }
            tempJson[strDate].openCardCount = Math.round(tempJson[strDate].openCardCount);

            tempJson[strDate].addToCartPercent = getRoundValue(
                tempJson[strDate].addToCartCount,
                tempJson[strDate].openCardCount,
                true,
            );
            tempJson[strDate].cartToOrderPercent = getRoundValue(
                tempJson[strDate].orders,
                tempJson[strDate].addToCartCount,
                true,
            );
            tempJson[strDate].cpl = getRoundValue(
                tempJson[strDate].sum,
                tempJson[strDate].addToCartCount,
            );
        }

        const temp = [] as any[];

        for (const [strDate, data] of Object.entries(tempJson)) {
            const dateData: any = data;
            if (!strDate || !dateData) continue;

            dateData['orders'] = Math.round(dateData['orders']);
            dateData['sum_orders'] = Math.round(dateData['sum_orders']);
            dateData['sum'] = Math.round(dateData['sum']);
            dateData['views'] = Math.round(dateData['views']);
            dateData['clicks'] = Math.round(dateData['clicks']);

            const {orders, sum, clicks, views} = dateData as any;

            dateData['drr'] = getRoundValue(dateData['sum'], dateData['sum_orders'], true, 1);
            dateData['ctr'] = getRoundValue(clicks, views, true);
            dateData['cpc'] = getRoundValue(sum / 100, clicks, true, sum / 100);
            dateData['cpm'] = getRoundValue(sum * 1000, views);
            dateData['cr'] = getRoundValue(orders, dateData['openCardCount'], true);
            dateData['cpo'] = getRoundValue(sum, orders, false, sum);
            temp.push(dateData);
        }

        return temp;
    };

    const recalc = (
        daterng: any,
        selected = '',
        withfFilters = {},
        campaignData_ = undefined as any,
    ) => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysBetween =
            Math.abs(
                startDate.getTime() -
                    (today.getTime() > endDate.getTime() ? endDate.getTime() : today.getTime()),
            ) /
            1000 /
            86400;

        const summaryTemp = {
            views: 0,
            clicks: 0,
            sum: 0,
            drr_orders: 0,
            drr_sales: 0,
            drr: '',
            orders: 0,
            sales: 0,
            sum_orders: 0,
            sum_sales: 0,
            addToCartCount: 0,
            profit: '',
            rent: '',
            profitTemp: 0,
        };

        const _selectedCampaignName = selected == '' ? selectValue[0] : selected;
        let campaignData = doc;
        if (campaignData_) campaignData = campaignData_;
        if (
            !(
                campaignData &&
                campaignData?.campaigns &&
                campaignData?.campaigns[_selectedCampaignName] &&
                campaignData?.adverts &&
                campaignData?.adverts[_selectedCampaignName]
            )
        )
            return;

        const temp: any = {};
        for (const [art, data] of Object.entries(campaignData.campaigns[_selectedCampaignName])) {
            const artData: any = data;
            if (!art || !artData) continue;
            const artInfo: any = {
                art: '',
                photos: undefined,
                imtId: undefined,
                brand: '',
                object: '',
                nmId: 0,
                title: '',
                adverts: 0,
                stocks: 0,
                dsi: 0,
                stocksBySizes: {},
                profitLog: {},
                advertsManagerRules: undefined,
                tags: [] as any[],
                advertsStocksThreshold: undefined,
                placements: undefined,
                placementsValue: undefined,
                drrAI: {},
                expectedBuyoutsPersent: 0,
                plusPhrasesTemplate: undefined,
                advertsSelectedPhrases: {},
                semantics: {},
                budget: {},
                bid: {},
                bidLog: {},
                budgetToKeep: {},
                orders: 0,
                sum_orders: 0,
                sum: 0,
                views: 0,
                clicks: 0,
                drr: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                cr: 0,
                cpo: 0,
                analytics: 0,
                rentabelnost: 0,
                profit: 0,
                sales: 0,
                sum_sales: 0,
                openCardCount: 0,
                romi: 0,
                addToCartPercent: 0,
                addToCartCount: 0,
                cartToOrderPercent: 0,
                cpl: 0,
            };

            artInfo.art = artData['art'];
            artInfo.photos = artData['photos'];
            artInfo.imtId = artData['imtId'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.tags = artData['tags'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];

            artInfo.stocksBySizes = artData['stocksBySizes'];
            artInfo.adverts = artData['adverts'];
            artInfo.advertsManagerRules = artData['advertsManagerRules'];
            artInfo.profitLog = artData['profitLog'];
            artInfo.advertsStocksThreshold = artData['advertsStocksThreshold'];
            artInfo.placementsValue = artData['placements'];
            artInfo.expectedBuyoutsPersent = artData['expectedBuyoutsPersent'];
            artInfo.plusPhrasesTemplate = artData['plusPhrasesTemplate'];
            artInfo.placements = artData['placements'] ? artData['placements'].index : undefined;

            // console.log(artInfo);

            if (artInfo.adverts) {
                for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
                    if (!advertType || advertType == 'none' || !advertsOfType) continue;

                    for (const [advertId, _] of Object.entries(advertsOfType)) {
                        if (!advertId) continue;
                        const advertData = campaignData.adverts[_selectedCampaignName][advertId];
                        if (!advertData) continue;
                        const status = advertData['status'];
                        if (![4, 9, 11].includes(status)) continue;

                        artInfo.budget[advertId] = advertData['budget'];

                        artInfo.bid[advertId] = advertData['cpm'];

                        artInfo.semantics[advertId] = advertData['words'];

                        artInfo.drrAI[advertId] =
                            campaignData.advertsAutoBidsRules[_selectedCampaignName][advertId];
                        artInfo.advertsSelectedPhrases[advertId] =
                            campaignData.advertsSelectedPhrases[_selectedCampaignName][advertId];
                        artInfo.bidLog[advertId] = advertData['bidLog'];
                    }
                }
            }
            if (artData['advertsStats']) {
                for (const [strDate, data] of Object.entries(artData['advertsStats'])) {
                    const dateData: any = data;
                    if (strDate == 'updateTime' || !dateData) continue;

                    if (!dateData) continue;
                    const date = new Date(strDate);
                    date.setHours(0, 0, 0, 0);
                    if (date < startDate || date > endDate) continue;

                    artInfo.sum_orders += dateData['sum_orders'];
                    artInfo.orders += dateData['orders'];

                    artInfo.sum_sales += dateData['sum_sales'];
                    artInfo.sales += dateData['sales'];
                    artInfo.sum += dateData['sum'];
                    artInfo.views += dateData['views'];
                    artInfo.clicks += dateData['clicks'];
                    artInfo.profit += dateData['profit'];
                    artInfo.rentabelnost = getRoundValue(
                        artInfo['profit'],
                        artInfo['sum_orders'],
                        true,
                    );
                    artInfo.analytics += artInfo.rentabelnost;

                    // console.log(
                    //     artData['nmFullDetailReport']
                    //         ? artData['nmFullDetailReport'].statistics
                    //         : undefined,
                    //     strDate,
                    //     artData['nmFullDetailReport']
                    //         ? artData['nmFullDetailReport'].statistics
                    //             ? artData['nmFullDetailReport'].statistics[strDate]
                    //             : undefined
                    //         : undefined,
                    // );

                    const {openCardCount, addToCartCount} = artData['nmFullDetailReport']
                        ? (artData['nmFullDetailReport'].statistics[strDate] ?? {
                              openCardCount: 0,
                              addToCartCount: 0,
                          })
                        : {
                              openCardCount: 0,
                              addToCartCount: 0,
                          };

                    artInfo.openCardCount += openCardCount ?? 0;
                    artInfo.addToCartCount += addToCartCount ?? 0;
                }
                artInfo.openCardCount = Math.round(artInfo.openCardCount);

                artInfo.addToCartPercent = getRoundValue(
                    artInfo.addToCartCount,
                    artInfo.openCardCount,
                    true,
                );
                artInfo.cartToOrderPercent = getRoundValue(
                    artInfo.orders,
                    artInfo.addToCartCount,
                    true,
                );

                artInfo.sum_orders = Math.round(artInfo.sum_orders);
                artInfo.orders = Math.round(artInfo.orders);
                artInfo.sum_sales = Math.round(artInfo.sum_sales);
                artInfo.sales = Math.round(artInfo.sales * 100) / 100;
                artInfo.sum = Math.round(artInfo.sum);
                artInfo.views = Math.round(artInfo.views);
                artInfo.clicks = Math.round(artInfo.clicks);

                artInfo.dsi = getRoundValue(artInfo.stocks, artInfo.orders / (daysBetween + 1));

                artInfo.drr = getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1);
                artInfo.ctr = getRoundValue(artInfo.clicks, artInfo.views, true);
                artInfo.cpc = getRoundValue(
                    artInfo.sum / 100,
                    artInfo.clicks,
                    true,
                    artInfo.sum / 100,
                );
                artInfo.cpm = getRoundValue(artInfo.sum * 1000, artInfo.views);
                artInfo.cr = getRoundValue(artInfo.orders, artInfo.openCardCount, true);
                artInfo.cpo = getRoundValue(artInfo.sum, artInfo.orders, false, artInfo.sum);
                artInfo.cpl = getRoundValue(
                    artInfo.sum,
                    artInfo.addToCartCount,
                    false,
                    artInfo.sum,
                );
                artInfo.romi = getRoundValue(artInfo.profit, artInfo.sum, true);

                summaryTemp.sales += artInfo.sales;
                summaryTemp.sum_sales += artInfo.sum_sales;
                summaryTemp.sum_orders += artInfo.sum_orders;
                summaryTemp.sum += artInfo.sum;
                summaryTemp.views += artInfo.views;
                summaryTemp.clicks += artInfo.clicks;
                summaryTemp.addToCartCount += artInfo.addToCartCount;
                summaryTemp.orders += artInfo.orders;

                summaryTemp.profitTemp += Math.round(artInfo.profit);
            }

            temp[art] = artInfo;
        }

        summaryTemp.addToCartCount = Math.round(summaryTemp.addToCartCount);
        summaryTemp.orders = Math.round(summaryTemp.orders);
        summaryTemp.sales = Math.round(summaryTemp.sales);
        summaryTemp.sum_orders = Math.round(summaryTemp.sum_orders);
        summaryTemp.sum_sales = Math.round(summaryTemp.sum_sales);
        summaryTemp.drr_orders = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
        summaryTemp.drr_sales = getRoundValue(summaryTemp.sum, summaryTemp.sum_sales, true, 1);

        summaryTemp.profit = `${new Intl.NumberFormat('ru-RU').format(summaryTemp.profitTemp)} ₽`;
        summaryTemp.rent = `${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_orders, true),
        )}% / ${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_sales, true),
        )}%`;

        summaryTemp.drr = `${new Intl.NumberFormat('ru-RU').format(
            summaryTemp.drr_orders,
        )}% / ${new Intl.NumberFormat('ru-RU').format(summaryTemp.drr_sales)}%`;

        setSummary({...summaryTemp});

        setTableData(temp);

        filterTableData(withfFilters, temp, undefined, daterng);
    };

    const columnData: any = [
        doc
            ? {
                  ...getArtColumn({
                      filterAutoSales: filterAutoSales,
                      setFilterAutoSales: setFilterAutoSales,
                      filters: filters,
                      data: data,
                      filteredData: filteredData,
                      doc: doc,
                      selectValue: selectValue,
                      sellerId: sellerId,
                      filterTableData: filterTableData,
                      setAutoSalesModalOpenFromParent: setAutoSalesModalOpenFromParent,
                      setChangedDoc: setChangedDoc,
                      availableAutoSalesNmIds: availableAutoSalesNmIds,
                      filterByButton: filterByButton,
                      pagesCurrent: pagesCurrent,
                      setSemanticsModalOpenFromArt: setSemanticsModalOpenFromArt,
                      allNotes: allNotes,
                      setReloadNotes: setReloadNotes,
                      permission: permission,
                      setAdvertsArtsListModalFromOpen: setAdvertsArtsListModalFromOpen,
                      setRkList: setRkList,
                      setRkListMode: setRkListMode,
                      setShowArtStatsModalOpen: setShowArtStatsModalOpen,
                      setShowDzhemModalOpen: setShowDzhemModalOpen,
                      calcByDayStats: calcByDayStats,
                      setArtsStatsByDayData: setArtsStatsByDayData,
                  }),
              }
            : null,
        Object.keys(autoSalesProfits ?? []).length == 0
            ? {
                  ...getAdvertsColumn({
                      doc: doc,
                      filterByButton: filterByButton,
                      setFiltersRK: setFiltersRK,
                      filtersRK: filtersRK,
                      selectValue: selectValue,
                      filters: filters,
                      sellerId: sellerId,
                      advertBudgetRules: advertBudgetRules,
                      setAdvertBudgetRules: setAdvertBudgetRules,
                      recalc: recalc,
                      permission: permission,
                      copiedAdvertsSettings: copiedAdvertsSettings,
                      setChangedDoc: setChangedDoc,
                      manageAdvertsActivityCallFunc: manageAdvertsActivityCallFunc,
                      filteredData: filteredData,
                      setArtsStatsByDayData: setArtsStatsByDayData,
                      updateColumnWidth: updateColumnWidth,
                      setCopiedAdvertsSettings: setCopiedAdvertsSettings,
                      setFetchedPlacements: setFetchedPlacements,
                      currentParsingProgress: currentParsingProgress,
                      setDateRange: setDateRange,
                      dateRange: dateRange,
                      getUniqueAdvertIdsFromThePage: getUniqueAdvertIdsFromThePage,
                      setCurrentParsingProgress: setCurrentParsingProgress,
                      setShowArtStatsModalOpen: setShowArtStatsModalOpen,
                  }),
              }
            : {
                  ...getAutoSalesColumn({
                      autoSalesProfits: autoSalesProfits,
                      selectValue: selectValue,
                      doc: doc,
                      filteredData: filteredData,
                      setAutoSalesProfits: setAutoSalesProfits,
                      setChangedDoc: setChangedDoc,
                      showError: showError,
                  }),
              },
        {
            ...getAnalyticsColumn({
                unvalidatedArts: unvalidatedArts,
                stocksByWarehouses: stocksByWarehouses,
                sellerId: sellerId,
            }),
        },
        doc && getUniqueAdvertIdsFromThePage
            ? {
                  ...getPlacementsColumn({
                      placementsDisplayPhrase: placementsDisplayPhrase,
                      currentParsingProgress: currentParsingProgress,
                      selectedSearchPhrase: selectedSearchPhrase,
                      getUniqueAdvertIdsFromThePage: getUniqueAdvertIdsFromThePage,
                      selectValue: selectValue,
                      setSelectedSearchPhrase: setSelectedSearchPhrase,
                      doc: doc,
                      setChangedDoc: setChangedDoc,
                      setFetchedPlacements: setFetchedPlacements,
                      setCurrentParsingProgress: setCurrentParsingProgress,
                      sellerId: sellerId,
                  }),
              }
            : null,
        {...getStocksColumn()},
        {...getDsiColumn()},
        {...getSumColumn()},
        {...getOrdersColumn()},
        {...getSumOrdersColumn()},
        {...getAvgPriceColum()},
        doc ? {...getDrrColumn(doc, selectValue)} : null,
        {...getRomiColumn()},
        doc ? {...getCpoColumn(doc, selectValue)} : null,
        {...getViewsColumn()},
        {...getClicksColumn()},
        {...getCTRColumn()},
        {...getCPCColumn()},
        {...getCPMColumn()},
        {...getOpenCardCountColumn()},
        {...getCRColumn()},
        {...getAddToCardPercentColumn()},
        {...getCardToOrderPercentColumn()},
        {...getAddToCartCountColumn()},
        {...getCPLColumn()},
    ];

    const [filteredSummary, setFilteredSummary] = useState({
        art: '',
        uniqueImtIds: 0,
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        analytics: 0,
        stocks: 0,
        sum_orders: 0,
        romi: 0,
        adverts: 0,
        semantics: null,
    });

    const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    useEffect(() => {
        if (!selectValue) return;
        if (!selectValue[0] || selectValue[0] == '') return;

        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('Operation canceled due to new request.');
        }

        cancelTokenRef.current = axios.CancelToken.source();

        if (doc) setSwitchingCampaignsFlag(true);
        const params = {
            uid: getUid(),
            dateRange: {from: '2023', to: '2024'},
            campaignName: selectValue[0],
        };
        console.log(params);

        callApi(`getMassAdvertsNew`, params, true)
            .then(async (res) => {
                console.log(res);
                if (!res) return;
                const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
                    seller_id: sellerId,
                });
                const advertsSchedules = await ApiClient.post('massAdvert/get-schedules', {
                    seller_id: sellerId,
                });
                const autoSales = await ApiClient.post('massAdvert/get-sales-rules', {
                    seller_id: sellerId,
                });
                const resData = res['data'];

                console.log('advertsAutoBidsRules', advertsAutoBidsRules);

                resData['advertsAutoBidsRules'][selectValue[0]] = advertsAutoBidsRules?.data;
                resData['advertsSchedules'][selectValue[0]] = advertsSchedules?.data;
                resData['autoSales'][selectValue[0]] = autoSales?.data;
                setChangedDoc(resData);
                setSwitchingCampaignsFlag(false);
                console.log(resData);
            })
            .catch(() => {
                setSwitchingCampaignsFlag(false);
            });

        setCopiedAdvertsSettings({advertId: 0});

        return () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Component unmounted or selectValue changed.');
            }
        };
    }, [selectValue]);

    const getBidderRules = async () => {
        if (!doc) return;
        const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
            seller_id: sellerId,
        });
        doc.advertsAutoBidsRules[selectValue[0]] = advertsAutoBidsRules?.data;
        setChangedDoc({...doc});
    };

    useEffect(() => {
        getBidderRules();
    }, [advertBudgetRules]);

    if (fetchedPlacements) {
        for (const [phrase, phraseData] of Object.entries(fetchedPlacements)) {
            if (!phrase || !phraseData) continue;
            const {data, updateTime, cpms} = phraseData as any;
            if (!data || !updateTime) continue;
            if (!Object.keys(data).length) continue;
            if (!doc.fetchedPlacements[phrase]) doc.fetchedPlacements[phrase] = {};
            if (
                !doc.fetchedPlacements[phrase]['data'] ||
                (doc.fetchedPlacements[phrase]['updateTime'] &&
                    new Date(doc.fetchedPlacements[phrase]['updateTime']).getTime() / 1000 / 60 > 2)
            ) {
                doc.fetchedPlacements[phrase]['data'] = {};
                doc.fetchedPlacements[phrase]['cpms'] = {};
            }
            doc.fetchedPlacements[phrase]['updateTime'] = updateTime;
            Object.assign(doc.fetchedPlacements[phrase]['data'], data);
            Object.assign(doc.fetchedPlacements[phrase]['cpms'], cpms);
        }

        console.log(doc);
        setChangedDoc({...doc});

        setFetchedPlacements(undefined);
    }

    const anchorRef = useRef(null);

    const getRoundValue = (a: any, b: any, isPercentage = false, def = 0) => {
        let result = b ? a / b : def;
        if (isPercentage) {
            result = Math.round(result * 100 * 100) / 100;
        } else {
            result = Math.round(result);
        }
        return result;
    };

    useEffect(() => {
        recalc(dateRange);
    }, [filtersRK]);

    const [firstRecalc, setFirstRecalc] = useState(false);

    const [changedColumns, setChangedColumns] = useState<any>(false);

    // const [auctionFilters, setAuctionFilters] = useState({undef: false});
    // const [auctionTableData, setAuctionTableData] = useState<any[]>([]);
    // const [auctionFiltratedTableData, setAuctionFiltratedTableData] = useState<any[]>([]);
    // const filterAuctionData = (withfFilters = {}, tableData = {}) => {};

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc(dateRange, selectValue[0], filters, changedDoc);
    }

    if (changedColumns) {
        setChangedColumns(false);
    }

    if (!doc)
        return isMobile ? (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LogoLoad />
            </div>
        ) : (
            <MassAdvertPageSkeleton />
        );

    if (dateChangeRecalc) {
        setFetchingDataFromServerFlag(true);
        setDateChangeRecalc(false);

        callApi('calcMassAdvertsNew', {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: getNormalDateRange(dateRange),
        }).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['campaigns'][selectValue[0]] = resData['campaigns'][selectValue[0]];
            doc['balances'][selectValue[0]] = resData['balances'][selectValue[0]];
            doc['plusPhrasesTemplates'][selectValue[0]] =
                resData['plusPhrasesTemplates'][selectValue[0]];
            doc['advertsPlusPhrasesTemplates'][selectValue[0]] =
                resData['advertsPlusPhrasesTemplates'][selectValue[0]];
            doc['advertsSelectedPhrases'][selectValue[0]] =
                resData['advertsSelectedPhrases'][selectValue[0]];
            doc['advertsAutoBidsRules'][selectValue[0]] =
                resData['advertsAutoBidsRules'][selectValue[0]];
            doc['adverts'][selectValue[0]] = resData['adverts'][selectValue[0]];
            // doc['placementsAuctions'][selectValue[0]] =
            // resData['placementsAuctions'][selectValue[0]];
            doc['advertsSchedules'][selectValue[0]] = resData['advertsSchedules'][selectValue[0]];

            setChangedDoc({...doc});

            setDateChangeRecalc(false);
            setFetchingDataFromServerFlag(false);
            console.log(doc);
        });

        setPagesCurrent(1);
    }

    if (!firstRecalc) {
        console.log(doc);

        for (let i = 0; i < columnData.length; i++) {
            const {name, valueType} = columnData[i] ?? {};
            if (!name) continue;
            if (!filters[name])
                filters[name] = {val: '', compMode: valueType != 'text' ? 'bigger' : 'include'};
        }
        setFilters({...filters});

        setFirstRecalc(true);
    }

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            {isMobile ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: 16,
                    }}
                >
                    <RangePicker
                        args={{
                            align: 'column',
                            recalc,
                            dateRange,
                            setDateRange,
                            anchorRef,
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
            <StatisticsPanel />
            {!isMobile ? (
                <UpTableActions
                    doc={doc}
                    permission={permission}
                    setAutoSalesProfits={setAutoSalesProfits}
                    sellerId={sellerId}
                    setAdvertBudgetRules={setAdvertBudgetRules}
                    selectValue={selectValue}
                    dateRange={dateRange}
                    setChangedDoc={setChangedDoc}
                    setChangedDocUpdateType={setChangedDocUpdateType}
                    filteredData={filteredData}
                    getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                    advertBudgetRules={advertBudgetRules}
                    manageAdvertsActivityCallFunc={manageAdvertsActivityCallFunc}
                    recalc={recalc}
                    setDateRange={setDateRange}
                    anchorRef={anchorRef}
                    filterByButton={filterByButton}
                    setCurrentParsingProgress={setCurrentParsingProgress}
                    setArtsStatsByDayData={setArtsStatsByDayData}
                    currentParsingProgress={currentParsingProgress}
                    setFetchedPlacements={setFetchedPlacements}
                    updateColumnWidth={updateColumnWidth}
                />
            ) : (
                <div style={{marginBottom: 80}} />
            )}

            {isMobile ? (
                <></>
            ) : (
                <TheTable
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    footerData={[filteredSummary]}
                    tableId={'massAdverts'}
                    usePagination={true}
                    onPaginationUpdate={({page, paginatedData}: any) => {
                        setPagesCurrent(page);
                        setFilteredSummary((row) => {
                            const temp = row;
                            temp.art = `На странице SKU: ${paginatedData.length} Всего SKU: ${filteredData.length} ID КТ: ${temp.uniqueImtIds}`;

                            return temp;
                        });
                    }}
                    defaultPaginationSize={300}
                    width="100%"
                    height="calc(100vh - 68px - 70px - 38px)"
                />
            )}
        </div>
    );
};
