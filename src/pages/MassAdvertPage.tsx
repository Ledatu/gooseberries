import React, {useEffect, useRef, useState} from 'react';
import {
    Spin,
    Button,
    Text,
    Card,
    Select,
    SelectOption,
    Popup,
    TextInput,
    Link,
    Icon,
    Popover,
    Label,
    PopoverBehavior,
    Modal,
    Pagination,
    RadioButton,
    List,
    Checkbox,
} from '@gravity-ui/uikit';
import {RangeCalendar} from '@gravity-ui/date-components';
import {HelpPopover} from '@gravity-ui/components';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

import Userfront from '@userfront/toolkit';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
const b = block('app');

import {
    Pencil,
    Key,
    Rocket,
    Comment,
    Magnifier,
    Star,
    LayoutHeader,
    ArrowsRotateLeft,
    TriangleExclamation,
    ChartLine,
    ArrowRotateLeft,
    CircleRuble,
    SlidersVertical,
    ChevronDown,
    ArrowShapeUp,
    Minus,
    Plus,
    Play,
    Pause,
    ArrowRight,
    LayoutList,
    Clock,
    Ban,
    Calendar,
    Eye,
    EyeSlash,
    TrashBin,
    Check,
    CloudArrowUpIn,
    Xmark,
} from '@gravity-ui/icons';
import {motion} from 'framer-motion';

