import React, {useEffect, useState} from 'react';
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
    Checkbox,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

const b = block('app');

import {ChevronDown, Key, Calculator, ChartAreaStacked} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare, defaultRender} from 'src/components/TheTable';
import Userfront from '@userfront/toolkit';
import {motion} from 'framer-motion';
import {RangePicker} from 'src/components/RangePicker';
import {getNormalDateRange, getRoundValue, renderAsPercent} from 'src/utilities/getRoundValue';
import ChartKit from '@gravity-ui/chartkit';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

const getUserDoc = (dateRange, docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['analyticsData'][selectValue] = docum['analyticsData'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getAnalytics', {
            uid: getUid(),
            dateRange: getNormalDateRange(dateRange),
            campaignName:
                Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594'
                    ? 'ИП Иосифова Р. И.'
                    : Userfront.user.userUuid === '674281bf-7a48-463a-825d-a5c4163b4819'
                    ? 'ИП Артем'
                    : 'ИП Валерий',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const AnalyticsPage = () => {
    const apiPageColumnsVal = localStorage.getItem('apiPageColumns');

    const [graphModalOpen, setGraphModalOpen] = useState(false);
    const [graphModalData, setGraphModalData] = useState([] as any[]);
    const [graphModalTimeline, setGraphModalTimeline] = useState([] as any[]);
    const [graphModalTitle, setGraphModalTitle] = useState('');
    const renderWithGraph = (
        {value, row},
        key,
        title,
        defaultRenderFunction = defaultRender as any,
    ) => {
        if (value === undefined) return undefined;
        if (!row.isSummary) return defaultRenderFunction({value});

        const {graphData} = row;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                {defaultRenderFunction({value})}
                <div style={{minWidth: 8}} />
                <Button
                    disabled={!graphData}
                    size="xs"
                    view="outlined"
                    onClick={() => {
                        setGraphModalData(graphData[key]);
                        setGraphModalTimeline(graphData['timeline']);
                        setGraphModalTitle(title);
                        setGraphModalOpen(true);
                    }}
                >
                    <Icon data={ChartAreaStacked} size={13} />
                </Button>
            </div>
        );
    };

    const columnDataObj = {
        entity: {
            valueType: 'text',
            placeholder: 'Сущность',
            render: ({value, row}) => {
                if (value === undefined || row.isBlank) return undefined;
                return renderFilterByClickButton({value}, 'entity');
            },
        },
        date: {
            valueType: 'text',
            placeholder: 'Дата',
            render: ({value, row}) => {
                if (row.isBlank) return undefined;
                if (value === undefined) return 'Итого';
                return new Date(value).toLocaleDateString('ru-RU').slice(0, 10);
            },
        },
        sum: {
            placeholder: 'Расход, ₽',
            render: (args) => renderWithGraph(args, 'sum', 'Расход, ₽'),
        },
        sum_orders: {
            placeholder: 'Заказов, ₽',
            render: (args) => renderWithGraph(args, 'sum_orders', 'Заказов, ₽'),
        },
        orders: {
            placeholder: 'Заказов, шт.',
            render: (args) => renderWithGraph(args, 'orders', 'Заказов, шт.'),
        },
        sum_sales: {
            placeholder: 'Продаж, ₽',
            render: (args) => renderWithGraph(args, 'sum_sales', 'Продаж, ₽'),
        },
        sales: {
            placeholder: 'Продаж, шт.',
            render: (args) => renderWithGraph(args, 'sales', 'Продаж, шт.'),
        },
        drr_orders: {
            placeholder: 'ДРР к заказам, %',
            render: (args) =>
                renderWithGraph(args, 'drr_orders', 'ДРР к заказам, %', renderAsPercent),
        },
        drr_sales: {
            placeholder: 'ДРР к продажам, %',
            render: (args) =>
                renderWithGraph(args, 'drr_sales', 'ДРР к продажам, %', renderAsPercent),
        },
    };

    const columnTempState = Object.keys(columnDataObj);

    const apiPageColumnsInitial =
        apiPageColumnsVal !== 'undefined' &&
        apiPageColumnsVal &&
        apiPageColumnsVal.length == columnTempState.length
            ? JSON.parse(apiPageColumnsVal)
            : columnTempState;

    const [apiPageColumns, setApiPageColumns] = useState(apiPageColumnsInitial);

    useEffect(() => {
        localStorage.setItem('apiPageColumns', JSON.stringify(apiPageColumns));
    }, [apiPageColumns]);

    const [calculatingFlag, setCalculatingFlag] = useState(false);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredKeysCheck, setEnteredKeysCheck] = useState({
        brand: false,
        object: false,
        art: false,
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
                size="xs"
                view="flat"
                onClick={() => {
                    filterByClick(value, key);
                }}
            >
                {value}
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
    const [selectValue, setSelectValue] = React.useState<string[]>([]);
    const [buttonLoading, setButtonLoading] = useState('');
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0]);

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
                tempTypeRow['sum_orders'] = dateStats['sum_orders'];
                tempTypeRow['sales'] = dateStats['sales'];
                tempTypeRow['sum_sales'] = dateStats['sum_sales'];
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

                let addFlag = true;
                const useFilters = withFilters['undef'] ? withFilters : filters;
                for (const [filterArg, filterData] of Object.entries(useFilters)) {
                    if (filterArg === 'undef' || !filterData) continue;
                    if (filterData['val'] === '') continue;
                    else if (!compare(tempTypeRow[filterArg], filterData)) {
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
            filteredSummaryTemp: {orders: 0, sum_orders: 0, sales: 0, sum_sales: 0, sum: 0},
        };

        const summaryAdd = (row, key, value) => {
            const {entity} = row;

            const val = value ?? row[key];
            summaries[entity][key] += val;
            if (!summaries[entity]['graphData'][key]) summaries[entity]['graphData'][key] = [];
            summaries[entity]['graphData'][key].push(val);
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
                    sum: 0,
                    graphData: {
                        timeline: [],
                    },
                };

            summaries[entity]['entity'] = entity;

            summaries[entity]['isSummary'] = true;
            summaryAdd(row, 'orders', undefined);
            summaryAdd(row, 'sum_orders', undefined);
            summaryAdd(row, 'sales', undefined);
            summaryAdd(row, 'sum_sales', undefined);
            summaryAdd(row, 'sum', undefined);

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

            const time = new Date(row['date']);
            time.setHours(0);
            summaries[entity]['graphData']['timeline'].push(time.getTime());
            console.log(time, summaries[entity]['graphData']['timeline']);

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

            summaries['filteredSummaryTemp']['orders'] += row['orders'];
            summaries['filteredSummaryTemp']['sum_orders'] += row['sum_orders'];
            summaries['filteredSummaryTemp']['sales'] += row['sales'];
            summaries['filteredSummaryTemp']['sum_sales'] += row['sum_sales'];
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
            } else if (Userfront.user.userUuid === '674281bf-7a48-463a-825d-a5c4163b4819') {
                if (['ИП Артем'].includes(campaignName)) {
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
        const selected = campaignsNames[0]['value'];
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

    const genYagrData = () => {
        return {
            data: {
                timeline: graphModalTimeline,
                graphs: [
                    {
                        name: graphModalTitle,
                        data: graphModalData,
                        id: '1',
                        color: '#9a63d1',
                        scale: 'y',
                    },
                ],
            },

            libraryConfig: {
                chart: {
                    series: {
                        type: 'line',
                        interpolation: 'smooth',
                    },
                },
                axes: {
                    y: {
                        label: graphModalTitle,
                        precision: 'auto',
                        show: true,
                    },
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

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            <Modal
                open={graphModalOpen}
                onClose={() => {
                    setGraphModalOpen(false);
                    setGraphModalData([]);
                    setGraphModalTimeline([]);
                    setGraphModalTitle('');
                }}
            >
                <Card
                    view="outlined"
                    theme="warning"
                    style={{
                        height: '30em',
                        width: '60em',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <ChartKit type="yagr" data={genYagrData()} />
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
                            setEnteredKeysCheck({brand: false, object: false, art: false});
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
                                    width: '70%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                }}
                            >
                                <Checkbox
                                    size="l"
                                    content={'Бренд'}
                                    checked={enteredKeysCheck.brand}
                                    onUpdate={(val) => {
                                        const temp = {...enteredKeysCheck};
                                        temp.brand = val;
                                        setEnteredKeysCheck(temp);
                                    }}
                                />
                                <div style={{minHeight: 8}} />
                                <Checkbox
                                    size="l"
                                    content={'Тип предмета'}
                                    checked={enteredKeysCheck.object}
                                    onUpdate={(val) => {
                                        const temp = {...enteredKeysCheck};
                                        temp.object = val;
                                        setEnteredKeysCheck(temp);
                                    }}
                                />
                                <div style={{minHeight: 8}} />
                                <Checkbox
                                    size="l"
                                    content={'Артикул'}
                                    checked={enteredKeysCheck.art}
                                    onUpdate={(val) => {
                                        const temp = {...enteredKeysCheck};
                                        temp.art = val;
                                        setEnteredKeysCheck(temp);
                                    }}
                                />
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
                                    Рассчитать
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
                            <Text variant="subheader-1">Столбцы</Text>
                        </Button>
                    </Popover>
                    <div style={{minWidth: 8}} />
                    <RangePicker
                        args={{recalc: recalc, dateRange: dateRange, setDateRange: setDateRange}}
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
