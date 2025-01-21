import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {
    Spin,
    Button,
    Text,
    Card,
    Select,
    Link,
    Icon,
    Popover,
    PopoverBehavior,
    Modal,
    Skeleton,
    RadioButton,
    List,
    Tooltip,
} from '@gravity-ui/uikit';
import {HelpPopover} from '@gravity-ui/components';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';
import block from 'bem-cn-lite';

import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
const b = block('app');

import {
    Rocket,
    Comment,
    Magnifier,
    Star,
    LayoutHeader,
    ArrowsRotateLeft,
    ArrowShapeDown,
    ChartLine,
    ArrowRotateLeft,
    CircleRuble,
    TShirt,
    SlidersVertical,
    ChevronDown,
    ArrowShapeUp,
    Minus,
    Plus,
    Play,
    ArrowRight,
    LayoutList,
    Clock,
    Check,
    TagRuble,
    Cherry,
    Xmark,
    TriangleExclamation,
} from '@gravity-ui/icons';

// import JarIcon from '../assets/jar-of-jam.svg';

import {motion} from 'framer-motion';

import ChartKit, {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
settings.set({plugins: [YagrPlugin]});
import callApi, {getUid} from 'src/utilities/callApi';
import axios, {CancelTokenSource} from 'axios';
import {
    getLocaleDateString,
    getNormalDateRange,
    getRoundValue,
    renderAsPercent,
    renderSlashPercent,
} from 'src/utilities/getRoundValue';
import TheTable, {compare} from 'src/components/TheTable';
import {RangePicker} from 'src/components/RangePicker';
import {AutoSalesModal} from 'src/components/AutoSalesModal';
import {TagsFilterModal} from 'src/components/TagsFilterModal';
import {PhrasesModal} from 'src/components/PhrasesModal';
import {AdvertCard} from 'src/components/AdvertCard';
import {AdvertsBidsModal} from 'src/components/AdvertsBidsModal';
import {AdvertsBudgetsModal} from 'src/components/AdvertsBudgetsModal';
import {LogoLoader} from 'src/components/LogoLoader';
import {useMediaQuery} from 'src/hooks/useMediaQuery';
import {useCampaign} from 'src/contexts/CampaignContext';
import {CanBeAddedToSales} from 'src/components/CanBeAddedToSales';
import {StocksByWarehousesPopup} from 'src/components/StocksByWarehousesPopup';
import {AdvertsSchedulesModal} from 'src/components/AdvertsSchedulesModal';
import {AdvertsStatusManagingModal} from 'src/components/AdvertsStatusManagingModal';
import {useError} from './ErrorContext';
import {AdvertCreateModal} from 'src/components/AdvertCreateModal';
import ApiClient from 'src/utilities/ApiClient';
import {getEnumurationString} from 'src/utilities/getEnumerationString';
import DzhemPhrasesModal from 'src/components/DzhemPhrasesModal';
import {PopupFilterArts} from 'src/components/PopupFilterArts';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        // console.log(docum, mode, selectValue);

        if (mode) {
            doc['campaigns'][selectValue] = docum['campaigns'][selectValue];
            doc['balances'][selectValue] = docum['balances'][selectValue];
            doc['plusPhrasesTemplates'][selectValue] = docum['plusPhrasesTemplates'][selectValue];
            doc['advertsPlusPhrasesTemplates'][selectValue] =
                docum['advertsPlusPhrasesTemplates'][selectValue];
            doc['adverts'][selectValue] = docum['adverts'][selectValue];
            doc['placementsAuctions'][selectValue] = docum['placementsAuctions'][selectValue];
            doc['advertsSelectedPhrases'][selectValue] =
                docum['advertsSelectedPhrases'][selectValue];
            doc['advertsSchedules'][selectValue] = docum['advertsSchedules'][selectValue];
            doc['autoSales'][selectValue] = docum['autoSales'][selectValue];

            if (
                doc['dzhemData'] &&
                doc['dzhemData'][selectValue] &&
                docum['dzhemData'] &&
                docum['dzhemData'][selectValue]
            )
                doc['dzhemData'][selectValue] = docum['dzhemData'][selectValue];
        }
        setDocument(docum);
    }

    // console.log(params);

    // useEffect(() => {
    //     callApi('getMassAdvertsNew', params, true)
    //         .then((response) => setDocument(response ? response['data'] : undefined))
    //         .catch((error) => console.error(error));
    // }, []);
    return doc;
};

