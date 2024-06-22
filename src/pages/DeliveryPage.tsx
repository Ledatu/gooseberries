import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {
    Spin,
    Select,
    SelectOption,
    Icon,
    Button,
    Text,
    Link,
    Pagination,
    Modal,
    Card,
    TextInput,
    Checkbox,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

const b = block('app');

import {ChevronDown, Key, ArrowsRotateLeft, Calculator, TrashBin} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import Userfront from '@userfront/toolkit';
import {
    generateTextInputWithNoteOnTop,
    getNormalDateRange,
    getRoundValue,
} from 'src/utilities/getRoundValue';
import {motion} from 'framer-motion';
import {RangePicker} from 'src/components/RangePicker';
import TheTable, {compare, generateFilterTextInput} from 'src/components/TheTable';

const getUserDoc = (dateRange, docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['deliveryData'][selectValue] = docum['deliveryData'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getDeliveryOrders', {
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

export const DeliveryPage = ({pageArgs}) => {
    const {selectedCampaign, setSelectedCampaign} = pageArgs;
    console.log(selectedCampaign);

    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const [dateRange, setDateRange] = useState([weekAgo, yesterday]);
    const anchorRef = useRef(null);
    const [rangePickerOpen, setRangePickerOpen] = useState(false);

    const [filters, setFilters] = useState({undef: false});

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);
    const [currentPricesCalculatedBasedOn, setCurrentPricesCalculatedBasedOn] = useState('');

    const [enableOborRuleSet, setEnableOborRuleSet] = React.useState(false);
    const [oborRuleSet, setOborRuleSet] = React.useState({
        7: '',
        14: '',
        30: '',
        60: '',
        90: '',
        120: '',
        999: '',
    });
    const [oborRuleSetValidationState, setOborRuleSetValidationState] = React.useState({
        7: true,
        14: true,
        30: true,
        60: true,
        90: true,
        120: true,
        999: true,
    });
    const isOborRuleSetValid = () => {
        for (const [_, valid] of Object.entries(oborRuleSetValidationState)) {
            if (!valid) return false;
        }
        return true;
    };
    const clearOborRuleSet = () => {
        const temp = {...oborRuleSet};
        const tempValid = {...oborRuleSetValidationState};
        for (const [obor, _] of Object.entries(temp)) {
            temp[obor] = '';
            tempValid[obor] = true;
        }
        setEnableOborRuleSet(false);
        setOborRuleSet(temp);
        setOborRuleSetValidationState(tempValid);
    };

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

    const selectOptionsEntered = [
        {value: 'Цена после скидки', content: 'Цена после скидки'},
        {value: 'Цена с СПП', content: 'Цена с СПП'},
        {value: 'Наценка к себестоимости', content: 'Наценка к себестоимости'},
        {value: 'Рентабельность', content: 'Рентабельность'},
        {value: 'Профит', content: 'Профит'},
    ];
    const [selectValueEntered, setSelectValueEntered] = React.useState<string[]>([
        'Цена после скидки',
    ]);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');
    const [enteredValueValid, setEnteredValueValid] = useState(false);

    const [fixPrices, setFixPrices] = useState(false);

    const [changeDiscount, setChangeDiscount] = useState(false);
    const [enteredDiscountValue, setEnteredDiscountValue] = useState('');
    const [enteredDiscountValueValid, setEnteredDiscountValueValid] = useState(false);

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>(
        selectedCampaign != '' ? [selectedCampaign] : [],
    );

    useEffect(() => {
        setSelectedCampaign(selectValue[0]);
    }, [selectValue]);

    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = useState(false);
    const [updatingFlag, setUpdatingFlag] = useState(false);
    const [calculatingFlag, setCalculatingFlag] = useState(false);

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const [lastCalcOldData, setLastCalcOldData] = useState({});

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0]);

    if (dateChangeRecalc) {
        setUpdatingFlag(true);
        setDateChangeRecalc(false);
        setCurrentPricesCalculatedBasedOn('');
        setLastCalcOldData({});

        callApi('getDeliveryOrders', {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: getNormalDateRange(dateRange),
        }).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['deliveryData'][selectValue[0]] = resData['deliveryData'][selectValue[0]];

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
                art: '',
                size: 0,
                object: '',
                brand: '',
                title: '',
                imtId: '',
                nmId: 0,
                barcode: 0,
                byWarehouses: {},
            };
            artInfo.art = artData['art'];
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
                    filteredSummaryTemp[key] += val;
                }
            }
        }
        // console.log(temp);

        temp.sort((a, b) => {
            if (!a || !b) return false;
            if (!a.art || !b.art) return false;
            return a.art.localeCompare(b.art, 'ru-RU');
        });
        const paginatedDataTemp = temp.slice(0, 300);

        for (const [key, val] of Object.entries(filteredSummaryTemp)) {
            if (key === undefined || val === undefined || key == 'stock') continue;
            filteredSummaryTemp[key] = getRoundValue(val, temp.length);
        }

        filteredSummaryTemp[
            'art'
        ] = `На странице: ${paginatedDataTemp.length} Всего: ${temp.length}`;
        filteredSummaryTemp['cpo'] = getRoundValue(
            filteredSummaryTemp['sum'],
            filteredSummaryTemp['cpoOrders'],
        );
        filteredSummaryTemp['ad'] = getRoundValue(
            filteredSummaryTemp['cpo'],
            filteredSummaryTemp['buyoutsPercent'] / 100,
        );
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
    }

    if (!doc) return <Spin />;

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index, row}) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;
                const {nmId, tags} = row;

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
                                <Text variant="subheader-1">{value}</Text>
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
        ...(() => {
            const columnTemp = [
                {name: 'orders', placeholder: 'Заказы шт.'},
                {name: 'orderRate', placeholder: 'Заказы шт./день'},
                {name: 'obor', placeholder: 'Оборач. текущ.'},
                {name: 'prefObor', placeholder: 'Оборач. уст.'},
                {name: 'stock', placeholder: 'Остаток, шт.'},
                {name: 'toOrder', placeholder: 'Заказать, шт.'},
                {name: 'primeCost', placeholder: 'Себестоимость, ₽'},
                {name: 'fullPrice', placeholder: 'Сумма, ₽'},
            ];
            const columnsTemp = [] as any[];
            const createNewWarehouseColumn = (warehouseName) => {
                if (warehouseName == 'all') warehouseName = 'Все склады';

                const genSub = () => {
                    const subTemp = [] as any[];
                    for (const col of columnTemp) {
                        if (!col) continue;
                        const {name, placeholder} = col;

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
                        });
                    }

                    return subTemp;
                };

                const sub = genSub();
                // console.log(sub);

                columnsTemp.push({
                    name: 'warehouse_' + warehouseName,
                    placeholder: warehouseName,
                    sub: sub,
                });
            };

            if (doc.deliveryData[selectValue[0]]) {
                const warehouseNamesTemp = doc.deliveryData[selectValue[0]]['warehouseNames'];
                if (warehouseNamesTemp) {
                    for (let i = 0; i < warehouseNamesTemp.length; i++) {
                        createNewWarehouseColumn(warehouseNamesTemp[i]);
                    }
                }
            }

            return columnsTemp;
        })(),
    ];

    if (!firstRecalc) {
        console.log(selectValue);
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(doc['deliveryData'])) {
            if (Userfront.user.userUuid == 'ce86aeb0-30b7-45ba-9234-a6765df7a479') {
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
            } else if (Userfront.user.userUuid == '1c5a0344-31ea-469e-945e-1dfc4b964ecd') {
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

        recalc(selected);
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
                    <Select
                        className={b('selectCampaign')}
                        value={selectValue}
                        placeholder="Values"
                        options={selectOptions}
                        renderControl={({onClick, onKeyDown, ref}) => {
                            return (
                                <Button
                                    loading={switchingCampaignsFlag}
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
                            setSwitchingCampaignsFlag(true);

                            if (!Object.keys(doc['deliveryData'][nextValue[0]]).length) {
                                callApi('getDeliveryOrders', {
                                    uid: getUid(),
                                    campaignName: nextValue,
                                    dateRange: getNormalDateRange(dateRange),
                                }).then((res) => {
                                    if (!res) return;
                                    const resData = res['data'];
                                    doc['deliveryData'][nextValue[0]] =
                                        resData['deliveryData'][nextValue[0]];

                                    setChangedDoc(doc);
                                    setSelectValue(nextValue);

                                    setSwitchingCampaignsFlag(false);
                                    console.log(doc);
                                });
                            } else {
                                setSelectValue(nextValue);
                                setSwitchingCampaignsFlag(false);
                            }
                            recalc(nextValue[0], filters);
                            setPagesCurrent(1);
                        }}
                    />

                    <div
                        style={{
                            marginBottom: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <motion.div
                            style={{
                                overflow: 'hidden',
                                marginTop: 4,
                            }}
                            animate={{
                                maxWidth: switchingCampaignsFlag ? 40 : 0,
                                opacity: switchingCampaignsFlag ? 1 : 0,
                            }}
                        >
                            <Spin style={{marginLeft: 8}} />
                        </motion.div>
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
                        <Button
                            loading={calculatingFlag}
                            size="l"
                            view="action"
                            onClick={() => {
                                setEnteredValuesModalOpen(true);
                                setEnteredValue('');
                                setEnteredDiscountValue('');
                                clearOborRuleSet();
                                setFixPrices(false);
                                setEnteredValueValid(false);
                                setChangeDiscount(false);
                                setEnteredDiscountValueValid(false);
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
                                    width: '30em',
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
                                    <Select
                                        value={selectValueEntered}
                                        options={selectOptionsEntered}
                                        onUpdate={(val) => {
                                            setSelectValueEntered(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <TextInput
                                        disabled={enableOborRuleSet}
                                        placeholder={
                                            selectValueEntered[0] == 'Наценка к себестоимости'
                                                ? 'Введите наценку, %'
                                                : selectValueEntered[0] == 'Рентабельность'
                                                ? 'Введите рентабельность, %'
                                                : selectValueEntered[0] == 'Профит'
                                                ? 'Введите профит, ₽'
                                                : 'Введите цену, ₽'
                                        }
                                        value={enteredValue}
                                        validationState={
                                            enteredValueValid || enableOborRuleSet
                                                ? undefined
                                                : 'invalid'
                                        }
                                        onUpdate={(val) => {
                                            const temp = parseInt(val);
                                            setEnteredValueValid(!isNaN(temp));
                                            setEnteredValue(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <Checkbox
                                        content={'Изменить скидку'}
                                        checked={changeDiscount}
                                        onUpdate={(val) => {
                                            setChangeDiscount(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <TextInput
                                        disabled={!changeDiscount}
                                        placeholder={'Введите скидку, %'}
                                        value={enteredDiscountValue}
                                        validationState={
                                            changeDiscount
                                                ? enteredDiscountValueValid
                                                    ? undefined
                                                    : 'invalid'
                                                : undefined
                                        }
                                        onUpdate={(val) => {
                                            const temp = parseInt(val);
                                            setEnteredDiscountValueValid(!isNaN(temp));
                                            setEnteredDiscountValue(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <Checkbox
                                        content={'Зафиксировать цены'}
                                        checked={fixPrices || enableOborRuleSet}
                                        onUpdate={(val) => {
                                            setFixPrices(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <div
                                        style={{
                                            overflow: 'hidden',
                                            display: 'flex',
                                            width: 'calc(100%-32px)',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Checkbox
                                            checked={enableOborRuleSet}
                                            onUpdate={(val) => setEnableOborRuleSet(val)}
                                            content="Задать для оборачиваемости"
                                        />
                                        <motion.div
                                            animate={{
                                                height: enableOborRuleSet ? 136 : 0,
                                                opacity: enableOborRuleSet ? 1 : 0,
                                            }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {(() => {
                                                let oborPrev = -1;
                                                const oborTextInputs = [] as any[];
                                                for (const [obor, _] of Object.entries(
                                                    oborRuleSet,
                                                )) {
                                                    oborTextInputs.push(
                                                        <div
                                                            style={{width: '8em', margin: '0 4px'}}
                                                        >
                                                            {generateTextInputWithNoteOnTop({
                                                                value: oborRuleSet[obor],
                                                                disabled: !enableOborRuleSet,
                                                                validationState:
                                                                    oborRuleSetValidationState[
                                                                        obor
                                                                    ],
                                                                placeholder: `${
                                                                    oborPrev + 1
                                                                } - ${obor} дней`,
                                                                onUpdateHandler: (val) => {
                                                                    const curVal = {...oborRuleSet};
                                                                    const temp = parseInt(val);
                                                                    setOborRuleSetValidationState(
                                                                        () => {
                                                                            const tempValid = {
                                                                                ...oborRuleSetValidationState,
                                                                            };
                                                                            if (
                                                                                isNaN(temp) ||
                                                                                !isFinite(temp)
                                                                            ) {
                                                                                tempValid[obor] =
                                                                                    false;
                                                                            } else {
                                                                                tempValid[obor] =
                                                                                    true;
                                                                            }
                                                                            return tempValid;
                                                                        },
                                                                    );

                                                                    curVal[obor] = val;
                                                                    setOborRuleSet(curVal);
                                                                },
                                                            })}
                                                        </div>,
                                                    );
                                                    oborPrev = parseInt(obor);
                                                }

                                                return oborTextInputs;
                                            })()}
                                        </motion.div>
                                    </div>
                                    <div style={{minHeight: 8}} />

                                    <Button
                                        disabled={
                                            (!enableOborRuleSet && !enteredValueValid) ||
                                            (changeDiscount && !enteredDiscountValueValid) ||
                                            (enableOborRuleSet && !isOborRuleSetValid())
                                        }
                                        size="l"
                                        view="action"
                                        onClick={() => {
                                            setCalculatingFlag(true);
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                dateRange: getNormalDateRange(dateRange),
                                                enteredValue: {},
                                                fixPrices: fixPrices || enableOborRuleSet,
                                            };

                                            const keys = {
                                                'Цена после скидки': 'rozPrice',
                                                'Цена с СПП': 'sppPrice',
                                                'Наценка к себестоимости': 'primeCostMarkup',
                                                Рентабельность: 'rentabelnost',
                                                Профит: 'profit',
                                            };

                                            const key = keys[selectValueEntered[0]];
                                            params.enteredValue[key] = parseInt(
                                                enableOborRuleSet ? '-1' : enteredValue,
                                            );
                                            setCurrentPricesCalculatedBasedOn(
                                                key == 'primeCostMarkup' ? 'rozPrice' : key,
                                            );

                                            if (changeDiscount) {
                                                params.enteredValue['discount'] =
                                                    parseInt(enteredDiscountValue);
                                            }

                                            if (enableOborRuleSet) {
                                                const tempOborRuleSet = {};
                                                for (const [obor, val] of Object.entries(
                                                    oborRuleSet,
                                                )) {
                                                    tempOborRuleSet[obor] =
                                                        val !== '' ? parseInt(val) : undefined;
                                                }
                                                params.enteredValue['oborRuleSet'] =
                                                    tempOborRuleSet;
                                            }

                                            const filters = {
                                                brands: [] as string[],
                                                objects: [] as string[],
                                                arts: [] as string[],
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const row = filteredData[i];
                                                const {brand, object, art} = row ?? {};

                                                if (!filters.brands.includes(brand))
                                                    filters.brands.push(brand);
                                                if (!filters.objects.includes(object))
                                                    filters.objects.push(object);
                                                if (!filters.arts.includes(art))
                                                    filters.arts.push(art);
                                            }
                                            params.enteredValue['filters'] = filters;

                                            console.log(params);

                                            for (const [art, artData] of Object.entries(
                                                lastCalcOldData,
                                            )) {
                                                doc['deliveryData'][selectValue[0]][art] = artData;
                                            }
                                            setLastCalcOldData({});

                                            /////////////////////////
                                            callApi('getDeliveryOrders', params).then((res) => {
                                                if (!res) return;

                                                const tempOldData = {};
                                                const resData = res['data'];
                                                for (const [art, artData] of Object.entries(
                                                    resData['deliveryData'][selectValue[0]],
                                                )) {
                                                    tempOldData[art] =
                                                        doc['deliveryData'][selectValue[0]][art];

                                                    doc['deliveryData'][selectValue[0]][art] =
                                                        artData;
                                                }
                                                doc['artsData'][selectValue[0]] =
                                                    resData['artsData'][selectValue[0]];

                                                setLastCalcOldData(tempOldData);

                                                setChangedDoc(doc);
                                                setCalculatingFlag(false);
                                                console.log(doc);
                                            });

                                            setPagesCurrent(1);
                                            /////////////////////////

                                            setEnteredValuesModalOpen(false);
                                        }}
                                    >
                                        <Icon data={Calculator}></Icon>
                                        Рассчитать
                                    </Button>
                                </div>
                            </Card>
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
                    pageSize={300}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 300, page * 300);
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
