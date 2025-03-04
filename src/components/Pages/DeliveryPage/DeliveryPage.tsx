'use client';

import {ReactNode, useEffect, useId, useMemo, useRef, useState} from 'react';
import {
    Spin,
    Select,
    Icon,
    Button,
    Text,
    Link,
    Card,
    TextInput,
    Tooltip,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import {
    ChevronDown,
    ArrowsRotateLeft,
    Calculator,
    FileArrowDown,
    Box,
    Boxes3,
    FileArrowUp,
    Pencil,
} from '@gravity-ui/icons';

import callApi, {getUid} from '@/utilities/callApi';
import {defaultRender, getNormalDateRange, getRoundValue} from '@/utilities/getRoundValue';
import {motion} from 'framer-motion';
import {RangePicker} from '@/components/RangePicker';
import TheTable, {compare, generateFilterTextInput} from '@/components/TheTable';
import axios from 'axios';
import {WarehousesEdit} from './WarehousesEdit';
import {useCampaign} from '@/contexts/CampaignContext';
import {TagsFilterModal} from '@/components/TagsFilterModal';
import {useModules} from '@/contexts/ModuleProvider';
import {ModalWindow} from '@/shared/ui/Modal';

export const DeliveryPage = () => {
    const {selectValue, setSwitchingCampaignsFlag, sellerId, campaigns} = useCampaign();
    const {availablemodulesMap} = useModules();
    const permission: string = useMemo(() => {
        return availablemodulesMap['delivery'];
    }, [availablemodulesMap]);
    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 30);
    const [dateRange, setDateRange] = useState([weekAgo, yesterday]);
    const anchorRef = useRef(null);

    const [useMyStocks, setUseMyStocks] = useState(false);

    const [filters, setFilters] = useState<any>({undef: false});

    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const [splitCountIntoBoxes, setSplitCountIntoBoxes] = useState(true);

    const [changeToOrderCountModalOpen, setChangeToOrderCountModalOpen] = useState(false);
    const [changeToOrderCountModalOpenFromWarehouse, setChangeToOrderCountModalOpenFromWarehouse] =
        useState('');
    const [changeToOrderCountValue, setChangeToOrderCountValue] = useState(0);
    const [changeToOrderCountValueValid, setChangeToOrderCountValueValid] = useState(true);
    const orderCountValueTextInput = useRef<HTMLInputElement>(null);

    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadId = useId();
    const [doc, setDocument] = useState<any>();

    function handleChange(event: any) {
        const file = event.target.files[0];
        if (!file || !file.name.includes('.xlsx')) {
            setUploadProgress(-1);

            return;
        }
        event.preventDefault();
        const url = `https://seller.aurum-sky.net/backend/convertDeliiveryOrdersTemplate`;
        const formData = new FormData();
        if (!file) return;
        formData.append('uid', getUid());
        formData.append('campaignName', selectValue[0]);
        formData.append('splitCountIntoBoxes', JSON.stringify(splitCountIntoBoxes));
        formData.append('file', file);

        console.log(formData);

        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
            },
            onUploadProgress: function (progressEvent: any) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress(percentCompleted);
            },
        };

        axios
            .post(url, formData, config)
            .then((response) => {
                console.log(response.data);

                callApi('downloadDeliveryOrdersByBoxRows', {
                    uid: getUid(),
                    campaignName: selectValue[0],
                })
                    .then((res: any) => {
                        return res.data;
                    })
                    .then((blob) => {
                        const element = document.createElement('a');
                        element.href = URL.createObjectURL(blob);
                        element.download = `Отгрузочный лист ${selectValue[0]} ${new Date()
                            .toLocaleDateString('ru-RU')
                            .slice(0, 10)}.xlsx`;
                        // simulate link click
                        document.body.appendChild(element);
                        element.click();
                    });
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
            });
    }

    const [primeCostType, setPrimeCostType] = useState(['Себестоимость 1']);
    const primeCostTypeOptions = [
        {value: 'Себестоимость 1', content: 'Себестоимость 1'},
        {value: 'Себестоимость 2', content: 'Себестоимость 2'},
        {value: 'Себестоимость 3', content: 'Себестоимость 3'},
    ];

    const filterByClick = (val: any, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const renderFilterByClickButton = ({value}: any, key: any) => {
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

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    useEffect(() => {
        if (changedDoc) {
            console.log(changedDoc, changedDocUpdateType, selectValue);

            if (changedDocUpdateType) {
                doc['deliveryData'][selectValue] = changedDoc['deliveryData'][selectValue];
                doc['tariffs'][selectValue] = changedDoc['tariffs'][selectValue];
            }
            setDocument(changedDoc);
        }
    }, [changedDoc, changedDocUpdateType]);

    useEffect(() => {
        callApi(
            'getDeliveryOrders',
            {
                uid: getUid(),
                dateRange: getNormalDateRange(dateRange),
                campaignName: selectValue != '' ? selectValue : campaigns[0]?.name,
            },
            true,
        )
            .then((response) => {
                console.log('response?[data]', response?.data);
                setDocument(response ? response?.data : undefined);
            })
            .catch((error) => console.error(error));
    }, [dateRange, selectValue]);

    useEffect(() => {
        if (!selectValue) return;
        if (!doc) return;

        setSwitchingCampaignsFlag(true);
        if (!Object.keys(doc['deliveryData'][selectValue[0]]).length) {
            callApi(
                'getDeliveryOrders',
                {
                    uid: getUid(),
                    campaignName: selectValue,
                    dateRange: getNormalDateRange(dateRange),
                    data: {primeCostType: primeCostType[0], useMyStocks},
                },
                true,
            ).then((res) => {
                if (!res) return;
                const resData = res['data'];
                doc['deliveryData'][selectValue[0]] = resData['deliveryData'][selectValue[0]];
                doc['tariffs'][selectValue[0]] = resData['tariffs'][selectValue[0]];

                setChangedDoc({...doc});

                setSwitchingCampaignsFlag(false);
                console.log(doc);
            });
        } else {
            setSwitchingCampaignsFlag(false);
        }
        recalc(selectValue[0], filters);
        setPagesCurrent(1);
    }, [selectValue, doc]);

    const [updatingFlag, setUpdatingFlag] = useState(false);

    const [warehouseNames, setWarehouseNames] = useState([] as any[]);
    const [sortingType, setSortingType] = useState('');

    const rebalanceToCount = (val: number) => {
        const currentNumber = changeToOrderCountValue;
        const warehouse = changeToOrderCountModalOpenFromWarehouse;
        const k = currentNumber / val;
        for (let i = 0; i < filteredData.length; i++) {
            const row = filteredData[i];

            const {art} = row;
            const artData = doc.deliveryData[selectValue[0]][art];
            if (!artData) continue;
            const warehouseData = artData.byWarehouses[warehouse];
            if (!warehouseData) continue;

            const {toOrder, primeCost} = warehouseData;
            let {multiplicity} = warehouseData;
            if (!multiplicity) multiplicity = 10;

            if (!toOrder) continue;

            let newBoxCount = Math.floor(toOrder / k / multiplicity);
            if (!newBoxCount) newBoxCount = 1;

            const newOrder = Math.round(newBoxCount * multiplicity);
            // console.log(toOrder, newBoxCount, newOrder);

            // console.log(art, toOrder, newOrder);

            const tempWarehouseData = {...warehouseData};
            tempWarehouseData['toOrder'] = newOrder;
            tempWarehouseData['fullPrice'] = Math.round(newOrder * primeCost);
            // tempWarehouseData['prefObor'] = getRoundValue(newOrder, orderRate, false, 999);

            doc.deliveryData[selectValue[0]][art].byWarehouses[warehouse] = tempWarehouseData;

            setChangedDoc({...doc});
        }
    };

    const saveChangeToOrderCountValue = () => {
        if (orderCountValueTextInput.current !== null) {
            const val = orderCountValueTextInput.current.value;
            const temp = parseInt(val);
            if (isNaN(temp) || !isFinite(temp) || temp < 0) {
                setChangeToOrderCountValueValid(false);
            } else {
                rebalanceToCount(temp);
                setChangeToOrderCountModalOpen(false);
            }
        }
    };
    const generateEditCountButton = (addVal: number) => {
        return (
            <Button
                disabled={permission != 'Управление'}
                style={{width: 60, margin: 4}}
                pin="circle-circle"
                onClick={() => {
                    if (orderCountValueTextInput.current !== null) {
                        let val = orderCountValueTextInput.current.value;
                        if (val == '') val = '0';

                        const temp = parseInt(val);
                        if (isNaN(temp) || !isFinite(temp)) {
                            setChangeToOrderCountValueValid(false);
                        } else {
                            let res = temp + addVal;
                            if (res <= 0) res = 0;
                            orderCountValueTextInput.current.value = String(res);
                            setChangeToOrderCountValueValid(true);
                        }
                    }
                }}
            >
                <Text>{`${addVal > 0 ? '+' : ''}${addVal}`}</Text>
            </Button>
        );
    };
    useEffect(() => {
        if (dateChangeRecalc) {
            setUpdatingFlag(true);
            setDateChangeRecalc(false);

            callApi(
                'getDeliveryOrders',
                {
                    uid: getUid(),
                    campaignName: selectValue[0],
                    dateRange: getNormalDateRange(dateRange),
                    data: {primeCostType: primeCostType[0], useMyStocks},
                },
                true,
            ).then((res) => {
                if (!res) return;
                const resData = res['data'];
                doc['deliveryData'][selectValue[0]] = resData['deliveryData'][selectValue[0]];
                doc['tariffs'][selectValue[0]] = resData['tariffs'][selectValue[0]];

                setChangedDoc({...doc});

                setDateChangeRecalc(false);
                setUpdatingFlag(false);
                console.log(doc);
            });

            setPagesCurrent(1);
        }
    }, [dateChangeRecalc]);

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = doc
            ? doc.deliveryData[selected == '' ? selectValue[0] : selected]
            : {};

        const temp: any = {};
        for (const [art, data] of Object.entries(campaignData)) {
            const artData: any = data;
            if (!art || !artData) continue;
            if (!artData['art']) continue;

            const artInfo: any = {
                factoryArt: '',
                myStocks: 0,
                tags: [],
                art: '',
                brandArt: '',
                size: 0,
                object: '',
                brand: '',
                title: '',
                imtId: '',
                nmId: 0,
                barcode: 0,
                byWarehouses: {},
            };
            artInfo.factoryArt = artData['factoryArt'];
            artInfo.myStocks = artData['myStocks'];
            artInfo.art = artData['art'];
            artInfo.brandArt = artData['brand_art'];
            artInfo.tags = artData['tags'];
            artInfo.size = artData['size'];
            artInfo.object = artData['object'];
            artInfo.brand = artData['brand'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.imtId = artData['imtId'];
            artInfo.barcode = artData['barcode'];

            if (artData['byWarehouses']) {
                for (const [warehouse, data] of Object.entries(artData['byWarehouses'])) {
                    const warehouseData: any = data;
                    if (!warehouse || !warehouseData) continue;

                    let warehouseName = warehouse;
                    if (warehouse == 'all') warehouseName = 'Все склады';

                    artInfo[`${warehouseName}_orders`] = warehouseData['orders'];
                    artInfo[`${warehouseName}_orderRate`] = warehouseData['orderRate'];
                    artInfo[`${warehouseName}_stock`] = warehouseData['stock'];
                    artInfo[`${warehouseName}_toOrder`] = warehouseData['toOrder'];
                    artInfo[`${warehouseName}_obor`] = warehouseData['obor'];
                    artInfo[`${warehouseName}_prefObor`] = warehouseData['prefObor'];
                    artInfo[`${warehouseName}_primeCost`] = warehouseData['primeCost'];
                    artInfo[`${warehouseName}_fullPrice`] = warehouseData['fullPrice'];
                    artInfo[`${warehouseName}_profit`] = warehouseData['profit'];
                    artInfo[`${warehouseName}_sumOrders`] = warehouseData['sumOrders'];
                }
            }

            temp[art] = artInfo;
        }

        setTableData(temp);

        filterTableData(withfFilters, temp);
    };

    const [filteredSummary, setFilteredSummary] = useState<any>({});

    const filterTableData = (withfFilters: any = {}, tableData: any = {}) => {
        const temp = [] as any;
        const filteredSummaryTemp: any = {};

        for (const [art, artInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!art || !artInfo) continue;

            const tempTypeRow: any = artInfo;

            let addFlag = true;
            const useFilters: any = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
                if (filterArg == 'undef' || !filterData || filterArg == 'byWarehouses') continue;
                if (filterData['val'] == '') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (filterArg == 'art') {
                    let wholeText = flarg;
                    if (tempTypeRow['tags'])
                        for (const key of tempTypeRow['tags']) {
                            wholeText += key + ' ';
                        }

                    if (!compare(wholeText, filterData)) {
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

                for (const [key, val] of Object.entries(tempTypeRow)) {
                    if (
                        [
                            'art',
                            'nmId',
                            'barcode',
                            'size',
                            'brand',
                            'imtId',
                            'object',
                            'title',
                        ].includes(key)
                    )
                        continue;

                    if (!filteredSummaryTemp[key]) filteredSummaryTemp[key] = 0;

                    if (key.includes('obor')) {
                        if (!filteredSummaryTemp[key + 'count'])
                            filteredSummaryTemp[key + 'count'] = 0;

                        if (val != 999) {
                            filteredSummaryTemp[key] += val ?? 0;
                            filteredSummaryTemp[key + 'count'] += 1;
                        }
                    } else {
                        filteredSummaryTemp[key] += val ?? 0;
                    }
                }
            }
        }
        // console.log(temp);

        temp.sort((a: any, b: any) => {
            if (!a || !b) return false;
            if (!a.art || !b.art) return false;
            return a.art.localeCompare(b.art, 'ru-RU');
        });

        for (const [key, val] of Object.entries(filteredSummaryTemp)) {
            if (
                key === undefined ||
                val === undefined ||
                (() => {
                    for (const piece of [
                        'stock',
                        'toOrder',
                        'fullPrice',
                        'profit',
                        'sumOrders',
                        'myStocks',
                    ]) {
                        if (key.includes(piece)) return true;
                    }
                    return false;
                })()
            )
                continue;

            if (key.includes('obor')) {
                filteredSummaryTemp[key] = getRoundValue(
                    val as number,
                    filteredSummaryTemp[key + 'count'],
                );
            } else filteredSummaryTemp[key] = getRoundValue(val as number, temp.length);
        }

        setFilteredSummary(filteredSummaryTemp);
        setFilteredData(temp);
    };

    useEffect(() => {
        if (changedDoc) {
            setChangedDoc(undefined);
            setChangedDocUpdateType(false);
            recalc();
            setSwitchingCampaignsFlag(false);
        }
    }, [changedDoc]);

    if (!doc) return <Spin />;

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index, row}: any) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;
                const {nmId, tags} = row;

                const tagsNodes = [] as ReactNode[];
                if (tags) {
                    for (let i = 0; i < tags.length; i++) {
                        const tag = tags[i];
                        if (!tag) continue;

                        tagsNodes.push(
                            <Button
                                style={{margin: '0 4px'}}
                                size="xs"
                                pin="circle-circle"
                                selected
                                view="outlined-info"
                                onClick={() => filterByClick(tag.toUpperCase(), 'art')}
                            >
                                {tag.toUpperCase()}
                            </Button>,
                        );
                    }
                }

                return (
                    <div
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            marginRight: 8,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: `${String(filteredData.length).length * 6}px`,
                                    // width: 20,
                                    margin: '0 16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {Math.floor((pagesCurrent - 1) * 100 + index + 1)}
                            </div>
                            <Link
                                view="primary"
                                style={{whiteSpace: 'pre-wrap'}}
                                href={`https://www.wildberries.ru/catalog/${nmId}/detail.aspx?targetUrl=BP`}
                                target="_blank"
                            >
                                <Text variant="subheader-1">{value}</Text>
                            </Link>
                        </div>
                        <div
                            style={{
                                marginLeft: 16,
                                display: 'flex',
                                flexDirection: 'row',
                                overflow: 'scroll',
                                maxWidth: 200,
                                alignItems: 'center',
                            }}
                        >
                            {tagsNodes}
                        </div>
                    </div>
                );
            },
            valueType: 'text',
            group: true,
        },
        {
            name: 'size',
            placeholder: 'Размер',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'size'),
        },
        {
            name: 'brand',
            placeholder: 'Бренд',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'brand'),
        },
        {
            name: 'object',
            placeholder: 'Тип предмета',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'object'),
        },
        {
            name: 'title',
            placeholder: 'Наименование',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'title'),
        },
        {
            name: 'imtId',
            placeholder: 'ID КТ',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'imtId'),
        },
        {
            name: 'nmId',
            placeholder: 'Артикул WB',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'nmId'),
        },
        {
            name: 'barcode',
            placeholder: 'Баркод',
            valueType: 'text',
            render: (args: any) => renderFilterByClickButton(args, 'barcode'),
        },
        {
            name: 'myStocks',
            placeholder: 'Мои остатки, шт.',
            additionalNodes: [
                <Tooltip content="Подогнать поставку под мои остатки." openDelay={1000}>
                    <Button
                        style={{marginLeft: 5}}
                        selected={useMyStocks}
                        view="outlined"
                        onClick={() => {
                            setUseMyStocks(!useMyStocks);
                            setDateChangeRecalc(true);
                        }}
                    >
                        <Icon data={Box} />
                    </Button>
                </Tooltip>,
            ],
        },
        ...(() => {
            const columnTemp = [
                // {name: 'orders', placeholder: 'Заказы шт.'},
                {name: 'stock', placeholder: 'Остаток, шт.'},
                {name: 'orderRate', placeholder: 'Заказы шт./день'},
                {
                    name: 'obor',
                    placeholder: 'Оборач. текущ.',
                    render: ({row, value}: any, warehouseName: string) => {
                        if (value === undefined) return undefined;
                        const prefObor = row[warehouseName + '_prefObor'];
                        const stock = row[warehouseName + '_stock'];
                        const orderRate = row[warehouseName + '_orderRate'];
                        const diviation = Math.abs(getRoundValue(value, prefObor, true, 100) - 100);

                        return (
                            <Text
                                color={
                                    !stock && !orderRate
                                        ? 'secondary'
                                        : diviation < 25
                                          ? 'positive'
                                          : diviation < 50
                                            ? 'warning'
                                            : 'danger'
                                }
                            >
                                {defaultRender({value})}
                            </Text>
                        );
                    },
                },
                {name: 'prefObor', placeholder: 'Оборач. уст.'},
                {name: 'toOrder', placeholder: 'Отгрузить, шт.'},
                {name: 'primeCost', placeholder: 'Себестоимость, ₽'},
                {name: 'fullPrice', placeholder: 'Сумма, ₽'},
                // {
                //     name: 'profit',
                //     placeholder: 'Профит ₽ / Рент. %',
                //     render: ({row, value}, warehouseName) => {
                //         const sumOrders = row[warehouseName + '_sumOrders'];
                //         return (
                //             <Text color={value > 0 ? 'positive' : 'danger'}>
                //                 {`${new Intl.NumberFormat('ru-RU').format(
                //                     value,
                //                 )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                //                     getRoundValue(value, sumOrders, true),
                //                 )}%`}
                //             </Text>
                //         );
                //     },
                // },
            ];
            const columnsTemp = [] as any[];
            const createNewWarehouseColumn = (warehouse: string) => {
                const warehouseTariff = doc.tariffs[selectValue[0]][warehouse];
                const expr = warehouseTariff
                    ? warehouseTariff.boxDeliveryAndStorageExpr
                    : undefined;

                let warehouseName = warehouse;
                if (warehouseName == 'all') warehouseName = 'Все склады';

                const genSub = () => {
                    const subTemp = [] as any[];
                    for (const col of columnTemp) {
                        if (!col) continue;
                        const {name, placeholder, render} = col;

                        subTemp.push({
                            name: warehouseName + '_' + name,
                            header: generateFilterTextInput({
                                filters,
                                setFilters,
                                filterData: filterTableData,
                                name: warehouseName + '_' + name,
                                placeholder: placeholder,
                            }),
                            accessor: warehouseName + '_' + name,
                            render: render
                                ? (args: any) => render(args, warehouseName)
                                : defaultRender,
                        });
                    }

                    return subTemp;
                };

                const sub = genSub();
                // console.log(sub);

                columnsTemp.push({
                    name: 'warehouse_' + warehouseName,
                    placeholder: (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Text variant="subheader-1">{warehouseName}</Text>
                            <div style={{minWidth: 3}} />
                            <Text
                                variant="subheader-1"
                                color={expr > 135 ? 'danger' : expr > 85 ? 'warning' : 'positive'}
                            >
                                {expr ? `${expr}%` : ''}
                            </Text>
                        </div>
                    ),
                    additionalNodes: [
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                disabled={permission != 'Управление'}
                                size="xs"
                                view="outlined"
                                onClick={() => {
                                    setChangeToOrderCountModalOpen(true);
                                    setChangeToOrderCountModalOpenFromWarehouse(warehouse);
                                    setChangeToOrderCountValue(
                                        filteredSummary[`${warehouseName}_toOrder`],
                                    );
                                    setChangeToOrderCountValueValid(true);
                                }}
                            >
                                <Icon data={Pencil} size={13} />
                                <Text variant="subheader-1">Изменить количество</Text>
                            </Button>
                            <div style={{minWidth: 8}} />
                            <Button
                                disabled={permission != 'Управление'}
                                size="xs"
                                view="outlined"
                                onClick={() => {
                                    const params: any = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            arts: {},
                                            warehouseName: warehouseName,
                                        },
                                    };
                                    const warehouse =
                                        warehouseName == 'Все склады' ? 'all' : warehouseName;

                                    for (let i = 0; i < filteredData.length; i++) {
                                        const row = filteredData[i];
                                        if (!row) continue;
                                        const {art} = row;

                                        const docData = doc.deliveryData[selectValue[0]][art];
                                        if (!docData) continue;

                                        const warehouseData = docData.byWarehouses[warehouse];
                                        const toOrder = warehouseData.toOrder;
                                        if (!toOrder) continue;

                                        params.data.arts[art] = {
                                            factoryArt: docData.factoryArt,
                                            art: docData.art,
                                            barcode: docData.barcode,
                                            orderRate: warehouseData.orderRate,
                                            toOrder: toOrder,
                                            primeCost: warehouseData.primeCost,
                                            fullPrice: warehouseData.fullPrice,
                                        };
                                    }

                                    console.log(params);

                                    callApi('downloadOrdersArchive', params)
                                        .then((res: any) => {
                                            return res.data;
                                        })
                                        .then((blob) => {
                                            const element = document.createElement('a');
                                            element.href = URL.createObjectURL(blob);
                                            element.download = `Поставка ${
                                                selectValue[0]
                                            } ${warehouseName} ${new Date()
                                                .toLocaleDateString('ru-RU')
                                                .slice(0, 10)}.zip`;
                                            // simulate link click
                                            document.body.appendChild(element);
                                            element.click();
                                        });
                                }}
                            >
                                <Icon data={FileArrowDown} size={13} />
                                <Text variant="subheader-1">Скачать отгрузочный пакет</Text>
                            </Button>
                        </div>,
                    ],
                    sub: sub,
                });
            };

            if (doc.deliveryData[selectValue[0]]) {
                if (warehouseNames) {
                    const allWarehouses = [{name: 'all', visible: true}].concat(warehouseNames);
                    for (let i = 0; i < allWarehouses.length; i++) {
                        const warehouse = allWarehouses[i];
                        if (!warehouse['visible']) continue;
                        const name = warehouse['name'] ?? '';
                        columnsTemp.push({
                            sortable: false,
                            className: 'dividerColumn',
                            name: name + 'divider',
                            width: 5,
                            isDivider: true,
                        });
                        createNewWarehouseColumn(name);
                    }
                }
            }

            // columnsTemp.pop();

            return columnsTemp;
        })(),
    ];

    // useEffect(() => {
    //     if (!firstRecalc) {
    //         recalc(selectValue[0]);
    //         setFirstRecalc(true);
    //     }
    // }, [firstRecalc]);

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                    <div
                        style={{
                            marginBottom: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TagsFilterModal filterByButton={filterByClick} />
                        <div style={{minWidth: 8}} />
                        <Button
                            loading={updatingFlag}
                            size="l"
                            view="action"
                            onClick={() => {
                                setDateChangeRecalc(true);
                            }}
                        >
                            <Icon data={ArrowsRotateLeft} />
                        </Button>
                        <motion.div
                            style={{
                                overflow: 'hidden',
                                marginTop: 4,
                            }}
                            animate={{
                                maxWidth: updatingFlag ? 40 : 0,
                                opacity: updatingFlag ? 1 : 0,
                            }}
                        >
                            <Spin style={{marginLeft: 8}} />
                        </motion.div>
                        <div style={{minWidth: 8}} />
                        <Select
                            disabled={permission != 'Управление'}
                            onUpdate={(nextValue) => {
                                setPrimeCostType(nextValue);
                                setDateChangeRecalc(true);
                            }}
                            options={primeCostTypeOptions}
                            renderControl={({triggerProps: {onClick, onKeyDown}}) => {
                                return (
                                    <Button
                                        // ref={ref as Ref<HTMLButtonElement>}
                                        disabled={permission != 'Управление'}
                                        size="l"
                                        style={{
                                            width: '100%',
                                        }}
                                        view="outlined-warning"
                                        onClick={onClick}
                                        onKeyDown={onKeyDown}
                                    >
                                        <Text variant="subheader-1">{primeCostType[0]}</Text>
                                        <Icon data={ChevronDown} />
                                    </Button>
                                );
                            }}
                        />
                        <ModalWindow
                            isOpen={changeToOrderCountModalOpen}
                            handleClose={() => setChangeToOrderCountModalOpen(false)}
                        >
                            <div>
                                <Card
                                    view="clear"
                                    style={{
                                        width: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: 'none',
                                    }}
                                >
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Text style={{marginLeft: 8}} variant="subheader-1">
                                            Отгрузить, шт.
                                        </Text>
                                        <TextInput
                                            size="l"
                                            controlRef={orderCountValueTextInput}
                                            hasClear
                                            defaultValue={String(changeToOrderCountValue)}
                                            validationState={
                                                changeToOrderCountValueValid ? undefined : 'invalid'
                                            }
                                        />
                                    </div>
                                    <div style={{minHeight: 8}} />
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            {generateEditCountButton(100)}
                                            {generateEditCountButton(500)}
                                            {generateEditCountButton(1000)}
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            {generateEditCountButton(-100)}
                                            {generateEditCountButton(-500)}
                                            {generateEditCountButton(-1000)}
                                        </div>
                                    </div>
                                    <div style={{minHeight: 8}} />
                                    <Button
                                        disabled={permission != 'Управление'}
                                        pin="circle-circle"
                                        size="l"
                                        view="action"
                                        onClick={saveChangeToOrderCountValue}
                                    >
                                        <Icon data={Calculator} />
                                        <Text variant="subheader-1">Рассчитать</Text>
                                    </Button>
                                </Card>
                            </div>
                        </ModalWindow>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                    }}
                >
                    <Button
                        disabled={permission != 'Управление'}
                        size="l"
                        view={'outlined-warning'}
                        onClick={() => {
                            setUploadProgress(0);
                            callApi('downloadDeliveryOrdersFactoryArtTemplate', {
                                uid: getUid(),
                                campaignName: selectValue[0],
                            })
                                .then((res: any) => {
                                    return res.data;
                                })
                                .then((blob) => {
                                    const element = document.createElement('a');
                                    element.href = URL.createObjectURL(blob);
                                    element.download = `Шаблон.xlsx`;
                                    // simulate link click
                                    document.body.appendChild(element);
                                    element.click();
                                });
                        }}
                    >
                        <Icon data={FileArrowDown} size={20} />
                        <Text variant="subheader-1">Скачать шаблон</Text>
                    </Button>
                    <div style={{minWidth: 8}} />
                    <label htmlFor={uploadId}>
                        <Button
                            disabled={permission != 'Управление'}
                            size="l"
                            onClick={() => {
                                setUploadProgress(0);
                                (document.getElementById(uploadId) as HTMLInputElement).value = '';
                            }}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
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
                            <Icon data={FileArrowUp} size={20} />
                            <Text variant="subheader-1">Обработать шаблон</Text>

                            <input
                                disabled={permission != 'Управление'}
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
                        </Button>
                    </label>
                    <div style={{minWidth: 8}} />
                    <Tooltip
                        content="Выбор того будет ли общее количество товаров разбито на коробки"
                        openDelay={1000}
                    >
                        <Button
                            disabled={permission != 'Управление'}
                            size="l"
                            view={splitCountIntoBoxes ? 'outlined-success' : 'outlined'}
                            selected={splitCountIntoBoxes}
                            onClick={() => setSplitCountIntoBoxes(!splitCountIntoBoxes)}
                        >
                            <Icon data={Boxes3} size={20} />
                        </Button>
                    </Tooltip>
                    <div style={{minWidth: 8}} />
                    <WarehousesEdit
                        columns={warehouseNames}
                        setColumns={setWarehouseNames}
                        sellerId={sellerId}
                        sortingType={sortingType}
                        setSortingType={setSortingType}
                    />
                    <div style={{minWidth: 8}} />
                    <RangePicker
                        args={{
                            recalc: () => setDateChangeRecalc(true),
                            dateRange,
                            setDateRange,
                            anchorRef,
                        }}
                    />
                </div>
            </div>

            <TheTable
                columnData={columnData}
                data={filteredData}
                filters={filters}
                setFilters={setFilters}
                filterData={filterTableData}
                footerData={[filteredSummary]}
                tableId={'deliveryOrders'}
                usePagination={true}
                defaultPaginationSize={150}
                onPaginationUpdate={({page, paginatedData}: any) => {
                    setPagesCurrent(page);
                    setFilteredSummary((row: any) => {
                        const fstemp = row;
                        fstemp['art'] =
                            `На странице SKU: ${paginatedData.length} Всего SKU: ${filteredData.length}`;

                        return fstemp;
                    });
                }}
                height={'calc(100vh - 10em - 60px)'}
            />
        </div>
    );
};
