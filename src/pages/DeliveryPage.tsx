import React, {ReactNode, useEffect, useId, useRef, useState} from 'react';
import {
    Spin,
    Select,
    Icon,
    Button,
    Text,
    Link,
    Pagination,
    Card,
    Modal,
    List,
    TextInput,
    Tooltip,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import {
    ChevronDown,
    ArrowsRotateLeft,
    Tag,
    Calculator,
    TrashBin,
    FileArrowDown,
    Box,
    Boxes3,
    FileArrowUp,
    Pencil,
} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import {getNormalDateRange, getRoundValue} from 'src/utilities/getRoundValue';
import {motion} from 'framer-motion';
import {RangePicker} from 'src/components/RangePicker';
import TheTable, {compare, defaultRender, generateFilterTextInput} from 'src/components/TheTable';
import axios from 'axios';
import {User} from './Dashboard';
import {WarehousesEdit} from 'src/components/WarehousesEdit';

const getUserDoc = (
    dateRange,
    docum = undefined,
    mode = false,
    selectValue = '',
    userInfo: User,
) => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['deliveryData'][selectValue] = docum['deliveryData'][selectValue];
            doc['tariffs'][selectValue] = docum['tariffs'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi(
            'getDeliveryOrders',
            {
                uid: getUid(),
                dateRange: getNormalDateRange(dateRange),
                campaignName:
                    selectValue != ''
                        ? selectValue
                        : userInfo.campaignNames.includes('all')
                        ? 'ОТК ПРОИЗВОДСТВО'
                        : userInfo.campaignNames[0],
            },
            true,
        )
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const DeliveryPage = ({
    selectValue,
    setSwitchingCampaignsFlag,
    userInfo,
}: {
    selectValue: string[];
    setSwitchingCampaignsFlag: Function;
    userInfo: User;
}) => {
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

    const [filters, setFilters] = useState({undef: false});

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    const [splitCountIntoBoxes, setSplitCountIntoBoxes] = useState(true);

    const [changeToOrderCountModalOpen, setChangeToOrderCountModalOpen] = useState(false);
    const [changeToOrderCountModalOpenFromWarehouse, setChangeToOrderCountModalOpenFromWarehouse] =
        useState('');
    const [changeToOrderCountValue, setChangeToOrderCountValue] = useState(0);
    const [changeToOrderCountValueValid, setChangeToOrderCountValueValid] = useState(true);
    const orderCountValueTextInput = useRef<HTMLInputElement>(null);

    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);
    const [currentPricesCalculatedBasedOn, setCurrentPricesCalculatedBasedOn] = useState('');

    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadId = useId();
    function handleChange(event) {
        const file = event.target.files[0];
        if (!file || !file.name.includes('.xlsx')) {
            setUploadProgress(-1);

            return;
        }
        event.preventDefault();
        const url = `https://aurum-mp.ru/api/convertDeliiveryOrdersTemplate`;
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
            onUploadProgress: function (progressEvent) {
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

    const filterByClick = (val, key = 'art', compMode = 'include') => {
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

    useEffect(() => {
        if (!selectValue) return;

        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'no response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setAvailableTagsPending(false);
            });

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

                setChangedDoc(doc);

                setSwitchingCampaignsFlag(false);
                console.log(doc);
            });
        } else {
            setSwitchingCampaignsFlag(false);
        }
        recalc(selectValue[0], filters);
        setPagesCurrent(1);
    }, [selectValue]);

    const [updatingFlag, setUpdatingFlag] = useState(false);

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const [availableTags, setAvailableTags] = useState([] as any[]);
    const [availableTagsPending, setAvailableTagsPending] = useState(false);
    const [tagsModalOpen, setTagsModalOpen] = useState(false);

    const [warehouseNames, setWarehouseNames] = useState([] as any[]);
    const [sortingType, setSortingType] = useState('');

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0], userInfo);

    const rebalanceToCount = (val) => {
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

            setChangedDoc(doc);
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
    const generateEditCountButton = (addVal) => {
        return (
            <Button
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

    if (dateChangeRecalc) {
        setUpdatingFlag(true);
        setDateChangeRecalc(false);
        setCurrentPricesCalculatedBasedOn('');

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

            setChangedDoc(doc);

            setDateChangeRecalc(false);
            setUpdatingFlag(false);
            console.log(doc);
        });

        setPagesCurrent(1);
    }

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = doc
            ? doc.deliveryData[selected == '' ? selectValue[0] : selected]
            : {};

        const temp = {};
        for (const [art, artData] of Object.entries(campaignData)) {
            if (!art || !artData) continue;
            if (!artData['art']) continue;

            const artInfo = {
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
                for (const [warehouse, warehouseData] of Object.entries(artData['byWarehouses'])) {
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

    const [filteredSummary, setFilteredSummary] = useState({});

    const filterTableData = (withfFilters = {}, tableData = {}) => {
        const temp = [] as any;
        const filteredSummaryTemp = {};

        for (const [art, artInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!art || !artInfo) continue;

            const tempTypeRow = artInfo;

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
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

        temp.sort((a, b) => {
            if (!a || !b) return false;
            if (!a.art || !b.art) return false;
            return a.art.localeCompare(b.art, 'ru-RU');
        });
        const paginatedDataTemp = temp.slice(0, 150);

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
                filteredSummaryTemp[key] = getRoundValue(val, filteredSummaryTemp[key + 'count']);
            } else filteredSummaryTemp[key] = getRoundValue(val, temp.length);
        }

        filteredSummaryTemp[
            'art'
        ] = `На странице: ${paginatedDataTemp.length} Всего: ${temp.length}`;
        setFilteredSummary(filteredSummaryTemp);

        setFilteredData(temp);

        setPaginatedData(paginatedDataTemp);
        setPagesCurrent(1);
        setPagesTotal(Math.ceil(temp.length));
    };

    const [firstRecalc, setFirstRecalc] = useState(false);

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc();
        setSwitchingCampaignsFlag(false);
    }

    if (!doc) return <Spin />;

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index, row}) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;
                const {nmId, tags, brandArt} = row;

                const tagsNodes = [] as ReactNode[];
                if (tags) {
                    for (let i = 0; i < tags.length; i++) {
                        const tag = tags[i];
                        if (tag === undefined) continue;

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
                                <Text variant="subheader-1">{brandArt}</Text>
                            </Link>
                        </div>
                        {tagsNodes}
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
            render: (args) => renderFilterByClickButton(args, 'size'),
        },
        {
            name: 'brand',
            placeholder: 'Бренд',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'brand'),
        },
        {
            name: 'object',
            placeholder: 'Тип предмета',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'object'),
        },
        {
            name: 'title',
            placeholder: 'Наименование',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'title'),
        },
        {
            name: 'imtId',
            placeholder: 'ID КТ',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'imtId'),
        },
        {
            name: 'nmId',
            placeholder: 'Артикул WB',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'nmId'),
        },
        {
            name: 'barcode',
            placeholder: 'Баркод',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'barcode'),
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
                    render: ({row, value}, warehouseName) => {
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
                {
                    name: 'profit',
                    placeholder: 'Профит ₽ / Рент. %',
                    render: ({row, value}, warehouseName) => {
                        const sumOrders = row[warehouseName + '_sumOrders'];
                        return (
                            <Text color={value > 0 ? 'positive' : 'danger'}>
                                {`${new Intl.NumberFormat('ru-RU').format(
                                    value,
                                )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                    getRoundValue(value, sumOrders, true),
                                )}%`}
                            </Text>
                        );
                    },
                },
            ];
            const columnsTemp = [] as any[];
            const createNewWarehouseColumn = (warehouse) => {
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
                            render: render ? (args) => render(args, warehouseName) : defaultRender,
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
                                size="xs"
                                view="outlined"
                                onClick={() => {
                                    const params = {
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
                                            } ${new Date()
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

    if (!firstRecalc) {
        console.log(doc);

        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'no response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setAvailableTagsPending(false);
            });

        recalc(selectValue[0]);
        setFirstRecalc(true);
    }

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
                        <Button
                            style={{cursor: 'pointer'}}
                            view="action"
                            loading={availableTagsPending}
                            size="l"
                            onClick={async () => {
                                setTagsModalOpen(true);
                            }}
                        >
                            <Icon data={Tag} />
                            <Text variant="subheader-1">Теги</Text>
                        </Button>
                        <Modal
                            open={tagsModalOpen}
                            onClose={() => {
                                setTagsModalOpen(false);
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    width: '30vw',
                                    height: '60vh',
                                    margin: 20,
                                }}
                            >
                                {availableTagsPending ? (
                                    <div></div>
                                ) : (
                                    <List
                                        filterPlaceholder="Введите имя тега"
                                        emptyPlaceholder="Такой тег отсутствует"
                                        loading={availableTagsPending}
                                        items={availableTags}
                                        renderItem={(item) => {
                                            return (
                                                <Button
                                                    size="xs"
                                                    pin="circle-circle"
                                                    selected
                                                    view={'outlined-info'}
                                                >
                                                    {item.toUpperCase()}
                                                </Button>
                                            );
                                        }}
                                        onItemClick={(item) => {
                                            filterByClick(item, 'art');
                                            setTagsModalOpen(false);
                                        }}
                                    />
                                )}
                            </div>
                        </Modal>
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
                            <Text variant="subheader-1">Обновить</Text>
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
                            onUpdate={(nextValue) => {
                                setPrimeCostType(nextValue);
                                setDateChangeRecalc(true);
                            }}
                            options={primeCostTypeOptions}
                            renderControl={({onClick, onKeyDown, ref}) => {
                                return (
                                    <Button
                                        size="l"
                                        style={{
                                            width: '100%',
                                        }}
                                        ref={ref}
                                        view="outlined-warning"
                                        onClick={onClick}
                                        extraProps={{
                                            onKeyDown,
                                        }}
                                    >
                                        <Text variant="subheader-1">{primeCostType[0]}</Text>
                                        <Icon data={ChevronDown} />
                                    </Button>
                                );
                            }}
                        />
                        <Modal
                            open={changeToOrderCountModalOpen}
                            onClose={() => {
                                setChangeToOrderCountModalOpen(false);
                            }}
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
                                        margin: 20,
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
                        </Modal>
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
                        selectValue={selectValue}
                        sortingType={sortingType}
                        setSortingType={setSortingType}
                    />
                    <div style={{minWidth: 8}} />
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

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Card
                    theme={currentPricesCalculatedBasedOn != '' ? 'warning' : undefined}
                    style={{
                        width: '100%',
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
                    pageSize={150}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 150, page * 150);
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
