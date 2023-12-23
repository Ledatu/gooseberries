import React, {useEffect, useState} from 'react';
import {
    Spin,
    Table,
    TableDataItem,
    withTableSelection,
    // withTableActions,
    withTableSorting,
    // withTableSettings,
    // TableActionConfig,
    // TableSettingsData,
    Button,
    Text,
    Card,
    TableColumnConfig,
} from '@gravity-ui/uikit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import {DatePicker} from '@gravity-ui/date-components';
// import {DocumentData, doc, getDoc} from 'firebase/firestore';
// import Userfront from '@userfront/toolkit';
// import {db} from 'src/utilities/firebase-config';

const MyTable = withTableSorting(withTableSelection(Table));

// const getUserDoc = () => {
//     const [document, setDocument] = useState<DocumentData>();

//     useEffect(() => {
//         const dataFetch = async () => {
//             const document = (
//                 await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))
//             ).data() ?? {campaigns: []};
//             const adverts = {};
//             for (let i = 0; i < document.campaigns.length; i++) {
//                 const campaignName = document.campaigns[i].campaignName;
//                 if (!(campaignName in adverts)) adverts[campaignName] = {adverts: {}, stats: {}};
//                 try {
//                     const campaignAdverts = (
//                         await getDoc(
//                             doc(
//                                 db,
//                                 'customers',
//                                 Userfront.user.userUuid ?? '',
//                                 campaignName,
//                                 'adverts',
//                             ),
//                         )
//                     ).data();
//                     adverts[campaignName].adverts = campaignAdverts;
//                     console.log(adverts[campaignName].adverts);

//                     for (const [advertId, _] of Object.entries(adverts[campaignName].adverts)) {
//                         if (_ || advertId) {
//                         }
//                         if (!(advertId in adverts[campaignName].stats))
//                             adverts[campaignName].stats[advertId] = {};
//                         const advertStats = (
//                             await getDoc(
//                                 doc(
//                                     db,
//                                     'customers',
//                                     Userfront.user.userUuid ?? '',
//                                     campaignName,
//                                     'adverts',
//                                     advertId,
//                                     'fullstat',
//                                 ),
//                             )
//                         ).data();
//                         adverts[campaignName].stats[advertId] = advertStats;
//                     }
//                     setDocument(adverts);
//                 } catch (e) {
//                     console.log(e);
//                 }
//             }
//         };

//         dataFetch();
//     }, []);

//     return document;
// };
// import axios from 'axios';

import block from 'bem-cn-lite';
// import {doc, getDoc} from 'firebase/firestore';
// import {db} from 'src/utilities/firebase-config';

import axios from 'axios';
const b = block('app');

const getUserDoc = () => {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                'http://185.164.172.100:24456/api/getStatsByDay',
                {campaign: 'mayusha'},
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
            id: 'advertId',
            name: 'Айди РК',
            meta: {sort: true},
            // sticky: 'left',
        } as TableColumnConfig<TableDataItem>,
        {id: 'name', name: 'Имя РК', meta: {sort: true}},
        {id: 'type', name: 'Тип', meta: {sort: true}},
        {id: 'status', name: 'Сатус', meta: {sort: true}},
        {id: 'sum', name: 'Расход', meta: {sort: true}},
        {id: 'drr', name: 'Дрр', meta: {sort: true}},
        {id: 'orders', name: 'Заказы', meta: {sort: true}},
        {id: 'sum_orders', name: 'Сумма заказов', meta: {sort: true}},
        {id: 'views', name: 'Показы', meta: {sort: true}},
        {id: 'srm', name: 'CRM', meta: {sort: true}},
        {id: 'ctr', name: 'CTR', meta: {sort: true}},
        {id: 'clicks', name: 'Клики', meta: {sort: true}},
        {id: 'budget_current', name: 'Баланс', meta: {sort: true}},
        {id: 'budget_hold', name: 'Удерживать баланс', meta: {sort: true}},
        {id: 'budget_day', name: 'Дневной бюджет', meta: {sort: true}},
        {id: 'bid', name: 'Текущая ставка', meta: {sort: true}},
    ];

    const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
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

    const [data, setTableData] = useState<TableDataItem[]>([]);
    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        drr: 0,
        orders: 0,
        sum_orders: 0,
    });

    const recalc = (daterng) => {
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

        const temp: TableDataItem[] = [];
        for (const [advertId, advertData] of Object.entries(document)) {
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
                // if (strDate == '2023-12-22')
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

    // useEffect(() => recalc(dateRange), []);
    if (!document) return <Spin />;

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
                    <Button style={{marginRight: '8px', marginBottom: '8px'}}>Пауза</Button>
                    <Button style={{marginRight: '8px', marginBottom: '8px'}}>Завершиить</Button>
                    <Button style={{marginRight: '8px', marginBottom: '8px'}}>
                        Пополнить баланс
                    </Button>
                    <Button style={{marginRight: '8px', marginBottom: '8px'}}>
                        Задать бюджет для удержания
                    </Button>
                    <Button style={{marginRight: '8px', marginBottom: '8px'}}>Задать ставку</Button>
                </div>
                <Button
                    style={{marginRight: '8px', marginBottom: '8px'}}
                    onClick={() => {
                        recalc(dateRange);
                    }}
                >
                    Обновить
                </Button>
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
            <MyTable
                // defaultSortState={sort}
                // sortState={sort}
                // onSortStateChange={(state) => setSort(state)}
                className={b('tableStats')}
                data={data}
                columns={columns}
                onSelectionChange={(val) => {
                    console.log(val, selectedIds);
                    setSelectedIds(val);
                }}
                selectedIds={selectedIds}
                // getRowActions={function (
                //     item: TableDataItem,
                //     index: number,
                // ): TableActionConfig<TableDataItem>[] {
                //     // console.log(item, index);
                //     if (item || index) {
                //     }

                //     return [
                //         {
                //             text: 'Изменить',
                //             handler: (item, index, event) => {
                //                 if (item || index || event) {
                //                 }

                //                 // console.log(event, index, item);
                //             },
                //             // icon?: MenuItemProps['iconStart'];
                //         },
                //     ];
                // }}
                // settings={[]}
                // updateSettings={function (data: TableSettingsData): void {
                //     if (data) {
                //         console.log(data);
                //     }
                //     // filterColumns(columns, data);

                //     // throw new Error('Function// not implemented.');
                // }}
            />
        </div>
    );
};
