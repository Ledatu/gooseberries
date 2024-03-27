import React, {useEffect, useRef, useState} from 'react';
// import {scheduleJob} from 'node-schedule';
import {
    Spin,
    DropdownMenu,
    Button,
    Text,
    Card,
    Select,
    SelectOption,
    // Popover,
    Popup,
    TextInput,
    Link,
    Icon,
    Popover,
    Label,
    PopoverBehavior,
    Modal,
    Pagination,
    Checkbox,
    RadioButton,
    List,
    // TextArea,
    Switch,
    // Switch,
    // Checkbox,
    // RadioButton,
    // Icon,
    // TextInput,
} from '@gravity-ui/uikit';
import {RangeCalendar} from '@gravity-ui/date-components';
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
    Magnifier,
    LayoutHeader,
    ChartLine,
    CircleRuble,
    SlidersVertical,
    ChevronDown,
    CircleMinusFill,
    CircleMinus,
    CirclePlusFill,
    ArrowRight,
    CirclePlus,
    Funnel,
    // DiamondExclamation,
    // CloudCheck,
    Ban,
    Calendar,
    Eye,
    EyeSlash,
    // CircleRuble,
    Pin,
    PinSlash,
    TrashBin,
    // Play,
    // Pause,
    Check,
    CloudArrowUpIn,
    Xmark,
    LayoutHeaderCursor,
} from '@gravity-ui/icons';
import useWindowDimensions from 'src/hooks/useWindowDimensions';
import {motion} from 'framer-motion';

