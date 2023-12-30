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

    // TextInput,
} from '@gravity-ui/uikit';
import {RangeCalendar} from '@gravity-ui/date-components';
import '../App.scss';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import block from 'bem-cn-lite';

import axios from 'axios';
import Userfront from '@userfront/toolkit';
import DataTable from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
const b = block('app');

const getUserDoc = () => {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                'http://185.164.172.100:24456/api/getStatsByDay',
                {uid: Userfront.user.userUuid ?? ''},
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
    const columns = [
        {
            name: 'advertId',
            header: (
                <div
                    style={{width: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['advertId'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Айди РК"
                    />
                </div>
            ),
        },
        {
            name: 'name',
            // header: 'Имя РК',
            header: (
                <div
                    style={{minWidth: '100px', width: '100%'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['name'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Имя РК"
                    />
                </div>
            ),
        },
        {
            name: 'type',
            header: (
                <div
                    style={{minWidth: '80px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['type'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Тип"
                    />
                </div>
            ),
        },
        {
            name: 'status',
            header: (
                <div
                    style={{minWidth: '80px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['status'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Статус"
                    />
                </div>
            ),
        },
        {
            name: 'sum',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['sum'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Расход, ₽"
                    />
                </div>
            ),
        },
        {
            name: 'drr',
            header: (
                <div
                    style={{minWidth: '70px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput hasClear placeholder="Дрр, %" />
                </div>
            ),
        },
        {
            name: 'orders',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['orders'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Заказов, шт."
                    />
                </div>
            ),
        },
        {
            name: 'sum_orders',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['sum_orders'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Заказов, ₽"
                    />
                </div>
            ),
        },
        {
            name: 'views',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['views'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Показов, шт."
                    />
                </div>
            ),
        },
        {
            name: 'crm',
            header: (
                <div
                    style={{minWidth: '80px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['crm'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="CRM, %"
                    />
                </div>
            ),
        },
        {
            name: 'ctr',
            header: (
                <div
                    style={{minWidth: '80px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['ctr'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="CTR, %"
                    />
                </div>
            ),
        },
        {
            name: 'clicks',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['clicks'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Клики, шт."
                    />
                </div>
            ),
        },
        {
            name: 'budget_current',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['budget_current'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Баланс, ₽"
                    />
                </div>
            ),
        },
        {
            name: 'budget_hold',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['budget_hold'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Удерживать баланс, ₽"
                    />
                </div>
            ),
        },
        {
            name: 'budget_day',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['budget_day'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Дневной бюджет, ₽"
                    />
                </div>
            ),
        },
        {
            name: 'current_bid',
            header: (
                <div
                    style={{minWidth: '100px'}}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <TextInput
                        onChange={(val) => {
                            setFilters(() => {
                                filters['budget_day'] = val.target.value;
                                console.log(filters);
                                recalc(dateRange, '', filters);
                                return filters;
                            });
                        }}
                        hasClear
                        placeholder="Текущая ставка, ₽"
                    />
                </div>
            ),
        },
    ];

    const [filters, setFilters] = useState({undef: false});
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

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, val] of Object.entries(useFilters)) {
                if (filterArg == 'undef') continue;
                if (
                    !String(advertStatTemp[filterArg])
                        .toLocaleLowerCase()
                        .includes(String(val).toLocaleLowerCase())
                ) {
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
                            {summary['sum']}
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
                            {summary['drr']}
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
                            {summary['orders']}
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
                            {summary['sum_orders']}
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
                            {summary['views']}
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
                            {summary['clicks']}
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
