'use client';

import {useEffect, useMemo, useState} from 'react';
import {Spin, Icon, Button, Text} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import {ChartAreaStacked, Copy, FileText, FileArrowDown} from '@gravity-ui/icons';

import callApi, {getUid} from '@/utilities/callApi';
import TheTable, {compare} from '@/components/TheTable';
import {
    daysInMonth,
    daysInPeriod,
    defaultRender,
    getDateFromLocaleMonthName,
    getDateFromLocaleString,
    getLocaleDateString,
    getMonth,
    getNormalDateRange,
    getRoundValue,
    renderAsPercent,
} from '@/utilities/getRoundValue';
import {TagsFilterModal} from '@/components/TagsFilterModal';
import {CalcAutoPlansModal} from './CalcAutoPlansModal';
import {AnalyticsCalcModal} from './AnalyticsCalcModal';
import {PlansUpload} from './PlansUpload';
import {ManageDeletionOfOldPlansModal} from './ManageDeletionOfOldPlansModal';
import {getUserDoc} from './hooks';
import {useCampaign} from '@/contexts/CampaignContext';
import ApiClient from '@/utilities/ApiClient';
import {useModules} from '@/contexts/ModuleProvider';
import {AutoPlanModal} from './ui/AutoPlanModal';
import {autoPlanModalStore} from '@/pages/AnalyticsPage/stores/';
import {colors} from '@/pages/AnalyticsPage/config/colors';
import {AnalyticChartModal} from '@/pages/AnalyticsPage/ui/ChartModal';
import {chartModalStore} from '@/pages/AnalyticsPage/stores/modals/chartModal';
import {
    addToCartCountColumn,
    addToCartPercentColumn,
    avgCostColumn,
    buyoutsPercentColumn,
    cartToOrderPercentColumn,
    clicksColumn,
    cpcColumn,
    cplColumn,
    cpmColumn,
    crColumn,
    ctrColumn,
    dateColumn,
    drrOrdersColum,
    drrSalesColumn,
    entityColumn,
    expensesColumn,
    logisticsColum,
    logisticsPercentColumn,
    oborColumn,
    oborSalesColumn,
    openCardCountColumn,
    orderPriceColumn,
    ordersColumn,
    primeCostColumn,
    profitColumn,
    rentabelnostColumn,
    rentPrimeCostColumn,
    rentSalesColumn,
    romiColumn,
    salesColumn,
    salesPrimeCostColum,
    skuInStockColumn,
    sppPriceColumn,
    stocksColumn,
    storageCostColumn,
    sumColumn,
    sumOrdersColumn,
    sumSalesColumn,
    taxColumn,
    viewsColumn,
} from '@/pages/AnalyticsPage/config/tableColumns';