import ChartKit, {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import callApi from 'src/utilities/callApi';
import axios from 'axios';
settings.set({plugins: [YagrPlugin]});

const getUid = () => {
    return [
        'f9192af1-d9fa-4e3c-8959-33b668413e8c',
        '4a1f2828-9a1e-4bbf-8e07-208ba676a806',
        '46431a09-85c3-4703-8246-d1b5c9e52594',
        '1c5a0344-31ea-469e-945e-1dfc4b964ecd',
        '9af0639b-4f32-48af-b81a-171580f7b144',
    ].includes(Userfront.user.userUuid ?? '')
        ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
        : '';
};

const getUserDoc = (docum = undefined) => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getMassAdvertsNew', {
            uid: getUid(),
            dateRange: {from: '2023', to: '2024'},
            campaignName:
                Userfront.user.userUuid == 'f9192af1-d9fa-4e3c-8959-33b668413e8c'
                    ? 'Клининг Сервис'
                    : Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594'
                    ? 'ИП Иосифов М.С.'
                    : Userfront.user.userUuid == '9af0639b-4f32-48af-b81a-171580f7b144'
                    ? 'ИП Коноплёв К.В.'
                    : 'ИП Валерий',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const MassAdvertPage = () => {
    const myObserver = new ResizeObserver((entries) => {
        console.log('resized');

        const advertsColumnItems = document.getElementsByClassName('td_fixed_adverts');
        for (let i = 0; i < advertsColumnItems.length; i++) {
            (advertsColumnItems[i] as HTMLElement).style.left = `${
                entries[0].contentRect.width + 20
            }px`;
        }
    });

    const windowDimensions = useWindowDimensions();

    const isDesktop = windowDimensions.height < windowDimensions.width;

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [fetchedPlacements, setFetchedPlacements] = useState<any>(undefined);

    const [advertsTypesInput, setAdvertsTypesInput] = useState({
        search: false,
        booster: false,
        carousel: false,
    });

    const [filters, setFilters] = useState({undef: false});

    const [pinned, setPinned] = useState({isPinned: false, oldArtFilters: {}});
    // const [manageModalOpen, setManageModalOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');

    // const [semanticsModalTextAreaAddMode, setSemanticsModalTextAreaAddMode] = useState(false);
    // const [semanticsModalTextAreaValue, setSemanticsModalTextAreaValue] = useState('');

    const [modalFormOpen, setModalFormOpen] = useState(false);
    // const [budgetInputValue, setBudgetInputValue] = useState(500);
    // const [budgetInputValidationValue, setBudgetInputValidationValue] = useState(true);
    // const [bidInputValue, setBidInputValue] = useState(125);
    // const [bidInputValidationValue, setBidInputValidationValue] = useState(true);
    // const [placementsRecomInputValue, setPlacementsRecomInputValue] = useState(false);
    // const [placementsBoosterInputValue, setPlacementsBoosterInputValue] = useState(true);
    // const [placementsCarouselInputValue, setPlacementsCarouselInputValue] = useState(false);
    // const advertTypeSwitchValues: any[] = [
    //     {value: 'Авто', content: 'Авто'},
    //     {value: 'Поиск', content: 'Поиск'},
    // ];
    // const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = React.useState('Авто');
    const [groupingEnabledState, setGroupingEnabledState] = useState(true);

    const [plusPhrasesModalFormOpen, setPlusPhrasesModalFormOpen] = useState(false);
    const [plusPhrasesTemplatesLabels, setPlusPhrasesTemplatesLabels] = useState<any[]>([]);

    const [budgetModalFormOpen, setBudgetModalFormOpen] = useState(false);
    const [budgetModalBudgetInputValue, setBudgetModalBudgetInputValue] = useState(500);
    const [budgetModalBudgetInputValidationValue, setBudgetModalBudgetInputValidationValue] =
        useState(true);
    const budgetModalSwitchValues: any[] = [
        {value: 'Пополнить', content: 'Пополнить'},
        {value: 'Установить лимит', content: 'Установить лимит'},
    ];
    const [budgetModalSwitchValue, setBudgetModalSwitchValue] = React.useState('Пополнить');

    const [semanticsAutoPhrasesModalFormOpen, setSemanticsAutoPhrasesModalFormOpen] =
        useState(false);
    const [semanticsAutoPhrasesModalIncludesList, setSemanticsAutoPhrasesModalIncludesList] =
        useState<any[]>([]);
    // const [
    //     semanticsAutoPhrasesModalIncludesListTemp,
    //     setSemanticsAutoPhrasesModalIncludesListTemp,
    // ] = useState<any[]>([]);
    const [
        semanticsAutoPhrasesModalIncludesListInput,
        setSemanticsAutoPhrasesModalIncludesListInput,
    ] = useState('');
    const [semanticsAutoPhrasesModalNotIncludesList, setSemanticsAutoPhrasesModalNotIncludesList] =
        useState<any[]>([]);
    // const [
    //     semanticsAutoPhrasesModalNotIncludesListTemp,
    //     setSemanticsAutoPhrasesModalNotIncludesListTemp,
    // ] = useState<any[]>([]);
    const [
        semanticsAutoPhrasesModalNotIncludesListInput,
        setSemanticsAutoPhrasesModalNotIncludesListInput,
    ] = useState('');

    const [semanticsModalFormOpen, setSemanticsModalFormOpen] = useState(false);
    const [semanticsModalOpenFromArt, setSemanticsModalOpenFromArt] = useState('');
    const [semanticsModalSemanticsItemsValue, setSemanticsModalSemanticsItemsValue] = useState<
        any[]
    >([]);
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
        semanticsModalSemanticsPlusItemsTemplateNameValue,
        setSemanticsModalSemanticsPlusItemsTemplateNameValue,
    ] = useState('Не установлен');
    const [
        semanticsModalSemanticsPlusItemsTemplateNameSaveValue,
        setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue,
    ] = useState('Новый шаблон');
    const [semanticsModalSemanticsThresholdValue, setSemanticsModalSemanticsThresholdValue] =
        useState(100);
    const [semanticsModalSemanticsCTRThresholdValue, setSemanticsModalSemanticsCTRThresholdValue] =
        useState(5);

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

    const [clustersFiltersActive, setClustersFiltersActive] = useState({undef: false});
    const [clustersSortByActive, setClustersSortByActive] = useState({undef: false});
    const clustersSortDataActive = (clusters: any[], withSortBy: any) => {
        const _sortBy = withSortBy ?? clustersSortByActive;
        const {key, ord, valueType} = _sortBy;
        return clusters.sort((a, b) => {
            if (valueType == 'number') {
                return ord == 'asc' ? a[key] - b[key] : b[key] - a[key];
            } else {
                const strA = String(a[key]).toLocaleLowerCase();
                const strB = String(b[key]).toLocaleLowerCase();
                return ord == 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });
    };
    const clustersFilterDataActive = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersActive;
        const _clusters = clusters ?? semanticsModalSemanticsItemsValue;
        console.log(_clustersFilters, _clusters);

        setSemanticsModalSemanticsItemsFiltratedValue(
            _clusters.filter((cluster) => {
                for (const [filterArg, filterData] of Object.entries(_clustersFilters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;
                    else if (!compare(cluster[filterArg], filterData)) {
                        return false;
                    }
                }

                return true;
            }),
        );
    };
    const [clustersFiltersMinus, setClustersFiltersMinus] = useState({undef: false});
    const [clustersSortByMinus, setClustersSortByMinus] = useState({undef: false});
    const clustersSortDataMinus = (clusters: any[], withSortBy: any) => {
        const _sortBy = withSortBy ?? clustersSortByMinus;
        const {key, ord, valueType} = _sortBy;
        return clusters.sort((a, b) => {
            if (valueType == 'number') {
                return ord == 'asc' ? a[key] - b[key] : b[key] - a[key];
            } else {
                const strA = String(a[key]).toLocaleLowerCase();
                const strB = String(b[key]).toLocaleLowerCase();
                return ord == 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });
    };
    const clustersFilterDataMinus = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersMinus;
        const _clusters = clusters ?? semanticsModalSemanticsMinusItemsValue;
        console.log(_clustersFilters, _clusters);

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
                temp.push(cluster);
            }
        }
        console.log(temp);

        setSemanticsModalSemanticsMinusItemsFiltratedValue([...temp]);
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
    const generateColumns = (columnsInfo) => {
        const columns: Column<any>[] = [
            // {
            //     sortable: false,
            //     name: 'selected',
            //     header: (
            //         // <Checkbox
            //         //     style={{marginTop: 5}}
            //         //     value={Number(selectAllDisplayed)}
            //         //     onUpdate={(checked) => {
            //         //         setSelectAllDisplayed(checked);
            //         //     }}
            //         //     size="l"
            //         // />
            //     ),
            //     render: ({value}) => {
            //         if (!value) return;
            //         const {val, disabled} = value as {val: boolean; disabled: boolean};
            //         if (disabled) return;
            //         return <Checkbox>{val}</Checkbox>;
            //     },
            // },
        ];
        if (!columnsInfo && !columnsInfo.length) return columns;
        const viewportSize = useWindowDimensions();

        for (let i = 0; i < columnsInfo.length; i++) {
            const column = columnsInfo[i];
            if (!column) continue;
            const {name, placeholder, width, render, className, valueType, group} = column;

            columns.push({
                name: name,
                className: b(className ?? (i < 2 ? `td_fixed td_fixed_${name}` : 'td_body')),
                header: generateFilterTextInput({
                    pinned,
                    filters,
                    setFilters,
                    filterData: filterTableData,
                    name,
                    placeholder,
                    valueType,
                    width,
                    viewportSize,
                }),
                group: group && groupingEnabledState,
                render: render
                    ? (args) => render(args)
                    : ({value}) => {
                          return typeof value === 'number'
                              ? new Intl.NumberFormat('ru-RU').format(value)
                              : value;
                      },
            });
        }

        return columns;
    };

    const paramMap = {
        status: {
            '-1': 'В процессе удаления',
            4: 'Готова к запуску',
            7: 'Завершена',
            8: 'Отказался',
            // 9: 'Идут показы',
            9: 'Активна',
            11: 'Пауза',
        },
        type: {
            4: 'Каталог',
            5: 'Карточка товара',
            6: 'Поиск',
            7: 'Главная страница',
            8: 'Авто',
            9: 'Поиск + Каталог',
        },
    };
    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, row, footer, index}) => {
                return footer ? (
                    <div style={{height: 28}}>{value}</div>
                ) : (
                    <div
                        title={value}
                        style={{
                            maxWidth: '20vw',
                            display: 'flex',
                            flexDirection: 'row',
                            zIndex: 40,
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            title={value}
                            style={{
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'row',
                                marginRight: 8,
                            }}
                        >
                            <div
                                style={{
                                    width: `${String(filteredData.length).length * 6}px`,
                                    margin: '0 16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    className={b('art_pin')}
                                    size="xs"
                                    view="flat"
                                    onClick={() => {
                                        setFilters(() => {
                                            if (!pinned.isPinned) {
                                                setPinned({
                                                    isPinned: true,
                                                    oldArtFilters: filters['art'],
                                                });
                                                filters['art'] = {compMode: 'equal', val: value};
                                            } else {
                                                filters['art'] = pinned.oldArtFilters;
                                                setPinned({
                                                    isPinned: false,
                                                    oldArtFilters: {compMode: 'include', val: ''},
                                                });
                                            }

                                            filterTableData(filters);
                                            return filters;
                                        });
                                    }}
                                >
                                    <Icon data={pinned.isPinned ? PinSlash : Pin} size={13} />
                                </Button>
                                <div className={b('art_index')}>
                                    {Math.floor((pagesCurrent - 1) * 200 + index / 3 + 1)}
                                </div>
                            </div>
                            <Link
                                style={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                href={`https://www.wildberries.ru/catalog/${row.nmId}/detail.aspx?targetUrl=BP`}
                                target="_blank"
                            >
                                {value}
                            </Link>
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
            render: ({value, row}) => {
                if (value === null) return;
                if (value) {
                    paramMap[4] = paramMap[4] + '';
                }
                const mapp = {
                    search: 'Поиск',
                    booster: 'Бустер',
                    carousel: 'Карточка',
                };

                const {art, advertsType} = row;
                const advertsManagerRulesMode = row.advertsManagerRules
                    ? row.advertsManagerRules[advertsType]
                        ? row.advertsManagerRules[advertsType].mode
                        : false
                    : false;
                const {
                    updateTime,
                    disabledByDRR,
                    disabledByStocks,
                }: {updateTime: string; disabledByDRR: boolean; disabledByStocks: boolean} =
                    row.advertsManagerRules ? row.advertsManagerRules[advertsType] ?? {} : {};
                const {status, daysInWork} = value ?? {};

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Switch
                                title={`${
                                    updateTime
                                        ? new Date(updateTime).toLocaleString('ru-RU') + ' '
                                        : ''
                                }${
                                    disabledByDRR || disabledByStocks
                                        ? 'Выкл. по ' + disabledByDRR
                                            ? 'ДРР'
                                            : '' + disabledByStocks
                                            ? 'Остаткам'
                                            : ''
                                        : ''
                                }`}
                                checked={advertsManagerRulesMode}
                                // defaultChecked={advertsManagerRulesMode}
                                style={{display: 'flex', alignItems: 'top'}}
                                onUpdate={(checked) => {
                                    if (!doc['campaigns'][selectValue[0]][art].advertsManagerRules)
                                        doc['campaigns'][selectValue[0]][art].advertsManagerRules =
                                            {};

                                    if (
                                        !doc['campaigns'][selectValue[0]][art].advertsManagerRules[
                                            advertsType
                                        ]
                                    )
                                        doc['campaigns'][selectValue[0]][art].advertsManagerRules[
                                            advertsType
                                        ] = {mode: false};

                                    doc['campaigns'][selectValue[0]][art].advertsManagerRules[
                                        advertsType
                                    ].mode = checked;
                                    setChangedDoc(doc);

                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            arts: {},
                                        },
                                    };
                                    params.data.arts[row.art] = {};
                                    params.data.arts[row.art][advertsType] = checked;
                                    console.log(params);

                                    callApi('updateAdvertsManagerRules', params);
                                }}
                            ></Switch>
                            <div style={{width: 8}} />

                            <Text
                                // style={{position: 'relative', top: -2}}
                                color={
                                    status
                                        ? Object.keys(
                                              doc['campaigns'][selectValue[0]][art]
                                                  ? doc['campaigns'][selectValue[0]][art]['adverts']
                                                      ? doc['campaigns'][selectValue[0]][art][
                                                            'adverts'
                                                        ][advertsType]
                                                      : {}
                                                  : {},
                                          ).length > 1
                                            ? 'info'
                                            : status
                                            ? status == 9
                                                ? 'positive'
                                                : status == '11'
                                                ? 'danger'
                                                : 'warning'
                                            : 'primary'
                                        : 'primary'
                                }
                            >
                                {mapp[advertsType]}
                            </Text>
                        </div>
                        <div style={{width: 8}} />
                        {status !== undefined ? (
                            <Button
                                size="xs"
                                view="outlined"
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
                                <Icon size={12} data={status ? Calendar : Ban}></Icon>
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
        {name: 'brand', placeholder: 'Бренд', valueType: 'text', group: true},
        {name: 'object', placeholder: 'Предмет', valueType: 'text', group: true},
        {
            name: 'title',
            placeholder: 'Наименование',
            valueType: 'text',
            group: true,
            render: ({value}) => {
                return <div style={{overflow: 'scroll'}}>{value}</div>;
            },
        },
        {
            name: 'placements',
            placeholder: 'Позиция',
            render: ({value, row}) => {
                if (!value) return undefined;
                const {drrAI, placementsValue} = row;

                if (!placementsValue) return undefined;
                const {updateTime, index, phrase, log, firstAdvertIndex} = placementsValue;
                const {placementsRange} = drrAI ?? {};
                if (phrase == '') return undefined;

                const {position} = log ?? {};

                const updateTimeObj = new Date(updateTime);
                const moreThatHour =
                    new Date().getTime() / 1000 / 3600 - updateTimeObj.getTime() / 1000 / 3600 > 1;
                return (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {position ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text color="secondary">{`${position}`}</Text>
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
                            >{`${!index || index == -1 ? 'Нет в выдаче' : index}`}</Text>
                            <div style={{width: 4}} />
                        </div>
                        <Link
                            href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${phrase}`}
                            target="_blank"
                            // view="primary"
                        >{`${phrase}`}</Link>
                        <Text
                            color={moreThatHour ? 'danger' : 'primary'}
                        >{`${updateTimeObj.toLocaleString('ru-RU')}`}</Text>
                        <Text>
                            {placementsRange
                                ? placementsRange.from != 0 && placementsRange.to != 0
                                    ? `Диапазон: ${placementsRange.from} - ${placementsRange.to}`
                                    : 'Ставки по ДРР'
                                : ''}
                        </Text>
                        <Text>{`Позиция первой карточки с РК: ${firstAdvertIndex}`}</Text>
                    </div>
                );
            },
            group: true,
        },
        {
            name: 'semantics',
            placeholder: 'Фразы',
            valueType: 'text',
            render: ({value, row}) => {
                if (value === null) return;
                // if (!row.adverts) return;
                // const themeToUse = 'normal';
                // console.log(value.plus);
                const art = row.art;
                const plusPhrasesTemplate = row.plusPhrasesTemplate;
                const autoPhrasesTemplate = doc.plusPhrasesTemplates[selectValue[0]][
                    plusPhrasesTemplate
                ]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                          .autoPhrasesTemplate
                    : undefined;

                const themeToUse = plusPhrasesTemplate
                    ? autoPhrasesTemplate &&
                      ((autoPhrasesTemplate.includes && autoPhrasesTemplate.includes.length) ||
                          (autoPhrasesTemplate.notIncludes &&
                              autoPhrasesTemplate.notIncludes.length))
                        ? 'success'
                        : 'info'
                    : 'normal';

                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Label
                            // theme="normal"
                            // theme="info"
                            theme={themeToUse}
                            onClick={() => {
                                setSemanticsModalFormOpen(true);

                                setSemanticsModalOpenFromArt(art);

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

                                setSemanticsModalSemanticsItemsValue(
                                    value ? value.clusters ?? [] : [],
                                );
                                setSemanticsModalSemanticsItemsFiltratedValue(
                                    value ? value.clusters ?? [] : [],
                                );
                                setSemanticsModalSemanticsMinusItemsValue(
                                    value ? value.excluded ?? [] : [],
                                );
                                setSemanticsModalSemanticsMinusItemsFiltratedValue(
                                    value ? value.excluded ?? [] : [],
                                );
                                setSemanticsModalSemanticsPlusItemsTemplateNameValue(
                                    plusPhrasesTemplate ?? 'Не установлен',
                                );

                                const plusThreshold = doc.plusPhrasesTemplates[selectValue[0]][
                                    plusPhrasesTemplate
                                ]
                                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                                          .threshold
                                    : 100;
                                setSemanticsModalSemanticsThresholdValue(plusThreshold);

                                const plusCTRThreshold = doc.plusPhrasesTemplates[selectValue[0]][
                                    plusPhrasesTemplate
                                ]
                                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                                          .ctrThreshold
                                    : 5;
                                setSemanticsModalSemanticsCTRThresholdValue(plusCTRThreshold);

                                const isFixed = doc.plusPhrasesTemplates[selectValue[0]][
                                    plusPhrasesTemplate
                                ]
                                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                                          .isFixed ?? false
                                    : false;
                                setSemanticsModalIsFixed(isFixed);

                                // console.log(value.plus);
                                setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                    plusPhrasesTemplate ?? `Новый шаблон`,
                                );
                                const plusItems = doc.plusPhrasesTemplates[selectValue[0]][
                                    plusPhrasesTemplate
                                ]
                                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                                          .clusters
                                    : [];
                                setSemanticsModalSemanticsPlusItemsValue(plusItems);
                                // setSemanticsModalTextAreaValue('');
                                // setSemanticsModalTextAreaAddMode(false);
                            }}
                        >
                            {themeToUse != 'normal' ? plusPhrasesTemplate : 'Добавить'}
                        </Label>
                        {Array.from(value ? value.clusters ?? [] : []).length ? (
                            <>
                                <div style={{width: 5}} />
                                <Label theme="clear">
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {value.clusters.length}
                                        <div style={{width: 3}} />
                                        <Icon size={12} data={Eye} />
                                    </div>
                                </Label>
                            </>
                        ) : (
                            <></>
                        )}
                        {Array.from(value ? value.excluded ?? [] : []).length ? (
                            <>
                                <div style={{width: 5}} />
                                <Label theme="clear">
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {value.excluded.length}
                                        <div style={{width: 3}} />
                                        <Icon size={12} data={EyeSlash} />
                                    </div>
                                </Label>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
        {
            name: 'stocks',
            placeholder: 'Остаток',
            group: true,
            render: ({value, row}) => {
                const {advertsStocksThreshold} = row;

                if (!advertsStocksThreshold) return value;
                const {stocksThreshold} = advertsStocksThreshold ?? {};

                if (!stocksThreshold) return value;
                return (
                    <div>
                        <Text>{`${value} (${stocksThreshold})`}</Text>
                    </div>
                );
            },
        },
        {name: 'budgetToKeep', placeholder: 'Бюджет, ₽'},
        {name: 'budget', placeholder: 'Баланс, ₽'},
        {
            name: 'bid',
            placeholder: 'Ставка, ₽',
            render: ({value, row}) => {
                if (!value) return;

                const cpm = value;
                if (!cpm) return;

                const {bidLog, drrAI} = row;

                const timeline: any[] = [];
                const graphsData: any[] = [];
                if (bidLog) {
                    for (let i = 0; i < bidLog.bids.length; i++) {
                        const {time, val} = bidLog.bids[i];
                        if (!time || !val) continue;

                        timeline.push(new Date(time).getTime());
                        graphsData.push(val);
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
                        ],
                    },
                    libraryConfig: {
                        chart: {
                            series: {
                                type: 'line',
                                interpolation: 'smooth',
                            },
                        },
                        axes: {
                            y: {
                                precision: 'auto',
                                show: true,
                            },
                            x: {
                                precision: 'auto',
                                show: true,
                            },
                        },
                        title: {
                            text: 'Изменение ставки',
                        },
                    },
                };

                return (
                    <div>
                        <Popover
                            behavior={'delayed' as PopoverBehavior}
                            disabled={value === undefined}
                            content={
                                <>
                                    <ChartKit type="yagr" data={yagrData} />
                                </>
                            }
                        >
                            {/* <Label onClick={()=>} ref={ref}>{value}</Label> */}
                            <Text>
                                {`${cpm}` +
                                    (drrAI ? (drrAI.maxBid ? ` (${drrAI.maxBid})` : '') : '')}
                            </Text>
                        </Popover>
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
                const desiredDRR = row.drrAI ? row.drrAI.desiredDRR ?? undefined : undefined;

                return (
                    <Text
                        color={
                            desiredDRR
                                ? value <= desiredDRR
                                    ? value == 0
                                        ? 'primary'
                                        : 'positive'
                                    : value / desiredDRR - 1 < 0.5
                                    ? 'warning'
                                    : 'danger'
                                : 'primary'
                        }
                    >
                        {value}
                    </Text>
                );
            },
        },
        {
            name: 'drrAI',
            placeholder: 'План ДРР, %',
            render: ({value}) => {
                if (!value) return;
                const {desiredDRR} = value;
                if (desiredDRR === undefined) return;

                return (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Text>{desiredDRR} </Text>
                            {/* <div style={{width: 2}} />₽ */}
                        </div>
                        <div style={{width: 8}} />
                    </div>
                );
            },
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
        adverts: null,
        semantics: null,
    });

    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [sort, setSort] = React.useState<any[]>([{column: 'Расход', order: 'asc'}]);
    // const [doc, setUserDoc] = React.useState(getUserDoc());
    const doc = getUserDoc(changedDoc);

    if (fetchedPlacements) {
        Object.assign(doc.fetchedPlacements, fetchedPlacements);
        console.log(doc);

        setFetchedPlacements(undefined);
        setChangedDoc(doc);
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
    const recalc = (daterng, selected = '') => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);

        const summaryTemp = {
            views: 0,
            clicks: 0,
            ctr: 0,
            sum: 0,
            drr_orders: 0,
            drr_sales: 0,
            sum_orders: 0,
            sum_sales: 0,
        };

        const campaignData = doc
            ? doc.campaigns
                ? doc.campaigns[selected == '' ? selectValue[0] : selected]
                : {}
            : {};
        const temp = {};
        for (const [art, artData] of Object.entries(campaignData)) {
            if (!art || !artData) continue;
            const artInfo = {
                art: '',
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
                drrAI: undefined,
                plusPhrasesTemplate: undefined,
            };

            artInfo.art = artData['art'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];
            artInfo.adverts = artData['adverts'];
            artInfo.advertsManagerRules = artData['advertsManagerRules'];
            artInfo.advertsStocksThreshold = artData['advertsStocksThreshold'];
            artInfo.placementsValue = artData['placements'];
            artInfo.drrAI = artData['drrAI'];
            artInfo.plusPhrasesTemplate = artData['plusPhrasesTemplate'];
            artInfo.placements = artData['placements'] ? artData['placements'].index : undefined;

            for (const [key, _] of Object.entries({
                search: 'search',
                booster: 'booster',
                carousel: 'carousel',
            })) {
                artInfo[key] = {
                    semantics: undefined,
                    budget: undefined,
                    bid: undefined,
                    bidLog: {},
                    budgetToKeep: artData['budgetToKeep']
                        ? artData['budgetToKeep'][key]
                        : undefined,
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
                };
            }

            // console.log(artInfo);

            if (artInfo.adverts) {
                for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
                    if (!advertType || advertType == 'none' || !advertsOfType) continue;

                    for (const [advertId, advertData] of Object.entries(advertsOfType)) {
                        if (!advertId || !advertData) continue;
                        const status = advertData['status'];
                        if (![4, 9, 11].includes(status)) continue;
                        const budget = advertData['budget'];
                        artInfo[advertType].budget = budget;
                        artInfo[advertType].semantics = advertData['words'];
                        artInfo[advertType].bid = advertData['cpm'];
                        artInfo[advertType].bidLog = advertData['bidLog'];
                    }
                }
            }
            if (artData['advertsStats']) {
                for (const [strDate, dateData] of Object.entries(artData['advertsStats'])) {
                    if (strDate == 'updateTime' || !dateData) continue;
                    for (const [key, day] of Object.entries(dateData)) {
                        if (!day) continue;
                        const date = new Date(strDate);
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        if (date < startDate || date > endDate) continue;

                        artInfo[key].sum_orders += day['sum_orders'];
                        artInfo[key].orders += day['orders'];
                        artInfo[key].sum_sales += day['sum_sales'];
                        artInfo[key].sales += day['sales'];
                        artInfo[key].sum += day['sum'];
                        artInfo[key].views += day['views'];
                        artInfo[key].clicks += day['clicks'];
                    }
                }
                for (const [key, _] of Object.entries({
                    search: 'search',
                    booster: 'booster',
                    carousel: 'carousel',
                })) {
                    artInfo[key].sum_orders = Math.round(artInfo[key].sum_orders);
                    artInfo[key].orders = Math.round(artInfo[key].orders * 100) / 100;
                    artInfo[key].sum_sales = Math.round(artInfo[key].sum_sales);
                    artInfo[key].sales = Math.round(artInfo[key].sales * 100) / 100;
                    artInfo[key].sum = Math.round(artInfo[key].sum);
                    artInfo[key].views = Math.round(artInfo[key].views);
                    artInfo[key].clicks = Math.round(artInfo[key].clicks);

                    artInfo[key].drr = getRoundValue(
                        artInfo[key].sum,
                        artInfo[key].sum_orders,
                        true,
                        1,
                    );
                    artInfo[key].ctr = getRoundValue(artInfo[key].clicks, artInfo[key].views, true);
                    artInfo[key].cpc = getRoundValue(artInfo[key].sum, artInfo[key].clicks);
                    artInfo[key].cpm = getRoundValue(artInfo[key].sum * 1000, artInfo[key].views);
                    artInfo[key].cr = getRoundValue(artInfo[key].orders, artInfo[key].views, true);
                    artInfo[key].cpo = getRoundValue(
                        artInfo[key].sum,
                        artInfo[key].orders,
                        false,
                        artInfo[key].sum,
                    );

                    summaryTemp.sum_orders += artInfo[key].sum_orders;
                    summaryTemp.sum_sales += artInfo[key].sum_sales;
                    summaryTemp.sum += artInfo[key].sum;
                    summaryTemp.views += artInfo[key].views;
                    summaryTemp.clicks += artInfo[key].clicks;
                }
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

        filterTableData({}, temp);
    };

    const filterTableData = (withfFilters = {}, tableData = {}) => {
        const temp = [] as any;

        for (const [art, artInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!art || !artInfo) continue;

            for (const [key, keyRus] of Object.entries({
                search: 'Поиск',
                booster: 'Бустер',
                carousel: 'Карточка',
            })) {
                const tempTypeRow = {
                    advertsType: key,
                    art: artInfo['art'],
                    brand: artInfo['brand'],
                    object: artInfo['object'],
                    nmId: artInfo['nmId'],
                    title: artInfo['title'],
                    adverts: artInfo['adverts']
                        ? artInfo['adverts'][key]
                            ? artInfo['adverts'][key][Object.keys(artInfo['adverts'][key])[0]]
                            : undefined
                        : undefined,
                    stocks: artInfo['stocks'],
                    semantics: artInfo[key]['semantics'],
                    plusPhrasesTemplate: artInfo['plusPhrasesTemplate'],
                    budget: artInfo[key].budget,
                    bid: artInfo[key].bid,
                    bidLog: artInfo[key].bidLog,
                    budgetToKeep: artInfo[key].budgetToKeep,
                    orders: artInfo[key].orders,
                    sum_orders: artInfo[key].sum_orders,
                    sum: artInfo[key].sum,
                    views: artInfo[key].views,
                    clicks: artInfo[key].clicks,
                    drr: artInfo[key].drr,
                    ctr: artInfo[key].ctr,
                    cpc: artInfo[key].cpc,
                    cpm: artInfo[key].cpm,
                    cr: artInfo[key].cr,
                    cpo: artInfo[key].cpo,
                    drrAI: artInfo['drrAI'],
                    advertsManagerRules: artInfo['advertsManagerRules'],
                    advertsStocksThreshold: artInfo['advertsStocksThreshold'],
                    placements: artInfo['placements'] == -1 ? 10 * 1000 : artInfo['placements'],
                    placementsValue: artInfo['placementsValue'],
                };

                let addFlag = true;
                const useFilters = withfFilters['undef'] ? withfFilters : filters;
                for (const [filterArg, filterData] of Object.entries(useFilters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;
                    if (filterArg == 'adverts') {
                        if (!compare(keyRus, filterData)) {
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
        }

        temp.sort((a, b) => {
            return a.art.localeCompare(b.art, 'ru-RU');
        });
        const paginatedDataTemp = temp.slice(0, 600);
        const filteredSummaryTemp = {
            art: `На странице: ${paginatedDataTemp.length / 3} Всего: ${temp.length / 3}`,
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
            adverts: null,
            semantics: null,
            budget: 0,
            budgetToKeep: 0,
        };
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            // const art = row['art'];
            filteredSummaryTemp.sum_orders += row['sum_orders'];
            filteredSummaryTemp.orders += row['orders'];
            filteredSummaryTemp.stocks += row['stocks'];
            filteredSummaryTemp.sum += row['sum'];
            filteredSummaryTemp.views += row['views'];
            filteredSummaryTemp.clicks += row['clicks'];
            filteredSummaryTemp.budget += row['budget'] ?? 0;
            filteredSummaryTemp.budgetToKeep += row['budgetToKeep'] ?? 0;
        }
        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        filteredSummaryTemp.stocks = Math.round(filteredSummaryTemp.stocks / 3);
        filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
        filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
        filteredSummaryTemp.budgetToKeep = Math.round(filteredSummaryTemp.budgetToKeep);

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

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);
    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = React.useState(false);
    const [selectedValueMethodOptions] = React.useState<SelectOption<any>[]>([
        {
            value: 'Под Позицию',
            content: 'Под Позицию',
        },
        {
            value: 'По ДРР',
            content: 'По ДРР',
        },
    ]);
    const [selectedValueMethod, setSelectedValueMethod] = React.useState<string[]>(['Под Позицию']);

    const [firstRecalc, setFirstRecalc] = useState(false);

    // useEffect(() => {
    //     scheduleJob('*/2 * * * *', async () => {
    //         console.log('hola');
    //         if (!firstRecalc) return;
    //         await callApi('getMassAdvertsNew', {
    //             uid: [
    //                 'f9192af1-d9fa-4e3c-8959-33b668413e8c',
    //                 '4a1f2828-9a1e-4bbf-8e07-208ba676a806',
    //                 '46431a09-85c3-4703-8246-d1b5c9e52594',
    //             ].includes(Userfront.user.userUuid ?? '')
    //                 ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
    //                 : '',
    //             dateRange: {from: '2023', to: '2024'},
    //             campaignName:
    //                 selectValue[0] ??
    //                 Userfront.user.userUuid == 'f9192af1-d9fa-4e3c-8959-33b668413e8c'
    //                     ? 'Клининг Сервис'
    //                     : Userfront.user.userUuid == '46431a09-85c3-4703-8246-d1b5c9e52594'
    //                     ? 'ИП Иосифов М.С.'
    //                     : 'ИП Валерий',
    //         })
    //             .then((response) => {
    //                 setChangedDoc(response ? response['data'] : undefined);
    //                 // console.log(response ? response['data'] : undefined);
    //             })
    //             .catch((error) => console.error(error));
    //     });
    // }, []);

    const [changedColumns, setChangedColumns] = useState<any>(false);
    const columns = generateColumns(columnData);

    if (changedDoc) {
        setChangedDoc(undefined);
        recalc(dateRange);
    }

    if (changedColumns) {
        setChangedColumns(false);
    }

    if (!doc) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(doc['campaigns'])) {
            if (Userfront.user.userUuid == '1c5a0344-31ea-469e-945e-1dfc4b964ecd') {
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
            } else if (Userfront.user.userUuid == 'f9192af1-d9fa-4e3c-8959-33b668413e8c') {
                if (
                    ['Клининг Сервис', 'Торговый Дом', 'ТПК', 'Гуд Ритейл'].includes(campaignName)
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
            } else if (Userfront.user.userUuid == '9af0639b-4f32-48af-b81a-171580f7b144') {
                if (['ИП Коноплёв К.В.'].includes(campaignName)) {
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

    const artColumnElements = document.getElementsByClassName('td_fixed_art');
    if (artColumnElements[0]) {
        myObserver.observe(artColumnElements[artColumnElements.length > 1 ? 1 : 0]);
    }

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
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="action"
                        size="l"
                        onClick={() => {
                            setModalFormOpen(true);
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
                            setSelectedButton('');
                        }}
                    >
                        <Icon data={SlidersVertical} />

                        <Text variant="subheader-1">Управление</Text>
                    </Button>
                    <Modal
                        open={modalFormOpen}
                        onClose={() => {
                            // setAdvertTypeSwitchValue('Авто');
                            // setBudgetInputValue(500);
                            // setBudgetInputValidationValue(true);
                            // setBidInputValue(125);
                            // setBidInputValidationValue(true);
                            setModalFormOpen(false);
                            // setPlacementsBoosterInputValue(true);
                            // setPlacementsRecomInputValue(false);
                            // setPlacementsCarouselInputValue(false);
                        }}
                    >
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
                                    Управление
                                </Text>
                                <div
                                    style={{
                                        height: '50%',

                                        display: 'flex',
                                        flexDirection: 'column',

                                        margin: '16px 0',
                                    }}
                                >
                                    <Switch
                                        size="l"
                                        style={{display: 'flex', alignItems: 'top'}}
                                        onUpdate={(checked) => {
                                            setAdvertsTypesInput({
                                                search: checked,
                                                booster: advertsTypesInput.booster,
                                                carousel: advertsTypesInput.carousel,
                                            });
                                        }}
                                    >
                                        Поиск
                                    </Switch>
                                    <div style={{height: 8}} />
                                    <Switch
                                        size="l"
                                        style={{display: 'flex', alignItems: 'top'}}
                                        onUpdate={(checked) => {
                                            setAdvertsTypesInput({
                                                search: advertsTypesInput.search,
                                                booster: checked,
                                                carousel: advertsTypesInput.carousel,
                                            });
                                        }}
                                    >
                                        Бустер
                                    </Switch>
                                    <div style={{height: 8}} />

                                    <Switch
                                        size="l"
                                        style={{display: 'flex', alignItems: 'top'}}
                                        onUpdate={(checked) => {
                                            setAdvertsTypesInput({
                                                search: advertsTypesInput.search,
                                                booster: advertsTypesInput.booster,
                                                carousel: checked,
                                            });
                                        }}
                                    >
                                        Карточка
                                    </Switch>
                                </div>
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Установить',
                                        icon: CloudArrowUpIn,
                                        view: 'outlined-success',
                                        onClick: () => {
                                            const params = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {arts: {}},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;
                                                params.data.arts[art] = {};

                                                for (const [advertsType, value] of Object.entries(
                                                    advertsTypesInput,
                                                )) {
                                                    if (!advertsType) continue;
                                                    params.data.arts[art][advertsType] = value;
                                                    if (
                                                        !doc.campaigns[selectValue[0]][art]
                                                            .advertsManagerRules
                                                    )
                                                        doc.campaigns[selectValue[0]][
                                                            art
                                                        ].advertsManagerRules = {};
                                                    if (
                                                        !doc.campaigns[selectValue[0]][art]
                                                            .advertsManagerRules[advertsType]
                                                    )
                                                        doc.campaigns[selectValue[0]][
                                                            art
                                                        ].advertsManagerRules[advertsType] = {
                                                            mode: false,
                                                        };
                                                    doc.campaigns[selectValue[0]][
                                                        art
                                                    ].advertsManagerRules[advertsType].mode = value;
                                                }
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            // console.log(doc);

                                            callApi('updateAdvertsManagerRules', params);
                                            setChangedDoc(doc);
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
                        onClick={() => {
                            setSelectedButton('');
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
                            setBudgetModalBudgetInputValue(500);
                            setBudgetModalSwitchValue('Пополнить');
                            setBudgetModalBudgetInputValidationValue(true);
                            setBudgetModalFormOpen(true);
                        }}
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
                                        setBudgetModalBudgetInputValue(500);
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
                                        else if (budget < 500) {
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
                                {generateModalAdvertsTypesInput(setAdvertsTypesInput)}
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
                                                data: {arts: {}, advertsTypes: advertsTypesInput},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;

                                                params.data.arts[art] = {
                                                    mode: budgetModalSwitchValue,
                                                    budget: budgetModalBudgetInputValue,
                                                    art: art,
                                                };

                                                if (budgetModalSwitchValue == 'Установить лимит') {
                                                    for (const [
                                                        advertsType,
                                                        value,
                                                    ] of Object.entries(advertsTypesInput)) {
                                                        if (!advertsType || !value) continue;
                                                        if (
                                                            !doc.campaigns[selectValue[0]][art]
                                                                .budgetToKeep
                                                        )
                                                            doc.campaigns[selectValue[0]][
                                                                art
                                                            ].budgetToKeep = {};
                                                        doc.campaigns[selectValue[0]][
                                                            art
                                                        ].budgetToKeep[advertsType] =
                                                            budgetModalBudgetInputValue;
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
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="action"
                        size="l"
                        onClick={() => {
                            setSelectedButton('');
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
                            setBidModalBidInputValue(125);
                            setBidModalSwitchValue('Установить');
                            // setBidModalAnalyticsSwitchValue(14);
                            setBidModalBidInputValidationValue(true);
                            setBidModalDeleteModeSelected(false);
                            setBidModalFormOpen(true);
                            setBidModalBidStepInputValue(5);
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
                        }}
                    >
                        <Icon data={ChartLine} />
                        <Text variant="subheader-1">Ставки</Text>
                    </Button>
                    <Modal open={bidModalFormOpen} onClose={() => setBidModalFormOpen(false)}>
                        <div>
                            <Card
                                // view="raised"
                                view="clear"
                                style={{
                                    width: 350,
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
                                                                        {selectedValueMethod[0]}
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
                                                            {'Целевой ДРР'}
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
                                                                selectedValueMethod[0] !=
                                                                'Под Позицию'
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
                                                        arts: {},
                                                        mode: bidModalDeleteModeSelected
                                                            ? 'Удалить правила'
                                                            : bidModalSwitchValue,
                                                        stocksThreshold:
                                                            bidModalStocksThresholdInputValue,
                                                        placementsRange: bidModalRange,
                                                        maxBid: bidModalMaxBid,
                                                    },
                                                };
                                                for (let i = 0; i < filteredData.length; i++) {
                                                    const art = filteredData[i].art;
                                                    if (!art) continue;
                                                    if (!doc.campaigns[selectValue[0]][art]) {
                                                        console.log(
                                                            art,
                                                            doc,
                                                            doc.campaigns,
                                                            doc.campaigns[selectValue[0]],
                                                            selectValue[0],
                                                        );

                                                        continue;
                                                    }
                                                    if (bidModalSwitchValue == 'Установить') {
                                                        params.data.arts[art] = {
                                                            bid: bidModalBidInputValue,
                                                            art: art,
                                                        };
                                                    } else if (
                                                        bidModalSwitchValue == 'Автоставки'
                                                    ) {
                                                        if (!bidModalDeleteModeSelected) {
                                                            params.data.arts[art] = {
                                                                desiredDRR: bidModalDRRInputValue,
                                                                bidStep: bidModalBidStepInputValue,

                                                                // dateRange:
                                                                //     bidModalAnalyticsSwitchValue,

                                                                advertId: art,
                                                            };
                                                        } else {
                                                            params.data.arts[art] = {
                                                                art: art,
                                                            };
                                                        }

                                                        if (
                                                            !doc.campaigns[selectValue[0]][art]
                                                                .drrAI
                                                        )
                                                            doc.campaigns[selectValue[0]][
                                                                art
                                                            ].drrAI = {};
                                                        doc.campaigns[selectValue[0]][art].drrAI =
                                                            bidModalDeleteModeSelected
                                                                ? undefined
                                                                : {
                                                                      desiredDRR:
                                                                          bidModalDeleteModeSelected
                                                                              ? undefined
                                                                              : bidModalDRRInputValue,
                                                                      placementsRange:
                                                                          bidModalRange,
                                                                      maxBid: bidModalMaxBid,
                                                                  };
                                                        if (
                                                            !doc.campaigns[selectValue[0]][art]
                                                                .advertsStocksThreshold
                                                        )
                                                            doc.campaigns[selectValue[0]][
                                                                art
                                                            ].advertsStocksThreshold = {};
                                                        doc.campaigns[selectValue[0]][
                                                            art
                                                        ].advertsStocksThreshold.stocksThreshold =
                                                            bidModalDeleteModeSelected
                                                                ? undefined
                                                                : bidModalStocksThresholdInputValue;
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
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
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
                    <Modal
                        open={semanticsModalFormOpen}
                        onClose={() => setSemanticsModalFormOpen(false)}
                    >
                        <motion.div
                            layout
                            animate={{height: semanticsModalFormOpen ? '80vh' : 0}}
                            transition={{ease: 'easeInOut', duration: 0.2}}
                            style={{
                                // height: '60vh',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: isDesktop ? 'row' : 'column',
                                width: isDesktop ? '80vw' : '70vw',
                                padding: 32,
                                overflow: 'auto',
                            }}
                        >
                            <motion.div
                                layout
                                // animate={{x: semanticsModalFormOpen ? 0 : -1000}}
                                // transition={{delay: 2, type: 'spring'}}
                                style={{
                                    display: 'flex',
                                    height: !isDesktop ? '23vh' : undefined,
                                    width: isDesktop ? '25vw' : undefined,
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: 8,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text variant="header-1">Кластеры в показах</Text>
                                    <Button
                                        onClick={() => {
                                            const val = Array.from(
                                                semanticsModalSemanticsPlusItemsValue,
                                            );
                                            for (
                                                let i = 0;
                                                i <
                                                semanticsModalSemanticsItemsFiltratedValue.length;
                                                i++
                                            ) {
                                                const cluster =
                                                    semanticsModalSemanticsItemsFiltratedValue[i]
                                                        .cluster;
                                                if (val.includes(cluster)) continue;
                                                val.push(cluster);
                                                // console.log(keyword);
                                            }
                                            // console.log(val);

                                            setSemanticsModalSemanticsPlusItemsValue(val);
                                        }}
                                    >
                                        Добавить все
                                    </Button>
                                </div>
                                {generateFilterTextInputsForClusterStats({
                                    filters: clustersFiltersActive,
                                    setFilters: setClustersFiltersActive,
                                    filterData: clustersFilterDataActive,
                                    sortBy: clustersSortByActive,
                                    setSortBy: setClustersSortByActive,
                                    sortData: clustersSortDataActive,
                                })}
                                <List
                                    filterable={false}
                                    // filterPlaceholder={`Поиск в ${semanticsModalSemanticsItemsValue.length} фразах`}
                                    items={semanticsModalSemanticsItemsValue}
                                    // onFilterEnd={({items}) => {
                                    //     setSemanticsModalSemanticsItemsFiltratedValue(items);
                                    //     // console.log(
                                    //     //     semanticsModalSemanticsItemsFiltratedValue.length,
                                    //     // );
                                    // }}
                                    // filterItem={(filter) => (item) => {
                                    //     return item.cluster.includes(filter);
                                    // }}
                                    itemHeight={(item) => {
                                        return 20 * Math.ceil(item.cluster.length / 30) + 20;
                                    }}
                                    renderItem={(item) =>
                                        renderPhrasesStatListItem(
                                            item,
                                            semanticsModalSemanticsPlusItemsValue,
                                            setFetchedPlacements,
                                        )
                                    }
                                    onItemClick={(item) => {
                                        let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                        const {cluster} = item;
                                        if (!val.includes(cluster)) {
                                            val.push(cluster);
                                        } else {
                                            val = val.filter((value) => value != cluster);
                                        }
                                        setSemanticsModalSemanticsPlusItemsValue(val);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                layout
                                // animate={{x: semanticsModalFormOpen ? 0 : -1000}}
                                // transition={{delay: 2, type: 'spring'}}
                                style={{
                                    display: 'flex',
                                    height: !isDesktop ? '23vh' : undefined,
                                    width: isDesktop ? '25vw' : undefined,
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: 8,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text variant="header-1">Исключенные кластеры</Text>
                                    <Button
                                        onClick={() => {
                                            const val = Array.from(
                                                semanticsModalSemanticsPlusItemsValue,
                                            );
                                            for (
                                                let i = 0;
                                                i <
                                                semanticsModalSemanticsMinusItemsFiltratedValue.length;
                                                i++
                                            ) {
                                                const cluster =
                                                    semanticsModalSemanticsMinusItemsFiltratedValue[
                                                        i
                                                    ].cluster;
                                                if (val.includes(cluster)) continue;
                                                val.push(cluster);
                                                // console.log(keyword);
                                            }
                                            // console.log(val);

                                            setSemanticsModalSemanticsPlusItemsValue(val);
                                        }}
                                    >
                                        Добавить все
                                    </Button>
                                </div>
                                {generateFilterTextInputsForClusterStats({
                                    filters: clustersFiltersMinus,
                                    setFilters: setClustersFiltersMinus,
                                    filterData: clustersFilterDataMinus,
                                    sortBy: clustersSortByMinus,
                                    setSortBy: setClustersSortByMinus,
                                    sortData: clustersSortDataMinus,
                                })}
                                <List
                                    filterable={false}
                                    // onFilterEnd={({items}) => {
                                    //     setSemanticsModalSemanticsMinusItemsFiltratedValue(items);
                                    // }}
                                    // filterItem={(filter) => (item) => {
                                    //     return item.cluster.includes(filter);
                                    // }}
                                    items={semanticsModalSemanticsMinusItemsValue}
                                    // filterPlaceholder={`Поиск в ${semanticsModalSemanticsMinusItemsValue.length} фразах`}
                                    itemHeight={(item) => {
                                        return 20 * Math.ceil(item.cluster.length / 30) + 20;
                                    }}
                                    renderItem={(item) =>
                                        renderPhrasesStatListItem(
                                            item,
                                            semanticsModalSemanticsPlusItemsValue,
                                            setFetchedPlacements,
                                        )
                                    }
                                    onItemClick={(item) => {
                                        let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                        const {cluster} = item;
                                        if (!val.includes(cluster)) {
                                            val.push(cluster);
                                        } else {
                                            val = val.filter((value) => value != cluster);
                                        }
                                        setSemanticsModalSemanticsPlusItemsValue(val);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                layout
                                // animate={{x: semanticsModalFormOpen ? 0 : -1000}}
                                // transition={{delay: 2, type: 'spring'}}
                                style={{
                                    display: 'flex',
                                    height: !isDesktop ? '23vh' : '100%',
                                    width: isDesktop ? '25vw' : undefined,
                                    flexDirection: 'column',
                                    // justifyContent: 'space-',
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* <Text variant="header-1">Плюс фразы</Text> */}
                                    <Button
                                        width="max"
                                        size="m"
                                        view={
                                            semanticsModalSemanticsPlusItemsTemplateNameValue ==
                                            'Не установлен'
                                                ? 'normal'
                                                : 'flat-info'
                                        }
                                        selected={
                                            semanticsModalSemanticsPlusItemsTemplateNameValue !=
                                            'Не установлен'
                                        }
                                    >
                                        {semanticsModalSemanticsPlusItemsTemplateNameValue}
                                    </Button>
                                </div>
                                <div
                                    style={{
                                        marginBottom: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button
                                        width="max"
                                        selected={semanticsModalIsFixed}
                                        onClick={() =>
                                            setSemanticsModalIsFixed(!semanticsModalIsFixed)
                                        }
                                    >
                                        {`Фикс. ${!semanticsModalIsFixed ? 'выкл.' : 'вкл.'}`}
                                    </Button>
                                    <div style={{width: 16}} />
                                    <Button
                                        width="max"
                                        view={
                                            semanticsAutoPhrasesModalIncludesList.length ||
                                            semanticsAutoPhrasesModalNotIncludesListInput.length
                                                ? 'flat-success'
                                                : 'normal'
                                        }
                                        selected={
                                            semanticsAutoPhrasesModalIncludesList.length ||
                                            semanticsAutoPhrasesModalNotIncludesListInput.length
                                                ? true
                                                : undefined
                                        }
                                        onClick={() => {
                                            setSemanticsAutoPhrasesModalFormOpen(
                                                !semanticsAutoPhrasesModalFormOpen,
                                            );

                                            // setSemanticsModalTextAreaAddMode(
                                            //     !semanticsModalTextAreaAddMode,
                                            // );
                                            // const rows = semanticsModalTextAreaValue.split('\n');
                                            // const val = Array.from(
                                            //     semanticsModalSemanticsPlusItemsValue,
                                            // );
                                            // for (let i = 0; i < rows.length; i++) {
                                            //     const cluster = rows[i].trim();
                                            //     if (!cluster || cluster === '') continue;
                                            //     if (!val.includes(cluster)) {
                                            //         val.push(cluster);
                                            //     }
                                            // }
                                            // setSemanticsModalSemanticsPlusItemsValue(val);
                                            // setSemanticsModalTextAreaValue('');
                                        }}
                                    >
                                        {`Автофразы`}
                                    </Button>
                                </div>
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
                                            width: '70vw',
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
                                                            20 * Math.ceil(item.length / 60) + 20
                                                        );
                                                    }}
                                                    renderItem={(item) => {
                                                        if (!item) return;
                                                        return (
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
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
                                                                        flexDirection: 'row',
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
                                                        val = val.filter((value) => value != rule);
                                                        setSemanticsAutoPhrasesModalIncludesList(
                                                            val,
                                                        );
                                                    }}
                                                    items={semanticsAutoPhrasesModalIncludesList}
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
                                                        val = val.filter((value) => value != rule);
                                                        setSemanticsAutoPhrasesModalNotIncludesList(
                                                            val,
                                                        );
                                                    }}
                                                    items={semanticsAutoPhrasesModalNotIncludesList}
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
                                <div
                                    style={{
                                        marginBottom: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <TextInput
                                        style={{marginRight: 4}}
                                        label="Показы"
                                        hasClear
                                        value={String(semanticsModalSemanticsThresholdValue)}
                                        onUpdate={(val) => {
                                            setSemanticsModalSemanticsThresholdValue(Number(val));
                                        }}
                                        type="number"
                                    />
                                    <TextInput
                                        style={{marginLeft: 4}}
                                        label="CTR"
                                        hasClear
                                        value={String(semanticsModalSemanticsCTRThresholdValue)}
                                        onUpdate={(val) => {
                                            setSemanticsModalSemanticsCTRThresholdValue(
                                                Number(val),
                                            );
                                        }}
                                        type="number"
                                    />
                                </div>
                                <div
                                    style={{
                                        marginBottom: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <TextInput
                                        style={{marginRight: 8}}
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
                                                    clusters: semanticsModalSemanticsPlusItemsValue,
                                                    threshold:
                                                        semanticsModalSemanticsThresholdValue,
                                                    ctrThreshold:
                                                        semanticsModalSemanticsCTRThresholdValue,
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
                                                threshold: semanticsModalSemanticsThresholdValue,
                                                ctrThreshold:
                                                    semanticsModalSemanticsCTRThresholdValue,
                                                autoPhrasesTemplate: {
                                                    includes: semanticsAutoPhrasesModalIncludesList,
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
                                                    const art = semanticsModalOpenFromArt;
                                                    console.log(art);

                                                    const paramsAddToArt = {
                                                        uid: getUid(),
                                                        campaignName: selectValue[0],
                                                        data: {arts: {}},
                                                    };
                                                    paramsAddToArt.data.arts[art] = {
                                                        mode: 'Установить',
                                                        templateName: name,
                                                        art: art,
                                                    };

                                                    console.log(
                                                        paramsAddToArt,
                                                        doc.campaigns[selectValue[0]][art],
                                                    );

                                                    if (
                                                        !doc.campaigns[selectValue[0]][art]
                                                            .plusPhrasesTemplate
                                                    )
                                                        doc.campaigns[selectValue[0]][
                                                            art
                                                        ].plusPhrasesTemplate = {};
                                                    doc.campaigns[selectValue[0]][
                                                        art
                                                    ].plusPhrasesTemplate = name;
                                                    callApi(
                                                        'setAdvertsPlusPhrasesTemplates',
                                                        paramsAddToArt,
                                                    );
                                                }
                                            }

                                            console.log(params);

                                            setChangedDoc(doc);

                                            callApi('setPlusPhraseTemplate', params);

                                            setSemanticsModalFormOpen(false);
                                        }}
                                    >
                                        Сохранить
                                    </Button>
                                </div>
                                {/* semanticsModalTextAreaAddMode ? (
                                    // <TextArea
                                    //     onUpdate={(val) => {
                                    //         setSemanticsModalTextAreaValue(val);
                                    //     }}
                                    //     hasClear
                                    //     placeholder="Вводите фразы для добавления с новой строки"
                                    //     maxRows={Math.round(
                                    //         (windowDimensions.height * 0.4) / 16 + 10,
                                    //     )}
                                    // />
                                ) : ( */}
                                <List
                                    itemHeight={(item) => {
                                        return 20 * Math.ceil(item.length / 45) + 20;
                                    }}
                                    items={semanticsModalSemanticsPlusItemsValue}
                                    filterPlaceholder={`Поиск в ${semanticsModalSemanticsPlusItemsValue.length} фразах`}
                                    onItemClick={(cluster) => {
                                        let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                        val = val.filter((value) => value != cluster);
                                        setSemanticsModalSemanticsPlusItemsValue(val);
                                    }}
                                    renderItem={(item) => {
                                        if (!item) return;
                                        return (
                                            <div
                                                style={{
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                }}
                                                title={item}
                                            >
                                                <Text>{item}</Text>
                                            </div>
                                        );
                                    }}
                                />
                            </motion.div>
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
                                                data: {arts: {}},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;

                                                params.data.arts[art] = {
                                                    mode: 'Установить',
                                                    templateName: item,
                                                    art: art,
                                                };

                                                if (
                                                    !doc.campaigns[selectValue[0]][art]
                                                        .plusPhrasesTemplate
                                                )
                                                    doc.campaigns[selectValue[0]][
                                                        art
                                                    ].plusPhrasesTemplate = {};
                                                doc.campaigns[selectValue[0]][
                                                    art
                                                ].plusPhrasesTemplate = item;
                                            }
                                            console.log(params);

                                            /////////////////////////
                                            callApi('setAdvertsPlusPhrasesTemplates', params);
                                            setChangedDoc(doc);
                                            /////////////////////////
                                            setPlusPhrasesModalFormOpen(false);
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
                                                data: {arts: {}},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;

                                                params.data.arts[art] = {
                                                    mode: 'Удалить',
                                                    art: art,
                                                };

                                                if (
                                                    !doc.campaigns[selectValue[0]][art]
                                                        .plusPhrasesTemplate
                                                )
                                                    doc.campaigns[selectValue[0]][
                                                        art
                                                    ].plusPhrasesTemplate = {};
                                                doc.campaigns[selectValue[0]][
                                                    art
                                                ].plusPhrasesTemplate = undefined;
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
                                        setChangedDoc(doc);
                                        setSelectValue(nextValue);
                                        // recalc(dateRange, nextValue[0]);
                                        setSwitchingCampaignsFlag(false);
                                        console.log(doc);
                                    });
                                } else {
                                    setSelectValue(nextValue);
                                    setSwitchingCampaignsFlag(false);
                                    recalc(dateRange, nextValue[0]);
                                }
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
                        <Button view="outlined-success" size="l">
                            <Text variant="subheader-1">
                                {`Баланс: ${new Intl.NumberFormat('ru-RU').format(
                                    doc
                                        ? doc.balances
                                            ? doc.balances[selectValue[0]]
                                                ? doc.balances[selectValue[0]].net ?? 0
                                                : 0
                                            : 0
                                        : 0,
                                )}
                            Бонусы: ${new Intl.NumberFormat('ru-RU').format(
                                doc
                                    ? doc.balances
                                        ? doc.balances[selectValue[0]]
                                            ? doc.balances[selectValue[0]].bonus ?? 0
                                            : 0
                                        : 0
                                    : 0,
                            )} 
                            Счет: ${new Intl.NumberFormat('ru-RU').format(
                                doc
                                    ? doc.balances
                                        ? doc.balances[selectValue[0]]
                                            ? doc.balances[selectValue[0]].balance ?? 0
                                            : 0
                                        : 0
                                    : 0,
                            )}`}
                            </Text>
                        </Button>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginBottom: 8}}>
                    <Button
                        size="l"
                        view="action"
                        onClick={() => {
                            setFilters(() => {
                                const newFilters = {undef: true};
                                filterTableData(newFilters);
                                return newFilters;
                            });
                        }}
                    >
                        <Icon data={TrashBin} />
                        <Text variant="subheader-1">Очистить фильтры</Text>
                    </Button>
                    <div style={{width: 8}} />
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
                    <DataTable
                        startIndex={1}
                        settings={{
                            stickyHead: MOVING,
                            stickyFooter: MOVING,
                            displayIndices: false,
                            highlightRows: true,
                        }}
                        theme="yandex-cloud"
                        onRowClick={(row, index, event) => {
                            console.log(row, index, event);
                        }}
                        rowClassName={(_row, index, isFooterData) =>
                            isFooterData ? b('tableRow_footer') : b('tableRow_' + index)
                        }
                        // defaultSortState={sort}
                        // sortState={sort}
                        onSort={(sortOrder) => {
                            if (!sortOrder) {
                                setGroupingEnabledState(true);
                                return;
                            }
                            if (sortOrder['length']) {
                                setGroupingEnabledState(false);
                            } else {
                                setGroupingEnabledState(true);
                            }
                        }}
                        // className={b('tableStats')}
                        data={paginatedData}
                        columns={columns}
                        footerData={[filteredSummary]}
                    />
                </div>
                <div style={{height: 8}} />
                <Pagination
                    showInput
                    total={pagesTotal}
                    page={pagesCurrent}
                    pageSize={600}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 600, page * 600);
                        setFilteredSummary((row) => {
                            const temp = row;
                            temp.art = `На странице: ${paginatedDataTemp.length / 3} Всего: ${
                                filteredData.length / 3
                            }`;

                            return temp;
                        });
                        setPaginatedData(paginatedDataTemp);
                    }}
                />
            </div>
        </div>
    );
};

const generateModalButtonWithActions = (
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

const generateModalAdvertsTypesInput = (setAdvertsTypesInput) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Text style={{marginLeft: 8}} variant="subheader-1">
                Типы кампаний
            </Text>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Checkbox
                    onUpdate={(checked) =>
                        setAdvertsTypesInput((val) => {
                            val['search'] = checked;
                            return val;
                        })
                    }
                >
                    Поиск
                </Checkbox>
                <div style={{width: 8}}></div>
                <Checkbox
                    onUpdate={(checked) =>
                        setAdvertsTypesInput((val) => {
                            val['booster'] = checked;
                            return val;
                        })
                    }
                >
                    Бустер
                </Checkbox>
                <div style={{width: 8}}></div>
                <Checkbox
                    onUpdate={(checked) =>
                        setAdvertsTypesInput((val) => {
                            val['carousel'] = checked;
                            return val;
                        })
                    }
                >
                    Карточка
                </Checkbox>
            </div>
        </div>
    );
};

const renderPhrasesStatListItem = (
    item,
    semanticsModalSemanticsPlusItemsValue,
    setFetchedPlacements,
) => {
    const {cluster, count, sum, ctr, clicks, freq} = item;
    const cpc = sum / clicks;
    const colorToUse = semanticsModalSemanticsPlusItemsValue.includes(cluster)
        ? 'warning'
        : 'primary';
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
            }}
            title={cluster}
        >
            <div
                style={{
                    textWrap: 'wrap',
                }}
            >
                <Text color={colorToUse}>{cluster}</Text>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text color="secondary">{Math.round(sum ?? 0)}</Text>
                    <div style={{width: 3}} />
                    <Text
                        color="secondary"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ₽
                    </Text>
                </div>

                <div style={{width: 8}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text color="secondary">{Math.round(count ?? 0)}</Text>
                    <div style={{width: 3}} />
                    <Text
                        color="secondary"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon size={12} data={Eye} />
                    </Text>
                </div>
                <div style={{width: 8}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text color="secondary">{Math.round(clicks ?? 0)}</Text>
                    <div style={{width: 3}} />
                    <Text
                        color="secondary"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon size={12} data={LayoutHeaderCursor} />
                    </Text>
                </div>
                {!isFinite(cpc) || isNaN(cpc) ? (
                    <></>
                ) : (
                    <>
                        <div style={{width: 8}} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text color="secondary">{Math.round(cpc ?? 0)}</Text>
                            <div style={{width: 3}} />
                            <Text
                                color="secondary"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                ₽/ <Icon size={12} data={LayoutHeaderCursor} />
                            </Text>
                        </div>
                    </>
                )}
                <div style={{width: 8}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text color="secondary">{ctr ?? 0}</Text>
                    <div style={{width: 3}} />
                    <Text
                        color="secondary"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        %
                    </Text>
                </div>
                <div style={{width: 8}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text color="secondary">{freq ?? 0}</Text>
                    <div style={{width: 3}} />
                    <Text
                        color="secondary"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon size={12} data={Magnifier} />
                    </Text>
                </div>
                <div style={{width: 8}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* <Text color="secondary">{'Найти '}</Text> */}
                    {/* <div style={{width: 3}} /> */}
                    <Button
                        size="xs"
                        view="flat"
                        onClick={(event) => {
                            event.stopPropagation();
                            parseFirst10Pages(cluster, setFetchedPlacements);
                        }}
                    >
                        №
                        <Icon size={12} data={LayoutHeader} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const generateFilterTextInput = (args) => {
    const {
        pinned,
        filters,
        setFilters,
        filterData,
        name,
        placeholder,
        valueType,
        width,
        viewportSize,
    } = args;
    let minWidth = viewportSize ? viewportSize.width / 20 : 60;
    if (minWidth < 40) minWidth = 60;
    if (minWidth > 100) minWidth = 100;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: width ? (minWidth < width ? minWidth : width) : minWidth,

                maxWidth: '30vw',
            }}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <Text style={{marginLeft: 4}} variant="subheader-1">
                {placeholder}
            </Text>
            <TextInput
                hasClear
                disabled={pinned && pinned.isPinned}
                value={filters[name] ? filters[name].val : ''}
                onChange={(val) => {
                    setFilters(() => {
                        if (!(name in filters))
                            filters[name] = {
                                compMode: valueType != 'text' ? 'bigger' : 'include',
                                val: '',
                            };
                        filters[name].val = val.target.value;
                        filterData(filters);
                        return filters;
                    });
                }}
                // placeholder={'Фильтр'}
                rightContent={
                    <DropdownMenu
                        renderSwitcher={(props) => (
                            <Button
                                {...props}
                                disabled={pinned && pinned.isPinned}
                                view={
                                    filters[name]
                                        ? filters[name].val != ''
                                            ? !filters[name].compMode.includes('not')
                                                ? 'flat-success'
                                                : 'flat-danger'
                                            : 'flat'
                                        : 'flat'
                                }
                                size="xs"
                            >
                                <Icon data={Funnel} />
                            </Button>
                        )}
                        items={[
                            [
                                {
                                    iconStart: (
                                        <Icon
                                            data={
                                                filters[name]
                                                    ? filters[name].compMode == 'include'
                                                        ? CirclePlusFill
                                                        : CirclePlus
                                                    : CirclePlusFill
                                            }
                                        />
                                    ),
                                    action: () => {
                                        setFilters(() => {
                                            if (!(name in filters))
                                                filters[name] = {
                                                    compMode: 'include',
                                                    val: '',
                                                };
                                            filters[name].compMode = 'include';
                                            filterData(filters);
                                            return filters;
                                        });
                                    },
                                    text: 'Включает',
                                },
                                {
                                    iconStart: (
                                        <Icon
                                            data={
                                                filters[name]
                                                    ? filters[name].compMode == 'not include'
                                                        ? CircleMinusFill
                                                        : CircleMinus
                                                    : CircleMinus
                                            }
                                        />
                                    ),
                                    action: () => {
                                        setFilters(() => {
                                            if (!(name in filters))
                                                filters[name] = {
                                                    compMode: 'not include',
                                                    val: '',
                                                };
                                            filters[name].compMode = 'not include';
                                            filterData(filters);
                                            return filters;
                                        });
                                    },
                                    text: 'Не включает',
                                    theme: 'danger',
                                },
                            ],
                            [
                                {
                                    iconStart: (
                                        <Icon
                                            data={
                                                filters[name]
                                                    ? filters[name].compMode == 'equal'
                                                        ? CirclePlusFill
                                                        : CirclePlus
                                                    : CirclePlus
                                            }
                                        />
                                    ),
                                    action: () => {
                                        setFilters(() => {
                                            if (!(name in filters))
                                                filters[name] = {
                                                    compMode: 'equal',
                                                    val: '',
                                                };
                                            filters[name].compMode = 'equal';
                                            filterData(filters);
                                            return filters;
                                        });
                                    },
                                    text: 'Равно',
                                },
                                {
                                    iconStart: (
                                        <Icon
                                            data={
                                                filters[name]
                                                    ? filters[name].compMode == 'not equal'
                                                        ? CircleMinusFill
                                                        : CircleMinus
                                                    : CircleMinus
                                            }
                                        />
                                    ),
                                    action: () => {
                                        setFilters(() => {
                                            if (!(name in filters))
                                                filters[name] = {
                                                    compMode: 'not equal',
                                                    val: '',
                                                };
                                            filters[name].compMode = 'not equal';
                                            filterData(filters);
                                            return filters;
                                        });
                                    },
                                    text: 'Не равно',
                                    theme: 'danger',
                                },
                            ],
                            valueType != 'text'
                                ? [
                                      {
                                          iconStart: (
                                              <Icon
                                                  data={
                                                      filters[name]
                                                          ? filters[name].compMode == 'bigger'
                                                              ? CirclePlusFill
                                                              : CirclePlus
                                                          : CirclePlus
                                                  }
                                              />
                                          ),
                                          action: () => {
                                              setFilters(() => {
                                                  if (!(name in filters))
                                                      filters[name] = {
                                                          compMode: 'bigger',
                                                          val: '',
                                                      };
                                                  filters[name].compMode = 'bigger';
                                                  filterData(filters);
                                                  return filters;
                                              });
                                          },
                                          text: 'Больше',
                                      },
                                      {
                                          iconStart: (
                                              <Icon
                                                  data={
                                                      filters[name]
                                                          ? filters[name].compMode == 'not bigger'
                                                              ? CircleMinusFill
                                                              : CircleMinus
                                                          : CircleMinus
                                                  }
                                              />
                                          ),
                                          action: () => {
                                              setFilters(() => {
                                                  if (!(name in filters))
                                                      filters[name] = {
                                                          compMode: 'not bigger',
                                                          val: '',
                                                      };
                                                  filters[name].compMode = 'not bigger';
                                                  filterData(filters);
                                                  return filters;
                                              });
                                          },
                                          text: 'Меньше',
                                          theme: 'danger',
                                      },
                                  ]
                                : [],
                        ]}
                    />
                }
            />
        </div>
    );
};

const generateFilterTextInputsForClusterStats = (args) => {
    const {filters, setFilters, filterData, sortBy, setSortBy, sortData} = args;
    const clusterStatsParams = {
        cluster: {
            name: 'cluster',
            placeholder: 'Кластер',
            filters,
            setFilters,
            filterData,
            valueType: 'text',
            sortBy,
            setSortBy,
            sortData,
        },
        sum: {
            name: 'sum',
            placeholder: 'Расход',
            filters,
            setFilters,
            filterData,
            valueType: 'number',
            sortBy,
            setSortBy,
            sortData,
        },
        count: {
            name: 'count',
            placeholder: 'Показов',
            filters,
            setFilters,
            filterData,
            valueType: 'number',
            sortBy,
            setSortBy,
            sortData,
        },
        cpc: {
            name: 'cpc',
            placeholder: 'CPC',
            filters,
            setFilters,
            filterData,
            valueType: 'number',
            sortBy,
            setSortBy,
            sortData,
        },
        ctr: {
            name: 'ctr',
            placeholder: 'CTR',
            filters,
            setFilters,
            filterData,
            valueType: 'number',
            sortBy,
            setSortBy,
            sortData,
        },
        clicks: {
            name: 'clicks',
            placeholder: 'Кликов',
            filters,
            setFilters,
            filterData,
            valueType: 'number',
            sortBy,
            setSortBy,
            sortData,
        },
        freq: {
            name: 'freq',
            placeholder: 'Частота',
            filters,
            setFilters,
            filterData,
            valueType: 'number',
            sortBy,
            setSortBy,
            sortData,
        },
    };
    const textInputsArray = [] as any[];
    for (const [name, data] of Object.entries(clusterStatsParams)) {
        if (!name || !data) continue;
        textInputsArray.push(generateFilterTextInput(data));
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {generateFilterTextInput(clusterStatsParams['cluster'])}
            <div style={{height: 8}} />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {generateFilterTextInput(clusterStatsParams['freq'])}
                <div style={{width: 24}} />
                {generateFilterTextInput(clusterStatsParams['count'])}
                <div style={{width: 24}} />
                {generateFilterTextInput(clusterStatsParams['ctr'])}
            </div>
            <div style={{height: 8}} />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {generateFilterTextInput(clusterStatsParams['sum'])}
                <div style={{width: 24}} />
                {generateFilterTextInput(clusterStatsParams['clicks'])}
                <div style={{width: 24}} />
                {generateFilterTextInput(clusterStatsParams['cpc'])}
            </div>
            <div style={{height: 8}} />
        </div>
    );
};

const compare = (a, filterData) => {
    const {val, compMode} = filterData;
    if (compMode == 'include') {
        return String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
    }
    if (compMode == 'not include') {
        return !String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
    }
    if (compMode == 'equal') {
        return String(a).toLocaleLowerCase() == String(val).toLocaleLowerCase();
    }
    if (compMode == 'not equal') {
        return String(a).toLocaleLowerCase() != String(val).toLocaleLowerCase();
    }
    if (compMode == 'bigger') {
        return Number(a) > Number(val);
    }
    if (compMode == 'not bigger') {
        return Number(a) < Number(val);
    }
    return false;
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

const parseFirst10Pages = async (searchPhrase, setFetchedPlacements) => {
    const allCardDataList = {updateTime: '', data: {}};

    const fetchedPlacements = {};

    let retryCount = 0;
    for (let page = 1; page <= 5; page++) {
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
                    const cur = data.data.products[i];
                    cur.index = i + 1 + (page - 1) * 100;
                    const {id} = cur;
                    myData[id] = cur;
                }

                Object.assign(allCardDataList.data, myData);

                console.log(`Data saved for search phrase: ${searchPhrase}, page: ${page}`);
                await new Promise((resolve) => setTimeout(resolve, 100));
            } else {
                page--;
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, 1000));
                if (retryCount % 10 == 0) {
                    console.log(searchPhrase, retryCount);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
                if (retryCount == 20) {
                    retryCount = 0;
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
        Object.keys(allCardDataList.data).length == 5 * 100
    ) {
        allCardDataList.updateTime = new Date().toISOString();

        fetchedPlacements[searchPhrase] = allCardDataList;

        console.log(`All data saved for search phrase: ${searchPhrase}`);
    }

    console.log(fetchedPlacements);
    setFetchedPlacements(fetchedPlacements);
};
