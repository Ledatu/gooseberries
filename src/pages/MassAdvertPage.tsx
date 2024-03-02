import React, {useEffect, useRef, useState} from 'react';
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
    TextArea,
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

import axios from 'axios';
import Userfront from '@userfront/toolkit';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
const b = block('app');

import {
    CircleMinusFill,
    CircleMinus,
    CirclePlusFill,
    CirclePlus,
    Funnel,
    // DiamondExclamation,
    // CloudCheck,
    Ban,
    Calendar,
    Eye,
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
settings.set({plugins: [YagrPlugin]});

const {ipAddress} = require('../ipAddress');

const getUserDoc = (doc = undefined) => {
    const [document, setDocument] = useState<any>();

    if (doc) {
        setDocument(doc);
    }

    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                `${ipAddress}/api/getMassAdvertsNew`,
                {
                    uid:
                        (Userfront.user.userUuid == '332fa5da-8450-451a-b859-a84ca9951a34' ||
                        Userfront.user.userUuid == '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                            ? '332fa5da-8450-451a-b859-a84ca9951a34'
                            : '') ?? '',
                    dateRange: {from: '2023', to: '2024'},
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            )
            .then((response) => setDocument(response.data))
            .catch((error) => console.error(error));
    }, []);
    return document;
};

export const MassAdvertPage = () => {
    const windowDimensions = useWindowDimensions();
    const isDesktop = windowDimensions.height < windowDimensions.width;

    const [changedDoc, setChangedDoc] = useState<any>(undefined);

    const [advertsTypesInput, setAdvertsTypesInput] = useState({
        search: false,
        booster: false,
        carousel: false,
    });

    const [filters, setFilters] = useState({undef: false});
    const [pinned, setPinned] = useState({isPinned: false, oldArtFilters: {}});
    // const [manageModalOpen, setManageModalOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');

    const [semanticsModalTextAreaAddMode, setSemanticsModalTextAreaAddMode] = useState(false);
    const [semanticsModalTextAreaValue, setSemanticsModalTextAreaValue] = useState('');

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

    const [semanticsModalFormOpen, setSemanticsModalFormOpen] = useState(false);
    const [semanticsModalSemanticsItemsValue, setSemanticsModalSemanticsItemsValue] = useState<
        any[]
    >([]);
    const [
        semanticsModalSemanticsItemsFiltratedValue,
        setSemanticsModalSemanticsItemsFiltratedValue,
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

    const semanticsModalAdvertTypes: any[] = [
        {value: 'АВТО', content: 'Авто'},
        {value: 'ПОИСК', content: 'Поиск'},
    ];
    const [semanticsModalAdvertType, setSemanticsModalAdvertType] = React.useState('АВТО');
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

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);

    const [bidModalFormOpen, setBidModalFormOpen] = useState(false);
    const [bidModalBidInputValue, setBidModalBidInputValue] = useState(125);
    const [bidModalBidInputValidationValue, setBidModalBidInputValidationValue] = useState(true);
    const [bidModalDeleteModeSelected, setBidModalDeleteModeSelected] = useState(false);
    const [bidModalBidStepInputValue, setBidModalBidStepInputValue] = useState(5);
    const [bidModalBidStepInputValidationValue, setBidModalBidStepInputValidationValue] =
        useState(true);
    const [bidModalStocksThresholdInputValue, setBidModalStocksThresholdInputValue] = useState(5);
    const [
        bidModalStocksThresholdInputValidationValue,
        setBidModalStocksThresholdInputValidationValue,
    ] = useState(true);
    const [bidModalDRRInputValue, setBidModalDRRInputValue] = useState(50);
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
            let minWidth = viewportSize.width / 20;
            if (minWidth < 40) minWidth = 60;
            if (minWidth > 100) minWidth = 100;
            columns.push({
                name: name,
                className: b(className ?? (i == 0 ? 'td_fixed' : 'td_body')),
                header: (
                    <div
                        title={placeholder}
                        style={{
                            minWidth: width ? (minWidth < width ? minWidth : width) : minWidth,
                            display: 'flex',
                            maxWidth: '30vw',
                            // marginLeft:
                            //     name == 'art' ? `${String(data.length).length * 6 + 32}px` : 0,
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <TextInput
                            hasClear
                            disabled={pinned.isPinned}
                            value={filters[name] ? filters[name].val : ''}
                            onChange={(val) => {
                                setFilters(() => {
                                    if (!(name in filters))
                                        filters[name] = {compMode: 'include', val: ''};
                                    filters[name].val = val.target.value;
                                    filterTableData(filters);
                                    return filters;
                                });
                            }}
                            placeholder={placeholder}
                            rightContent={
                                <DropdownMenu
                                    renderSwitcher={(props) => (
                                        <Button
                                            {...props}
                                            disabled={pinned.isPinned}
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
                                                                ? filters[name].compMode ==
                                                                  'include'
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
                                                        filterTableData(filters);
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
                                                                ? filters[name].compMode ==
                                                                  'not include'
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
                                                        filterTableData(filters);
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
                                                        filterTableData(filters);
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
                                                                ? filters[name].compMode ==
                                                                  'not equal'
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
                                                        filterTableData(filters);
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
                                                                      ? filters[name].compMode ==
                                                                        'bigger'
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
                                                              filterTableData(filters);
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
                                                                      ? filters[name].compMode ==
                                                                        'not bigger'
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
                                                              filterTableData(filters);
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
                ),
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
                                    {Math.floor((pagesCurrent - 1) * 300 + index / 3 + 1)}
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
        {name: 'brand', placeholder: 'Бренд', valueType: 'text', group: true},
        {name: 'object', placeholder: 'Предмет', valueType: 'text', group: true},
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
        {
            name: 'semantics',
            placeholder: 'Семантика',
            valueType: 'text',
            render: ({value, row}) => {
                if (value === null) return;
                // if (!row.adverts) return;
                // const themeToUse = 'normal';
                // console.log(value.plus);
                const plusPhrasesTemplate = row.plusPhrasesTemplate;
                const themeToUse = plusPhrasesTemplate ? 'info' : 'normal';

                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Label
                            // theme="normal"
                            // theme="info"
                            theme={themeToUse}
                            onClick={() => {
                                setSemanticsModalFormOpen(true);

                                setSemanticsModalSemanticsItemsValue(
                                    value ? value.clusters ?? [] : [],
                                );
                                setSemanticsModalSemanticsItemsFiltratedValue(
                                    value ? value.clusters ?? [] : [],
                                );
                                setSemanticsModalSemanticsMinusItemsValue(
                                    value ? value.excluded ?? [] : [],
                                );
                                setSemanticsModalSemanticsPlusItemsTemplateNameValue(
                                    plusPhrasesTemplate ?? 'Не установлен',
                                );

                                const plusThreshold = document.plusPhrasesTemplates[
                                    plusPhrasesTemplate
                                ]
                                    ? document.plusPhrasesTemplates[plusPhrasesTemplate].threshold
                                    : 100;
                                setSemanticsModalSemanticsThresholdValue(plusThreshold);

                                const plusCTRThreshold = document.plusPhrasesTemplates[
                                    plusPhrasesTemplate
                                ]
                                    ? document.plusPhrasesTemplates[plusPhrasesTemplate]
                                          .ctrThreshold
                                    : 5;
                                setSemanticsModalSemanticsCTRThresholdValue(plusCTRThreshold);

                                const isFixed = document.plusPhrasesTemplates[plusPhrasesTemplate]
                                    ? document.plusPhrasesTemplates[plusPhrasesTemplate].isFixed ??
                                      false
                                    : false;
                                setSemanticsModalIsFixed(isFixed);

                                const templateType = document.plusPhrasesTemplates[
                                    plusPhrasesTemplate
                                ]
                                    ? document.plusPhrasesTemplates[plusPhrasesTemplate].type ??
                                      'АВТО'
                                    : 'АВТО';
                                setSemanticsModalAdvertType(templateType);
                                // console.log(value.plus);
                                setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                    plusPhrasesTemplate ?? `Новый шаблон ${templateType}`,
                                );
                                const plusItems = document.plusPhrasesTemplates[plusPhrasesTemplate]
                                    ? document.plusPhrasesTemplates[plusPhrasesTemplate].clusters
                                    : [];
                                setSemanticsModalSemanticsPlusItemsValue(plusItems);
                                setSemanticsModalTextAreaValue('');
                                setSemanticsModalTextAreaAddMode(false);
                            }}
                        >
                            {themeToUse == 'info' ? plusPhrasesTemplate : 'Добавить'}
                        </Label>
                    </div>
                );
            },
        },
        {
            name: 'adverts',
            placeholder: 'Реклама',
            valueType: 'text',
            // render: ({value}) => {
            //     if (value === null) return;
            //     const tags: any[] = [];
            //     const generateHtml = () => {
            //         let string = `<div style={display: 'flex'}>`;
            //         if (value) {
            //             for (const [advertType, advertsOfType] of Object.entries(value)) {
            //                 if (!advertType || !advertsOfType) continue;

            //                 for (const [advertId, advertData] of Object.entries(advertsOfType)) {
            //                     if (!advertId || !advertData) continue;
            //                     const status = advertData['status'];
            //                     if (![4, 9, 11].includes(status)) continue;

            //                     string += `<div style="display: flex; flex-direction: row; justify-content: space-between; font-size: 8pt;">`;
            //                     string +=
            //                         `<div style="margin: 0 4px;">ID: ${advertId}</div>` +
            //                         `<div style="margin: 0 4px;">Тип: ${
            //                             paramMap.type[advertData['type']]
            //                         }</div>` +
            //                         `<div style="margin: 0 4px;">Обновлена: ${
            //                             // paramMap.status[advertData['status']]
            //                             advertData['updateTime']
            //                         }</div>`;
            //                     string += '</div>';
            //                 }
            //             }
            //         }
            //         string += '</div>';
            //         return string;
            //     };
            //     if (value !== undefined) {
            //         for (const [advertType, advertsOfType] of Object.entries(value)) {
            //             if (!advertType || !advertsOfType) continue;
            //             for (const [advertId, advertData] of Object.entries(advertsOfType)) {
            //                 if (!advertId || !advertData) continue;
            //                 const status = advertData['status'];
            //                 if (![4, 9, 11].includes(status)) continue;

            //                 const themeToUse =
            //                     status == 9 ? 'success' : status == 11 ? 'danger' : 'warning';

            //                 tags.push(
            //                     <div style={{display: 'flex', flexDirection: 'row'}}>
            //                         <div style={{margin: '0 2px'}}>
            //                             <Label
            //                                 icon={
            //                                     advertData['updateTime'] === 'Ошибка.' ? (
            //                                         <Icon
            //                                             data={
            //                                                 advertData['updateTime'] === 'Ошибка.'
            //                                                     ? DiamondExclamation
            //                                                     : CloudCheck
            //                                             }
            //                                         />
            //                                     ) : undefined
            //                                 }
            //                                 theme={themeToUse}
            //                             >
            //                                 {paramMap.type[advertType]}
            //                             </Label>
            //                         </div>
            //                         <div style={{margin: '0 2px'}}>
            //                             <Label theme={'clear'}>
            //                                 <div
            //                                     style={{
            //                                         display: 'flex',
            //                                         flexDirection: 'row',
            //                                         alignItems: 'center',
            //                                     }}
            //                                 >
            //                                     <Text>{advertData['daysInWork'] + 1}</Text>
            //                                     <div style={{width: 2}} />
            //                                     <Icon size={12} data={Calendar} />
            //                                 </div>
            //                             </Label>
            //                         </div>
            //                     </div>,
            //                 );
            //             }
            //         }
            //     }
            //     if (tags.length == 0) {
            //         return (
            //             <div style={{display: 'flex', justifyContent: 'center'}}>
            //                 <Label theme="unknown">Кампаний нет</Label>
            //             </div>
            //         );
            //     }
            //     return (
            //         <div style={{display: 'flex', justifyContent: 'center'}}>
            //             <Popover
            //                 behavior={'delayed' as PopoverBehavior}
            //                 disabled={value === undefined}
            //                 htmlContent={generateHtml()}
            //             >
            //                 <div style={{display: 'flex'}}>{tags}</div>
            //             </Popover>
            //         </div>
            //     );
            // },
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
                                checked={advertsManagerRulesMode}
                                // defaultChecked={advertsManagerRulesMode}
                                style={{display: 'flex', alignItems: 'top'}}
                                onUpdate={(checked) => {
                                    if (
                                        !document['campaigns'][selectValue[0]][art]
                                            .advertsManagerRules
                                    )
                                        document['campaigns'][selectValue[0]][
                                            art
                                        ].advertsManagerRules = {};

                                    if (
                                        !document['campaigns'][selectValue[0]][art]
                                            .advertsManagerRules[advertsType]
                                    )
                                        document['campaigns'][selectValue[0]][
                                            art
                                        ].advertsManagerRules[advertsType] = {mode: false};

                                    document['campaigns'][selectValue[0]][art].advertsManagerRules[
                                        advertsType
                                    ].mode = checked;
                                    setChangedDoc(document);

                                    const params = {
                                        uid:
                                            Userfront.user.userUuid ==
                                                '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                            Userfront.user.userUuid ==
                                                '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                : '',
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
                                              document['campaigns'][selectValue[0]][art]['adverts']
                                                  ? document['campaigns'][selectValue[0]][art][
                                                        'adverts'
                                                    ][advertsType]
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

        {name: 'budgetToKeep', placeholder: 'Бюджет, ₽'},
        {name: 'budget', placeholder: 'Баланс, ₽'},
        {
            name: 'bid',
            placeholder: 'Ставка, ₽',
            render: ({value, row}) => {
                if (!value) return;

                const cpm = value;
                if (!cpm) return;

                const bidLog = row.bidLog;

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
                            <Text>{cpm}</Text>
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
    // const [document, setUserDoc] = React.useState(getUserDoc());
    const document = getUserDoc(changedDoc);

    // const document = {};
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
    // console.log(document);
    // const lbdDate: DateTime =;
    // lbdDate.subtract(90, 'day');
    // setLbd(new Date());

    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        drr: 0,
        orders: 0,
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
            sum: 0,
            ctr: 0,
            drr: 0,
            orders: 0,
            sum_orders: 0,
        };

        const campaignData = document
            ? document.campaigns
                ? document.campaigns[selected == '' ? selectValue[0] : selected]
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

            for (const [key, _] of Object.entries({
                search: 'search',
                booster: 'booster',
                carousel: 'carousel',
            })) {
                artInfo[key] = {
                    semantics: undefined,
                    plusPhrasesTemplate: artData['plusPhrasesTemplate']
                        ? artData['plusPhrasesTemplate'][key]
                        : undefined,
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
                    drrAI: artData['drrAI'] ? artData['drrAI'][key] : undefined,
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
                    summaryTemp.orders += artInfo[key].orders;
                    summaryTemp.sum += artInfo[key].sum;
                    summaryTemp.views += artInfo[key].views;
                    summaryTemp.clicks += artInfo[key].clicks;
                    summaryTemp.drr = getRoundValue(
                        summaryTemp.sum,
                        summaryTemp.sum_orders,
                        true,
                        1,
                    );
                }
            }

            temp[art] = artInfo;
        }

        summaryTemp.sum_orders = Math.round(summaryTemp.sum_orders);
        summaryTemp.orders = Math.round(summaryTemp.orders);

        setSummary(summaryTemp);
        setTableData(temp);

        filterTableData({}, temp);
    };

    const filterTableData = (withfFilters = {}, tableData = {}) => {
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
                    semantics: artInfo[key].semantics,
                    plusPhrasesTemplate: artInfo[key].plusPhrasesTemplate,
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
                    drrAI: artInfo[key].drrAI,
                    advertsManagerRules: artInfo['advertsManagerRules'],
                    advertsStocksThreshold: artInfo['advertsStocksThreshold'],
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
        const paginatedDataTemp = temp.slice(0, 900);
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

    const [firstRecalc, setFirstRecalc] = useState(false);
    const [changedColumns, setChangedColumns] = useState<any>(false);
    const columns = generateColumns(columnData);

    if (changedDoc) {
        setChangedDoc(undefined);
        recalc(dateRange);
        // console.log(document);
    }

    if (changedColumns) {
        setChangedColumns(false);
    }

    if (!document) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(document['campaigns'])) {
            if (Userfront.user.userUuid == '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a') {
                if (campaignName == 'ИП Валерий') {
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
        console.log(document);

        for (let i = 0; i < columnData.length; i++) {
            const {name} = columnData[i];
            if (!name) continue;
            if (!filters[name]) filters[name] = {val: '', compMode: 'include'};
        }
        setFilters(filters);

        recalc(dateRange, selected);
        setFirstRecalc(true);
    }

    const cardStyle = {
        width: '100%',
        maxWidth: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        marginRight: '4px',
        marginLeft: '4px',
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
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['sum'])}
                        </Text>
                        <Text>Расход, ₽</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            className={b('summary-text')}
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['drr'])}
                        </Text>
                        <Text> Дрр, %</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['orders'])}
                        </Text>
                        <Text>Заказов, шт.</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['sum_orders'])}
                        </Text>
                        <Text> Заказов, ₽</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['views'])}
                        </Text>
                        <Text>Показов, шт.</Text>
                    </div>
                </Card>
                <Card style={cardStyle} theme="info" view="raised">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18pt',
                                marginTop: '10px',
                            }}
                        >
                            {new Intl.NumberFormat('ru-RU').format(summary['clicks'])}
                        </Text>
                        <Text>Кликов, шт.</Text>
                    </div>
                </Card>
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
                    {/* <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => {
                            setManageModalOpen(true);
                            setSelectedButton('');
                        }}
                    >
                        Управление
                    </Button>
                    <Modal
                        open={manageModalOpen}
                        onClose={() => {
                            setManageModalOpen(false);
                            setSelectedButton('');
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

                                {generateModalButtonWithActions(
                                    {
                                        view: 'flat-success',
                                        icon: Play,
                                        placeholder: 'Запустить',
                                        onClick: () => {
                                            const params = {
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
                                                campaignName: selectValue[0],
                                                data: {
                                                    mode: 'start',
                                                    arts: [] as any[],
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;
                                                params.data.arts.push(art);
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('manageAdvertsActivity', params);
                                            //////////////////////////////////

                                            setManageModalOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                {generateModalButtonWithActions(
                                    {
                                        view: 'flat-warning',
                                        icon: Pause,
                                        placeholder: 'Приостановить',
                                        onClick: () => {
                                            const params = {
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
                                                campaignName: selectValue[0],
                                                data: {
                                                    mode: 'pause',
                                                    arts: [] as any[],
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;
                                                params.data.arts.push(art);
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('manageAdvertsActivity', params);
                                            //////////////////////////////////

                                            setManageModalOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                {generateModalButtonWithActions(
                                    {
                                        view: 'flat-danger',
                                        icon: TrashBin,
                                        placeholder: 'Завершить',
                                        onClick: () => {
                                            const params = {
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
                                                campaignName: selectValue[0],
                                                data: {
                                                    mode: 'stop',
                                                    arts: [] as any[],
                                                },
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;
                                                params.data.arts.push(art);
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('manageAdvertsActivity', params);
                                            //////////////////////////////////

                                            setManageModalOpen(false);
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                            </div>
                        </Card>
                    </Modal> */}
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => {
                            setModalFormOpen(true);
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
                            setSelectedButton('');
                        }}
                    >
                        Управление
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
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
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
                                                        !document.campaigns[selectValue[0]][art]
                                                            .advertsManagerRules
                                                    )
                                                        document.campaigns[selectValue[0]][
                                                            art
                                                        ].advertsManagerRules = {};
                                                    if (
                                                        !document.campaigns[selectValue[0]][art]
                                                            .advertsManagerRules[advertsType]
                                                    )
                                                        document.campaigns[selectValue[0]][
                                                            art
                                                        ].advertsManagerRules[advertsType] = {
                                                            mode: false,
                                                        };
                                                    document.campaigns[selectValue[0]][
                                                        art
                                                    ].advertsManagerRules[advertsType].mode = value;
                                                }
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            // console.log(document);

                                            callApi('updateAdvertsManagerRules', params);
                                            setChangedDoc(document);
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
                        view="outlined"
                        onClick={() => {
                            setSelectedButton('');
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
                            setBudgetModalBudgetInputValue(500);
                            setBudgetModalSwitchValue('Пополнить');
                            setBudgetModalBudgetInputValidationValue(true);
                            setBudgetModalFormOpen(true);
                        }}
                    >
                        Бюджет
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
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
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
                                                            !document.campaigns[selectValue[0]][art]
                                                                .budgetToKeep
                                                        )
                                                            document.campaigns[selectValue[0]][
                                                                art
                                                            ].budgetToKeep = {};
                                                        document.campaigns[selectValue[0]][
                                                            art
                                                        ].budgetToKeep[advertsType] =
                                                            budgetModalBudgetInputValue;
                                                    }
                                                }
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            callApi('depositAdvertsBudgets', params);
                                            setChangedDoc(document);
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
                        view="outlined"
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
                            setBidModalBidStepInputValidationValue(true);
                            setBidModalStocksThresholdInputValue(5);
                            setBidModalStocksThresholdInputValidationValue(true);
                            setBidModalDRRInputValue(50);
                            setBidModalDRRInputValidationValue(true);
                        }}
                    >
                        Ставки
                    </Button>
                    <Modal open={bidModalFormOpen} onClose={() => setBidModalFormOpen(false)}>
                        <div>
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
                                            setBidModalBidStepInputValidationValue(true);
                                            setBidModalDRRInputValue(50);
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
                                                : 78,
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
                                                        ? 38
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
                                                <TextInput
                                                    style={{
                                                        maxWidth: '70%',
                                                        margin: '4px 0',
                                                    }}
                                                    type="number"
                                                    value={String(bidModalDRRInputValue)}
                                                    onChange={(val) => {
                                                        const cpo = Number(val.target.value);
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
                                                    label="Целевой ДРР"
                                                />
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
                                    {generateModalAdvertsTypesInput(setAdvertsTypesInput)}
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
                                                !bidModalStocksThresholdInputValidationValue
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
                                                    uid:
                                                        Userfront.user.userUuid ==
                                                            '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                        Userfront.user.userUuid ==
                                                            '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                            ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                            : '',
                                                    campaignName: selectValue[0],
                                                    data: {
                                                        arts: {},
                                                        advertsTypes: advertsTypesInput,
                                                        mode: bidModalDeleteModeSelected
                                                            ? 'Удалить правила'
                                                            : bidModalSwitchValue,
                                                        stocksThreshold:
                                                            bidModalStocksThresholdInputValue,
                                                    },
                                                };
                                                for (let i = 0; i < filteredData.length; i++) {
                                                    const art = filteredData[i].art;
                                                    if (!art) continue;

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

                                                        for (const [
                                                            advertsType,
                                                            value,
                                                        ] of Object.entries(advertsTypesInput)) {
                                                            if (!advertsType || !value) continue;
                                                            if (
                                                                !document.campaigns[selectValue[0]][
                                                                    art
                                                                ].drrAI
                                                            )
                                                                document.campaigns[selectValue[0]][
                                                                    art
                                                                ].drrAI = {};
                                                            document.campaigns[selectValue[0]][
                                                                art
                                                            ].drrAI[advertsType] = {
                                                                desiredDRR:
                                                                    bidModalDeleteModeSelected
                                                                        ? undefined
                                                                        : bidModalDRRInputValue,
                                                            };
                                                        }
                                                        if (
                                                            !document.campaigns[selectValue[0]][art]
                                                                .advertsStocksThreshold
                                                        )
                                                            document.campaigns[selectValue[0]][
                                                                art
                                                            ].advertsStocksThreshold = {};
                                                        document.campaigns[selectValue[0]][
                                                            art
                                                        ].advertsStocksThreshold.stocksThreshold =
                                                            bidModalStocksThresholdInputValue;
                                                    }
                                                }

                                                console.log(params);

                                                //////////////////////////////////
                                                callApi('setAdvertsCPMs', params);
                                                setChangedDoc(document);
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
                        view="outlined"
                        onClick={() => {
                            // setSemanticsModalSemanticsInputValue(500);
                            // setSemanticsModalSwitchValue('Пополнить');
                            // setSemanticsModalSemanticsInputValidationValue(true);
                            setAdvertsTypesInput({search: false, booster: false, carousel: false});
                            setPlusPhrasesModalFormOpen(true);
                            const plusPhrasesTemplatesTemp: any[] = [];
                            for (const [name, _] of Object.entries(document.plusPhrasesTemplates)) {
                                plusPhrasesTemplatesTemp.push(name);
                            }

                            setPlusPhrasesTemplatesLabels(plusPhrasesTemplatesTemp);
                        }}
                    >
                        Семантика
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
                                    width: isDesktop ? '35vw' : undefined,
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
                                    <Text variant="header-1">Фразы</Text>
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
                                <List
                                    filterPlaceholder={`Поиск в ${semanticsModalSemanticsItemsValue.length} фразах`}
                                    items={semanticsModalSemanticsItemsValue}
                                    onFilterEnd={({items}) => {
                                        setSemanticsModalSemanticsItemsFiltratedValue(items);
                                        // console.log(
                                        //     semanticsModalSemanticsItemsFiltratedValue.length,
                                        // );
                                    }}
                                    filterItem={(filter) => (item) => {
                                        return item.cluster.includes(filter);
                                    }}
                                    itemHeight={(item) => {
                                        return 30 * Math.round(item.cluster.length / 40);
                                    }}
                                    renderItem={(item) => {
                                        const {cluster, count, sum, ctr, clicks} = item;
                                        const colorToUse =
                                            semanticsModalSemanticsPlusItemsValue.includes(cluster)
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
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row'}}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Text color="secondary">
                                                            {Math.round(sum)}
                                                        </Text>
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
                                                        <Text color="secondary">
                                                            {Math.round(count)}
                                                        </Text>
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
                                                        <Text color="secondary">
                                                            {Math.round(clicks)}
                                                        </Text>
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
                                                            <Icon
                                                                size={12}
                                                                data={LayoutHeaderCursor}
                                                            />
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
                                                        <Text color="secondary">{ctr}</Text>
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
                                                </div>
                                            </div>
                                        );
                                    }}
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
                                    width: isDesktop ? '15vw' : undefined,
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginBottom: 8,
                                        height: 28,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text variant="header-1">Минус фразы</Text>
                                </div>
                                <List
                                    items={semanticsModalSemanticsMinusItemsValue}
                                    filterPlaceholder={`Поиск в ${semanticsModalSemanticsMinusItemsValue.length} фразах`}
                                    itemHeight={(item) => {
                                        return 30 * Math.ceil(item.length / 30);
                                    }}
                                    onItemClick={(item) => {
                                        let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                        const cluster = item;
                                        if (!val.includes(cluster)) {
                                            val.push(cluster);
                                        } else {
                                            val = val.filter((value) => value != cluster);
                                        }
                                        setSemanticsModalSemanticsPlusItemsValue(val);
                                    }}
                                    renderItem={(item) => {
                                        const cluster = item;
                                        const colorToUse =
                                            semanticsModalSemanticsPlusItemsValue.includes(cluster)
                                                ? 'positive'
                                                : 'primary';
                                        return (
                                            <div
                                                style={{
                                                    textWrap: 'wrap',
                                                }}
                                            >
                                                <Text color={colorToUse}>{cluster}</Text>
                                            </div>
                                        );
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
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text variant="header-1">Плюс фразы</Text>
                                    <Label
                                        size="m"
                                        theme={
                                            semanticsModalSemanticsPlusItemsTemplateNameValue ==
                                            'Не установлен'
                                                ? 'normal'
                                                : 'info'
                                        }
                                    >
                                        {semanticsModalSemanticsPlusItemsTemplateNameValue}
                                    </Label>
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
                                    <div
                                        style={{
                                            display: semanticsModalTextAreaAddMode
                                                ? 'none'
                                                : 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <RadioButton
                                            defaultValue={semanticsModalAdvertType}
                                            options={semanticsModalAdvertTypes}
                                            onUpdate={(val) => {
                                                setSemanticsModalAdvertType(val);
                                                setSemanticsModalIsFixed(false);
                                                setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                                    (cur) => {
                                                        const name = cur.trim();
                                                        const nameArray = name.split(' ');
                                                        if (
                                                            nameArray.at(-1) == 'АВТО' ||
                                                            nameArray.at(-1) == 'ПОИСК'
                                                        )
                                                            nameArray.pop();

                                                        return nameArray.join(' ') + ' ' + val;
                                                    },
                                                );
                                            }}
                                        />
                                        <Button
                                            // width="max"
                                            style={{margin: '0 8px'}}
                                            disabled={semanticsModalAdvertType == 'АВТО'}
                                            selected={semanticsModalIsFixed}
                                            onClick={() =>
                                                setSemanticsModalIsFixed(!semanticsModalIsFixed)
                                            }
                                        >
                                            {`Фикс. ${!semanticsModalIsFixed ? 'выкл.' : 'вкл.'}`}
                                        </Button>
                                    </div>
                                    <Button
                                        width="max"
                                        view={
                                            semanticsModalTextAreaAddMode
                                                ? 'flat-success'
                                                : 'normal'
                                        }
                                        selected={semanticsModalTextAreaAddMode}
                                        onClick={() => {
                                            setSemanticsModalTextAreaAddMode(
                                                !semanticsModalTextAreaAddMode,
                                            );
                                            const rows = semanticsModalTextAreaValue.split('\n');
                                            const val = Array.from(
                                                semanticsModalSemanticsPlusItemsValue,
                                            );
                                            for (let i = 0; i < rows.length; i++) {
                                                const cluster = rows[i].trim();
                                                if (!cluster || cluster === '') continue;
                                                if (!val.includes(cluster)) {
                                                    val.push(cluster);
                                                }
                                            }
                                            setSemanticsModalSemanticsPlusItemsValue(val);
                                            setSemanticsModalTextAreaValue('');
                                        }}
                                    >
                                        {`${
                                            semanticsModalTextAreaAddMode ? 'Сохранить' : 'Добавить'
                                        } фразы`}
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
                                            const endName =
                                                name +
                                                (!name.includes(' ' + semanticsModalAdvertType)
                                                    ? ' ' + semanticsModalAdvertType
                                                    : '');
                                            const params = {
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
                                                data: {
                                                    mode: 'Установить',
                                                    isFixed: semanticsModalIsFixed,
                                                    name: endName,
                                                    type: semanticsModalAdvertType,
                                                    clusters: semanticsModalSemanticsPlusItemsValue,
                                                    threshold:
                                                        semanticsModalSemanticsThresholdValue,
                                                    ctrThreshold:
                                                        semanticsModalSemanticsCTRThresholdValue,
                                                },
                                            };

                                            document.plusPhrasesTemplates[endName] = {
                                                isFixed: semanticsModalIsFixed,
                                                name: endName,
                                                type: semanticsModalAdvertType,
                                                clusters: semanticsModalSemanticsPlusItemsValue,
                                                threshold: semanticsModalSemanticsThresholdValue,
                                                ctrThreshold:
                                                    semanticsModalSemanticsCTRThresholdValue,
                                            };

                                            console.log(params);

                                            setChangedDoc(document);

                                            callApi('setPlusPhraseTemplate', params);

                                            setSemanticsModalFormOpen(false);
                                        }}
                                    >
                                        Сохранить
                                    </Button>
                                </div>
                                {semanticsModalTextAreaAddMode ? (
                                    <TextArea
                                        onUpdate={(val) => {
                                            setSemanticsModalTextAreaValue(val);
                                        }}
                                        hasClear
                                        placeholder="Вводите фразы для добавления с новой строки"
                                        maxRows={Math.round(
                                            (windowDimensions.height * 0.4) / 16 + 10,
                                        )}
                                    />
                                ) : (
                                    <List
                                        itemHeight={(item) => {
                                            return 30 * Math.ceil(item.length / 45);
                                        }}
                                        items={semanticsModalSemanticsPlusItemsValue}
                                        filterPlaceholder={`Поиск в ${semanticsModalSemanticsPlusItemsValue.length} фразах`}
                                        onItemClick={(cluster) => {
                                            let val = Array.from(
                                                semanticsModalSemanticsPlusItemsValue,
                                            );
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
                                )}
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

                                <div style={{marginBottom: 8}}>
                                    {generateModalAdvertsTypesInput(setAdvertsTypesInput)}
                                </div>

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
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
                                                campaignName: selectValue[0],
                                                data: {arts: {}, advertsTypes: advertsTypesInput},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;

                                                params.data.arts[art] = {
                                                    mode: 'Установить',
                                                    templateName: item,
                                                    art: art,
                                                };

                                                for (const [advertsType, value] of Object.entries(
                                                    advertsTypesInput,
                                                )) {
                                                    if (!advertsType || !value) continue;
                                                    if (
                                                        !document.campaigns[selectValue[0]][art]
                                                            .plusPhrasesTemplate
                                                    )
                                                        document.campaigns[selectValue[0]][
                                                            art
                                                        ].plusPhrasesTemplate = {};
                                                    document.campaigns[selectValue[0]][
                                                        art
                                                    ].plusPhrasesTemplate[advertsType] = item;
                                                }
                                            }
                                            console.log(params);

                                            /////////////////////////
                                            callApi('setAdvertsPlusPhrasesTemplates', params);
                                            setChangedDoc(document);
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
                                                uid:
                                                    Userfront.user.userUuid ==
                                                        '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                                    Userfront.user.userUuid ==
                                                        '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                                        ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                                        : '',
                                                campaignName: selectValue[0],
                                                data: {arts: {}, advertsTypes: advertsTypesInput},
                                            };
                                            for (let i = 0; i < filteredData.length; i++) {
                                                const art = filteredData[i].art;
                                                if (!art) continue;

                                                params.data.arts[art] = {
                                                    mode: 'Удалить',
                                                    art: art,
                                                };

                                                for (const [advertsType, value] of Object.entries(
                                                    advertsTypesInput,
                                                )) {
                                                    if (!advertsType || !value) continue;
                                                    if (
                                                        !document.campaigns[selectValue[0]][art]
                                                            .plusPhrasesTemplate
                                                    )
                                                        document.campaigns[selectValue[0]][
                                                            art
                                                        ].plusPhrasesTemplate = {};
                                                    document.campaigns[selectValue[0]][
                                                        art
                                                    ].plusPhrasesTemplate[advertsType] = undefined;
                                                }
                                            }
                                            console.log(params);

                                            /////////////////////////
                                            callApi('setAdvertsPlusPhrasesTemplates', params);
                                            setChangedDoc(document);
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
                    <Select
                        className={b('selectCampaign')}
                        value={selectValue}
                        placeholder="Values"
                        options={selectOptions}
                        onUpdate={(nextValue) => {
                            if (!Object.keys(document['campaigns'][nextValue[0]]).length) {
                                callApi('getMassAdvertsNew', {
                                    uid:
                                        (Userfront.user.userUuid ==
                                            '332fa5da-8450-451a-b859-a84ca9951a34' ||
                                        Userfront.user.userUuid ==
                                            '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                            ? '332fa5da-8450-451a-b859-a84ca9951a34'
                                            : '') ?? '',
                                    dateRange: {from: '2023', to: '2024'},
                                    campaignName: nextValue,
                                }).then((res) => {
                                    if (!res) return;
                                    const resData = res['data'];
                                    document['campaigns'][nextValue[0]] =
                                        resData['campaigns'][nextValue[0]];
                                    setChangedDoc(document);
                                    setSelectValue(nextValue);
                                    // recalc(dateRange, nextValue[0]);
                                    console.log(document);
                                });
                            } else {
                                setSelectValue(nextValue);
                                recalc(dateRange, nextValue[0]);
                            }
                            setPagesCurrent(1);
                        }}
                    />
                </div>

                <div ref={fieldRef}>
                    <Button
                        style={{cursor: 'pointer', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => {
                            setDatePickerOpen((curVal) => !curVal);
                        }}
                    >
                        {`${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString(
                            'ru-RU',
                        )}`}
                    </Button>
                </div>
                <Popup
                    open={datePickerOpen}
                    anchorRef={fieldRef}
                    onClose={() => recalc(dateRange)}
                    // placement="bottom-end"
                >
                    <div style={{display: 'flex', flexDirection: 'row', marginLeft: 10}}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                width="max"
                                className={b('datePickerRangeButton')}
                                view="flat"
                                onClick={() => {
                                    const range = [today, today];
                                    setDateRange(range);
                                    recalc(range);
                                    setDatePickerOpen(false);
                                }}
                            >
                                Сегодня
                            </Button>
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
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
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
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
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
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
                            <Button
                                className={b('datePickerRangeButton')}
                                width="max"
                                view="flat"
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
                        <RangeCalendar
                            timeZone="Europe/Moscow"
                            onUpdate={(val) => {
                                const range = [val.start.toDate(), val.end.toDate()];
                                setDateRange(range);
                                setDatePickerOpen(false);
                                recalc(range);
                            }}
                        />
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
                    pageSize={900}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 900, page * 900);
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
