import React, {useEffect, useState} from 'react';
import {
    Spin,
    DropdownMenu,
    Button,
    Text,
    Card,
    Select,
    SelectOption,
    // TextInput,
} from '@gravity-ui/uikit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.scss';

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
            header: 'Айди РК',
        },
        {
            name: 'name',
            header: 'Имя РК',
        },
        {name: 'type', header: 'Тип'},
        {name: 'status', header: 'Сатус'},
        {name: 'sum', header: 'Расход'},
        {name: 'drr', header: 'Дрр'},
        {name: 'orders', header: 'Заказы'},
        {name: 'sum_orders', header: 'Сумма заказов'},
        {name: 'views', header: 'Показы'},
        {name: 'srm', header: 'CRM'},
        {name: 'ctr', header: 'CTR'},
        {name: 'clicks', header: 'Клики'},
        {name: 'budget_current', header: 'Баланс'},
        {name: 'budget_hold', header: 'Удерживать баланс'},
        {name: 'budget_day', header: 'Дневной бюджет'},
        {name: 'bname', header: 'Текущая ставка'},
    ];

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

    // console.log(document);

    const [data, setTableData] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        drr: 0,
        orders: 0,
        sum_orders: 0,
    });

    const recalc = (daterng, selected = '') => {
        const [startDate, endDate] = daterng;

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

            const advertStatTemp = {
                advertId: advertId,
                name: advertData['name'],
                status: advertData['status'],
                type: advertData['type'],
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
                // if (strDate == '2023-12- 22')
                //     console.log(lbd, strDate, date.getTime(), startDate.getTime(), date, startDate);

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
                    if (key === 'ctr') advertStatTemp[key] = Math.round(val * 100) / 100;
                    else advertStatTemp[key] = Math.round(val);
                }
            }

            temp.push(advertStatTemp);

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
                {/* <Button
                    style={{marginRight: '8px', marginBottom: '8px'}}
                    onClick={() => {
                        recalc(dateRange);
                    }}
                >
                    Обновить
                </Button> */}
                <DatePicker
                    style={{marginRight: '8px', marginBottom: '8px'}}
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                        setDateRange(update);
                        recalc(update);
                    }}
                />
            </div>
            <div
                style={{
                    // display: 'flex',
                    width: '100%',
                    height: '50vh',
                    display: 'block',
                }}
            >
                <DataTable
                    settings={{stickyHead: MOVING}}
                    theme="yandex-cloud"
                    // defaultSortState={sort}
                    // sortState={sort}
                    // onSortStateChange={(state) => setSort(state)}
                    // className={b('tableStats')}
                    data={data}
                    columns={columns}
                />
            </div>
        </div>
    );
};
