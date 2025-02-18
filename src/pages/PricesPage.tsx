import React, {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
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
import {useCampaign} from 'src/contexts/CampaignContext';
import {TagsFilterModal} from 'src/components/TagsFilterModal';
import {CalcPricesModal} from 'src/components/CalcPricesModal';
import {CalcUnitEconomyModal} from 'src/components/CalcUnitEconomyModal';
import {CopyButton} from 'src/components/CopyButton';
import ApiClient from 'src/utilities/ApiClient';
import {useError} from './ErrorContext';
import callApi, {getUid} from 'src/utilities/callApi';

export const PricesPage = ({permission, sellerId}) => {
    const {selectValue, setSwitchingCampaignsFlag} = useCampaign();
    const {showError} = useError();
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
    const [wbWalletFetching, setWbWalletFetching] = useState(false);

    const [selectedButton, setSelectedButton] = useState('');
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
        const {nmId, fixPrices, art} = row;

        const currentFixKey = fixPrices
            ? Object.keys(fixPrices?.enteredValue ?? {}).filter(
                  (key) => key != 'oborRuleSet' && key != 'discount',
              )[0]
            : undefined;

        const oldFixKey = doc?.fixArtPrices?.[nmId]?.enteredValue
            ? Object.keys(doc?.fixArtPrices?.[nmId]?.enteredValue).filter(
                  (key) => key != 'oborRuleSet' && key != 'discount',
              )[0]
            : undefined;

        const curCellIsNew = keys?.includes(currentFixKey);
        const curCellIsOld = keys?.includes(oldFixKey);

        const oborRuleSet = curCellIsNew
            ? fixPrices?.enteredValue?.oborRuleSet
            : doc?.fixArtPrices?.[nmId]?.enteredValue?.oborRuleSet;

        const hasOld = doc?.fixArtPrices?.[nmId]?.old ?? false;

        if (!curCellIsNew && !curCellIsOld) return defaultRenderFunctionRes;

        return (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {defaultRenderFunctionRes}
                <div style={{minWidth: 4}} />
                <Text
                    color={
                        curCellIsNew
                            ? 'brand'
                            : curCellIsOld && currentPricesCalculatedBasedOn == ''
                            ? 'positive'
                            : 'danger'
                    }
                >
                    <Icon data={curCellIsNew ? LockOpen : Lock} />
                </Text>
                {oborRuleSet ? (
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
                                            for (const [obor, _] of Object.entries(oborRuleSet)) {
                                                oborTextInputs.push(
                                                    <div style={{width: '8em', margin: '0 4px'}}>
                                                        {generateTextInputWithNoteOnTop({
                                                            value: oborRuleSet[obor],
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
                                    curCellIsNew
                                        ? 'brand'
                                        : oldFixKey && !currentFixKey
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
                {hasOld && !curCellIsNew ? (
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
                        if (currentPricesCalculatedBasedOn == 'rozPrice') setUpdatingFlag(true);
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
                        if (currentPricesCalculatedBasedOn == 'sppPrice') setUpdatingFlag(true);
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
            name: 'wbWalletPrice',
            placeholder: (
                <Link
                    onClick={() => {
                        if (currentPricesCalculatedBasedOn == 'wbWalletPrice')
                            setUpdatingFlag(true);
                    }}
                >
                    <Text
                        variant="subheader-1"
                        color={
                            currentPricesCalculatedBasedOn == 'wbWalletPrice'
                                ? undefined
                                : 'primary'
                        }
                    >
                        Цена с WB кошельком, ₽
                    </Text>
                </Link>
            ),
            render: (args) => fixedPriceRender(args, ['wbWalletPrice'], defaultRender(args)),
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
            name: 'rentabelnost',
            placeholder: 'Профит, ₽',
            render: (args) =>
                fixedPriceRender(
                    args,
                    ['profit', 'rentabelnost'],
                    ((args) => {
                        const {value, row} = args;
                        const {rozPrice, profit} = row;
                        if (value === undefined) return undefined;
                        return (
                            <Text color={value < 0 ? 'danger' : value > 0 ? 'positive' : 'primary'}>
                                {`${profit} / ${getRoundValue(profit * 100, rozPrice)}%`}
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

    const wbWalletPercentOptions = useMemo(
        () => [2, 3, 5].map((percent) => ({value: `${percent}`, content: `${percent} %`})),
        [],
    );
    const [wbWalletPercent, setWbWalletPercent] = useState([] as string[]);

    const [updatePricesModalOpen, setUpdatePricesModalOpen] = useState(false);

    const getPrices = async () => {
        setSwitchingCampaignsFlag(true);
        try {
            const params = {
                seller_id: sellerId,
                dateRange: getNormalDateRange(dateRange),
            };

            console.log(params);

            const response = await ApiClient.post('prices/calc', params, 'json', true);
            console.log(response?.data);

            if (response && response.data) {
                setCurrentPricesCalculatedBasedOn('');
                setLastCalcOldData({});
                setDoc({...response.data});
                setPagesCurrent(1);
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error(error);
            showError('Не удалось рассчитать цены.');
        }
        setSwitchingCampaignsFlag(false);
    };

    const updateFixPrices = async (params) => {
        try {
            console.log(params);

            const response = await ApiClient.post('prices/set-fixed-rules', params, 'json');
            console.log(response?.data);

            if (response && response.data && doc) {
                doc.fixArtPrices = response.data;
                setDoc({...doc});
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error(error);
            showError('Не установить фикс. цены.');
        }
    };

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

        getPrices();
    }, [selectValue]);

    const fetchWbWalletPercent = async () => {
        setWbWalletFetching(true);
        try {
            const response = await ApiClient.post('prices/get-wb-wallet-percent', {
                seller_id: sellerId,
            });
            if (!response) throw new Error('Не удалось получить скидку WB кошелька.');

            const {percent} = response?.data ?? {percent: 2};

            setWbWalletPercent([`${percent}`]);
        } catch (error) {
            console.error(error);
            showError(
                error?.response?.data?.error || error?.message || 'Не удалось обработать токен',
            );
        }
        setWbWalletFetching(false);
    };

    useEffect(() => {
        if (!sellerId) return;
        fetchWbWalletPercent();
    }, [sellerId]);

    const [updatingFlag, setUpdatingFlag] = useState(false);

    useEffect(() => {
        if (!updatingFlag) return;
        getPrices().then(() => setUpdatingFlag(false));
    }, [updatingFlag]);

    const [lastCalcOldData, setLastCalcOldData] = useState({});

    const [doc, setDoc] = useState(undefined as undefined | {pricesData: {}; fixArtPrices: {}});

    const recalc = (withfFilters = {}) => {
        const campaignData = doc?.pricesData ?? {};
        console.log(campaignData);

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

    useEffect(() => {
        console.log('hrereee', doc);

        recalc();
    }, [doc]);

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

    if (!doc) return <Spin />;

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
                                setUpdatingFlag(true);
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
                            sellerId={sellerId}
                            disabled={permission != 'Управление'}
                            dateRange={dateRange}
                            setPagesCurrent={setPagesCurrent}
                            doc={doc}
                            setChangedDoc={setDoc}
                            filteredData={filteredData}
                            lastCalcOldData={lastCalcOldData}
                            setLastCalcOldData={setLastCalcOldData}
                            setCurrentPricesCalculatedBasedOn={setCurrentPricesCalculatedBasedOn}
                        />
                        <div style={{minWidth: 8}} />
                        <Button
                            disabled={
                                permission != 'Управление' || currentPricesCalculatedBasedOn == ''
                            }
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
                                                    seller_id: sellerId,
                                                    data: {
                                                        nmIds: [] as any[],
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

                                                        paramsFix.data.nmIds.push({
                                                            nmId: nmId,
                                                            rules: fixPrices,
                                                        });

                                                        doc.pricesData[art]['fixPrices'] =
                                                            undefined;
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

                                                setDoc({...doc});

                                                console.log(params);
                                                /////////////////////////
                                                callApi('updatePricesMM', params);
                                                updateFixPrices(paramsFix);
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
                        gap: 8,
                    }}
                >
                    <Select
                        loading={wbWalletFetching}
                        disabled={permission != 'Управление'}
                        options={wbWalletPercentOptions}
                        onUpdate={async (nextValule) => {
                            setWbWalletPercent(nextValule);
                            const params = {
                                seller_id: sellerId,
                                percent: parseInt(nextValule[0]),
                            };
                            console.log(params);

                            try {
                                const response = await ApiClient.post(
                                    'prices/set-wb-wallet-percent',
                                    params,
                                );
                                console.log('prices/set-wb-wallet-percent', response);
                                if (!response) throw new Error('Не удалось установить процент.');

                                setUpdatingFlag(true);
                            } catch (error) {
                                console.error(error);
                                showError(
                                    error?.response?.data?.error ||
                                        error?.message ||
                                        'Не удалось установить процент.',
                                );
                            }
                        }}
                        renderControl={({onClick, onKeyDown, ref}) => {
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
                                        WB кошелёк: {wbWalletPercent[0]}%
                                    </Text>
                                    <Icon data={ChevronDown} />
                                </Button>
                            );
                        }}
                    />
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
                                    setUpdatingFlag(true);
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
                    <CalcUnitEconomyModal />
                    <RangePicker
                        args={{
                            recalc: () => setUpdatingFlag(true),
                            dateRange,
                            setDateRange,
                            anchorRef,
                        }}
                    />
                </div>
            </div>

            <TheTable
                theme={currentPricesCalculatedBasedOn != '' ? 'warning' : undefined}
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
                        ] = `На странице SKU: ${paginatedData.length} Всего SKU: ${filteredData.length}`;

                        return fstemp;
                    });
                }}
            />
        </div>
    );
};
