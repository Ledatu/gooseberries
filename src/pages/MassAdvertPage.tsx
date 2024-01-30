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
    Checkbox,
    RadioButton,
    List,
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
    DiamondExclamation,
    CloudCheck,
    Calendar,
    TrashBin,
} from '@gravity-ui/icons';
import useWindowDimensions from 'src/hooks/useWindowDimensions';
import {motion} from 'framer-motion';

const {ipAddress} = require('../ipAddress');

const getUserDoc = () => {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(
                `${ipAddress}/api/getMassAdverts`,
                {uid: Userfront.user.userUuid ?? '', dateRange: {from: '2023', to: '2024'}},
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
    const [filters, setFilters] = useState({undef: false});
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [budgetInputValue, setBudgetInputValue] = useState(500);
    const [budgetInputValidationValue, setBudgetInputValidationValue] = useState(true);
    const [bidInputValue, setBidInputValue] = useState(125);
    const [bidInputValidationValue, setBidInputValidationValue] = useState(true);
    const [placementsRecomInputValue, setPlacementsRecomInputValue] = useState(false);
    const [placementsBoosterInputValue, setPlacementsBoosterInputValue] = useState(true);
    const [placementsCarouselInputValue, setPlacementsCarouselInputValue] = useState(false);
    const advertTypeSwitchValues: any[] = [
        {value: 'Авто', content: 'Авто'},
        {value: 'Поиск', content: 'Поиск'},
    ];
    const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = React.useState('Авто');

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

    // const [
    //     semanticsModalSemanticsInputValidationValue,
    //     setSemanticsModalSemanticsInputValidationValue,
    // ] = useState(true);
    // const semanticsModalSwitchValues: any[] = [
    //     {value: 'Пополнить', content: 'Пополнить'},
    //     {value: 'Установить лимит', content: 'Установить лимит'},
    // ];
    // const [semanticsModalSwitchValue, setSemanticsModalSwitchValue] = React.useState('Пополнить');

    const [bidModalFormOpen, setBidModalFormOpen] = useState(false);
    const [bidModalBidInputValue, setBidModalBidInputValue] = useState(125);
    const [bidModalBidInputValidationValue, setBidModalBidInputValidationValue] = useState(true);
    const [bidModalDeleteModeSelected, setBidModalDeleteModeSelected] = useState(false);
    const [bidModalBidStepInputValue, setBidModalBidStepInputValue] = useState(5);
    const [bidModalBidStepInputValidationValue, setBidModalBidStepInputValidationValue] =
        useState(true);
    const [bidModalCPOInputValue, setBidModalCPOInputValue] = useState(50);
    const [bidModalCPOInputValidationValue, setBidModalCPOInputValidationValue] = useState(true);

    const bidModalSwitchValues: any[] = [
        {value: 'Установить', content: 'Установить'},
        {value: 'Автоставки', content: 'Автоставки'},
    ];
    const [bidModalSwitchValue, setBidModalSwitchValue] = React.useState('Установить');
    const bidModalAnalyticsSwitchValues: any[] = [
        {
            value: 1,
            content: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    1<div style={{width: 2}} />
                    <Icon size={12} data={Calendar}></Icon>
                </div>
            ),
        },
        {
            value: 7,
            content: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    7<div style={{width: 2}} />
                    <Icon size={12} data={Calendar}></Icon>
                </div>
            ),
        },
        {
            value: 14,
            content: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    14
                    <div style={{width: 2}} />
                    <Icon size={12} data={Calendar}></Icon>
                </div>
            ),
        },
        {
            value: 30,
            content: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    30
                    <div style={{width: 2}} />
                    <Icon size={12} data={Calendar}></Icon>
                </div>
            ),
        },
    ];
    const [bidModalAnalyticsSwitchValue, setBidModalAnalyticsSwitchValue] = React.useState(14);

    const [data, setTableData] = useState<any[]>([]);
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
            const {name, placeholder, width, render, className, valueType} = column;
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
                            onChange={(val) => {
                                setFilters(() => {
                                    if (!(name in filters))
                                        filters[name] = {compMode: 'include', val: ''};
                                    filters[name].val = val.target.value;
                                    recalc(dateRange, '', filters);
                                    return filters;
                                });
                            }}
                            hasClear
                            placeholder={placeholder}
                            rightContent={
                                <DropdownMenu
                                    renderSwitcher={(props) => (
                                        <Button
                                            {...props}
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
                                                        recalc(dateRange, '', filters);
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
                                                        recalc(dateRange, '', filters);
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
                                                        recalc(dateRange, '', filters);
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
                                                        recalc(dateRange, '', filters);
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
                                                              recalc(dateRange, '', filters);
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
                                                              recalc(dateRange, '', filters);
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
                    value
                ) : (
                    <div
                        title={value}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            zIndex: 40,
                        }}
                    >
                        <div
                            style={{
                                width: `${String(data.length).length * 6}px`,
                                margin: '0 16px',
                                display: 'flex',
                                justifyContent: 'right',
                            }}
                        >
                            <div>{index + 1}</div>
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
                );
            },
            valueType: 'text',
        },
        {name: 'brand', placeholder: 'Бренд', valueType: 'text'},
        {name: 'object', placeholder: 'Предмет', valueType: 'text'},
        {name: 'stocks', placeholder: 'Остаток'},
        {
            name: 'adverts',
            placeholder: 'Реклама',
            valueType: 'text',
            render: ({value}) => {
                if (value === null) return;
                const tags: any[] = [];
                const generateHtml = () => {
                    let string = `<div style={display: 'flex'}>`;
                    if (value) {
                        for (const [advertType, advertsOfType] of Object.entries(value)) {
                            if (!advertType || !advertsOfType) continue;

                            for (const [advertId, advertData] of Object.entries(advertsOfType)) {
                                if (!advertId || !advertData) continue;
                                const status = advertData['status'];
                                if (![4, 9, 11].includes(status)) continue;

                                string += `<div style="display: flex; flex-direction: row; justify-content: space-between; font-size: 8pt;">`;
                                string +=
                                    `<div style="margin: 0 4px;">ID: ${advertId}</div>` +
                                    `<div style="margin: 0 4px;">Тип: ${
                                        paramMap.type[advertData['type']]
                                    }</div>` +
                                    `<div style="margin: 0 4px;">Обновлена: ${
                                        // paramMap.status[advertData['status']]
                                        advertData['updateTime']
                                    }</div>`;
                                string += '</div>';
                            }
                        }
                    }
                    string += '</div>';
                    return string;
                };
                if (value !== undefined) {
                    for (const [advertType, advertsOfType] of Object.entries(value)) {
                        if (!advertType || !advertsOfType) continue;
                        for (const [advertId, advertData] of Object.entries(advertsOfType)) {
                            if (!advertId || !advertData) continue;
                            const status = advertData['status'];
                            if (![4, 9, 11].includes(status)) continue;

                            const themeToUse = status == 9 ? 'success' : 'danger';

                            tags.push(
                                <div style={{margin: '0 2px'}}>
                                    <Label
                                        icon={
                                            advertData['updateTime'] === 'Ошибка.' ? (
                                                <Icon
                                                    data={
                                                        advertData['updateTime'] === 'Ошибка.'
                                                            ? DiamondExclamation
                                                            : CloudCheck
                                                    }
                                                />
                                            ) : undefined
                                        }
                                        theme={themeToUse}
                                    >
                                        {paramMap.type[advertType]}
                                    </Label>
                                </div>,
                            );
                        }
                    }
                }
                if (tags.length == 0) {
                    return (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Label theme="unknown">Кампаний нет</Label>
                        </div>
                    );
                }
                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Popover
                            behavior={'delayed' as PopoverBehavior}
                            disabled={value === undefined}
                            htmlContent={generateHtml()}
                        >
                            <div style={{display: 'flex'}}>{tags}</div>
                        </Popover>
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
                if (!row.adverts) return;
                // const themeToUse = 'normal';
                // console.log(value.plus);

                const themeToUse = value.plus ? 'info' : 'normal';

                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Label
                            // theme="normal"
                            // theme="info"
                            theme={themeToUse}
                            onClick={() => {
                                setSemanticsModalFormOpen(true);
                                setSemanticsModalSemanticsItemsValue(value.clusters);
                                setSemanticsModalSemanticsItemsFiltratedValue(value.clusters);
                                setSemanticsModalSemanticsMinusItemsValue(value.excluded);
                                setSemanticsModalSemanticsPlusItemsTemplateNameValue(
                                    value.plus ?? 'Не установлен',
                                );
                                setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                    value.plus ?? 'Новый шаблон',
                                );
                                const plusThreshold = document.plusPhrasesTemplates[value.plus]
                                    ? document.plusPhrasesTemplates[value.plus].threshhold
                                    : 100;
                                setSemanticsModalSemanticsThresholdValue(plusThreshold);
                                // console.log(value.plus);
                                const plusItems = document.plusPhrasesTemplates[value.plus]
                                    ? document.plusPhrasesTemplates[value.plus].keywords
                                    : [];
                                setSemanticsModalSemanticsPlusItemsValue(plusItems);
                            }}
                        >
                            {themeToUse == 'info' ? value.plus : 'Добавить'}
                        </Label>
                    </div>
                );
            },
        },
        {name: 'budget', placeholder: 'Баланс, ₽'},
        {name: 'budgetToKeep', placeholder: 'Бюджет, ₽'},
        {name: 'bid', placeholder: 'Ставка, ₽'},
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'sum_orders', placeholder: 'Заказов, ₽'},
        {name: 'orders', placeholder: 'Заказов, шт.'},
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value, row}) => {
                const desiredCPO = row.cpoAI ? row.cpoAI.desiredCPO : undefined;
                return (
                    <Text
                        color={
                            desiredCPO
                                ? value <= desiredCPO
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
            name: 'cpoAI',
            placeholder: 'CPO AI, ₽',
            render: ({value}) =>
                value ? (value.desiredCPO ? value.desiredCPO : undefined) : undefined,
        },
        {name: 'drr', placeholder: 'ДРР, %'},
        {name: 'views', placeholder: 'Показов, шт.'},
        {name: 'clicks', placeholder: 'Кликов, шт.'},
        {name: 'ctr', placeholder: 'CTR, %'},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'cr', placeholder: 'CR, %'},
    ];
    const columns = generateColumns(columnData);

    const [filteredSummary, setFilteredSummary] = useState({
        art: '',
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        sum_orders: 0,
        adverts: null,
        semantics: null,
    });

    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [sort, setSort] = React.useState<any[]>([{column: 'Расход', order: 'asc'}]);
    // const [document, setUserDoc] = React.useState(getUserDoc());
    const document = getUserDoc();
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

    const recalc = (daterng, selected = '', withfFilters = {}) => {
        const getRoundValue = (a, b, isPercentage = false, def = 0) => {
            let result = b ? a / b : def;
            if (isPercentage) {
                result = Math.round(result * 100 * 100) / 100;
            } else {
                result = Math.round(result);
            }
            return result;
        };

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
        const temp: any[] = [];
        for (const [art, artData] of Object.entries(campaignData)) {
            if (!art || !artData) continue;
            const artInfo = {
                art: '',
                object: '',
                nmId: 0,
                title: '',
                stocks: 0,
                adverts: 0,
                semantics: undefined,
                budget: undefined,
                bid: undefined,
                budgetToKeep: undefined,
                brand: '',
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
                cpoAI: 0,
            };
            artInfo.art = artData['art'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];
            artInfo.adverts = artData['adverts'];
            artInfo.budgetToKeep = artData['budgetToKeep'];
            artInfo.cpoAI = artData['cpoAI'];

            if (artInfo.adverts) {
                for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
                    if (!advertType || !advertsOfType) continue;

                    for (const [advertId, advertData] of Object.entries(advertsOfType)) {
                        if (!advertId || !advertData) continue;
                        const status = advertData['status'];
                        if (![4, 9, 11].includes(status)) continue;
                        const budget = advertData['budget'];
                        artInfo.budget = budget;
                        artInfo.semantics = advertData['words'];
                        artInfo.bid = advertData['cpm'];
                    }
                }
            }
            if (artData['advertsStats']) {
                for (const [strDate, day] of Object.entries(artData['advertsStats'])) {
                    if (strDate == 'updateTime') continue;
                    if (!day) continue;
                    const date = new Date(strDate);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    if (date < startDate || date > endDate) continue;

                    artInfo.sum_orders += day['sum_orders'];
                    artInfo.orders += day['orders'];
                    artInfo.sum += day['sum'];
                    artInfo.views += day['views'];
                    artInfo.clicks += day['clicks'];
                }
                artInfo.sum_orders = Math.round(artInfo.sum_orders);
                artInfo.orders = Math.round(artInfo.orders);
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
                summaryTemp.orders += artInfo.orders;
                summaryTemp.sum += artInfo.sum;
                summaryTemp.views += artInfo.views;
                summaryTemp.clicks += artInfo.clicks;
                summaryTemp.drr = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
            }

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

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '') continue;
                // if (filterArg == 'adverts') {}
                if (!compare(artInfo[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }
            if (addFlag) temp.push(artInfo);

            // data.push(advertStats);
        }

        setSummary(summaryTemp);

        // console.log(temp);
        const filteredSummaryTemp = {
            art: `Показано артикулов: ${temp.length}`,
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
            adverts: null,
            semantics: null,
            budget: 0,
            budgetToKeep: 0,
        };
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            filteredSummaryTemp.sum_orders += row['sum_orders'];
            filteredSummaryTemp.orders += row['orders'];
            filteredSummaryTemp.sum += row['sum'];
            filteredSummaryTemp.views += row['views'];
            filteredSummaryTemp.clicks += row['clicks'];
            filteredSummaryTemp.budget += row['budget'] ?? 0;
            filteredSummaryTemp.budgetToKeep += row['budgetToKeep'] ?? 0;
        }
        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
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
        // if (!temp.length) temp.push({});
        temp.sort((a, b) => a.art.localeCompare(b.art));
        setTableData(temp);
    };

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

    const [firstRecalc, setFirstRecalc] = useState(false);
    if (!document) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(document['campaigns'])) {
            campaignsNames.push({value: campaignName, content: campaignName});
        }
        setSelectOptions(campaignsNames as SelectOption<any>[]);
        const selected = campaignsNames[0]['value'];
        setSelectValue([selected]);
        console.log(document);

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
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => setModalFormOpen(true)}
                    >
                        Создать
                    </Button>
                    <Modal
                        open={modalFormOpen}
                        onClose={() => {
                            setAdvertTypeSwitchValue('Авто');
                            setBudgetInputValue(500);
                            setBudgetInputValidationValue(true);
                            setBidInputValue(125);
                            setBidInputValidationValue(true);
                            setModalFormOpen(false);
                            setPlacementsBoosterInputValue(true);
                            setPlacementsRecomInputValue(false);
                            setPlacementsCarouselInputValue(false);
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
                                    Параметры
                                </Text>
                                <RadioButton
                                    style={{marginBottom: '4px'}}
                                    defaultValue={advertTypeSwitchValue}
                                    options={advertTypeSwitchValues}
                                    onUpdate={(val) => {
                                        setAdvertTypeSwitchValue(val);
                                    }}
                                />
                                <TextInput
                                    style={{
                                        maxWidth: '70%',
                                        margin: '4px 0',
                                    }}
                                    type="number"
                                    value={String(budgetInputValue)}
                                    onChange={(val) => {
                                        const budget = Number(val.target.value);
                                        if (budget < 500) setBudgetInputValidationValue(false);
                                        else setBudgetInputValidationValue(true);
                                        setBudgetInputValue(budget);
                                    }}
                                    errorMessage={'Введите не менее 500'}
                                    validationState={
                                        budgetInputValidationValue ? undefined : 'invalid'
                                    }
                                    label="Бюджет"
                                />{' '}
                                <TextInput
                                    style={{
                                        maxWidth: '70%',
                                        margin: '4px 0',
                                    }}
                                    type="number"
                                    value={String(bidInputValue)}
                                    onChange={(val) => {
                                        const bid = Number(val.target.value);
                                        if (bid < 500) setBidInputValidationValue(false);
                                        else setBidInputValidationValue(true);
                                        setBidInputValue(bid);
                                    }}
                                    errorMessage={'Введите не менее 125'}
                                    validationState={
                                        bidInputValidationValue ? undefined : 'invalid'
                                    }
                                    label="Ставки"
                                />
                                <Checkbox
                                    style={{margin: '2px 0'}}
                                    checked={placementsBoosterInputValue}
                                    onUpdate={(checked) => {
                                        setPlacementsBoosterInputValue(checked);
                                    }}
                                    title="Поиск/Каталог"
                                    content="Поиск/Каталог"
                                />
                                <Checkbox
                                    style={{margin: '2px 0'}}
                                    checked={placementsRecomInputValue}
                                    onUpdate={(checked) => {
                                        setPlacementsRecomInputValue(checked);
                                    }}
                                    title="Рекомендации на главной"
                                    content="Рекомендации на главной"
                                />
                                <Checkbox
                                    style={{margin: '4px 0 2px 0'}}
                                    checked={placementsCarouselInputValue}
                                    onUpdate={(checked) => {
                                        setPlacementsCarouselInputValue(checked);
                                    }}
                                    title="Карточка товара"
                                    content="Карточка товара"
                                />
                                <Button
                                    style={{
                                        margin: '8px 0px',
                                        maxWidth: '60%',
                                    }}
                                    pin="circle-circle"
                                    size="l"
                                    width="max"
                                    view="action"
                                    disabled={
                                        !(budgetInputValidationValue && bidInputValidationValue)
                                    }
                                    // view="outlined-success"
                                    // selected
                                    onClick={() => {
                                        const params = {
                                            uid: Userfront.user.userUuid,
                                            campaignName: selectValue[0],
                                            arts: {},
                                        };
                                        for (let i = 0; i < data.length; i++) {
                                            const art = data[i].art;
                                            params.arts[art] = {
                                                type: advertTypeSwitchValue,
                                                budget: budgetInputValue,
                                                bid: bidInputValue,
                                                nmId: data[i].nmId,
                                                placements: {
                                                    recom: placementsRecomInputValue,
                                                    booster: placementsBoosterInputValue,
                                                    carousel: placementsCarouselInputValue,
                                                },
                                            };
                                        }
                                        console.log(params);

                                        //////////////////////////////////
                                        const token =
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                        axios
                                            .post(`${ipAddress}/api/createMassAdverts`, params, {
                                                headers: {
                                                    Authorization: 'Bearer ' + token,
                                                },
                                            })
                                            .then((response) => console.log(response.data))
                                            .catch((error) => console.error(error));
                                        //////////////////////////////////

                                        setModalFormOpen(false);
                                    }}
                                >
                                    Запуск
                                </Button>
                            </div>
                        </Card>
                    </Modal>
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => {
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
                                <Button
                                    style={{
                                        margin: '8px 0px',
                                        maxWidth: '60%',
                                    }}
                                    pin="circle-circle"
                                    size="l"
                                    width="max"
                                    view="action"
                                    disabled={!budgetModalBudgetInputValidationValue}
                                    // view="outlined-success"
                                    // selected
                                    onClick={() => {
                                        const params = {
                                            uid: Userfront.user.userUuid,
                                            campaignName: selectValue[0],
                                            data: {},
                                        };
                                        for (let i = 0; i < data.length; i++) {
                                            const art = data[i].art;
                                            if (!art) continue;

                                            params.data[art] = {
                                                mode: budgetModalSwitchValue,
                                                budget: budgetModalBudgetInputValue,
                                                art: art,
                                            };
                                        }
                                        console.log(params);

                                        //////////////////////////////////
                                        const token =
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                        axios
                                            .post(
                                                `${ipAddress}/api/depositAdvertsBudgets`,
                                                params,
                                                {
                                                    headers: {
                                                        Authorization: 'Bearer ' + token,
                                                    },
                                                },
                                            )
                                            .then((response) => console.log(response.data))
                                            .catch((error) => console.error(error));
                                        //////////////////////////////////

                                        setBudgetModalFormOpen(false);
                                    }}
                                >
                                    {budgetModalSwitchValue == 'Установить лимит'
                                        ? budgetModalBudgetInputValue != 0
                                            ? 'Отправить'
                                            : 'Удалить лимит'
                                        : 'Отправить'}
                                </Button>
                            </div>
                        </Card>
                    </Modal>
                    <Button
                        style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                        view="outlined"
                        onClick={() => {
                            setBidModalBidInputValue(125);
                            setBidModalSwitchValue('Установить');
                            setBidModalAnalyticsSwitchValue(14);
                            setBidModalBidInputValidationValue(true);
                            setBidModalDeleteModeSelected(false);
                            setBidModalFormOpen(true);
                            setBidModalBidStepInputValue(5);
                            setBidModalBidStepInputValidationValue(true);
                            setBidModalCPOInputValue(50);
                            setBidModalCPOInputValidationValue(true);
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
                                            setBidModalAnalyticsSwitchValue(14);
                                            setBidModalBidInputValidationValue(true);
                                            setBidModalDeleteModeSelected(false);
                                            setBidModalFormOpen(true);
                                            setBidModalBidStepInputValue(5);
                                            setBidModalBidStepInputValidationValue(true);
                                            setBidModalCPOInputValue(50);
                                            setBidModalCPOInputValidationValue(true);
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
                                                ? 44
                                                : 130,
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
                                                        ? 59
                                                        : -20
                                                    : 77,
                                                // x: !bidModalDeleteModeSelected
                                                //     ? bidModalSwitchValue == 'Установить'
                                                //         ? 59
                                                //         : -20
                                                //     : -100,
                                            }}
                                            transition={{
                                                duration: 0.01,
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
                                                    value={String(bidModalCPOInputValue)}
                                                    onChange={(val) => {
                                                        const cpo = Number(val.target.value);
                                                        if (cpo < 0)
                                                            setBidModalCPOInputValidationValue(
                                                                false,
                                                            );
                                                        else
                                                            setBidModalCPOInputValidationValue(
                                                                true,
                                                            );
                                                        setBidModalCPOInputValue(cpo);
                                                    }}
                                                    errorMessage={'Введите не менее 0'}
                                                    validationState={
                                                        bidModalCPOInputValidationValue
                                                            ? undefined
                                                            : 'invalid'
                                                    }
                                                    label="Целевой CPO"
                                                />
                                                <TextInput
                                                    style={{
                                                        maxWidth: '70%',
                                                        margin: '4px 0',
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
                                                <Text variant="subheader-1">Аналитика</Text>
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
                                                />
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>

                                    <div
                                        style={{
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
                                            disabled={!bidModalBidInputValidationValue}
                                            // view="action"
                                            view={
                                                bidModalDeleteModeSelected
                                                    ? 'outlined-danger'
                                                    : 'action'
                                            }
                                            // selected
                                            onClick={() => {
                                                const params = {
                                                    uid: Userfront.user.userUuid,
                                                    campaignName: selectValue[0],
                                                    data: {},
                                                };
                                                for (let i = 0; i < data.length; i++) {
                                                    const art = data[i].art;
                                                    if (!art) continue;

                                                    if (bidModalSwitchValue == 'Установить') {
                                                        params.data[art] = {
                                                            mode: bidModalSwitchValue,
                                                            bid: bidModalBidInputValue,
                                                            art: art,
                                                        };
                                                    } else if (
                                                        bidModalSwitchValue == 'Автоставки'
                                                    ) {
                                                        if (!bidModalDeleteModeSelected) {
                                                            params.data[art] = {
                                                                mode: bidModalSwitchValue,
                                                                desiredCPO: bidModalCPOInputValue,
                                                                bidStep: bidModalBidStepInputValue,
                                                                dateRange:
                                                                    bidModalAnalyticsSwitchValue,
                                                                advertId: art,
                                                            };
                                                        } else {
                                                            params.data[art] = {
                                                                mode: 'Удалить правила',
                                                                art: art,
                                                            };
                                                        }
                                                    }
                                                }
                                                console.log(params);

                                                //////////////////////////////////
                                                const token =
                                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                                axios
                                                    .post(
                                                        `${ipAddress}/api/setAdvertsCPMs`,
                                                        params,
                                                        {
                                                            headers: {
                                                                Authorization: 'Bearer ' + token,
                                                            },
                                                        },
                                                    )
                                                    .then((response) => console.log(response.data))
                                                    .catch((error) => console.error(error));
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
                            setPlusPhrasesModalFormOpen(true);
                            const plusPhrasesTemplatesTemp: any[] = [];
                            for (const [name, _] of Object.entries(document.plusPhrasesTemplates)) {
                                plusPhrasesTemplatesTemp.push(
                                    <div style={{margin: '2px 3px'}}>
                                        <Label
                                            size="m"
                                            theme="info"
                                            onClick={() => {
                                                const params = {
                                                    uid: Userfront.user.userUuid,
                                                    campaignName: selectValue[0],
                                                    data: {},
                                                };
                                                for (let i = 0; i < data.length; i++) {
                                                    const art = data[i].art;
                                                    if (!art) continue;

                                                    params.data[art] = {
                                                        mode: 'Установить',
                                                        templateName: name,
                                                        art: art,
                                                    };
                                                }
                                                console.log(params);

                                                //////////////////////////////////
                                                const token =
                                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                                axios
                                                    .post(
                                                        `${ipAddress}/api/setAdvertsPlusPhrasesTemplates`,
                                                        params,
                                                        {
                                                            headers: {
                                                                Authorization: 'Bearer ' + token,
                                                            },
                                                        },
                                                    )
                                                    .then((response) => console.log(response.data))
                                                    .catch((error) => console.error(error));
                                                //////////////////////////////////

                                                setPlusPhrasesModalFormOpen(false);
                                            }}
                                        >
                                            {name}
                                        </Label>
                                    </div>,
                                );
                            }
                            plusPhrasesTemplatesTemp.push(
                                <div style={{margin: '2px 3px'}}>
                                    <Label
                                        size="m"
                                        theme="danger"
                                        onClick={() => {
                                            const params = {
                                                uid: Userfront.user.userUuid,
                                                campaignName: selectValue[0],
                                                data: {},
                                            };
                                            for (let i = 0; i < data.length; i++) {
                                                const art = data[i].art;
                                                if (!art) continue;

                                                params.data[art] = {
                                                    mode: 'Удалить',
                                                    art: art,
                                                };
                                            }
                                            console.log(params);

                                            //////////////////////////////////
                                            const token =
                                                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                            axios
                                                .post(
                                                    `${ipAddress}/api/setAdvertsPlusPhrasesTemplates`,
                                                    params,
                                                    {
                                                        headers: {
                                                            Authorization: 'Bearer ' + token,
                                                        },
                                                    },
                                                )
                                                .then((response) => console.log(response.data))
                                                .catch((error) => console.error(error));
                                            //////////////////////////////////

                                            setPlusPhrasesModalFormOpen(false);
                                        }}
                                    >
                                        Удалить
                                    </Label>
                                </div>,
                            );
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
                                overflow: 'hidden',
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
                                                const keyword =
                                                    semanticsModalSemanticsItemsFiltratedValue[i]
                                                        .keyword;
                                                if (val.includes(keyword)) continue;
                                                val.push(keyword);
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
                                        return item.keyword.includes(filter);
                                    }}
                                    renderItem={(item) => {
                                        const {cluster, count} = item;
                                        const colorToUse =
                                            semanticsModalSemanticsPlusItemsValue.includes(cluster)
                                                ? 'positive'
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
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    <Text color={colorToUse}>{cluster}</Text>
                                                </div>
                                                <Text color="warning">{count}</Text>
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
                                    width: isDesktop ? '25vw' : undefined,
                                    flexDirection: 'column',
                                }}
                            >
                                <Text style={{marginBottom: 8}} variant="header-1">
                                    Минус фразы
                                </Text>
                                <List
                                    items={semanticsModalSemanticsMinusItemsValue}
                                    filterPlaceholder={`Поиск в ${semanticsModalSemanticsMinusItemsValue.length} фразах`}
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
                                    justifyContent: 'space-between',
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
                                    <TextInput
                                        style={{width: 200}}
                                        placeholder="Отсечка"
                                        hasClear
                                        value={String(semanticsModalSemanticsThresholdValue)}
                                        onUpdate={(val) => {
                                            setSemanticsModalSemanticsThresholdValue(Number(val));
                                        }}
                                        type="number"
                                    />
                                    <TextInput
                                        style={{margin: '0 8px'}}
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
                                            const params = {
                                                uid: Userfront.user.userUuid,
                                                data: {
                                                    mode: 'Установить',
                                                    name: semanticsModalSemanticsPlusItemsTemplateNameSaveValue,
                                                    keywords: semanticsModalSemanticsPlusItemsValue,
                                                    threshold:
                                                        semanticsModalSemanticsThresholdValue,
                                                },
                                            };
                                            console.log(params);

                                            const token =
                                                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                            axios
                                                .post(
                                                    `${ipAddress}/api/setPlusPhraseTemplate`,
                                                    params,
                                                    {
                                                        headers: {
                                                            Authorization: 'Bearer ' + token,
                                                        },
                                                    },
                                                )
                                                .then((response) => console.log(response.data))
                                                .catch((error) => console.error(error));

                                            setSemanticsModalFormOpen(false);
                                        }}
                                    >
                                        Сохранить
                                    </Button>
                                </div>

                                <List
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
                                    Шаблоны
                                </Text>

                                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                    {plusPhrasesTemplatesLabels}
                                </div>
                            </div>
                        </Card>
                    </Modal>
                    <Select
                        className={b('selectCampaign')}
                        value={selectValue}
                        placeholder="Values"
                        options={selectOptions}
                        onUpdate={(nextValue) => {
                            setSelectValue(nextValue);
                            recalc(dateRange, nextValue[0]);
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
                    rowClassName={(_row, index) => b('tableRow_' + index)}
                    // defaultSortState={sort}
                    // sortState={sort}
                    // onSortStateChange={(state) => setSort(state)}
                    // className={b('tableStats')}
                    data={data}
                    columns={columns}
                    footerData={[filteredSummary]}
                />
            </div>
        </div>
    );
};
