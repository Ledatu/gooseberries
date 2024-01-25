import React, {useEffect, useRef, useState} from 'react';
import {
    Spin,
    DropdownMenu,
    Button,
    // Text,
    // Card,
    Select,
    SelectOption,
    // Popover,
    Popup,
    TextInput,
    Link,
    List,

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

const getUserDoc = (dateRange) => {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                'https://185.164.172.100:24458/api/getDeliveryOrders',
                {uid: Userfront.user.userUuid ?? '', dateRange: dateRange},
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

export const DeliveryOrdersPage = () => {
    const [columns, setColumns] = useState<Column<any>[]>([]);
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
    const [warehouseNames, setWarehouseNames] = useState<string[]>([]);
    const warehouseListRef = useRef(null);
    const [warehouseList, setWarehouseList] = useState<any[]>([]);
    const [warehouseListOpen, setWarehouseListOpen] = useState(false);

    const document = getUserDoc({
        from: dateRange[0]
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
        to: dateRange[1]
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    });
    // console.log(document);
    // const lbdDate: DateTime =;
    // lbdDate.subtract(90, 'day');
    // setLbd(new Date());

    const [data, setTableData] = useState<any[]>([]);

    const calcColumns = (selected = '', sortedWarehouseNames: any[] = []) => {
        const columnsTemp = [
            {
                name: 'art',
                // render: ({value}) => (
                //     <TextInput view="clear" defaultValue={`${(value as string) ?? ''}`}></TextInput>
                // ),
                header: (
                    <div
                        style={{width: '160px'}}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            onChange={(val) => {
                                setFilters(() => {
                                    filters['art'] = val.target.value;
                                    console.log(filters);
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder="Артикул"
                        />
                    </div>
                ),
            } as Column<any>,
            {
                name: 'object',
                // render: ({value}) => (
                //     <TextInput view="clear" defaultValue={`${(value as string) ?? ''}`}></TextInput>
                // ),
                header: (
                    <div
                        style={{width: '120px'}}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            onChange={(val) => {
                                setFilters(() => {
                                    filters['object'] = val.target.value;
                                    console.log(filters);
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder="Тип предмета"
                        />
                    </div>
                ),
            } as Column<any>,
            {
                name: 'link',
                render: ({value}: {value: any}) => {
                    // console.log(value);
                    return value ? (
                        <div style={{maxWidth: 100}}>
                            <Link
                                target="_blank"
                                href={`https://www.wildberries.ru/catalog/${value.nmId}/detail.aspx?targetUrl=BP`}
                            >
                                {value.title}
                            </Link>
                        </div>
                    ) : (
                        ''
                    );
                },
                sortable: false,
                header: (
                    <div
                        style={{width: '120px'}}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            onChange={(val) => {
                                setFilters(() => {
                                    filters['subject'] = val.target.value;
                                    console.log(filters);
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder="Наименование"
                        />
                    </div>
                ),
            } as Column<any>,
            {
                name: 'nmId',
                header: (
                    <div
                        style={{width: '120px'}}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            onChange={(val) => {
                                setFilters(() => {
                                    filters['nmId'] = val.target.value;
                                    console.log(filters);
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder="Артикул ВБ"
                        />
                    </div>
                ),
            } as Column<any>,
            {
                name: 'size',
                // render: ({value}) => (
                //     <TextInput view="clear" defaultValue={`${(value as string) ?? ''}`}></TextInput>
                // ),
                header: (
                    <div
                        style={{width: '70px'}}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            onChange={(val) => {
                                setFilters(() => {
                                    filters['size'] = val.target.value;
                                    console.log(filters);
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder="Размер"
                        />
                    </div>
                ),
            } as Column<any>,
            {
                name: 'barcode',
                // render: ({value}) => (
                //     <TextInput view="clear" defaultValue={`${(value as string) ?? ''}`}></TextInput>
                // ),
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
                                    filters['barcode'] = val.target.value;
                                    console.log(filters);
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder="Штрихкод"
                        />
                    </div>
                ),
            } as Column<any>,
        ];
        const createNewWarehouseColumn = (warehouseName) => {
            columnsTemp.push({
                name: 'warehouse_' + warehouseName,
                header: warehouseName,
                sub: [
                    {
                        name: warehouseName + '_orders',
                        header: 'Заказы шт.',
                        accessor: warehouseName + '_orders',
                    },
                    {
                        name: warehouseName + '_orderRate',
                        header: 'Заказы шт./день',
                        accessor: warehouseName + '_orderRate',
                    },
                    {
                        name: warehouseName + '_obor',
                        header: 'Оборачиваемость',
                        width: 500,
                        accessor: warehouseName + '_obor',
                    },
                    {
                        name: warehouseName + '_stock',
                        header: 'Остаток',
                        accessor: warehouseName + '_stock',
                    },
                    {
                        name: warehouseName + '_toOrder',
                        header: 'К поставке',
                        accessor: warehouseName + '_toOrder',
                    },
                ],
            } as Column<any>);
        };
        createNewWarehouseColumn('Все склады');

        const warehouseNamesTemp =
            sortedWarehouseNames && sortedWarehouseNames.length
                ? sortedWarehouseNames
                : document[selected == '' ? selectValue[0] : selected]['warehouseNames'];
        if (warehouseNamesTemp) {
            for (let i = 0; i < warehouseNamesTemp.length; i++) {
                createNewWarehouseColumn(warehouseNamesTemp[i]);
            }
        }
        setWarehouseNames(warehouseNamesTemp);
        setWarehouseList(warehouseNamesTemp);
        console.log(warehouseNamesTemp);

        setColumns(columnsTemp);
    };

    const recalc = (daterng, selected = '', withfFilters = {}) => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const summ = {
            views: 0,
            clicks: 0,
            sum: 0,
            ctr: 0,
            drr: 0,
            orders: 0,
            sum_orders: 0,
        };
        setFilteredSummary(summ);
        console.log(withfFilters);

        const temp: any[] = [];
        for (const [art, artData] of Object.entries(
            document[selected == '' ? selectValue[0] : selected],
        )) {
            if (!art || !artData || art == 'warehouseNames') continue;
            const artInfo = {
                art: '',
                object: '',
                nmId: 0,
                link: {title: '', nmId: 0},
                size: 0,
                barcode: 0,
            };
            artInfo.art = artData['art'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.link.title = artData['title'];
            artInfo.link.nmId = artData['nmId'];
            artInfo.size = artData['size'];
            artInfo.barcode = artData['barcode'];

            artInfo['Все склады_orders'] = artData['byWarehouses']['Электросталь']['orders'];
            artInfo['Все склады_orderRate'] = artData['byWarehouses']['Электросталь']['orderRate'];
            artInfo['Все склады_stock'] = artData['byWarehouses']['Электросталь']['stock'];
            artInfo['Все склады_toOrder'] = artData['byWarehouses']['Электросталь']['toOrder'];

            if (artData['byWarehouses']) {
                for (const [warehouseName, warehouseData] of Object.entries(
                    artData['byWarehouses'],
                )) {
                    if (!warehouseName || !warehouseData) continue;

                    artInfo[`${warehouseName}_orders`] = warehouseData['orders'];
                    artInfo[`${warehouseName}_orderRate`] = warehouseData['orderRate'];
                    artInfo[`${warehouseName}_stock`] = warehouseData['stock'];
                    artInfo[`${warehouseName}_toOrder`] = warehouseData['toOrder'];
                    artInfo[`${warehouseName}_obor`] = warehouseData['obor'];
                }
            }

            temp.push(artInfo);
        }
        setTableData(temp);
    };

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

    const [firstRecalc, setFirstRecalc] = useState(false);
    if (!document) return <Spin />;
    if (!firstRecalc) {
        console.log(document);
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(document)) {
            campaignsNames.push({value: campaignName, content: campaignName});
        }
        setSelectOptions(campaignsNames as SelectOption<any>[]);
        const selected = campaignsNames[0]['value'];
        setSelectValue([selected]);

        calcColumns(selected);

        recalc(dateRange, selected);

        setFirstRecalc(true);
    }

    // columns = [
    //     {
    //         name: 'number',
    //     },
    //     {
    //         name: 'col1',
    //         group: true,
    //     },
    //     {
    //         name: 'col2',
    //     },
    //     {
    //         name: 'string',
    //         onClick: ({row, index}) => {
    //             alert(`Click on row #${index}: ${row.string}`);
    //         },
    //     },
    //     {
    //         name: 'complex',
    //         render: ({value}) => JSON.stringify(value, null, 2),
    //         defaultOrder: DataTable.DESCENDING,
    //         sortAscending: (item1, item2) => {
    //             const value1 = item1.row.complex.value;
    //             const value2 = item2.row.complex.value;
    //             return (value1 % 2) - (value2 % 2) || value1 - value2;
    //         },
    //     },
    //     {
    //         name: 'bar',
    //         render: ({value}) => (
    //             <div style={{width: value as number, height: 10, background: '#18b0ff'}} />
    //         ),
    //     },
    //     {
    //         name: 'multiLevel',
    //         sub: [
    //             {
    //                 name: 'sub1-1',
    //                 customStyle: () => ({backgroundColor: 'wheat', fontSize: '1.2em'}),
    //                 sub: [
    //                     {
    //                         name: 'sub2-1',
    //                     },
    //                     {
    //                         name: 'sub2-2',
    //                         sub: [
    //                             {
    //                                 name: 'sub3-1',
    //                                 accessor: 'something',
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //             {
    //                 name: 'sub1-2',
    //             },
    //         ],
    //     },
    // ];

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            {/* <DatePicker></DatePicker>
            <DatePicker></DatePicker> */}
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
                            calcColumns(nextValue[0]);
                        }}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{marginRight: 8}} ref={warehouseListRef}>
                        <Button
                            style={{cursor: 'pointer', marginBottom: '8px'}}
                            view="outlined"
                            onClick={() => {
                                setWarehouseListOpen((curVal) => !curVal);
                            }}
                        >
                            Склады
                        </Button>
                    </div>
                    <Popup
                        open={warehouseListOpen}
                        anchorRef={warehouseListRef}
                        onClose={() => recalc(dateRange)}
                        placement="bottom-end"
                    >
                        <div style={{display: 'flex', flexDirection: 'column', padding: 8}}>
                            <List
                                sortable
                                filterable
                                items={warehouseList}
                                onSortEnd={({oldIndex, newIndex}) => {
                                    console.log(oldIndex, newIndex);
                                    console.log(warehouseNames);

                                    const element = warehouseNames[oldIndex];
                                    warehouseNames.splice(oldIndex, 1);
                                    warehouseNames.splice(newIndex, 0, element);
                                    console.log(warehouseNames);
                                    // setWarehouseNames(warehouseNames);
                                }}
                                itemsHeight={200}
                                itemHeight={40}
                            />
                            <Button
                                style={{marginTop: 8}}
                                view="action"
                                onClick={() => {
                                    calcColumns('', warehouseNames);
                                    setWarehouseListOpen((curVal) => !curVal);
                                }}
                            >
                                Обновить
                            </Button>
                        </div>
                    </Popup>
                    <div ref={fieldRef}>
                        <Button
                            style={{cursor: 'pointer', marginBottom: '8px'}}
                            view="outlined"
                            onClick={() => {
                                setDatePickerOpen((curVal) => !curVal);
                            }}
                        >
                            {`${startDate.toLocaleDateString(
                                'ru-RU',
                            )} - ${endDate.toLocaleDateString('ru-RU')}`}
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
            </div>
            <div
                style={{
                    width: '100%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                }}
            >
                <DataTable
                    onSort={() => {
                        recalc(dateRange);
                    }}
                    settings={{
                        // dynamicRender: true,
                        stickyHead: MOVING,
                        stickyFooter: MOVING,
                        highlightRows: true,
                        stripedRows: true,
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