import ChartKit, {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
settings.set({plugins: [YagrPlugin]});
import callApi, {getUid} from 'src/utilities/callApi';
import axios from 'axios';
import {getLocaleDateString} from 'src/utilities/getRoundValue';
import TheTable, {compare} from 'src/components/TheTable';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['campaigns'][selectValue] = docum['campaigns'][selectValue];
            doc['balances'][selectValue] = docum['balances'][selectValue];
            doc['plusPhrasesTemplates'][selectValue] = docum['plusPhrasesTemplates'][selectValue];
            doc['advertsPlusPhrasesTemplates'][selectValue] =
                docum['advertsPlusPhrasesTemplates'][selectValue];
            doc['advertsBudgetsToKeep'][selectValue] = docum['advertsBudgetsToKeep'][selectValue];
            doc['adverts'][selectValue] = docum['adverts'][selectValue];
            doc['placementsAuctions'][selectValue] = docum['placementsAuctions'][selectValue];
            doc['advertsSelectedPhrases'][selectValue] =
                docum['advertsSelectedPhrases'][selectValue];
            doc['advertsSchedules'][selectValue] = docum['advertsSchedules'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getMassAdvertsNew', {
            uid: getUid(),
            dateRange: {from: '2023', to: '2024'},
            campaignName:
                Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594'
                    ? 'ИП Иосифов М.С.'
                    : 'ИП Валерий',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const MassAdvertPage = () => {
    // const myObserver = new ResizeObserver((entries) => {
    //     // console.log('resized');

    //     const advertsColumnItems = document.getElementsByClassName('td_fixed_adverts');
    //     for (let i = 0; i < advertsColumnItems.length; i++) {
    //         (advertsColumnItems[i] as HTMLElement).style.left = `${
    //             entries[0].contentRect.width + 20
    //         }px`;
    //     }
    // });

    // const windowDimensions = useWindowDimensions();

    // const isDesktop = windowDimensions.height < windowDimensions.width;

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);
    const [fetchedPlacements, setFetchedPlacements] = useState<any>(undefined);

    const [filters, setFilters] = useState({undef: false});

    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [manageModalInProgress, setManageModalInProgress] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');

    // const [semanticsModalTextAreaAddMode, setSemanticsModalTextAreaAddMode] = useState(false);
    // const [semanticsModalTextAreaValue, setSemanticsModalTextAreaValue] = useState('');

    const [placementsDisplayPhrase, setPlacementsDisplayPhrase] = useState('');

    const [modalFormOpen, setModalFormOpen] = useState(false);

    const [createAdvertsMode, setCreateAdvertsMode] = useState(false);

    const [budgetInputValue, setBudgetInputValue] = useState(1000);
    const [budgetInputValidationValue, setBudgetInputValidationValue] = useState(true);
    const [bidInputValue, setBidInputValue] = useState(125);
    const [bidInputValidationValue, setBidInputValidationValue] = useState(true);
    const advertTypeSwitchValues: any[] = [
        {value: 'Авто', content: 'Авто'},
        {value: 'Поиск', content: 'Поиск'},
    ];
    const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = React.useState(['Авто']);

    const [plusPhrasesModalFormOpen, setPlusPhrasesModalFormOpen] = useState(false);
    const [plusPhrasesTemplatesLabels, setPlusPhrasesTemplatesLabels] = useState<any[]>([]);

    const [budgetModalFormOpen, setBudgetModalFormOpen] = useState(false);
    const [budgetModalBudgetInputValue, setBudgetModalBudgetInputValue] = useState(1000);
    const [budgetModalBudgetInputValidationValue, setBudgetModalBudgetInputValidationValue] =
        useState(true);
    const budgetModalSwitchValues: any[] = [
        {value: 'Пополнить', content: 'Пополнить'},
        {value: 'Установить лимит', content: 'Установить лимит'},
    ];
    const [budgetModalSwitchValue, setBudgetModalSwitchValue] = React.useState('Пополнить');

    const artsStatsByDayModeSwitchValues: any[] = [
        {value: 'Статистика по дням', content: 'Статистика по дням'},
        {value: 'Статистика по дням недели', content: 'Статистика по дням недели', disabled: true},
    ];
    const [artsStatsByDayModeSwitchValue, setArtsStatsByDayModeSwitchValue] = React.useState([
        'Статистика по дням',
    ]);

    const [semanticsAutoPhrasesModalFormOpen, setSemanticsAutoPhrasesModalFormOpen] =
        useState(false);
    const [semanticsAutoPhrasesModalIncludesList, setSemanticsAutoPhrasesModalIncludesList] =
        useState<any[]>([]);
    // // const [
    // //     semanticsAutoPhrasesModalIncludesListTemp,
    // //     setSemanticsAutoPhrasesModalIncludesListTemp,
    // // ] = useState<any[]>([]);
    const [
        semanticsAutoPhrasesModalIncludesListInput,
        setSemanticsAutoPhrasesModalIncludesListInput,
    ] = useState('');
    const [semanticsAutoPhrasesModalNotIncludesList, setSemanticsAutoPhrasesModalNotIncludesList] =
        useState<any[]>([]);
    // // const [
    // //     semanticsAutoPhrasesModalNotIncludesListTemp,
    // //     setSemanticsAutoPhrasesModalNotIncludesListTemp,
    // // ] = useState<any[]>([]);
    const [
        semanticsAutoPhrasesModalNotIncludesListInput,
        setSemanticsAutoPhrasesModalNotIncludesListInput,
    ] = useState('');

    const [warningBeforeDeleteConfirmation, setWarningBeforeDeleteConfirmation] = useState(false);
    const [warningBeforeDeleteConfirmationRow, setWarningBeforeDeleteConfirmationRow] = useState(0);

    const [advertsArtsListModalFromOpen, setAdvertsArtsListModalFromOpen] = useState(false);
    const [rkList, setRkList] = useState<any[]>([]);
    const [rkListMode, setRkListMode] = useState('add');

    const [semanticsModalFormOpen, setSemanticsModalFormOpen] = useState(false);
    const [semanticsModalOpenFromArt, setSemanticsModalOpenFromArt] = useState('');
    const [modalOpenFromAdvertId, setModalOpenFromAdvertId] = useState('');
    const [selectedSearchPhrase, setSelectedSearchPhrase] = useState<string>('');
    const [currentParsingProgress, setCurrentParsingProgress] = useState<any>({});
    const [semanticsModalSemanticsItemsValue, setSemanticsModalSemanticsItemsValue] = useState<
        any[]
    >([]);
    const [semanticsModalSemanticsItemsValuePresets, setSemanticsModalSemanticsItemsValuePresets] =
        useState<any[]>([]);
    const [
        semanticsModalSemanticsMinusItemsValuePresets,
        setSemanticsModalSemanticsMinusItemsValuePresets,
    ] = useState<any[]>([]);
    const [
        semanticsModalSemanticsItemsFiltratedValue,
        setSemanticsModalSemanticsItemsFiltratedValue,
    ] = useState<any[]>([]);
    const [
        semanticsModalSemanticsMinusItemsFiltratedValue,
        setSemanticsModalSemanticsMinusItemsFiltratedValue,
    ] = useState<any[]>([]);
    const [semanticsModalSemanticsMinusItemsValue, setSemanticsModalSemanticsMinusItemsValue] =
        useState<any[]>([]);
    const [semanticsModalSemanticsPlusItemsValue, setSemanticsModalSemanticsPlusItemsValue] =
        useState<any[]>([]);
    const [
        semanticsModalSemanticsPlusItemsTemplateNameSaveValue,
        setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue,
    ] = useState('Новый шаблон');
    const [semanticsModalSemanticsThresholdValue, setSemanticsModalSemanticsThresholdValue] =
        useState(1);
    const [semanticsModalSemanticsCTRThresholdValue, setSemanticsModalSemanticsCTRThresholdValue] =
        useState('0');
    const [
        semanticsModalSemanticsCTRThresholdValueValid,
        setSemanticsModalSemanticsCTRThresholdValueValid,
    ] = useState(true);
    const [
        semanticsModalSemanticsSecondThresholdValue,
        setSemanticsModalSemanticsSecondThresholdValue,
    ] = useState(0);
    const [
        semanticsModalSemanticsSecondCTRThresholdValue,
        setSemanticsModalSemanticsSecondCTRThresholdValue,
    ] = useState('0');
    const [
        semanticsModalSemanticsSecondCTRThresholdValueValid,
        setSemanticsModalSemanticsSecondCTRThresholdValueValid,
    ] = useState(true);

    const [semanticsModalIsFixed, setSemanticsModalIsFixed] = useState(false);

    // const [
    //     semanticsModalSemanticsInputValidationValue,
    //     setSemanticsModalSemanticsInputValidationValue,
    // ] = useState(true);
    // const semanticsModalSwitchValues: any[] = [
    //     {value: 'Пополнить', content: 'Пополнить'},
    //     {value: 'Установить лимит', content: 'Установить лимит'},
    // ];
    // const [semanticsModalSwitchValue, setSemanticsModalSwitchValue] = React.useState('Пополнить');

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
        addToCartPercent: 0,
        cartToOrderPercent: 0,
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
            addToCartPercent: 0,
            cartToOrderPercent: 0,
        };

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
                    if (['sum', 'clicks', 'views', 'orders', 'sum_orders'].includes(key))
                        artsStatsByDayFilteredSummaryTemp[key] += val;
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
        const {orders, sum, views, clicks} = artsStatsByDayFilteredSummaryTemp;

        artsStatsByDayFilteredSummaryTemp.drr = getRoundValue(
            artsStatsByDayFilteredSummaryTemp.sum,
            artsStatsByDayFilteredSummaryTemp.sum_orders,
            true,
            1,
        );
        artsStatsByDayFilteredSummaryTemp.ctr = getRoundValue(clicks, views, true);
        artsStatsByDayFilteredSummaryTemp.cpc = getRoundValue(sum, clicks);
        artsStatsByDayFilteredSummaryTemp.cpm = getRoundValue(sum * 1000, views);
        artsStatsByDayFilteredSummaryTemp.cr = getRoundValue(orders, views, true);
        artsStatsByDayFilteredSummaryTemp.cpo = getRoundValue(sum, orders, false, sum);

        setArtsStatsByDayFilteredSummary(artsStatsByDayFilteredSummaryTemp);
    };

    const [showScheduleModalOpen, setShowScheduleModalOpen] = useState(false);
    const [scheduleInput, setScheduleInput] = useState({});
    const genTempSchedule = () => {
        const tempScheduleInput = {};
        for (let i = 0; i < 7; i++) {
            tempScheduleInput[i] = {};
            for (let j = 0; j < 24; j++) {
                tempScheduleInput[i][j] = {selected: true};
            }
        }
        return tempScheduleInput;
    };

    const [semanticsFilteredSummary, setSemanticsFilteredSummary] = useState({
        active: {
            cluster: {summary: 0},
            cpc: 0,
            sum: 0,
            count: 0,
            ctr: 0,
            clicks: 0,
            freq: 0,
            placements: null,
        },
        minus: {
            cluster: {summary: 0},
            freq: 0,
            count: 0,
            clicks: 0,
            sum: 0,
            cpc: 0,
            ctr: 0,
            placements: null,
        },
        template: {cluster: {summary: 0}},
    });

    const [clustersFiltersActive, setClustersFiltersActive] = useState({undef: false});
    const clustersFilterDataActive = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersActive;
        const _clusters = clusters ?? semanticsModalSemanticsItemsValue;
        // console.log(_clustersFilters, _clusters);

        semanticsFilteredSummary.active = {
            cluster: {summary: 0},
            cpc: 0,
            sum: 0,
            count: 0,
            ctr: 0,
            clicks: 0,
            freq: 0,
            placements: null,
        };

        setSemanticsModalSemanticsItemsFiltratedValue(
            _clusters.filter((cluster) => {
                for (const [filterArg, filterData] of Object.entries(_clustersFilters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;
                    else if (!compare(cluster[filterArg], filterData)) {
                        return false;
                    }
                }

                for (const [key, val] of Object.entries(cluster)) {
                    if (['sum', 'count', 'clicks', 'freq'].includes(key))
                        semanticsFilteredSummary.active[key] += val;
                }
                semanticsFilteredSummary.active.cluster.summary++;

                return true;
            }),
        );

        const {sum, count, clicks} = semanticsFilteredSummary.active;
        semanticsFilteredSummary.active.cpc = getRoundValue(sum, clicks);
        semanticsFilteredSummary.active.ctr = getRoundValue(clicks, count, true);
        setSemanticsFilteredSummary(semanticsFilteredSummary);
    };

    const [clustersFiltersMinus, setClustersFiltersMinus] = useState({undef: false});
    const clustersFilterDataMinus = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersMinus;
        const _clusters = clusters ?? semanticsModalSemanticsMinusItemsValue;
        // console.log(_clustersFilters, _clusters);

        semanticsFilteredSummary.minus = {
            cluster: {summary: 0},
            cpc: 0,
            sum: 0,
            count: 0,
            ctr: 0,
            clicks: 0,
            freq: 0,
            placements: null,
        };

        const temp = [] as any[];
        for (const cluster of _clusters) {
            let addFlag = true;
            for (const [filterArg, filterData] of Object.entries(_clustersFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '') continue;
                else if (!compare(cluster[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) {
                for (const [key, val] of Object.entries(cluster)) {
                    if (['sum', 'count', 'clicks', 'freq'].includes(key))
                        semanticsFilteredSummary.minus[key] += val;
                }
                semanticsFilteredSummary.minus.cluster.summary++;
                temp.push(cluster);
            }
        }
        console.log(temp);

        setSemanticsModalSemanticsMinusItemsFiltratedValue([...temp]);

        const {sum, count, clicks} = semanticsFilteredSummary.minus;
        semanticsFilteredSummary.minus.cpc = getRoundValue(sum, clicks);
        semanticsFilteredSummary.minus.ctr = getRoundValue(clicks, count, true);
        setSemanticsFilteredSummary(semanticsFilteredSummary);
    };

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);

    const [bidModalFormOpen, setBidModalFormOpen] = useState(false);
    const [bidModalBidInputValue, setBidModalBidInputValue] = useState(125);
    const [bidModalBidInputValidationValue, setBidModalBidInputValidationValue] = useState(true);
    const [bidModalDeleteModeSelected, setBidModalDeleteModeSelected] = useState(false);
    const [bidModalBidStepInputValue, setBidModalBidStepInputValue] = useState(5);
    const [bidModalRange, setBidModalRange] = useState({from: 50, to: 50});
    const [bidModalRangeValid, setBidModalRangeValid] = useState(true);
    const [bidModalMaxBid, setBidModalMaxBid] = useState(500);
    const [bidModalMaxBidValid, setBidModalMaxBidValid] = useState(true);
    const [bidModalBidStepInputValidationValue, setBidModalBidStepInputValidationValue] =
        useState(true);
    const [bidModalStocksThresholdInputValue, setBidModalStocksThresholdInputValue] = useState(5);
    const [
        bidModalStocksThresholdInputValidationValue,
        setBidModalStocksThresholdInputValidationValue,
    ] = useState(true);
    const [bidModalDRRInputValue, setBidModalDRRInputValue] = useState(10);
    const [bidModalDRRInputValidationValue, setBidModalDRRInputValidationValue] = useState(true);

    const bidModalSwitchValues: any[] = [
        {value: 'Установить', content: 'Установить'},
        {value: 'Автоставки', content: 'Автоставки'},
    ];
    const [bidModalSwitchValue, setBidModalSwitchValue] = React.useState('Установить');
    // const bidModalAnalyticsSwitchValues: any[] = [
    //     {
    //         value: 1,
    //         content: (
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 1<div style={{width: 2}} />
    //                 <Icon size={12} data={Calendar}></Icon>
    //             </div>
    //         ),
    //     },
    //     {
    //         value: 7,
    //         content: (
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 7<div style={{width: 2}} />
    //                 <Icon size={12} data={Calendar}></Icon>
    //             </div>
    //         ),
    //     },
    //     {
    //         value: 14,
    //         content: (
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 14
    //                 <div style={{width: 2}} />
    //                 <Icon size={12} data={Calendar}></Icon>
    //             </div>
    //         ),
    //     },
    //     {
    //         value: 30,
    //         content: (
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 30
    //                 <div style={{width: 2}} />
    //                 <Icon size={12} data={Calendar}></Icon>
    //             </div>
    //         ),
    //     },
    // ];
    // const [bidModalAnalyticsSwitchValue, setBidModalAnalyticsSwitchValue] = React.useState(14);

    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

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
        setFilters(filters);
        filterTableData(filters);
    };
    const filterByButtonClusters = (val, activeFlag, key = 'art', compMode = 'include') => {
        if (activeFlag) {
            clustersFiltersActive[key] = {val: String(val), compMode: compMode};
            setClustersFiltersActive(clustersFiltersActive);
            clustersFilterDataActive(clustersFiltersActive, semanticsModalSemanticsItemsValue);
        } else {
            clustersFiltersMinus[key] = {val: String(val), compMode: compMode};
            setClustersFiltersMinus(clustersFiltersMinus);
            clustersFilterDataMinus(clustersFiltersMinus, semanticsModalSemanticsMinusItemsValue);
        }
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
                    addToCartPercent: 0,
                    cartToOrderPercent: 0,
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

                const {openCardCount, addToCartPercent, cartToOrderPercent} =
                    nmFullDetailReport ?? {
                        openCardCount: 0,
                        addToCartPercent: 0,
                        cartToOrderPercent: 0,
                    };

                tempJson[strDate].openCardCount += openCardCount;
                tempJson[strDate].addToCartPercent += addToCartPercent;
                tempJson[strDate].cartToOrderPercent += cartToOrderPercent;
            }
            tempJson[strDate].openCardCount = Math.round(tempJson[strDate].openCardCount);

            tempJson[strDate].addToCartPercent = getRoundValue(
                tempJson[strDate].addToCartPercent,
                daysBetween,
            );
            tempJson[strDate].cartToOrderPercent = getRoundValue(
                tempJson[strDate].cartToOrderPercent,
                daysBetween,
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
            dateData['cpc'] = getRoundValue(sum, clicks);
            dateData['cpm'] = getRoundValue(sum * 1000, views);
            dateData['cr'] = getRoundValue(orders, views, true);
            dateData['cpo'] = getRoundValue(sum, orders, false, sum);
            temp.push(dateData);
        }

        return temp;
    };

    const generateAdvertCard = (id, index, art) => {
        const advertData = doc.adverts[selectValue[0]][id];
        const drrAI = doc.advertsAutoBidsRules[selectValue[0]][id];
        const budgetToKeep = doc.advertsBudgetsToKeep[selectValue[0]][id];
        if (!advertData) return <></>;
        const {advertId, status, words, budget, bidLog, daysInWork, type, cpm, budgetLog} =
            advertData;
        if (![4, 9, 11].includes(status)) return <></>;

        const semantics = words;

        const curBudget = budget;
        const curCpm = cpm;
        // console.log(advertId, status, words, budget, bid, bidLog, daysInWork, type);

        const plusPhrasesTemplate = doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId]
            ? doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId].templateName
            : undefined;
        const {isFixed, autoPhrasesTemplate} =
            doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate] ?? {};

        const themeToUse = plusPhrasesTemplate
            ? isFixed
                ? 'flat-warning'
                : autoPhrasesTemplate &&
                  ((autoPhrasesTemplate.includes && autoPhrasesTemplate.includes.length) ||
                      (autoPhrasesTemplate.notIncludes && autoPhrasesTemplate.notIncludes.length))
                ? 'flat-success'
                : 'flat-info'
            : 'normal';

        const advertSemantics = {
            clusters: semantics ? semantics.clusters ?? [] : [],
            excluded: semantics ? semantics.excluded ?? [] : [],
        };

        const isWarningBeforeDeleteConfirmationRow =
            index == warningBeforeDeleteConfirmationRow &&
            warningBeforeDeleteConfirmation &&
            advertId == modalOpenFromAdvertId;

        const timeline: any[] = [];
        const graphsData: any[] = [];
        const graphsDataPosition: any[] = [];
        const graphsDataPositionAuction: any[] = [];
        const graphsDataPositionOrganic: any[] = [];
        const bidLogType = bidLog;
        if (bidLogType) {
            for (let i = 1; i < bidLogType.bids.length; i++) {
                const {val} = bidLogType.bids[i - 1];
                const {time, index, cpmIndex, position} = bidLogType.bids[i];
                if (!time || !val) continue;

                const timeObj = new Date(time);
                const rbd = new Date(dateRange[1]);
                rbd.setHours(23, 59, 59);
                if (timeObj < dateRange[0] || timeObj > rbd) continue;
                timeline.push(timeObj.getTime());
                graphsData.push(val);

                if (index == -1 || !index) graphsDataPosition.push(null);
                else graphsDataPosition.push(index);

                if (cpmIndex == -1 || !index) graphsDataPositionAuction.push(null);
                else graphsDataPositionAuction.push(cpmIndex);

                if (position == -1 || !position) graphsDataPositionOrganic.push(null);
                else graphsDataPositionOrganic.push(position);
            }
        }
        const yagrData: YagrWidgetData = {
            data: {
                timeline: timeline,
                graphs: [
                    {
                        id: '0',
                        name: 'Ставка',
                        color: '#5fb8a5',
                        data: graphsData,
                    },
                    {
                        id: '1',
                        name: 'Позиция',
                        color: '#4aa1f2',
                        scale: 'r',
                        data: graphsDataPosition,
                    },
                    {
                        id: '2',
                        name: 'Позиция в аукционе',
                        color: '#9a63d1',
                        scale: 'r',
                        data: graphsDataPositionAuction,
                    },
                    {
                        id: '3',
                        name: 'Органическая позиция',
                        color: '#708da6',
                        scale: 'r2',
                        data: graphsDataPositionOrganic,
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
                        label: 'Ставка',
                        precision: 'auto',
                        show: true,
                    },
                    r: {
                        label: 'Выдача',
                        side: 'right',
                        precision: 'auto',
                        show: true,
                    },
                    r1: {
                        label: 'Аукцион',
                        side: 'right',
                        precision: 'auto',
                        show: true,
                    },
                    r2: {
                        label: 'Органика',
                        side: 'right',
                        precision: 'auto',
                        show: true,
                    },
                    x: {
                        label: 'Время',
                        precision: 'auto',
                        show: true,
                    },
                },
                scales: {},
                title: {
                    text: 'Изменение ставки',
                },
            },
        };

        const timelineBudget: any[] = [];
        const graphsDataBudgets: any[] = [];
        const graphsDataBudgetsDiv: any[] = [];
        const graphsDataBudgetsDivHours = {};
        if (budgetLog) {
            for (let i = 0; i < budgetLog.length; i++) {
                const {budget, time} = budgetLog[i];
                if (!time || !budget) continue;

                const timeObj = new Date(time);

                timeObj.setMinutes(Math.floor(timeObj.getMinutes() / 15) * 15);

                const lbd = new Date(dateRange[0]);
                lbd.setHours(0, 0, 0, 0);
                const rbd = new Date(dateRange[1]);
                rbd.setHours(23, 59, 59);
                if (timeObj < lbd || timeObj > rbd) continue;
                timelineBudget.push(timeObj.getTime());
                graphsDataBudgets.push(budget);

                const hour = time.slice(0, 13);
                if (!graphsDataBudgetsDivHours[hour]) graphsDataBudgetsDivHours[hour] = budget;
            }
            let prevHour = '';
            for (let i = 0; i < timelineBudget.length; i++) {
                const dateObj = new Date(timelineBudget[i]);
                const time = dateObj.toISOString();
                if (dateObj.getMinutes() != 0) {
                    graphsDataBudgetsDiv.push(null);
                    continue;
                }
                const hour = time.slice(0, 13);
                if (prevHour == '') {
                    graphsDataBudgetsDiv.push(null);
                    prevHour = hour;
                    continue;
                }

                const spent = graphsDataBudgetsDivHours[prevHour] - graphsDataBudgetsDivHours[hour];
                graphsDataBudgetsDiv.push(spent);

                prevHour = hour;
            }
        }

        const yagrBudgetData: YagrWidgetData = {
            data: {
                timeline: timelineBudget,
                graphs: [
                    {
                        id: '0',
                        name: 'Баланс',
                        scale: 'y',
                        color: '#ffbe5c',
                        data: graphsDataBudgets,
                    },
                    {
                        type: 'column',
                        data: graphsDataBudgetsDiv,
                        id: '1',
                        name: 'Расход',
                        scale: 'r',
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
                    r: {
                        label: 'Расход',
                        precision: 'auto',
                        side: 'right',
                        show: true,
                    },
                    x: {
                        label: 'Время',
                        precision: 'auto',
                        show: true,
                    },
                },
                series: [],
                scales: {y: {min: 0}, r: {min: 0}},
                title: {
                    text: 'Изменение баланса',
                },
            },
        };

        return (
            <Card
                style={{
                    height: 96,
                    width: 'fit-content',
                    overflowY: 'hidden',
                    overflowX: 'visible',
                }}
                // view="raised"
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                selected
                                style={{
                                    borderTopLeftRadius: 7,
                                    overflow: 'hidden',
                                }}
                                onClick={() => filterByButton(advertId, 'adverts')}
                                // style=x{{position: 'relative', top: -2}}
                                size="xs"
                                pin="brick-brick"
                                view={
                                    status
                                        ? status == 9
                                            ? 'flat-success'
                                            : status == 11
                                            ? 'flat-danger'
                                            : 'flat-warning'
                                        : 'flat'
                                }
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon data={type == 8 ? Rocket : Magnifier} size={11} />
                                    <div style={{width: 2}} />
                                    {advertId}
                                </div>
                            </Button>
                            <Button
                                selected
                                style={{
                                    borderBottomRightRadius: 9,
                                    overflow: 'hidden',
                                }}
                                onClick={async () => {
                                    const res = await manageAdvertsActivityCallFunc(
                                        status ? (status == 9 ? 'pause' : 'start') : 'start',
                                        advertId,
                                    );
                                    console.log(res);
                                    if (!res || res['data'] === undefined) {
                                        return;
                                    }

                                    if (res['data']['status'] == 'ok') {
                                        doc.adverts[selectValue[0]][advertId].status =
                                            status == 9 ? 11 : 9;
                                    } else if (res['data']['status'] == 'bad') {
                                        doc.adverts[selectValue[0]][advertId].status =
                                            status == 11 ? 9 : 11;
                                    }
                                    setChangedDoc(doc);
                                }}
                                // style={{position: 'relative', top: -2}}
                                disabled={status === undefined}
                                // disabled
                                size="xs"
                                pin="brick-brick"
                                view={
                                    status
                                        ? status == 9
                                            ? 'flat-success'
                                            : status == 11
                                            ? 'flat-danger'
                                            : 'flat-warning'
                                        : 'flat'
                                }
                            >
                                <Icon
                                    data={status ? (status == 9 ? Pause : Play) : Play}
                                    size={11}
                                />
                            </Button>
                            <div style={{width: 8}} />
                            <Button
                                selected={isWarningBeforeDeleteConfirmationRow}
                                style={{
                                    display:
                                        index != -1
                                            ? warningBeforeDeleteConfirmation
                                                ? isWarningBeforeDeleteConfirmationRow
                                                    ? 'flex'
                                                    : 'none'
                                                : 'flex'
                                            : 'none',
                                    borderBottomRightRadius: 9,
                                    borderBottomLeftRadius: 9,
                                    overflow: 'hidden',
                                }}
                                onClick={async () => {
                                    setWarningBeforeDeleteConfirmation(() => {
                                        setWarningBeforeDeleteConfirmationRow(
                                            warningBeforeDeleteConfirmation ? 0 : index,
                                        );
                                        setModalOpenFromAdvertId(
                                            warningBeforeDeleteConfirmation ? '' : advertId,
                                        );
                                        return !warningBeforeDeleteConfirmation;
                                    });

                                    if (!warningBeforeDeleteConfirmation) {
                                        await new Promise((resolve) => {
                                            setTimeout(() => {
                                                setWarningBeforeDeleteConfirmationRow(0);
                                                setWarningBeforeDeleteConfirmation(false);
                                                setModalOpenFromAdvertId('');

                                                resolve(1);
                                            }, 5 * 1000);
                                        });
                                    }
                                }}
                                // style={{position: 'relative', top: -2}}
                                disabled={status === undefined}
                                size="xs"
                                pin="brick-brick"
                                view={isWarningBeforeDeleteConfirmationRow ? 'flat-danger' : 'flat'}
                            >
                                <Icon data={TrashBin} size={11} />
                            </Button>
                            <div style={{width: 8}} />
                        </div>

                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                pin="clear-clear"
                                style={{
                                    borderBottomLeftRadius: 9,
                                    overflow: 'hidden',
                                }}
                                size="xs"
                                // selected
                                // view={index % 2 == 0 ? 'flat' : 'flat-action'}
                                view="flat"
                                onClick={() => {
                                    setShowArtStatsModalOpen(true);

                                    const arts = [] as any[];
                                    for (const [_art, artData] of Object.entries(
                                        doc.campaigns[selectValue[0]],
                                    )) {
                                        if (!_art || !artData) continue;
                                        const advertsArt = artData['adverts'];
                                        if (!advertsArt) continue;
                                        const keys = Object.keys(advertsArt ?? {});
                                        if (keys.includes(String(advertId))) {
                                            if (!arts.includes(_art)) arts.push(_art);
                                        }
                                    }

                                    setArtsStatsByDayData(calcByDayStats(arts));
                                }}
                            >
                                <Icon size={11} data={LayoutList}></Icon>
                            </Button>
                            <Button
                                pin="clear-clear"
                                style={{
                                    overflow: 'hidden',
                                }}
                                size="xs"
                                // selected
                                view={
                                    doc.advertsSchedules[selectValue[0]][advertId]
                                        ? 'flat-action'
                                        : 'flat'
                                }
                                onClick={() => {
                                    setShowScheduleModalOpen(true);
                                    setModalOpenFromAdvertId(advertId);

                                    const schedule = doc.advertsSchedules[selectValue[0]][advertId]
                                        ? doc.advertsSchedules[selectValue[0]][advertId].schedule
                                        : undefined;

                                    setScheduleInput(schedule ?? genTempSchedule());
                                }}
                            >
                                <Icon size={11} data={Clock} />
                            </Button>
                            <Button
                                pin="clear-clear"
                                style={{
                                    borderTopRightRadius: 7,
                                    overflow: 'hidden',
                                }}
                                size="xs"
                                // selected
                                view="flat"
                                onClick={() => {
                                    const nDaysAgo = new Date(today);

                                    nDaysAgo.setDate(nDaysAgo.getDate() - daysInWork);

                                    const range = [nDaysAgo, today];
                                    recalc(range);
                                    setDateRange(range);
                                }}
                            >
                                {daysInWork + 1}
                                <div style={{width: 2}} />
                                <Icon size={11} data={status ? Calendar : Ban}></Icon>
                            </Button>
                        </div>
                    </div>
                    <motion.div
                        animate={{
                            opacity: isWarningBeforeDeleteConfirmationRow ? 0 : 1,
                            pointerEvents: isWarningBeforeDeleteConfirmationRow ? 'none' : 'auto',
                        }}
                        transition={{
                            duration: 0.2,
                            delay: isWarningBeforeDeleteConfirmationRow ? 0 : 0.2,
                        }}
                        style={{
                            height: 76,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                        }}
                    >
                        <Popover
                            content={
                                <div
                                    style={{
                                        height: 'calc(48em - 60px)',
                                        width: '72em',
                                        overflow: 'auto',
                                        display: 'flex',
                                    }}
                                >
                                    <Card
                                        view="outlined"
                                        theme="warning"
                                        style={{
                                            position: 'absolute',
                                            height: '48em',
                                            width: '72em',
                                            overflow: 'auto',
                                            top: -10,
                                            left: -10,
                                            display: 'flex',
                                        }}
                                    >
                                        <ChartKit type="yagr" data={yagrData} />
                                    </Card>
                                </div>
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <Button
                                    pin="brick-round"
                                    size="xs"
                                    view="flat"
                                    onClick={() => {
                                        openBidModalForm();
                                        setModalOpenFromAdvertId(advertId);
                                    }}
                                >
                                    <Text variant="caption-2">{`CPM: ${curCpm} / ${
                                        drrAI !== undefined ? `${drrAI.maxBid}` : 'Автоставки выкл.'
                                    }`}</Text>
                                    {drrAI !== undefined ? (
                                        <Text style={{marginLeft: 4}} variant="caption-2">
                                            {`План ${
                                                drrAI.autoBidsMode == 'cpo' ? 'CPO' : 'ДРР'
                                            }: ${drrAI.desiredDRR}`}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                    {drrAI !== undefined &&
                                    drrAI.autoBidsMode != 'drr' &&
                                    drrAI.autoBidsMode != 'cpo' ? (
                                        <Text style={{marginLeft: 4}} variant="caption-2">
                                            {`План №: ${drrAI.placementsRange.from} (${
                                                drrAI.autoBidsMode == 'auction'
                                                    ? 'Аукцион'
                                                    : 'Выдача'
                                            })`}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                </Button>
                            </div>
                        </Popover>
                        <Popover
                            content={
                                <div
                                    style={{
                                        height: 'calc(30em - 60px)',
                                        width: '600em',
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
                                        <ChartKit type="yagr" data={yagrBudgetData} />
                                    </Card>
                                </div>
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    pin="brick-round"
                                    size="xs"
                                    view="flat"
                                    onClick={() => {
                                        openBudgetModalForm();
                                        setModalOpenFromAdvertId(advertId);
                                    }}
                                >
                                    <Text variant="caption-2">{`Баланс: ${
                                        curBudget !== undefined ? curBudget : 'Нет инф.'
                                    } / ${
                                        budgetToKeep !== undefined
                                            ? budgetToKeep
                                            : 'Бюджет не задан.'
                                    }`}</Text>
                                </Button>
                            </div>
                        </Popover>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                size="xs"
                                pin="brick-round"
                                // style={{
                                //     borderTopRightRadius: 7,
                                //     borderBottomRightRadius: 7,
                                //     overflow: 'hidden',
                                // }}
                                selected={themeToUse != 'normal'}
                                view={themeToUse}
                                onClick={() => {
                                    setSemanticsModalFormOpen(true);

                                    setSemanticsModalOpenFromArt(art);
                                    setModalOpenFromAdvertId(advertId);

                                    if (autoPhrasesTemplate) {
                                        setSemanticsAutoPhrasesModalIncludesList(
                                            autoPhrasesTemplate.includes ?? [],
                                        );
                                        setSemanticsAutoPhrasesModalNotIncludesList(
                                            autoPhrasesTemplate.notIncludes ?? [],
                                        );
                                    } else {
                                        setSemanticsAutoPhrasesModalIncludesList([]);
                                        setSemanticsAutoPhrasesModalNotIncludesList([]);
                                    }
                                    setSemanticsAutoPhrasesModalIncludesListInput('');
                                    setSemanticsAutoPhrasesModalNotIncludesListInput('');

                                    setSemanticsModalSemanticsItemsValue(() => {
                                        const temp = advertSemantics.clusters;
                                        temp.sort((a, b) => {
                                            const key = 'count';
                                            const valA = a[key] ?? 0;
                                            const valB = b[key] ?? 0;
                                            return valB - valA;
                                        });

                                        const tempPresets = [] as any[];
                                        for (const [_cluster, clusterData] of Object.entries(
                                            temp,
                                        )) {
                                            const {preset} = (clusterData as {preset: string}) ?? {
                                                preset: undefined,
                                            };
                                            if (preset && !tempPresets.includes(preset))
                                                tempPresets.push(preset);
                                        }
                                        setSemanticsModalSemanticsItemsValuePresets(tempPresets);

                                        setSemanticsModalSemanticsItemsFiltratedValue(temp);
                                        return temp;
                                    });
                                    setSemanticsModalSemanticsMinusItemsValue(() => {
                                        const temp = advertSemantics.excluded;
                                        temp.sort((a, b) => {
                                            const freqA = a.freq ? a.freq : 0;
                                            const freqB = b.freq ? b.freq : 0;
                                            return freqB - freqA;
                                        });

                                        const tempPresets = [] as any[];
                                        for (const [_cluster, clusterData] of Object.entries(
                                            temp,
                                        )) {
                                            const {preset} = (clusterData as {preset: string}) ?? {
                                                preset: undefined,
                                            };
                                            if (preset && !tempPresets.includes(preset))
                                                tempPresets.push(preset);
                                        }
                                        setSemanticsModalSemanticsMinusItemsValuePresets(
                                            tempPresets,
                                        );

                                        setSemanticsModalSemanticsMinusItemsFiltratedValue(temp);
                                        return temp;
                                    });

                                    const plusThreshold = doc.plusPhrasesTemplates[selectValue[0]][
                                        plusPhrasesTemplate
                                    ]
                                        ? doc.plusPhrasesTemplates[selectValue[0]][
                                              plusPhrasesTemplate
                                          ].threshold
                                        : 1;
                                    setSemanticsModalSemanticsThresholdValue(plusThreshold);

                                    const plusCTRThreshold = doc.plusPhrasesTemplates[
                                        selectValue[0]
                                    ][plusPhrasesTemplate]
                                        ? doc.plusPhrasesTemplates[selectValue[0]][
                                              plusPhrasesTemplate
                                          ].ctrThreshold
                                        : 0;
                                    setSemanticsModalSemanticsCTRThresholdValue(plusCTRThreshold);

                                    const plusSecondThreshold = doc.plusPhrasesTemplates[
                                        selectValue[0]
                                    ][plusPhrasesTemplate]
                                        ? doc.plusPhrasesTemplates[selectValue[0]][
                                              plusPhrasesTemplate
                                          ].secondThreshold
                                        : 0;
                                    setSemanticsModalSemanticsSecondThresholdValue(
                                        plusSecondThreshold,
                                    );

                                    const plusSecondCTRThreshold = doc.plusPhrasesTemplates[
                                        selectValue[0]
                                    ][plusPhrasesTemplate]
                                        ? doc.plusPhrasesTemplates[selectValue[0]][
                                              plusPhrasesTemplate
                                          ].secondCtrThreshold
                                        : 0;
                                    setSemanticsModalSemanticsSecondCTRThresholdValue(
                                        plusSecondCTRThreshold,
                                    );

                                    const isFixed = doc.plusPhrasesTemplates[selectValue[0]][
                                        plusPhrasesTemplate
                                    ]
                                        ? doc.plusPhrasesTemplates[selectValue[0]][
                                              plusPhrasesTemplate
                                          ].isFixed ?? false
                                        : false;
                                    setSemanticsModalIsFixed(isFixed);

                                    setClustersFiltersActive({undef: false});
                                    setClustersFiltersMinus({undef: false});

                                    // // console.log(value.plus);
                                    setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                        plusPhrasesTemplate ?? `Новый шаблон`,
                                    );
                                    const plusItems = doc.plusPhrasesTemplates[selectValue[0]][
                                        plusPhrasesTemplate
                                    ]
                                        ? doc.plusPhrasesTemplates[selectValue[0]][
                                              plusPhrasesTemplate
                                          ].clusters
                                        : [];
                                    setSemanticsModalSemanticsPlusItemsValue(plusItems);

                                    // setSemanticsModalTextAreaValue('');
                                    // setSemanticsModalTextAreaAddMode(false);
                                }}
                            >
                                <Text variant="caption-2">
                                    {themeToUse != 'normal' ? plusPhrasesTemplate : 'Фразы'}
                                </Text>
                            </Button>
                            <div style={{height: 4}} />
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                {advertSemantics.clusters.length ? (
                                    <>
                                        <div style={{width: 5}} />
                                        <Label theme="clear">
                                            <Text
                                                variant="caption-2"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {advertSemantics.clusters.length}
                                                <div style={{width: 3}} />
                                                <Icon size={11} data={Eye} />
                                            </Text>
                                        </Label>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {advertSemantics.excluded.length ? (
                                    <>
                                        <div style={{width: 5}} />
                                        <Label theme="clear">
                                            <Text
                                                variant="caption-2"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {advertSemantics.excluded.length}
                                                <div style={{width: 3}} />
                                                <Icon size={11} data={EyeSlash} />
                                            </Text>
                                        </Label>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <div style={{width: 5}} />
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        style={{
                            height: 70,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        animate={{
                            opacity: !isWarningBeforeDeleteConfirmationRow ? 0 : 1,
                            pointerEvents: !isWarningBeforeDeleteConfirmationRow ? 'none' : 'auto',
                            y: !isWarningBeforeDeleteConfirmationRow ? 0 : -76 + 4,
                        }}
                        transition={{
                            duration: 0.1,
                            delay: isWarningBeforeDeleteConfirmationRow ? 0.05 : 0,
                        }}
                    >
                        <Text variant="subheader-1">{'Удалить РК?'}</Text>
                        <div style={{minHeight: 4}} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <Button
                                view={'outlined-danger'}
                                onClick={async () => {
                                    setWarningBeforeDeleteConfirmation(() => {
                                        setWarningBeforeDeleteConfirmationRow(0);
                                        return false;
                                    });

                                    const res = await manageAdvertsActivityCallFunc(
                                        'stop',
                                        advertId,
                                    );
                                    console.log(res);
                                    if (!res || res['data'] === undefined) {
                                        return;
                                    }

                                    if (res['data']['status'] == 'ok') {
                                        doc.adverts[selectValue[0]][advertId] = undefined;
                                    }
                                    setChangedDoc(doc);
                                }}
                            >
                                Удалить
                            </Button>
                            <div style={{minWidth: 8}} />
                            <Button
                                view={'outlined'}
                                onClick={() => {
                                    setWarningBeforeDeleteConfirmation(() => {
                                        setWarningBeforeDeleteConfirmationRow(0);
                                        return false;
                                    });
                                }}
                            >
                                Отмена
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Card>
        );
    };

    const renderSlashPercent = ({value, row}, key) => {
        const keyVal = row[key];
        if (value === undefined) return undefined;
        const percent = Math.round(((value as number) / keyVal) * 100);
        return (
            <Text>{`${value} ${
                isNaN(percent) || !isFinite(percent) || !value || !keyVal
                    ? ''
                    : '/ ' + percent + '%'
            }`}</Text>
        );
    };

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, row, footer, index}) => {
                const {title, brand, object, nmId, photos, imtId, art} = row;

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
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            pin="round-clear"
                                            view="outlined"
                                            onClick={() => {
                                                setAdvertsArtsListModalFromOpen(true);
                                                const adverts = doc.adverts[selectValue[0]];
                                                const temp = [] as any[];
                                                if (adverts) {
                                                    for (const [_, advertData] of Object.entries(
                                                        adverts,
                                                    )) {
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
                                        <Button
                                            size="xs"
                                            pin="brick-clear"
                                            view="outlined"
                                            onClick={() => {
                                                setAdvertsArtsListModalFromOpen(true);
                                                const adverts = row.adverts;
                                                const temp = [] as any[];
                                                if (adverts) {
                                                    for (const [_, advertData] of Object.entries(
                                                        adverts,
                                                    )) {
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
                                        <Button
                                            pin="brick-round"
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
                                    </div>
                                </div>
                                <div style={{width: 4}} />
                                <div style={{display: 'flex', flexDirection: 'column'}}>
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
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
            valueType: 'text',
            group: true,
        },
        {
            name: 'adverts',
            placeholder: 'Реклама',
            valueType: 'text',
            additionalNodes: [
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
                            </div>
                        }
                    />
                </div>,
            ],
            render: ({value, row, index}) => {
                if (value === null || value === undefined) return;
                if (typeof value === 'number') {
                    return <Text>{`Уникальных Id: ${value}`}</Text>;
                }

                const {art} = row;

                const switches: any[] = [];
                for (const [advertId, _] of Object.entries(value)) {
                    const advertData = doc.adverts[selectValue[0]][advertId];
                    if (!advertData) continue;

                    switches.push(generateAdvertCard(advertId, index, art));
                    switches.push(<div style={{minWidth: 8}} />);
                }
                switches.pop();

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: 96,
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
            render: ({row}) => {
                const {placementsValue} = row ?? {};
                if (!placementsValue) return undefined;
                const {reviewRating, sizes, feedbacks} = placementsValue;
                if (!reviewRating) return undefined;
                const {price} = sizes ? sizes[0] ?? {price: undefined} : {price: undefined};
                const {total} = price ?? {total: 0};
                const priceRub = Math.round(total / 100);
                // console.log(placementsValue);

                // const timelineBudget: any[] = [];
                // const graphsDataBudgets: any[] = [];
                // const graphsDataBudgetsDiv: any[] = [];
                // const graphsDataBudgetsDivHours = {};
                // if (budgetLog) {
                //     for (let i = 0; i < budgetLog.length; i++) {
                //         const {budget, time} = budgetLog[i];
                //         if (!time || !budget) continue;

                //         const timeObj = new Date(time);

                //         timeObj.setMinutes(Math.floor(timeObj.getMinutes() / 15) * 15);

                //         const lbd = new Date(dateRange[0]);
                //         lbd.setHours(0, 0, 0, 0);
                //         const rbd = new Date(dateRange[1]);
                //         rbd.setHours(23, 59, 59);
                //         if (timeObj < lbd || timeObj > rbd) continue;
                //         timelineBudget.push(timeObj.getTime());
                //         graphsDataBudgets.push(budget);

                //         const hour = time.slice(0, 13);
                //         if (!graphsDataBudgetsDivHours[hour])
                //             graphsDataBudgetsDivHours[hour] = budget;
                //     }
                //     let prevHour = '';
                //     for (let i = 0; i < timelineBudget.length; i++) {
                //         const dateObj = new Date(timelineBudget[i]);
                //         const time = dateObj.toISOString();
                //         if (dateObj.getMinutes() != 0) {
                //             graphsDataBudgetsDiv.push(null);
                //             continue;
                //         }
                //         const hour = time.slice(0, 13);
                //         if (prevHour == '') {
                //             graphsDataBudgetsDiv.push(null);
                //             prevHour = hour;
                //             continue;
                //         }

                //         const spent =
                //             graphsDataBudgetsDivHours[prevHour] - graphsDataBudgetsDivHours[hour];
                //         graphsDataBudgetsDiv.push(spent);

                //         prevHour = hour;
                //     }
                // }

                // const yagrBudgetData: YagrWidgetData = {
                //     data: {
                //         timeline: timelineBudget,
                //         graphs: [
                //             {
                //                 id: '0',
                //                 name: 'Баланс',
                //                 scale: 'y',
                //                 color: '#ffbe5c',
                //                 data: graphsDataBudgets,
                //             },
                //             {
                //                 type: 'column',
                //                 data: graphsDataBudgetsDiv,
                //                 id: '1',
                //                 name: 'Расход',
                //                 scale: 'r',
                //             },
                //         ],
                //     },

                //     libraryConfig: {
                //         chart: {
                //             series: {
                //                 spanGaps: false,
                //                 type: 'line',
                //                 interpolation: 'smooth',
                //             },
                //         },
                //         axes: {
                //             y: {
                //                 label: 'Баланс',
                //                 precision: 'auto',
                //                 show: true,
                //             },
                //             r: {
                //                 label: 'Расход',
                //                 precision: 'auto',
                //                 side: 'right',
                //                 show: true,
                //             },
                //             x: {
                //                 label: 'Время',
                //                 precision: 'auto',
                //                 show: true,
                //             },
                //         },
                //         series: [],
                //         scales: {y: {min: 0}, r: {min: 0}},
                //         title: {
                //             text: 'Изменение баланса',
                //         },
                //     },
                // };

                return (
                    <Card style={{height: 96, display: 'flex', flexDirection: 'column'}}>
                        <Button
                            view="flat"
                            width="max"
                            size="xs"
                            pin="clear-clear"
                            style={{
                                overflow: 'hidden',
                                borderTopLeftRadius: 7,
                                borderTopRightRadius: 7,
                            }}
                            // pin="brick-brick"
                        >
                            {`${priceRub} ₽`}
                        </Button>
                        <Button
                            width="max"
                            size="xs"
                            view="outlined"
                            pin="clear-clear"
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
                        <Button
                            style={{
                                overflow: 'hidden',
                            }}
                            width="max"
                            size="xs"
                            view="flat"
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
                                <Text>{feedbacks}</Text>
                                <div style={{minWidth: 3}} />
                                <Icon data={Comment} size={11} />
                            </div>
                        </Button>
                    </Card>
                );
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
                            setChangedDoc(doc);
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

                            setChangedDoc(doc);
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

                            for (let i = 0; i < 9; i++) {
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
                        ? doc.fetchedPlacements[phrase].data[nmId] ?? ({} as any)
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
                                        <div style={{width: 3}} />
                                        <Icon data={ArrowRight} size={13}></Icon>
                                        <div style={{width: 3}} />
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
                const {updateTime, index, phrase, log, firstAdvertIndex, cpmIndex} =
                    placementsValue;
                const {placementsRange} = drrAI ?? {};
                if (phrase == '') return undefined;

                const {position} = log ?? {};

                const findFirstActive = (adverts) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc.adverts[selectValue[0]][id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const fistActiveAdvert = findFirstActive(adverts);
                const advertType = fistActiveAdvert
                    ? fistActiveAdvert.type == 9
                        ? 'search'
                        : 'auto'
                    : 'search';

                const auction = doc.placementsAuctions[selectValue[0]][phrase]
                    ? doc.placementsAuctions[selectValue[0]][phrase][advertType] ?? []
                    : [];

                const updateTimeObj = new Date(updateTime);
                const moreThatHour =
                    new Date().getTime() / 1000 / 3600 - updateTimeObj.getTime() / 1000 / 3600 > 1;

                const {advertId, type, status} = fistActiveAdvert ?? {};

                // console.log(
                //     advertId,
                //     doc.advertsSelectedPhrases[selectValue[0]][advertId]
                //         ? doc.advertsSelectedPhrases[selectValue[0]][advertId].phrase == phrase
                //         : false,
                //     phrase,
                // );

                const isSelectedPhrase = doc.advertsSelectedPhrases[selectValue[0]][advertId]
                    ? doc.advertsSelectedPhrases[selectValue[0]][advertId].phrase == phrase
                    : false;

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
                                    : index +
                                      ` (${
                                          !cpmIndex || cpmIndex == -1 ? 'Не в аукционе' : cpmIndex
                                      })`
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
                                onOpenChange={(open) => {
                                    if (open) resetBidModalFormInputs();
                                }}
                                placement={'bottom-start'}
                                content={
                                    <Card
                                        view="clear"
                                        style={{
                                            height: 'fit-content',
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
                                            <Card
                                                view="outlined"
                                                theme="warning"
                                                style={{
                                                    maxWidth: '60em',
                                                    maxHeight: '30em',
                                                    height: 'fit-content',
                                                    overflow: 'auto',
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
                                                                cpm:
                                                                    advertType == 'search'
                                                                        ? `Аукцион Поиска, ${auction.length} шт.`
                                                                        : `Аукцион Авто, ${auction.length} шт.`,
                                                            },
                                                        ]}
                                                        theme="yandex-cloud"
                                                        onRowClick={(row, index, event) => {
                                                            console.log(row, index, event);
                                                        }}
                                                        rowClassName={(_row, index, isFooterData) =>
                                                            isFooterData
                                                                ? b('tableRow_footer')
                                                                : b('tableRow_' + index)
                                                        }
                                                        columns={columnDataAuction}
                                                        data={auction}
                                                    />
                                                </Card>
                                            </Card>
                                            <div style={{minWidth: 16}} />
                                            <Card
                                                view="outlined"
                                                theme="warning"
                                                style={{height: 'fit-content'}}
                                            >
                                                <Card
                                                    style={{
                                                        background:
                                                            'var(--yc-color-base-background)',
                                                        // height: '100%',
                                                        width: 240,
                                                        overflow: 'auto',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        paddingTop: 20,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            width: '100%',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <Text
                                                                style={{marginLeft: 4}}
                                                                variant="subheader-1"
                                                            >
                                                                {'Метод'}
                                                            </Text>
                                                            <Select
                                                                onUpdate={(nextValue) => {
                                                                    setSelectedValueMethod(
                                                                        nextValue,
                                                                    );
                                                                    if (nextValue[0] == 'По ДРР') {
                                                                        setBidModalRange({
                                                                            from: 0,
                                                                            to: 0,
                                                                        });
                                                                    } else {
                                                                        setBidModalRange({
                                                                            from: 50,
                                                                            to: 50,
                                                                        });
                                                                    }
                                                                }}
                                                                options={selectedValueMethodOptions}
                                                                renderControl={({
                                                                    onClick,
                                                                    onKeyDown,
                                                                    ref,
                                                                }) => {
                                                                    const temp = {};
                                                                    for (
                                                                        let i = 0;
                                                                        i <
                                                                        selectedValueMethodOptions.length;
                                                                        i++
                                                                    ) {
                                                                        const {value, content} =
                                                                            selectedValueMethodOptions[
                                                                                i
                                                                            ];
                                                                        temp[value] = content;
                                                                    }
                                                                    return (
                                                                        <Button
                                                                            style={{width: '100%'}}
                                                                            ref={ref}
                                                                            view="outlined"
                                                                            onClick={onClick}
                                                                            extraProps={{
                                                                                onKeyDown,
                                                                            }}
                                                                        >
                                                                            {
                                                                                temp[
                                                                                    selectedValueMethod[0]
                                                                                ]
                                                                            }
                                                                            <Icon
                                                                                data={ChevronDown}
                                                                            />
                                                                        </Button>
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{minHeight: 4}} />

                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <Text
                                                                style={{marginLeft: 4}}
                                                                variant="subheader-1"
                                                            >
                                                                {'Макс. ставка'}
                                                            </Text>
                                                            <TextInput
                                                                type="number"
                                                                value={String(bidModalMaxBid)}
                                                                onUpdate={(val) => {
                                                                    const intVal = Number(val);

                                                                    setBidModalMaxBidValid(
                                                                        intVal >= 125,
                                                                    );

                                                                    setBidModalMaxBid(intVal);
                                                                }}
                                                                validationState={
                                                                    bidModalMaxBidValid
                                                                        ? undefined
                                                                        : 'invalid'
                                                                }
                                                            />
                                                        </div>
                                                        <div style={{minHeight: 4}} />
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <Text
                                                                style={{marginLeft: 4}}
                                                                variant="subheader-1"
                                                            >
                                                                {'Позиция'}
                                                            </Text>
                                                            <TextInput
                                                                disabled={
                                                                    selectedValueMethod[0] ==
                                                                        'drr' ||
                                                                    selectedValueMethod[0] == 'cpo'
                                                                }
                                                                type="number"
                                                                value={String(bidModalRange.to)}
                                                                onUpdate={(val) => {
                                                                    const intVal = Number(val);

                                                                    setBidModalRange(() => {
                                                                        setBidModalRangeValid(
                                                                            intVal > 0,
                                                                        );
                                                                        return {
                                                                            from: intVal,
                                                                            to: intVal,
                                                                        };
                                                                    });
                                                                }}
                                                                validationState={
                                                                    bidModalRangeValid
                                                                        ? undefined
                                                                        : 'invalid'
                                                                }
                                                            />
                                                        </div>
                                                        <div style={{minHeight: 4}} />
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <Text
                                                                style={{marginLeft: 4}}
                                                                variant="subheader-1"
                                                            >
                                                                {selectedValueMethod[0] == 'cpo'
                                                                    ? 'Целевой CPO'
                                                                    : 'Целевой ДРР'}
                                                            </Text>
                                                            <TextInput
                                                                type="number"
                                                                value={String(
                                                                    bidModalDRRInputValue,
                                                                )}
                                                                onChange={(val) => {
                                                                    const cpo = Number(
                                                                        val.target.value,
                                                                    );
                                                                    if (cpo < 0)
                                                                        setBidModalDRRInputValidationValue(
                                                                            false,
                                                                        );
                                                                    else
                                                                        setBidModalDRRInputValidationValue(
                                                                            true,
                                                                        );
                                                                    setBidModalDRRInputValue(cpo);
                                                                }}
                                                                errorMessage={'Введите не менее 0'}
                                                                validationState={
                                                                    bidModalDRRInputValidationValue
                                                                        ? undefined
                                                                        : 'invalid'
                                                                }
                                                            />
                                                        </div>
                                                        <div style={{minHeight: 8}} />
                                                        {generateModalButtonWithActions(
                                                            {
                                                                disabled: !advertId,
                                                                placeholder: 'Установить',
                                                                icon: CloudArrowUpIn,
                                                                view: 'outlined-success',
                                                                onClick: () => {
                                                                    const params = {
                                                                        uid: getUid(),
                                                                        campaignName:
                                                                            selectValue[0],
                                                                        data: {
                                                                            advertsIds: {},
                                                                            mode: 'Автоставки',
                                                                            stocksThreshold:
                                                                                bidModalStocksThresholdInputValue,
                                                                            placementsRange:
                                                                                bidModalRange,
                                                                            maxBid: bidModalMaxBid,
                                                                            autoBidsMode:
                                                                                selectedValueMethod[0],
                                                                        },
                                                                    };

                                                                    params.data.advertsIds[
                                                                        advertId
                                                                    ] = {
                                                                        desiredDRR:
                                                                            bidModalDRRInputValue,
                                                                        bidStep:
                                                                            bidModalBidStepInputValue,

                                                                        advertId: advertId,
                                                                    };

                                                                    if (
                                                                        !doc.advertsAutoBidsRules[
                                                                            selectValue[0]
                                                                        ][advertId]
                                                                    )
                                                                        doc.advertsAutoBidsRules[
                                                                            selectValue[0]
                                                                        ][advertId] = {};
                                                                    doc.advertsAutoBidsRules[
                                                                        selectValue[0]
                                                                    ][advertId] =
                                                                        bidModalDeleteModeSelected
                                                                            ? undefined
                                                                            : {
                                                                                  desiredDRR:
                                                                                      bidModalDRRInputValue,
                                                                                  placementsRange:
                                                                                      bidModalRange,
                                                                                  maxBid: bidModalMaxBid,
                                                                                  autoBidsMode:
                                                                                      selectedValueMethod[0],
                                                                              };

                                                                    console.log(params);

                                                                    //////////////////////////////////
                                                                    callApi(
                                                                        'setAdvertsCPMs',
                                                                        params,
                                                                    );
                                                                    setChangedDoc(doc);
                                                                    //////////////////////////////////
                                                                },
                                                            },
                                                            selectedButton,
                                                            setSelectedButton,
                                                        )}
                                                    </div>
                                                    <div style={{minHeight: 16}} />
                                                    <Button
                                                        selected
                                                        onClick={() =>
                                                            filterByButton(advertId, 'adverts')
                                                        }
                                                        // style=x{{position: 'relative', top: -2}}
                                                        width="max"
                                                        pin="brick-brick"
                                                        view={
                                                            status
                                                                ? status == 9
                                                                    ? 'flat-success'
                                                                    : status == 11
                                                                    ? 'flat-danger'
                                                                    : 'flat-warning'
                                                                : 'flat'
                                                        }
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Icon
                                                                data={
                                                                    type == 8 ? Rocket : Magnifier
                                                                }
                                                                size={11}
                                                            />
                                                            <div style={{width: 2}} />
                                                            {advertId}
                                                        </div>
                                                    </Button>
                                                </Card>
                                            </Card>
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

                                        setChangedDoc(doc);

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
                        <Text
                            color={
                                placementsRange &&
                                firstAdvertIndex > placementsRange.from &&
                                placementsRange.from
                                    ? 'danger'
                                    : 'primary'
                            }
                        >{`Позиция первой карточки с РК: ${
                            firstAdvertIndex ? firstAdvertIndex[advertType] : 'Нет данных'
                        }`}</Text>
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
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'orders', placeholder: 'Заказов, шт.'},
        {name: 'sum_orders', placeholder: 'Заказов, ₽'},
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: ({value, row}) => {
                const findFirstActive = (adverts) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc.adverts[selectValue[0]][id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const {adverts} = row;
                const fistActiveAdvert = findFirstActive(adverts);

                const drrAI = fistActiveAdvert
                    ? doc.advertsAutoBidsRules[selectValue[0]][fistActiveAdvert.advertId]
                    : undefined;
                const {desiredDRR, autoBidsMode} = drrAI ?? {};

                return (
                    <Text
                        color={
                            desiredDRR
                                ? autoBidsMode != 'cpo'
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
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value, row}) => {
                const findFirstActive = (adverts) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc.adverts[selectValue[0]][id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const {adverts} = row;
                const fistActiveAdvert = findFirstActive(adverts);

                const drrAI = fistActiveAdvert
                    ? doc.advertsAutoBidsRules[selectValue[0]][fistActiveAdvert.advertId]
                    : undefined;
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
        {name: 'views', placeholder: 'Показов, шт.'},
        {
            name: 'clicks',
            placeholder: 'Кликов, шт.',
            render: (args) => renderSlashPercent(args, 'openCardCount'),
        },
        {name: 'ctr', placeholder: 'CTR, %'},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'cr', placeholder: 'CR, %'},
        {name: 'openCardCount', placeholder: 'Всего переходов, шт.'},
        {name: 'addToCartPercent', placeholder: 'CR в корзину, %'},
        {name: 'cartToOrderPercent', placeholder: 'CR в заказ, %'},
    ];

    const [filteredSummary, setFilteredSummary] = useState({
        art: '',
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        stocks: 0,
        sum_orders: 0,
        adverts: 0,
        semantics: null,
    });

    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [sort, setSort] = React.useState<any[]>([{column: 'Расход', order: 'asc'}]);
    // const [doc, setUserDoc] = React.useState(getUserDoc());
    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

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

        await callApi('getMassAdvertsNew', params)
            .then((response) => {
                setFetchingDataFromServerFlag(false);
                // console.log(response);
                if (!response) return;
                const resData = response['data'];
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
            const {data, updateTime} = phraseData as any;
            if (!data || !updateTime) continue;
            if (!Object.keys(data).length) continue;
            if (!doc.fetchedPlacements[phrase]) doc.fetchedPlacements[phrase] = {};
            if (
                !doc.fetchedPlacements[phrase]['data'] ||
                (doc.fetchedPlacements[phrase]['updateTime'] &&
                    new Date(doc.fetchedPlacements[phrase]['updateTime']).getTime() / 1000 / 60 > 2)
            )
                doc.fetchedPlacements[phrase]['data'] = {};
            doc.fetchedPlacements[phrase]['updateTime'] = updateTime;
            Object.assign(doc.fetchedPlacements[phrase]['data'], data);
        }

        console.log(doc);
        setChangedDoc(doc);

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
    const [startDate, endDate] = dateRange;
    const fieldRef = useRef(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    // console.log(doc);
    // const lbdDate: DateTime =;
    // lbdDate.subtract(90, 'day');
    // setLbd(new Date());

    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        ctr: 0,
        sum: 0,
        drr_orders: 0,
        drr_sales: 0,
        sales: 0,
        sum_sales: 0,
        sum_orders: 0,
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
    const recalc = (daterng, selected = '', withfFilters = {}) => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const summaryTemp = {
            views: 0,
            clicks: 0,
            ctr: 0,
            sum: 0,
            sales: 0,
            drr_orders: 0,
            drr_sales: 0,
            sum_orders: 0,
            sum_sales: 0,
        };

        const _selectedCampaignName = selected == '' ? selectValue[0] : selected;
        const campaignData = doc ? (doc.campaigns ? doc.campaigns[_selectedCampaignName] : {}) : {};
        const temp = {};
        for (const [art, artData] of Object.entries(campaignData)) {
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
                advertsManagerRules: undefined,
                advertsStocksThreshold: undefined,
                placements: undefined,
                placementsValue: undefined,
                drrAI: {},
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
                sales: 0,
                sum_sales: 0,
                openCardCount: 0,
                addToCartPercent: 0,
                cartToOrderPercent: 0,
            };

            artInfo.art = artData['art'];
            artInfo.photos = artData['photos'];
            artInfo.imtId = artData['imtId'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];
            artInfo.adverts = artData['adverts'];
            artInfo.advertsManagerRules = artData['advertsManagerRules'];
            artInfo.advertsStocksThreshold = artData['advertsStocksThreshold'];
            artInfo.placementsValue = artData['placements'];
            artInfo.plusPhrasesTemplate = artData['plusPhrasesTemplate'];
            artInfo.placements = artData['placements'] ? artData['placements'].index : undefined;

            // console.log(artInfo);

            if (artInfo.adverts) {
                for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
                    if (!advertType || advertType == 'none' || !advertsOfType) continue;

                    for (const [advertId, _] of Object.entries(advertsOfType)) {
                        if (!advertId) continue;
                        const advertData = doc.adverts[_selectedCampaignName][advertId];
                        if (!advertData) continue;
                        const status = advertData['status'];
                        if (![4, 9, 11].includes(status)) continue;

                        artInfo.budget[advertId] = advertData['budget'];

                        artInfo.bid[advertId] = advertData['cpm'];

                        artInfo.semantics[advertId] = advertData['words'];

                        artInfo.drrAI[advertId] =
                            doc.advertsAutoBidsRules[_selectedCampaignName][advertId];
                        artInfo.budgetToKeep[advertId] =
                            doc.advertsBudgetsToKeep[_selectedCampaignName][advertId];
                        artInfo.advertsSelectedPhrases[advertId] =
                            doc.advertsSelectedPhrases[_selectedCampaignName][advertId];
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

                    const {openCardCount, addToCartPercent, cartToOrderPercent} = artData[
                        'nmFullDetailReport'
                    ]
                        ? artData['nmFullDetailReport'].statistics[strDate] ?? {
                              openCardCount: 0,
                              addToCartPercent: 0,
                              cartToOrderPercent: 0,
                          }
                        : {
                              openCardCount: 0,
                              addToCartPercent: 0,
                              cartToOrderPercent: 0,
                          };

                    artInfo.openCardCount += openCardCount;
                    artInfo.addToCartPercent += addToCartPercent;
                    artInfo.cartToOrderPercent += cartToOrderPercent;
                }
                artInfo.openCardCount = Math.round(artInfo.openCardCount);

                const daysBetween = (endDate.getTime() - startDate.getTime()) / 86400 / 1000 + 1;
                artInfo.addToCartPercent = getRoundValue(artInfo.addToCartPercent, daysBetween);
                artInfo.cartToOrderPercent = getRoundValue(artInfo.cartToOrderPercent, daysBetween);

                artInfo.sum_orders = Math.round(artInfo.sum_orders);
                artInfo.orders = Math.round(artInfo.orders * 100) / 100;
                artInfo.sum_sales = Math.round(artInfo.sum_sales);
                artInfo.sales = Math.round(artInfo.sales * 100) / 100;
                artInfo.sum = Math.round(artInfo.sum);
                artInfo.views = Math.round(artInfo.views);
                artInfo.clicks = Math.round(artInfo.clicks);

                artInfo.drr = getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1);
                artInfo.ctr = getRoundValue(artInfo.clicks, artInfo.views, true);
                artInfo.cpc = getRoundValue(artInfo.sum, artInfo.clicks);
                artInfo.cpm = getRoundValue(artInfo.sum * 1000, artInfo.views);
                artInfo.cr = getRoundValue(artInfo.orders, artInfo.views, true);
                artInfo.cpo = getRoundValue(artInfo.sum, artInfo.orders, false, artInfo.sum);

                summaryTemp.sum_orders += artInfo.sum_orders;
                summaryTemp.sum_sales += artInfo.sum_sales;
                summaryTemp.sales += artInfo.sales;
                summaryTemp.sum += artInfo.sum;
                summaryTemp.views += artInfo.views;
                summaryTemp.clicks += artInfo.clicks;
            }

            temp[art] = artInfo;
        }

        summaryTemp.sum_orders = Math.round(summaryTemp.sum_orders);
        summaryTemp.sum_sales = Math.round(summaryTemp.sum_sales);
        summaryTemp.ctr = getRoundValue(summaryTemp.clicks, summaryTemp.views, true);
        summaryTemp.drr_orders = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
        summaryTemp.drr_sales = getRoundValue(summaryTemp.sum, summaryTemp.sum_sales, true, 1);

        setSummary(summaryTemp);
        setTableData(temp);

        filterTableData(withfFilters, temp);
    };

    const getBalanceYagrData = () => {
        const balanceLog = doc.balances[selectValue[0]] ? doc.balances[selectValue[0]].data : {};
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

    const filterTableData = (withfFilters = {}, tableData = {}) => {
        const temp = [] as any;

        for (const [art, artInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!art || !artInfo) continue;

            const tempTypeRow = artInfo;
            tempTypeRow['placements'] =
                artInfo['placements'] == -1 ? 10 * 1000 : artInfo['placements'];

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '' && filterArg != 'placements') continue;
                if (filterArg == 'art') {
                    const rulesForAnd = filterData['val'].split('+');
                    // console.log(rulesForAnd);

                    let wholeText = '';
                    for (const key of ['art', 'title', 'brand', 'nmId', 'imtId', 'object']) {
                        wholeText += tempTypeRow[key] + ' ';
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
                    const fldata = filterData['val'];
                    const adverts = tempTypeRow[filterArg];

                    if (fldata == '+' || fldata == '+ ') {
                        if (adverts) continue;
                    } else if (fldata == '-' || fldata == '- ') {
                        if (!adverts) continue;
                    }

                    const rulesForAnd = [fldata];
                    // console.log(rulesForAnd);

                    let wholeText = '';
                    if (adverts)
                        for (const [id, _] of Object.entries(adverts)) {
                            wholeText += id + ' ';
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
        const paginatedDataTemp = temp.slice(0, 100);
        const filteredSummaryTemp = {
            art: `На странице: ${paginatedDataTemp.length} Всего: ${temp.length}`,
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
            stocks: 0,
            cpo: 0,
            adverts: 0,
            semantics: null,
            budget: 0,
            openCardCount: 0,
            addToCartPercent: 0,
            cartToOrderPercent: 0,
        };
        const uniqueAdvertsIds: any[] = [];
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            // const art = row['art'];
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
            filteredSummaryTemp.budget += row['budget'] ?? 0;
            filteredSummaryTemp.openCardCount += row['openCardCount'];
            filteredSummaryTemp.addToCartPercent += row['addToCartPercent'];
            filteredSummaryTemp.cartToOrderPercent += row['cartToOrderPercent'];
        }
        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        filteredSummaryTemp.stocks = Math.round(filteredSummaryTemp.stocks);
        filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
        filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
        filteredSummaryTemp.adverts = uniqueAdvertsIds.length;

        filteredSummaryTemp.openCardCount = Math.round(filteredSummaryTemp.openCardCount);
        filteredSummaryTemp.addToCartPercent = getRoundValue(
            filteredSummaryTemp.addToCartPercent,
            temp.length,
        );
        filteredSummaryTemp.addToCartPercent = getRoundValue(
            filteredSummaryTemp.addToCartPercent,
            temp.length,
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
            filteredSummaryTemp.sum,
            filteredSummaryTemp.clicks,
        );
        filteredSummaryTemp.cpm = getRoundValue(
            filteredSummaryTemp.sum * 1000,
            filteredSummaryTemp.views,
        );
        filteredSummaryTemp.cr = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.views,
            true,
        );
        filteredSummaryTemp.cpo = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.orders,
            false,
            filteredSummaryTemp.sum,
        );
        setFilteredSummary(filteredSummaryTemp);

        setFilteredData(temp);

        setPaginatedData(paginatedDataTemp);
        setPagesCurrent(1);
        setPagesTotal(Math.ceil(temp.length));
    };

    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = React.useState(false);
    const [fetchingDataFromServerFlag, setFetchingDataFromServerFlag] = React.useState(false);
    const [selectedValueMethodOptions] = React.useState<SelectOption<any>[]>([
        {
            value: 'placements',
            content: 'Место в выдаче',
        },
        {
            value: 'auction',
            content: 'Позиция в аукционе',
        },
        {
            value: 'drr',
            content: 'Целевой ДРР',
        },
        {
            value: 'cpo',
            content: 'Целевой CPO',
        },
    ]);
    const [selectedValueMethod, setSelectedValueMethod] = React.useState<string[]>(['placements']);

    const [firstRecalc, setFirstRecalc] = useState(false);
    // const [secondRecalcForSticky, setSecondRecalcForSticky] = useState(false);

    const openBudgetModalForm = () => {
        setSelectedButton('');
        setBudgetModalBudgetInputValue(1000);
        setBudgetModalSwitchValue('Пополнить');
        setBudgetModalBudgetInputValidationValue(true);
        setModalOpenFromAdvertId('');
        setBudgetModalFormOpen(true);
    };
    const resetBidModalFormInputs = () => {
        setSelectedButton('');
        setBidModalBidInputValue(125);
        setBidModalSwitchValue('Установить');
        setBidModalBidInputValidationValue(true);
        setBidModalDeleteModeSelected(false);
        setBidModalBidStepInputValue(5);
        setModalOpenFromAdvertId('');
        setBidModalRange({from: 50, to: 50});
        setSelectedValueMethod([selectedValueMethodOptions[0].value]);
        setBidModalRangeValid(true);
        setBidModalMaxBid(500);
        setBidModalMaxBidValid(true);
        setBidModalBidStepInputValidationValue(true);
        setBidModalStocksThresholdInputValue(5);
        setBidModalStocksThresholdInputValidationValue(true);
        setBidModalDRRInputValue(10);
        setBidModalDRRInputValidationValue(true);
    };
    const openBidModalForm = () => {
        resetBidModalFormInputs();
        setBidModalFormOpen(true);
    };

    const [changedColumns, setChangedColumns] = useState<any>(false);

    const columnDataSemantics = [
        {
            name: 'preset',
            valueType: 'text',
            placeholder: 'Пресет',
            render: ({value}) => {
                const bad =
                    semanticsModalSemanticsItemsValuePresets.includes(value) &&
                    semanticsModalSemanticsMinusItemsValuePresets.includes(value);
                return (
                    <div
                        style={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {bad ? (
                            <Button
                                size="xs"
                                view={'flat-danger'}
                                onClick={() =>
                                    filterByButtonClusters(value, false, 'preset', 'include')
                                }
                            >
                                {value}
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                view={'flat'}
                                onClick={() =>
                                    filterByButtonClusters(value, true, 'preset', 'include')
                                }
                            >
                                <Text color="primary">{value}</Text>
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            additionalNodes: [] as any[],
            width: 200,
            name: 'cluster',
            placeholder: 'Кластер',
            valueType: 'text',
            render: ({value}) => {
                if (value.summary !== undefined) {
                    return <Text>{`Всего: ${value.summary}`}</Text>;
                }

                let valueWrapped = value;
                let curStrLen = 0;
                if (value.length > 30) {
                    valueWrapped = '';
                    const titleArr = value.split(' ');
                    for (const word of titleArr) {
                        valueWrapped += word;
                        curStrLen += word.length;
                        if (curStrLen > 40) {
                            valueWrapped += '\n';
                            curStrLen = 0;
                        } else {
                            valueWrapped += ' ';
                            curStrLen++;
                        }
                    }
                }

                const isSelected =
                    (doc['advertsSelectedPhrases'][selectValue[0]][modalOpenFromAdvertId]
                        ? doc['advertsSelectedPhrases'][selectValue[0]][modalOpenFromAdvertId]
                              .phrase
                        : '') == value;

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{whiteSpace: 'pre-wrap'}}>{valueWrapped}</Text>
                        <div style={{width: 8}} />
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
                            <div style={{width: 4}} />
                            <Button
                                size="xs"
                                view={isSelected ? 'outlined-success' : 'outlined'}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (
                                        !doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ]
                                    )
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ] = {
                                            phrase: '',
                                        };

                                    if (isSelected) {
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ] = undefined;
                                    } else {
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ].phrase = value;
                                    }

                                    setChangedDoc(doc);

                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            mode: isSelected ? 'Удалить' : 'Установить',
                                            advertsIds: {},
                                        },
                                    };
                                    params.data.advertsIds[modalOpenFromAdvertId] = {};
                                    params.data.advertsIds[modalOpenFromAdvertId].phrase = value;
                                    console.log(params);

                                    callApi('updateAdvertsSelectedPhrases', params);
                                }}
                            >
                                <Icon data={ArrowShapeUp} />
                            </Button>
                            <div style={{width: 4}} />
                            <Button
                                size="xs"
                                view={
                                    semanticsModalSemanticsPlusItemsValue.includes(value)
                                        ? 'outlined-warning'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                    const cluster = value;
                                    if (!val.includes(cluster)) {
                                        val.push(cluster);
                                    } else {
                                        val = val.filter((value) => value != cluster);
                                    }

                                    setSemanticsModalSemanticsPlusItemsValue(val);
                                }}
                            >
                                <Icon data={Plus} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'freq',
            placeholder: 'Частота',
        },
        {
            name: 'count',
            placeholder: 'Показов, шт',
        },
        {
            name: 'clicks',
            placeholder: 'Кликов, шт',
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
        },
        {
            name: 'placements',
            placeholder: 'Позиция, №',
            render: ({value, row}) => {
                if (value === null) return;
                const {cluster} = row;
                return (
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            size="xs"
                            view="flat"
                            onClick={(event) => {
                                event.stopPropagation();
                                parseFirst10Pages(
                                    cluster,
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                );
                            }}
                        >
                            {doc.fetchedPlacements[cluster] &&
                            doc.campaigns[selectValue[0]][semanticsModalOpenFromArt] ? (
                                doc.fetchedPlacements[cluster].data[
                                    doc.campaigns[selectValue[0]][semanticsModalOpenFromArt].nmId
                                ] ? (
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log &&
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log.position !== undefined ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text color="secondary">{`${
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].log.position + 1
                                            }`}</Text>
                                            <div style={{width: 3}} />
                                            <Icon data={ArrowRight} size={13}></Icon>
                                            <div style={{width: 3}} />
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </>
                                    )
                                ) : (
                                    'Нет в выдаче'
                                )
                            ) : (
                                '№'
                            )}
                            <Icon size={12} data={LayoutHeader} />
                        </Button>
                        {currentParsingProgress[cluster] &&
                        currentParsingProgress[cluster].progress !== undefined &&
                        currentParsingProgress[cluster].progress !=
                            currentParsingProgress[cluster].max ? (
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{width: 4}} />
                                {currentParsingProgress[cluster].error ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {`${
                                            currentParsingProgress[cluster].progress / 100
                                        }/20 стр.`}
                                        <div style={{width: 3}} />
                                        <Icon size={12} data={TriangleExclamation} />
                                    </div>
                                ) : (
                                    <Spin size="xs" />
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
    ];
    const columnDataSemantics2 = [
        {
            name: 'preset',
            valueType: 'text',
            placeholder: 'Пресет',
            render: ({value}) => {
                const bad =
                    semanticsModalSemanticsItemsValuePresets.includes(value) &&
                    semanticsModalSemanticsMinusItemsValuePresets.includes(value);
                return (
                    <div
                        style={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {bad ? (
                            <Button
                                size="xs"
                                view={'flat-danger'}
                                onClick={() =>
                                    filterByButtonClusters(value, true, 'preset', 'include')
                                }
                            >
                                {value}
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                view={'flat'}
                                onClick={() =>
                                    filterByButtonClusters(value, false, 'preset', 'include')
                                }
                            >
                                <Text color="primary">{value}</Text>
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            additionalNodes: [] as any[],
            width: 200,
            name: 'cluster',
            placeholder: 'Кластер',
            valueType: 'text',
            render: ({value}) => {
                if (value.summary !== undefined) {
                    return <Text>{`Всего: ${value.summary}`}</Text>;
                }

                let valueWrapped = value;
                let curStrLen = 0;
                if (value.length > 30) {
                    valueWrapped = '';
                    const titleArr = value.split(' ');
                    for (const word of titleArr) {
                        valueWrapped += word;
                        curStrLen += word.length;
                        if (curStrLen > 40) {
                            valueWrapped += '\n';
                            curStrLen = 0;
                        } else {
                            valueWrapped += ' ';
                            curStrLen++;
                        }
                    }
                }

                const isSelected =
                    (doc['advertsSelectedPhrases'][selectValue[0]][modalOpenFromAdvertId]
                        ? doc['advertsSelectedPhrases'][selectValue[0]][modalOpenFromAdvertId]
                              .phrase
                        : '') == value;

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{whiteSpace: 'pre-wrap'}}>{valueWrapped}</Text>
                        <div style={{width: 8}} />
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
                            <div style={{width: 4}} />
                            <Button
                                size="xs"
                                view={isSelected ? 'outlined-success' : 'outlined'}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (
                                        !doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ]
                                    )
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ] = {
                                            phrase: '',
                                        };

                                    if (isSelected) {
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ] = undefined;
                                    } else {
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            modalOpenFromAdvertId
                                        ].phrase = value;
                                    }

                                    setChangedDoc(doc);

                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            mode: isSelected ? 'Удалить' : 'Установить',
                                            advertsIds: {},
                                        },
                                    };
                                    params.data.advertsIds[modalOpenFromAdvertId] = {};
                                    params.data.advertsIds[modalOpenFromAdvertId].phrase = value;
                                    console.log(params);

                                    callApi('updateAdvertsSelectedPhrases', params);
                                }}
                            >
                                <Icon data={ArrowShapeUp} />
                            </Button>
                            <div style={{width: 4}} />
                            <Button
                                size="xs"
                                view={
                                    semanticsModalSemanticsPlusItemsValue.includes(value)
                                        ? 'outlined-warning'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                    const cluster = value;
                                    if (!val.includes(cluster)) {
                                        val.push(cluster);
                                    } else {
                                        val = val.filter((value) => value != cluster);
                                    }

                                    setSemanticsModalSemanticsPlusItemsValue(val);
                                }}
                            >
                                <Icon data={Plus} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'freq',
            placeholder: 'Частота',
        },
        {
            name: 'count',
            placeholder: 'Показов, шт',
        },
        {
            name: 'clicks',
            placeholder: 'Кликов, шт',
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
        },
        {
            name: 'placements',
            placeholder: 'Позиция, №',
            render: ({value, row}) => {
                if (value === null) return;
                const {cluster} = row;
                return (
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            size="xs"
                            view="flat"
                            onClick={(event) => {
                                event.stopPropagation();
                                parseFirst10Pages(
                                    cluster,
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                );
                            }}
                        >
                            {doc.fetchedPlacements[cluster] &&
                            doc.campaigns[selectValue[0]][semanticsModalOpenFromArt] ? (
                                doc.fetchedPlacements[cluster].data[
                                    doc.campaigns[selectValue[0]][semanticsModalOpenFromArt].nmId
                                ] ? (
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log &&
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log.position !== undefined ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text color="secondary">{`${
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].log.position + 1
                                            }`}</Text>
                                            <div style={{width: 3}} />
                                            <Icon data={ArrowRight} size={13}></Icon>
                                            <div style={{width: 3}} />
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </>
                                    )
                                ) : (
                                    'Нет в выдаче'
                                )
                            ) : (
                                '№'
                            )}
                            <Icon size={12} data={LayoutHeader} />
                        </Button>
                        {currentParsingProgress[cluster] &&
                        currentParsingProgress[cluster].progress !== undefined &&
                        currentParsingProgress[cluster].progress !=
                            currentParsingProgress[cluster].max ? (
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{width: 4}} />
                                {currentParsingProgress[cluster].error ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {`${
                                            currentParsingProgress[cluster].progress / 100
                                        }/20 стр.`}
                                        <div style={{width: 3}} />
                                        <Icon size={12} data={TriangleExclamation} />
                                    </div>
                                ) : (
                                    <Spin size="xs" />
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
    ];

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
                if (typeof value === 'number') return `Всего: ${value}`;
                return <Text>{(value as Date).toLocaleDateString('ru-RU').slice(0, 10)}</Text>;
            },
        },
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'orders', placeholder: 'Заказов, шт.'},
        {name: 'sum_orders', placeholder: 'Заказов, ₽'},
        {
            name: 'drr',
            placeholder: 'ДРР, %',
        },
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
        },
        {name: 'views', placeholder: 'Показов, шт.'},
        {name: 'clicks', placeholder: 'Кликов, шт.'},
        {name: 'ctr', placeholder: 'CTR, %'},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'cr', placeholder: 'CR, %'},
        {name: 'openCardCount', placeholder: 'Всего кликов, шт.'},
        {name: 'addToCartPercent', placeholder: 'Конверсия в корзину, %'},
        {name: 'cartToOrderPercent', placeholder: 'Конверсия в заказ, %'},
    ];

    const columnDataAuction = [
        {
            header: '#',
            name: 'index',
            sortable: false,
            render: ({index, footer}) => {
                const displayIndex = index + 1;
                return footer ? undefined : (
                    <Button
                        width="max"
                        size="xs"
                        view="flat"
                        onClick={() => {
                            setSelectedValueMethod(['auction']);
                            setBidModalRangeValid(displayIndex > 0);
                            setBidModalRange({
                                from: displayIndex,
                                to: displayIndex,
                            });
                        }}
                    >
                        {displayIndex}
                    </Button>
                );
            },
        },
        {
            header: 'Ставка',
            name: 'cpm',
            render: ({value, footer}) => {
                return footer ? (
                    value
                ) : (
                    <Button
                        size="xs"
                        view="flat"
                        onClick={() => {
                            const maxBid = (value as number) + 1;
                            setBidModalMaxBidValid(maxBid >= 125);
                            setBidModalMaxBid(maxBid);
                        }}
                    >
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
                const displayIndex = (value as number) + 1;
                return (
                    <Button
                        size="xs"
                        view="flat"
                        onClick={() => {
                            setSelectedValueMethod(['placements']);
                            setBidModalRangeValid(displayIndex > 0);
                            setBidModalRange({
                                from: displayIndex,
                                to: displayIndex,
                            });
                        }}
                    >
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
        },
        // {
        //     header: 'Наименование',
        //     name: 'name',
        // },
        // {
        //     header: 'Поставщик',
        //     name: 'supplier',
        // },
    ] as Column<any>[];
    // const auctionColumns = generateColumns(
    //     columnDataAuction,
    //     auctionFilters,
    //     setAuctionFilters,
    //     filterAuctionData,
    // );

    const renameFirstColumn = (colss, newName: string, additionalNodes = [] as any[]) => {
        const index = 1;
        const columnDataSemanticsCopy = Array.from(colss) as any[];
        columnDataSemanticsCopy[index].placeholder = newName;
        columnDataSemanticsCopy[index].additionalNodes = additionalNodes;
        return columnDataSemanticsCopy;
    };
    const generateMassAddDelButton = ({placeholder, array, mode}) => {
        return (
            <Button
                style={{marginLeft: 8}}
                view="outlined"
                onClick={() => {
                    const val = [] as any[];
                    if (mode == 'add') {
                        val.push(...Array.from(semanticsModalSemanticsPlusItemsValue));
                        for (let i = 0; i < array.length; i++) {
                            const cluster = array[i].cluster;
                            if (val.includes(cluster)) continue;
                            val.push(cluster);
                        }
                    } else if (mode == 'del') {
                        const clustersToDel = [] as string[];
                        for (const clusterData of array) clustersToDel.push(clusterData.cluster);
                        for (let i = 0; i < semanticsModalSemanticsPlusItemsValue.length; i++) {
                            const cluster = semanticsModalSemanticsPlusItemsValue[i];
                            if (clustersToDel.includes(cluster)) continue;
                            if (val.includes(cluster)) continue;
                            val.push(cluster);
                        }
                    }

                    setSemanticsModalSemanticsPlusItemsValue(val);
                }}
            >
                {placeholder}
            </Button>
        );
    };
    // console.log(columnsSemanticsTemplate);

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc(dateRange);
    }

    if (changedColumns) {
        setChangedColumns(false);
    }

    if (!doc) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(doc['campaigns'])) {
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
            } else if (Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594') {
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
        const selected =
            campaignsNames[
                Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594' ? 2 : 0
            ]['value'];
        setSelectValue([selected]);
        console.log(doc);

        for (let i = 0; i < columnData.length; i++) {
            const {name, valueType} = columnData[i];
            if (!name) continue;
            if (!filters[name])
                filters[name] = {val: '', compMode: valueType != 'text' ? 'bigger' : 'include'};
        }
        setFilters(filters);

        recalc(dateRange, selected);

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
        const uniqueAdverts = {};
        for (let i = 0; i < filteredData.length; i++) {
            const {adverts} = filteredData[i];
            if (setManageModalOpen === undefined) continue;
            if (!adverts) continue;
            for (const [id, _] of Object.entries(adverts)) {
                if (!id) continue;
                const advertData = doc.adverts[selectValue[0]][id];
                if (!advertData) continue;
                const {advertId} = advertData;
                if (!advertId) continue;
                uniqueAdverts[advertId] = {advertId: advertId};
            }
        }
        return uniqueAdverts;
    };

    const manageAdvertsActivityOnClick = async (mode, newStatus) => {
        setManageModalOpen(false);
        setManageModalInProgress(true);
        const uniqueAdverts = getUniqueAdvertIdsFromThePage();
        for (const [id, advertData] of Object.entries(uniqueAdverts)) {
            if (!id || !advertData) continue;
            const {advertId} = advertData as any;
            const res = await manageAdvertsActivityCallFunc(mode, advertId);
            console.log(res);
            if (!res || res['data'] === undefined) {
                return;
            }

            if (res['data']['status'] == 'ok') {
                if (newStatus) {
                    doc.adverts[selectValue[0]][advertId].status = newStatus;
                } else {
                    doc.adverts[selectValue[0]][advertId] = undefined;
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
            setChangedDoc(doc);
        }
        setManageModalInProgress(false);
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
                    margin: '8px 0',
                }}
            >
                {generateCard({summary, key: 'sum_orders', placeholder: 'Заказов, ₽'})}
                {generateCard({summary, key: 'sum_sales', placeholder: 'Продаж, ₽'})}
                {/* {generateCard({summary, key: 'sales', placeholder: 'Продаж, шт'})} */}
                {generateCard({summary, key: 'sum', placeholder: 'Расход, ₽'})}
                {generateCard({summary, key: 'drr_orders', placeholder: 'ДРР к заказам, %'})}
                {generateCard({summary, key: 'drr_sales', placeholder: 'ДРР к продажам, %'})}
                {generateCard({summary, key: 'views', placeholder: 'Показов, шт.'})}
                {generateCard({summary, key: 'clicks', placeholder: 'Кликов, шт.'})}
                {generateCard({summary, key: 'ctr', placeholder: 'CTR, %'})}
            </div>
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
                        <Button
                            loading={manageModalInProgress}
                            view="action"
                            size="l"
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                                setManageModalOpen(true);
                                setSelectedButton('');
                            }}
                        >
                            <Icon data={Play} />
                            <Text variant="subheader-1">Управление</Text>
                        </Button>
                        <div style={{width: 8}} />
                        {manageModalInProgress ? <Spin style={{marginRight: 8}} /> : <></>}
                    </div>
                    <Modal
                        open={manageModalOpen}
                        onClose={() => {
                            setManageModalOpen(false);
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
                                    placeholder: 'Запуск',
                                    icon: Play,
                                    view: 'outlined-success',
                                    onClick: () => {
                                        manageAdvertsActivityOnClick('start', 9);
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
                                        manageAdvertsActivityOnClick('pause', 11);
                                    },
                                },
                                selectedButton,
                                setSelectedButton,
                            )}
                            {generateModalButtonWithActions(
                                {
                                    placeholder: 'Завершить',
                                    icon: Pause,
                                    view: 'outlined-danger',
                                    onClick: () => {
                                        manageAdvertsActivityOnClick('stop', undefined);
                                    },
                                },
                                selectedButton,
                                setSelectedButton,
                            )}
                            <div style={{height: 16}} />
                        </Card>
                    </Modal>
                    <Button
                        view="action"
                        size="l"
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        onClick={() => {
                            setModalFormOpen(true);
                            setSelectedButton('');
                            setCreateAdvertsMode(false);
                        }}
                    >
                        <Icon data={SlidersVertical} />
                        <Text variant="subheader-1">Создать</Text>
                    </Button>
                    <Modal
                        open={modalFormOpen}
                        onClose={() => {
                            setAdvertTypeSwitchValue(['Авто']);
                            setBudgetInputValue(1000);
                            setBudgetInputValidationValue(true);
                            setBidInputValue(125);
                            setBidInputValidationValue(true);
                            setModalFormOpen(false);
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
                                    width: '100%',
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
                                    Параметры
                                </Text>
                                <Select
                                    value={advertTypeSwitchValue}
                                    options={advertTypeSwitchValues}
                                    onUpdate={(val) => {
                                        setAdvertTypeSwitchValue(val);
                                        setBidInputValue(val[0] == 'Авто' ? 125 : 250);
                                    }}
                                />
                                <div
                                    style={{
                                        display:
                                            advertTypeSwitchValue[0] == 'Авто' ? 'flex' : 'none',
                                        flexDirection: 'column',
                                        maxWidth: '70%',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            margin: '4px 0',
                                        }}
                                    >
                                        <Text style={{marginLeft: 4}} variant="subheader-1">
                                            {'Бюджет'}
                                        </Text>
                                        <TextInput
                                            type="number"
                                            value={String(budgetInputValue)}
                                            onChange={(val) => {
                                                const budget = Number(val.target.value);
                                                if (budget < 1000)
                                                    setBudgetInputValidationValue(false);
                                                else setBudgetInputValidationValue(true);
                                                setBudgetInputValue(budget);
                                            }}
                                            errorMessage={'Введите не менее 500'}
                                            validationState={
                                                budgetInputValidationValue ? undefined : 'invalid'
                                            }
                                        />
                                    </div>
                                    <div style={{width: 16}} />
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            margin: '4px 0',
                                        }}
                                    >
                                        <Text style={{marginLeft: 4}} variant="subheader-1">
                                            {'Ставка'}
                                        </Text>
                                        <TextInput
                                            type="number"
                                            value={String(bidInputValue)}
                                            onChange={(val) => {
                                                const bid = Number(val.target.value);
                                                if (bid < 125) setBidInputValidationValue(false);
                                                else setBidInputValidationValue(true);
                                                setBidInputValue(bid);
                                            }}
                                            errorMessage={'Введите не менее 125'}
                                            validationState={
                                                bidInputValidationValue ? undefined : 'invalid'
                                            }
                                        />
                                    </div>
                                </div>
                                <Checkbox
                                    style={{margin: '8px 0'}}
                                    checked={createAdvertsMode}
                                    onUpdate={(val) => setCreateAdvertsMode(val)}
                                >
                                    Создание РК 1к1
                                </Checkbox>
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Запуск',
                                        icon: CloudArrowUpIn,
                                        view: 'outlined-success',
                                        onClick: () => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {
                                                    arts: {},
                                                    mode: createAdvertsMode, // true -- one to one false -- one to many
                                                    budget: budgetInputValue,
                                                    bid: bidInputValue,
                                                    type: advertTypeSwitchValue[0],
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const {art, nmId} = filteredData[i];
                                                if (art === undefined || nmId === undefined)
                                                    continue;
                                                params.data.arts[art] = {art, nmId};
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('createMassAdverts', params);
                                            //////////////////////////////////

                                            setModalFormOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                            </div>
                        </Card>
                    </Modal>
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="action"
                        size="l"
                        onClick={openBudgetModalForm}
                    >
                        <Icon data={CircleRuble} />
                        <Text variant="subheader-1">Бюджет</Text>
                    </Button>
                    <Modal open={budgetModalFormOpen} onClose={() => setBudgetModalFormOpen(false)}>
                        <Card
                            // view="raised"
                            view="clear"
                            style={{
                                width: 300,
                                // animation: '1s cubic-bezier(0.1, -0.6, 0.2, 0)',
                                // animation: '3s linear 1s slidein',
                                // maxWidth: '15vw',
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
                                    width: '100%',
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
                                    Бюджет
                                </Text>
                                <RadioButton
                                    style={{margin: '4px 0'}}
                                    defaultValue={budgetModalSwitchValue}
                                    options={budgetModalSwitchValues}
                                    onUpdate={(val) => {
                                        setBudgetModalSwitchValue(val);
                                        setBudgetModalBudgetInputValue(1000);
                                        setBudgetModalBudgetInputValidationValue(true);
                                        setSelectedButton('');
                                    }}
                                />
                                <TextInput
                                    hasClear={budgetModalSwitchValue == 'Установить лимит'}
                                    style={{
                                        maxWidth: '70%',
                                        margin: '4px 0',
                                    }}
                                    type="number"
                                    value={String(budgetModalBudgetInputValue)}
                                    onChange={(val) => {
                                        const budget = Number(val.target.value);

                                        if (
                                            budget == 0 &&
                                            budgetModalSwitchValue == 'Установить лимит'
                                        )
                                            setBudgetModalBudgetInputValidationValue(true);
                                        else if (budget < 1000) {
                                            setBudgetModalBudgetInputValidationValue(false);
                                        } else {
                                            setBudgetModalBudgetInputValidationValue(true);
                                        }
                                        setSelectedButton('');
                                        setBudgetModalBudgetInputValue(budget);
                                    }}
                                    errorMessage={'Введите не менее 500'}
                                    validationState={
                                        budgetModalBudgetInputValidationValue
                                            ? undefined
                                            : 'invalid'
                                    }
                                    label="Бюджет"
                                />
                                {generateModalButtonWithActions(
                                    {
                                        style: {margin: '8px 0'},
                                        placeholder:
                                            budgetModalSwitchValue == 'Установить лимит'
                                                ? budgetModalBudgetInputValue != 0
                                                    ? 'Отправить'
                                                    : 'Удалить лимит'
                                                : 'Отправить',
                                        disabled: !budgetModalBudgetInputValidationValue,
                                        icon:
                                            budgetModalSwitchValue == 'Установить лимит'
                                                ? budgetModalBudgetInputValue != 0
                                                    ? CloudArrowUpIn
                                                    : TrashBin
                                                : CloudArrowUpIn,
                                        view:
                                            budgetModalSwitchValue == 'Установить лимит'
                                                ? budgetModalBudgetInputValue != 0
                                                    ? 'outlined-success'
                                                    : 'outlined-danger'
                                                : 'outlined-success',
                                        onClick: () => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {
                                                    mode: budgetModalSwitchValue,
                                                    advertsIds: {},
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const {adverts} = filteredData[i];
                                                if (adverts) {
                                                    for (const [id, advertsData] of Object.entries(
                                                        adverts,
                                                    )) {
                                                        if (!id || !advertsData) continue;
                                                        const {advertId} = advertsData as {
                                                            advertId: number;
                                                        };
                                                        if (!advertId) continue;
                                                        if (
                                                            modalOpenFromAdvertId != '' &&
                                                            modalOpenFromAdvertId
                                                        ) {
                                                            if (id != modalOpenFromAdvertId)
                                                                continue;
                                                        }

                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                            budget: budgetModalBudgetInputValue,
                                                        };

                                                        if (
                                                            budgetModalSwitchValue ==
                                                            'Установить лимит'
                                                        ) {
                                                            doc.advertsBudgetsToKeep[
                                                                selectValue[0]
                                                            ][advertId] =
                                                                budgetModalBudgetInputValue
                                                                    ? budgetModalBudgetInputValue
                                                                    : undefined;
                                                        }
                                                    }
                                                }
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('depositAdvertsBudgets', params);
                                            setChangedDoc(doc);
                                            //////////////////////////////////

                                            setBudgetModalFormOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                            </div>
                        </Card>
                    </Modal>
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
                                            {generateAdvertCard(advertId, -1, '')}
                                            <div style={{minWidth: 8}} />
                                            <Button
                                                view={
                                                    rkListMode == 'add'
                                                        ? 'outlined-success'
                                                        : 'outlined-danger'
                                                }
                                                disabled={
                                                    !doc.adverts[selectValue[0]][advertId] ||
                                                    doc.adverts[selectValue[0]][advertId].type != 8
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
                                                            delete doc.campaigns[selectValue[0]][
                                                                semanticsModalOpenFromArt
                                                            ].adverts[advertId];
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
                                                    setChangedDoc(doc);
                                                }}
                                            >
                                                <Icon data={rkListMode == 'add' ? Plus : Xmark} />
                                            </Button>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </Modal>
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
                            <div style={{overflow: 'auto', width: '100%', height: '100%'}}>
                                <TheTable
                                    columnData={columnDataArtByDayStats}
                                    data={artsStatsByDayFilteredData}
                                    filters={artsStatsByDayFilters}
                                    setFilters={setArtsStatsByDayFilters}
                                    filterData={artsStatsByDayDataFilter}
                                    footerData={[artsStatsByDayFilteredSummary]}
                                />
                            </div>
                        </motion.div>
                    </Modal>
                    <Modal
                        open={showScheduleModalOpen}
                        onClose={() => {
                            setShowScheduleModalOpen(false);
                            setModalOpenFromAdvertId('');
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: 20,
                            }}
                        >
                            <Text
                                style={{
                                    margin: '8px 0',
                                }}
                                variant="display-2"
                            >
                                График работы
                            </Text>
                            <div style={{minHeight: 8}} />
                            {generateScheduleInput({scheduleInput, setScheduleInput})}
                            <div style={{minHeight: 16}} />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    justifyContent: 'space-around',
                                }}
                            >
                                {generateModalButtonWithActions(
                                    {
                                        style: {margin: '8px 0'},
                                        placeholder: 'Установить',
                                        icon: CloudArrowUpIn,
                                        view: 'outlined-success',
                                        onClick: () => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {
                                                    schedule: scheduleInput,
                                                    mode: 'Установить',
                                                    advertsIds: {},
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const {adverts} = filteredData[i];
                                                if (adverts) {
                                                    for (const [id, advertsData] of Object.entries(
                                                        adverts,
                                                    )) {
                                                        if (!id || !advertsData) continue;
                                                        const {advertId} = advertsData as {
                                                            advertId: number;
                                                        };
                                                        if (!advertId) continue;
                                                        if (
                                                            modalOpenFromAdvertId != '' &&
                                                            modalOpenFromAdvertId
                                                        ) {
                                                            if (id != modalOpenFromAdvertId)
                                                                continue;
                                                        }

                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                        };

                                                        doc.advertsSchedules[selectValue[0]][
                                                            advertId
                                                        ] = {};
                                                        doc.advertsSchedules[selectValue[0]][
                                                            advertId
                                                        ] = {schedule: scheduleInput};
                                                    }
                                                }
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('setAdvertsSchedules', params);
                                            setChangedDoc(doc);
                                            //////////////////////////////////

                                            setShowScheduleModalOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                {generateModalButtonWithActions(
                                    {
                                        style: {margin: '8px 0'},
                                        placeholder: 'Удалить',
                                        icon: TrashBin,
                                        view: 'outlined-danger',
                                        onClick: () => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {
                                                    mode: 'Удалить',
                                                    advertsIds: {},
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const {adverts} = filteredData[i];
                                                if (adverts) {
                                                    for (const [id, advertsData] of Object.entries(
                                                        adverts,
                                                    )) {
                                                        if (!id || !advertsData) continue;
                                                        const {advertId} = advertsData as {
                                                            advertId: number;
                                                        };
                                                        if (!advertId) continue;
                                                        if (
                                                            modalOpenFromAdvertId != '' &&
                                                            modalOpenFromAdvertId
                                                        ) {
                                                            if (id != modalOpenFromAdvertId)
                                                                continue;
                                                        }

                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                        };

                                                        delete doc.advertsSchedules[selectValue[0]][
                                                            advertId
                                                        ];
                                                    }
                                                }
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('setAdvertsSchedules', params);
                                            setChangedDoc(doc);
                                            //////////////////////////////////

                                            setShowScheduleModalOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                            </div>
                        </div>
                    </Modal>
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="action"
                        size="l"
                        onClick={openBidModalForm}
                    >
                        <Icon data={ChartLine} />
                        <Text variant="subheader-1">Ставки</Text>
                    </Button>
                    <Modal
                        open={bidModalFormOpen}
                        onClose={() => {
                            setBidModalFormOpen(false);
                            setModalOpenFromAdvertId('');
                        }}
                    >
                        <div>
                            <Card
                                // view="raised"
                                view="clear"
                                style={{
                                    width: 400,
                                    // animation: '1s cubic-bezier(0.1, -0.6, 0.2, 0)',
                                    // animation: '3s linear 1s slidein',
                                    // maxWidth: '15vw',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: 'none',
                                }}
                            >
                                <motion.div
                                    style={{
                                        height: '50%',
                                        width: '100%',
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
                                        Ставки
                                    </Text>
                                    <RadioButton
                                        style={{marginTop: 4}}
                                        defaultValue={bidModalSwitchValue}
                                        options={bidModalSwitchValues}
                                        onUpdate={(val) => {
                                            setBidModalSwitchValue(val);
                                            setBidModalBidInputValue(125);
                                            // setBidModalAnalyticsSwitchValue(14);
                                            setBidModalBidInputValidationValue(true);
                                            setBidModalDeleteModeSelected(false);
                                            setBidModalFormOpen(true);
                                            setBidModalBidStepInputValue(5);
                                            setBidModalRange({from: 50, to: 50});
                                            setBidModalRangeValid(true);
                                            setBidModalMaxBid(500);
                                            setBidModalMaxBidValid(true);
                                            setBidModalBidStepInputValidationValue(true);
                                            setBidModalDRRInputValue(10);
                                            setBidModalDRRInputValidationValue(true);
                                        }}
                                    />

                                    <motion.div
                                        layout
                                        // className={
                                        //     bidModalDeleteModeSelected ? 'fade-in' : 'fade-out'
                                        // }
                                        animate={{
                                            height: bidModalDeleteModeSelected
                                                ? 8
                                                : bidModalSwitchValue == 'Установить'
                                                ? 40
                                                : 166,
                                            opacity: bidModalDeleteModeSelected ? 0 : 1,
                                        }}
                                        transition={{duration: 0.1}}
                                        style={{
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <motion.div
                                            layout
                                            animate={{
                                                y: !bidModalDeleteModeSelected
                                                    ? bidModalSwitchValue == 'Установить'
                                                        ? 76
                                                        : -16
                                                    : 77,
                                                // x: !bidModalDeleteModeSelected
                                                //     ? bidModalSwitchValue == 'Установить'
                                                //         ? 59
                                                //         : -20
                                                //     : -100,
                                            }}
                                            transition={{
                                                duration: 0.1,
                                                ease: 'easeInOut',
                                                // ease: [0.67, 0.83, 0.67, 0.17],
                                                // type: 'spring',
                                                // duration: 4,
                                                // stiffness: 30,
                                                // damping: 15,
                                            }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                width: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <motion.div
                                                layout
                                                animate={{
                                                    opacity:
                                                        bidModalSwitchValue == 'Установить' ? 1 : 0,
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <TextInput
                                                    style={{
                                                        maxWidth: '70%',
                                                        margin: '4px 0',
                                                    }}
                                                    type="number"
                                                    value={String(bidModalBidInputValue)}
                                                    onChange={(val) => {
                                                        const bid = Number(val.target.value);
                                                        if (bid < 125)
                                                            setBidModalBidInputValidationValue(
                                                                false,
                                                            );
                                                        else
                                                            setBidModalBidInputValidationValue(
                                                                true,
                                                            );
                                                        setBidModalBidInputValue(bid);
                                                    }}
                                                    errorMessage={'Введите не менее 125'}
                                                    validationState={
                                                        bidModalBidInputValidationValue
                                                            ? undefined
                                                            : 'invalid'
                                                    }
                                                    label="Ставка"
                                                />
                                            </motion.div>
                                            <motion.div
                                                layout
                                                animate={{
                                                    opacity:
                                                        bidModalSwitchValue != 'Установить' &&
                                                        !bidModalDeleteModeSelected
                                                            ? 1
                                                            : 0,
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        maxWidth: '70%',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'bottom',
                                                    }}
                                                >
                                                    {' '}
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            margin: '4px 0',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{marginLeft: 4}}
                                                            variant="subheader-1"
                                                        >
                                                            {'Метод'}
                                                        </Text>
                                                        <Select
                                                            onUpdate={(nextValue) => {
                                                                setSelectedValueMethod(nextValue);
                                                                if (nextValue[0] == 'По ДРР') {
                                                                    setBidModalRange({
                                                                        from: 0,
                                                                        to: 0,
                                                                    });
                                                                } else {
                                                                    setBidModalRange({
                                                                        from: 50,
                                                                        to: 50,
                                                                    });
                                                                }
                                                            }}
                                                            options={selectedValueMethodOptions}
                                                            renderControl={({
                                                                onClick,
                                                                onKeyDown,
                                                                ref,
                                                            }) => {
                                                                const temp = {};
                                                                for (
                                                                    let i = 0;
                                                                    i <
                                                                    selectedValueMethodOptions.length;
                                                                    i++
                                                                ) {
                                                                    const {value, content} =
                                                                        selectedValueMethodOptions[
                                                                            i
                                                                        ];
                                                                    temp[value] = content;
                                                                }
                                                                return (
                                                                    <Button
                                                                        style={{width: '100%'}}
                                                                        // width="max"
                                                                        ref={ref}
                                                                        view="outlined"
                                                                        onClick={onClick}
                                                                        extraProps={{
                                                                            onKeyDown,
                                                                        }}
                                                                    >
                                                                        {
                                                                            temp[
                                                                                selectedValueMethod[0]
                                                                            ]
                                                                        }
                                                                        <Icon data={ChevronDown} />
                                                                    </Button>
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{width: 8}} />
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            margin: '4px 0',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{marginLeft: 4}}
                                                            variant="subheader-1"
                                                        >
                                                            {'Макс. ставка'}
                                                        </Text>
                                                        <TextInput
                                                            style={
                                                                {
                                                                    // maxWidth: '50%',
                                                                }
                                                            }
                                                            type="number"
                                                            value={String(bidModalMaxBid)}
                                                            onUpdate={(val) => {
                                                                const intVal = Number(val);

                                                                setBidModalMaxBidValid(
                                                                    intVal >= 125,
                                                                );

                                                                setBidModalMaxBid(intVal);
                                                            }}
                                                            // errorMessage={'Введите не менее 125'}
                                                            validationState={
                                                                bidModalMaxBidValid
                                                                    ? undefined
                                                                    : 'invalid'
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        maxWidth: '70%',
                                                        justifyContent: 'center',
                                                        margin: '4px 0',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{marginLeft: 4}}
                                                            variant="subheader-1"
                                                        >
                                                            {selectedValueMethod[0] == 'cpo'
                                                                ? 'Целевой CPO'
                                                                : 'Целевой ДРР'}
                                                        </Text>
                                                        <TextInput
                                                            type="number"
                                                            value={String(bidModalDRRInputValue)}
                                                            onChange={(val) => {
                                                                const cpo = Number(
                                                                    val.target.value,
                                                                );
                                                                if (cpo < 0)
                                                                    setBidModalDRRInputValidationValue(
                                                                        false,
                                                                    );
                                                                else
                                                                    setBidModalDRRInputValidationValue(
                                                                        true,
                                                                    );
                                                                setBidModalDRRInputValue(cpo);
                                                            }}
                                                            errorMessage={'Введите не менее 0'}
                                                            validationState={
                                                                bidModalDRRInputValidationValue
                                                                    ? undefined
                                                                    : 'invalid'
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: 8,
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            // selectedValueMethod[0] ==
                                                            // 'Под Позицию'
                                                            //     ? 'flex'
                                                            //     : 'none',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{marginLeft: 4}}
                                                            variant="subheader-1"
                                                        >
                                                            {'Позиция'}
                                                        </Text>
                                                        <TextInput
                                                            disabled={
                                                                selectedValueMethod[0] == 'drr' ||
                                                                selectedValueMethod[0] == 'cpo'
                                                            }
                                                            type="number"
                                                            value={String(bidModalRange.to)}
                                                            onUpdate={(val) => {
                                                                const intVal = Number(val);

                                                                setBidModalRange(() => {
                                                                    setBidModalRangeValid(
                                                                        intVal > 0,
                                                                    );
                                                                    return {
                                                                        from: intVal,
                                                                        to: intVal,
                                                                    };
                                                                });
                                                            }}
                                                            validationState={
                                                                bidModalRangeValid
                                                                    ? undefined
                                                                    : 'invalid'
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <TextInput
                                                    style={{
                                                        opacity: 0,
                                                        pointerEvents: 'none',
                                                        maxWidth: '70%',
                                                        margin: '4px 0',
                                                    }}
                                                    type="number"
                                                    value={String(
                                                        bidModalStocksThresholdInputValue,
                                                    )}
                                                    onChange={(val) => {
                                                        const stocksThreshold = Number(
                                                            val.target.value,
                                                        );
                                                        if (stocksThreshold < 0)
                                                            setBidModalStocksThresholdInputValidationValue(
                                                                false,
                                                            );
                                                        else
                                                            setBidModalStocksThresholdInputValidationValue(
                                                                true,
                                                            );
                                                        setBidModalStocksThresholdInputValue(
                                                            stocksThreshold,
                                                        );
                                                    }}
                                                    errorMessage={'Введите не менее 0'}
                                                    validationState={
                                                        bidModalStocksThresholdInputValidationValue
                                                            ? undefined
                                                            : 'invalid'
                                                    }
                                                    label="Мин. остаток"
                                                />

                                                <TextInput
                                                    style={{
                                                        maxWidth: '70%',
                                                        margin: '4px 0',
                                                        display: 'none',
                                                    }}
                                                    type="number"
                                                    value={String(bidModalBidStepInputValue)}
                                                    onChange={(val) => {
                                                        const bidStep = Number(val.target.value);
                                                        if (bidStep < 0)
                                                            setBidModalBidStepInputValidationValue(
                                                                false,
                                                            );
                                                        else
                                                            setBidModalBidStepInputValidationValue(
                                                                true,
                                                            );
                                                        setBidModalBidStepInputValue(bidStep);
                                                    }}
                                                    errorMessage={'Введите не менее 0'}
                                                    validationState={
                                                        bidModalBidStepInputValidationValue
                                                            ? undefined
                                                            : 'invalid'
                                                    }
                                                    label="Шаг ставки"
                                                />
                                                {/* <Text variant="subheader-1">Аналитика</Text>
                                                <RadioButton
                                                    style={{margin: '0 2px 0 4px'}}
                                                    defaultValue={String(
                                                        bidModalAnalyticsSwitchValue,
                                                    )}
                                                    options={bidModalAnalyticsSwitchValues}
                                                    onUpdate={(val) => {
                                                        setBidModalAnalyticsSwitchValue(
                                                            parseInt(val),
                                                        );
                                                    }}
                                                /> */}
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                    <div
                                        style={{
                                            marginTop: 8,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <Button
                                            style={{
                                                marginBottom: 8,
                                                maxWidth: '50%',
                                            }}
                                            pin="circle-circle"
                                            size="l"
                                            width="max"
                                            disabled={
                                                !bidModalBidInputValidationValue ||
                                                !bidModalStocksThresholdInputValidationValue ||
                                                !bidModalRangeValid ||
                                                !bidModalMaxBidValid
                                            }
                                            // view="action"
                                            view={
                                                bidModalDeleteModeSelected
                                                    ? 'outlined-danger'
                                                    : 'action'
                                            }
                                            // selected
                                            onClick={() => {
                                                const params = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    data: {
                                                        advertsIds: {},
                                                        mode: bidModalDeleteModeSelected
                                                            ? 'Удалить правила'
                                                            : bidModalSwitchValue,
                                                        stocksThreshold:
                                                            bidModalStocksThresholdInputValue,
                                                        placementsRange: bidModalRange,
                                                        maxBid: bidModalMaxBid,
                                                        autoBidsMode: selectedValueMethod[0],
                                                    },
                                                };
                                                for (let i = 0; i < filteredData.length; i++) {
                                                    const {adverts} = filteredData[i];
                                                    if (adverts) {
                                                        for (const [
                                                            id,
                                                            advertsData,
                                                        ] of Object.entries(adverts)) {
                                                            if (!id || !advertsData) continue;
                                                            const {advertId} = advertsData as {
                                                                advertId: number;
                                                            };
                                                            if (
                                                                modalOpenFromAdvertId != '' &&
                                                                modalOpenFromAdvertId
                                                            ) {
                                                                if (id != modalOpenFromAdvertId)
                                                                    continue;
                                                            }

                                                            params.data.advertsIds[advertId] = {
                                                                advertId: advertId,
                                                                bid: bidModalBidInputValue,
                                                            };
                                                            if (
                                                                bidModalSwitchValue == 'Установить'
                                                            ) {
                                                                params.data.advertsIds[advertId] = {
                                                                    bid: bidModalBidInputValue,
                                                                    advertId: advertId,
                                                                };
                                                            } else if (
                                                                bidModalSwitchValue == 'Автоставки'
                                                            ) {
                                                                if (!bidModalDeleteModeSelected) {
                                                                    params.data.advertsIds[
                                                                        advertId
                                                                    ] = {
                                                                        desiredDRR:
                                                                            bidModalDRRInputValue,
                                                                        bidStep:
                                                                            bidModalBidStepInputValue,

                                                                        advertId: advertId,
                                                                    };
                                                                } else {
                                                                    params.data.advertsIds[
                                                                        advertId
                                                                    ] = {
                                                                        advertId: advertId,
                                                                    };
                                                                }

                                                                if (
                                                                    !doc.advertsAutoBidsRules[
                                                                        selectValue[0]
                                                                    ][advertId]
                                                                )
                                                                    doc.advertsAutoBidsRules[
                                                                        selectValue[0]
                                                                    ][advertId] = {};
                                                                doc.advertsAutoBidsRules[
                                                                    selectValue[0]
                                                                ][advertId] =
                                                                    bidModalDeleteModeSelected
                                                                        ? undefined
                                                                        : {
                                                                              desiredDRR:
                                                                                  bidModalDRRInputValue,
                                                                              placementsRange:
                                                                                  bidModalRange,
                                                                              maxBid: bidModalMaxBid,
                                                                              autoBidsMode:
                                                                                  selectedValueMethod[0],
                                                                          };
                                                            }
                                                        }
                                                    }
                                                }

                                                console.log(params);

                                                //////////////////////////////////
                                                callApi('setAdvertsCPMs', params);
                                                setChangedDoc(doc);
                                                //////////////////////////////////

                                                setBidModalFormOpen(false);
                                            }}
                                        >
                                            {bidModalSwitchValue == 'Автоставки'
                                                ? !bidModalDeleteModeSelected
                                                    ? 'Задать правила'
                                                    : 'Удалить правила'
                                                : 'Отправить'}
                                        </Button>
                                        {bidModalSwitchValue == 'Автоставки' ? (
                                            <Button
                                                style={{
                                                    position: 'absolute',
                                                    marginLeft: '70%',
                                                    marginBottom: 8,
                                                }}
                                                pin="circle-circle"
                                                view={
                                                    bidModalDeleteModeSelected
                                                        ? 'flat-warning'
                                                        : undefined
                                                }
                                                selected={bidModalDeleteModeSelected}
                                                // view="action"
                                                onClick={() => {
                                                    setBidModalDeleteModeSelected((val) => !val);
                                                }}
                                            >
                                                <Icon data={TrashBin}></Icon>
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </motion.div>
                            </Card>
                        </div>
                    </Modal>
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="action"
                        size="l"
                        onClick={() => {
                            // setSemanticsModalSemanticsInputValue(500);
                            // setSemanticsModalSwitchValue('Пополнить');
                            // setSemanticsModalSemanticsInputValidationValue(true);
                            setPlusPhrasesModalFormOpen(true);
                            const plusPhrasesTemplatesTemp: any[] = [];
                            for (const [name, _] of Object.entries(
                                doc.plusPhrasesTemplates[selectValue[0]],
                            )) {
                                plusPhrasesTemplatesTemp.push(name);
                            }

                            setPlusPhrasesTemplatesLabels(plusPhrasesTemplatesTemp);
                        }}
                    >
                        <Icon data={Magnifier} />
                        <Text variant="subheader-1">Фразы</Text>
                    </Button>
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="action"
                        size="l"
                        onClick={() => {
                            setShowScheduleModalOpen(true);
                            setModalOpenFromAdvertId('');
                            setScheduleInput(genTempSchedule());
                        }}
                    >
                        <Icon data={Clock} />
                        <Text variant="subheader-1">График</Text>
                    </Button>
                    <Modal
                        open={semanticsModalFormOpen}
                        onClose={() => {
                            setSemanticsModalFormOpen(false);
                            setModalOpenFromAdvertId('');
                        }}
                    >
                        <motion.div
                            onAnimationStart={async () => {
                                await new Promise((resolve) => setTimeout(resolve, 300));
                                clustersFilterDataActive(
                                    {cluster: {val: '', mode: 'include'}},
                                    semanticsModalSemanticsItemsValue,
                                );
                                clustersFilterDataMinus(
                                    {cluster: {val: '', mode: 'include'}},
                                    semanticsModalSemanticsMinusItemsValue,
                                );
                            }}
                            animate={{width: semanticsModalFormOpen ? '80vw' : 0}}
                            style={{
                                height: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                margin: 20,
                                alignItems: 'start',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 8,
                                        display: 'flex',
                                        width: '100%',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <TextInput
                                        placeholder="Имя"
                                        hasClear
                                        value={
                                            semanticsModalSemanticsPlusItemsTemplateNameSaveValue
                                        }
                                        onUpdate={(val) => {
                                            setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                                val,
                                            );
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginTop: 8,
                                            width: '100%',
                                        }}
                                    >
                                        <TextInput
                                            label="Показы перв."
                                            hasClear
                                            value={String(semanticsModalSemanticsThresholdValue)}
                                            onUpdate={(val) => {
                                                setSemanticsModalSemanticsThresholdValue(
                                                    Number(val),
                                                );
                                            }}
                                            type="number"
                                        />
                                        <div style={{minWidth: 8}} />
                                        <TextInput
                                            label="CTR перв."
                                            hasClear
                                            value={semanticsModalSemanticsCTRThresholdValue}
                                            onUpdate={(val) => {
                                                val = val.replace(',', '.');

                                                const numberVal = Number(val);
                                                const valid = !isNaN(numberVal);

                                                setSemanticsModalSemanticsCTRThresholdValueValid(
                                                    valid,
                                                );
                                                setSemanticsModalSemanticsCTRThresholdValue(val);
                                            }}
                                            validationState={
                                                !semanticsModalSemanticsCTRThresholdValueValid
                                                    ? 'invalid'
                                                    : undefined
                                            }
                                        />
                                        <div style={{minWidth: 8}} />
                                        <TextInput
                                            label="Показы втор."
                                            hasClear
                                            value={String(
                                                semanticsModalSemanticsSecondThresholdValue,
                                            )}
                                            onUpdate={(val) => {
                                                setSemanticsModalSemanticsSecondThresholdValue(
                                                    Number(val),
                                                );
                                            }}
                                            type="number"
                                        />
                                        <div style={{minWidth: 8}} />
                                        <TextInput
                                            label="CTR втор."
                                            hasClear
                                            value={semanticsModalSemanticsSecondCTRThresholdValue}
                                            onUpdate={(val) => {
                                                val = val.replace(',', '.');

                                                const numberVal = Number(val);
                                                const valid = !isNaN(numberVal);

                                                setSemanticsModalSemanticsSecondCTRThresholdValueValid(
                                                    valid,
                                                );
                                                setSemanticsModalSemanticsSecondCTRThresholdValue(
                                                    val,
                                                );
                                            }}
                                            validationState={
                                                !semanticsModalSemanticsSecondCTRThresholdValueValid
                                                    ? 'invalid'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Button
                                            onClick={() => {
                                                const name =
                                                    semanticsModalSemanticsPlusItemsTemplateNameSaveValue.trim();
                                                const params = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    data: {
                                                        mode: 'Установить',
                                                        isFixed: semanticsModalIsFixed,
                                                        name: name,
                                                        clusters:
                                                            semanticsModalSemanticsPlusItemsValue,
                                                        threshold:
                                                            semanticsModalSemanticsThresholdValue,
                                                        ctrThreshold: Number(
                                                            semanticsModalSemanticsCTRThresholdValue,
                                                        ),
                                                        secondThreshold:
                                                            semanticsModalSemanticsSecondThresholdValue,
                                                        secondCtrThreshold:
                                                            semanticsModalSemanticsSecondCTRThresholdValue,
                                                        autoPhrasesTemplate: {
                                                            includes:
                                                                semanticsAutoPhrasesModalIncludesList,
                                                            notIncludes:
                                                                semanticsAutoPhrasesModalNotIncludesList,
                                                        },
                                                    },
                                                };

                                                doc.plusPhrasesTemplates[selectValue[0]][name] = {
                                                    isFixed: semanticsModalIsFixed,
                                                    name: name,
                                                    clusters: semanticsModalSemanticsPlusItemsValue,
                                                    threshold:
                                                        semanticsModalSemanticsThresholdValue,
                                                    ctrThreshold: Number(
                                                        semanticsModalSemanticsCTRThresholdValue,
                                                    ),
                                                    secondThreshold:
                                                        semanticsModalSemanticsSecondThresholdValue,
                                                    secondCtrThreshold:
                                                        semanticsModalSemanticsSecondCTRThresholdValue,
                                                    autoPhrasesTemplate: {
                                                        includes:
                                                            semanticsAutoPhrasesModalIncludesList,
                                                        notIncludes:
                                                            semanticsAutoPhrasesModalNotIncludesList,
                                                    },
                                                };
                                                {
                                                    // ADDING TEMPLATE TO ART
                                                    if (
                                                        semanticsModalOpenFromArt &&
                                                        semanticsModalOpenFromArt != ''
                                                    ) {
                                                        const advertId = modalOpenFromAdvertId;

                                                        const paramsAddToArt = {
                                                            uid: getUid(),
                                                            campaignName: selectValue[0],
                                                            data: {advertsIds: {}},
                                                        };
                                                        paramsAddToArt.data.advertsIds[advertId] = {
                                                            mode: 'Установить',
                                                            templateName: name,
                                                            advertId: advertId,
                                                        };
                                                        callApi(
                                                            'setAdvertsPlusPhrasesTemplates',
                                                            paramsAddToArt,
                                                        );

                                                        if (
                                                            !doc.advertsPlusPhrasesTemplates[
                                                                selectValue[0]
                                                            ][advertId]
                                                        )
                                                            doc.advertsPlusPhrasesTemplates[
                                                                selectValue[0]
                                                            ][advertId] = {};

                                                        doc.advertsPlusPhrasesTemplates[
                                                            selectValue[0]
                                                        ][advertId].templateName = name;
                                                    }
                                                }

                                                console.log(params);

                                                setChangedDoc(doc);

                                                callApi('setPlusPhraseTemplate', params);

                                                setSemanticsModalFormOpen(false);
                                            }}
                                            disabled={
                                                !semanticsModalSemanticsCTRThresholdValueValid ||
                                                !semanticsModalSemanticsSecondCTRThresholdValueValid
                                            }
                                        >
                                            Сохранить
                                        </Button>
                                        <div style={{minWidth: 8}} />
                                        <Button
                                            selected={semanticsModalIsFixed}
                                            onClick={() =>
                                                setSemanticsModalIsFixed(!semanticsModalIsFixed)
                                            }
                                        >
                                            {`Фикс. ${!semanticsModalIsFixed ? 'выкл.' : 'вкл.'}`}
                                        </Button>
                                        <div style={{minWidth: 8}} />
                                        <Button
                                            view={
                                                semanticsAutoPhrasesModalIncludesList.length ||
                                                semanticsAutoPhrasesModalNotIncludesList.length
                                                    ? 'flat-success'
                                                    : 'normal'
                                            }
                                            selected={
                                                semanticsAutoPhrasesModalIncludesList.length ||
                                                semanticsAutoPhrasesModalNotIncludesList.length
                                                    ? true
                                                    : undefined
                                            }
                                            onClick={() => {
                                                setSemanticsAutoPhrasesModalFormOpen(
                                                    !semanticsAutoPhrasesModalFormOpen,
                                                );
                                            }}
                                        >
                                            {`Автофразы`}
                                        </Button>
                                        <Modal
                                            open={semanticsAutoPhrasesModalFormOpen}
                                            onClose={() => {
                                                setSemanticsAutoPhrasesModalFormOpen(false);
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: '70vh',
                                                    width: '60vw',
                                                    justifyContent: 'space-between',
                                                    margin: '30px 30px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            height: '68vh',
                                                            width: '48%',
                                                        }}
                                                    >
                                                        <Text variant="header-1">
                                                            Фразы должны содержать
                                                        </Text>
                                                        <div style={{height: 8}} />
                                                        <TextInput
                                                            value={
                                                                semanticsAutoPhrasesModalIncludesListInput
                                                            }
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    if (
                                                                        !semanticsAutoPhrasesModalIncludesList.includes(
                                                                            semanticsAutoPhrasesModalIncludesListInput,
                                                                        ) &&
                                                                        semanticsAutoPhrasesModalIncludesListInput !=
                                                                            ''
                                                                    )
                                                                        semanticsAutoPhrasesModalIncludesList.push(
                                                                            semanticsAutoPhrasesModalIncludesListInput,
                                                                        );
                                                                    setSemanticsAutoPhrasesModalIncludesListInput(
                                                                        '',
                                                                    );
                                                                }
                                                            }}
                                                            onUpdate={(value) => {
                                                                setSemanticsAutoPhrasesModalIncludesListInput(
                                                                    value,
                                                                );
                                                            }}
                                                            placeholder={' Вводите правила сюда'}
                                                        />
                                                        <div style={{height: 8}} />
                                                        <List
                                                            itemHeight={(item) => {
                                                                return (
                                                                    20 *
                                                                        Math.ceil(
                                                                            item.length / 60,
                                                                        ) +
                                                                    20
                                                                );
                                                            }}
                                                            renderItem={(item) => {
                                                                if (!item) return;
                                                                return (
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            justifyContent:
                                                                                'space-between',
                                                                            margin: '0 8px',
                                                                            width: '100%',
                                                                        }}
                                                                        title={item}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                textWrap: 'wrap',
                                                                            }}
                                                                        >
                                                                            <Text>{item}</Text>
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                flexDirection:
                                                                                    'row',
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                size="xs"
                                                                                view="flat"
                                                                                onClick={() => {
                                                                                    setSemanticsAutoPhrasesModalIncludesListInput(
                                                                                        item,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Icon
                                                                                    data={Pencil}
                                                                                    size={14}
                                                                                ></Icon>
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }}
                                                            filterPlaceholder={`Поиск в ${semanticsAutoPhrasesModalIncludesList.length} фразах`}
                                                            onItemClick={(rule) => {
                                                                let val = Array.from(
                                                                    semanticsAutoPhrasesModalIncludesList,
                                                                );
                                                                val = val.filter(
                                                                    (value) => value != rule,
                                                                );
                                                                setSemanticsAutoPhrasesModalIncludesList(
                                                                    val,
                                                                );
                                                            }}
                                                            items={
                                                                semanticsAutoPhrasesModalIncludesList
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            height: '68vh',
                                                            width: '48%',
                                                        }}
                                                    >
                                                        <Text variant="header-1">
                                                            Фразы не должны содержать
                                                        </Text>
                                                        <div style={{height: 8}} />
                                                        <TextInput
                                                            value={
                                                                semanticsAutoPhrasesModalNotIncludesListInput
                                                            }
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    const arr = Array.from(
                                                                        semanticsAutoPhrasesModalNotIncludesList as any[],
                                                                    );
                                                                    if (
                                                                        !arr.includes(
                                                                            semanticsAutoPhrasesModalNotIncludesListInput,
                                                                        ) &&
                                                                        semanticsAutoPhrasesModalNotIncludesListInput !=
                                                                            ''
                                                                    ) {
                                                                        arr.push(
                                                                            semanticsAutoPhrasesModalNotIncludesListInput,
                                                                        );
                                                                        setSemanticsAutoPhrasesModalNotIncludesList(
                                                                            arr,
                                                                        );
                                                                    }
                                                                    setSemanticsAutoPhrasesModalNotIncludesListInput(
                                                                        '',
                                                                    );
                                                                    console.log(
                                                                        semanticsAutoPhrasesModalNotIncludesList,
                                                                    );
                                                                }
                                                            }}
                                                            onUpdate={(value) => {
                                                                setSemanticsAutoPhrasesModalNotIncludesListInput(
                                                                    value,
                                                                );
                                                            }}
                                                            placeholder={' Вводите правила сюда'}
                                                        />
                                                        <div style={{height: 8}} />
                                                        <List
                                                            filterPlaceholder={`Поиск в ${semanticsAutoPhrasesModalNotIncludesList.length} фразах`}
                                                            onItemClick={(rule) => {
                                                                let val = Array.from(
                                                                    semanticsAutoPhrasesModalNotIncludesList,
                                                                );
                                                                val = val.filter(
                                                                    (value) => value != rule,
                                                                );
                                                                setSemanticsAutoPhrasesModalNotIncludesList(
                                                                    val,
                                                                );
                                                            }}
                                                            items={
                                                                semanticsAutoPhrasesModalNotIncludesList
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    pin="circle-circle"
                                                    view="action"
                                                    onClick={() =>
                                                        setSemanticsAutoPhrasesModalFormOpen(false)
                                                    }
                                                >
                                                    Закрыть
                                                </Button>
                                            </div>
                                        </Modal>
                                    </div>

                                    <Button
                                        width={'max'}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            for (
                                                let i = 0;
                                                i <
                                                    semanticsModalSemanticsItemsFiltratedValue.length &&
                                                i < 10;
                                                i++
                                            ) {
                                                parseFirst10Pages(
                                                    semanticsModalSemanticsItemsFiltratedValue[i]
                                                        .cluster,
                                                    setFetchedPlacements,
                                                    setCurrentParsingProgress,
                                                );
                                            }
                                        }}
                                    >
                                        Парсер выдачи первых 10 фраз
                                        <Icon size={12} data={LayoutHeader} />
                                    </Button>
                                </div>
                            </div>
                            <Card
                                theme="success"
                                style={{
                                    height: 'calc(60vh - 96px)',
                                    width: '100%',
                                    overflow: 'auto',
                                }}
                            >
                                <TheTable
                                    columnData={renameFirstColumn(
                                        columnDataSemantics,
                                        'Фразы в показах',
                                        [
                                            generateMassAddDelButton({
                                                placeholder: 'Добавить все',
                                                array: semanticsModalSemanticsItemsFiltratedValue,
                                                mode: 'add',
                                            }),
                                            generateMassAddDelButton({
                                                placeholder: 'Удалить все',
                                                array: semanticsModalSemanticsItemsFiltratedValue,
                                                mode: 'del',
                                            }),
                                        ],
                                    )}
                                    data={semanticsModalSemanticsItemsFiltratedValue}
                                    filters={clustersFiltersActive}
                                    setFilters={setClustersFiltersActive}
                                    filterData={clustersFilterDataActive}
                                    footerData={[semanticsFilteredSummary.active]}
                                />
                            </Card>
                            <Card
                                theme="danger"
                                style={{
                                    height: 'calc(40vh - 96px)',
                                    overflow: 'auto',
                                    width: '100%',
                                }}
                            >
                                <TheTable
                                    columnData={renameFirstColumn(
                                        columnDataSemantics2,
                                        'Исключенные фразы',
                                        [
                                            generateMassAddDelButton({
                                                placeholder: 'Добавить все',
                                                array: semanticsModalSemanticsMinusItemsFiltratedValue,
                                                mode: 'add',
                                            }),
                                            generateMassAddDelButton({
                                                placeholder: 'Удалить все',
                                                array: semanticsModalSemanticsMinusItemsFiltratedValue,
                                                mode: 'del',
                                            }),
                                        ],
                                    )}
                                    data={semanticsModalSemanticsMinusItemsFiltratedValue}
                                    filters={clustersFiltersMinus}
                                    setFilters={setClustersFiltersMinus}
                                    filterData={clustersFilterDataMinus}
                                    footerData={[semanticsFilteredSummary.minus]}
                                />
                            </Card>
                        </motion.div>
                    </Modal>
                    <Modal
                        open={plusPhrasesModalFormOpen}
                        onClose={() => setPlusPhrasesModalFormOpen(false)}
                    >
                        <Card
                            // view="raised"
                            view="clear"
                            style={{
                                width: '80em',
                                // animation: '1s cubic-bezier(0.1, -0.6, 0.2, 0)',
                                // animation: '3s linear 1s slidein',
                                // maxWidth: '15vw',
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
                                    width: '100%',

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
                                    Шаблоны
                                </Text>

                                <div
                                    style={{
                                        display: 'flex',
                                        width: '80%',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 8,
                                    }}
                                >
                                    <List
                                        onItemClick={(item) => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {advertsIds: {}},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const {adverts} = filteredData[i];
                                                if (adverts) {
                                                    for (const [id, advertsData] of Object.entries(
                                                        adverts,
                                                    )) {
                                                        if (!id || !advertsData) continue;
                                                        const {advertId} = advertsData as {
                                                            advertId: number;
                                                        };
                                                        if (!advertId) continue;
                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                            mode: 'Установить',
                                                            templateName: item,
                                                        };

                                                        if (
                                                            !doc.advertsPlusPhrasesTemplates[
                                                                selectValue[0]
                                                            ][advertId]
                                                        )
                                                            doc.advertsPlusPhrasesTemplates[
                                                                selectValue[0]
                                                            ][advertId] = {};
                                                        doc.advertsPlusPhrasesTemplates[
                                                            selectValue[0]
                                                        ][advertId].templateName = item;
                                                    }
                                                }
                                            }

                                            console.log(params);

                                            /////////////////////////
                                            callApi('setAdvertsPlusPhrasesTemplates', params);
                                            setChangedDoc(doc);
                                            /////////////////////////
                                            setPlusPhrasesModalFormOpen(false);
                                        }}
                                        renderItem={(item, isItemActive) => {
                                            return (
                                                <div
                                                    style={{
                                                        padding: 8,
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Text>{item}</Text>
                                                    {isItemActive ? (
                                                        <Button
                                                            size="xs"
                                                            view="flat"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                const params = {
                                                                    uid: getUid(),
                                                                    campaignName: selectValue[0],
                                                                    data: {
                                                                        mode: 'Удалить',
                                                                        name: item,
                                                                    },
                                                                };
                                                                const paramsAddToArt = {
                                                                    uid: getUid(),
                                                                    campaignName: selectValue[0],
                                                                    data: {advertsIds: {}},
                                                                };

                                                                delete doc.plusPhrasesTemplates[
                                                                    selectValue[0]
                                                                ][item];
                                                                setPlusPhrasesTemplatesLabels(
                                                                    (val) => {
                                                                        return val.filter(
                                                                            (name) => {
                                                                                return name != item;
                                                                            },
                                                                        );
                                                                    },
                                                                );

                                                                if (
                                                                    doc.advertsPlusPhrasesTemplates[
                                                                        selectValue[0]
                                                                    ]
                                                                )
                                                                    for (const [
                                                                        advertId,
                                                                        advertData,
                                                                    ] of Object.entries(
                                                                        doc
                                                                            .advertsPlusPhrasesTemplates[
                                                                            selectValue[0]
                                                                        ],
                                                                    )) {
                                                                        if (
                                                                            !advertId ||
                                                                            !advertData
                                                                        )
                                                                            continue;
                                                                        if (
                                                                            advertData[
                                                                                'templateName'
                                                                            ] == item
                                                                        ) {
                                                                            doc.advertsPlusPhrasesTemplates[
                                                                                selectValue[0]
                                                                            ][advertId] = undefined;
                                                                            paramsAddToArt.data.advertsIds[
                                                                                advertId
                                                                            ] = {
                                                                                mode: 'Удалить',
                                                                                templateName: item,
                                                                            };
                                                                        }
                                                                    }
                                                                console.log(paramsAddToArt);
                                                                console.log(params);

                                                                callApi(
                                                                    'setAdvertsPlusPhrasesTemplates',
                                                                    paramsAddToArt,
                                                                );

                                                                /////////////////////////
                                                                callApi(
                                                                    'setPlusPhraseTemplate',
                                                                    params,
                                                                );
                                                                setChangedDoc(doc);
                                                                /////////////////////////
                                                            }}
                                                        >
                                                            <Icon data={TrashBin} />
                                                        </Button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            );
                                        }}
                                        filterPlaceholder={`Поиск в ${plusPhrasesTemplatesLabels.length} шаблонах`}
                                        items={plusPhrasesTemplatesLabels}
                                        itemsHeight={300}
                                        itemHeight={28}
                                    />
                                </div>
                                {generateModalButtonWithActions(
                                    {
                                        view: 'flat-danger',
                                        icon: TrashBin,
                                        placeholder: 'Удалить',
                                        onClick: () => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {advertsIds: {}},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const {adverts} = filteredData[i];
                                                if (adverts) {
                                                    for (const [id, advertsData] of Object.entries(
                                                        adverts,
                                                    )) {
                                                        if (!id || !advertsData) continue;
                                                        const {advertId} = advertsData as {
                                                            advertId: number;
                                                        };
                                                        if (!advertId) continue;
                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                            mode: 'Удалить',
                                                        };

                                                        doc.advertsPlusPhrasesTemplates[
                                                            selectValue[0]
                                                        ][advertId] = undefined;
                                                    }
                                                }
                                            }
                                            console.log(params);

                                            /////////////////////////
                                            callApi('setAdvertsPlusPhrasesTemplates', params);
                                            setChangedDoc(doc);
                                            /////////////////////////
                                            setPlusPhrasesModalFormOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                            </div>
                        </Card>
                    </Modal>
                    <div style={{marginRight: 8}}>
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

                                if (!Object.keys(doc['campaigns'][nextValue[0]]).length) {
                                    callApi('getMassAdvertsNew', {
                                        uid: getUid(),
                                        dateRange: {from: '2023', to: '2024'},
                                        campaignName: nextValue,
                                    }).then((res) => {
                                        if (!res) return;
                                        const resData = res['data'];
                                        doc['campaigns'][nextValue[0]] =
                                            resData['campaigns'][nextValue[0]];
                                        doc['balances'][nextValue[0]] =
                                            resData['balances'][nextValue[0]];
                                        doc['plusPhrasesTemplates'][nextValue[0]] =
                                            resData['plusPhrasesTemplates'][nextValue[0]];
                                        doc['advertsPlusPhrasesTemplates'][nextValue[0]] =
                                            resData['advertsPlusPhrasesTemplates'][nextValue[0]];
                                        doc['advertsBudgetsToKeep'][nextValue[0]] =
                                            resData['advertsBudgetsToKeep'][nextValue[0]];
                                        doc['advertsSelectedPhrases'][nextValue[0]] =
                                            resData['advertsSelectedPhrases'][nextValue[0]];
                                        doc['advertsAutoBidsRules'][nextValue[0]] =
                                            resData['advertsAutoBidsRules'][nextValue[0]];
                                        doc['adverts'][nextValue[0]] =
                                            resData['adverts'][nextValue[0]];
                                        doc['placementsAuctions'][nextValue[0]] =
                                            resData['placementsAuctions'][nextValue[0]];
                                        doc['advertsSchedules'][nextValue[0]] =
                                            resData['advertsSchedules'][nextValue[0]];

                                        setChangedDoc(doc);
                                        setSelectValue(nextValue);
                                        // recalc(dateRange, nextValue[0]);

                                        setSwitchingCampaignsFlag(false);
                                        console.log(doc);
                                    });
                                } else {
                                    setSelectValue(nextValue);
                                    setSwitchingCampaignsFlag(false);
                                }
                                setWarningBeforeDeleteConfirmationRow(0);
                                setWarningBeforeDeleteConfirmation(false);
                                recalc(dateRange, nextValue[0], filters);
                                setPagesCurrent(1);
                            }}
                        />
                    </div>
                    {switchingCampaignsFlag ? (
                        <Spin style={{marginRight: 8, marginBottom: 8}} />
                    ) : (
                        <></>
                    )}
                    <div style={{marginRight: 8, marginBottom: '8px'}}>
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
                                <Text variant="subheader-1">
                                    {`Баланс: ${new Intl.NumberFormat('ru-RU').format(
                                        doc
                                            ? doc.balances
                                                ? doc.balances[selectValue[0]]
                                                    ? doc.balances[selectValue[0]].data
                                                        ? doc.balances[selectValue[0]].data.slice(
                                                              -1,
                                                          )[0]
                                                            ? doc.balances[
                                                                  selectValue[0]
                                                              ].data.slice(-1)[0].balance.net ?? 0
                                                            : 0
                                                        : 0
                                                    : 0
                                                : 0
                                            : 0,
                                    )}
                            Бонусы: ${new Intl.NumberFormat('ru-RU').format(
                                doc
                                    ? doc.balances
                                        ? doc.balances[selectValue[0]]
                                            ? doc.balances[selectValue[0]].data
                                                ? doc.balances[selectValue[0]].data.slice(-1)[0]
                                                    ? doc.balances[selectValue[0]].data.slice(-1)[0]
                                                          .balance.bonus ?? 0
                                                    : 0
                                                : 0
                                            : 0
                                        : 0
                                    : 0,
                            )} 
                            Счет: ${new Intl.NumberFormat('ru-RU').format(
                                doc
                                    ? doc.balances
                                        ? doc.balances[selectValue[0]]
                                            ? doc.balances[selectValue[0]].data
                                                ? doc.balances[selectValue[0]].data.slice(-1)[0]
                                                    ? doc.balances[selectValue[0]].data.slice(-1)[0]
                                                          .balance.balance ?? 0
                                                    : 0
                                                : 0
                                            : 0
                                        : 0
                                    : 0,
                            )}`}
                                </Text>
                            </Button>
                        </Popover>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginBottom: 8}}>
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
                    <div style={{width: 8}} />
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            loading={fetchingDataFromServerFlag}
                            size="l"
                            view="action"
                            onClick={updateTheData}
                        >
                            <Icon data={ArrowsRotateLeft} />
                            <Text variant="subheader-1">Обновить</Text>
                        </Button>
                        <div style={{width: 8}} />
                        {fetchingDataFromServerFlag ? <Spin style={{marginRight: 8}} /> : <></>}
                    </div>
                    <div ref={fieldRef}>
                        <Button
                            view="outlined-warning"
                            size="l"
                            onClick={() => {
                                setDatePickerOpen((curVal) => !curVal);
                            }}
                        >
                            <Text variant="subheader-1">
                                {`${startDate.toLocaleDateString(
                                    'ru-RU',
                                )} - ${endDate.toLocaleDateString('ru-RU')}`}
                            </Text>
                        </Button>
                    </div>
                </div>
                <Popup
                    open={datePickerOpen}
                    anchorRef={fieldRef}
                    onClose={() => recalc(dateRange)}
                    // placement="bottom-end"
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginLeft: 10,
                            height: 250,
                            width: 600,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'auto',
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    width="max"
                                    className={b('datePickerRangeButton')}
                                    view="outlined"
                                    onClick={() => {
                                        const range = [today, today];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Сегодня
                                </Button>
                                <div style={{width: 8}} />
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
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
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        const today = new Date();
                                        const startOfWeek = new Date(today);
                                        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to the first day of the current week (Sunday)

                                        const endOfWeek = new Date(today);
                                        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the current week (Saturday)

                                        const range = [startOfWeek, endOfWeek];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Текущая неделя
                                </Button>
                                <div style={{width: 8}} />
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        const today = new Date();
                                        const startOfPreviousWeek = new Date(today);
                                        startOfPreviousWeek.setDate(
                                            today.getDate() - today.getDay() - 7 + 1,
                                        ); // Set to the first day of the previous week (Sunday)

                                        const endOfPreviousWeek = new Date(startOfPreviousWeek);
                                        endOfPreviousWeek.setDate(
                                            startOfPreviousWeek.getDate() + 6,
                                        ); // Set to the last day of the previous week (Saturday)

                                        const range = [startOfPreviousWeek, endOfPreviousWeek];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Предыдущая неделя
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        const today = new Date();
                                        const startOfMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth(),
                                            1,
                                        ); // Set to the first day of the current month
                                        const endOfMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth() + 1,
                                            0,
                                        ); // Set to the last day of the current month

                                        const range = [startOfMonth, endOfMonth];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Текущий месяц
                                </Button>
                                <div style={{width: 8}} />
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        const today = new Date();
                                        const firstDayOfPreviousMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth() - 1,
                                            1,
                                        ); // First day of the previous month
                                        const lastDayOfPreviousMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth(),
                                            0,
                                        ); // Last day of the previous month

                                        const range = [
                                            firstDayOfPreviousMonth,
                                            lastDayOfPreviousMonth,
                                        ];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Предыдущий месяц
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        const today = new Date();
                                        const startOfYear = new Date(today.getFullYear(), 0, 1); // Set to the first day of the current year
                                        const endOfYear = new Date(today.getFullYear(), 11, 31); // Set to the last day of the current year

                                        const range = [startOfYear, endOfYear];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Текущий год
                                </Button>
                                <div style={{width: 8}} />
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        const today = new Date();
                                        const startOfPreviousYear = new Date(
                                            today.getFullYear() - 1,
                                            0,
                                            1,
                                        ); // Set to the first day of the previous year
                                        const endOfPreviousYear = new Date(
                                            today.getFullYear() - 1,
                                            11,
                                            31,
                                        ); // Set to the last day of the previous year

                                        const range = [startOfPreviousYear, endOfPreviousYear];
                                        setDateRange(range);
                                        recalc(range);
                                        setDatePickerOpen(false);
                                    }}
                                >
                                    Предыдущий год
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
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
                                <div style={{width: 8}} />
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
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
                                <div style={{width: 8}} />
                                <Button
                                    className={b('datePickerRangeButton')}
                                    width="max"
                                    view="outlined"
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
                        </div>
                        <div style={{width: '70%'}}>
                            <RangeCalendar
                                size="m"
                                timeZone="Europe/Moscow"
                                onUpdate={(val) => {
                                    const range = [val.start.toDate(), val.end.toDate()];
                                    setDateRange(range);
                                    setDatePickerOpen(false);
                                    recalc(range);
                                }}
                            />
                        </div>
                    </div>
                </Popup>
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxHeight: '60vh',
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
                </div>
                <div style={{height: 8}} />
                <Pagination
                    showInput
                    total={pagesTotal}
                    page={pagesCurrent}
                    pageSize={100}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 100, page * 100);
                        setFilteredSummary((row) => {
                            const temp = row;
                            temp.art = `На странице: ${paginatedDataTemp.length} Всего: ${filteredData.length}`;

                            return temp;
                        });
                        setPaginatedData(paginatedDataTemp);
                    }}
                />
            </div>
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
    const isSelected = selectedButton == placeholder;
    if (onClick || selected) {
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
            <motion.div
                animate={{opacity: isSelected && !disabled ? 1 : 0, x: isSelected ? -16 : 0}}
            >
                <Button
                    pin="circle-circle"
                    view="flat-success"
                    onClick={() => {
                        setSelectedButton('');
                        onClick();
                    }}
                >
                    <Icon data={Check} />
                </Button>
            </motion.div>
            <Button
                disabled={(!isSelected && selectedButton != '') || disabled}
                style={
                    style ?? {
                        margin: '4px 0px',
                    }
                }
                pin={pin ?? 'circle-circle'}
                size={size ?? 'l'}
                view={view ?? 'action'}
                selected={isSelected}
                onClick={() => {
                    setSelectedButton((val) => {
                        return val == placeholder ? '' : placeholder;
                    });
                }}
            >
                <Icon data={icon} />
                {placeholder}
            </Button>
            <motion.div
                animate={{opacity: isSelected && !disabled ? 1 : 0, x: isSelected ? 16 : 0}}
            >
                <Button
                    pin="circle-circle"
                    view="flat-danger"
                    onClick={() => setSelectedButton('')}
                >
                    <Icon data={Xmark} />
                </Button>
            </motion.div>
        </motion.div>
    );
};

const generateScheduleInput = (args) => {
    const {scheduleInput, setScheduleInput} = args;
    const weekDayNamesTemp = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const weekInputDayNames = [] as any[];
    const weekInput = [] as any[];

    const tempHours = [] as any[];
    for (let j = 0; j < 24; j++) {
        const isCheckboxChecked = (() => {
            for (let i = 0; i < 7; i++) {
                if (!scheduleInput[i]) return false;
                if (!scheduleInput[i][j]) return false;
                if (!scheduleInput[i][j].selected) return false;
            }
            return true;
        })();
        tempHours.push(
            <div
                style={{
                    width: 25,
                    margin: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text variant="subheader-1">{j}</Text>
                <Button
                    style={{
                        width: 16,
                        height: 16,
                    }}
                    view={isCheckboxChecked ? 'action' : 'outlined'}
                    onClick={() => {
                        const tempScheduleInput = Object.assign({}, scheduleInput);
                        for (let i = 0; i < 7; i++) {
                            if (!tempScheduleInput[i]) tempScheduleInput[i] = {};
                            if (!tempScheduleInput[i][j]) tempScheduleInput[i][j] = {};
                            tempScheduleInput[i][j] = {selected: !isCheckboxChecked};
                        }

                        console.log(tempScheduleInput);

                        setScheduleInput(tempScheduleInput);
                    }}
                >
                    {/* {isCheckboxChecked ? <Icon size={1} data={Check} /> : <></>} */}
                </Button>
            </div>,
        );
    }
    weekInput.push(<div style={{display: 'flex', flexDirection: 'row'}}>{tempHours}</div>);

    for (let i = 0; i < 7; i++) {
        const isCheckboxChecked =
            scheduleInput[i] &&
            (() => {
                for (let j = 0; j < 24; j++) {
                    if (!scheduleInput[i][j]) return false;
                    if (!scheduleInput[i][j].selected) return false;
                }
                return true;
            })();
        weekInputDayNames.push(
            <div
                style={{
                    height: 25,
                    margin: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text variant="subheader-1">{weekDayNamesTemp[i]}</Text>
                <div style={{minWidth: 4}} />
                <Button
                    style={{
                        width: 16,
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    view={isCheckboxChecked ? 'action' : 'outlined'}
                    onClick={() => {
                        const tempScheduleInput = Object.assign({}, scheduleInput);
                        for (let j = 0; j < 24; j++) {
                            if (!tempScheduleInput[i]) tempScheduleInput[i] = {};
                            if (!tempScheduleInput[i][j]) tempScheduleInput[i][j] = {};
                            tempScheduleInput[i][j] = {selected: !isCheckboxChecked};
                        }
                        console.log(tempScheduleInput);

                        setScheduleInput(tempScheduleInput);
                    }}
                >
                    {/* {isCheckboxChecked ? <Icon size={1} data={Check} /> : <></>} */}
                </Button>
            </div>,
        );
        const temp = [] as any[];
        for (let j = 0; j < 24; j++) {
            temp.push(
                <Button
                    style={{width: 25, height: 25, margin: 2}}
                    view={
                        scheduleInput[i]
                            ? scheduleInput[i][j]
                                ? scheduleInput[i][j].selected
                                    ? 'action'
                                    : 'outlined'
                                : 'outlined'
                            : 'outlined'
                    }
                    onClick={() => {
                        const val = Object.assign({}, scheduleInput);
                        if (!val[i]) val[i] = {};
                        if (!val[i][j]) val[i][j] = {selected: false};
                        val[i][j].selected = !val[i][j].selected;
                        console.log(val[i][j]);
                        setScheduleInput(val);
                    }}
                />,
            );
        }
        weekInput.push(<div style={{display: 'flex', flexDirection: 'row'}}>{temp}</div>);
    }
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>{weekInputDayNames}</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>{weekInput}</div>
        </div>
    );
};

const generateCard = (args) => {
    const {summary, key, placeholder} = args;
    const cardStyle = {
        width: '18vh',
        height: '18vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        marginRight: '4px',
        marginLeft: '4px',
    };
    return (
        <Card style={cardStyle} theme="info" view="raised">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: '18pt',
                        marginTop: '10px',
                    }}
                >
                    {new Intl.NumberFormat('ru-RU').format(summary[key])}
                </Text>
                <Text>{placeholder}</Text>
            </div>
        </Card>
    );
};

const parseFirst10Pages = async (
    searchPhrase,
    setFetchedPlacements,
    setCurrentParsingProgress,
    pagesCount = 20,
    startPage = 0,
    startValuesList = {updateTime: '', data: {}},
    startValuesProg = {
        max: pagesCount * 100,
        progress: 0,
        warning: false,
        error: false,
        isParsing: false,
    },
) => {
    const allCardDataList = startValuesList ?? {updateTime: '', data: {}};

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
        const url = `https://search.wb.ru/exactmatch/ru/common/v5/search?ab_testing=false&appType=1&page=${page}&curr=rub&dest=-1257218&query=${encodeURIComponent(
            searchPhrase,
        )}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data && data.data && data.data.products && data.data.products.length == 100) {
                const myData = {};
                for (let i = 0; i < data.data.products.length; i++) {
                    const index = i + 1 + (page - 1) * 100;

                    setCurrentParsingProgress((obj) => {
                        const curVal = Object.assign({}, obj);
                        if (!curVal[searchPhrase]) curVal[searchPhrase] = {max: pagesCount * 100};
                        if (index == pagesCount * 100) curVal[searchPhrase].warning = false;
                        if (index % 100 == 0) {
                            curVal[searchPhrase].progress = index;
                        }
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });

                    const cur = data.data.products[i];
                    cur.index = index;
                    const {id} = cur;
                    myData[id] = cur;
                }

                Object.assign(allCardDataList.data, myData);

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
