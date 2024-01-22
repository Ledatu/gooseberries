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
    Link,
    Icon,
    Popover,
    Label,
    PopoverBehavior,
    Modal,
    Checkbox,
    RadioButton,
    // Checkbox,
    // RadioButton,
    // Icon,
    // TextInput,
} from '@gravity-ui/uikit';
import {RangeCalendar} from '@gravity-ui/date-components';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

import axios from 'axios';
import Userfront from '@userfront/toolkit';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
const b = block('app');

import {CircleMinusFill, CircleMinus, CirclePlusFill, CirclePlus, Funnel} from '@gravity-ui/icons';

const getUserDoc = () => {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                'http://185.164.172.100:24456/api/getMassAdverts',
                {uid: Userfront.user.userUuid ?? '', dateRange: {from: '2023', to: '2024'}},
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

export const MassAdvertPage = () => {
    const [filters, setFilters] = useState({undef: false});
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [budgetInputValue, setBudgetInputValue] = useState(500);
    const [bidInputValue, setBidInputValue] = useState(125);
    const [placementsRecomInputValue, setPlacementsRecomInputValue] = useState(false);
    const [placementsBoosterInputValue, setPlacementsBoosterInputValue] = useState(false);
    const [placementsCarouselInputValue, setPlacementsCarouselInputValue] = useState(true);

    const advertTypeSwitchValues: any[] = [
        {value: 'Авто', content: 'Авто'},
        {value: 'Поиск', content: 'Поиск'},
    ];
    const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = React.useState('Авто');

    const generateColumns = (columnsInfo) => {
        const columns: Column<any>[] = [
            // {
            //     sortable: false,
            //     name: 'selected',
            //     header: (
            //         // <Checkbox
            //         //     style={{marginTop: 5}}
            //         //     value={Number(selectAllDisplayed)}
            //         //     onUpdate={(checked) => {
            //         //         setSelectAllDisplayed(checked);
            //         //     }}
            //         //     size="l"
            //         // />
            //     ),
            //     render: ({value}) => {
            //         if (!value) return;
            //         const {val, disabled} = value as {val: boolean; disabled: boolean};
            //         if (disabled) return;
            //         return <Checkbox>{val}</Checkbox>;
            //     },
            // },
        ];
        if (!columnsInfo && !columnsInfo.length) return columns;
        for (let i = 0; i < columnsInfo.length; i++) {
            const column = columnsInfo[i];
            if (!column) continue;
            const {name, placeholder, width, render, className} = column;
            columns.push({
                name: name,
                className: b(className ?? (i == 0 ? 'td_fixed' : 'td_body')),
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
                render: render
                    ? (args) => render(args)
                    : ({value}) => {
                          return typeof value === 'number'
                              ? new Intl.NumberFormat('ru-RU').format(value)
                              : value;
                      },
            });
        }

        return columns;
    };

    const paramMap = {
        status: {
            '-1': 'В процессе удаления',
            4: 'Готова к запуску',
            7: 'Завершена',
            8: 'Отказался',
            // 9: 'Идут показы',
            9: 'Активна',
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
    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, row, footer}) => {
                return footer ? (
                    value
                ) : (
                    <Link
                        href={`https://www.wildberries.ru/catalog/${row.nmId}/detail.aspx?targetUrl=BP`}
                        target="_blank"
                    >
                        {value}
                    </Link>
                );
            },
        },
        {name: 'brand', placeholder: 'Бренд'},
        {name: 'object', placeholder: 'Предмет'},
        {name: 'stocks', placeholder: 'Остаток'},
        {
            name: 'adverts',
            placeholder: 'Реклама',
            render: ({value}) => {
                if (value === null) return;
                if (value === undefined)
                    return (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Label theme="unknown">Кампаний нет</Label>
                        </div>
                    );
                // console.log(value);
                const generateHtml = () => {
                    let string = `<div style={display: 'flex'}>`;
                    if (value) {
                        for (const [advertType, advertsOfType] of Object.entries(value)) {
                            if (!advertType || !advertsOfType) continue;

                            for (const [advertId, advertData] of Object.entries(advertsOfType)) {
                                if (!advertId || !advertData) continue;

                                string += `<div style="display: flex; flex-direction: row; justify-content: space-between; font-size: 8pt;">`;
                                string +=
                                    `<div style="margin: 0 4px;">ID: ${advertId}</div>` +
                                    `<div style="margin: 0 4px;">Тип: ${
                                        paramMap.type[advertData['type']]
                                    }</div>` +
                                    `<div style="margin: 0 4px;">Статус: ${
                                        paramMap.status[advertData['status']]
                                    }</div>`;
                                string += '</div>';
                            }
                        }
                    }
                    string += '</div>';
                    return string;
                };
                const tags: any[] = [];
                for (const [advertType, advertsOfType] of Object.entries(value)) {
                    if (!advertType || !advertsOfType) continue;
                    for (const [advertId, advertData] of Object.entries(advertsOfType)) {
                        if (!advertId || !advertData) continue;
                        const themeToUse = advertData['status'] == 9 ? 'success' : 'danger';

                        tags.push(
                            <div style={{margin: '0 2px'}}>
                                <Label theme={themeToUse}>{paramMap.type[advertType]}</Label>
                            </div>,
                        );
                    }
                }

                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Popover
                            behavior={'delayed' as PopoverBehavior}
                            disabled={value === undefined}
                            htmlContent={generateHtml()}
                        >
                            <div style={{display: 'flex'}}>{tags}</div>
                        </Popover>
                    </div>
                );
            },
        },
        // {
        //     name: 'budget',
        //     placeholder: 'Бюджет, ₽',
        //     className: 'td_budget',
        //     render: ({value}) => {
        //         if (value === null) return;
        //         return (
        //             <div style={{justifyContent: 'center'}}>
        //                 <TextInput size="s" view="clear" />
        //             </div>
        //         );
        //     },
        // },
        {name: 'orders', placeholder: 'Заказов, шт.'},
        {name: 'sum_orders', placeholder: 'Заказов, ₽'},
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'drr', placeholder: 'ДРР, %'},
        {name: 'views', placeholder: 'Показов, шт.'},
        {name: 'clicks', placeholder: 'Кликов, шт.'},
        {name: 'ctr', placeholder: 'CTR, %'},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'cr', placeholder: 'CR, %'},
        {name: 'cpo', placeholder: 'CPO, ₽'},
    ];
    const columns = generateColumns(columnData);

    const [filteredSummary, setFilteredSummary] = useState({
        art: '',
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        sum_orders: 0,
        adverts: null,
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
        const getRoundValue = (a, b, isPercentage = false, def = 0) => {
            let result = b ? a / b : def;
            if (isPercentage) {
                result = Math.round(result * 100 * 100) / 100;
            } else {
                result = Math.round(result);
            }
            return result;
        };

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
        for (const [art, artData] of Object.entries(
            document[selected == '' ? selectValue[0] : selected],
        )) {
            if (!art || !artData) continue;
            const artInfo = {
                art: '',
                object: '',
                nmId: 0,
                title: '',
                stocks: 0,
                adverts: 0,
                brand: '',
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
            };
            artInfo.art = artData['art'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];
            artInfo.adverts = artData['adverts'];

            if (artData['advertsStats']) {
                for (const [strDate, day] of Object.entries(artData['advertsStats'])) {
                    if (!day) continue;
                    const date = new Date(strDate);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    if (date < startDate || date > endDate) continue;

                    artInfo.sum_orders += day['sum_orders'];
                    artInfo.orders += day['orders'];
                    artInfo.sum += day['sum'];
                    artInfo.views += day['views'];
                    artInfo.clicks += day['clicks'];
                }
                artInfo.sum_orders = Math.round(artInfo.sum_orders);
                artInfo.orders = Math.round(artInfo.orders);
                artInfo.sum = Math.round(artInfo.sum);
                artInfo.views = Math.round(artInfo.views);
                artInfo.clicks = Math.round(artInfo.clicks);

                artInfo.drr = getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1);
                artInfo.ctr = getRoundValue(artInfo.clicks, artInfo.views, true);
                artInfo.cpc = getRoundValue(artInfo.sum, artInfo.clicks);
                artInfo.cpm = getRoundValue(artInfo.sum * 1000, artInfo.views);
                artInfo.cr = getRoundValue(artInfo.orders, artInfo.views, true);
                artInfo.cpo = getRoundValue(artInfo.sum, artInfo.orders);
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
                if (!compare(artInfo[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }
            if (addFlag) temp.push(artInfo);

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
            art: `Показано артикулов: ${temp.length}`,
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
            adverts: null,
        };
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            filteredSummaryTemp.sum_orders += row['sum_orders'];
            filteredSummaryTemp.orders += row['orders'];
            filteredSummaryTemp.sum += row['sum'];
            filteredSummaryTemp.views += row['views'];
            filteredSummaryTemp.clicks += row['clicks'];
        }
        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);

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
            filteredSummaryTemp.sum,
            filteredSummaryTemp.clicks,
        );
        filteredSummaryTemp.cpm = getRoundValue(
            filteredSummaryTemp.sum * 1000,
            filteredSummaryTemp.views,
        );
        filteredSummaryTemp.cr = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.views,
            true,
        );
        filteredSummaryTemp.cpo = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.orders,
        );
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
        console.log(document);

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
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => setModalFormOpen(true)}
                    >
                        Создать РК
                    </Button>
                    <Modal open={modalFormOpen} onClose={() => setModalFormOpen(false)}>
                        <Card
                            // theme="raissed"
                            view="raised"
                            style={{
                                width: 300,
                                // maxWidth: '15vw',
                                // height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div
                                style={{
                                    height: '50%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginTop: '5%',
                                }}
                            >
                                <Text
                                    style={{
                                        margin: '8px 0',
                                    }}
                                    variant="display-2"
                                >
                                    Параметры
                                </Text>
                                <RadioButton
                                    style={{marginBottom: '4px'}}
                                    defaultValue={advertTypeSwitchValue}
                                    options={advertTypeSwitchValues}
                                    onUpdate={(val) => {
                                        setAdvertTypeSwitchValue(val);
                                    }}
                                />
                                <TextInput
                                    style={{
                                        maxWidth: '70%',
                                        margin: '4px 0',
                                    }}
                                    type="number"
                                    value={String(budgetInputValue)}
                                    onChange={(val) => {
                                        setBudgetInputValue(Number(val.target.value));
                                    }}
                                    label="Бюджет"
                                />
                                <TextInput
                                    style={{
                                        maxWidth: '70%',
                                        margin: '4px 0',
                                    }}
                                    type="number"
                                    value={String(bidInputValue)}
                                    onChange={(val) => {
                                        setBidInputValue(Number(val.target.value));
                                    }}
                                    label="Ставка"
                                />
                                <Checkbox
                                    style={{margin: '4px 0 2px 0'}}
                                    checked={placementsCarouselInputValue}
                                    onUpdate={(checked) => {
                                        setPlacementsCarouselInputValue(checked);
                                    }}
                                    title="Карточка товара"
                                    content="Карточка товара"
                                />
                                <Checkbox
                                    style={{margin: '2px 0'}}
                                    checked={placementsRecomInputValue}
                                    onUpdate={(checked) => {
                                        setPlacementsRecomInputValue(checked);
                                    }}
                                    title="Рекомендации на главной"
                                    content="Рекомендации на главной"
                                />
                                <Checkbox
                                    style={{margin: '2px 0'}}
                                    checked={placementsBoosterInputValue}
                                    onUpdate={(checked) => {
                                        setPlacementsBoosterInputValue(checked);
                                    }}
                                    title="Поиск/Каталог"
                                    content="Поиск/Каталог"
                                />
                                <Button
                                    style={{
                                        margin: '16px 0px',
                                        maxWidth: '60%',
                                    }}
                                    pin="circle-circle"
                                    size="l"
                                    width="max"
                                    view="action"
                                    // view="outlined-success"
                                    // selected
                                    onClick={() => {
                                        const params = {
                                            uid: Userfront.user.userUuid,
                                            campaignName: selectValue[0],
                                            arts: {},
                                        };
                                        for (let i = 0; i < data.length; i++) {
                                            const art = data[i].art;
                                            params.arts[art] = {
                                                type: advertTypeSwitchValue,
                                                budget: budgetInputValue,
                                                bid: bidInputValue,
                                                nmId: data[i].nmId,
                                                placements: {
                                                    recom: placementsRecomInputValue,
                                                    booster: placementsBoosterInputValue,
                                                    carousel: placementsCarouselInputValue,
                                                },
                                            };
                                        }
                                        console.log(params);

                                        //////////////////////////////////
                                        const token =
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                        axios
                                            .post(
                                                'http://185.164.172.100:24456/api/createMassAdverts',
                                                params,
                                                {
                                                    headers: {
                                                        Authorization: 'Bearer ' + token,
                                                    },
                                                },
                                            )
                                            .then((response) => console.log(response.data))
                                            .catch((error) => console.error(error));
                                        //////////////////////////////////

                                        setModalFormOpen(false);
                                    }}
                                >
                                    Запуск
                                </Button>
                            </div>
                        </Card>
                    </Modal>
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
                    maxHeight: '60vh',
                    overflow: 'auto',
                }}
            >
                <DataTable
                    startIndex={1}
                    settings={{
                        stickyHead: MOVING,
                        stickyFooter: MOVING,
                        displayIndices: true,
                        highlightRows: true,
                    }}
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
