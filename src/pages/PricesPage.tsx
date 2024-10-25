import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {Spin, Select, Icon, Button, Text, Link, Modal, Card, Popover} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import {
    ChevronDown,
    ArrowsRotateLeft,
    Box,
    LockOpen,
    Lock,
    TagRuble,
    CloudArrowUpIn,
} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare} from 'src/components/TheTable';
import {
    defaultRender,
    generateTextInputWithNoteOnTop,
    getNormalDateRange,
    getRoundValue,
    renderAsPercent,
    renderSlashPercent,
} from 'src/utilities/getRoundValue';
import {generateModalButtonWithActions} from './MassAdvertPage';
import {motion} from 'framer-motion';
import {RangePicker} from 'src/components/RangePicker';
import {useUser} from 'src/components/RequireAuth';
import {useCampaign} from 'src/contexts/CampaignContext';
import {TagsFilterModal} from 'src/components/TagsFilterModal';
import {CalcPricesModal} from 'src/components/CalcPricesModal';
import {CalcUnitEconomyModal} from 'src/components/CalcUnitEconomyModal';
import {CopyButton} from 'src/components/CopyButton';

const getUserDoc = (dateRange, docum = undefined, mode = false, selectValue = '') => {
    const {userInfo} = useUser();
    const {campaigns} = userInfo ?? {};
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
        callApi(
            'getPricesMM',
            {
                uid: getUid(),
                dateRange: getNormalDateRange(dateRange),
                campaignName: selectValue != '' ? selectValue : campaigns[0]?.name,
            },
            true,
        )
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const PricesPage = ({permission}) => {
    const {selectValue, setSwitchingCampaignsFlag} = useCampaign();
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

    const [filters, setFilters] = useState({undef: false});

    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const [groupingFetching, setGroupingFetching] = useState(false);

    const [selectedButton, setSelectedButton] = useState('');
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);
    const [currentPricesCalculatedBasedOn, setCurrentPricesCalculatedBasedOn] = useState('');

    const filterByClick = (val, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const renderFilterByClickButton = ({value}, key) => {
        return !value || value == '' ? (
            <></>
        ) : (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    size="xs"
                    pin="round-round"
                    view="outlined"
                    style={{marginRight: 8}}
                    onClick={() => {
                        filterByClick(value, key);
                    }}
                >
                    {value}
                </Button>

                <CopyButton
                    view="flat"
                    color="secondary"
                    size="xs"
                    iconSize={13}
                    copyText={value}
                />
            </div>
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

        const hasOld = doc.fixArtPrices[selectValue[0]][nmId]
            ? doc.fixArtPrices[selectValue[0]][nmId].old
            : false;

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
                {hasOld ? (
                    <Text
                        style={{marginLeft: 4}}
                        color={lastCalcOldData[art] === undefined ? 'positive' : 'danger'}
                    >
                        <Icon data={TagRuble} />
                    </Text>
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
                        const {primeCostMarkup} = row;

                        return (
                            <Text>{`${value} ${
                                isNaN(primeCostMarkup) ||
                                !isFinite(primeCostMarkup) ||
                                !value ||
                                !primeCostMarkup
                                    ? ''
                                    : '/ ' + primeCostMarkup + '%'
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
            render: (args) => renderSlashPercent(args, 'rozPrice'),
        },
        {
            name: 'expences',
            placeholder: 'Доп. расходы, ₽',
            render: (args) => renderSlashPercent(args, 'rozPrice'),
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
            render: (args) =>
                ((args) => {
                    const {value, row} = args;
                    const {primeCost} = row;
                    if (value === undefined) return undefined;
                    return `${value} / ${getRoundValue((value - primeCost) * 100, primeCost)}%`;
                })(args),
        },
    ];

    const groupingOptions = [
        {value: 'campaignName', content: 'Магазин'},
        {value: 'brand', content: 'Бренд'},
        {value: 'object', content: 'Тип предмета'},
        {value: 'title', content: 'Наименование'},
        {value: 'imtId', content: 'ID КТ'},
        {value: 'art', content: 'Артикул'},
    ];
    const [groupingValue, setGroupingValue] = useState(['']);

    const [updatePricesModalOpen, setUpdatePricesModalOpen] = useState(false);

    useEffect(() => {
        if (!selectValue) return;
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
        setSwitchingCampaignsFlag(true);

        if (!doc) return;

        if (!Object.keys(doc['pricesData'][selectValue[0]]).length) {
            callApi(
                'getPricesMM',
                {
                    uid: getUid(),
                    campaignName: selectValue,
                    dateRange: getNormalDateRange(dateRange),
                },
                true,
            ).then((res) => {
                if (!res) return;
                const resData = res['data'];
                doc['pricesData'][selectValue[0]] = resData['pricesData'][selectValue[0]];
                doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];
                doc['fixArtPrices'][selectValue[0]] = resData['fixArtPrices'][selectValue[0]];

                setChangedDoc({...doc});

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

    const [lastCalcOldData, setLastCalcOldData] = useState({});

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0]);

    if (dateChangeRecalc) {
        setUpdatingFlag(true);
        setDateChangeRecalc(false);
        setCurrentPricesCalculatedBasedOn('');
        setLastCalcOldData({});

        callApi(
            'getPricesMM',
            {
                uid: getUid(),
                campaignName: selectValue[0],
                dateRange: getNormalDateRange(dateRange),
            },
            true,
        ).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['pricesData'][selectValue[0]] = resData['pricesData'][selectValue[0]];
            doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];
            doc['fixArtPrices'][selectValue[0]] = resData['fixArtPrices'][selectValue[0]];

            setChangedDoc({...doc});

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
                rozPrice: 0,
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
                primeCost: 0,
                primeCostMarkup: 0,
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
            const markup = artInfo.rozPrice - artInfo.primeCost;
            artInfo.primeCostMarkup = Math.round((markup / artInfo.primeCost) * 100);

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
                } else if (filterArg == 'primeCost' && fldata.includes('%')) {
                    const comp = fldata.replace(/%/g, '').trim();
                    const tempFilterData = {...filterData};
                    tempFilterData['val'] = comp;

                    if (!flarg || !compare(tempTypeRow['primeCostMarkup'], tempFilterData)) {
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

        for (const [key, val] of Object.entries(filteredSummaryTemp)) {
            if (key === undefined || val === undefined || key == 'stock') continue;
            filteredSummaryTemp[key] = getRoundValue(val, temp.length);
        }

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
    };

    const [firstRecalc, setFirstRecalc] = useState(false);

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc();
    }

    if (!doc) return <Spin />;
    if (!firstRecalc) {
        console.log(doc);
        recalc(selectValue[0]);
        setFirstRecalc(true);
        setSwitchingCampaignsFlag(false);
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
                        <CalcPricesModal
                            disabled={permission != 'Управление'}
                            dateRange={dateRange}
                            setPagesCurrent={setPagesCurrent}
                            doc={doc}
                            setChangedDoc={setChangedDoc}
                            filteredData={filteredData}
                            lastCalcOldData={lastCalcOldData}
                            setLastCalcOldData={setLastCalcOldData}
                            setCurrentPricesCalculatedBasedOn={setCurrentPricesCalculatedBasedOn}
                        />
                        <div style={{minWidth: 8}} />
                        <Button
                            disabled={permission != 'Управление'}
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
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    translate: '-50% -50%',
                                    flexWrap: 'nowrap',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: 'none',
                                }}
                            >
                                <motion.div
                                    style={{
                                        overflow: 'hidden',
                                        flexWrap: 'nowrap',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#221d220f',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '#0002 0px 2px 8px 0px',
                                        padding: 30,
                                        borderRadius: 30,
                                        border: '1px solid #eee2',
                                    }}
                                >
                                    <Text
                                        style={{
                                            margin: '8px 0',
                                            textWrap: 'nowrap',
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
                                                    if (nmId && wbPrice && rozPrice >= primeCost) {
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
                                                            doc.fixArtPrices[selectValue[0]][nmId] =
                                                                {};
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

                                                setChangedDoc({...doc});

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
                                </motion.div>
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
                        disabled={permission != 'Управление'}
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
                                    disabled={permission != 'Управление'}
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
                    <CalcUnitEconomyModal />
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

            <Card theme={currentPricesCalculatedBasedOn != '' ? 'warning' : undefined}>
                <TheTable
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    footerData={[filteredSummary]}
                    tableId={'prices'}
                    usePagination={true}
                    defaultPaginationSize={300}
                    height={'calc(100vh - 10em - 60px)'}
                    onPaginationUpdate={({page, paginatedData}) => {
                        setPagesCurrent(page);
                        setFilteredSummary((row) => {
                            const fstemp = row;
                            fstemp[
                                'art'
                            ] = `На странице: ${paginatedData.length} Всего: ${filteredData.length}`;

                            return fstemp;
                        });
                    }}
                />
            </Card>
        </div>
    );
};
