import React, {useEffect, useId, useRef, useState} from 'react';
import {
    Spin,
    Select,
    SelectOption,
    Icon,
    Button,
    Text,
    Pagination,
    List,
    Popover,
    Card,
    Modal,
    TextInput,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

const b = block('app');

import {
    ChevronDown,
    Key,
    Calculator,
    ChartAreaStacked,
    TrashBin,
    FileText,
    CloudArrowUpIn,
    FileArrowDown,
    FileArrowUp,
    LayoutColumns3,
} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare, defaultRender} from 'src/components/TheTable';
import Userfront from '@userfront/toolkit';
import {motion} from 'framer-motion';
import {RangePicker} from 'src/components/RangePicker';
import {
    daysInMonth,
    getMonthName,
    getNormalDateRange,
    getRoundValue,
    renderAsPercent,
} from 'src/utilities/getRoundValue';
import ChartKit from '@gravity-ui/chartkit';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {generateModalButtonWithActions} from './MassAdvertPage';
import axios from 'axios';

const getUserDoc = (dateRange, docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['analyticsData'][selectValue] = docum['analyticsData'][selectValue];
            doc['plansData'][selectValue] = docum['plansData'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getAnalytics', {
            uid: getUid(),
            dateRange: getNormalDateRange(dateRange),
            campaignName:
                selectValue != ''
                    ? selectValue
                    : Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594'
                    ? 'ИП Иосифова Р. И.'
                    : 'ОТК ПРОИЗВОДСТВО',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const AnalyticsPage = ({pageArgs}) => {
    const {selectedCampaign, setSelectedCampaign} = pageArgs;

    const apiPageColumnsVal = localStorage.getItem('apiPageColumns');
    const [selectedButton, setSelectedButton] = useState('');
    const anchorRef = useRef(null);
    const [rangePickerOpen, setRangePickerOpen] = useState(false);

    const [planModalOpen, setPlanModalOpen] = useState(false);
    const [planModalOpenFromEntity, setPlanModalOpenFromEntity] = useState('');
    const [planModalKey, setPlanModalKey] = useState('');
    const [planModalPlanValue, setPlanModalPlanValue] = useState('');
    const [planModalPlanValueValid, setPlanModalPlanValueValid] = useState(false);

    const [graphModalOpen, setGraphModalOpen] = useState(false);
    const [currenrGraphMetrics, setCurrenrGraphMetrics] = useState([] as any[]);
    const [graphModalData, setGraphModalData] = useState({});
    const [graphModalTimeline, setGraphModalTimeline] = useState([] as any[]);
    const [graphModalTitle, setGraphModalTitle] = useState('');
    const uploadId = useId();
    const [uploadProgress, setUploadProgress] = useState(0);

    const columnDataObj = {
        entity: {
            valueType: 'text',
            placeholder: 'Объект',
            render: ({value, row}) => {
                if (value === undefined || row.isBlank) return undefined;

                let titleWrapped = value;
                if (value.length > 30) {
                    let wrapped = false;
                    titleWrapped = '';
                    const titleArr = value.split(' ');
                    for (const word of titleArr) {
                        titleWrapped += word;
                        if (titleWrapped.length > 25 && !wrapped) {
                            titleWrapped += '\n';
                            wrapped = true;
                        } else {
                            titleWrapped += ' ';
                        }
                    }
                }

                return renderFilterByClickButton({value}, 'entity');
            },
        },
        date: {
            valueType: 'text',
            placeholder: 'Дата',
            render: (args) => {
                const {value, row} = args;
                if (row.isBlank) return undefined;
                if (value === undefined) return 'Итого';
                const {notes, entity} = row;

                const {all} = notes ? (notes.all ? notes : {all: []}) : {all: []};

                const notesList = [] as any[];
                for (let i = 0; i < all.length; i++) {
                    const {note, tags} = all[i];

                    if (tags.includes(entity) || tags.length == 0) {
                        notesList.push(
                            <Card
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: 64,
                                    padding: 8,
                                    marginBottom: 8,
                                }}
                            >
                                {note}
                            </Card>,
                        );
                    }
                }

                return notesList.length ? (
                    <Popover
                        content={
                            <div
                                style={{
                                    height: 'calc(30em - 60px)',
                                    width: '30em',
                                    overflow: 'auto',
                                    paddingBottom: 8,
                                    display: 'flex',
                                }}
                            >
                                <Card
                                    view="outlined"
                                    theme="warning"
                                    style={{
                                        position: 'absolute',
                                        height: '30em',
                                        width: '30em',
                                        padding: 20,
                                        overflow: 'auto',
                                        top: -10,
                                        left: -10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: 'var(--g-color-base-background)',
                                    }}
                                >
                                    {notesList}
                                </Card>
                            </div>
                        }
                    >
                        <Text color="brand">
                            {new Date(value).toLocaleDateString('ru-RU').slice(0, 10)}
                        </Text>
                    </Popover>
                ) : (
                    new Date(value).toLocaleDateString('ru-RU').slice(0, 10)
                );
            },
        },
        sum: {
            placeholder: 'Расход, ₽',
            render: (args) => renderWithGraph(args, 'sum', 'Расход, ₽'),
            isReverseGrad: true,
            // graphColor: 'var(--g-color-private-red-250)',
        },
        sum_orders: {
            placeholder: 'Заказов, ₽',
            render: (args) => renderWithGraph(args, 'sum_orders', 'Заказов, ₽'),
            // graphColor: 'var(--g-color-private-green-250)',
        },
        orders: {
            placeholder: 'Заказов, шт.',
            render: (args) => renderWithGraph(args, 'orders', 'Заказов, шт.'),
        },
        avgCost: {
            placeholder: 'Средний чек, ₽',
            planType: 'avg',
            render: (args) => renderWithGraph(args, 'avgCost', 'Средний чек, ₽'),
        },
        sum_sales: {
            placeholder: 'Продаж, ₽',
            render: (args) => renderWithGraph(args, 'sum_sales', 'Продаж, ₽'),
        },
        sales: {
            placeholder: 'Продаж, шт.',
            render: (args) => renderWithGraph(args, 'sales', 'Продаж, шт.'),
        },
        profit: {
            placeholder: 'Профит, ₽.',
            render: (args) => renderWithGraph(args, 'profit', 'Профит, ₽.'),
        },
        rentabelnost: {
            placeholder: 'Рентабельность, %',
            planType: 'avg',
            render: (args) =>
                renderWithGraph(
                    args,
                    'rentabelnost',
                    'Рентабельность, %',
                    ['rentabelnost'],
                    renderAsPercent,
                ),
        },
        drr_orders: {
            placeholder: 'ДРР к заказам, %',
            render: (args) =>
                renderWithGraph(
                    args,
                    'drr_orders',
                    'ДРР к заказам, %',
                    ['drr_orders'],
                    renderAsPercent,
                ),
            planType: 'avg',
            isReverseGrad: true,
        },
        drr_sales: {
            placeholder: 'ДРР к продажам, %',
            render: (args) =>
                renderWithGraph(
                    args,
                    'drr_sales',
                    'ДРР к продажам, %',
                    ['drr_sales'],
                    renderAsPercent,
                ),
            planType: 'avg',
            isReverseGrad: true,
        },
        stocks: {
            placeholder: 'Остаток, шт.',
            render: (args) => renderWithGraph(args, 'stocks', 'Остаток, шт.'),
        },
        obor: {
            placeholder: 'Оборачиваемость, дней',
            planType: 'avg',
            render: (args) => renderWithGraph(args, 'obor', 'Оборачиваемость, дней'),
        },
        orderPrice: {
            placeholder: 'Цена заказа, ₽',
            render: (args) => renderWithGraph(args, 'orderPrice', 'Цена заказа, ₽'),
        },
        buyoutsPercent: {
            placeholder: 'Выкуп, %',
            planType: 'avg',
            render: (args) =>
                renderWithGraph(
                    args,
                    'buyoutsPercent',
                    'Выкуп, %',
                    ['buyoutsPercent'],
                    renderAsPercent,
                ),
        },
        addToCartPercent: {
            placeholder: 'CR в корзину, %',
            planType: 'avg',
            render: (args) =>
                renderWithGraph(
                    args,
                    'addToCartPercent',
                    'CR в корзину, %',
                    ['addToCartPercent'],
                    renderAsPercent,
                ),
        },
        cartToOrderPercent: {
            placeholder: 'CR в заказ, %',
            planType: 'avg',
            render: (args) =>
                renderWithGraph(
                    args,
                    'cartToOrderPercent',
                    'CR в заказ, %',
                    ['cartToOrderPercent'],
                    renderAsPercent,
                ),
        },
        storageCost: {
            placeholder: 'Хранение, ₽',
            isReverseGrad: true,
            render: (args) => renderWithGraph(args, 'storageCost', 'Хранение, ₽'),
        },
        clicks: {
            placeholder: 'Кликов, шт.',
            render: (args) => renderWithGraph(args, 'clicks', 'Кликов, шт.'),
        },
        openCardCount: {
            placeholder: 'Переходы, шт.',
            render: (args) => renderWithGraph(args, 'openCardCount', 'Переходы, шт.'),
        },
        sppPrice: {
            planType: 'avg',
            placeholder: 'Цена с СПП, ₽',
            render: (args) => renderWithGraph(args, 'sppPrice', 'Цена с СПП, ₽'),
        },
    };

    const columnDataReversed = (() => {
        const temp = {};
        for (const metric of Object.keys(columnDataObj).slice(2)) {
            const {placeholder} = columnDataObj[metric];
            temp[placeholder] = metric;
        }
        return temp;
    })();

    const renderWithGraph = (
        {value, row},
        key,
        title,
        metrics: any = undefined,
        defaultRenderFunction = defaultRender as any,
    ) => {
        if (value === undefined) return undefined;
        if (!metrics) metrics = [key];

        const {isReverseGrad, planType} = columnDataObj[key];

        const {graphData, entity} = row;

        const getDayPlanForDate = (date, argEntity = '') => {
            const _entity = argEntity != '' ? argEntity : entity;
            const monthName = getMonthName(date);

            const {dayPlan} =
                doc.plansData[selectValue[0]][_entity] &&
                doc.plansData[selectValue[0]][_entity][key] &&
                doc.plansData[selectValue[0]][_entity][key][monthName]
                    ? doc.plansData[selectValue[0]][_entity][key][monthName]
                    : {dayPlan: 0};

            return dayPlan;
        };

        const planDefaultRender = (dayPlanPreCalc = 0) => {
            const dayPlan = dayPlanPreCalc ? dayPlanPreCalc : getDayPlanForDate(new Date(row.date));

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

        const calcSumPlanForDisplayedDays = (argGraphData = [] as any[], argEntity = '') => {
            const _graphData =
                argGraphData && argGraphData['timeline'] && argGraphData['timeline'].length
                    ? argGraphData
                    : graphData;
            // console.log(_graphData, argGraphData, entity);

            const _entity = argEntity != '' ? argEntity : entity;
            let res = 0;
            for (const time of _graphData['timeline']) {
                const date = new Date(time);
                const dayPlan = getDayPlanForDate(date, _entity);
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

        const graphModalDataTemp = {};
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
                            setCurrenrGraphMetrics(metrics);
                        }}
                    >
                        <Icon data={ChartAreaStacked} size={13} />
                    </Button>
                    <div style={{minWidth: 8}} />
                    <Button
                        disabled={!graphData}
                        size="xs"
                        view="outlined"
                        onClick={() => {
                            setGraphModalTitle(title);
                            setPlanModalOpen(true);
                            setPlanModalPlanValue('');
                            setSelectedButton('');
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
    const columnTempState = Object.keys(columnDataObj);

    const apiPageColumnsInitial =
        apiPageColumnsVal !== 'undefined' &&
        apiPageColumnsVal &&
        JSON.parse(apiPageColumnsVal).length == columnTempState.length
            ? JSON.parse(apiPageColumnsVal)
            : columnTempState;
    // : columnTempState;

    const [apiPageColumns, setApiPageColumns] = useState(apiPageColumnsInitial);

    useEffect(() => {
        localStorage.setItem('apiPageColumns', JSON.stringify(apiPageColumns));
    }, [apiPageColumns]);

    const [calculatingFlag, setCalculatingFlag] = useState(false);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredKeysCheck, setEnteredKeysCheck] = useState({
        campaignName: false,
        brand: false,
        object: false,
        title: false,
        imtId: false,
        art: false,
        tags: false,
    });

    const getEnteredKeys = () => {
        const keys = [] as string[];
        for (const [key, check] of Object.entries(enteredKeysCheck)) {
            if (key && check) keys.push(key);
        }
        return keys;
    };

    const [filters, setFilters] = useState({undef: false});

    const filterByClick = (val, key, compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters(filters);
        filterTableData(filters);
    };

    const renderFilterByClickButton = ({value}, key) => {
        return (
            <Button
                style={{height: 'fit-content'}}
                size="xs"
                view="flat"
                onClick={() => {
                    filterByClick(value, key);
                }}
            >
                <Text style={{whiteSpace: 'pre-wrap', height: 'fit-content'}}>{value}</Text>
            </Button>
        );
    };

    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    const [dateRange, setDateRange] = useState([today, today]);

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    const columnData = (() => {
        const temp = [] as any[];
        for (const key of apiPageColumns) {
            const tempColumn = columnDataObj[key] ?? {};
            tempColumn['name'] = key;
            temp.push(tempColumn);
        }
        return temp;
    })();

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>(
        selectedCampaign != '' ? [selectedCampaign] : [],
    );
    const [buttonLoading, setButtonLoading] = useState('');
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    useEffect(() => {
        setSelectedCampaign(selectValue[0]);
    }, [selectValue]);

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0]);
    async function handleChange(event) {
        const file = event.target.files[0];

        if (!file || !file.name.includes('.xlsx')) {
            setUploadProgress(-1);
            return;
        }

        // Check file size (example limit: 10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            console.error('File size exceeds the limit');
            setUploadProgress(-1);
            return;
        }

        event.preventDefault();
        const url = 'https://aurum-mp.ru/api/uploadPlans';
        const formData = new FormData();

        formData.append('file', file);
        formData.append('uid', getUid());
        formData.append('campaignName', selectValue[0]);

        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress: function (progressEvent) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress(percentCompleted);
            },
        };

        try {
            const response = await axios.post(url, formData, config);
            console.log(response.data);
            if (response) {
                const resData = response['data'];
                doc['plansData'][selectValue[0]] = resData;
                setChangedDoc(doc);

                setTimeout(() => {
                    setUploadProgress(0);
                }, 5 * 1000);
            }
            event.target.files = [];
        } catch (error) {
            console.error('Error uploading file: ', error);
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Request data:', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error message:', error.message);
            }

            // Capture detailed error for debugging
            console.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                config: error.config,
                code: error.code,
                status: error.response ? error.response.status : null,
            });
        }
    }

    const recalc = (dateRange, selected = '', withfFilters = {}) => {
        const [startDate, endDate] = dateRange;
        console.log(startDate, endDate);

        const campaignData = doc
            ? doc.analyticsData[selected === '' ? selectValue[0] : selected]
            : {};
        // const campaignData = doc ? doc.analytics[selected === '' ? selectValue[0] : selected] : {};

        // const temp = {};
        // for (const [entity, entityData] of Object.entries(campaignData)) {
        //     if (!entity || !entityData) continue;

        //     const entityInfo = {
        //         entity: '',
        //         sum_orders: '',
        //         sum: '',
        //     };

        //     entityInfo.entity = entity;

        //     temp[entity] = entityInfo;
        // }

        setTableData(campaignData);

        filterTableData(withfFilters, campaignData);
    };

    const [filteredSummary, setFilteredSummary] = useState({});

    const filterTableData = (withFilters = {}, tableData = {}) => {
        const temp = [] as any;

        for (const [entity, entityInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!entity || !entityInfo) continue;

            for (const [date, dateStats] of Object.entries(entityInfo)) {
                if (date === undefined || dateStats === undefined) continue;
                const tempTypeRow = {};

                tempTypeRow['isSummary'] = false;
                tempTypeRow['entity'] = entity;
                tempTypeRow['date'] = date;
                tempTypeRow['orders'] = dateStats['orders'];
                tempTypeRow['notes'] = dateStats['notes'];
                tempTypeRow['sum_orders'] = dateStats['sum_orders'];
                tempTypeRow['sales'] = dateStats['sales'];
                tempTypeRow['sum_sales'] = dateStats['sum_sales'];
                tempTypeRow['profit'] = dateStats['profit'];
                tempTypeRow['rentabelnost'] = dateStats['rentabelnost'];
                tempTypeRow['clicks'] = dateStats['clicks'];
                tempTypeRow['sppPrice'] = dateStats['sppPrice'];

                tempTypeRow['openCardCount'] = dateStats['openCardCount'];
                tempTypeRow['addToCartCount'] = dateStats['addToCartCount'];
                tempTypeRow['addToCartPercent'] = dateStats['addToCartPercent'];
                tempTypeRow['cartToOrderPercent'] = dateStats['cartToOrderPercent'];
                tempTypeRow['storageCost'] = dateStats['storageCost'];
                tempTypeRow['buyoutsPercent'] = dateStats['buyoutsPercent'];
                tempTypeRow['expectedSales'] = dateStats['expectedSales'];

                tempTypeRow['sum'] = dateStats['sum'];
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
                tempTypeRow['stocks'] = dateStats['stocks'];
                tempTypeRow['obor'] = getRoundValue(
                    dateStats['stocks'],
                    dateStats['orders'],
                    false,
                    dateStats['stocks'] ? 999 : 0,
                );
                tempTypeRow['orderPrice'] = getRoundValue(
                    dateStats['sum'],
                    dateStats['orders'],
                    false,
                    dateStats['sum'],
                );
                tempTypeRow['avgCost'] = getRoundValue(
                    dateStats['sum_orders'],
                    dateStats['orders'],
                );

                let addFlag = true;
                const useFilters = withFilters['undef'] ? withFilters : filters;
                for (const [filterArg, filterData] of Object.entries(useFilters)) {
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

        const summaries = {
            filteredSummaryTemp: {
                orders: 0,
                sum_orders: 0,
                sales: 0,
                sum_sales: 0,
                profit: 0,
                obor: 0,
                obor_temp: {count: 0, val: 0},
                orderPrice: 0,
                avgCost: 0,
                stocks: 0,
                stocks_temp: {count: 0, val: 0},
                rentabelnost: 0,
                sum: 0,
                buyoutsPercent: 0,
                expectedSales: 0,
                addToCartPercent: 0,
                cartToOrderPercent: 0,
                addToCartCount: 0,
                openCardCount: 0,
                storageCost: 0,
                clicks: 0,
                sppPrice: 0,
                sppPrice_temp: {count: 0, val: 0},
            },
        };

        const summaryAdd = (row, key, value) => {
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

        temp.sort((rowA, rowB) => {
            return new Date(rowA.date).getTime() - new Date(rowB.date).getTime();
        });

        for (const row of temp) {
            const {entity} = row;
            if (!summaries[entity])
                summaries[entity] = {
                    orders: 0,
                    sum_orders: 0,
                    sales: 0,
                    sum_sales: 0,
                    profit: 0,
                    obor: 0,
                    obor_temp: {count: 0, val: 0},
                    orderPrice: 0,
                    avgCost: 0,
                    stocks: 0,
                    stocks_temp: {count: 0, val: 0},
                    rentabelnost: 0,
                    sum: 0,
                    graphData: {
                        timeline: [],
                    },
                    trendGraphData: {},
                    buyoutsPercent: 0,
                    addToCartPercent: 0,
                    cartToOrderPercent: 0,
                    addToCartCount: 0,
                    expectedSales: 0,
                    openCardCount: 0,
                    storageCost: 0,
                    clicks: 0,
                    sppPrice: 0,
                    sppPrice_temp: {count: 0, val: 0},
                };

            summaries[entity]['entity'] = entity;

            summaries[entity]['isSummary'] = true;
            summaryAdd(row, 'orders', undefined);
            summaryAdd(row, 'sum_orders', undefined);
            summaryAdd(row, 'sales', undefined);
            summaryAdd(row, 'expectedSales', undefined);
            summaryAdd(row, 'sum_sales', undefined);
            summaryAdd(row, 'sum', undefined);
            summaryAdd(row, 'profit', undefined);

            summaryAdd(row, 'clicks', undefined);
            summaryAdd(row, 'openCardCount', undefined);
            summaryAdd(row, 'addToCartCount', undefined);
            summaryAdd(row, 'buyoutsPercent', undefined);
            summaryAdd(row, 'addToCartPercent', undefined);
            summaryAdd(row, 'cartToOrderPercent', undefined);
            summaryAdd(row, 'storageCost', undefined);
            summaries[entity]['buyoutsPercent'] = getRoundValue(
                summaries[entity]['expectedSales'],
                summaries[entity]['orders'],
                true,
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
            summaryAdd(row, 'rentabelnost', getRoundValue(row['profit'], row['sum_orders'], true));

            const time = new Date(row['date']);
            time.setHours(0);
            summaries[entity]['graphData']['timeline'].push(time.getTime());
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
            summaries[entity]['rentabelnost'] = getRoundValue(
                summaries[entity]['profit'],
                summaries[entity]['sum_orders'],
                true,
            );

            summaryAdd(row, 'sppPrice', undefined);
            summaries[entity]['sppPrice_temp'].val += row['sppPrice'];
            summaries[entity]['sppPrice_temp'].count += 1;
            summaries[entity]['sppPrice'] = getRoundValue(
                summaries[entity]['sppPrice_temp'].val,
                summaries[entity]['sppPrice_temp'].count,
            );

            summaryAdd(row, 'stocks', undefined);
            summaries[entity]['stocks_temp'].val += row['stocks'];
            summaries[entity]['stocks_temp'].count += 1;
            summaries[entity]['stocks'] = getRoundValue(
                summaries[entity]['stocks_temp'].val,
                summaries[entity]['stocks_temp'].count,
            );

            summaryAdd(row, 'obor', undefined);
            summaries[entity]['obor_temp'].val += row['obor'];
            summaries[entity]['obor_temp'].count += 1;
            summaries[entity]['obor'] = getRoundValue(
                summaries[entity]['obor_temp'].val,
                summaries[entity]['obor_temp'].count,
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

            summaries['filteredSummaryTemp']['isSummary'] = true;
            summaries['filteredSummaryTemp']['isMainSummary'] = true;
            summaries['filteredSummaryTemp']['orders'] += row['orders'];
            summaries['filteredSummaryTemp']['sum_orders'] += row['sum_orders'];
            summaries['filteredSummaryTemp']['profit'] += row['profit'];
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
            summaries['filteredSummaryTemp']['rentabelnost'] = getRoundValue(
                summaries['filteredSummaryTemp']['profit'],
                summaries['filteredSummaryTemp']['sum_orders'],
                true,
            );

            summaries['filteredSummaryTemp']['stocks_temp'].val += row['stocks'];
            summaries['filteredSummaryTemp']['stocks_temp'].count += 1;
            summaries['filteredSummaryTemp']['stocks'] = getRoundValue(
                summaries['filteredSummaryTemp']['stocks_temp'].val,
                summaries['filteredSummaryTemp']['stocks_temp'].count,
            );

            summaries['filteredSummaryTemp']['obor_temp'].val += row['obor'];
            summaries['filteredSummaryTemp']['obor_temp'].count += 1;
            summaries['filteredSummaryTemp']['obor'] = getRoundValue(
                summaries['filteredSummaryTemp']['obor_temp'].val,
                summaries['filteredSummaryTemp']['obor_temp'].count,
            );

            summaries['filteredSummaryTemp']['avgCost'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum_orders'],
                summaries['filteredSummaryTemp']['orders'],
            );
            summaries['filteredSummaryTemp']['orderPrice'] = getRoundValue(
                summaries['filteredSummaryTemp']['sum'],
                summaries['filteredSummaryTemp']['orders'],
            );

            summaries['filteredSummaryTemp']['clicks'] += row['clicks'];
            summaries['filteredSummaryTemp']['addToCartCount'] += row['addToCartCount'];
            summaries['filteredSummaryTemp']['openCardCount'] += row['openCardCount'];
            summaries['filteredSummaryTemp']['buyoutsPercent'] = getRoundValue(
                summaries['filteredSummaryTemp']['expectedSales'],
                summaries['filteredSummaryTemp']['orders'],
                true,
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

        setFilteredSummary(summaries['filteredSummaryTemp']);

        for (const [entity, entitySummary] of Object.entries(summaries)) {
            if (entity === 'filteredSummaryTemp') continue;
            if (entity) temp.push(entitySummary);
            temp.push({entity: entity, isSummary: false, isBlank: true});
        }

        temp.sort((rowA, rowB) => {
            return rowB.isSummary - rowA.isSummary;
        });

        temp.sort((rowA, rowB) => {
            return new Date(rowB.date).getTime() - new Date(rowA.date).getTime();
        });

        temp.sort((rowA, rowB) => {
            return rowA.entity.localeCompare(rowB.entity, 'ru-RU');
        });

        temp.pop();

        const paginatedDataTemp = temp.slice(0, 366);

        setFilteredSummary((row) => {
            const fstemp = row;
            fstemp['entity'] = `На странице: ${paginatedDataTemp.length} Всего: ${temp.length}`;

            return fstemp;
        });

        setFilteredData(temp);

        setPaginatedData(paginatedDataTemp);
        setPagesCurrent(1);
        setPagesTotal(Math.ceil(temp.length));
    };

    const [firstRecalc, setFirstRecalc] = useState(false);

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc(dateRange);
    }

    if (!doc) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(doc['analyticsData'])) {
            if (Userfront.user.userUuid === 'ce86aeb0-30b7-45ba-9234-a6765df7a479') {
                if (
                    ['ИП Валерий', 'ИП Артем', 'Текстиль', 'ИП Оксана', 'ТОРГМАКСИМУМ'].includes(
                        campaignName,
                    )
                ) {
                    campaignsNames.push({
                        value: campaignName,
                        content: campaignName,
                    });
                }
            } else if (Userfront.user.userUuid === '1c5a0344-31ea-469e-945e-1dfc4b964ecd') {
                if (
                    ['ИП Валерий', 'ИП Артем', 'Текстиль', 'ИП Оксана', 'ТОРГМАКСИМУМ'].includes(
                        campaignName,
                    )
                ) {
                    campaignsNames.push({
                        value: campaignName,
                        content: campaignName,
                    });
                }
            } else if (Userfront.user.userUuid === '17fcd1f0-cb29-455d-b5bd-42345f0c7ef8') {
                if (['ИП Валерий', 'ИП Артем', 'Текстиль', 'ИП Оксана'].includes(campaignName)) {
                    campaignsNames.push({
                        value: campaignName,
                        content: campaignName,
                    });
                }
            } else if (Userfront.user.userUuid === '46431a09-85c3-4703-8246-d1b5c9e52594') {
                if (
                    [
                        'ИП Иосифова Р. И.',
                        'ИП Иосифов А. М.',
                        'ИП Иосифов М.С.',
                        'ИП Иосифов С.М. (домашка)',
                        'ООО Лаванда (18+)',
                        'ИП Галилова',
                        'ИП Мартыненко',
                        'ТОРГМАКСИМУМ',
                    ].includes(campaignName)
                ) {
                    campaignsNames.push({
                        value: campaignName,
                        content: campaignName,
                    });
                }
            } else {
                campaignsNames.push({
                    value: campaignName,
                    content: campaignName,
                });
            }
        }
        setSelectOptions(campaignsNames as SelectOption<any>[]);
        const selected =
            selectedCampaign && selectedCampaign != ''
                ? selectedCampaign
                : campaignsNames[
                      Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594' ? 1 : 0
                  ]['value'];
        setSelectValue([selected]);
        console.log(doc);

        recalc(dateRange, selected);
        setFirstRecalc(true);
    }

    function arrayMove(arrayTemp, oldIndex, newIndex) {
        const arr = [...arrayTemp];
        while (oldIndex < 0) {
            oldIndex += arr.length;
        }
        while (newIndex < 0) {
            newIndex += arr.length;
        }
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

        return arr;
    }

    const colors = [
        'var(--g-color-private-purple-550-solid)',
        'var(--g-color-private-yellow-550-solid)',
        'var(--g-color-private-green-550-solid)',
        'var(--g-color-private-orange-550-solid)',
        'var(--g-color-private-cool-grey-550-solid)',
        'var(--g-color-private-red-550-solid)',
    ];

    const genYagrData = () => {
        function linearRegression(x, y) {
            const n = x.length;
            const sumX = x.reduce((a, b) => a + b, 0);
            const sumY = y.reduce((a, b) => a + b, 0);
            const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
            const sumXX = x.map((xi) => xi * xi).reduce((a, b) => a + b, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            const trendLine = x.map((xi) => slope * xi + intercept);
            return {slope, intercept, trendLine};
        }

        const graphModalDataTemp = [] as any[];
        const axesConfig = {};

        for (const metric of currenrGraphMetrics) {
            const metricData = graphModalData[metric];

            // console.log(metric, metricData);
            const {trendLine} = linearRegression(graphModalTimeline, metricData);
            const properTitle = columnDataObj[metric] ? columnDataObj[metric].placeholder : metric;
            const graphColor = colors[currenrGraphMetrics.indexOf(metric) % colors.length];
            // columnDataObj[metric] && columnDataObj[metric].graphColor
            //     ? columnDataObj[metric].graphColor
            //     : 'var(--g-color-private-purple-250)';
            const graphTrendColor = graphColor.slice(0, graphColor.length - 10) + '650-solid)';
            // console.log(graphTrendColor);

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
                scales: {y: {min: 0, stacking: false}, r: {min: 0}},
                title: {
                    text: 'График по дням',
                },
            },
        } as YagrWidgetData;
    };

    const getPlanDay = (key = '') => {
        const isAvg = key != '' ? columnDataObj[key].planType == 'avg' : false;
        return getRoundValue(Number(planModalPlanValue), isAvg ? 1 : daysInMonth(new Date()));
    };

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            <Modal
                open={graphModalOpen}
                onClose={() => {
                    setGraphModalOpen(false);
                    setCurrenrGraphMetrics([]);
                    setGraphModalData({});
                    setGraphModalTimeline([]);
                    setGraphModalTitle('');
                }}
            >
                <Card
                    view="outlined"
                    theme="warning"
                    style={{
                        height: '50em',
                        width: '90em',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <ChartKit type="yagr" data={genYagrData() as YagrWidgetData} />
                    <div
                        style={{
                            padding: 8,
                            height: 'calc(100% - 16px)',
                            width: 200,
                            overflow: 'auto',
                            boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <List
                            filterPlaceholder="Введите название метрики"
                            emptyPlaceholder="Такая метрика отсутствует"
                            items={Object.keys(columnDataReversed)}
                            renderItem={(item) => {
                                const selected = currenrGraphMetrics.includes(
                                    columnDataReversed[item],
                                );
                                const graphColor =
                                    colors[
                                        currenrGraphMetrics.indexOf(columnDataReversed[item]) %
                                            colors.length
                                    ];
                                const backColor = graphColor
                                    ? graphColor.slice(0, graphColor.length - 10) + '150)'
                                    : undefined;
                                const graphTrendColor = graphColor
                                    ? graphColor.slice(0, graphColor.length - 10) + '650-solid)'
                                    : undefined;

                                return (
                                    <Button
                                        size="xs"
                                        pin="circle-circle"
                                        // selected={selected}
                                        style={{position: 'relative', overflow: 'hidden'}}
                                        view={selected ? 'flat' : 'outlined'}
                                    >
                                        <div
                                            style={{
                                                borderRadius: 10,
                                                left: 0,
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                background: selected ? backColor : '#0000',
                                            }}
                                        />
                                        <Text
                                            style={{
                                                color: selected ? graphTrendColor : undefined,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Button>
                                );
                            }}
                            onItemClick={(item) => {
                                const metricVal = columnDataReversed[item];
                                let tempArr = Array.from(currenrGraphMetrics);
                                if (tempArr.includes(metricVal)) {
                                    tempArr = tempArr.filter((value) => value != metricVal);
                                } else {
                                    tempArr.push(metricVal);
                                }

                                tempArr = tempArr.sort((a, b) => {
                                    const metricDataA = graphModalData[a];
                                    const metricDataB = graphModalData[b];
                                    return metricDataA[0] - metricDataB[0];
                                });

                                setCurrenrGraphMetrics(tempArr);
                            }}
                        />
                        <Button
                            width="max"
                            view={currenrGraphMetrics.length ? 'flat-danger' : 'normal'}
                            selected={currenrGraphMetrics.length != 0}
                            onClick={() => {
                                setCurrenrGraphMetrics([]);
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon data={TrashBin} />
                                <div style={{minWidth: 3}} />
                                Очистить
                            </div>
                        </Button>
                    </div>
                </Card>
            </Modal>
            <Modal
                open={planModalOpen}
                onClose={() => {
                    setPlanModalOpen(false);
                    setGraphModalTitle('');
                }}
            >
                <Card
                    view="outlined"
                    // theme="warning"
                    style={{
                        padding: 20,
                        width: '40em',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            margin: '0px 32px',
                        }}
                        variant="display-1"
                    >
                        {`Установить план ${graphModalTitle} для ${planModalOpenFromEntity}`}
                    </Text>
                    <div style={{minHeight: 8}} />
                    <TextInput
                        hasClear
                        size="l"
                        value={planModalPlanValue}
                        validationState={planModalPlanValueValid ? undefined : 'invalid'}
                        onUpdate={(val) => {
                            const temp = Number(val != '' ? val : 'ahui');
                            setPlanModalPlanValueValid(!isNaN(temp) && isFinite(temp));
                            setPlanModalPlanValue(val);
                        }}
                        note={
                            planModalPlanValueValid && planModalPlanValue != '' ? (
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Text variant="subheader-1">
                                        {`Ежедневный план для ${graphModalTitle} -> `}
                                    </Text>
                                    <div style={{minWidth: 4}} />
                                    <Text variant="subheader-1" color="brand">
                                        {new Intl.NumberFormat('ru-RU').format(
                                            getPlanDay(planModalKey),
                                        )}
                                    </Text>
                                </div>
                            ) : (
                                ''
                            )
                        }
                        style={{width: 'calc(100% - 32px)'}}
                        placeholder={`Введите план "${graphModalTitle}" на текущий месяц`}
                    />
                    <div style={{minHeight: 8}} />
                    {generateModalButtonWithActions(
                        {
                            disabled: !planModalPlanValueValid,
                            placeholder: 'Установить план',
                            icon: CloudArrowUpIn,
                            view: 'outlined-success',
                            onClick: () => {
                                const monthName = getMonthName(new Date());
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
                                if (
                                    !doc.plansData[selectValue[0]][planModalOpenFromEntity][
                                        planModalKey
                                    ]
                                )
                                    doc.plansData[selectValue[0]][planModalOpenFromEntity][
                                        planModalKey
                                    ] = {};
                                doc.plansData[selectValue[0]][planModalOpenFromEntity][
                                    planModalKey
                                ][monthName] = {dayPlan};

                                console.log(params);

                                //////////////////////////////////
                                callApi('setPlanForKey', params);
                                setChangedDoc(doc);
                                //////////////////////////////////

                                setPlanModalOpen(false);
                            },
                        },
                        selectedButton,
                        setSelectedButton,
                    )}
                    {generateModalButtonWithActions(
                        {
                            placeholder: 'Удалить план',
                            icon: TrashBin,
                            view: 'outlined-danger',
                            onClick: () => {
                                const monthName = getMonthName(new Date());
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
                                    doc.plansData[selectValue[0]][planModalOpenFromEntity][
                                        planModalKey
                                    ]
                                ) {
                                    delete doc.plansData[selectValue[0]][planModalOpenFromEntity][
                                        planModalKey
                                    ][monthName];
                                }

                                console.log(params);

                                //////////////////////////////////
                                callApi('setPlanForKey', params);
                                setChangedDoc(doc);
                                //////////////////////////////////

                                setPlanModalOpen(false);
                            },
                        },
                        selectedButton,
                        setSelectedButton,
                    )}
                </Card>
            </Modal>
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
                    }}
                >
                    <Select
                        className={b('selectCampaign')}
                        value={selectValue}
                        placeholder="Values"
                        options={selectOptions}
                        renderControl={({onClick, onKeyDown, ref}) => {
                            return (
                                <Button
                                    loading={buttonLoading === 'switchingCampaigns'}
                                    ref={ref}
                                    size="l"
                                    view="action"
                                    onClick={onClick}
                                    extraProps={{
                                        onKeyDown,
                                    }}
                                >
                                    <Icon data={Key} />
                                    <Text variant="subheader-1">{selectValue[0]}</Text>
                                    <Icon data={ChevronDown} />
                                </Button>
                            );
                        }}
                        onUpdate={(nextValue) => {
                            setButtonLoading('switchingCampaigns');

                            const params = {
                                uid: getUid(),
                                campaignName: nextValue[0],
                                dateRange: getNormalDateRange(dateRange),
                            };

                            if (!Object.keys(doc['analyticsData'][nextValue[0]]).length) {
                                callApi('getAnalytics', params).then((res) => {
                                    if (!res) return;
                                    const resData = res['data'];
                                    doc['analyticsData'][nextValue[0]] =
                                        resData['analyticsData'][nextValue[0]];
                                    doc['plansData'][nextValue[0]] =
                                        resData['plansData'][nextValue[0]];

                                    setChangedDoc(doc);
                                    setSelectValue(nextValue);

                                    setButtonLoading('');
                                    console.log(doc);
                                });
                            } else {
                                setSelectValue(nextValue);
                                setButtonLoading('');
                            }
                            recalc(dateRange, nextValue[0], filters);
                            setPagesCurrent(1);
                        }}
                    />
                    <motion.div
                        style={{
                            overflow: 'hidden',
                        }}
                        animate={{
                            maxWidth: buttonLoading === 'switchingCampaigns' ? 40 : 0,
                            opacity: buttonLoading === 'switchingCampaigns' ? 1 : 0,
                        }}
                    >
                        <Spin style={{marginTop: 4, marginLeft: 8}} />
                    </motion.div>
                    <div style={{minWidth: 8}} />
                    <Button
                        loading={calculatingFlag}
                        size="l"
                        view="action"
                        onClick={() => {
                            setEnteredValuesModalOpen(true);
                            setEnteredKeysCheck({
                                campaignName: false,
                                brand: false,
                                object: false,
                                title: false,
                                imtId: false,
                                art: false,
                                tags: false,
                            });
                        }}
                    >
                        <Icon data={Calculator} />
                        <Text variant="subheader-1">Рассчитать</Text>
                    </Button>
                    <motion.div
                        style={{
                            overflow: 'hidden',
                            marginTop: 4,
                        }}
                        animate={{
                            maxWidth: calculatingFlag ? 40 : 0,
                            opacity: calculatingFlag ? 1 : 0,
                        }}
                    >
                        <Spin style={{marginLeft: 8}} />
                    </motion.div>
                    <Modal
                        open={enteredValuesModalOpen}
                        onClose={() => {
                            setEnteredValuesModalOpen(false);
                        }}
                    >
                        <Card
                            view="clear"
                            style={{
                                width: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'none',
                            }}
                        >
                            <div
                                style={{
                                    height: '50%',
                                    width: 'calc(100% - 32px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        {generateSelectButton({
                                            key: 'campaignName',
                                            placeholder: 'Магазин',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                        {generateSelectButton({
                                            key: 'brand',
                                            placeholder: 'Бренд',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                        {generateSelectButton({
                                            key: 'object',
                                            placeholder: 'Тип предмета',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        {generateSelectButton({
                                            key: 'title',
                                            placeholder: 'Наименование',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                        {generateSelectButton({
                                            key: 'imtId',
                                            placeholder: 'ID КТ',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                        {generateSelectButton({
                                            key: 'art',
                                            placeholder: 'Артикул',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        {generateSelectButton({
                                            key: 'tags',
                                            placeholder: 'Теги',
                                            enteredKeysCheck,
                                            setEnteredKeysCheck,
                                        })}
                                    </div>
                                </div>
                                <div style={{minHeight: 8}} />
                                <Button
                                    size="l"
                                    view="action"
                                    onClick={() => {
                                        setCalculatingFlag(true);
                                        const params = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            dateRange: getNormalDateRange(dateRange),
                                            enteredValues: {entityKeys: getEnteredKeys()},
                                        };

                                        console.log(params);

                                        /////////////////////////
                                        callApi('getAnalytics', params).then((res) => {
                                            if (!res) return;
                                            const resData = res['data'];

                                            doc['analyticsData'][selectValue[0]] =
                                                resData['analyticsData'][selectValue[0]];

                                            setChangedDoc(doc);
                                            setCalculatingFlag(false);
                                            console.log(doc);
                                        });

                                        setPagesCurrent(1);
                                        /////////////////////////

                                        setEnteredValuesModalOpen(false);
                                    }}
                                >
                                    <Icon data={Calculator} />
                                    <Text variant="subheader-1">Рассчитать</Text>
                                </Button>
                            </div>
                        </Card>
                    </Modal>
                    <div style={{minWidth: 8}} />
                </div>
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'end',
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        size="l"
                        view="action"
                        onClick={() => {
                            setFilters(() => {
                                const newFilters = {undef: true};
                                for (const [key, filterData] of Object.entries(filters as any)) {
                                    if (key == 'undef' || !key || !filterData) continue;
                                    newFilters[key] = {
                                        val: '',
                                        compMode: filterData['compMode'] ?? 'include',
                                    };
                                }
                                filterTableData(newFilters);
                                return newFilters;
                            });
                        }}
                    >
                        <Icon data={TrashBin} />
                        <Text variant="subheader-1">Очистить фильтры</Text>
                    </Button>
                    <div style={{minWidth: 8}} />
                    <Popover
                        content={
                            <div
                                style={{
                                    height: 'calc(300px - 60px)',
                                    width: 150,
                                    overflow: 'auto',
                                    display: 'flex',
                                }}
                            >
                                <Card
                                    view="outlined"
                                    theme="warning"
                                    style={{
                                        position: 'absolute',
                                        background: 'var(--g-color-base-background)',
                                        height: 300,
                                        width: 200,
                                        padding: 8,
                                        overflow: 'auto',
                                        top: -10,
                                        left: -9,
                                        display: 'flex',
                                    }}
                                >
                                    <List
                                        sortable
                                        filterable={false}
                                        itemHeight={28}
                                        items={apiPageColumns}
                                        sortHandleAlign="right"
                                        renderItem={(item) => {
                                            return (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {/* <Checkbox defaultChecked /> */}
                                                    {/* <div style={{minWidth: 4}} /> */}
                                                    <Text>
                                                        {columnDataObj[item as string].placeholder}
                                                    </Text>
                                                </div>
                                            );
                                        }}
                                        onSortEnd={({oldIndex, newIndex}) => {
                                            setApiPageColumns(
                                                arrayMove(apiPageColumns, oldIndex, newIndex),
                                            );
                                        }}
                                    />
                                </Card>
                            </div>
                        }
                    >
                        <Button size="l" view="action" style={{marginBottom: 8}}>
                            <Icon data={LayoutColumns3} />
                            <Text variant="subheader-1">Столбцы</Text>
                        </Button>
                    </Popover>
                    <div style={{minWidth: 8}} />
                    <Button
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
                            setUploadProgress(0);
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
                    <label htmlFor={uploadId}>
                        <Button
                            size="l"
                            onClick={() => {
                                setUploadProgress(0);
                            }}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            selected={uploadProgress === 100 || uploadProgress === -1}
                            view={
                                uploadProgress === 100
                                    ? 'flat-success'
                                    : uploadProgress === -1
                                    ? 'flat-danger'
                                    : 'outlined-success'
                            }
                        >
                            <Text
                                variant="subheader-1"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon data={FileArrowUp} size={20} />
                                <div style={{minWidth: 3}} />
                                Загрузить планы
                                <input
                                    id={uploadId}
                                    style={{
                                        opacity: 0,
                                        position: 'absolute',
                                        height: 40,
                                        left: 0,
                                    }}
                                    type="file"
                                    onChange={handleChange}
                                />
                            </Text>
                        </Button>
                    </label>
                    <div style={{minWidth: 8}} />
                    <RangePicker
                        args={{
                            recalc,
                            dateRange,
                            setDateRange,
                            rangePickerOpen,
                            setRangePickerOpen,
                            anchorRef,
                        }}
                    />
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
                <Card
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        boxShadow: 'inset 0px 0px 10px var(--g-color-base-background)',
                        overflow: 'auto',
                    }}
                >
                    <TheTable
                        columnData={columnData}
                        data={paginatedData}
                        filters={filters}
                        setFilters={setFilters}
                        filterData={filterTableData}
                        footerData={[filteredSummary]}
                    />
                </Card>
                <div style={{height: 8}} />
                <Pagination
                    showInput
                    total={pagesTotal}
                    page={pagesCurrent}
                    pageSize={366}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 366, page * 366);
                        setFilteredSummary((row) => {
                            const fstemp = row;
                            fstemp[
                                'art'
                            ] = `На странице: ${paginatedDataTemp.length} Всего: ${filteredData.length}`;

                            return fstemp;
                        });
                        setPaginatedData(paginatedDataTemp);
                    }}
                />
            </div>
        </div>
    );
};

const generateSelectButton = ({key, enteredKeysCheck, setEnteredKeysCheck, placeholder}) => {
    return (
        <Button
            width="max"
            style={{margin: 4}}
            selected={enteredKeysCheck[key]}
            onClick={() => {
                const temp = {...enteredKeysCheck};
                temp[key] = !temp[key];
                setEnteredKeysCheck(temp);
            }}
        >
            <Text variant="subheader-1">{placeholder}</Text>
        </Button>
    );
};