export const AnalyticsPage = () => {
    console.log('FULL RERENDERING');
    const {setPlanModalOpen, setGraphModalTitle, setPlanModalPlanValueValid} = autoPlanModalStore;
    const {setGraphModalOpen, setCurrentGraphMetrics, setGraphModalData, setGraphModalTimeline} =
        chartModalStore;
    const {selectValue, setSwitchingCampaignsFlag, sellerId} = useCampaign();
    const {availablemodulesMap} = useModules();
    const permission: string = useMemo(() => {
        return availablemodulesMap['analytics'];
    }, [availablemodulesMap]);

    const [planModalOpenFromEntity, setPlanModalOpenFromEntity] = useState('');
    const [planModalKey, setPlanModalKey] = useState('');
    const [planModalPlanValue, setPlanModalPlanValue] = useState('');

    const renderWithGraph = (
        {value, row}: any,
        key: string,
        title: string,
        metrics: any = undefined,
        defaultRenderFunction = defaultRender as any,
    ) => {
        if (value === undefined) return undefined;
        if (!metrics) metrics = [key];

        const {isReverseGrad, planType} = columnDataObj[key];

        const {graphData, entity} = row;

        const getDayPlanForDate = (inputDate: any, argEntity = '') => {
            if (!inputDate) return 0;

            const type = enteredKeysDateTypeLastCalc;
            let date = inputDate;

            const _entity = argEntity != '' ? argEntity : entity;

            if (type == 'day') {
                date = getDateFromLocaleString(date);
            } else if (type == 'week') {
                date = new Date(date);
            } else if (type == 'month') {
                const month = date.split(' ');
                if (!month[0] || !month[1]) return 0;
                date = getDateFromLocaleMonthName(month[0], month[1]);
            } else if (type == 'period') {
                date = getDateFromLocaleString(date.slice(0, 10));
            }

            const monthName = getMonth(date);

            let {dayPlan} =
                doc.plansData[selectValue[0]][_entity] &&
                doc.plansData[selectValue[0]][_entity][key] &&
                doc.plansData[selectValue[0]][_entity][key][monthName]
                    ? doc.plansData[selectValue[0]][_entity][key][monthName]
                    : {dayPlan: 0};

            if (type == 'week') dayPlan *= 7;
            if (type == 'month') dayPlan *= daysInMonth(date);

            if (type == 'period') dayPlan *= daysInPeriod(inputDate);

            return dayPlan;
        };

        const planDefaultRender = (dayPlanPreCalc = 0) => {
            const dayPlan = dayPlanPreCalc ? dayPlanPreCalc : getDayPlanForDate(row.date);

            const planPercent = getRoundValue(value, dayPlan, true);
            let percentColorTemp = 'primary';
            if (isReverseGrad) {
                percentColorTemp =
                    planPercent <= 100 ? 'positive' : planPercent <= 150 ? 'warning' : 'danger';
            } else {
                percentColorTemp =
                    planPercent < 80 ? 'danger' : planPercent < 100 ? 'warning' : 'positive';
            }
            const percentColor = percentColorTemp as any;

            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    {defaultRenderFunction({value})}
                    <div style={{minWidth: 4}} />
                    {dayPlan ? (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            /
                            <div style={{minWidth: 4}} />
                            <Text color="secondary">{defaultRenderFunction({value: dayPlan})}</Text>
                            <div style={{minWidth: 4}} />
                            /
                            <div style={{minWidth: 4}} />
                            <Text color={percentColor}>
                                {renderAsPercent({value: planPercent})}
                            </Text>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            );
        };

        if (!row.isSummary) return planDefaultRender();

        const calcSumPlanForDisplayedDays = (argGraphData = [] as any, argEntity = '') => {
            const _graphData =
                argGraphData && argGraphData['timeline'] && argGraphData['timeline'].length
                    ? argGraphData
                    : graphData;
            // console.log(_graphData, argGraphData, entity);

            const _entity = argEntity != '' ? argEntity : entity;
            let res = 0;
            for (let i = 0; i < _graphData['timeline'].length; i++) {
                const time = _graphData['timeline'][i];
                const type = _graphData['timelineDisplayed'][i];
                let dayPlan = getDayPlanForDate(getLocaleDateString(new Date(time), 10), _entity);
                if (type == 'week') dayPlan *= 7;
                if (type == 'month') dayPlan *= daysInMonth(time);
                res += dayPlan ?? 0;
            }
            const divider = planType == 'avg' ? _graphData['timeline'].length : 1;
            return getRoundValue(res, divider);
        };

        const calcSumPlanForDisplayedDaysMainSummary = () => {
            let res = 0;
            let count = 0;
            for (const tableRow of filteredData) {
                const {graphData, isSummary, entity} = tableRow;
                if (!isSummary || !graphData || !graphData['timeline']) continue;

                const calculatedSum = calcSumPlanForDisplayedDays(graphData, entity) ?? 0;
                res += calculatedSum;
                count += calculatedSum ? 1 : 0;
            }
            const divider = planType == 'avg' ? count : 1;
            return getRoundValue(res, divider);
        };

        if (row.isMainSummary) return planDefaultRender(calcSumPlanForDisplayedDaysMainSummary());

        const graphModalDataTemp: any = {};
        for (const [metric, metricData] of Object.entries(graphData)) {
            graphModalDataTemp[metric] = metricData;
        }

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                {planDefaultRender(calcSumPlanForDisplayedDays())}
                <div style={{minWidth: 8}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        disabled={!graphData}
                        size="xs"
                        view="outlined"
                        onClick={() => {
                            setGraphModalData(graphModalDataTemp);
                            setGraphModalTimeline(graphData['timeline']);
                            setGraphModalTitle(title);
                            setGraphModalOpen(true);
                            setCurrentGraphMetrics(metrics);
                        }}
                    >
                        <Icon data={ChartAreaStacked} size={13} />
                    </Button>
                    <div style={{minWidth: 8}} />
                    <Button
                        disabled={!graphData || permission != 'Управление'}
                        size="xs"
                        view="outlined"
                        onClick={() => {
                            setGraphModalTitle(title);
                            setPlanModalOpen(true);
                            setPlanModalPlanValue('');
                            setPlanModalKey(key);
                            setPlanModalOpenFromEntity(entity);
                            setPlanModalPlanValueValid(false);
                        }}
                    >
                        <Icon data={FileText} size={13} />
                    </Button>
                </div>
            </div>
        );
    };

    const renderFilterByClickButton = ({value}: {value: any}, key: string) => {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Button
                    style={{height: 'fit-content'}}
                    size="xs"
                    width="max"
                    pin="round-round"
                    view="outlined"
                    onClick={() => {
                        filterByClick(value, key);
                    }}
                >
                    <Text style={{whiteSpace: 'pre-wrap', height: 'fit-content'}}>{value}</Text>
                </Button>
                <div style={{minWidth: 5}} />
                <Button
                    size="xs"
                    view="outlined"
                    pin="round-round"
                    onClick={() => {
                        navigator.clipboard.writeText(value);
                    }}
                >
                    <Icon data={Copy} size={13} />
                </Button>
            </div>
        );
    };

    const columnDataObj: any = {
        ...entityColumn(renderFilterByClickButton),
        ...dateColumn(),
        ...sumColumn(renderWithGraph),
        ...sumOrdersColumn(renderWithGraph),
        ...ordersColumn(renderWithGraph),
        ...avgCostColumn(renderWithGraph),
        ...sumSalesColumn(renderWithGraph),
        ...salesColumn(renderWithGraph),
        ...profitColumn(renderWithGraph),
        ...rentabelnostColumn(renderWithGraph),
        ...rentSalesColumn(renderWithGraph),
        ...rentPrimeCostColumn(renderWithGraph),
        ...salesPrimeCostColum(renderWithGraph),
        ...taxColumn(renderWithGraph),
        ...expensesColumn(renderWithGraph),
        ...logisticsColum(renderWithGraph),
        ...logisticsPercentColumn(renderWithGraph),
        ...drrOrdersColum(renderWithGraph),
        ...drrSalesColumn(renderWithGraph),
        ...romiColumn(renderWithGraph),
        ...stocksColumn(renderWithGraph),
        ...skuInStockColumn(renderWithGraph),
        ...primeCostColumn(renderWithGraph),
        ...oborColumn(renderWithGraph),
        ...oborSalesColumn(renderWithGraph),
        ...orderPriceColumn(renderWithGraph),
        ...buyoutsPercentColumn(renderWithGraph),
        ...crColumn(renderWithGraph),
        ...addToCartPercentColumn(renderWithGraph),
        ...cartToOrderPercentColumn(renderWithGraph),
        ...storageCostColumn(renderWithGraph),
        ...viewsColumn(renderWithGraph),
        ...clicksColumn(renderWithGraph),
        ...ctrColumn(renderWithGraph),
        ...cpcColumn(renderWithGraph),
        ...cpmColumn(renderWithGraph),
        ...openCardCountColumn(renderWithGraph),
        ...sppPriceColumn(renderWithGraph),
        ...addToCartCountColumn(renderWithGraph),
        ...cplColumn(renderWithGraph),
    };
    const [columnsDataToShow, setColumnsDataToShow] = useState([] as any);

    const getColumnsData = async () => {
        try {
            const params = {seller_id: sellerId};
            const response = await ApiClient.post('analytics/get-columns-analytics', params);
            if (!response?.data) {
                throw new Error('No columns Data');
            }
            const data = response.data;
            if (!data.columns) {
                throw new Error('No columns Data');
            }
            console.log(data.columns);
            const columns = Object.keys(columnDataObj);
            const columnsData = data.columns;
            const columnsKeyData = columnsData.map((column: any) => column.key);
            const columnsNotExists = columns.filter((x) => !columnsKeyData.includes(x));
            for (const column of columnsNotExists) {
                columnsData.push({key: column, visibility: true});
            }
            if (
                [
                    'ИП Иосифова Р. И.',
                    'ИП Иосифов А. М.',
                    'ИП Иосифов М.С.',
                    'ИП Галилова',
                    'ИП Мартыненко',
                    'ТОРГМАКСИМУМ',
                ].includes(selectValue[0])
            )
                for (let i = 0; i < columnsData.length; i++) {
                    columnsData[i]['visibility'] = true;
                }
            console.log('columnsData', columnsData);
            setColumnsDataToShow(columnsData);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getColumnsData();
    }, [sellerId]);
    const [columnsArray, setColumnsArray] = useState([] as any);
    useEffect(() => {
        setColumnsArray(columnsDataToShow);
    }, [columnsDataToShow]);

    const columnDataReversed = (() => {
        const temp: any = {};
        for (const metric of Object.keys(columnDataObj).slice(2)) {
            const {placeholder} = columnDataObj[metric];
            temp[placeholder] = metric;
        }
        return temp;
    })();
    // : columnTempState;

    const [entityKeysLastCalc, setEntityKeysLastCalc] = useState([] as any[]);
    const [enteredKeysDateTypeLastCalc, setEnteredKeysDateTypeLastCalc] = useState('');

    const [filters, setFilters] = useState<any>({undef: false});

    useEffect(() => {
        console.log('Filters', filters);
    }, [filters]);

    const filterByClick = (val: any, key: string, compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );

    const [dateRange] = useState([today, today]);

    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        console.log('FILTERED DATA', filteredData);
    }, [filteredData]);

    const columnData = (() => {
        const temp = [] as any[];
        for (const key of columnsArray) {
            const name = key.key;
            const tempColumn = columnDataObj[name] ?? {};
            tempColumn['name'] = name;
            temp.push(tempColumn);
        }
        return temp;
    })();

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const filterByButton = (val: any, key = 'entity', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    useEffect(() => {
        if (!selectValue || !doc) return;
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: getNormalDateRange(dateRange),
        };

        if (!Object.keys(doc['analyticsData'][selectValue[0]]).length) {
            callApi('getAnalytics', params, true).then((res) => {
                if (!res) return;
                const resData = res['data'];
                doc['analyticsData'][selectValue[0]] = resData['analyticsData'][selectValue[0]];
                doc['plansData'][selectValue[0]] = resData['plansData'][selectValue[0]];

                setChangedDoc({...doc});

                setSwitchingCampaignsFlag(false);
                console.log(doc);
            });
        } else {
            setSwitchingCampaignsFlag(false);
        }
        recalc(selectValue[0], filters);
    }, [selectValue]);

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0]);

    const recalc = (selected = '', withfFilters = {}) => {
        console.log('RECALC WORKING');
        const campaignData = doc
            ? doc.analyticsData[selected === '' ? selectValue[0] : selected]
            : {};

        setTableData(campaignData);

        filterTableData(withfFilters, campaignData);
    };

    const [filteredSummary, setFilteredSummary] = useState({});

    const filterTableData = (withFilters: any = {}, tableData = {}) => {
        console.log('FILTER TABLE DATA, WORKING');
        const temp = [] as any;

        for (const [entity, entityInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!entity || !entityInfo) continue;

            for (const [date, dateStats] of Object.entries(entityInfo)) {
                if (date === undefined || dateStats === undefined) continue;
                const tempTypeRow: any = {};

                tempTypeRow['isSummary'] = false;
                tempTypeRow['entity'] = entity;
                tempTypeRow['date'] = date;
                tempTypeRow['orders'] = dateStats['orders'];
                tempTypeRow['notes'] = dateStats['notes'];
                tempTypeRow['sum_orders'] = dateStats['sum_orders'];
                tempTypeRow['sales'] = dateStats['sales'];
                tempTypeRow['sum_sales'] = dateStats['sum_sales'];

                tempTypeRow['profit'] = Math.round(dateStats['profit']);
                tempTypeRow['salesPrimeCost'] = dateStats['salesPrimeCost'];
                tempTypeRow['comission'] = dateStats['comission'];
                tempTypeRow['tax'] = dateStats['tax'];
                tempTypeRow['expences'] = dateStats['expences'];
                tempTypeRow['logistics'] = dateStats['logistics'];

                tempTypeRow['logisticsPercent'] = getRoundValue(
                    tempTypeRow['logistics'],
                    tempTypeRow['sum_sales'],
                    true,
                );

                tempTypeRow['rentabelnost'] = getRoundValue(
                    tempTypeRow['profit'],
                    tempTypeRow['sum_orders'],
                    true,
                );
                tempTypeRow['rentSales'] = getRoundValue(
                    tempTypeRow['profit'],
                    tempTypeRow['sum_sales'],
                    true,
                );
                tempTypeRow['rentPrimeCost'] = getRoundValue(
                    tempTypeRow['profit'],
                    tempTypeRow['salesPrimeCost'],
                    true,
                );
                tempTypeRow['clicks'] = dateStats['clicks'];
                tempTypeRow['views'] = dateStats['views'];
                tempTypeRow['ctr'] = getRoundValue(
                    tempTypeRow['clicks'],
                    tempTypeRow['views'],
                    true,
                );
                tempTypeRow['sum'] = dateStats['sum'];

                tempTypeRow['cpc'] = getRoundValue(
                    tempTypeRow['sum'] / 100,
                    tempTypeRow['clicks'],
                    true,
                    tempTypeRow['sum'] / 100,
                );
                tempTypeRow['cpm'] = getRoundValue(tempTypeRow['sum'], tempTypeRow['views'] / 1000);

                tempTypeRow['sppPrice'] = dateStats['sppPrice'];

                tempTypeRow['cr'] = dateStats['cr'];
                tempTypeRow['cpl'] = dateStats['cpl'];

                tempTypeRow['openCardCount'] = dateStats['openCardCount'];
                tempTypeRow['addToCartCount'] = dateStats['addToCartCount'];
                tempTypeRow['addToCartPercent'] = dateStats['addToCartPercent'];
                tempTypeRow['cartToOrderPercent'] = dateStats['cartToOrderPercent'];
                tempTypeRow['storageCost'] = dateStats['storageCost'];
                tempTypeRow['expectedSales'] = dateStats['expectedSales'];
                tempTypeRow['expectedSalesForBuyoutsPercent'] = dateStats[
                    'expectedSalesForBuyoutsPercent'
                ]
                    ? dateStats['expectedSalesForBuyoutsPercent']
                    : tempTypeRow['sales'];

                tempTypeRow['buyoutsPercent'] = getRoundValue(
                    tempTypeRow['expectedSalesForBuyoutsPercent'],
                    tempTypeRow['orders'],
                    true,
                    tempTypeRow['expectedSalesForBuyoutsPercent'],
                );

                tempTypeRow['drr_orders'] = getRoundValue(
                    tempTypeRow['sum'],
                    tempTypeRow['sum_orders'],
                    true,
                    tempTypeRow['sum'] ? 1 : 0,
                );
                tempTypeRow['drr_sales'] = getRoundValue(
                    tempTypeRow['sum'],
                    tempTypeRow['sum_sales'],
                    true,
                    tempTypeRow['sum'] ? 1 : 0,
                );

                tempTypeRow['romi'] = getRoundValue(
                    tempTypeRow['profit'],
                    tempTypeRow['sum'],
                    true,
                );

                tempTypeRow['stocks'] = dateStats['stocks'];
                tempTypeRow['skuInStock'] = dateStats['skuInStock'];
                tempTypeRow['primeCost'] = dateStats['primeCost'];
                tempTypeRow['obor'] = getRoundValue(
                    dateStats['stocks'],
                    dateStats['orders'],
                    false,
                    dateStats['stocks'] ? 999 : 0,
                );
                tempTypeRow['oborSales'] = getRoundValue(
                    dateStats['stocks'],
                    dateStats['expectedSales'],
                    false,
                    dateStats['stocks'] ? 999 : 0,
                );
                tempTypeRow['orderPrice'] = getRoundValue(
                    dateStats['sum'],
                    dateStats['orders'],
                    false,
                    dateStats['sum'],
                );
                tempTypeRow['cpl'] = getRoundValue(
                    dateStats['sum'],
                    dateStats['addToCartCount'],
                    false,
                    dateStats['sum'],
                );
                tempTypeRow['cr'] = getRoundValue(
                    dateStats['orders'],
                    dateStats['openCardCount'],
                    true,
                );
                tempTypeRow['avgCost'] = getRoundValue(
                    dateStats['sum_orders'],
                    dateStats['orders'],
                );

                let addFlag = true;
                const useFilters = withFilters['undef'] ? withFilters : filters;
                for (const [filterArg, data] of Object.entries(useFilters)) {
                    const filterData: any = data;
                    if (filterArg === 'undef' || !filterData) continue;
                    if (filterData['val'] === '') continue;

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

                if (addFlag) {
                    temp.push(tempTypeRow);
                }
            }
        }

        const summaries: any = {
            filteredSummaryTemp: {
                orders: 0,
                sum_orders: 0,
                sales: 0,
                sum_sales: 0,
                salesPrimeCost: 0,
                comission: 0,
                tax: 0,
                expences: 0,
                logistics: 0,
                profit: 0,
                obor: 0,
                obor_temp: {count: 0, val: 0},
                oborSales: 0,
                oborSales_temp: {count: 0, val: 0},
                orderPrice: 0,
                avgCost: 0,
                stocks: 0,
                stocks_temp: {count: 0, val: 0},
                skuInStock: 0,
                skuInStock_temp: {count: 0, val: 0},
                primeCost: 0,
                primeCost_temp: {count: 0, val: 0},
                rentabelnost: 0,
                expectedSalesForBuyoutsPercent: 0,
                sum: 0,
                buyoutsPercent: 0,
                expectedSales: 0,
                romi: 0,
                addToCartPercent: 0,
                cartToOrderPercent: 0,
                addToCartCount: 0,
                openCardCount: 0,
                cr: 0,
                cpl: 0,
                storageCost: 0,
                clicks: 0,
                views: 0,
                ctr: 0,
                sppPrice: 0,
                sppPrice_temp: {count: 0, val: 0},
            },
        };

        const summaryAdd = (row: any, key: string, value: any) => {
            const {entity} = row;

            const val = value ?? row[key];
            summaries[entity][key] += val;
            if (!summaries[entity]['graphData'][key]) summaries[entity]['graphData'][key] = [];
            summaries[entity]['graphData'][key].push(val);

            if (!summaries[entity]['trendGraphData'][key])
                summaries[entity]['trendGraphData'][key] = [0];

            const i = summaries[entity]['graphData'][key].length - 1;
            if (i > 0) {
                const trend =
                    getRoundValue(
                        summaries[entity]['graphData'][key][i],
                        summaries[entity]['graphData'][key][i - 1],
                        true,
                    ) - 100;

                summaries[entity]['trendGraphData'][key].push(trend);
            }
        };

        temp.sort((rowA: any, rowB: any) => {
            let dateA: any, dateB: any;
            const dots = rowA.date.split('.').length - 1;

            if (dots == 2) {
                dateA = getDateFromLocaleString(rowA.date);
                dateB = getDateFromLocaleString(rowB.date);
            }
            if (dots == 4) {
                dateA = getDateFromLocaleString(rowA.date.slice(0, 10));
                dateB = getDateFromLocaleString(rowB.date.slice(0, 10));
            }
            if (dots == 0) {
                const monthA = rowA.date.split(' ');
                const monthB = rowB.date.split(' ');

                dateA = getDateFromLocaleMonthName(monthA[0], monthA[1]);
                dateB = getDateFromLocaleMonthName(monthB[0], monthB[1]);
            }

            return dateA.getTime() - dateB.getTime();
        });

        for (const row of temp) {
            const {entity} = row;
            if (!summaries[entity])
                summaries[entity] = {
                    orders: 0,
                    sum_orders: 0,
                    sales: 0,
                    sum_sales: 0,
                    salesPrimeCost: 0,
                    comission: 0,
                    tax: 0,
                    expences: 0,
                    logistics: 0,
                    logisticsPrecent: 0,
                    profit: 0,
                    obor: 0,
                    obor_temp: {count: 0, val: 0},
                    oborSales: 0,
                    oborSales_temp: {count: 0, val: 0},
                    orderPrice: 0,
                    avgCost: 0,
                    stocks: 0,
                    stocks_temp: {count: 0, val: 0},
                    skuInStock: 0,
                    skuInStock_temp: {count: 0, val: 0},
                    primeCost: 0,
                    primeCost_temp: {count: 0, val: 0},
                    rentabelnost: 0,
                    sum: 0,
                    graphData: {
                        timeline: [],
                        timelineDisplayed: [],
                    },
                    trendGraphData: {},
                    buyoutsPercent: 0,
                    expectedSalesForBuyoutsPercent: 0,
                    addToCartPercent: 0,
                    cartToOrderPercent: 0,
                    addToCartCount: 0,
                    expectedSales: 0,
                    openCardCount: 0,
                    storageCost: 0,
                    cr: 0,
                    cpl: 0,
                    clicks: 0,
                    views: 0,
                    ctr: 0,
                    sppPrice: 0,
                    sppPrice_temp: {count: 0, val: 0},
                };

            summaries[entity]['entity'] = entity;

            summaries[entity]['isSummary'] = true;
            summaryAdd(row, 'orders', undefined);
            summaryAdd(row, 'sum_orders', undefined);
            summaryAdd(row, 'sales', undefined);
            summaryAdd(row, 'expectedSales', undefined);
            summaryAdd(row, 'expectedSalesForBuyoutsPercent', undefined);
            summaryAdd(row, 'sum_sales', undefined);
            summaryAdd(row, 'sum', undefined);

            summaryAdd(row, 'profit', undefined);
            summaryAdd(row, 'salesPrimeCost', undefined);
            summaryAdd(row, 'comission', undefined);
            summaryAdd(row, 'tax', undefined);
            summaryAdd(row, 'expences', undefined);
            summaryAdd(row, 'logistics', undefined);
            summaryAdd(row, 'logisticsPercent', undefined);
            summaries[entity]['logisticsPercent'] = getRoundValue(
                summaries[entity]['logistics'],
                summaries[entity]['sum_sales'],
                true,
            );

            summaryAdd(row, 'clicks', undefined);
            summaryAdd(row, 'views', undefined);
            summaryAdd(row, 'ctr', undefined);
            summaries[entity]['ctr'] = getRoundValue(
                summaries[entity]['clicks'],
                summaries[entity]['views'],
                true,
            );
            summaryAdd(row, 'cpc', undefined);
            summaries[entity]['cpc'] = getRoundValue(
                summaries[entity]['sum'] / 100,
                summaries[entity]['clicks'],
                true,
                summaries[entity]['sum'] / 100,
            );
            summaryAdd(row, 'cpm', undefined);
            summaries[entity]['cpm'] = getRoundValue(
                summaries[entity]['sum'],
                summaries[entity]['views'] / 1000,
            );

            summaryAdd(row, 'openCardCount', undefined);
            summaryAdd(row, 'addToCartCount', undefined);
            summaryAdd(row, 'buyoutsPercent', undefined);
            summaryAdd(row, 'addToCartPercent', undefined);
            summaryAdd(row, 'cartToOrderPercent', undefined);
            summaryAdd(row, 'storageCost', undefined);
            summaries[entity]['buyoutsPercent'] = getRoundValue(
                summaries[entity]['expectedSalesForBuyoutsPercent'],
                summaries[entity]['orders'],
                true,
                summaries[entity]['expectedSalesForBuyoutsPercent'],
            );
            summaries[entity]['addToCartPercent'] = getRoundValue(
                summaries[entity]['addToCartCount'],
                summaries[entity]['openCardCount'],
                true,
            );
            summaries[entity]['cartToOrderPercent'] = getRoundValue(
                summaries[entity]['orders'],
                summaries[entity]['addToCartCount'],
                true,
            );

            summaryAdd(
                row,
                'drr_orders',
                getRoundValue(row['sum'], row['sum_orders'], true, row['sum'] ? 1 : 0),
            );
            summaryAdd(
                row,
                'drr_sales',
                getRoundValue(row['sum'], row['sum_sales'], true, row['sum'] ? 1 : 0),
            );
            summaryAdd(row, 'romi', getRoundValue(row['profit'], row['sum'], true));
            summaryAdd(row, 'rentabelnost', getRoundValue(row['profit'], row['sum_orders'], true));
            summaryAdd(row, 'rentSales', getRoundValue(row['profit'], row['sum_sales'], true));
            summaryAdd(
                row,
                'rentPrimeCost',
                getRoundValue(row['profit'], row['salesPrimeCost'], true),
            );

            const getDate = (inputDate: any) => {
                let date = inputDate;
                const dots = inputDate.split('.').length - 1;

                let type = 'day';
                if (dots == 2) {
                    type = 'day';
                    date = getDateFromLocaleString(date);
                } else if (dots == 4) {
                    type = 'week';
                    date = getDateFromLocaleString(date.slice(0, 10));
                } else if (dots == 0) {
                    type = 'month';
                    const month = date.split(' ');
                    // console.log(month, date, dots);
                    date = getDateFromLocaleMonthName(month[0], month[1]);
                }
                return [date, type];
            };

            const [time, type] = getDate(row['date']);

            time.setHours(0);
            summaries[entity]['graphData']['timeline'].push(time.getTime());
            summaries[entity]['graphData']['timelineDisplayed'].push(type);
            // console.log(time, summaries[entity]['graphData']['timeline']);

            summaries[entity]['drr_orders'] = getRoundValue(
                summaries[entity]['sum'],
                summaries[entity]['sum_orders'],
                true,
                summaries[entity]['sum'] ? 1 : 0,
            );
            summaries[entity]['drr_sales'] = getRoundValue(
                summaries[entity]['sum'],
                summaries[entity]['sum_sales'],
                true,
                summaries[entity]['sum'] ? 1 : 0,
            );
            summaries[entity]['romi'] = getRoundValue(
                summaries[entity]['profit'],
                summaries[entity]['sum'],
                true,
            );
            summaries[entity]['rentabelnost'] = getRoundValue(
                summaries[entity]['profit'],
                summaries[entity]['sum_orders'],
                true,
            );
            summaries[entity]['rentSales'] = getRoundValue(
                summaries[entity]['profit'],
                summaries[entity]['sum_sales'],
                true,
            );
            summaries[entity]['rentPrimeCost'] = getRoundValue(
                summaries[entity]['profit'],
                summaries[entity]['salesPrimeCost'],
                true,
            );

            summaryAdd(row, 'sppPrice', undefined);
            summaries[entity]['sppPrice_temp'].val += row['sppPrice'];
            summaries[entity]['sppPrice_temp'].count += 1;
            summaries[entity]['sppPrice'] = getRoundValue(
                summaries[entity]['sppPrice_temp'].val,
                summaries[entity]['sppPrice_temp'].count,
            );

            summaryAdd(row, 'skuInStock', undefined);
            summaries[entity]['skuInStock_temp'].val += row['skuInStock'];
            summaries[entity]['skuInStock_temp'].count += 1;
            summaries[entity]['skuInStock'] = getRoundValue(
                summaries[entity]['skuInStock_temp'].val,
                summaries[entity]['skuInStock_temp'].count,
            );

            summaryAdd(row, 'stocks', undefined);
            summaries[entity]['stocks_temp'].val += row['stocks'];
            summaries[entity]['stocks_temp'].count += 1;
            summaries[entity]['stocks'] = getRoundValue(
                summaries[entity]['stocks_temp'].val,
                summaries[entity]['stocks_temp'].count,
            );
            summaryAdd(row, 'primeCost', undefined);
            summaries[entity]['primeCost_temp'].val += row['primeCost'];
            summaries[entity]['primeCost_temp'].count += 1;
            summaries[entity]['primeCost'] = row['primeCost'];

            summaryAdd(row, 'obor', undefined);
            summaries[entity]['obor_temp'].val += row['obor'];
            summaries[entity]['obor_temp'].count += 1;
            summaries[entity]['obor'] = getRoundValue(
                summaries[entity]['obor_temp'].val,
                summaries[entity]['obor_temp'].count,
            );

            summaryAdd(row, 'oborSales', undefined);
            summaries[entity]['oborSales_temp'].val += row['oborSales'];
            summaries[entity]['oborSales_temp'].count += 1;
            summaries[entity]['oborSales'] = getRoundValue(
                summaries[entity]['oborSales_temp'].val,
                summaries[entity]['oborSales_temp'].count,
            );

            summaryAdd(row, 'avgCost', undefined);
            summaries[entity]['avgCost'] = getRoundValue(
                summaries[entity]['sum_orders'],
                summaries[entity]['orders'],
            );
            summaryAdd(row, 'orderPrice', undefined);
            summaries[entity]['orderPrice'] = getRoundValue(
                summaries[entity]['sum'],
                summaries[entity]['orders'],
            );
            summaryAdd(row, 'cr', undefined);
            summaries[entity]['cr'] = getRoundValue(
                summaries[entity]['orders'],
                summaries[entity]['openCardCount'],
                true,
            );
            summaryAdd(row, 'cpl', undefined);
            summaryAdd(row, 'cpl', undefined);

            summaries['filteredSummaryTemp']['isSummary'] = true;
            summaries['filteredSummaryTemp']['isMainSummary'] = true;
            summaries['filteredSummaryTemp']['orders'] += row['orders'];
            summaries['filteredSummaryTemp']['sum_orders'] += row['sum_orders'];

            summaries['filteredSummaryTemp']['profit'] += row['profit'];
            summaries['filteredSummaryTemp']['salesPrimeCost'] += row['salesPrimeCost'];
            summaries['filteredSummaryTemp']['comission'] += row['comission'];
            summaries['filteredSummaryTemp']['tax'] += row['tax'];
            summaries['filteredSummaryTemp']['expences'] += row['expences'];
            summaries['filteredSummaryTemp']['logistics'] += row['logistics'];
            summaries['filteredSummaryTemp']['logisticsPercent'] = getRoundValue(
                summaries['filteredSummaryTemp']['logistics'],
                summaries['filteredSummaryTemp']['sum_sales'],
                true,
            );

            summaries['filteredSummaryTemp']['sales'] += row['sales'];
            summaries['filteredSummaryTemp']['expectedSales'] += row['expectedSales'];
            summaries['filteredSummaryTemp']['sum_sales'] += row['sum_sales'];
            summaries['filteredSummaryTemp']['storageCost'] += row['storageCost'];
            summaries['filteredSummaryTemp']['sum'] += row['sum'];
            summaries['filteredSummaryTemp']['drr_orders'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum'],
                summaries['filteredSummaryTemp']['sum_orders'],
                true,
                summaries['filteredSummaryTemp']['sum'] ? 1 : 0,
            );
            summaries['filteredSummaryTemp']['drr_sales'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum'],
                summaries['filteredSummaryTemp']['sum_sales'],
                true,
                summaries['filteredSummaryTemp']['sum'] ? 1 : 0,
            );
            summaries['filteredSummaryTemp']['romi'] = getRoundValue(
                summaries['filteredSummaryTemp']['profit'],
                summaries['filteredSummaryTemp']['sum'],
                true,
            );
            summaries['filteredSummaryTemp']['rentabelnost'] = getRoundValue(
                summaries['filteredSummaryTemp']['profit'],
                summaries['filteredSummaryTemp']['sum_orders'],
                true,
            );
            summaries['filteredSummaryTemp']['rentSales'] = getRoundValue(
                summaries['filteredSummaryTemp']['profit'],
                summaries['filteredSummaryTemp']['sum_sales'],
                true,
            );
            summaries['filteredSummaryTemp']['rentPrimeCost'] = getRoundValue(
                summaries['filteredSummaryTemp']['profit'],
                summaries['filteredSummaryTemp']['salesPrimeCost'],
                true,
            );

            summaries['filteredSummaryTemp']['skuInStock_temp'].val += row['skuInStock'];
            summaries['filteredSummaryTemp']['skuInStock_temp'].count += 1;
            summaries['filteredSummaryTemp']['skuInStock'] = getRoundValue(
                summaries['filteredSummaryTemp']['skuInStock_temp'].val,
                summaries['filteredSummaryTemp']['skuInStock_temp'].count,
            );

            summaries['filteredSummaryTemp']['stocks_temp'].val += row['stocks'];
            summaries['filteredSummaryTemp']['stocks_temp'].count += 1;
            summaries['filteredSummaryTemp']['stocks'] = getRoundValue(
                summaries['filteredSummaryTemp']['stocks_temp'].val,
                summaries['filteredSummaryTemp']['stocks_temp'].count,
            );

            summaries['filteredSummaryTemp']['primeCost_temp'].val += row['primeCost'];
            summaries['filteredSummaryTemp']['primeCost_temp'].count += 1;
            summaries['filteredSummaryTemp']['primeCost'] = getRoundValue(
                summaries['filteredSummaryTemp']['primeCost_temp'].val,
                summaries['filteredSummaryTemp']['primeCost_temp'].count,
            );

            summaries['filteredSummaryTemp']['obor_temp'].val += row['obor'];
            summaries['filteredSummaryTemp']['obor_temp'].count += 1;
            summaries['filteredSummaryTemp']['obor'] = getRoundValue(
                summaries['filteredSummaryTemp']['obor_temp'].val,
                summaries['filteredSummaryTemp']['obor_temp'].count,
            );

            summaries['filteredSummaryTemp']['oborSales_temp'].val += row['obor'];
            summaries['filteredSummaryTemp']['oborSales_temp'].count += 1;
            summaries['filteredSummaryTemp']['oborSales'] = getRoundValue(
                summaries['filteredSummaryTemp']['oborSales_temp'].val,
                summaries['filteredSummaryTemp']['oborSales_temp'].count,
            );

            summaries['filteredSummaryTemp']['avgCost'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum_orders'],
                summaries['filteredSummaryTemp']['orders'],
            );
            summaries['filteredSummaryTemp']['orderPrice'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum'],
                summaries['filteredSummaryTemp']['orders'],
            );

            summaries['filteredSummaryTemp']['views'] += row['views'];
            summaries['filteredSummaryTemp']['clicks'] += row['clicks'];
            summaries['filteredSummaryTemp']['ctr'] = getRoundValue(
                summaries['filteredSummaryTemp']['clicks'],
                summaries['filteredSummaryTemp']['views'],
                true,
            );
            summaries['filteredSummaryTemp']['cpc'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum'] / 100,
                summaries['filteredSummaryTemp']['clicks'],
                true,
                summaries['filteredSummaryTemp']['sum'] / 100,
            );
            summaries['filteredSummaryTemp']['cpm'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum'],
                summaries['filteredSummaryTemp']['views'] / 1000,
            );

            summaries['filteredSummaryTemp']['addToCartCount'] += row['addToCartCount'];
            summaries['filteredSummaryTemp']['openCardCount'] += row['openCardCount'];
            summaries['filteredSummaryTemp']['expectedSalesForBuyoutsPercent'] +=
                row['expectedSalesForBuyoutsPercent'];
            summaries['filteredSummaryTemp']['buyoutsPercent'] = getRoundValue(
                summaries['filteredSummaryTemp']['expectedSalesForBuyoutsPercent'],
                summaries['filteredSummaryTemp']['orders'],
                true,
                summaries['filteredSummaryTemp']['expectedSalesForBuyoutsPercent'],
            );
            summaries['filteredSummaryTemp']['addToCartPercent'] = getRoundValue(
                summaries['filteredSummaryTemp']['addToCartCount'],
                summaries['filteredSummaryTemp']['openCardCount'],
                true,
            );
            summaries['filteredSummaryTemp']['cartToOrderPercent'] = getRoundValue(
                summaries['filteredSummaryTemp']['orders'],
                summaries['filteredSummaryTemp']['addToCartCount'],
                true,
            );

            summaries['filteredSummaryTemp']['sppPrice_temp'].val += row['sppPrice'];
            summaries['filteredSummaryTemp']['sppPrice_temp'].count += 1;
            summaries['filteredSummaryTemp']['sppPrice'] = getRoundValue(
                summaries['filteredSummaryTemp']['sppPrice_temp'].val,
                summaries['filteredSummaryTemp']['sppPrice_temp'].count,
            );
        }

        let primeCostSummaries = 0;
        for (const [entity, entitySummary] of Object.entries(summaries)) {
            if (entity === 'filteredSummaryTemp') continue;
            const {primeCost}: any = entitySummary;
            primeCostSummaries += primeCost ?? 0;

            if (enteredKeysDateTypeLastCalc != 'period') {
                if (entity) temp.push(entitySummary);
                temp.push({entity: entity, isSummary: false, isBlank: true});
            }
        }

        summaries['filteredSummaryTemp'].primeCost = primeCostSummaries;
        setFilteredSummary(summaries['filteredSummaryTemp']);

        temp.sort((rowA: any, rowB: any) => {
            return rowB.isSummary - rowA.isSummary;
        });

        temp.sort((rowA: any, rowB: any) => {
            if (rowA.isBlank && rowB.isBlank) return 0;
            if (rowA.isBlank) return 1;
            if (rowB.isBlank) return -1;

            if (rowA.date == undefined && rowB.date == undefined) return 0;
            if (rowA.date == undefined) return -1;
            if (rowB.date == undefined) return 1;

            let dateA: any, dateB: any;
            const dots = rowA.date.split('.').length - 1;

            if (dots == 2) {
                dateA = getDateFromLocaleString(rowA.date);
                dateB = getDateFromLocaleString(rowB.date);
            }
            if (dots == 4) {
                dateA = getDateFromLocaleString(rowA.date.slice(0, 10));
                dateB = getDateFromLocaleString(rowB.date.slice(0, 10));
            }
            if (dots == 0) {
                const monthA = rowA.date.split(' ');
                const monthB = rowB.date.split(' ');

                dateA = getDateFromLocaleMonthName(monthA[0], monthA[1]);
                dateB = getDateFromLocaleMonthName(monthB[0], monthB[1]);
            }

            return dateB.getTime() - dateA.getTime();
        });

        temp.sort((rowA: any, rowB: any) => {
            return rowA.entity.localeCompare(rowB.entity, 'ru-RU');
        });

        if (enteredKeysDateTypeLastCalc != 'period') temp.pop();

        setFilteredData(temp);
    };

    const [firstRecalc, setFirstRecalc] = useState(false);

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc();
    }

    if (!doc) return <Spin />;
    if (!firstRecalc) {
        console.log(doc);
        recalc(selectValue[0]);
        setFirstRecalc(true);
        setSwitchingCampaignsFlag(false);
    }

    const getPlanDay = (key = '') => {
        const isAvg = key != '' ? columnDataObj[key].planType == 'avg' : false;
        const date = new Date();
        return getRoundValue(
            Number(planModalPlanValue),
            isAvg ? 1 : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        );
    };

    const handleSetPlanButton = () => {
        const monthName = getMonth(new Date());
        const dayPlan = getPlanDay(planModalKey);
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {
                plan: {
                    monthName,
                    dayPlan,
                },
                mode: 'Установить',
                entity: planModalOpenFromEntity,
                planKey: planModalKey,
            },
        };

        if (!doc.plansData[selectValue[0]][planModalOpenFromEntity])
            doc.plansData[selectValue[0]][planModalOpenFromEntity] = {};
        if (!doc.plansData[selectValue[0]][planModalOpenFromEntity][planModalKey])
            doc.plansData[selectValue[0]][planModalOpenFromEntity][planModalKey] = {};
        doc.plansData[selectValue[0]][planModalOpenFromEntity][planModalKey][monthName] = {dayPlan};

        console.log(params);

        //////////////////////////////////
        callApi('setPlanForKey', params);
        setChangedDoc({...doc});
        //////////////////////////////////

        setPlanModalOpen(false);
    };
    const handleDeletePlansButton = () => {
        const monthName = getMonth(new Date());
        const dayPlan = getPlanDay();
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {
                plan: {
                    monthName,
                    dayPlan,
                },
                mode: 'Удалить',
                entity: planModalOpenFromEntity,
                planKey: planModalKey,
            },
        };

        if (
            doc.plansData[selectValue[0]][planModalOpenFromEntity] &&
            doc.plansData[selectValue[0]][planModalOpenFromEntity][planModalKey]
        ) {
            delete doc.plansData[selectValue[0]][planModalOpenFromEntity][planModalKey][monthName];
        }

        console.log(params);

        //////////////////////////////////
        callApi('setPlanForKey', params);
        setChangedDoc({...doc});
        //////////////////////////////////

        setPlanModalOpen(false);
    };

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            <AnalyticChartModal
                setGraphModalTitle={setGraphModalTitle}
                columnDataObj={columnDataObj}
                columnDataReversed={columnDataReversed}
            />
            <AutoPlanModal
                planModalKey={planModalKey}
                getPlanDay={getPlanDay}
                handleDeletePlansButton={handleDeletePlansButton}
                planModalOpenFromEntity={planModalOpenFromEntity}
                planModalPlanValue={planModalPlanValue}
                setPlanModalPlanValue={setPlanModalPlanValue}
                handleSetPlanButton={handleSetPlanButton}
            />
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'start',
                        flexWrap: 'wrap',
                        height: 44,
                    }}
                >
                    <AnalyticsCalcModal
                        doc={doc}
                        setChangedDoc={setChangedDoc}
                        setEntityKeysLastCalc={setEntityKeysLastCalc}
                        setEnteredKeysDateTypeLastCalc={setEnteredKeysDateTypeLastCalc}
                        selectValue={selectValue}
                        dateRangeDefault={dateRange}
                    />
                    <div style={{minWidth: 8}} />
                    <TagsFilterModal filterByButton={filterByButton} />
                    <div style={{minWidth: 8}} />
                    <CalcAutoPlansModal
                        disabled={permission != 'Управление'}
                        filteredData={filteredData}
                        columnDataReversed={columnDataReversed}
                        selectValue={selectValue}
                        entityKeysLastCalc={entityKeysLastCalc}
                        colors={colors}
                        doc={doc}
                        setChangedDoc={setChangedDoc}
                    />
                    <div style={{minWidth: 8}} />
                    <ManageDeletionOfOldPlansModal
                        disabled={permission != 'Управление'}
                        columnDataReversed={columnDataReversed}
                        selectValue={selectValue}
                        colors={colors}
                        doc={doc}
                        setChangedDoc={setChangedDoc}
                        dateRange={dateRange}
                        filteredData={filteredData}
                    />
                </div>
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'end',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{minWidth: 8}} />
                    <Button
                        disabled={permission != 'Управление'}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        size="l"
                        view={'outlined-warning'}
                        onClick={() => {
                            const params = {
                                uid: getUid(),
                                campaignName: selectValue[0],
                                data: {entities: [] as any[]},
                            };

                            for (let i = 0; i < filteredData.length; i++) {
                                const {entity} = filteredData[i];
                                if (!entity) continue;
                                if (!params.data.entities.includes(entity))
                                    params.data.entities.push(entity);
                            }
                            callApi('downloadPlansTemplate', params)
                                .then((res: any) => {
                                    return res.data;
                                })
                                .then((blob) => {
                                    const element = document.createElement('a');
                                    element.href = URL.createObjectURL(blob);
                                    element.download = `Планы на текущий месяц ${selectValue[0]}.xlsx`;
                                    // simulate link click
                                    document.body.appendChild(element);
                                    element.click();
                                });
                        }}
                    >
                        <Text
                            variant="subheader-1"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Icon data={FileArrowDown} size={20} />
                            <div style={{minWidth: 3}} />
                            Скачать планы
                        </Text>
                    </Button>
                    <div style={{minWidth: 8}} />
                    <PlansUpload
                        disabled={permission != 'Управление'}
                        selectValue={selectValue}
                        doc={doc}
                        setChangedDoc={setChangedDoc}
                    />
                    <div style={{minWidth: 8}} />
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TheTable
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    footerData={[filteredSummary]}
                    tableId={'analytics'}
                    usePagination={true}
                    defaultPaginationSize={100}
                    onPaginationUpdate={({paginatedData}: any) => {
                        setFilteredSummary((row) => {
                            const fstemp: any = row;
                            fstemp['entity'] =
                                `Объектов на странице: ${paginatedData.length} Всего объектов: ${filteredData.length}`;

                            return fstemp;
                        });
                    }}
                    height={'calc(100vh - 10em - 52px)'}
                />
            </div>
        </div>
    );
};
