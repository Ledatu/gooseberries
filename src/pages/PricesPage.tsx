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
    List,
    TextInput,
    Checkbox,
    Popover,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

const b = block('app');

import {
    ChevronDown,
    Tag,
    Key,
    ArrowsRotateLeft,
    Box,
    Calculator,
    LockOpen,
    Lock,
    CloudArrowUpIn,
    TrashBin,
    Play,
    Pause,
} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare, defaultRender} from 'src/components/TheTable';
import Userfront from '@userfront/toolkit';
import {
    generateTextInputWithNoteOnTop,
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
                selectValue != ''
                    ? selectValue
                    : Userfront.user.userUuid === '46431a09-85c3-4703-8246-d1b5c9e52594' ||
                      Userfront.user.userUuid === '6857e0f3-0069-4b70-a6f0-2c47ab4e6064'
                    ? 'ИП Иосифова Р. И.'
                    : 'ОТК ПРОИЗВОДСТВО',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const PricesPage = ({pageArgs}) => {
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

    const [groupingFetching, setGroupingFetching] = useState(false);

    const [selectedButton, setSelectedButton] = useState('');
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);
    const [currentPricesCalculatedBasedOn, setCurrentPricesCalculatedBasedOn] = useState('');

    const [availableTags, setAvailableTags] = useState([] as any[]);
    const [availableTagsPending, setAvailableTagsPending] = useState(false);
    const [tagsModalOpen, setTagsModalOpen] = useState(false);

    const [calcUnitEconomyModalOpen, setCalcUnitEconomyModalOpen] = useState(false);
    const [unitEconomyParams, setUnitEconomyParams] = useState({
        rozPrice: '',
        primeCost: '',
        comission: '',
        length: '',
        width: '',
        height: '',
        koef: 100,
        ktr: 1,
        tax: '',
        expences: '',
        drr: 10,
        buyoutsPercent: '',
        obor: 30,
    });
    const [unitEconomyParamsValid, setUnitEconomyParamsValid] = useState({
        rozPrice: false,
        primeCost: false,
        comission: false,
        length: false,
        width: false,
        height: false,
        koef: true,
        ktr: true,
        tax: false,
        expences: false,
        drr: true,
        buyoutsPercent: false,
        obor: true,
    });
    const [unitEconomyProfit, setUnitEconomyProfit] = useState({
        profit: 0,
        delivery: '',
        storage: '',
    });
    const [unitEconomyProfitValid, setUnitEconomyProfitValid] = useState(false);
    useEffect(() => {
        for (const [_, valid] of Object.entries(unitEconomyParamsValid)) {
            if (!valid) {
                setUnitEconomyProfitValid(false);
                return;
            }
        }
        setUnitEconomyProfitValid(true);

        const buyoutsPercent = Number(unitEconomyParams.buyoutsPercent) / 100;

        const rozPrice = Number(unitEconomyParams.rozPrice);
        const primeCost = Number(unitEconomyParams.primeCost);
        const comission = Number(unitEconomyParams.comission) / 100;
        const comissionSum = comission * rozPrice;

        const length = Number(unitEconomyParams.length);
        const width = Number(unitEconomyParams.width);
        const height = Number(unitEconomyParams.height);
        const koef = Number(unitEconomyParams.koef) / 100;
        const ktr = Number(unitEconomyParams.ktr);
        const volume = (length * width * height) / 1000;

        const boxDeliveryBase = 30;
        const boxDeliveryLiter = 7;
        const boxStorageBase = 0.07;
        // const boxStorageLiter = 0.07;

        let delivery = 0;
        delivery += boxDeliveryBase * koef * (volume < 1 ? volume : 1);
        if (volume > 1) {
            delivery += (volume - 1) * (boxDeliveryLiter * koef);
        }
        delivery += (1 - buyoutsPercent) * 50;
        delivery *= ktr ?? 1;
        delivery = delivery / buyoutsPercent;

        const tax = Number(unitEconomyParams.tax) / 100;
        const taxSum = tax * rozPrice;

        const expences = Number(unitEconomyParams.expences) / 100;
        const expencesSum = expences * rozPrice;

        const obor = Number(unitEconomyParams.obor);
        const storageCostForArt = obor * volume * boxStorageBase * koef;

        const drr = Number(unitEconomyParams.drr) / 100;
        const ad = (drr * rozPrice) / buyoutsPercent;

        const allExpences =
            ad + delivery + comissionSum + storageCostForArt + taxSum + expencesSum + primeCost;

        const profit = rozPrice - allExpences;

        const tempProfit = {...unitEconomyProfit};
        tempProfit.profit = profit;
        tempProfit.delivery =
            isNaN(delivery) || !isFinite(delivery) ? 'Ошибка.' : String(Math.round(delivery));
        tempProfit.storage =
            isNaN(storageCostForArt) || !isFinite(storageCostForArt)
                ? 'Ошибка.'
                : String(Math.round(storageCostForArt));
        setUnitEconomyProfit(tempProfit);
    }, [unitEconomyParams]);

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

        const isPaused = doc.fixArtPrices[selectValue[0]][nmId]
            ? doc.fixArtPrices[selectValue[0]][nmId].paused
            : false;

        const oborFixedRuleSet = (() => {
            const temp = doc.fixArtPrices[selectValue[0]][nmId];
            if (temp === undefined) return undefined;

            return temp['enteredValue']['oborRuleSet'];
        })();

        if (!isFixedByKey && !isFixed) return defaultRenderFunctionRes;

        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {defaultRenderFunctionRes}
                <div style={{minWidth: 4}} />
                <Text
                    color={
                        isPaused
                            ? 'secondary'
                            : isFixedByKey
                            ? 'brand'
                            : isFixed && lastCalcOldData[art] === undefined
                            ? 'positive'
                            : 'danger'
                    }
                >
                    <Icon data={isFixedByKey ? LockOpen : isFixed ? Lock : Lock} />
                </Text>
                {oborFixedRuleSet ? (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{minWidth: 4}} />
                        <Popover
                            content={
                                <div
                                    style={{
                                        height: '23em',
                                        width: 102,
                                        overflow: 'auto',
                                        paddingBottom: 8,
                                        display: 'flex',
                                    }}
                                >
                                    <Card
                                        view="outlined"
                                        theme="warning"
                                        style={{
                                            position: 'absolute',
                                            height: 52 * 7,
                                            width: 152,
                                            padding: 20,
                                            overflow: 'auto',
                                            top: -10,
                                            left: -10,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'var(--g-color-base-background)',
                                        }}
                                    >
                                        {(() => {
                                            let oborPrev = -1;
                                            const oborTextInputs = [] as any[];
                                            for (const [obor, _] of Object.entries(
                                                oborFixedRuleSet,
                                            )) {
                                                oborTextInputs.push(
                                                    <div style={{width: '8em', margin: '0 4px'}}>
                                                        {generateTextInputWithNoteOnTop({
                                                            value: oborFixedRuleSet[obor],
                                                            disabled: true,
                                                            validationState: true,
                                                            placeholder: `${
                                                                oborPrev + 1
                                                            } - ${obor} дней`,
                                                            onUpdateHandler: () => {},
                                                        })}
                                                    </div>,
                                                );
                                                oborPrev = parseInt(obor);
                                            }

                                            return oborTextInputs;
                                        })()}
                                    </Card>
                                </div>
                            }
                        >
                            <Text
                                color={
                                    isFixedByKey
                                        ? 'brand'
                                        : isFixed && lastCalcOldData[art] === undefined
                                        ? 'positive'
                                        : 'danger'
                                }
                            >
                                <Icon data={Box} />
                            </Text>
                        </Popover>
                    </div>
                ) : (
                    <></>
                )}
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
                const {nmId, tags} = row;

                const tagsNodes = [] as ReactNode[];
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
                fixedPriceRender(
                    args,
                    ['primeCostMarkup'],
                    ((args) => {
                        const {value, row} = args;
                        if (value === undefined) return undefined;
                        const {rozPrice} = row;
                        const markup = rozPrice - value;
                        const percent = Math.round((markup / (value as number)) * 100);
                        return (
                            <Text>{`${value} ${
                                isNaN(percent) || !isFinite(percent) || !value || !markup
                                    ? ''
                                    : '/ ' + percent + '%'
                            }`}</Text>
                        );
                    })(args),
                ),
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

    const groupingOptions = [
        {value: 'campaignName', content: 'Магазин'},
        {value: 'brand', content: 'Бренд'},
        {value: 'object', content: 'Тип предмета'},
        {value: 'title', content: 'Наименование'},
        {value: 'imtId', content: 'ID КТ'},
        {value: 'art', content: 'Артикул'},
    ];
    const [groupingValue, setGroupingValue] = useState(['']);

    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');
    const [enteredValueValid, setEnteredValueValid] = useState(false);

    const [fixPricesManagingModalOpen, setFixPricesManagingModalOpen] = useState(false);
    const manageFixPricesActivityOnClick = async (mode) => {
        setFixPricesManagingModalOpen(false);

        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {mode: mode, nmIds: [] as number[]},
        };

        for (let i = 0; i < filteredData.length; i++) {
            const row = filteredData[i];
            const {nmId} = row ?? {};
            if (!nmId) continue;

            if (!params.data.nmIds.includes(nmId)) params.data.nmIds.push(nmId);

            if (!doc.fixArtPrices[selectValue[0]][nmId]) continue;
            if (mode == 'play') {
                doc.fixArtPrices[selectValue[0]][nmId]['paused'] = false;
            } else if (mode == 'pause') {
                doc.fixArtPrices[selectValue[0]][nmId]['paused'] = true;
            } else if (mode == 'stop') {
                delete doc.fixArtPrices[selectValue[0]][nmId];
                continue;
            }
        }

        setChangedDoc(doc);

        callApi('manageFixPricesActivity', params);
    };

    const [fixPrices, setFixPrices] = useState(false);

    const [changeDiscount, setChangeDiscount] = useState(false);
    const [enteredDiscountValue, setEnteredDiscountValue] = useState('');
    const [enteredDiscountValueValid, setEnteredDiscountValueValid] = useState(false);

    const [updatePricesModalOpen, setUpdatePricesModalOpen] = useState(false);

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>(
        selectedCampaign != '' ? [selectedCampaign] : [],
    );

    useEffect(() => {
        setSelectedCampaign(selectValue[0]);

        const params = {uid: getUid(), campaignName: selectValue[0]};
        setGroupingFetching(true);
        callApi('getPricesGrouping', params).then((res) => {
            if (!res) return;
            console.log(res);

            setGroupingValue([
                res['data'] && res['data'][0] ? res['data'][0]['groupingType'] : 'art',
            ]);
            setGroupingFetching(false);
        });
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
                sales: 0,
                orders: 0,
                comissionSum: 0,
                deliverySum: 0,
                storageCostForArt: 0,
                taxSum: 0,
                expences: 0,
                cpo: 0,
                sum: 0,
                cpoOrders: 0,
                buyoutsPercent: 0,
                allExpences: 0,
            };
            artInfo.art = artData['art'];
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
            artInfo.orders = artData['orders'];
            artInfo.sales = artData['sales'];
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
            artInfo.sum = Math.round(artData['sum']);
            artInfo.cpoOrders = Math.round(artData['cpoOrders']);
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
    if (!firstRecalc) {
        console.log(selectValue);
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
            } else if (
                Userfront.user.userUuid === '46431a09-85c3-4703-8246-d1b5c9e52594' ||
                Userfront.user.userUuid === '6857e0f3-0069-4b70-a6f0-2c47ab4e6064'
            ) {
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
                      Userfront.user.userUuid === '46431a09-85c3-4703-8246-d1b5c9e52594' ||
                      Userfront.user.userUuid === '6857e0f3-0069-4b70-a6f0-2c47ab4e6064'
                          ? 1
                          : 0
                  ]['value'];
        setSelectValue([selected]);
        console.log(doc);

        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selected,
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

                            setAvailableTagsPending(true);
                            callApi('getAllTags', {
                                uid: getUid(),
                                campaignName: nextValue[0],
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
                        <Button
                            loading={calculatingFlag}
                            size="l"
                            view="action"
                            onClick={() => {
                                setEnteredValuesModalOpen(true);
                                setEnteredValue('');
                                setEnteredDiscountValue('');
                                setSelectedButton('');
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
                            size="l"
                            view="action"
                            onClick={() => {
                                setFixPricesManagingModalOpen(true);
                            }}
                        >
                            <Icon data={Play} />
                            <Text variant="subheader-1">Управление фиксацией цен</Text>
                        </Button>
                        <Modal
                            open={fixPricesManagingModalOpen}
                            onClose={() => {
                                setFixPricesManagingModalOpen(false);
                                setSelectedButton('');
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
                                <Text
                                    style={{
                                        margin: '8px 0',
                                    }}
                                    variant="display-2"
                                >
                                    Управление
                                </Text>
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Продолжить',
                                        icon: Play,
                                        view: 'outlined-success',
                                        onClick: () => {
                                            manageFixPricesActivityOnClick('play');
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Приостановить',
                                        icon: Pause,
                                        view: 'outlined-warning',
                                        onClick: () => {
                                            manageFixPricesActivityOnClick('pause');
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Удалить',
                                        icon: TrashBin,
                                        view: 'outlined-danger',
                                        onClick: () => {
                                            manageFixPricesActivityOnClick('stop');
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                <div style={{height: 16}} />
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
                    <Select
                        options={groupingOptions}
                        onUpdate={(nextValule) => {
                            setGroupingValue(nextValule);
                            const params = {
                                uid: getUid(),
                                campaignName: selectValue[0],
                                data: {
                                    groupingType: nextValule[0],
                                },
                            };
                            console.log(params);

                            callApi('setPricesGrouping', params)
                                .then((res) => {
                                    console.log(res);
                                    setDateChangeRecalc(true);
                                })
                                .catch((e) => {
                                    console.log(e);
                                });
                        }}
                        renderControl={({onClick, onKeyDown, ref}) => {
                            const mapp = {
                                campaignName: 'Магазин',
                                brand: 'Бренд',
                                object: 'Тип предмета',
                                title: 'Наименование',
                                imtId: 'ID КТ',
                                art: 'Артикул',
                            };
                            return (
                                <Button
                                    loading={groupingFetching}
                                    ref={ref}
                                    size="l"
                                    view="outlined-action"
                                    onClick={onClick}
                                    extraProps={{
                                        onKeyDown,
                                    }}
                                >
                                    <Text variant="subheader-1">
                                        Группировка: {mapp[groupingValue[0]]}
                                    </Text>
                                    <Icon data={ChevronDown} />
                                </Button>
                            );
                        }}
                    />
                    <div style={{minWidth: 8}} />
                    <Button
                        size="l"
                        view="action"
                        onClick={() => {
                            setCalcUnitEconomyModalOpen(true);
                        }}
                    >
                        <Icon data={Calculator} />
                        <Text variant="subheader-1">Рассчитать юнит экономику</Text>
                    </Button>
                    <Modal
                        open={calcUnitEconomyModalOpen}
                        onClose={() => {
                            setCalcUnitEconomyModalOpen(false);
                            setUnitEconomyParams(unitEconomyParams);
                        }}
                    >
                        <Card
                            view="clear"
                            style={{
                                width: 250,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'none',
                                margin: 20,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {(() => {
                                    const placeholders = [
                                        {
                                            rozPrice: 'Цена после скидки, ₽',
                                            primeCost: 'Себестоимость, ₽',
                                            comission: 'Комиссия, %',
                                            tax: 'Налог, %',
                                            expences: 'Доп. расходы, %',
                                            drr: 'ДРР,  %',
                                            buyoutsPercent: 'Процент выкупа, %',
                                        },
                                        {
                                            length: 'Длина, см.',
                                            width: 'Ширина, см.',
                                            height: 'Высота, см.',
                                            koef: 'Коэффициент склада, %',
                                            ktr: 'КТР',
                                            obor: 'Оборачиваемость, дней',
                                        },
                                    ];
                                    const inputs = [] as any[];
                                    for (const headers of placeholders) {
                                        const row = [] as any[];
                                        for (const [key, placeholder] of Object.entries(headers)) {
                                            row.push(
                                                generateTextInputWithNoteOnTop({
                                                    placeholder: placeholder,
                                                    value: unitEconomyParams[key],
                                                    onUpdateHandler: (val) => {
                                                        const temp = {...unitEconomyParams};
                                                        temp[key] = val;
                                                        setUnitEconomyParams(temp);

                                                        const numberLike = Number(
                                                            val != '' ? val : 'nan',
                                                        );
                                                        const validTemp = {
                                                            ...unitEconomyParamsValid,
                                                        };
                                                        validTemp[key] =
                                                            !isNaN(numberLike) &&
                                                            isFinite(numberLike);
                                                        setUnitEconomyParamsValid(validTemp);
                                                    },
                                                    disabled: false,
                                                    validationState: unitEconomyParamsValid[key],
                                                }),
                                            );
                                            row.push(<div style={{minHeight: 8}} />);
                                        }
                                        row.pop();
                                        inputs.push(row);
                                    }

                                    const divs = [] as any[];
                                    for (const row of inputs) {
                                        divs.push(
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {row}
                                            </div>,
                                        );
                                        divs.push(<div style={{minHeight: 8}} />);
                                    }
                                    return divs;
                                })()}
                                {generateTextInputWithNoteOnTop({
                                    placeholder: 'Логистика, ₽',
                                    value: unitEconomyProfitValid
                                        ? unitEconomyProfit.delivery
                                        : 'Ошибка.',
                                    onUpdateHandler: () => {},
                                    disabled: true,
                                    validationState: true,
                                })}
                                <div style={{minHeight: 8}} />
                                {generateTextInputWithNoteOnTop({
                                    placeholder: 'Хранение, ₽',
                                    value: unitEconomyProfitValid
                                        ? unitEconomyProfit.storage
                                        : 'Ошибка.',
                                    onUpdateHandler: () => {},
                                    disabled: true,
                                    validationState: true,
                                })}
                                <div style={{minHeight: 8}} />
                                <Text
                                    variant="header-1"
                                    color={
                                        unitEconomyProfitValid
                                            ? unitEconomyProfit.profit > 0
                                                ? 'positive'
                                                : 'danger'
                                            : 'danger'
                                    }
                                >
                                    {(() => {
                                        return unitEconomyProfitValid
                                            ? `${Math.round(
                                                  unitEconomyProfit.profit,
                                              )} / ${getRoundValue(
                                                  unitEconomyProfit.profit,
                                                  unitEconomyParams['rozPrice'],
                                                  true,
                                              )}%`
                                            : 'Введите все значения';
                                    })()}
                                </Text>
                            </div>
                        </Card>
                    </Modal>
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