export const MassAdvertPage = ({
    permission,
    refetchAutoSales,
    setRefetchAutoSales,
    dzhemRefetch,
    setDzhemRefetch,
    sellerId,
}: {
    permission: string;
    refetchAutoSales: boolean;
    setRefetchAutoSales: Function;
    dzhemRefetch: boolean;
    setDzhemRefetch: Function;
    sellerId: string;
}) => {
    const [selectedNmId, setSelectedNmId] = useState(0);
    const {showError} = useError();
    const {selectValue, setSwitchingCampaignsFlag} = useCampaign();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [advertBudgetRules, setAdvertBudgetRules] = useState([]);
    const fetchAdvertBudgetRules = async () => {
        try {
            const response = await ApiClient.post('massAdvert/get-advert-budget-rules', {
                seller_id: sellerId,
            });
            if (!response?.data) {
                throw new Error('error while getting advertBudgetRules');
            }
            const temp = response?.data;
            setAdvertBudgetRules(temp);
        } catch (error) {
            console.error(error);
            showError(error);
        }
    };
    useEffect(() => {
        fetchAdvertBudgetRules();
    }, [sellerId]);

    const cardStyle = {
        minWidth: '10em',
        height: '10em',
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
        marginRight: '8px',
        marginLeft: '8px',
    };

    const [stocksByWarehouses, setStocksByWarehouses] = useState({});
    useEffect(() => {
        const params = {seller_id: sellerId};
        callApi('getStocksByWarehouses', params).then((res) => {
            if (!res || !res['data']) return;

            setStocksByWarehouses(res['data']);
        });
    }, [sellerId]);

    const [selectedSearchPhrase, setSelectedSearchPhrase] = useState<string>('');
    const [filtersRK, setFiltersRK] = useState({
        scheduleRules: false,
        budgetRules: false,
        phrasesRules: false,
        bidderRules: false,
    });

    const auctionOptions: any[] = [
        {value: 'Выдача', content: 'Выдача'},
        {value: 'Аукцион Авто', content: 'Аукцион Авто'},
        {value: 'Аукцион Поиска', content: 'Аукцион Поиска'},
    ];
    const [auctionSelectedOption, setAuctionSelectedOption] = useState('Выдача');
    const [semanticsModalOpenFromArt, setSemanticsModalOpenFromArt] = useState('');
    const [currentParsingProgress, setCurrentParsingProgress] = useState<any>({});

    const [autoSalesModalOpenFromParent, setAutoSalesModalOpenFromParent] = useState('');

    const [fetchedPlacements, setFetchedPlacements] = useState<any>(undefined);

    const [filters, setFilters] = useState({undef: false});

    const [availableAutoSalesNmIds, setAvailableAutoSalesNmIds] = useState([] as any[]);
    const [autoSalesProfits, setAutoSalesProfits] = useState({});
    const [filterAutoSales, setFilterAutoSales] = useState(false);

    const [placementsDisplayPhrase, setPlacementsDisplayPhrase] = useState('');

    const [copiedAdvertsSettings, setCopiedAdvertsSettings] = useState({advertId: 0});

    const artsStatsByDayModeSwitchValues: any[] = [
        {value: 'Статистика по дням', content: 'Статистика по дням'},
        {value: 'Статистика по дням недели', content: 'Статистика по дням недели', disabled: true},
    ];
    const [artsStatsByDayModeSwitchValue, setArtsStatsByDayModeSwitchValue] = React.useState([
        'Статистика по дням',
    ]);

    const [showDzhemModalOpen, setShowDzhemModalOpen] = useState(false);

    const [showArtStatsModalOpen, setShowArtStatsModalOpen] = useState(false);
    const [artsStatsByDayData, setArtsStatsByDayData] = useState<any[]>([]);
    const [artsStatsByDayFilteredData, setArtsStatsByDayFilteredData] = useState<any[]>([]);
    const [artsStatsByDayFilters, setArtsStatsByDayFilters] = useState({undef: false});

    const [artsStatsByDayFilteredSummary, setArtsStatsByDayFilteredSummary] = useState({
        date: 0,
        orders: 0,
        sum_orders: 0,
        sum: 0,
        views: 0,
        clicks: 0,
        drr: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        cr: 0,
        cpo: 0,
        openCardCount: 0,
        addToCartCount: 0,
        addToCartPercent: 0,
        cartToOrderPercent: 0,
        cpl: 0,
    });
    const artsStatsByDayDataFilter = (withfFilters: any, stats: any[]) => {
        const _filters = withfFilters ?? artsStatsByDayFilters;
        const _stats = stats ?? artsStatsByDayData;

        const artsStatsByDayFilteredSummaryTemp = {
            date: 0,
            orders: 0,
            sum_orders: 0,
            sum: 0,
            views: 0,
            clicks: 0,
            drr: 0,
            ctr: 0,
            cpc: 0,
            cpm: 0,
            cr: 0,
            cpo: 0,
            openCardCount: 0,
            addToCartCount: 0,
            addToCartPercent: 0,
            cartToOrderPercent: 0,
            cpl: 0,
        };

        _stats.sort((a, b) => {
            const dateA = new Date(a['date']);
            const dateB = new Date(b['date']);
            return dateB.getTime() - dateA.getTime();
        });

        setArtsStatsByDayFilteredData(
            _stats.filter((stat) => {
                for (const [filterArg, filterData] of Object.entries(_filters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;
                    else if (!compare(stat[filterArg], filterData)) {
                        return false;
                    }
                }

                for (const [key, val] of Object.entries(stat)) {
                    if (
                        [
                            'sum',
                            'clicks',
                            'views',
                            'orders',
                            'sum_orders',
                            'openCardCount',
                            'addToCartCount',
                            'addToCartPercent',
                            'cartToOrderPercent',
                        ].includes(key)
                    )
                        artsStatsByDayFilteredSummaryTemp[key] +=
                            isFinite(val as number) && !isNaN(val as number) ? val : 0;
                }

                artsStatsByDayFilteredSummaryTemp['date']++;

                return true;
            }),
        );

        artsStatsByDayFilteredSummaryTemp.sum_orders = Math.round(
            artsStatsByDayFilteredSummaryTemp.sum_orders,
        );
        artsStatsByDayFilteredSummaryTemp.orders = Math.round(
            artsStatsByDayFilteredSummaryTemp.orders,
        );
        artsStatsByDayFilteredSummaryTemp.sum = Math.round(artsStatsByDayFilteredSummaryTemp.sum);
        artsStatsByDayFilteredSummaryTemp.views = Math.round(
            artsStatsByDayFilteredSummaryTemp.views,
        );
        artsStatsByDayFilteredSummaryTemp.clicks = Math.round(
            artsStatsByDayFilteredSummaryTemp.clicks,
        );
        artsStatsByDayFilteredSummaryTemp.openCardCount = Math.round(
            artsStatsByDayFilteredSummaryTemp.openCardCount,
        );
        artsStatsByDayFilteredSummaryTemp.addToCartPercent = getRoundValue(
            artsStatsByDayFilteredSummaryTemp.addToCartCount,
            artsStatsByDayFilteredSummaryTemp.openCardCount,
            true,
        );
        artsStatsByDayFilteredSummaryTemp.cartToOrderPercent = getRoundValue(
            artsStatsByDayFilteredSummaryTemp.orders,
            artsStatsByDayFilteredSummaryTemp.addToCartCount,
            true,
        );
        const {orders, sum, views, clicks, openCardCount, addToCartCount} =
            artsStatsByDayFilteredSummaryTemp;

        artsStatsByDayFilteredSummaryTemp.drr = getRoundValue(
            artsStatsByDayFilteredSummaryTemp.sum,
            artsStatsByDayFilteredSummaryTemp.sum_orders,
            true,
            1,
        );
        artsStatsByDayFilteredSummaryTemp.ctr = getRoundValue(clicks, views, true);
        artsStatsByDayFilteredSummaryTemp.cpc = getRoundValue(sum / 100, clicks, true, sum / 100);
        artsStatsByDayFilteredSummaryTemp.cpm = getRoundValue(sum * 1000, views);
        artsStatsByDayFilteredSummaryTemp.cr = getRoundValue(orders, openCardCount, true);
        artsStatsByDayFilteredSummaryTemp.cpo = getRoundValue(sum, orders, false, sum);
        artsStatsByDayFilteredSummaryTemp.cpl = getRoundValue(sum, addToCartCount, false, sum);

        setArtsStatsByDayFilteredSummary(artsStatsByDayFilteredSummaryTemp);
    };

    const [advertsArtsListModalFromOpen, setAdvertsArtsListModalFromOpen] = useState(false);
    const [rkList, setRkList] = useState<any[]>([]);
    const [rkListMode, setRkListMode] = useState('add');

    const [pagesCurrent, setPagesCurrent] = useState(1);

    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);

    const [unvalidatedArts, setUnvalidatedArts] = useState<any[]>([]);

    const getUnvalidatedArts = async () => {
        try {
            const params = {seller_id: sellerId, fields: ['prices', 'tax']};
            const response = await ApiClient.post('massAdvert/unvalidatedArts', params);
            if (!response?.data) {
                throw new Error('error while getting unvalidatedArts');
            }
            console.log('unvalidatedArts', response?.data?.unvalidatedArts);
            setUnvalidatedArts(response?.data?.unvalidatedArts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUnvalidatedArts();
    }, [sellerId]);

    // const paramMap = {
    //     status: {
    //         '-1': 'В процессе удаления',
    //         4: 'Готова к запуску',
    //         7: 'Завершена',
    //         8: 'Отказался',
    //         // 9: 'Идут показы',
    //         9: 'Активна',
    //         11: 'Пауза',
    //     },
    //     type: {
    //         4: 'Каталог',
    //         5: 'Карточка товара',
    //         6: 'Поиск',
    //         7: 'Главная страница',
    //         8: 'Авто',
    //         9: 'Поиск + Каталог',
    //     },
    // };
    const updateColumnWidth = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        filterTableData({adverts: {val: '', mode: 'include'}}, data);
    };

    const manageAdvertsActivityCallFunc = async (mode, advertId) => {
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {
                advertsIds: {},
                mode: mode,
            },
        };
        params.data.advertsIds[advertId] = {advertId: advertId};

        //////////////////////////////////
        return await callApi('manageAdvertsActivity', params);
        //////////////////////////////////
    };

    const filterByButton = (val, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val) + ' ', compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const calcByDayStats = (arts) => {
        const tempJson = {};

        const daysBetween =
            dateRange[1].getTime() / 86400 / 1000 - dateRange[0].getTime() / 86400 / 1000;

        const now = new Date();
        for (let i = 0; i <= daysBetween; i++) {
            const dateIter = new Date(dateRange[1]);
            dateIter.setDate(dateIter.getDate() - i);

            if (dateIter > now) continue;
            const strDate = getLocaleDateString(dateIter);

            if (!tempJson[strDate])
                tempJson[strDate] = {
                    date: dateIter,
                    orders: 0,
                    sum_orders: 0,
                    sum: 0,
                    views: 0,
                    clicks: 0,
                    drr: 0,
                    ctr: 0,
                    cpc: 0,
                    cpm: 0,
                    cr: 0,
                    cpo: 0,
                    openCardCount: 0,
                    addToCartCount: 0,
                    addToCartPercent: 0,
                    cartToOrderPercent: 0,
                    cpl: 0,
                };

            for (const _art of arts) {
                const {advertsStats, nmFullDetailReport} = doc.campaigns[selectValue[0]][_art];
                if (!advertsStats) continue;
                const dateData = advertsStats[strDate];
                if (!dateData) continue;

                // console.log(dateData);

                tempJson[strDate].orders += dateData['orders'];
                tempJson[strDate].sum_orders += dateData['sum_orders'];
                tempJson[strDate].sum += dateData['sum'];
                tempJson[strDate].views += dateData['views'];
                tempJson[strDate].clicks += dateData['clicks'];

                const {openCardCount, addToCartCount} = nmFullDetailReport.statistics[strDate] ?? {
                    openCardCount: 0,
                    addToCartCount: 0,
                };

                tempJson[strDate].openCardCount += openCardCount ?? 0;
                tempJson[strDate].addToCartCount += addToCartCount ?? 0;
            }
            tempJson[strDate].openCardCount = Math.round(tempJson[strDate].openCardCount);

            tempJson[strDate].addToCartPercent = getRoundValue(
                tempJson[strDate].addToCartCount,
                tempJson[strDate].openCardCount,
                true,
            );
            tempJson[strDate].cartToOrderPercent = getRoundValue(
                tempJson[strDate].orders,
                tempJson[strDate].addToCartCount,
                true,
            );
            tempJson[strDate].cpl = getRoundValue(
                tempJson[strDate].sum,
                tempJson[strDate].addToCartCount,
            );
        }

        const temp = [] as any[];

        for (const [strDate, dateData] of Object.entries(tempJson)) {
            if (!strDate || !dateData) continue;

            dateData['orders'] = Math.round(dateData['orders']);
            dateData['sum_orders'] = Math.round(dateData['sum_orders']);
            dateData['sum'] = Math.round(dateData['sum']);
            dateData['views'] = Math.round(dateData['views']);
            dateData['clicks'] = Math.round(dateData['clicks']);

            const {orders, sum, clicks, views} = dateData as any;

            dateData['drr'] = getRoundValue(dateData['sum'], dateData['sum_orders'], true, 1);
            dateData['ctr'] = getRoundValue(clicks, views, true);
            dateData['cpc'] = getRoundValue(sum / 100, clicks, true, sum / 100);
            dateData['cpm'] = getRoundValue(sum * 1000, views);
            dateData['cr'] = getRoundValue(orders, dateData['openCardCount'], true);
            dateData['cpo'] = getRoundValue(sum, orders, false, sum);
            temp.push(dateData);
        }

        return temp;
    };

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            additionalNodes: [
                <Button
                    style={{marginLeft: 5}}
                    view="outlined"
                    selected={filterAutoSales}
                    onClick={() => {
                        setFilterAutoSales(!filterAutoSales);
                        filterTableData(filters, data, !filterAutoSales);
                    }}
                >
                    <Icon data={TagRuble} />
                </Button>,
            ],
            render: ({value, row, footer, index}) => {
                const {title, brand, object, nmId, photos, imtId, art, tags} = row;

                if (title === undefined) return <div style={{height: 28}}>{value}</div>;

                const imgUrl = photos ? (photos[0] ? photos[0].big : undefined) : undefined;

                let titleWrapped = title;
                if (title.length > 30) {
                    let wrapped = false;
                    titleWrapped = '';
                    const titleArr = title.split(' ');
                    for (const word of titleArr) {
                        titleWrapped += word;
                        if (titleWrapped.length > 25 && !wrapped) {
                            titleWrapped += '\n';
                            wrapped = true;
                        } else {
                            titleWrapped += ' ';
                        }
                    }
                }

                /// tags
                const tagsNodes = [] as ReactNode[];
                const autoSalesInfo = doc?.['autoSales']?.[selectValue[0]]?.[nmId];
                const {fixedPrices} = autoSalesInfo ?? {};
                const inActionNow =
                    autoSalesInfo?.autoSaleName && autoSalesInfo?.autoSaleName !== '';
                const {autoSaleName} = fixedPrices ?? {};
                if (autoSalesInfo && ((autoSaleName && autoSaleName != '') || inActionNow)) {
                    tagsNodes.push(
                        <div>
                            <CanBeAddedToSales
                                nmId={nmId}
                                sellerId={sellerId}
                                pin="circle-clear"
                                view={inActionNow ? 'outlined-action' : 'outlined'}
                                selected={false}
                                setAutoSalesModalOpenFromParent={setAutoSalesModalOpenFromParent}
                            />
                            {autoSalesInfo['fixedPrices'] &&
                            autoSalesInfo['fixedPrices']['dateRange'] ? (
                                <Button
                                    size="xs"
                                    pin="clear-clear"
                                    view={inActionNow ? 'outlined-action' : 'outlined'}
                                    selected={false}
                                    onClick={() => {
                                        const params = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            nmIds: [nmId],
                                        };

                                        console.log(params);

                                        delete doc.autoSales[selectValue[0]][nmId];
                                        setChangedDoc({...doc});

                                        callApi('deleteAutoSaleFromNmIds', params);
                                    }}
                                >
                                    <Icon data={Xmark} size={12} />
                                </Button>
                            ) : (
                                <></>
                            )}
                            <Popover
                                openOnHover={fixedPrices?.dateRange}
                                delayOpening={1000}
                                placement={'bottom'}
                                content={
                                    <Text variant="subheader-1">
                                        {autoSalesInfo['fixedPrices'] &&
                                        autoSalesInfo['fixedPrices']['dateRange'] ? (
                                            autoSalesInfo['fixedPrices']['dateRange'] ? (
                                                `${new Date(
                                                    autoSalesInfo['fixedPrices']['dateRange'][0],
                                                ).toLocaleDateString('ru-RU')}
                                                        - ${new Date(
                                                            autoSalesInfo['fixedPrices'][
                                                                'dateRange'
                                                            ][1],
                                                        ).toLocaleDateString('ru-RU')}`
                                            ) : (
                                                'Выберите даты акции'
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </Text>
                                }
                            >
                                <Button
                                    size="xs"
                                    pin={'clear-circle'}
                                    view={inActionNow ? 'outlined-action' : 'outlined'}
                                    selected={false}
                                >
                                    <Text>{autoSaleName ?? autoSalesInfo?.autoSaleName}</Text>
                                </Button>
                            </Popover>
                        </div>,
                    );
                    tagsNodes.push(<div style={{minWidth: 8}} />);
                } else if (availableAutoSalesNmIds.includes(nmId)) {
                    tagsNodes.push(
                        <CanBeAddedToSales
                            nmId={nmId}
                            sellerId={sellerId}
                            view={'flat-action'}
                            selected={false}
                            pin="circle-circle"
                            setAutoSalesModalOpenFromParent={setAutoSalesModalOpenFromParent}
                        />,
                    );
                    tagsNodes.push(<div style={{minWidth: 8}} />);
                }

                if (tags) {
                    for (let i = 0; i < tags.length; i++) {
                        const tag = tags[i];
                        if (!tag) continue;

                        tagsNodes.push(
                            <Button
                                size="xs"
                                pin="circle-circle"
                                selected
                                view="outlined-info"
                                onClick={() => filterByButton(tag.toUpperCase())}
                            >
                                {tag.toUpperCase()}
                            </Button>,
                        );
                        tagsNodes.push(<div style={{minWidth: 8}} />);
                    }
                    tagsNodes.pop();
                }

                return footer ? (
                    <div style={{height: 28}}>{value}</div>
                ) : (
                    <div
                        // title={value}
                        style={{
                            maxWidth: '20vw',
                            display: 'flex',
                            flexDirection: 'row',
                            zIndex: 40,
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                justifyContent: 'space-between',
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
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Popover
                                        behavior={'delayed' as PopoverBehavior}
                                        disabled={value === undefined}
                                        content={
                                            <div style={{width: 200}}>
                                                <img
                                                    style={{width: '100%', height: 'auto'}}
                                                    src={imgUrl}
                                                />
                                                <></>
                                            </div>
                                        }
                                    >
                                        <div style={{width: 40}}>
                                            <img
                                                style={{width: '100%', height: 'auto'}}
                                                src={imgUrl}
                                            />
                                        </div>
                                    </Popover>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Button
                                                disabled={permission != 'Управление'}
                                                size="xs"
                                                pin="brick-brick"
                                                view="outlined"
                                                onClick={() => {
                                                    setAdvertsArtsListModalFromOpen(true);
                                                    const adverts = doc.adverts[selectValue[0]];
                                                    const temp = [] as any[];
                                                    if (adverts) {
                                                        for (const [
                                                            _,
                                                            advertData,
                                                        ] of Object.entries(adverts)) {
                                                            if (!advertData) continue;
                                                            temp.push(advertData['advertId']);
                                                        }
                                                    }
                                                    setSemanticsModalOpenFromArt(art);
                                                    setRkList(temp ?? []);
                                                    setRkListMode('add');
                                                }}
                                            >
                                                <Icon data={Plus} />
                                            </Button>
                                            <div style={{minWidth: 2}} />
                                            <Button
                                                disabled={permission != 'Управление'}
                                                size="xs"
                                                pin="brick-brick"
                                                view="outlined"
                                                onClick={() => {
                                                    setAdvertsArtsListModalFromOpen(true);
                                                    const adverts = row.adverts;
                                                    const temp = [] as any[];
                                                    if (adverts) {
                                                        for (const [
                                                            _,
                                                            advertData,
                                                        ] of Object.entries(adverts)) {
                                                            if (!advertData) continue;
                                                            temp.push(advertData['advertId']);
                                                        }
                                                    }
                                                    setSemanticsModalOpenFromArt(art);
                                                    setRkList(temp ?? []);
                                                    setRkListMode('delete');
                                                }}
                                            >
                                                <Icon data={Xmark} />
                                            </Button>
                                        </div>
                                        <div style={{minHeight: 2}} />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Button
                                                pin="brick-brick"
                                                view="outlined"
                                                size="xs"
                                                // selected
                                                // view={index % 2 == 0 ? 'flat' : 'flat-action'}
                                                onClick={() => {
                                                    setShowArtStatsModalOpen(true);
                                                    setArtsStatsByDayData(calcByDayStats([art]));
                                                }}
                                            >
                                                <Icon data={LayoutList}></Icon>
                                            </Button>
                                            <div style={{minWidth: 2}} />
                                            <Button
                                                pin="brick-brick"
                                                view="outlined"
                                                size="xs"
                                                // selected
                                                // view={index % 2 == 0 ? 'flat' : 'flat-action'}
                                                onClick={() => {
                                                    const dzhem = doc.dzhemData
                                                        ? doc.dzhemData[selectValue[0]]
                                                            ? doc.dzhemData[selectValue[0]][value]
                                                                ? doc.dzhemData[selectValue[0]][
                                                                      value
                                                                  ].phrasesStats ?? undefined
                                                                : undefined
                                                            : undefined
                                                        : undefined;
                                                    console.log(
                                                        value,
                                                        doc.dzhemData[selectValue[0]][value],
                                                    );

                                                    const temp = [] as any[];
                                                    if (dzhem)
                                                        for (const [
                                                            phrase,
                                                            phrasesStats,
                                                        ] of Object.entries(dzhem)) {
                                                            if (!phrase || !phrasesStats) continue;
                                                            phrasesStats['phrase'] = phrase;
                                                            temp.push(phrasesStats);
                                                        }

                                                    temp.sort((a, b) => {
                                                        return b?.openCardCount - a?.openCardCount;
                                                    });
                                                    setSelectedNmId(nmId);
                                                    setShowDzhemModalOpen(true);
                                                }}
                                                // style={{
                                                //     background:
                                                //         'linear-gradient(135deg, #ff9649, #ff5e62)',
                                                // }}
                                            >
                                                {/* <div style={{width: 11}}>
                                                    <Text>
                                                        <img
                                                            color="white"
                                                            style={{width: '100%', height: 'auto'}}
                                                            src={JarIcon}
                                                        />
                                                    </Text>
                                                </div> */}
                                                <Icon data={Cherry}></Icon>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: 4}} />
                                <div
                                    style={{display: 'flex', flexDirection: 'column', width: '100'}}
                                >
                                    <div style={{marginLeft: 6}}>
                                        <Link
                                            view="primary"
                                            style={{whiteSpace: 'pre-wrap'}}
                                            href={`https://www.wildberries.ru/catalog/${nmId}/detail.aspx?targetUrl=BP`}
                                            target="_blank"
                                        >
                                            <Text variant="subheader-1">{titleWrapped}</Text>
                                        </Link>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(object)}
                                        >
                                            <Text variant="caption-2">{`${object}`}</Text>
                                        </Button>
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(brand)}
                                        >
                                            <Text variant="caption-2">{`${brand}`}</Text>
                                        </Button>
                                    </div>
                                    <div
                                        style={{
                                            width: '100',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(nmId)}
                                        >
                                            <Text variant="caption-2">{`Артикул WB: ${nmId}`}</Text>
                                        </Button>
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(imtId)}
                                        >
                                            <Text variant="caption-2">{`ID КТ: ${imtId}`}</Text>
                                        </Button>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(value)}
                                        >
                                            <Text variant="caption-2">{`Артикул: ${value}`}</Text>
                                        </Button>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            maxWidth: '100%',
                                            paddingRight: '100%',
                                            overflowX: 'scroll',
                                        }}
                                    >
                                        {tagsNodes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
            valueType: 'text',
            group: true,
        },
        Object.keys(autoSalesProfits ?? []).length == 0
            ? {
                  name: 'adverts',
                  placeholder: 'Реклама',
                  valueType: 'text',
                  additionalNodes: [
                      <Button
                          style={{marginLeft: 5}}
                          // size="l"
                          view="outlined"
                          onClick={() => filterByButton('авто', 'adverts')}
                      >
                          <Icon data={Rocket} size={14} />
                      </Button>,
                      <Button
                          style={{marginLeft: 5}}
                          // size="l"
                          view="outlined"
                          onClick={() => filterByButton('поиск', 'adverts')}
                      >
                          <Icon data={Magnifier} size={14} />
                      </Button>,
                      <PopupFilterArts setFilters={setFiltersRK} filters={filtersRK} />,

                      <div
                          style={{
                              display: 'flex',
                              flexDirection: 'column',
                              marginBottom: 5,
                              marginLeft: 4,
                          }}
                      >
                          <HelpPopover
                              size="l"
                              content={
                                  <div style={{display: 'flex', flexDirection: 'column'}}>
                                      <Text variant="subheader-1">
                                          Для поиска введите
                                          <Text
                                              style={{margin: '0 3px'}}
                                              color="brand"
                                              variant="subheader-1"
                                          >
                                              Id РК
                                          </Text>
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('+', 'adverts')}
                                          >
                                              <Icon data={Plus} size={14} />
                                          </Button>
                                          чтобы показать артикулы с РК
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('-', 'adverts')}
                                          >
                                              <Icon data={Minus} size={14} />
                                          </Button>
                                          чтобы показать артикулы без РК
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('авто', 'adverts')}
                                          >
                                              авто
                                          </Button>
                                          чтобы показать артикулы с авто РК
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('поиск', 'adverts')}
                                          >
                                              поиск
                                          </Button>
                                          чтобы показать артикулы с поисковыми РК
                                      </Text>
                                  </div>
                              }
                          />
                      </div>,
                  ],
                  render: ({value, row, index}) => {
                      if (typeof value === 'number') {
                          return <Text>{`Уникальных РК ID: ${value}`}</Text>;
                      }

                      const {art} = row;

                      const switches: any[] = [];
                      if (value)
                          for (const [advertId, _] of Object.entries(value)) {
                              const advertData = doc?.adverts?.[selectValue[0]]?.[advertId];
                              if (!advertData) continue;
                              // console.log('popa', advertData, filters['adverts'].val);
                              if (
                                  filters['adverts'] &&
                                  ['авто', 'поиск'].includes(
                                      String(filters['adverts'].val).toLowerCase().trim(),
                                  )
                              ) {
                                  // console.log('popa2', advertData, filters['adverts'].val);
                                  if (
                                      String(filters['adverts'].val)
                                          .toLowerCase()
                                          .includes('поиск') &&
                                      (advertData.type == 9 || advertData.type == 6)
                                  ) {
                                      switches.push(
                                          <AdvertCard
                                              sellerId={sellerId}
                                              advertBudgetRules={advertBudgetRules}
                                              setAdvertBudgetRules={setAdvertBudgetRules}
                                              permission={permission}
                                              id={advertId}
                                              index={index}
                                              art={art}
                                              doc={doc}
                                              selectValue={selectValue}
                                              copiedAdvertsSettings={copiedAdvertsSettings}
                                              setChangedDoc={setChangedDoc}
                                              manageAdvertsActivityCallFunc={
                                                  manageAdvertsActivityCallFunc
                                              }
                                              setArtsStatsByDayData={setArtsStatsByDayData}
                                              updateColumnWidth={updateColumnWidth}
                                              filteredData={filteredData}
                                              setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                              setFetchedPlacements={setFetchedPlacements}
                                              currentParsingProgress={currentParsingProgress}
                                              setCurrentParsingProgress={setCurrentParsingProgress}
                                              columnDataAuction={columnDataAuction}
                                              auctionOptions={auctionOptions}
                                              auctionSelectedOption={auctionSelectedOption}
                                              setDateRange={setDateRange}
                                              setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                              dateRange={dateRange}
                                              recalc={recalc}
                                              filterByButton={filterByButton}
                                              setAuctionSelectedOption={setAuctionSelectedOption}
                                              getUniqueAdvertIdsFromThePage={
                                                  getUniqueAdvertIdsFromThePage
                                              }
                                          />,
                                      );
                                      switches.push(<div style={{minWidth: 8}} />);
                                  } else if (
                                      filters['adverts'] &&
                                      String(filters['adverts'].val)
                                          .toLowerCase()
                                          .includes('авто') &&
                                      advertData.type == 8
                                  ) {
                                      switches.push(
                                          <AdvertCard
                                              sellerId={sellerId}
                                              advertBudgetRules={advertBudgetRules}
                                              setAdvertBudgetRules={setAdvertBudgetRules}
                                              permission={permission}
                                              id={advertId}
                                              index={index}
                                              art={art}
                                              doc={doc}
                                              selectValue={selectValue}
                                              copiedAdvertsSettings={copiedAdvertsSettings}
                                              setChangedDoc={setChangedDoc}
                                              manageAdvertsActivityCallFunc={
                                                  manageAdvertsActivityCallFunc
                                              }
                                              setArtsStatsByDayData={setArtsStatsByDayData}
                                              updateColumnWidth={updateColumnWidth}
                                              filteredData={filteredData}
                                              setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                              setFetchedPlacements={setFetchedPlacements}
                                              currentParsingProgress={currentParsingProgress}
                                              setCurrentParsingProgress={setCurrentParsingProgress}
                                              columnDataAuction={columnDataAuction}
                                              auctionOptions={auctionOptions}
                                              auctionSelectedOption={auctionSelectedOption}
                                              setDateRange={setDateRange}
                                              setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                              dateRange={dateRange}
                                              recalc={recalc}
                                              filterByButton={filterByButton}
                                              setAuctionSelectedOption={setAuctionSelectedOption}
                                              getUniqueAdvertIdsFromThePage={
                                                  getUniqueAdvertIdsFromThePage
                                              }
                                          />,
                                      );
                                      switches.push(<div style={{minWidth: 8}} />);
                                  } else {
                                      continue;
                                  }
                              } else {
                                  switches.push(
                                      <AdvertCard
                                          sellerId={sellerId}
                                          advertBudgetRules={advertBudgetRules}
                                          setAdvertBudgetRules={setAdvertBudgetRules}
                                          permission={permission}
                                          id={advertId}
                                          index={index}
                                          art={art}
                                          doc={doc}
                                          selectValue={selectValue}
                                          copiedAdvertsSettings={copiedAdvertsSettings}
                                          setChangedDoc={setChangedDoc}
                                          manageAdvertsActivityCallFunc={
                                              manageAdvertsActivityCallFunc
                                          }
                                          setArtsStatsByDayData={setArtsStatsByDayData}
                                          updateColumnWidth={updateColumnWidth}
                                          filteredData={filteredData}
                                          setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                          setFetchedPlacements={setFetchedPlacements}
                                          currentParsingProgress={currentParsingProgress}
                                          setCurrentParsingProgress={setCurrentParsingProgress}
                                          columnDataAuction={columnDataAuction}
                                          auctionOptions={auctionOptions}
                                          auctionSelectedOption={auctionSelectedOption}
                                          setDateRange={setDateRange}
                                          setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                          dateRange={dateRange}
                                          recalc={recalc}
                                          filterByButton={filterByButton}
                                          setAuctionSelectedOption={setAuctionSelectedOption}
                                          getUniqueAdvertIdsFromThePage={
                                              getUniqueAdvertIdsFromThePage
                                          }
                                      />,
                                  );
                                  switches.push(<div style={{minWidth: 8}} />);
                              }
                          }

                      switches.pop();

                      return (
                          <div
                              style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflowX: 'scroll',
                                  overflowY: 'hidden',
                                  // justifyContent: 'space-between',
                              }}
                          >
                              {switches}
                          </div>
                      );
                  },
              }
            : {
                  constWidth: 400,
                  name: 'autoSales',
                  placeholder: 'Акции',
                  sortFunction: (a, b, order) => {
                      const profitsDataA = autoSalesProfits[a?.art]?.rentabelnost;
                      const profitsDataB = autoSalesProfits[b?.art]?.rentabelnost;

                      const isNaNa = isNaN(profitsDataA);
                      const isNaNb = isNaN(profitsDataB);
                      if (isNaNa && isNaNb) return 1;
                      else if (isNaNa) return 1;
                      else if (isNaNb) return -1;

                      return (profitsDataA - profitsDataB) * order;
                  },
                  additionalNodes: [
                      <Button
                          view="outlined"
                          style={{marginLeft: 5}}
                          onClick={() => {
                              const params = {
                                  uid: getUid(),
                                  campaignName: selectValue[0],
                                  data: {},
                              };
                              const newDocAutoSales = {...doc.autoSales};
                              const tempAutoSales = {...autoSalesProfits};
                              for (const row of filteredData) {
                                  const {nmId, art} = row;
                                  const profits = autoSalesProfits[art];
                                  if (!profits) continue;
                                  const {
                                      autoSaleName,
                                      dateRange,
                                      rozPrice,
                                      oldRozPrices,
                                      oldDiscount,
                                  } = profits;
                                  params.data[nmId] = {
                                      autoSaleName,
                                      dateRange,
                                      rozPrice,
                                      oldRozPrices,
                                      oldDiscount,
                                  };
                                  delete tempAutoSales[art];

                                  newDocAutoSales[selectValue[0]][nmId] = {
                                      autoSaleName: '',
                                      fixedPrices: {dateRange, autoSaleName},
                                  };
                              }

                              console.log(params);

                              callApi('setAutoSales', params, false, true)
                                  .then(() => {
                                      setAutoSalesProfits(tempAutoSales);
                                      doc.autoSales = newDocAutoSales;
                                      setChangedDoc({...doc});
                                  })
                                  .catch((error) => {
                                      showError(
                                          error.response?.data?.error ||
                                              'An unknown error occurred',
                                      );
                                  });
                          }}
                      >
                          <Icon data={Check} />
                          Принять все
                      </Button>,
                      <Button
                          style={{marginLeft: 5}}
                          view="outlined"
                          onClick={() => {
                              const tempAutoSales = {...autoSalesProfits};
                              for (const row of filteredData) {
                                  const {art} = row;
                                  delete tempAutoSales[art];
                              }
                              setAutoSalesProfits(tempAutoSales);
                          }}
                      >
                          <Icon data={Xmark} />
                          Отклонить все
                      </Button>,
                  ],
                  render: ({row, footer}) => {
                      const {art, nmId} = row;
                      if (footer) return undefined;
                      const profitsData = autoSalesProfits[art];
                      const switches = [] as any[];

                      if (profitsData) {
                          switches.push(
                              <Card
                                  style={{
                                      height: 110.5,
                                      width: 'fit-content',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                  }}
                              >
                                  <Button
                                      style={{
                                          borderTopLeftRadius: 7,
                                          borderTopRightRadius: 7,
                                          overflow: 'hidden',
                                      }}
                                      width="max"
                                      size="xs"
                                      pin="brick-brick"
                                      view="flat"
                                  >
                                      <Text variant="subheader-1">{profitsData.autoSaleName}</Text>
                                  </Button>
                                  <Button view="outlined" size="xs" pin="clear-clear" width="max">
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              width: '100%',
                                              justifyContent: 'space-between',
                                          }}
                                      >
                                          <Text
                                              color={
                                                  profitsData.oldProfit > 0 ? 'positive' : 'danger'
                                              }
                                          >
                                              {`${new Intl.NumberFormat('ru-RU').format(
                                                  profitsData.oldProfit,
                                              )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                                  getRoundValue(
                                                      profitsData.oldRentabelnost,
                                                      1,
                                                      true,
                                                  ),
                                              )}%`}
                                          </Text>
                                          <div style={{minWidth: 8}} />
                                          <Text>{`${profitsData.oldRozPrices} ₽`}</Text>
                                      </div>
                                  </Button>

                                  <Text
                                      style={{
                                          width: '100%',
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          height: 20,
                                      }}
                                      color={
                                          profitsData.profit == profitsData.oldProfit
                                              ? 'secondary'
                                              : profitsData.profit > profitsData.oldProfit
                                              ? 'positive'
                                              : 'danger'
                                      }
                                  >
                                      <Icon data={ArrowShapeDown} />
                                  </Text>
                                  <Button view="outlined" size="xs" pin="clear-clear" width="max">
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              width: '100%',
                                              justifyContent: 'space-between',
                                          }}
                                      >
                                          <Text
                                              color={profitsData.profit > 0 ? 'positive' : 'danger'}
                                          >
                                              {`${new Intl.NumberFormat('ru-RU').format(
                                                  profitsData.profit,
                                              )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                                  getRoundValue(profitsData.rentabelnost, 1, true),
                                              )}%`}
                                          </Text>
                                          <div style={{minWidth: 8}} />
                                          <Text>{`${profitsData.rozPrice} ₽`}</Text>
                                      </div>
                                  </Button>
                                  <div
                                      style={{
                                          minHeight: 0.5,
                                          marginTop: 10,
                                          width: '100%',
                                          background: 'var(--yc-color-base-generic-hover)',
                                      }}
                                  />
                                  <div
                                      style={{display: 'flex', flexDirection: 'row', width: '100%'}}
                                  >
                                      <Button
                                          pin="clear-clear"
                                          size="xs"
                                          width="max"
                                          view="flat-success"
                                          selected
                                          style={{borderBottomLeftRadius: 7, overflow: 'hidden'}}
                                          onClick={() => {
                                              const params = {
                                                  uid: getUid(),
                                                  campaignName: selectValue[0],
                                                  data: {},
                                              };
                                              const {
                                                  autoSaleName,
                                                  dateRange,
                                                  rozPrice,
                                                  oldRozPrices,
                                                  oldDiscount,
                                              } = profitsData;
                                              params.data[nmId] = {
                                                  autoSaleName,
                                                  dateRange,
                                                  rozPrice,
                                                  oldRozPrices,
                                                  oldDiscount,
                                              };

                                              console.log(params);

                                              doc.autoSales[selectValue[0]][nmId] = {
                                                  autoSaleName: '',
                                                  fixedPrices: {dateRange, autoSaleName},
                                              };
                                              setChangedDoc({...doc});

                                              callApi('setAutoSales', params);

                                              const temp = {...autoSalesProfits};
                                              delete temp[art];
                                              setAutoSalesProfits(temp);
                                          }}
                                      >
                                          <Icon data={Check} />
                                      </Button>
                                      <Button
                                          pin="clear-clear"
                                          size="xs"
                                          width="max"
                                          view="flat-danger"
                                          selected
                                          style={{borderBottomRightRadius: 7, overflow: 'hidden'}}
                                          onClick={() => {
                                              const temp = {...autoSalesProfits};
                                              delete temp[art];
                                              setAutoSalesProfits(temp);
                                          }}
                                      >
                                          <Icon data={Xmark} />
                                      </Button>
                                  </div>
                              </Card>,
                          );
                          switches.push(<div style={{minWidth: 8}} />);
                      }

                      switches.pop();

                      return (
                          <div
                              style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflowX: 'scroll',
                                  overflowY: 'hidden',
                                  // justifyContent: 'space-between',
                              }}
                          >
                              {switches}
                          </div>
                      );
                  },
              },
        {
            name: 'analytics',
            placeholder: 'Аналитика',
            render: ({row, footer}) => {
                const {profit, rentabelnost} = row;
                if (footer) {
                    return (
                        <Text color={profit > 0 ? 'positive' : 'danger'}>
                            {`${new Intl.NumberFormat('ru-RU').format(
                                Math.round(profit),
                            )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                Math.round(rentabelnost),
                            )}%`}
                        </Text>
                    );
                }
                const warningArtIcon = () => {
                    const nmIdArray = unvalidatedArts.map((art) => art.nmId);
                    const nmIdIndex = nmIdArray.findIndex((element) => element == nmId);
                    if (nmIdIndex != -1) {
                        const art = unvalidatedArts[nmIdIndex];
                        const keys = Object.keys(art);
                        const words: String[] = [];
                        for (const key of keys) {
                            switch (key) {
                                case 'prices':
                                    words.push('себестоимость');
                                    break;
                                case 'tax':
                                    words.push('налог');
                                    break;
                                default:
                                    break;
                            }
                        }
                        return (
                            <span style={{pointerEvents: 'auto'}}>
                                <Tooltip
                                    style={{maxWidth: '400px'}}
                                    content={
                                        <Text>
                                            Внимание: расчёт прибыли выполнен с ошибкой. Пожалуйста,
                                            укажите&nbsp;{getEnumurationString(words)} для
                                            корректного отображения данных
                                        </Text>
                                    }
                                    disabled={false}
                                >
                                    <Button
                                        view="flat"
                                        style={{color: 'rgb(255, 190, 92)'}}
                                        size="xs"
                                    >
                                        <Icon data={TriangleExclamation} size={11} />
                                    </Button>
                                </Tooltip>
                            </span>
                        );
                    }
                    return <div />;
                };
                const {placementsValue, stocksBySizes, nmId} = row ?? {};
                const stocksByWarehousesArt = stocksByWarehouses?.[nmId];

                // if (!placementsValue) return undefined;
                const {reviewRating, sizes, feedbacks, phrase} = placementsValue ?? {};
                // if (!reviewRating) return undefined;
                const {price} = sizes ? sizes[0] ?? {price: undefined} : {price: undefined};
                const {total} = price ?? {total: 0};
                const priceRub = Math.round(total / 100);
                // console.log(placementsValue);

                const {firstPage} = doc?.placementsAuctions?.[selectValue[0]]?.[phrase] ?? {};

                const pricesData: any[] = [];
                const pricesDataCur: any[] = [];
                const reviewRatingsData: any[] = [];
                const reviewRatingsDataCur: any[] = [];
                const feedbacksData: any[] = [];
                const feedbacksDataCur: any[] = [];
                let yagrPricesData = {} as any;
                let yagrReviewRatingsData = {} as any;
                let yagrFeedbacksData = {} as any;

                if (placementsValue && reviewRating) {
                    if (firstPage) {
                        for (let i = 0; i < firstPage.length; i++) {
                            const card = firstPage[i];
                            // console.log(card);

                            const {reviewRating, sizes, feedbacks} = card;
                            const {price} = sizes
                                ? sizes[0] ?? {price: undefined}
                                : {price: undefined};
                            const {total} = price ?? {total: 0};
                            const priceRub = Math.round(total / 100);

                            if (!pricesData.includes(priceRub)) pricesData.push(priceRub);
                            if (!reviewRatingsData.includes(reviewRating))
                                reviewRatingsData.push(reviewRating);
                            if (!feedbacksData.includes(feedbacks)) feedbacksData.push(feedbacks);
                        }
                    }
                    pricesData.sort((a, b) => a - b);
                    for (let i = 0; i < pricesData.length; i++) {
                        if (pricesData[i] == priceRub) {
                            pricesDataCur.push(priceRub);
                            break;
                        } else {
                            pricesDataCur.push(null);
                        }
                    }
                    reviewRatingsData.sort((a, b) => a - b);
                    for (let i = 0; i < reviewRatingsData.length; i++) {
                        if (reviewRatingsData[i] == reviewRating) {
                            reviewRatingsDataCur.push(reviewRating);
                            break;
                        } else {
                            reviewRatingsDataCur.push(null);
                        }
                    }
                    feedbacksData.sort((a, b) => a - b);
                    for (let i = 0; i < feedbacksData.length; i++) {
                        if (feedbacksData[i] == feedbacks) {
                            feedbacksDataCur.push(feedbacks);
                            break;
                        } else {
                            feedbacksDataCur.push(null);
                        }
                    }

                    const genYagrData = (
                        all,
                        cur,
                        colorAll,
                        title,
                        axisName,
                        cursorName,
                        min = -1,
                        colorCur = '#ffbe5c',
                    ) => {
                        return {
                            data: {
                                timeline: [...Array(all.length).keys()],
                                graphs: [
                                    {
                                        color: colorCur,
                                        type: 'column',
                                        data: cur,
                                        id: '1',
                                        name: 'Этот артикул',
                                        scale: 'y',
                                    },
                                    {
                                        id: '0',
                                        name: cursorName,
                                        data: all,
                                        color: colorAll,
                                        scale: 'y',
                                    },
                                ],
                            },

                            libraryConfig: {
                                chart: {
                                    series: {
                                        type: 'column',
                                    },
                                },
                                axes: {
                                    y: {
                                        label: axisName,
                                        precision: 'auto',
                                        show: true,
                                    },
                                    x: {
                                        show: true,
                                    },
                                },
                                series: [],
                                scales: {
                                    y: {
                                        min: min == -1 ? Math.floor(all[0]) : min,
                                    },
                                },
                                title: {
                                    text: title,
                                },
                            },
                        } as YagrWidgetData;
                    };

                    yagrPricesData = genYagrData(
                        pricesData,
                        pricesDataCur,
                        '#5fb8a5',
                        'Цены топ 100 артикулов по запросу',
                        'Цены',
                        'Цена',
                    );
                    yagrReviewRatingsData = genYagrData(
                        reviewRatingsData,
                        reviewRatingsDataCur,
                        '#9a63d1',
                        'Рейтинг топ 100 артикулов по запросу',
                        'Рейтинг',
                        'Рейтинг',
                    );
                    yagrFeedbacksData = genYagrData(
                        feedbacksData,
                        feedbacksDataCur,
                        '#4aa1f2',
                        'Количество отзывов топ 100 артикулов по запросу',
                        'Отзывы',
                        'Отзывов',
                        0,
                    );
                }

                return (
                    <Card
                        style={{
                            width: 160,
                            height: 110.5,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        {priceRub ? (
                            <Popover
                                openOnHover={reviewRating}
                                content={
                                    <div
                                        style={{
                                            height: 'calc(30em - 60px)',
                                            width: '60em',
                                            overflow: 'auto',
                                            display: 'flex',
                                        }}
                                    >
                                        <Card
                                            view="outlined"
                                            theme="warning"
                                            style={{
                                                position: 'absolute',
                                                height: '30em',
                                                width: '60em',
                                                overflow: 'auto',
                                                top: -10,
                                                left: -10,
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <ChartKit type="yagr" data={yagrPricesData} />
                                            <div
                                                style={{
                                                    // background: 'var(--g-color-base-background)',
                                                    background: '#2d2c33',
                                                    position: 'absolute',
                                                    height: 20,
                                                    width: '100%',
                                                    bottom: 0,
                                                }}
                                            ></div>
                                        </Card>
                                    </div>
                                }
                            >
                                <Button
                                    view="flat"
                                    width="max"
                                    size="xs"
                                    pin="clear-clear"
                                    style={{
                                        width: 160,
                                        overflow: 'hidden',
                                        borderTopLeftRadius: 7,
                                        borderTopRightRadius: 7,
                                    }}
                                    // pin="brick-brick"
                                >
                                    {`Цена СПП: ${new Intl.NumberFormat('ru-RU').format(
                                        priceRub,
                                    )} ₽`}
                                </Button>
                            </Popover>
                        ) : (
                            <></>
                        )}
                        {reviewRating ? (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div
                                    style={{
                                        width: '100%',
                                        background: 'var(--yc-color-base-generic-hover)',
                                        height: 0.5,
                                    }}
                                />
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Popover
                                        content={
                                            <div
                                                style={{
                                                    height: 'calc(30em - 60px)',
                                                    width: '60em',
                                                    overflow: 'auto',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Card
                                                    view="outlined"
                                                    theme="warning"
                                                    style={{
                                                        position: 'absolute',
                                                        height: '30em',
                                                        width: '60em',
                                                        overflow: 'auto',
                                                        top: -10,
                                                        left: -10,
                                                        display: 'flex',
                                                    }}
                                                >
                                                    <ChartKit
                                                        type="yagr"
                                                        data={yagrReviewRatingsData}
                                                    />
                                                    <div
                                                        style={{
                                                            // background: 'var(--g-color-base-background)',
                                                            background: '#2d2c33',
                                                            position: 'absolute',
                                                            height: 20,
                                                            width: '100%',
                                                            bottom: 0,
                                                        }}
                                                    ></div>
                                                </Card>
                                            </div>
                                        }
                                    >
                                        <Button
                                            width="max"
                                            size="xs"
                                            view="flat"
                                            pin="clear-brick"
                                            style={{
                                                height: 20,
                                                width: 80,
                                            }}
                                            // pin="brick-brick"
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text>{reviewRating}</Text>
                                                <div style={{minWidth: 3}} />
                                                <Text
                                                    color="warning"
                                                    style={{display: 'flex', alignItems: 'center'}}
                                                >
                                                    <Icon data={Star} size={11} />
                                                </Text>
                                            </div>
                                        </Button>
                                    </Popover>
                                    <div
                                        style={{
                                            background: 'var(--yc-color-base-generic-hover)',
                                            height: 24,
                                            minWidth: 0.5,
                                        }}
                                    />
                                    <Popover
                                        content={
                                            <div
                                                style={{
                                                    height: 'calc(30em - 60px)',
                                                    width: '60em',
                                                    overflow: 'auto',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Card
                                                    view="outlined"
                                                    theme="warning"
                                                    style={{
                                                        position: 'absolute',
                                                        height: '30em',
                                                        width: '60em',
                                                        overflow: 'auto',
                                                        top: -10,
                                                        left: -10,
                                                        display: 'flex',
                                                    }}
                                                >
                                                    <ChartKit
                                                        type="yagr"
                                                        data={yagrFeedbacksData}
                                                    />
                                                    <div
                                                        style={{
                                                            // background: 'var(--g-color-base-background)',
                                                            background: '#2d2c33',
                                                            position: 'absolute',
                                                            height: 20,
                                                            width: '100%',
                                                            bottom: 0,
                                                        }}
                                                    ></div>
                                                </Card>
                                            </div>
                                        }
                                    >
                                        <Button
                                            style={{
                                                width: 80,
                                                height: 20,
                                                overflow: 'hidden',
                                            }}
                                            width="max"
                                            size="xs"
                                            view="flat"
                                            pin="brick-clear"
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text>{feedbacks}</Text>
                                                <div style={{minWidth: 3}} />
                                                <Icon data={Comment} size={11} />
                                            </div>
                                        </Button>
                                    </Popover>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        {stocksBySizes && stocksBySizes.all > 1 ? (
                            <Button
                                style={{
                                    width: 160,
                                    overflow: 'hidden',
                                }}
                                width="max"
                                size="xs"
                                view={stocksBySizes ? 'outlined' : 'outlined-danger'}
                                pin="clear-clear"
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text>{`${stocksBySizes.available ?? ''} / ${
                                        stocksBySizes.all ?? ''
                                    }`}</Text>
                                    <div style={{minWidth: 3}} />
                                    <Icon data={TShirt} size={11} />
                                </div>
                            </Button>
                        ) : (
                            <></>
                        )}
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div
                                style={{
                                    width: '100%',
                                    background: 'var(--yc-color-base-generic-hover)',
                                    height: 0.5,
                                }}
                            />
                            <StocksByWarehousesPopup
                                stocksByWarehousesArt={stocksByWarehousesArt}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div
                                style={{
                                    width: '100%',
                                    background: 'var(--yc-color-base-generic-hover)',
                                    height: 0.5,
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    disabled={!Math.round(profit)}
                                    style={{
                                        width: 'au',
                                        overflow: 'hidden',
                                    }}
                                    width="max"
                                    size="xs"
                                    view={'flat'}
                                    pin="clear-clear"
                                >
                                    <Text
                                        color={
                                            !Math.round(profit)
                                                ? undefined
                                                : profit > 0
                                                ? 'positive'
                                                : 'danger'
                                        }
                                    >
                                        {`${new Intl.NumberFormat('ru-RU').format(
                                            Math.round(profit),
                                        )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                            Math.round(rentabelnost),
                                        )}%`}
                                    </Text>
                                    {warningArtIcon()}
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            },
            sortFunction: (a, b, order) => {
                const profitsDataA = a?.profit;
                const profitsDataB = b?.profit;

                const isNaNa = isNaN(profitsDataA);
                const isNaNb = isNaN(profitsDataB);
                if (isNaNa && isNaNb) return 1;
                else if (isNaNa) return 1;
                else if (isNaNb) return -1;

                return (profitsDataA - profitsDataB) * order;
            },
        },
        {
            name: 'placements',
            placeholder:
                'Позиция' +
                (placementsDisplayPhrase != '' && currentParsingProgress[placementsDisplayPhrase]
                    ? ` / Проверка: ${
                          currentParsingProgress[placementsDisplayPhrase].progress / 100
                      } стр.`
                    : ''),
            width: placementsDisplayPhrase != '' ? '15vw' : undefined,
            sortFunction: (a, b, order) => {
                const dataA = a?.placements;
                const dataB = b?.placements;

                // console.log(dataA, dataB);

                const isNaNa = isNaN(dataA);
                const isNaNb = isNaN(dataB);
                if (isNaNa && isNaNb) return 1;
                else if (isNaNa) return 1;
                else if (isNaNb) return -1;

                return (dataA - dataB) * order;
            },
            additionalNodes: [
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Button
                        style={{
                            marginLeft: 5,
                            display: placementsDisplayPhrase != '' ? 'inherit' : 'none',
                        }}
                        view={
                            placementsDisplayPhrase != '' &&
                            selectedSearchPhrase == placementsDisplayPhrase
                                ? 'outlined-success'
                                : 'outlined'
                        }
                        onClick={(event) => {
                            event.stopPropagation();
                            const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                            const params = {
                                uid: getUid(),
                                campaignName: selectValue[0],
                                data: {
                                    mode:
                                        selectedSearchPhrase == placementsDisplayPhrase
                                            ? 'Удалить'
                                            : 'Установить',
                                    advertsIds: {},
                                },
                            };
                            for (const [id, advertData] of Object.entries(uniqueAdverts)) {
                                if (!id || !advertData) continue;
                                const {advertId} = advertData as any;
                                params.data.advertsIds[advertId] = {};
                                params.data.advertsIds[advertId].phrase = placementsDisplayPhrase;

                                setSelectedSearchPhrase(
                                    selectedSearchPhrase == placementsDisplayPhrase
                                        ? ''
                                        : placementsDisplayPhrase,
                                );

                                if (selectedSearchPhrase == placementsDisplayPhrase) {
                                    delete doc.advertsSelectedPhrases[selectValue[0]][advertId];
                                } else {
                                    doc.advertsSelectedPhrases[selectValue[0]][advertId] = {
                                        phrase: placementsDisplayPhrase,
                                    };
                                }
                            }
                            console.log(params);
                            setChangedDoc({...doc});
                            callApi('updateAdvertsSelectedPhrases', params);
                        }}
                    >
                        <Icon size={12} data={ArrowShapeUp} />
                    </Button>
                    <Button
                        disabled={
                            currentParsingProgress[placementsDisplayPhrase] &&
                            currentParsingProgress[placementsDisplayPhrase].isParsing
                        }
                        style={{
                            marginLeft: 5,
                            display: placementsDisplayPhrase != '' ? 'inherit' : 'none',
                        }}
                        view="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            delete doc.fetchedPlacements[placementsDisplayPhrase];
                            delete currentParsingProgress[placementsDisplayPhrase];

                            parseFirst10Pages(
                                placementsDisplayPhrase,
                                setFetchedPlacements,
                                setCurrentParsingProgress,
                                100,
                                placementsDisplayPhrase != '' &&
                                    currentParsingProgress[placementsDisplayPhrase]
                                    ? currentParsingProgress[placementsDisplayPhrase].progress / 100
                                    : 0,
                            );

                            for (let i = 0; i < 9; i++) {
                                parseFirst10Pages(
                                    'тестовая фраза',
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                    100,
                                );
                            }

                            setChangedDoc({...doc});
                        }}
                    >
                        <Icon size={12} data={ArrowRotateLeft} />
                    </Button>
                    <Button
                        loading={
                            currentParsingProgress[placementsDisplayPhrase] &&
                            currentParsingProgress[placementsDisplayPhrase].isParsing
                        }
                        style={{
                            marginLeft: 5,
                            display: placementsDisplayPhrase != '' ? 'inherit' : 'none',
                        }}
                        view="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            parseFirst10Pages(
                                placementsDisplayPhrase,
                                setFetchedPlacements,
                                setCurrentParsingProgress,
                                100,
                                placementsDisplayPhrase != '' &&
                                    currentParsingProgress[placementsDisplayPhrase]
                                    ? currentParsingProgress[placementsDisplayPhrase].progress / 100
                                    : 0,
                                doc.fetchedPlacements[placementsDisplayPhrase],
                                currentParsingProgress[placementsDisplayPhrase],
                            );

                            for (let i = 0; i < 5; i++) {
                                parseFirst10Pages(
                                    'тестовая фраза',
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                    100,
                                );
                            }
                        }}
                    >
                        <Icon size={12} data={LayoutHeader} />
                    </Button>
                    {currentParsingProgress[placementsDisplayPhrase] &&
                    currentParsingProgress[placementsDisplayPhrase].isParsing ? (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{width: 5}} />
                            <Spin size="s" />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>,
            ],
            render: ({value, row}) => {
                if (placementsDisplayPhrase != '') {
                    const phrase = placementsDisplayPhrase;
                    const {nmId} = row;
                    const {log, index} = doc.fetchedPlacements[phrase]
                        ? doc.fetchedPlacements[phrase].data?.[nmId] ?? ({} as any)
                        : ({} as any);
                    const {updateTime} = doc.fetchedPlacements[phrase] ?? ({} as any);
                    const updateTimeObj = new Date(updateTime);
                    // console.log(phrase, doc.fetchedPlacements[phrase], doc.fetchedPlacements, doc);

                    if (!index || index == -1) return undefined;
                    const {position} = log ?? {};

                    return (
                        <Card
                            view="clear"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: 96,
                                width: 'max',
                            }}
                        >
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                {position !== undefined ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text color="secondary">{`${position + 1}`}</Text>
                                        <div style={{minWidth: 3}} />
                                        <Icon data={ArrowRight} size={13}></Icon>
                                        <div style={{minWidth: 3}} />
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <Text>{`${!index || index == -1 ? 'Нет в выдаче' : index} `}</Text>
                                <div style={{width: 4}} />
                            </div>
                            <Text>{`${updateTimeObj.toLocaleString('ru-RU')}`}</Text>
                        </Card>
                    );
                }

                if (!value) return undefined;
                const {drrAI, placementsValue, adverts} = row;

                if (!placementsValue) return undefined;
                const {updateTime, index, phrase, log, cpmIndex} = placementsValue;
                const {placementsRange} = drrAI ?? {};
                if (phrase == '') return undefined;

                const {position, advertsType} = log ?? {};

                const findFirstActive = (adverts) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const fistActiveAdvert = findFirstActive(adverts);

                const mapAuctionsTypes = {
                    Выдача: 'firstPage',
                    'Аукцион Авто': 'auto',
                    'Аукцион Поиска': 'search',
                };

                const auction =
                    doc?.placementsAuctions?.[selectValue[0]]?.[phrase]?.[
                        mapAuctionsTypes[auctionSelectedOption]
                    ] ?? [];

                const updateTimeObj = new Date(updateTime);
                const moreThatHour =
                    new Date().getTime() / 1000 / 3600 - updateTimeObj.getTime() / 1000 / 3600 > 1;

                const {advertId} = fistActiveAdvert ?? {};

                // console.log(
                //     advertId,
                //     doc.advertsSelectedPhrases[selectValue[0]][advertId]
                //         ? doc.advertsSelectedPhrases[selectValue[0]][advertId].phrase == phrase
                //         : false,
                //     phrase,
                // );

                const isSelectedPhrase =
                    doc?.advertsSelectedPhrases?.[selectValue[0]]?.[advertId]?.phrase == phrase;

                return (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {position !== undefined ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {advertsType ? (
                                        <Text
                                            color="secondary"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Icon
                                                data={advertsType == 'auto' ? Rocket : Magnifier}
                                                size={13}
                                            />
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                    <div style={{minWidth: advertsType ? 3 : 0}} />
                                    <Text color="secondary">{`${position + 1}`}</Text>
                                    <div style={{width: 3}} />
                                    <Icon data={ArrowRight} size={13}></Icon>
                                    <div style={{width: 3}} />
                                </div>
                            ) : (
                                <></>
                            )}

                            <Text
                                color={
                                    index != -1
                                        ? placementsRange &&
                                          placementsRange.from != 0 &&
                                          placementsRange.to != 0
                                            ? Math.abs(placementsRange.from - index) < 5 &&
                                              Math.abs(placementsRange.to - index) < 5
                                                ? placementsRange.from == index &&
                                                  placementsRange.from == index
                                                    ? 'positive'
                                                    : 'warning'
                                                : 'primary'
                                            : 'primary'
                                        : 'danger'
                                }
                            >{`${
                                !index || index == -1
                                    ? 'Нет в выдаче'
                                    : index + (!cpmIndex || cpmIndex == -1 ? '' : ` (${cpmIndex})`)
                            } `}</Text>
                            <div style={{width: 4}} />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Popover
                                placement={'bottom-start'}
                                content={
                                    <Card
                                        view="clear"
                                        style={{
                                            height: 20,
                                            overflow: 'auto',
                                            display: 'flex',
                                        }}
                                    >
                                        <Card
                                            view="clear"
                                            style={{
                                                position: 'absolute',
                                                maxHeight: '30em',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                top: -10,
                                                left: -10,
                                            }}
                                        >
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <Card
                                                    // theme="warning"
                                                    style={{
                                                        height: 'fit-content',
                                                        width: 'fit-content',
                                                        boxShadow:
                                                            'var(--g-color-base-background) 0px 2px 8px',
                                                    }}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                'var(--yc-color-base-background)',
                                                            overflow: 'auto',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            padding: 5,
                                                        }}
                                                    >
                                                        <RadioButton
                                                            value={auctionSelectedOption}
                                                            options={auctionOptions}
                                                            onUpdate={(value) => {
                                                                setAuctionSelectedOption(value);
                                                            }}
                                                        />
                                                    </Card>
                                                </Card>
                                                <div style={{minHeight: 12}} />
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row'}}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                'var(--yc-color-base-background)',
                                                            maxWidth: '80em',
                                                            maxHeight: '30em',
                                                            height: 'fit-content',
                                                            overflow: 'auto',
                                                            boxShadow:
                                                                'var(--g-color-base-background) 0px 2px 8px',
                                                        }}
                                                    >
                                                        <Card
                                                            style={{
                                                                background:
                                                                    'var(--g-color-base-background)',
                                                            }}
                                                        >
                                                            <DataTable
                                                                settings={{
                                                                    displayIndices: false,
                                                                    stickyHead: MOVING,
                                                                    stickyFooter: MOVING,
                                                                    highlightRows: true,
                                                                }}
                                                                footerData={[
                                                                    {
                                                                        cpm: `${auctionSelectedOption}, ${
                                                                            auction
                                                                                ? auction.length
                                                                                : 0
                                                                        } шт.`,
                                                                    },
                                                                ]}
                                                                theme="yandex-cloud"
                                                                onRowClick={(row, index, event) => {
                                                                    console.log(row, index, event);
                                                                }}
                                                                rowClassName={(
                                                                    _row,
                                                                    index,
                                                                    isFooterData,
                                                                ) =>
                                                                    isFooterData
                                                                        ? b('tableRow_footer')
                                                                        : b('tableRow_' + index)
                                                                }
                                                                columns={columnDataAuction}
                                                                data={auction}
                                                            />
                                                        </Card>
                                                    </Card>
                                                </div>
                                            </div>
                                        </Card>
                                    </Card>
                                }
                            >
                                <Text variant="subheader-1">{phrase}</Text>
                            </Popover>
                            <div style={{minWidth: 8}} />
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Button
                                    size="xs"
                                    view="outlined"
                                    href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${phrase}`}
                                    target="_blank"
                                >
                                    <Icon data={Magnifier} />
                                </Button>
                                <div style={{minWidth: 4}} />
                                <Button
                                    size="xs"
                                    view={isSelectedPhrase ? 'outlined-success' : 'outlined'}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        if (
                                            !doc['advertsSelectedPhrases'][selectValue[0]][advertId]
                                        )
                                            doc['advertsSelectedPhrases'][selectValue[0]][
                                                advertId
                                            ] = {
                                                phrase: '',
                                            };

                                        if (isSelectedPhrase) {
                                            doc['advertsSelectedPhrases'][selectValue[0]][
                                                advertId
                                            ] = undefined;
                                        } else {
                                            doc['advertsSelectedPhrases'][selectValue[0]][
                                                advertId
                                            ].phrase = phrase;
                                        }

                                        setChangedDoc({...doc});

                                        const params = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            data: {
                                                mode: isSelectedPhrase ? 'Удалить' : 'Установить',
                                                advertsIds: {},
                                            },
                                        };
                                        params.data.advertsIds[advertId] = {};
                                        params.data.advertsIds[advertId].phrase = phrase;
                                        console.log(params);

                                        callApi('updateAdvertsSelectedPhrases', params);
                                    }}
                                >
                                    <Icon data={ArrowShapeUp} />
                                </Button>
                            </div>
                        </div>
                        <Text
                            color={moreThatHour ? 'danger' : 'primary'}
                        >{`${updateTimeObj.toLocaleString('ru-RU')}`}</Text>
                        <Text>
                            {placementsRange
                                ? placementsRange.from != 0 && placementsRange.to != 0
                                    ? `Целевая позиция: ${placementsRange.from}`
                                    : 'Ставки по ДРР'
                                : ''}
                        </Text>
                    </div>
                );
            },
            group: true,
        },
        {
            name: 'stocks',
            placeholder: 'Остаток',
            group: true,
            render: ({value}) => {
                // const {advertsStocksThreshold} = row;

                // if (!advertsStocksThreshold) return value;
                // const {stocksThreshold} = advertsStocksThreshold ?? {};

                // if (!stocksThreshold) return value;
                return (
                    <div>
                        <Text>{`${value}`}</Text>
                    </div>
                );
            },
        },
        {
            name: 'dsi',
            placeholder: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: 8,
                    }}
                >
                    <Text variant="subheader-1">Обор.</Text>
                    <HelpPopover
                        size="l"
                        content="Показывает через сколько дней закончится текущий остаток с учетом средней скорости заказов в день за выбранные период в календаре"
                    />
                </div>
            ),
        },
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'orders', placeholder: 'Заказы, шт.'},
        {name: 'sum_orders', placeholder: 'Заказы, ₽'},
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: ({value, row}) => {
                const findMinDrr = (adverts) => {
                    let minDrr = 0;
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if (![9, 11].includes(advert?.status)) continue;
                        const drrAI = doc?.advertsAutoBidsRules[selectValue[0]]?.[advert?.advertId];
                        const {desiredDRR, useManualMaxCpm, autoBidsMode} = drrAI ?? {};

                        if (useManualMaxCpm && !['drr', 'cpo'].includes(autoBidsMode)) continue;
                        if (desiredDRR > minDrr) minDrr = desiredDRR;
                    }
                    return minDrr;
                };
                const {adverts} = row;
                const minDrr = findMinDrr(adverts);

                return (
                    <Text
                        color={
                            minDrr
                                ? value <= minDrr
                                    ? value == 0
                                        ? 'primary'
                                        : 'positive'
                                    : value / minDrr - 1 < 0.5
                                    ? 'warning'
                                    : 'danger'
                                : 'primary'
                        }
                    >
                        {value}%
                    </Text>
                );
            },
        },
        {name: 'romi', placeholder: 'ROMI, %', render: renderAsPercent},
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value, row}) => {
                const findFirstActive = (adverts) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const {adverts} = row;
                const fistActiveAdvert = findFirstActive(adverts);

                const drrAI =
                    doc?.advertsAutoBidsRules?.[selectValue[0]]?.[fistActiveAdvert?.advertId];
                const {desiredDRR, autoBidsMode} = drrAI ?? {};

                return (
                    <Text
                        color={
                            desiredDRR
                                ? autoBidsMode == 'cpo'
                                    ? value <= desiredDRR
                                        ? value == 0
                                            ? 'primary'
                                            : 'positive'
                                        : value / desiredDRR - 1 < 0.5
                                        ? 'warning'
                                        : 'danger'
                                    : 'primary'
                                : 'primary'
                        }
                    >
                        {value}
                    </Text>
                );
            },
        },
        {name: 'views', placeholder: 'Показы, шт.'},
        {
            name: 'clicks',
            placeholder: 'Клики, шт.',
            render: (args) => renderSlashPercent(args, 'openCardCount'),
        },
        {name: 'ctr', placeholder: 'CTR, %', render: renderAsPercent},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'openCardCount', placeholder: 'Всего переходов, шт.'},
        {name: 'cr', placeholder: 'CR, %', render: renderAsPercent},
        {name: 'addToCartPercent', placeholder: 'CR в корзину, %', render: renderAsPercent},
        {name: 'cartToOrderPercent', placeholder: 'CR в заказ, %', render: renderAsPercent},
        {name: 'addToCartCount', placeholder: 'Корзины, шт.'},
        {name: 'cpl', placeholder: 'CPL, ₽'},
    ];

    const [filteredSummary, setFilteredSummary] = useState({
        art: '',
        uniqueImtIds: 0,
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        analytics: 0,
        stocks: 0,
        sum_orders: 0,
        romi: 0,
        adverts: 0,
        semantics: null,
    });

    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [sort, setSort] = React.useState<any[]>([{column: 'Расход', order: 'asc'}]);
    // const [doc, setUserDoc] = React.useState(getUserDoc());

    const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    useEffect(() => {
        if (!selectValue) return;
        if (!selectValue[0] || selectValue[0] == '') return;

        // Cancel the previous request if it exists
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('Operation canceled due to new request.');
        }

        // Create a new cancel token
        cancelTokenRef.current = axios.CancelToken.source();

        if (doc) setSwitchingCampaignsFlag(true);
        const params = {
            uid: getUid(),
            dateRange: {from: '2023', to: '2024'},
            campaignName: selectValue[0],
        };
        console.log(params);

        callApi(`getMassAdvertsNew`, params, true)
            .then(async (res) => {
                console.log(res);
                if (!res) return;
                const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
                    seller_id: sellerId,
                });
                const advertsSchedules = await ApiClient.post('massAdvert/get-schedules', {
                    seller_id: sellerId,
                });
                const resData = res['data'];

                console.log('advertsAutoBidsRules', advertsAutoBidsRules);

                resData['advertsAutoBidsRules'][selectValue[0]] = advertsAutoBidsRules?.data;
                resData['advertsSchedules'][selectValue[0]] = advertsSchedules?.data;
                setChangedDoc(resData);
                setSwitchingCampaignsFlag(false);
                // recalc(dateRange, selectValue[0], filters, resData);
                console.log(resData);
            })
            .catch(() => {
                setSwitchingCampaignsFlag(false);
            });

        setCopiedAdvertsSettings({advertId: 0});

        // Cleanup function to cancel the request on component unmount or before the next useEffect call
        return () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Component unmounted or selectValue changed.');
            }
        };
    }, [selectValue]);

    const getBidderRules = async () => {
        if (!doc) return;
        const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
            seller_id: sellerId,
        });
        doc.advertsAutoBidsRules[selectValue[0]] = advertsAutoBidsRules?.data;
        setChangedDoc({...doc});
    };

    useEffect(() => {
        getBidderRules();
    }, [advertBudgetRules]);

    useEffect(() => {
        if (!selectValue[0]) return;

        callApi('getAvailableAutoSaleNmIds', {
            seller_id: sellerId,
        })
            .then((res) => {
                if (!res) throw 'no response';
                const nmIds = res['data'] ?? {};
                setAvailableAutoSalesNmIds(nmIds ?? []);
            })
            .catch((e) => {
                console.log(e);
            });

        setRefetchAutoSales(false);
        setDzhemRefetch(false);
    }, [selectValue, refetchAutoSales, dzhemRefetch]);

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(changedDoc, changedDocUpdateType, selectValue[0]);

    const getCampaignName = () => {
        return selectValue[0];
    };
    const updateTheData = async () => {
        console.log('YOOO UPDATE INCOMING');
        setFetchingDataFromServerFlag(true);
        const params = {
            uid: getUid(),
            dateRange: {from: '2023', to: '2024'},
            campaignName: getCampaignName(),
        };
        console.log(params);

        await callApi('getMassAdvertsNew', params, true)
            .then(async (response) => {
                setFetchingDataFromServerFlag(false);
                // console.log(response);
                if (!response) return;
                const resData = response['data'];

                const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
                    seller_id: sellerId,
                });
                const advertsSchedules = await ApiClient.post('massAdvert/get-schedules', {
                    seller_id: sellerId,
                });
                console.log('advertsAutoBidsRules', advertsAutoBidsRules);

                resData['advertsAutoBidsRules'][selectValue[0]] = advertsAutoBidsRules?.data;
                resData['advertsSchedules'][selectValue[0]] = advertsSchedules?.data;

                setChangedDoc(resData);
                setChangedDocUpdateType(true);
                // console.log(response ? response['data'] : undefined);
            })
            .catch((error) => console.error(error));
    };
    // useEffect(() => {
    //     const interval = setInterval(updateTheData, 1 * 60 * 1000);

    //     return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // }, []);

    if (fetchedPlacements) {
        for (const [phrase, phraseData] of Object.entries(fetchedPlacements)) {
            if (!phrase || !phraseData) continue;
            const {data, updateTime, cpms} = phraseData as any;
            if (!data || !updateTime) continue;
            if (!Object.keys(data).length) continue;
            if (!doc.fetchedPlacements[phrase]) doc.fetchedPlacements[phrase] = {};
            if (
                !doc.fetchedPlacements[phrase]['data'] ||
                (doc.fetchedPlacements[phrase]['updateTime'] &&
                    new Date(doc.fetchedPlacements[phrase]['updateTime']).getTime() / 1000 / 60 > 2)
            ) {
                doc.fetchedPlacements[phrase]['data'] = {};
                doc.fetchedPlacements[phrase]['cpms'] = {};
            }
            doc.fetchedPlacements[phrase]['updateTime'] = updateTime;
            Object.assign(doc.fetchedPlacements[phrase]['data'], data);
            Object.assign(doc.fetchedPlacements[phrase]['cpms'], cpms);
        }

        console.log(doc);
        setChangedDoc({...doc});

        setFetchedPlacements(undefined);
    }

    // const doc = {};
    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    // const monthAgo = new Date(today);
    // monthAgo.setDate(monthAgo.getDate() - 30);

    const [dateRange, setDateRange] = useState([today, today]);
    const anchorRef = useRef(null);

    // console.log(doc);
    // const lbdDate: DateTime =;
    // lbdDate.subtract(90, 'day');
    // setLbd(new Date());

    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        drr_orders: 0,
        drr_sales: 0,
        drr: '',
        orders: 0,
        sales: 0,
        sum_orders: 0,
        sum_sales: 0,
        addToCartCount: 0,
        profit: '',
        rent: '',
        profitTemp: 0,
    });

    const getRoundValue = (a, b, isPercentage = false, def = 0) => {
        let result = b ? a / b : def;
        if (isPercentage) {
            result = Math.round(result * 100 * 100) / 100;
        } else {
            result = Math.round(result);
        }
        return result;
    };
    const recalc = (
        daterng,
        selected = '',
        withfFilters = {},
        campaignData_ = undefined as any,
    ) => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysBetween =
            Math.abs(
                startDate.getTime() -
                    (today.getTime() > endDate.getTime() ? endDate.getTime() : today.getTime()),
            ) /
            1000 /
            86400;

        const summaryTemp = {
            views: 0,
            clicks: 0,
            sum: 0,
            drr_orders: 0,
            drr_sales: 0,
            drr: '',
            orders: 0,
            sales: 0,
            sum_orders: 0,
            sum_sales: 0,
            addToCartCount: 0,
            profit: '',
            rent: '',
            profitTemp: 0,
        };

        const _selectedCampaignName = selected == '' ? selectValue[0] : selected;
        let campaignData = doc;
        if (campaignData_) campaignData = campaignData_;
        if (
            !(
                campaignData &&
                campaignData?.campaigns &&
                campaignData?.campaigns[_selectedCampaignName] &&
                campaignData?.adverts &&
                campaignData?.adverts[_selectedCampaignName]
            )
        )
            return;

        const temp = {};
        for (const [art, artData] of Object.entries(
            campaignData.campaigns[_selectedCampaignName],
        )) {
            if (!art || !artData) continue;
            const artInfo = {
                art: '',
                photos: undefined,
                imtId: undefined,
                brand: '',
                object: '',
                nmId: 0,
                title: '',
                adverts: 0,
                stocks: 0,
                dsi: 0,
                stocksBySizes: {},
                profitLog: {},
                advertsManagerRules: undefined,
                tags: [] as any[],
                advertsStocksThreshold: undefined,
                placements: undefined,
                placementsValue: undefined,
                drrAI: {},
                expectedBuyoutsPersent: 0,
                plusPhrasesTemplate: undefined,
                advertsSelectedPhrases: {},
                semantics: {},
                budget: {},
                bid: {},
                bidLog: {},
                budgetToKeep: {},
                orders: 0,
                sum_orders: 0,
                sum: 0,
                views: 0,
                clicks: 0,
                drr: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                cr: 0,
                cpo: 0,
                analytics: 0,
                rentabelnost: 0,
                profit: 0,
                sales: 0,
                sum_sales: 0,
                openCardCount: 0,
                romi: 0,
                addToCartPercent: 0,
                addToCartCount: 0,
                cartToOrderPercent: 0,
                cpl: 0,
            };

            artInfo.art = artData['art'];
            artInfo.photos = artData['photos'];
            artInfo.imtId = artData['imtId'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.tags = artData['tags'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];

            artInfo.stocksBySizes = artData['stocksBySizes'];
            artInfo.adverts = artData['adverts'];
            artInfo.advertsManagerRules = artData['advertsManagerRules'];
            artInfo.profitLog = artData['profitLog'];
            artInfo.advertsStocksThreshold = artData['advertsStocksThreshold'];
            artInfo.placementsValue = artData['placements'];
            artInfo.expectedBuyoutsPersent = artData['expectedBuyoutsPersent'];
            artInfo.plusPhrasesTemplate = artData['plusPhrasesTemplate'];
            artInfo.placements = artData['placements'] ? artData['placements'].index : undefined;

            // console.log(artInfo);

            if (artInfo.adverts) {
                for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
                    if (!advertType || advertType == 'none' || !advertsOfType) continue;

                    for (const [advertId, _] of Object.entries(advertsOfType)) {
                        if (!advertId) continue;
                        const advertData = campaignData.adverts[_selectedCampaignName][advertId];
                        if (!advertData) continue;
                        const status = advertData['status'];
                        if (![4, 9, 11].includes(status)) continue;

                        artInfo.budget[advertId] = advertData['budget'];

                        artInfo.bid[advertId] = advertData['cpm'];

                        artInfo.semantics[advertId] = advertData['words'];

                        artInfo.drrAI[advertId] =
                            campaignData.advertsAutoBidsRules[_selectedCampaignName][advertId];
                        artInfo.advertsSelectedPhrases[advertId] =
                            campaignData.advertsSelectedPhrases[_selectedCampaignName][advertId];
                        artInfo.bidLog[advertId] = advertData['bidLog'];
                    }
                }
            }
            if (artData['advertsStats']) {
                for (const [strDate, dateData] of Object.entries(artData['advertsStats'])) {
                    if (strDate == 'updateTime' || !dateData) continue;

                    if (!dateData) continue;
                    const date = new Date(strDate);
                    date.setHours(0, 0, 0, 0);
                    if (date < startDate || date > endDate) continue;

                    artInfo.sum_orders += dateData['sum_orders'];
                    artInfo.orders += dateData['orders'];

                    artInfo.sum_sales += dateData['sum_sales'];
                    artInfo.sales += dateData['sales'];
                    artInfo.sum += dateData['sum'];
                    artInfo.views += dateData['views'];
                    artInfo.clicks += dateData['clicks'];
                    artInfo.profit += dateData['profit'];
                    artInfo.rentabelnost = getRoundValue(
                        artInfo['profit'],
                        artInfo['sum_orders'],
                        true,
                    );
                    artInfo.analytics += artInfo.rentabelnost;

                    // console.log(
                    //     artData['nmFullDetailReport']
                    //         ? artData['nmFullDetailReport'].statistics
                    //         : undefined,
                    //     strDate,
                    //     artData['nmFullDetailReport']
                    //         ? artData['nmFullDetailReport'].statistics
                    //             ? artData['nmFullDetailReport'].statistics[strDate]
                    //             : undefined
                    //         : undefined,
                    // );

                    const {openCardCount, addToCartCount} = artData['nmFullDetailReport']
                        ? artData['nmFullDetailReport'].statistics[strDate] ?? {
                              openCardCount: 0,
                              addToCartCount: 0,
                          }
                        : {
                              openCardCount: 0,
                              addToCartCount: 0,
                          };

                    artInfo.openCardCount += openCardCount ?? 0;
                    artInfo.addToCartCount += addToCartCount ?? 0;
                }
                artInfo.openCardCount = Math.round(artInfo.openCardCount);

                artInfo.addToCartPercent = getRoundValue(
                    artInfo.addToCartCount,
                    artInfo.openCardCount,
                    true,
                );
                artInfo.cartToOrderPercent = getRoundValue(
                    artInfo.orders,
                    artInfo.addToCartCount,
                    true,
                );

                artInfo.sum_orders = Math.round(artInfo.sum_orders);
                artInfo.orders = Math.round(artInfo.orders);
                artInfo.sum_sales = Math.round(artInfo.sum_sales);
                artInfo.sales = Math.round(artInfo.sales * 100) / 100;
                artInfo.sum = Math.round(artInfo.sum);
                artInfo.views = Math.round(artInfo.views);
                artInfo.clicks = Math.round(artInfo.clicks);

                artInfo.dsi = getRoundValue(artInfo.stocks, artInfo.orders / (daysBetween + 1));

                artInfo.drr = getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1);
                artInfo.ctr = getRoundValue(artInfo.clicks, artInfo.views, true);
                artInfo.cpc = getRoundValue(
                    artInfo.sum / 100,
                    artInfo.clicks,
                    true,
                    artInfo.sum / 100,
                );
                artInfo.cpm = getRoundValue(artInfo.sum * 1000, artInfo.views);
                artInfo.cr = getRoundValue(artInfo.orders, artInfo.openCardCount, true);
                artInfo.cpo = getRoundValue(artInfo.sum, artInfo.orders, false, artInfo.sum);
                artInfo.cpl = getRoundValue(
                    artInfo.sum,
                    artInfo.addToCartCount,
                    false,
                    artInfo.sum,
                );
                artInfo.romi = getRoundValue(artInfo.profit, artInfo.sum, true);

                summaryTemp.sales += artInfo.sales;
                summaryTemp.sum_sales += artInfo.sum_sales;
                summaryTemp.sum_orders += artInfo.sum_orders;
                summaryTemp.sum += artInfo.sum;
                summaryTemp.views += artInfo.views;
                summaryTemp.clicks += artInfo.clicks;
                summaryTemp.addToCartCount += artInfo.addToCartCount;
                summaryTemp.orders += artInfo.orders;

                summaryTemp.profitTemp += Math.round(artInfo.profit);
            }

            temp[art] = artInfo;
        }

        summaryTemp.addToCartCount = Math.round(summaryTemp.addToCartCount);
        summaryTemp.orders = Math.round(summaryTemp.orders);
        summaryTemp.sales = Math.round(summaryTemp.sales);
        summaryTemp.sum_orders = Math.round(summaryTemp.sum_orders);
        summaryTemp.sum_sales = Math.round(summaryTemp.sum_sales);
        summaryTemp.drr_orders = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
        summaryTemp.drr_sales = getRoundValue(summaryTemp.sum, summaryTemp.sum_sales, true, 1);

        summaryTemp.profit = `${new Intl.NumberFormat('ru-RU').format(summaryTemp.profitTemp)} ₽`;
        summaryTemp.rent = `${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_orders, true),
        )}% / ${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_sales, true),
        )}%`;

        summaryTemp.drr = `${new Intl.NumberFormat('ru-RU').format(
            summaryTemp.drr_orders,
        )}% / ${new Intl.NumberFormat('ru-RU').format(summaryTemp.drr_sales)}%`;

        setSummary(summaryTemp);

        setTableData(temp);

        filterTableData(withfFilters, temp, undefined, daterng);
    };

    useEffect(() => {
        recalc(dateRange);
    }, [filtersRK]);

    const getBalanceYagrData = () => {
        const balanceLog =
            doc.balances && doc.balances[selectValue[0]]
                ? doc.balances[selectValue[0]]?.data ?? {}
                : {};
        // console.log(balanceLog);

        const timelineBudget: any[] = [];
        const graphsDataBonus: any[] = [];
        const graphsDataBalance: any[] = [];
        const graphsDataNet: any[] = [];
        // const graphsDataBudgetsDiv: any[] = [];
        // const graphsDataBudgetsDivHours = {};
        if (balanceLog) {
            for (let i = 0; i < balanceLog.length; i++) {
                const time = balanceLog[i].time;
                const balanceData = balanceLog[i].balance;
                if (!time || !balanceData) continue;

                const {net, balance, bonus} = balanceData;

                const timeObj = new Date(time);

                timeObj.setMinutes(Math.floor(timeObj.getMinutes() / 15) * 15);

                const lbd = new Date(dateRange[0]);
                lbd.setHours(0, 0, 0, 0);
                const rbd = new Date(dateRange[1]);
                rbd.setHours(23, 59, 59);
                if (timeObj < lbd || timeObj > rbd) continue;
                timelineBudget.push(timeObj.getTime());
                graphsDataBalance.push(balance ?? 0);
                graphsDataBonus.push(bonus ?? 0);
                graphsDataNet.push(net ?? 0);

                // const hour = time.slice(0, 13);
                // if (!graphsDataBudgetsDivHours[hour]) graphsDataBudgetsDivHours[hour] = budget;
            }
            // let prevHour = '';
            // for (let i = 0; i < timelineBudget.length; i++) {
            //     const dateObj = new Date(timelineBudget[i]);
            //     const time = dateObj.toISOString();
            //     if (dateObj.getMinutes() != 0) {
            //         graphsDataBudgetsDiv.push(null);
            //         continue;
            //     }
            //     const hour = time.slice(0, 13);
            //     if (prevHour == '') {
            //         graphsDataBudgetsDiv.push(null);
            //         prevHour = hour;
            //         continue;
            //     }

            //     const spent = graphsDataBudgetsDivHours[prevHour] - graphsDataBudgetsDivHours[hour];
            //     graphsDataBudgetsDiv.push(spent);

            //     prevHour = hour;
            // }
        }

        const yagrBalanceData: YagrWidgetData = {
            data: {
                timeline: timelineBudget,
                graphs: [
                    {
                        id: '0',
                        name: 'Баланс',
                        scale: 'y',
                        color: '#ffbe5c',
                        data: graphsDataNet,
                    },
                    {
                        id: '1',
                        name: 'Бонусы',
                        scale: 'y',
                        color: '#4aa1f2',
                        data: graphsDataBonus,
                    },
                    {
                        id: '2',
                        name: 'Счет',
                        scale: 'y',
                        color: '#5fb8a5',
                        data: graphsDataBalance,
                    },
                ],
            },

            libraryConfig: {
                chart: {
                    series: {
                        spanGaps: false,
                        type: 'line',
                        interpolation: 'smooth',
                    },
                },
                axes: {
                    y: {
                        label: 'Баланс',
                        precision: 'auto',
                        show: true,
                    },
                    // r: {
                    //     label: 'Бонусы',
                    //     precision: 'auto',
                    //     side: 'right',
                    //     show: true,
                    // },
                    // l: {
                    //     label: 'Счет',
                    //     precision: 'auto',
                    //     side: 'right',
                    //     show: true,
                    // },
                    x: {
                        label: 'Время',
                        precision: 'auto',
                        show: true,
                    },
                },
                series: [],
                scales: {y: {min: 0}},
                title: {
                    text: 'Изменение баланса',
                },
            },
        };

        return yagrBalanceData;
    };

    const filterTableData = (
        withfFilters = {},
        tableData = {},
        _filterAutoSales = undefined as any,
        datering = undefined,
    ) => {
        const [startDate, endDate] = datering ?? dateRange;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysBetween =
            Math.abs(
                startDate.getTime() -
                    (today.getTime() > endDate.getTime() ? endDate.getTime() : today.getTime()),
            ) /
            1000 /
            86400;

        const temp = [] as any;
        const usefilterAutoSales = _filterAutoSales ?? filterAutoSales;
        // console.log(
        //     tableData,
        //     data,
        //     Object.keys(tableData).length ? tableData : data,
        //     withfFilters['undef'] ? withfFilters : filters,
        // );

        for (const [art, artInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!art || !artInfo) continue;

            const tempTypeRow = artInfo;
            tempTypeRow['placements'] =
                artInfo['placements'] == -1 ? 10 * 1000 : artInfo['placements'];

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            if (Object.values(filtersRK).includes(true)) useFilters['filtersRK'] = filtersRK;
            else delete useFilters['filtersRK'];

            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '' && filterArg != 'placements') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (flarg && fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (flarg && fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (usefilterAutoSales && !availableAutoSalesNmIds.includes(tempTypeRow['nmId'])) {
                    addFlag = false;
                    break;
                }

                if (filterArg == 'art') {
                    const rulesForAnd = filterData['val'].split('+');
                    // console.log(rulesForAnd);

                    let wholeText = '';
                    for (const key of ['art', 'title', 'brand', 'nmId', 'imtId', 'object']) {
                        wholeText += tempTypeRow[key] + ' ';
                    }

                    const tags = tempTypeRow['tags'];
                    if (tags) {
                        for (const key of tags) {
                            wholeText += key + ' ';
                        }
                    }

                    let tempFlagInc = 0;
                    for (let k = 0; k < rulesForAnd.length; k++) {
                        const ruleForAdd = rulesForAnd[k];
                        if (ruleForAdd == '') {
                            tempFlagInc++;
                            continue;
                        }
                        if (
                            compare(wholeText, {
                                val: ruleForAdd,
                                compMode: filterData['compMode'],
                            })
                        ) {
                            tempFlagInc++;
                        }
                    }
                    if (tempFlagInc != rulesForAnd.length) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'filtersRK') {
                    const adverts = tempTypeRow['adverts'];

                    let add = false;
                    if (adverts)
                        for (const id of Object.keys(adverts)) {
                            if (
                                filtersRK['bidderRules'] &&
                                !doc?.advertsAutoBidsRules?.[selectValue[0]]?.[id]
                            )
                                add = true;
                            if (filtersRK['budgetRules'] && !advertBudgetRules[id]) add = true;
                            if (
                                filtersRK['phrasesRules'] &&
                                !doc?.advertsPlusPhrasesTemplates?.[selectValue[0]]?.[id]
                            )
                                add = true;
                            if (
                                filtersRK['scheduleRules'] &&
                                !doc?.advertsSchedules?.[selectValue[0]]?.[id]
                            )
                                add = true;
                        }
                    if (!add) addFlag = false;
                } else if (filterArg == 'placements') {
                    if (filterData['val'] == '') {
                        setPlacementsDisplayPhrase('');
                        setSelectedSearchPhrase('');
                        continue;
                    }
                    const temp = isNaN(parseInt(filterData['val']));

                    if (temp) {
                        setPlacementsDisplayPhrase(filterData['val']);
                        if (placementsDisplayPhrase != filterData['val'])
                            setSelectedSearchPhrase('');
                    }
                } else if (filterArg == 'adverts') {
                    const rulesForAnd = [filterData['val']];
                    const adverts = tempTypeRow[filterArg];
                    // console.log(rulesForAnd);
                    let wholeText = '';
                    let wholeTextTypes = '';
                    if (adverts)
                        for (const [id, _] of Object.entries(adverts)) {
                            wholeText += id + ' ';
                            const advertData = doc?.adverts?.[selectValue[0]]?.[id];

                            if (advertData)
                                wholeTextTypes += advertData.type == 8 ? 'авто ' : 'поиск ';
                        }

                    const lwr = String(filterData['val']).toLocaleLowerCase().trim();
                    if (['авто', 'поиск'].includes(lwr)) {
                        if (wholeTextTypes.includes(lwr)) continue;
                    }
                    let tempFlagInc = 0;
                    for (let k = 0; k < rulesForAnd.length; k++) {
                        const ruleForAdd = rulesForAnd[k];
                        if (ruleForAdd == '') {
                            tempFlagInc++;
                            continue;
                        }
                        if (
                            compare(wholeText, {
                                val: ruleForAdd,
                                compMode: filterData['compMode'],
                            })
                        ) {
                            tempFlagInc++;
                        }
                    }
                    if (tempFlagInc != rulesForAnd.length) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'autoSales') {
                    const rentabelnost = getRoundValue(
                        autoSalesProfits[tempTypeRow['art']]?.rentabelnost,
                        1,
                        true,
                    );
                    if (!compare(rentabelnost, filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'semantics') {
                    if (!compare(tempTypeRow['plusPhrasesTemplate'], filterData)) {
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
            }
        }

        temp.sort((a, b) => {
            return a.art.localeCompare(b.art, 'ru-RU');
        });
        const filteredSummaryTemp = {
            art: '',
            orders: 0,
            sum_orders: 0,
            sum: 0,
            views: 0,
            clicks: 0,
            drr: 0,
            ctr: 0,
            analytics: 0,
            profit: 0,
            rentabelnost: 0,
            cpc: 0,
            cpm: 0,
            cr: 0,
            uniqueImtIds: 0,
            stocks: 0,
            dsi: 0,
            cpo: 0,
            cpl: 0,
            adverts: 0,
            semantics: null,
            budget: 0,
            romi: 0,
            openCardCount: 0,
            addToCartPercent: 0,
            addToCartCount: 0,
            cartToOrderPercent: 0,
        };
        const uniqueAdvertsIds: any[] = [];
        const uniqueImtIds: any[] = [];
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            const imtId = row['imtId'];
            if (!uniqueImtIds.includes(imtId)) uniqueImtIds.push(imtId);

            const adverts = row['adverts'];
            if (adverts) {
                for (const id of Object.keys(adverts)) {
                    if (!uniqueAdvertsIds.includes(id)) uniqueAdvertsIds.push(id);
                }
            }
            filteredSummaryTemp.sum_orders += row['sum_orders'];
            filteredSummaryTemp.orders += row['orders'];
            filteredSummaryTemp.stocks += row['stocks'];
            filteredSummaryTemp.sum += row['sum'];
            filteredSummaryTemp.views += row['views'];
            filteredSummaryTemp.clicks += row['clicks'];
            // if (row['art'] == 'страйп/15/16-1406')
            //     console.log(
            //         row['profit'],
            //         filteredSummaryTemp.analytics,
            //         filteredSummaryTemp.analytics + Math.round(row['profit'] ?? 0),
            //     );
            filteredSummaryTemp.profit += Math.round(row['profit'] ?? 0);

            filteredSummaryTemp.budget += row['budget'] ?? 0;
            filteredSummaryTemp.openCardCount += row['openCardCount'];
            filteredSummaryTemp.addToCartCount += row['addToCartCount'];
        }
        filteredSummaryTemp.uniqueImtIds = Math.round(uniqueImtIds.length);

        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        filteredSummaryTemp.stocks = Math.round(filteredSummaryTemp.stocks);
        filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
        filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
        filteredSummaryTemp.adverts = uniqueAdvertsIds.length;

        filteredSummaryTemp.profit = Math.round(filteredSummaryTemp.profit);
        filteredSummaryTemp.rentabelnost = getRoundValue(
            filteredSummaryTemp.profit,
            filteredSummaryTemp.sum_orders,
            true,
        );
        filteredSummaryTemp.analytics = filteredSummaryTemp.rentabelnost;

        filteredSummaryTemp.openCardCount = Math.round(filteredSummaryTemp.openCardCount);
        filteredSummaryTemp.addToCartPercent = getRoundValue(
            filteredSummaryTemp.addToCartCount,
            filteredSummaryTemp.openCardCount,
            true,
        );
        filteredSummaryTemp.cartToOrderPercent = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.addToCartCount,
            true,
        );

        filteredSummaryTemp.drr = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.sum_orders,
            true,
            1,
        );
        filteredSummaryTemp.ctr = getRoundValue(
            filteredSummaryTemp.clicks,
            filteredSummaryTemp.views,
            true,
        );
        filteredSummaryTemp.cpc = getRoundValue(
            filteredSummaryTemp.sum / 100,
            filteredSummaryTemp.clicks,
            true,
            filteredSummaryTemp.sum / 100,
        );
        filteredSummaryTemp.cpm = getRoundValue(
            filteredSummaryTemp.sum * 1000,
            filteredSummaryTemp.views,
        );
        filteredSummaryTemp.cr = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.openCardCount,
            true,
        );
        filteredSummaryTemp.cpo = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.orders,
            false,
            filteredSummaryTemp.sum,
        );
        filteredSummaryTemp.cpl = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.addToCartCount,
            false,
            filteredSummaryTemp.sum,
        );

        filteredSummaryTemp.romi = getRoundValue(
            filteredSummaryTemp.profit,
            filteredSummaryTemp.sum,
            true,
        );

        filteredSummaryTemp.dsi = getRoundValue(
            filteredSummaryTemp.stocks,
            filteredSummaryTemp.orders / (daysBetween + 1),
        );

        setFilteredSummary(filteredSummaryTemp);
        setFilteredData(temp);
    };

    const [fetchingDataFromServerFlag, setFetchingDataFromServerFlag] = React.useState(false);
    const [firstRecalc, setFirstRecalc] = useState(false);

    const [changedColumns, setChangedColumns] = useState<any>(false);

    // const [auctionFilters, setAuctionFilters] = useState({undef: false});
    // const [auctionTableData, setAuctionTableData] = useState<any[]>([]);
    // const [auctionFiltratedTableData, setAuctionFiltratedTableData] = useState<any[]>([]);
    // const filterAuctionData = (withfFilters = {}, tableData = {}) => {};
    const columnDataArtByDayStats = [
        {
            name: 'date',
            placeholder: 'Дата',
            render: ({value}) => {
                if (!value) return;
                if (typeof value === 'number') return `Всего SKU: ${value}`;
                return <Text>{(value as Date).toLocaleDateString('ru-RU').slice(0, 10)}</Text>;
            },
        },
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'orders', placeholder: 'Заказы, шт.'},
        {name: 'sum_orders', placeholder: 'Заказы, ₽'},
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: renderAsPercent,
        },
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
        },
        {name: 'views', placeholder: 'Показы, шт.'},
        {
            name: 'clicks',
            placeholder: 'Клики, шт.',
            render: (args) => renderSlashPercent(args, 'openCardCount'),
        },
        {name: 'ctr', placeholder: 'CTR, %', render: renderAsPercent},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'cr', placeholder: 'CR, %', render: renderAsPercent},
        {name: 'openCardCount', placeholder: 'Всего переходов, шт.'},
        {name: 'addToCartPercent', placeholder: 'CR в корзину, %', render: renderAsPercent},
        {name: 'cartToOrderPercent', placeholder: 'CR в заказ, %', render: renderAsPercent},
        {name: 'addToCartCount', placeholder: 'Корзины, шт.'},
        {name: 'cpl', placeholder: 'CPL, ₽'},
    ];

    const columnDataAuction = [
        {
            header: '#',
            name: 'index',
            sortable: false,
            render: ({index, footer}) => {
                const displayIndex = index + 1;
                return footer ? undefined : (
                    <Button width="max" size="xs" view="flat">
                        {displayIndex}
                    </Button>
                );
            },
        },
        {
            header: 'Ставка',
            name: 'cpm',
            render: ({value, row, footer}) => {
                const {advertsType} = row;
                if (!value) return undefined;
                return footer ? (
                    value
                ) : (
                    <Button size="xs" view="flat">
                        {advertsType ? (
                            <Icon data={advertsType == 'auto' ? Rocket : Magnifier} size={11} />
                        ) : (
                            <></>
                        )}
                        {value as number}
                    </Button>
                );
            },
        },
        {
            header: 'Позиция',
            name: 'promoPosition',
            render: ({value, row}) => {
                if (value === undefined) return;
                const {position} = row;
                const displayIndex = (value as number) + 0;
                return (
                    <Button size="xs" view="flat">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text color="secondary">{`${position + 1}`}</Text>
                            <div style={{width: 3}} />
                            <Icon data={ArrowRight} size={13}></Icon>
                            <div style={{width: 3}} />
                            <Text>{`${displayIndex}`}</Text>
                        </div>
                    </Button>
                );
            },
        },
        {
            header: 'Бренд',
            name: 'brand',
            render: ({value, row}) => {
                if (!value) return undefined;
                const {id} = row;
                return (
                    <Link
                        view="primary"
                        style={{whiteSpace: 'pre-wrap'}}
                        href={`https://www.wildberries.ru/catalog/${id}/detail.aspx?targetUrl=BP`}
                        target="_blank"
                    >
                        <Text variant="subheader-1">{value as string}</Text>
                    </Link>
                );
            },
        },
        {
            header: 'Цена с СПП, ₽',
            name: 'sppPrice',
        },
        {
            header: 'Цена 1 буста, ₽',
            name: 'avgBoostPrice',
        },
        {
            header: 'Акция',
            name: 'promoTextCard',
        },
        // {header: 'Частота, шт', name: 'freq'},
        // {header: 'Частота, шт (пр. пер.)', name: 'freqPrev'},
    ] as Column<any>[];
    // const auctionColumns = generateColumns(
    //     columnDataAuction,
    //     auctionFilters,
    //     setAuctionFilters,
    //     filterAuctionData,
    // );
    // console.log(columnsSemanticsTemplate);

    const balance = (() => {
        const map = {balance: 'Счет', bonus: 'Бонусы', net: 'Баланс'};

        const temp = doc?.balances?.[selectValue[0]]?.data?.slice(-1)?.[0]?.balance;
        const arr = [] as string[];
        if (temp)
            for (const [type, val] of Object.entries(temp)) {
                if (val)
                    arr.push(
                        map[type] + ': ' + new Intl.NumberFormat('ru-RU').format(val as number),
                    );
            }
        return arr.join(' ');
    })();

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc(dateRange, selectValue[0], filters, changedDoc);
    }

    if (changedColumns) {
        setChangedColumns(false);
    }

    if (!doc)
        return isMobile ? (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LogoLoader />
            </div>
        ) : (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-around',
                        margin: '8px 0',
                    }}
                >
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                </div>
                <div
                    style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                    </div>
                </div>
                <div style={{minHeight: 8}} />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: '20vw',
                            height: 48,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: '100%',
                            height: 48,
                        }}
                    />
                </div>
                <div style={{minHeight: 4}} />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: '20vw',
                            height: 'calc(68vh - 96px)',
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: '100%',
                            height: 'calc(68vh - 96px)',
                        }}
                    />
                </div>
                <div style={{minHeight: 4}} />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: '20vw',
                            height: 48,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: '100%',
                            height: 48,
                        }}
                    />
                </div>
            </div>
        );

    if (dateChangeRecalc) {
        setFetchingDataFromServerFlag(true);
        setDateChangeRecalc(false);

        callApi('calcMassAdvertsNew', {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: getNormalDateRange(dateRange),
        }).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['campaigns'][selectValue[0]] = resData['campaigns'][selectValue[0]];
            doc['balances'][selectValue[0]] = resData['balances'][selectValue[0]];
            doc['plusPhrasesTemplates'][selectValue[0]] =
                resData['plusPhrasesTemplates'][selectValue[0]];
            doc['advertsPlusPhrasesTemplates'][selectValue[0]] =
                resData['advertsPlusPhrasesTemplates'][selectValue[0]];
            doc['advertsSelectedPhrases'][selectValue[0]] =
                resData['advertsSelectedPhrases'][selectValue[0]];
            doc['advertsAutoBidsRules'][selectValue[0]] =
                resData['advertsAutoBidsRules'][selectValue[0]];
            doc['adverts'][selectValue[0]] = resData['adverts'][selectValue[0]];
            doc['placementsAuctions'][selectValue[0]] =
                resData['placementsAuctions'][selectValue[0]];
            doc['advertsSchedules'][selectValue[0]] = resData['advertsSchedules'][selectValue[0]];

            setChangedDoc({...doc});

            setDateChangeRecalc(false);
            setFetchingDataFromServerFlag(false);
            console.log(doc);
        });

        setPagesCurrent(1);
    }

    if (!firstRecalc) {
        console.log(doc);

        for (let i = 0; i < columnData.length; i++) {
            const {name, valueType} = columnData[i] ?? {};
            if (!name) continue;
            if (!filters[name])
                filters[name] = {val: '', compMode: valueType != 'text' ? 'bigger' : 'include'};
        }
        setFilters({...filters});

        // recalc(dateRange, selectValue[0]);

        setFirstRecalc(true);
    }

    // if (firstRecalc && !secondRecalcForSticky) {
    //     setSecondRecalcForSticky(true);
    // }
    // const artColumnElements = document.getElementsByClassName('td_fixed_art');
    // if (artColumnElements[0]) {
    //     myObserver.observe(artColumnElements[artColumnElements.length > 1 ? 1 : 0]);
    // }

    const getUniqueAdvertIdsFromThePage = () => {
        const lwr = filters['adverts']
            ? String(filters['adverts']['val']).toLocaleLowerCase().trim()
            : '';

        const uniqueAdverts = {};
        for (let i = 0; i < filteredData.length; i++) {
            const {adverts} = filteredData[i];
            if (!adverts) continue;

            for (const [id, _] of Object.entries(adverts)) {
                if (!id) continue;
                const advertData = doc?.adverts?.[selectValue[0]]?.[id];
                if (!advertData) continue;
                const {advertId, type} = advertData;
                if (!advertId) continue;

                if (lwr == 'авто' && type != 8) continue;
                else if (lwr == 'поиск' && ![6, 9].includes(type)) continue;

                uniqueAdverts[advertId] = {advertId: advertId};
            }
        }
        return uniqueAdverts;
    };

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            {isMobile ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: 16,
                    }}
                >
                    <RangePicker
                        args={{
                            align: 'column',
                            recalc,
                            dateRange,
                            setDateRange,
                            anchorRef,
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around',
                    margin: '8px 0',
                    flexWrap: 'wrap',
                }}
            >
                {generateCard({
                    summary,
                    key: 'sum_orders',
                    placeholder: 'ЗАКАЗЫ',
                    cardStyle,
                    rub: true,
                })}
                {generateCard({
                    summary,
                    key: 'sum_sales',
                    placeholder: 'ПРОДАЖИ',
                    cardStyle,
                    rub: true,
                })}
                {generateCard({
                    summary,
                    key: 'sum',
                    placeholder: 'РАСХОД',
                    cardStyle,
                    rub: true,
                })}
                {generateCard({
                    summary,
                    key: 'drr',
                    placeholder: 'ДРР к ЗАКАЗАМ / к ПРОДАЖАМ',
                    cardStyle,
                    valueType: 'text',
                })}
                {generateCard({
                    summary,
                    key: 'profit',
                    placeholder: 'ПРИБЫЛЬ',
                    cardStyle,
                    valueType: 'text',
                })}
                {generateCard({
                    summary,
                    key: 'rent',
                    placeholder: 'РЕНТ к ЗАКАЗАМ / к ПРОДАЖАМ',
                    cardStyle,
                    valueType: 'text',
                })}
                {generateCard({summary, key: 'views', placeholder: 'ПОКАЗЫ', cardStyle})}
                {generateCard({summary, key: 'clicks', placeholder: 'КЛИКИ', cardStyle})}
                {generateCard({
                    summary,
                    key: 'addToCartCount',
                    cardStyle,
                    placeholder: 'КОРЗИНЫ',
                })}
                {generateCard({
                    summary,
                    key: 'orders',
                    placeholder: 'ЗАКАЗЫ',
                    cardStyle,
                    count: true,
                })}
                {generateCard({
                    summary,
                    key: 'sales',
                    placeholder: 'ПРОДАЖИ',
                    count: true,
                    cardStyle,
                })}
            </div>
            {!isMobile ? (
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
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <AdvertCreateModal
                                sellerId={sellerId}
                                doc={doc}
                                filteredData={filteredData}
                                setChangedDoc={setChangedDoc}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    view="action"
                                    size="l"
                                >
                                    <Icon data={SlidersVertical} />
                                    <Text variant="subheader-1">Создать</Text>
                                </Button>
                            </AdvertCreateModal>
                            <div style={{minWidth: 8}} />
                            <AdvertsStatusManagingModal
                                disabled={permission != 'Управление'}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    view="action"
                                    size="l"
                                    style={{cursor: 'pointer'}}
                                >
                                    <Icon data={Play} />
                                    <Text variant="subheader-1">Управление</Text>
                                </Button>
                            </AdvertsStatusManagingModal>
                            <div style={{minWidth: 8}} />
                            <AdvertsBidsModal
                                disabled={permission != 'Управление'}
                                selectValue={selectValue}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                advertId={undefined}
                            >
                                <Button
                                    view="action"
                                    size="l"
                                    disabled={permission != 'Управление'}
                                >
                                    <Icon data={ChartLine} />
                                    <Text variant="subheader-1">Ставки</Text>
                                </Button>
                            </AdvertsBidsModal>
                            <div style={{minWidth: 8}} />
                            <AdvertsBudgetsModal
                                disabled={permission != 'Управление'}
                                selectValue={selectValue}
                                sellerId={sellerId}
                                advertBudgetsRules={advertBudgetRules}
                                setAdvertBudgetsRules={setAdvertBudgetRules}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                advertId={undefined}
                            >
                                <Button
                                    view="action"
                                    size="l"
                                    disabled={permission != 'Управление'}
                                >
                                    <Icon data={CircleRuble} />
                                    <Text variant="subheader-1">Бюджет</Text>
                                </Button>
                            </AdvertsBudgetsModal>
                            <div style={{minWidth: 8}} />
                            <PhrasesModal
                                disabled={permission != 'Управление'}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                            />
                            <div style={{minWidth: 8}} />
                            <AdvertsSchedulesModal
                                disabled={permission != 'Управление'}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                                advertId={undefined}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    view="action"
                                    size="l"
                                >
                                    <Icon data={Clock} />
                                    <Text variant="subheader-1">График</Text>
                                </Button>
                            </AdvertsSchedulesModal>
                            <div style={{minWidth: 8}} />
                            <TagsFilterModal filterByButton={filterByButton} />
                            <div style={{minWidth: 8}} />
                            <AutoSalesModal
                                disabled={permission != 'Управление'}
                                selectValue={selectValue}
                                filteredData={filteredData}
                                setAutoSalesProfits={setAutoSalesProfits}
                                sellerId={sellerId}
                                openFromParent={autoSalesModalOpenFromParent}
                                setOpenFromParent={setAutoSalesModalOpenFromParent}
                            />
                            <div style={{minWidth: 8}} />
                            <Popover
                                placement={'bottom'}
                                content={
                                    <div
                                        style={{
                                            height: 'calc(30em - 60px)',
                                            width: '60em',
                                            overflow: 'auto',
                                            display: 'flex',
                                        }}
                                    >
                                        <Card
                                            view="outlined"
                                            theme="warning"
                                            style={{
                                                position: 'absolute',
                                                height: '30em',
                                                width: '60em',
                                                overflow: 'auto',
                                                top: -10,
                                                left: -200,
                                                display: 'flex',
                                            }}
                                        >
                                            <ChartKit type="yagr" data={getBalanceYagrData()} />
                                        </Card>
                                    </div>
                                }
                            >
                                <Button view="outlined-success" size="l">
                                    <Text variant="subheader-1">{balance}</Text>
                                </Button>
                            </Popover>
                        </div>
                        <Modal
                            open={advertsArtsListModalFromOpen}
                            onClose={() => {
                                setAdvertsArtsListModalFromOpen(false);
                                setSemanticsModalOpenFromArt('');
                            }}
                        >
                            <div
                                style={{
                                    margin: 20,
                                    width: '30vw',
                                    height: '60vh',
                                    overflow: 'scroll',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        margin: '8px 0',
                                    }}
                                    variant="display-2"
                                >
                                    {rkListMode == 'add'
                                        ? 'Добавить артикул в РК'
                                        : 'Удалить артикул из РК'}
                                </Text>
                                <List
                                    filterPlaceholder={`Поиск по Id кампании среди ${rkList.length} шт.`}
                                    items={rkList}
                                    itemHeight={112}
                                    renderItem={(advertId) => {
                                        return (
                                            <div
                                                style={{
                                                    padding: '0 16px',
                                                    display: 'flex',
                                                    margin: '4px 0',
                                                    flexDirection: 'row',
                                                    height: 96,
                                                    width: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}
                                            >
                                                <AdvertCard
                                                    sellerId={sellerId}
                                                    advertBudgetRules={advertBudgetRules}
                                                    setAdvertBudgetRules={setAdvertBudgetRules}
                                                    permission={permission}
                                                    id={advertId}
                                                    index={-1}
                                                    art={''}
                                                    doc={doc}
                                                    selectValue={selectValue}
                                                    copiedAdvertsSettings={copiedAdvertsSettings}
                                                    setChangedDoc={setChangedDoc}
                                                    manageAdvertsActivityCallFunc={
                                                        manageAdvertsActivityCallFunc
                                                    }
                                                    setArtsStatsByDayData={setArtsStatsByDayData}
                                                    updateColumnWidth={updateColumnWidth}
                                                    filteredData={filteredData}
                                                    setCopiedAdvertsSettings={
                                                        setCopiedAdvertsSettings
                                                    }
                                                    setFetchedPlacements={setFetchedPlacements}
                                                    currentParsingProgress={currentParsingProgress}
                                                    setCurrentParsingProgress={
                                                        setCurrentParsingProgress
                                                    }
                                                    columnDataAuction={columnDataAuction}
                                                    auctionOptions={auctionOptions}
                                                    auctionSelectedOption={auctionSelectedOption}
                                                    setDateRange={setDateRange}
                                                    setShowArtStatsModalOpen={
                                                        setShowArtStatsModalOpen
                                                    }
                                                    dateRange={dateRange}
                                                    recalc={recalc}
                                                    filterByButton={filterByButton}
                                                    setAuctionSelectedOption={
                                                        setAuctionSelectedOption
                                                    }
                                                    getUniqueAdvertIdsFromThePage={
                                                        getUniqueAdvertIdsFromThePage
                                                    }
                                                />
                                                <div style={{minWidth: 8}} />
                                                <Button
                                                    view={
                                                        rkListMode == 'add'
                                                            ? 'outlined-success'
                                                            : 'outlined-danger'
                                                    }
                                                    disabled={
                                                        !doc.adverts?.[selectValue[0]]?.[
                                                            advertId
                                                        ] ||
                                                        doc?.adverts?.[selectValue[0]]?.[advertId]
                                                            ?.type != 8
                                                    }
                                                    onClick={async () => {
                                                        const params = {
                                                            uid: getUid(),
                                                            campaignName: selectValue[0],
                                                            data: {
                                                                advertsIds: {},
                                                                mode: rkListMode,
                                                            },
                                                        };
                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                            art: semanticsModalOpenFromArt,
                                                        };

                                                        console.log(params);

                                                        const res = await callApi(
                                                            'manageAdvertsNMs',
                                                            params,
                                                        );
                                                        console.log(res);
                                                        if (!res || res['data'] === undefined) {
                                                            return;
                                                        }

                                                        if (res['data']['status'] == 'ok') {
                                                            if (
                                                                !doc.campaigns[selectValue[0]][
                                                                    semanticsModalOpenFromArt
                                                                ].adverts
                                                            )
                                                                doc.campaigns[selectValue[0]][
                                                                    semanticsModalOpenFromArt
                                                                ].adverts = {};

                                                            doc.campaigns[selectValue[0]][
                                                                semanticsModalOpenFromArt
                                                            ].adverts[advertId] =
                                                                rkListMode == 'add'
                                                                    ? {advertId: advertId}
                                                                    : undefined;

                                                            if (rkListMode == 'delete') {
                                                                delete doc.campaigns[
                                                                    selectValue[0]
                                                                ][semanticsModalOpenFromArt]
                                                                    .adverts[advertId];
                                                                const adverts =
                                                                    doc.campaigns[selectValue[0]][
                                                                        semanticsModalOpenFromArt
                                                                    ].adverts;
                                                                if (adverts) {
                                                                    const temp = [] as any[];
                                                                    for (const [
                                                                        _,
                                                                        advertData,
                                                                    ] of Object.entries(adverts)) {
                                                                        if (!advertData) continue;
                                                                        temp.push(
                                                                            advertData['advertId'],
                                                                        );
                                                                    }
                                                                    setRkList(temp);
                                                                }
                                                            }

                                                            setAdvertsArtsListModalFromOpen(false);
                                                        }
                                                        setChangedDoc({...doc});
                                                    }}
                                                >
                                                    <Icon
                                                        data={rkListMode == 'add' ? Plus : Xmark}
                                                    />
                                                </Button>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </Modal>
                        {showDzhemModalOpen && (
                            <DzhemPhrasesModal
                                open={showDzhemModalOpen}
                                onClose={() => setShowDzhemModalOpen(false)}
                                sellerId={sellerId}
                                nmId={selectedNmId}
                            />
                        )}
                        <Modal
                            open={showArtStatsModalOpen}
                            onClose={() => setShowArtStatsModalOpen(false)}
                        >
                            <motion.div
                                onAnimationStart={async () => {
                                    await new Promise((resolve) => setTimeout(resolve, 300));
                                    artsStatsByDayDataFilter(
                                        {sum: {val: '', mode: 'include'}},
                                        artsStatsByDayData,
                                    );
                                }}
                                animate={{maxHeight: showArtStatsModalOpen ? '60em' : 0}}
                                style={{
                                    margin: 20,
                                    maxWidth: '90vw',
                                    // maxHeight: '60em',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        margin: '8px 0',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* <Text variant="display-2">Статистика по</Text> */}
                                    <Select
                                        className={b('selectCampaign')}
                                        value={artsStatsByDayModeSwitchValue}
                                        placeholder="Values"
                                        options={artsStatsByDayModeSwitchValues}
                                        renderControl={({onClick, onKeyDown, ref}) => {
                                            return (
                                                <Button
                                                    style={{
                                                        marginTop: 12,
                                                    }}
                                                    ref={ref}
                                                    size="xl"
                                                    view="outlined"
                                                    onClick={onClick}
                                                    extraProps={{
                                                        onKeyDown,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Text
                                                            variant="display-2"
                                                            style={{marginBottom: 8}}
                                                        >
                                                            {artsStatsByDayModeSwitchValue[0]}
                                                        </Text>
                                                        <div style={{width: 4}} />
                                                        <Icon size={26} data={ChevronDown} />
                                                    </div>
                                                </Button>
                                            );
                                        }}
                                        onUpdate={(nextValue) => {
                                            setArtsStatsByDayModeSwitchValue(nextValue);
                                        }}
                                    />
                                </div>
                                <div style={{minHeight: 8}} />
                                <Card
                                    style={{
                                        overflow: 'auto',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <TheTable
                                        columnData={columnDataArtByDayStats}
                                        data={artsStatsByDayFilteredData}
                                        filters={artsStatsByDayFilters}
                                        setFilters={setArtsStatsByDayFilters}
                                        filterData={artsStatsByDayDataFilter}
                                        footerData={[artsStatsByDayFilteredSummary]}
                                        tableId={''}
                                        usePagination={false}
                                    />
                                </Card>
                            </motion.div>
                        </Modal>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Button
                                style={{
                                    marginBottom: 8,
                                }}
                                loading={fetchingDataFromServerFlag}
                                size="l"
                                view="action"
                                onClick={updateTheData}
                            >
                                <Icon data={ArrowsRotateLeft} />
                            </Button>
                            <div style={{width: 8}} />
                            {fetchingDataFromServerFlag ? <Spin style={{marginRight: 8}} /> : <></>}
                        </div>
                        <RangePicker
                            args={{
                                recalc,
                                dateRange,
                                setDateRange,
                                anchorRef,
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div style={{marginBottom: 80}} />
            )}

            {isMobile ? (
                <></>
            ) : (
                <TheTable
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    footerData={[filteredSummary]}
                    tableId={'massAdverts'}
                    usePagination={true}
                    onPaginationUpdate={({page, paginatedData}) => {
                        setPagesCurrent(page);
                        setFilteredSummary((row) => {
                            const temp = row;
                            temp.art = `На странице SKU: ${paginatedData.length} Всего SKU: ${filteredData.length} ID КТ: ${temp.uniqueImtIds}`;

                            return temp;
                        });
                    }}
                    defaultPaginationSize={300}
                    width="100%"
                    height="calc(100vh - 10em - 68px - 32px - 36px - 70px - 38px)"
                />
            )}
        </div>
    );
};

export const generateModalButtonWithActions = (
    params: {
        disabled?;
        pin?;
        size?;
        view?;
        style?;
        selected?;
        placeholder;
        icon;
        onClick?;
    },
    selectedButton,
    setSelectedButton,
) => {
    const {pin, size, view, style, selected, placeholder, icon, onClick, disabled} = params;
    if (selected || selectedButton || setSelectedButton) {
    }
    return (
        <motion.div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Button
                disabled={disabled}
                style={
                    style ?? {
                        margin: '4px 0px',
                    }
                }
                pin={pin ?? 'circle-circle'}
                size={size ?? 'l'}
                view={view ?? 'action'}
                selected={true}
                onClick={() => {
                    onClick();
                }}
            >
                <Icon data={icon} />
                {placeholder}
            </Button>
        </motion.div>
    );
};

const generateCard = (args) => {
    const {summary, key, placeholder, cardStyle, valueType, percent, rub} = args;
    return (
        <Card style={cardStyle} view="outlined">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text style={{whiteSpace: 'pre-wrap'}}>{`${placeholder}`}</Text>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: '18pt',
                        marginBottom: 10,
                        marginTop: 4,
                    }}
                >
                    {valueType == 'text'
                        ? summary[key]
                        : new Intl.NumberFormat('ru-RU').format(summary[key])}
                    {percent ? '%' : ''}
                    {rub ? ' ₽' : ''}
                </Text>
            </div>
        </Card>
    );
};

export const parseFirst10Pages = async (
    searchPhrase,
    setFetchedPlacements,
    setCurrentParsingProgress,
    pagesCount = 20,
    startPage = 0,
    startValuesList = {
        updateTime: '',
        data: {},
        cpms: {firstPage: [] as any[], search: [] as any[], auto: [] as any[]},
    },
    startValuesProg = {
        max: pagesCount * 100,
        progress: 0,
        warning: false,
        error: false,
        isParsing: false,
    },
) => {
    const allCardDataList = startValuesList ?? {
        updateTime: '',
        data: {},
        cpms: {firstPage: [], search: [], auto: []},
    };

    setCurrentParsingProgress((obj) => {
        const curVal = Object.assign({}, obj);
        if (startValuesProg) {
            startValuesProg.error = false;
            startValuesProg.warning = false;
        }
        curVal[searchPhrase] = startValuesProg ?? {
            max: pagesCount * 100,
            progress: 0,
            warning: false,
            error: false,
            isParsing: false,
        };
        return curVal;
    });

    const fetchedPlacements = {};

    let retryCount = 0;
    for (let page = startPage + 1; page <= pagesCount; page++) {
        // retryCount = 0;
        const url = `https://search.wb.ru/exactmatch/ru/common/v5/search?ab_testing=false&appType=64&page=${page}&curr=rub&dest=-1257218&query=${encodeURIComponent(
            searchPhrase,
        )}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data && data.data && data.data.products && data.data.products.length == 100) {
                const myData = {};
                const cpms = {firstPage: [] as any[], search: [] as any[], auto: [] as any[]};
                for (let i = 0; i < data.data.products.length; i++) {
                    const cur = data.data.products[i];
                    cur.index = i + 1 + (page - 1) * 100;
                    const {id, log, name, brand, supplier} = cur;

                    cur.sppPrice = getRoundValue(
                        cur.sizes
                            ? cur.sizes[0]
                                ? cur.sizes[0].price
                                    ? cur.sizes[0].price.total ?? 0
                                    : 0
                                : 0
                            : 0,
                        100,
                    );

                    const {tp} = log ?? {};
                    if (tp) {
                        const advertsType = tp == 'b' ? 'auto' : tp == 'c' ? 'search' : 'none';
                        cur.log.advertsType = advertsType;
                        cur.advertsType = advertsType;

                        cur.log.name = name;
                        cur.log.brand = brand;
                        cur.log.id = id;
                        cur.log.supplier = supplier;
                        cur.position = log.position;
                        cur.promoPosition = log.promoPosition;
                        cur.cpm = log.cpm;

                        cur.avgBoostPrice = getRoundValue(
                            log.cpm,
                            cur.position - cur.promoPosition,
                        );
                        cur.log.avgBoostPrice = cur.avgBoostPrice;

                        if (!cpms[advertsType]) cpms[advertsType] = [];
                        cpms[advertsType].push(cur.log);
                        cur.cpmIndex =
                            allCardDataList.cpms[advertsType].length + cpms[advertsType].length;
                    }

                    setCurrentParsingProgress((obj) => {
                        const curVal = Object.assign({}, obj);
                        if (!curVal[searchPhrase]) curVal[searchPhrase] = {max: pagesCount * 100};
                        if (cur.index == pagesCount * 100) curVal[searchPhrase].warning = false;
                        if (cur.index % 100 == 0) {
                            curVal[searchPhrase].progress = cur.index;
                        }
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });

                    myData[id] = cur;

                    cpms.firstPage.push(cur);
                }

                Object.assign(allCardDataList.data, myData);
                for (const item of cpms.firstPage) {
                    allCardDataList.cpms.firstPage.push(item);
                }
                for (const item of cpms.search) {
                    allCardDataList.cpms.search.push(item);
                }
                for (const item of cpms.auto) {
                    allCardDataList.cpms.auto.push(item);
                }
                // console.log(allCardDataList.cpms, cpms);

                console.log(`Data saved for search phrase: ${searchPhrase}, page: ${page}`);
                await new Promise((resolve) => setTimeout(resolve, 400));
            } else {
                page--;
                retryCount++;
                // await new Promise((resolve) => setTimeout(resolve, 1000));
                if (retryCount % 100 == 0) {
                    console.log(searchPhrase, retryCount);
                    setCurrentParsingProgress((curVal) => {
                        if (!curVal[searchPhrase])
                            curVal[searchPhrase] = {max: pagesCount * 100, progress: 0};
                        curVal[searchPhrase].warning = true;
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });
                    // await new Promise((resolve) => setTimeout(resolve, 100));
                }
                if (retryCount == 200) {
                    retryCount = 0;
                    setCurrentParsingProgress((curVal) => {
                        if (!curVal[searchPhrase]) curVal[searchPhrase] = {max: pagesCount * 100};
                        if (curVal[searchPhrase].progress < 100) {
                            curVal[searchPhrase].progress = curVal[searchPhrase].max;
                        }
                        curVal[searchPhrase].error = true;
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });
                    break;
                }
                // console.log(`Not enough data for search phrase: ${searchPhrase} on page ${page} only ${data.data.products.length} retrying`);
            }
        } catch (error) {
            console.error(
                `Error fetching data for search phrase: ${searchPhrase}, page: ${page}`,
                error,
            );
        }
    }

    if (
        allCardDataList &&
        allCardDataList.data &&
        Object.keys(allCardDataList.data).length >= 1 * 100
    ) {
        allCardDataList.updateTime = new Date().toISOString();

        fetchedPlacements[searchPhrase] = allCardDataList;
        setFetchedPlacements(fetchedPlacements);

        console.log(`All data saved for search phrase: ${searchPhrase}`);
    }
    console.log(allCardDataList);
};
