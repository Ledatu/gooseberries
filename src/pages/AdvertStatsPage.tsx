import React, {useEffect, useRef, useState} from 'react';
import {
    Spin,
    DropdownMenu,
    Button,
    Text,
    Card,
    Select,
    SelectOption,
    // Popover,
    Popup,
    TextInput,
    Icon,
    // TextInput,
} from '@gravity-ui/uikit';
import {RangeCalendar} from '@gravity-ui/date-components';
import '../App.scss';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import block from 'bem-cn-lite';

import axios from 'axios';
import Userfront from '@userfront/toolkit';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
const b = block('app');

import {CircleMinusFill, CircleMinus, CirclePlusFill, CirclePlus, Funnel} from '@gravity-ui/icons';

const {ipAddress} = require('../ipAddress');

const getUserDoc = () => {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                `${ipAddress}/api/getStatsByDay`,
                {
                    uid:
                        (Userfront.user.userUuid == '332fa5da-8450-451a-b859-a84ca9951a34' ||
                        Userfront.user.userUuid == '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                            ? '332fa5da-8450-451a-b859-a84ca9951a34'
                            : '') ?? '',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            )
            .then((response) => setDocument(response.data))
            .catch((error) => console.error(error));
    }, []);
    return document;
};

export const AdvertStatsPage = () => {
    const [filters, setFilters] = useState({undef: false});
    const generateColumns = (columnsInfo) => {
        const columns: Column<any>[] = [];
        if (!columnsInfo && !columnsInfo.length) return columns;
        for (let i = 0; i < columnsInfo.length; i++) {
            const column = columnsInfo[i];
            if (!column) continue;
            const {name, placeholder, width, render} = column;
            columns.push({
                name: name,
                header: (
                    <div
                        style={{minWidth: width ?? 100, display: 'flex'}}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            onChange={(val) => {
                                setFilters(() => {
                                    if (!(name in filters))
                                        filters[name] = {compMode: 'include', val: ''};
                                    filters[name].val = val.target.value;
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder={placeholder}
                            leftContent={
                                <DropdownMenu
                                    renderSwitcher={(props) => (
                                        <Button
                                            {...props}
                                            view={
                                                filters[name]
                                                    ? filters[name].val != ''
                                                        ? !filters[name].compMode.includes('not')
                                                            ? 'flat-success'
                                                            : 'flat-danger'
                                                        : 'flat'
                                                    : 'flat'
                                            }
                                            size="xs"
                                        >
                                            <Icon data={Funnel} />
                                        </Button>
                                    )}
                                    items={[
                                        [
                                            {
                                                iconStart: (
                                                    <Icon
                                                        data={
                                                            filters[name]
                                                                ? filters[name].compMode ==
                                                                  'include'
                                                                    ? CirclePlusFill
                                                                    : CirclePlus
                                                                : CirclePlusFill
                                                        }
                                                    />
                                                ),
                                                action: () => {
                                                    setFilters(() => {
                                                        if (!(name in filters))
                                                            filters[name] = {
                                                                compMode: 'include',
                                                                val: '',
                                                            };
                                                        filters[name].compMode = 'include';
                                                        recalc(dateRange, '', filters);
                                                        return filters;
                                                    });
                                                },
                                                text: 'Включает',
                                            },
                                            {
                                                iconStart: (
                                                    <Icon
                                                        data={
                                                            filters[name]
                                                                ? filters[name].compMode ==
                                                                  'not include'
                                                                    ? CircleMinusFill
                                                                    : CircleMinus
                                                                : CircleMinus
                                                        }
                                                    />
                                                ),
                                                action: () => {
                                                    setFilters(() => {
                                                        if (!(name in filters))
                                                            filters[name] = {
                                                                compMode: 'not include',
                                                                val: '',
                                                            };
                                                        filters[name].compMode = 'not include';
                                                        recalc(dateRange, '', filters);
                                                        return filters;
                                                    });
                                                },
                                                text: 'Не включает',
                                                theme: 'danger',
                                            },
                                        ],
                                        [
                                            {
                                                iconStart: (
                                                    <Icon
                                                        data={
                                                            filters[name]
                                                                ? filters[name].compMode == 'equal'
                                                                    ? CirclePlusFill
                                                                    : CirclePlus
                                                                : CirclePlus
                                                        }
                                                    />
                                                ),
                                                action: () => {
                                                    setFilters(() => {
                                                        if (!(name in filters))
                                                            filters[name] = {
                                                                compMode: 'equal',
                                                                val: '',
                                                            };
                                                        filters[name].compMode = 'equal';
                                                        recalc(dateRange, '', filters);
                                                        return filters;
                                                    });
                                                },
                                                text: 'Равно',
                                            },
                                            {
                                                iconStart: (
                                                    <Icon
                                                        data={
                                                            filters[name]
                                                                ? filters[name].compMode ==
                                                                  'not equal'
                                                                    ? CircleMinusFill
                                                                    : CircleMinus
                                                                : CircleMinus
                                                        }
                                                    />
                                                ),
                                                action: () => {
                                                    setFilters(() => {
                                                        if (!(name in filters))
                                                            filters[name] = {
                                                                compMode: 'not equal',
                                                                val: '',
                                                            };
                                                        filters[name].compMode = 'not equal';
                                                        recalc(dateRange, '', filters);
                                                        return filters;
                                                    });
                                                },
                                                text: 'Не равно',
                                                theme: 'danger',
                                            },
                                        ],
                                    ]}
                                />
                            }
                        />
                    </div>
                ),
                render: render ? (args) => render(args) : undefined,
            });
        }

        return columns;
    };
    const columnData = [
        {
            name: 'advertId',
            placeholder: 'Айди РК',
        },
        {name: 'name', placeholder: 'Имя РК'},
        {name: 'type', placeholder: 'Тип'},
        {name: 'status', placeholder: 'Статус'},
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'drr', placeholder: 'Дрр, %'},
        {name: 'orders', placeholder: 'Заказов, шт.'},
        {name: 'sum_orders', placeholder: 'Заказов, ₽'},
        {name: 'views', placeholder: 'Показов, шт.'},
        {name: 'cpm', placeholder: 'CPM, %'},
        {name: 'ctr', placeholder: 'CTR, %'},
        {name: 'clicks', placeholder: 'Кликов, шт.'},
        {name: 'budget_current', placeholder: 'Баланс, ₽'},
        {name: 'budget_hold', placeholder: 'Удерживать баланс, ₽'},
        {name: 'budget_day', placeholder: 'Дневной бюджет, ₽'},
        {name: 'current_bid', placeholder: 'Текущая ставка, ₽'},
    ];
    const columns = generateColumns(columnData);

    const [filteredSummary, setFilteredSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        sum_orders: 0,
    });

    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [sort, setSort] = React.useState<any[]>([{column: 'Расход', order: 'asc'}]);
    // const [document, setUserDoc] = React.useState(getUserDoc());
    const document = getUserDoc();
    // const document = {};
    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const [dateRange, setDateRange] = useState([monthAgo, today]);
    const [startDate, endDate] = dateRange;
    const fieldRef = useRef(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    // console.log(document);
    // const lbdDate: DateTime =;
    // lbdDate.subtract(90, 'day');
    // setLbd(new Date());

    const [data, setTableData] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        drr: 0,
        orders: 0,
        sum_orders: 0,
    });

    const recalc = (daterng, selected = '', withfFilters = {}) => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);

        const summ = {
            views: 0,
            clicks: 0,
            sum: 0,
            ctr: 0,
            drr: 0,
            orders: 0,
            sum_orders: 0,
        };

        const temp: any[] = [];
        for (const [advertId, advertData] of Object.entries(
            document[selected == '' ? selectValue[0] : selected],
        )) {
            if (!advertId || !advertData || !advertData['days']) continue;
            const paramMap = {
                status: {
                    '-1': 'В процессе удаления',
                    4: 'Готова к запуску',
                    7: 'Завершена',
                    8: 'Отказался',
                    9: 'Идут показы',
                    11: 'Пауза',
                },
                type: {
                    4: 'Каталог',
                    5: 'Карточка товара',
                    6: 'Поиск',
                    7: 'Главная страница',
                    8: 'Авто',
                    9: 'Поиск + Каталог',
                },
            };
            const advertStatTemp = {
                advertId: advertId,
                name: advertData['name'],
                status: paramMap['status'][advertData['status']],
                type: paramMap['type'][advertData['type']],
                views: 0,
                clicks: 0,
                sum: 0,
                budget: 0,
                drr: 0,
                ctr: 0,
                orders: 0,
                sum_orders: 0,
            };

            for (const [strDate, day] of Object.entries(advertData['days'])) {
                if (!day) continue;
                const date = new Date(strDate);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                // if (strDate == '2023-12-28')
                //     console.log(
                //         strDate,
                //         date.getTime(),
                //         startDate.getTime(),
                //         startDate,
                //         date,
                //         endDate,
                //         date < startDate,
                //         date > endDate,
                //     );

                if (date < startDate || date > endDate) continue;
                advertStatTemp['views'] += day['views'];
                advertStatTemp['clicks'] += day['clicks'];
                advertStatTemp['sum'] += day['sum'];
                advertStatTemp['orders'] += day['orders'];
                advertStatTemp['sum_orders'] += day['sum_orders'];
                advertStatTemp['drr'] = advertStatTemp['sum_orders']
                    ? (advertStatTemp['sum'] / advertStatTemp['sum_orders']) * 100
                    : 100;

                advertStatTemp['ctr'] = advertStatTemp['views']
                    ? (advertStatTemp['clicks'] / advertStatTemp['views']) * 100
                    : 0;

                summ['views'] += day['views'];
                summ['clicks'] += day['clicks'];
                summ['sum'] += day['sum'];
                summ['orders'] += day['orders'];
                summ['sum_orders'] += day['sum_orders'];
                summ['drr'] = summ['sum_orders'] ? (summ['sum'] / summ['sum_orders']) * 100 : 100;
                summ['ctr'] = summ['views'] ? (summ['clicks'] / summ['views']) * 100 : 0;
            }

            for (const [key, val] of Object.entries(advertStatTemp)) {
                if (typeof val === 'number') {
                    if (key === 'drr') advertStatTemp[key] = Math.round(val * 100) / 100;
                    else if (key === 'ctr') advertStatTemp[key] = Math.round(val * 100) / 100;
                    else advertStatTemp[key] = Math.round(val);
                }
            }

            const compare = (a, filterData) => {
                const {val, compMode} = filterData;
                if (compMode == 'include') {
                    return String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
                }
                if (compMode == 'not include') {
                    return !String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
                }
                if (compMode == 'equal') {
                    return String(a).toLocaleLowerCase() == String(val).toLocaleLowerCase();
                }
                if (compMode == 'not equal') {
                    return String(a).toLocaleLowerCase() != String(val).toLocaleLowerCase();
                }
                return false;
            };

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '') continue;
                if (!compare(advertStatTemp[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }
            if (addFlag) temp.push(advertStatTemp);

            // data.push(advertStats);
        }

        for (const [key, val] of Object.entries(summ)) {
            if (typeof val === 'number') {
                if (key === 'drr') summ[key] = Math.round(val * 100) / 100;
                else summ[key] = Math.round(val);
            }
        }
        setSummary(summ);

        // console.log(temp);
        const filteredSummaryTemp = {
            views: 0,
            clicks: 0,
            sum: 0,
            ctr: 0,
            drr: 0,
            orders: 0,
            sum_orders: 0,
        };
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            for (const key of Object.keys(filteredSummaryTemp)) {
                filteredSummaryTemp[key] += row[key];
                filteredSummaryTemp['drr'] = filteredSummaryTemp['sum_orders']
                    ? (filteredSummaryTemp['sum'] / filteredSummaryTemp['sum_orders']) * 100
                    : 100;
                filteredSummaryTemp['ctr'] = filteredSummaryTemp['views']
                    ? (filteredSummaryTemp['clicks'] / filteredSummaryTemp['views']) * 100
                    : 0;
            }
        }
        for (const [key, val] of Object.entries(filteredSummaryTemp)) {
            if (typeof val === 'number') {
                if (key === 'drr') filteredSummaryTemp[key] = Math.round(val * 100) / 100;
                else if (key === 'ctr') filteredSummaryTemp[key] = Math.round(val * 100) / 100;
                else filteredSummaryTemp[key] = Math.round(val);
            }
        }
        setFilteredSummary(filteredSummaryTemp);
        // if (!temp.length) temp.push({});
        temp.sort((a, b) => b.advertId - a.advertId);
        setTableData(temp);
    };

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

    const [firstRecalc, setFirstRecalc] = useState(false);
    if (!document) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(document)) {
            campaignsNames.push({value: campaignName, content: campaignName});
        }
        setSelectOptions(campaignsNames as SelectOption<any>[]);
        const selected = campaignsNames[0]['value'];
        setSelectValue([selected]);

        recalc(dateRange, selected);
        setFirstRecalc(true);
    }

    const cardStyle = {
        width: '100%',
        maxWidth: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        marginRight: '4px',
        marginLeft: '4px',
    };

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            {/* <DatePicker></DatePicker>
            <DatePicker></DatePicker> */}
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                }}
            >
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['sum'])}
                        </Text>
                        <Text>Расход, ₽</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            className={b('summary-text')}
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['drr'])}
                        </Text>
                        <Text> Дрр, %</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['orders'])}
                        </Text>
                        <Text>Заказов, шт.</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['sum_orders'])}
                        </Text>
                        <Text> Заказов, ₽</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['views'])}
                        </Text>
                        <Text>Показов, шт.</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['clicks'])}
                        </Text>
                        <Text>Кликов, шт.</Text>
                    </div>
                </Card>
            </div>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <DropdownMenu
                        renderSwitcher={(props) => (
                            <Button
                                {...props}
                                style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                                view="outlined"
                            >
                                Управление
                            </Button>
                        )}
                        items={[
                            [
                                {
                                    action: () => console.log('Call'),
                                    text: 'Пополнить баланс',
                                },
                                {
                                    action: () => console.log('Send email'),
                                    text: 'Задать бюджет для удержания',
                                },
                                {
                                    action: () => console.log('Send email'),
                                    text: 'Задать ставку',
                                },
                            ],
                            {
                                action: () => console.log('Rename'),
                                text: 'Пауза',
                            },
                            {
                                action: () => console.log('Delete'),
                                text: 'Завершиить',
                                theme: 'danger',
                            },
                        ]}
                    />
                    <Select
                        className={b('selectCampaign')}
                        value={selectValue}
                        placeholder="Values"
                        options={selectOptions}
                        onUpdate={(nextValue) => {
                            setSelectValue(nextValue);
                            recalc(dateRange, nextValue[0]);
                        }}
                    />
                </div>

                <div ref={fieldRef}>
                    <Button
                        style={{cursor: 'pointer', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => {
                            setDatePickerOpen((curVal) => !curVal);
                        }}
                    >
                        {`${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString(
                            'ru-RU',
                        )}`}
                    </Button>
                </div>
                <Popup
                    open={datePickerOpen}
                    anchorRef={fieldRef}
                    onClose={() => recalc(dateRange)}
                    placement="bottom-end"
                >
                    <div style={{display: 'flex', flexDirection: 'row', marginLeft: 10}}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                width="max"
                                className={b('datePickerRangeButton')}
                                view="flat"
                                onClick={() => {
                                    const range = [today, today];
                                    setDateRange(range);
                                    recalc(range);
                                    setDatePickerOpen(false);
                                }}
                            >
                                Сегодня
                            </Button>
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
                                onClick={() => {
                                    const yesterday = new Date(today);
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    const range = [yesterday, yesterday];
                                    setDateRange(range);
                                    recalc(range);
                                    setDatePickerOpen(false);
                                }}
                            >
                                Вчера
                            </Button>
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
                                onClick={() => {
                                    const yesterday = new Date(today);
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    const eightDaysAgo = new Date(today);
                                    eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);
                                    const range = [eightDaysAgo, yesterday];
                                    setDateRange(range);
                                    recalc(range);
                                    setDatePickerOpen(false);
                                }}
                            >
                                7 дней
                            </Button>
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
                                onClick={() => {
                                    const yesterday = new Date(today);
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    const thirtyOneDaysAgo = new Date(today);
                                    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 30);
                                    const range = [thirtyOneDaysAgo, yesterday];
                                    setDateRange(range);
                                    recalc(range);
                                    setDatePickerOpen(false);
                                }}
                            >
                                30 дней
                            </Button>
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
                                onClick={() => {
                                    const yesterday = new Date(today);
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    const ninetyOneDaysAgo = new Date(today);
                                    ninetyOneDaysAgo.setDate(ninetyOneDaysAgo.getDate() - 90);
                                    const range = [ninetyOneDaysAgo, yesterday];
                                    setDateRange(range);
                                    recalc(range);
                                    setDatePickerOpen(false);
                                }}
                            >
                                90 дней
                            </Button>
                        </div>
                        <RangeCalendar
                            timeZone="Europe/Moscow"
                            onUpdate={(val) => {
                                const range = [val.start.toDate(), val.end.toDate()];
                                setDateRange(range);
                                setDatePickerOpen(false);
                                recalc(range);
                            }}
                        />
                    </div>
                </Popup>
            </div>
            <div
                style={{
                    width: '100%',
                    maxHeight: '50vh',
                    overflow: 'auto',
                }}
            >
                <DataTable
                    onSort={() => {
                        recalc(dateRange);
                    }}
                    settings={{stickyHead: MOVING, stickyFooter: MOVING}}
                    theme="yandex-cloud"
                    onRowClick={(row, index, event) => {
                        console.log(row, index, event);
                    }}
                    rowClassName={(_row, index) => b('tableRow_' + index)}
                    // defaultSortState={sort}
                    // sortState={sort}
                    // onSortStateChange={(state) => setSort(state)}
                    // className={b('tableStats')}
                    data={data}
                    columns={columns}
                    footerData={[filteredSummary]}
                />
            </div>
        </div>
    );
};
