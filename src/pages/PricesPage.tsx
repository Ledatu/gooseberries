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

import {
    ChevronDown,
    Key,
    ArrowsRotateLeft,
    Calculator,
    LockOpen,
    Lock,
    CloudArrowUpIn,
    TrashBin,
} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare, defaultRender} from 'src/components/TheTable';
import Userfront from '@userfront/toolkit';
import {
    getNormalDateRange,
    getRoundValue,
    renderAsPercent,
    renderSlashPercent,
} from 'src/utilities/getRoundValue';
import {generateModalButtonWithActions} from './MassAdvertPage';
import {motion} from 'framer-motion';
import {RangePicker} from 'src/components/RangePicker';

const getUserDoc = (dateRange, docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['pricesData'][selectValue] = docum['pricesData'][selectValue];
            doc['artsData'][selectValue] = docum['artsData'][selectValue];
            doc['fixArtPrices'][selectValue] = docum['fixArtPrices'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getPricesMM', {
            uid: getUid(),
            dateRange: getNormalDateRange(dateRange),
            campaignName:
                Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594'
                    ? 'ИП Иосифова Р. И.'
                    : 'ИП Валерий',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const PricesPage = ({pageArgs}) => {
    const {setSelectedCampaign} = pageArgs;

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

    const [selectedButton, setSelectedButton] = useState('');
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);
    const [currentPricesCalculatedBasedOn, setCurrentPricesCalculatedBasedOn] = useState('');

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

    const fixedPriceRender = (args, keys, defaultRenderFunctionRes) => {
        const {row} = args;

        const {nmId, art} = row;

        const isFixedByKey = (() => {
            if (row['fixPrices'] === undefined) return false;
            for (const key of keys) {
                if (row['fixPrices'][key] !== undefined) return true;
            }
            return false;
        })();

        const isFixed = (() => {
            const temp = doc.fixArtPrices[selectValue[0]][nmId];
            if (temp === undefined) return false;
            for (const key of keys) {
                if (temp['enteredValue'][key] !== undefined) return true;
            }
            return false;
        })();

        if (!isFixedByKey && !isFixed) return defaultRenderFunctionRes;

        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {defaultRenderFunctionRes}
                <div style={{minWidth: 4}} />
                <Text
                    color={
                        isFixedByKey
                            ? 'brand'
                            : isFixed && lastCalcOldData[art] === undefined
                            ? 'positive'
                            : 'danger'
                    }
                >
                    <Icon data={isFixedByKey ? LockOpen : isFixed ? Lock : Lock} />
                </Text>
            </div>
        );
    };

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index, row}) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;
                const {nmId} = row;
                return (
                    <div
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            marginRight: 8,
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
            name: 'tags',
            placeholder: 'Теги',
            valueType: 'text',
            render: ({value}) => {
                if (value === undefined) return;
                const tags = [] as ReactNode[];

                for (let i = 0; i < value.length; i++) {
                    const tag = value[i];
                    if (tag === undefined) continue;

                    tags.push(
                        <Button
                            style={{margin: '0 4px'}}
                            size="xs"
                            pin="circle-circle"
                            selected
                            view="outlined-info"
                            onClick={() => filterByClick(value, 'tags')}
                        >
                            {tag.toUpperCase()}
                        </Button>,
                    );
                }
                return tags;
            },
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
        {name: 'wbPrice', placeholder: 'Цена до, ₽'},
        {
            name: 'discount',
            placeholder: 'Скидка, %',
            render: renderAsPercent,
        },
        {
            name: 'rozPrice',
            placeholder: (
                <Link
                    onClick={() => {
                        if (currentPricesCalculatedBasedOn == 'rozPrice') setDateChangeRecalc(true);
                    }}
                >
                    <Text
                        variant="subheader-1"
                        color={currentPricesCalculatedBasedOn == 'rozPrice' ? undefined : 'primary'}
                    >
                        Цена после скидки, ₽
                    </Text>
                </Link>
            ),
            render: (args) =>
                fixedPriceRender(
                    args,
                    ['rozPrice'],
                    ((args) => {
                        const {value, row} = args as any;
                        if (value === undefined) return undefined;
                        const {primeCost} = row;
                        return (
                            <Text color={primeCost > value ? 'danger' : 'primary'}>
                                {defaultRender(args as any)}
                            </Text>
                        );
                    })(args),
                ),
        },
        {
            name: 'spp',
            placeholder: 'СПП, %',
            render: renderAsPercent,
        },
        {
            name: 'sppPrice',
            placeholder: (
                <Link
                    onClick={() => {
                        if (currentPricesCalculatedBasedOn == 'sppPrice') setDateChangeRecalc(true);
                    }}
                >
                    <Text
                        variant="subheader-1"
                        color={currentPricesCalculatedBasedOn == 'sppPrice' ? undefined : 'primary'}
                    >
                        Цена с СПП, ₽
                    </Text>
                </Link>
            ),
            render: (args) => fixedPriceRender(args, ['sppPrice'], defaultRender(args)),
        },
        {
            name: 'obor',
            placeholder: 'Оборачиваемость, дней.',
        },
        {
            name: 'stock',
            placeholder: 'Остаток, шт.',
        },
        {
            name: 'profit',
            placeholder: 'Профит, ₽',
            render: (args) =>
                fixedPriceRender(
                    args,
                    ['profit', 'rentabelnost'],
                    ((args) => {
                        const {value, row} = args;
                        const {rozPrice} = row;
                        if (value === undefined) return undefined;
                        return (
                            <Text color={value < 0 ? 'danger' : value > 0 ? 'positive' : 'primary'}>
                                {`${value} / ${getRoundValue(value * 100, rozPrice)}%`}
                            </Text>
                        );
                    })(args),
                ),
        },
        {
            name: 'primeCost',
            placeholder: 'Себестоимость, ₽',
            render: (args) =>
                fixedPriceRender(args, ['primeCostMarkup'], renderSlashPercent(args, 'rozPrice')),
        },
        {
            name: 'comissionSum',
            placeholder: 'Комиссия, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
        {
            name: 'deliverySum',
            placeholder: 'Логистика, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
        {
            name: 'taxSum',
            placeholder: 'Налог, ₽',
            render: (args) => renderSlashPercent(args, 'sppPrice'),
        },
        {
            name: 'expences',
            placeholder: 'Доп. расходы, ₽',
            render: (args) => renderSlashPercent(args, 'sppPrice'),
        },
        {
            name: 'storageCostForArt',
            placeholder: 'Хранение, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
        {
            name: 'ad',
            placeholder: 'Реклама / CPS, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
        {
            name: 'buyoutsPercent',
            placeholder: 'Процент выкупа, %',
            render: renderAsPercent,
        },
        {
            name: 'allExpences',
            placeholder: 'Итого расходы, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
    ];

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

    const [updatePricesModalOpen, setUpdatePricesModalOpen] = useState(false);

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

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

        callApi('getPricesMM', {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: getNormalDateRange(dateRange),
        }).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['pricesData'][selectValue[0]] = resData['pricesData'][selectValue[0]];
            doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];
            doc['fixArtPrices'][selectValue[0]] = resData['fixArtPrices'][selectValue[0]];

            setChangedDoc(doc);

            setDateChangeRecalc(false);
            setUpdatingFlag(false);
            console.log(doc);
        });

        setPagesCurrent(1);
    }

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = doc ? doc.pricesData[selected == '' ? selectValue[0] : selected] : {};

        const temp = {};
        for (const [art, artData] of Object.entries(campaignData)) {
            if (!art || !artData) continue;

            const artInfo = {
                art: '',
                size: 0,
                object: '',
                brand: '',
                title: '',
                imtId: '',
                nmId: 0,
                barcode: 0,
                tags: [] as any[],
                rozPrice: undefined,
                sppPrice: undefined,
                wbWalletPrice: undefined,
                wbPrice: 0,
                discount: undefined,
                fixPrices: undefined,
                spp: 0,
                profit: 0,
                stock: undefined,
                rentabelnost: 0,
                roi: 0,
                primeCost: undefined,
                ad: 0,
                obor: 0,
                comissionSum: 0,
                deliverySum: 0,
                storageCostForArt: 0,
                taxSum: 0,
                expences: 0,
                cpo: 0,
                buyoutsPercent: 0,
                allExpences: 0,
            };
            artInfo.art = artData['art'];
            artInfo.size = artData['size'];
            artInfo.object = artData['object'];
            artInfo.brand = artData['brand'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.imtId = artData['imtId'];
            artInfo.barcode = artData['barcode'];
            artInfo.fixPrices = artData['fixPrices'];
            artInfo.rozPrice = artData['rozPrice'];
            artInfo.sppPrice = artData['sppPrice'];
            artInfo.wbWalletPrice = artData['wbWalletPrice'];
            artInfo.wbPrice = Math.round(artData['wbPrice']);
            artInfo.tags = artData['tags'] ?? [];

            // artInfo.priceInfo = artData['priceInfo'];
            artInfo.discount = artData['priceInfo'].discount;
            artInfo.spp = Math.round(artData['priceInfo'].spp);
            artInfo.profit = Math.round(artData['profit']);
            artInfo.stock = artData['stock'];
            artInfo.rentabelnost = getRoundValue(artData['rentabelnost'], 1, true);
            artInfo.primeCost = artData['primeCost'];
            artInfo.ad = Math.round(artData['ad']);
            artInfo.comissionSum = Math.round(artData['comissionSum']);
            artInfo.deliverySum = Math.round(artData['deliverySum']);
            artInfo.storageCostForArt = artData['storageCostForArt'];
            artInfo.taxSum = Math.round(artData['taxSum']);
            artInfo.expences = Math.round(artData['expencesSum']);
            artInfo.cpo = Math.round(artData['cpo']);
            artInfo.buyoutsPercent = Math.round(artData['buyoutsPercent']);
            artInfo.allExpences = Math.round(artData['allExpences']);

            artInfo.obor = Math.round(artData['obor']);

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
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (filterArg == 'tags') {
                    let wholeText = '';
                    if (flarg)
                        for (const key of flarg) {
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

        temp.sort((a, b) => {
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
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(doc['pricesData'])) {
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

                            if (!Object.keys(doc['pricesData'][nextValue[0]]).length) {
                                callApi('getPricesMM', {
                                    uid: getUid(),
                                    campaignName: nextValue,
                                    dateRange: getNormalDateRange(dateRange),
                                }).then((res) => {
                                    if (!res) return;
                                    const resData = res['data'];
                                    doc['pricesData'][nextValue[0]] =
                                        resData['pricesData'][nextValue[0]];
                                    doc['artsData'][nextValue[0]] =
                                        resData['artsData'][nextValue[0]];
                                    doc['fixArtPrices'][nextValue[0]] =
                                        resData['fixArtPrices'][nextValue[0]];

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
                                setSelectedButton('');
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
                                    <Select
                                        value={selectValueEntered}
                                        options={selectOptionsEntered}
                                        onUpdate={(val) => {
                                            setSelectValueEntered(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <TextInput
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
                                        validationState={enteredValueValid ? undefined : 'invalid'}
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
                                        checked={fixPrices}
                                        onUpdate={(val) => {
                                            setFixPrices(val);
                                        }}
                                    />
                                    <div style={{minHeight: 8}} />
                                    <Button
                                        disabled={
                                            !enteredValueValid ||
                                            (changeDiscount && !enteredDiscountValueValid)
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
                                                fixPrices: fixPrices,
                                            };

                                            const keys = {
                                                'Цена после скидки': 'rozPrice',
                                                'Цена с СПП': 'sppPrice',
                                                'Наценка к себестоимости': 'primeCostMarkup',
                                                Рентабельность: 'rentabelnost',
                                                Профит: 'profit',
                                            };

                                            const key = keys[selectValueEntered[0]];
                                            params.enteredValue[key] = parseInt(enteredValue);
                                            setCurrentPricesCalculatedBasedOn(
                                                key == 'primeCostMarkup' ? 'rozPrice' : key,
                                            );

                                            if (changeDiscount) {
                                                params.enteredValue['discount'] =
                                                    parseInt(enteredDiscountValue);
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
                                                doc['pricesData'][selectValue[0]][art] = artData;
                                            }
                                            setLastCalcOldData({});

                                            /////////////////////////
                                            callApi('getPricesMM', params).then((res) => {
                                                if (!res) return;

                                                const tempOldData = {};
                                                const resData = res['data'];
                                                for (const [art, artData] of Object.entries(
                                                    resData['pricesData'][selectValue[0]],
                                                )) {
                                                    tempOldData[art] =
                                                        doc['pricesData'][selectValue[0]][art];

                                                    doc['pricesData'][selectValue[0]][art] =
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
                        <div style={{minWidth: 8}} />
                        <Button
                            // loading={fetchingDataFromServerFlag}
                            size="l"
                            view="action"
                            onClick={() => {
                                setUpdatePricesModalOpen(true);
                                setSelectedButton('');
                            }}
                        >
                            <Icon data={CloudArrowUpIn} />
                            <Text variant="subheader-1">Отправить цены на WB</Text>
                        </Button>
                        <Modal
                            open={updatePricesModalOpen}
                            onClose={() => {
                                setUpdatePricesModalOpen(false);
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
                                    <Text
                                        style={{
                                            margin: '8px 0',
                                        }}
                                        variant="display-2"
                                    >
                                        Обновить цены на WB
                                    </Text>
                                    {generateModalButtonWithActions(
                                        {
                                            view: 'action',
                                            icon: CloudArrowUpIn,
                                            placeholder: 'Отправить',
                                            onClick: () => {
                                                const params = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    updatePricesParams: {
                                                        data: [] as any[],
                                                    },
                                                };
                                                const paramsFix = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    data: {
                                                        nmIds: {},
                                                    },
                                                };

                                                const tempOldData = {...lastCalcOldData};

                                                const byNmId = {};
                                                for (let i = 0; i < filteredData.length; i++) {
                                                    const {
                                                        nmId,
                                                        wbPrice,
                                                        rozPrice,
                                                        primeCost,
                                                        discount,
                                                        art,
                                                        fixPrices,
                                                    } = filteredData[i];
                                                    if (nmId && wbPrice && rozPrice > primeCost) {
                                                        byNmId[nmId] = {
                                                            nmID: nmId,
                                                            price: wbPrice,
                                                            discount: discount,
                                                        };

                                                        delete tempOldData[art]; // delete to prevent reset to default

                                                        paramsFix.data.nmIds[nmId] = {
                                                            nmId: nmId,
                                                            enteredValue: fixPrices,
                                                        };
                                                        if (fixPrices) {
                                                            paramsFix.data.nmIds[nmId][
                                                                'enteredValue'
                                                            ]['discount'] = discount;
                                                        }
                                                        //// local fixed
                                                        if (fixPrices !== undefined) {
                                                            if (
                                                                !doc.fixArtPrices[selectValue[0]][
                                                                    nmId
                                                                ]
                                                            )
                                                                doc.fixArtPrices[selectValue[0]][
                                                                    nmId
                                                                ] = {};
                                                            doc.fixArtPrices[selectValue[0]][
                                                                nmId
                                                            ].enteredValue = fixPrices;
                                                        } else {
                                                            if (
                                                                !doc.fixArtPrices[selectValue[0]][
                                                                    nmId
                                                                ]
                                                            )
                                                                continue;
                                                            delete doc.fixArtPrices[selectValue[0]][
                                                                nmId
                                                            ];
                                                        }

                                                        doc.pricesData[selectValue[0]][art][
                                                            'fixPrices'
                                                        ] = undefined;
                                                    }
                                                }

                                                setLastCalcOldData(tempOldData);

                                                for (const [nmId, nmIdData] of Object.entries(
                                                    byNmId,
                                                )) {
                                                    if (
                                                        nmId === undefined ||
                                                        nmIdData === undefined
                                                    )
                                                        continue;
                                                    params.updatePricesParams.data.push(nmIdData);
                                                }

                                                setChangedDoc(doc);

                                                console.log(params);
                                                console.log(paramsFix);
                                                /////////////////////////
                                                callApi('updatePricesMM', params);
                                                callApi('fixArtPrices', paramsFix);
                                                /////////////////////////
                                                setCurrentPricesCalculatedBasedOn('');
                                                setUpdatePricesModalOpen(false);
                                            },
                                        },
                                        selectedButton,
                                        setSelectedButton,
                                    )}
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
