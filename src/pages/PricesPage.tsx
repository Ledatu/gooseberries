import React, {useEffect, useRef, useState} from 'react';
import {
    Spin,
    Select,
    SelectOption,
    Icon,
    Button,
    Text,
    Link,
    Pagination,
    Popup,
    Modal,
    Card,
    TextInput,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

const b = block('app');

import {ChevronDown, Key, ArrowsRotateLeft, Calculator, CloudArrowUpIn} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare} from 'src/components/TheTable';
import {RangeCalendar} from '@gravity-ui/date-components';
import Userfront from '@userfront/toolkit';
import {getRoundValue} from 'src/utilities/getRoundValue';
import {generateModalButtonWithActions} from './MassAdvertPage';

const getUserDoc = (dateRange, docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['pricesData'][selectValue] = docum['pricesData'][selectValue];
            doc['artsData'][selectValue] = docum['artsData'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getPricesMM', {
            uid: getUid(),
            dateRange: {
                lbd: dateRange[0].toISOString().slice(0, 10),
                rbd: dateRange[1].toISOString().slice(0, 10),
            },
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

export const PricesPage = () => {
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
    const [dateRange, setDateRange] = useState([yesterday, weekAgo]);
    const [startDate, endDate] = dateRange;
    const fieldRef = useRef(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const [filters, setFilters] = useState({undef: false});

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    const [selectedButton, setSelectedButton] = useState('');
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);
    const [currentPricesCalculatedBasedOn, setCurrentPricesCalculatedBasedOn] = useState('');

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index}) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;

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
                            {Math.floor((pagesCurrent - 1) * 600 + index + 1)}
                        </div>
                        {value}
                    </div>
                );
            },
            valueType: 'text',
            group: true,
        },
        {name: 'size', placeholder: 'Размер', valueType: 'text'},
        {name: 'brand', placeholder: 'Бренд', valueType: 'text'},
        {name: 'title', placeholder: 'Наименование', valueType: 'text'},
        {name: 'nmId', placeholder: 'Артикул WB', valueType: 'text'},
        {name: 'barcode', placeholder: 'Баркод', valueType: 'text'},
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
                        Розничная цена, ₽
                    </Text>
                </Link>
            ),
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
        },
        {
            name: 'wbWalletPrice',
            placeholder: (
                <Link
                    onClick={() => {
                        if (currentPricesCalculatedBasedOn == 'wbWalletPrice')
                            setDateChangeRecalc(true);
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
                        Цена с кошельком WB, ₽
                    </Text>
                </Link>
            ),
        },
        {name: 'wbPrice', placeholder: 'Цена для WB, ₽'},
        // {name: 'priceInfo', placeholder: 'Себестоимость, ₽'},
        {name: 'stock', placeholder: 'Остаток, шт.'},
        {
            name: 'profit',
            placeholder: 'Профит, ₽',
            render: ({value}) => {
                if (value === undefined) return undefined;
                return <Text color={value < 0 ? 'danger' : 'primary'}>{value}</Text>;
            },
        },
        {
            name: 'rentabelnost',
            placeholder: 'Рентабельность, %',
            render: ({value}) => {
                if (value === undefined) return undefined;
                return (
                    <Text color={value < 0 ? 'danger' : 'primary'}>
                        {getRoundValue(value, 1, true)}
                    </Text>
                );
            },
        },
        {
            name: 'roi',
            placeholder: 'РОИ, %',
            render: ({value}) => {
                if (value === undefined) return undefined;
                return (
                    <Text color={value < 0 ? 'danger' : 'primary'}>
                        {getRoundValue(value, 1, true)}
                    </Text>
                );
            },
        },
        {name: 'primeCost', placeholder: 'Себестоимость, ₽'},
        {name: 'ad', placeholder: 'Реклама, ₽'},
        {name: 'comissionSum', placeholder: 'Комиссия, ₽'},
        {name: 'deliverySum', placeholder: 'Логистика, ₽'},
        {name: 'storageCostForArt', placeholder: 'Хранение, ₽'},
        {name: 'taxSum', placeholder: 'Налог, ₽'},
        {name: 'expences', placeholder: 'Доп. расходы, ₽'},
    ];

    const selectOptionsEntered = [
        {value: 'Розничная цена', content: 'Розничная цена'},
        {value: 'Цена с СПП', content: 'Цена с СПП'},
        {value: 'Цена с кошельком WB', content: 'Цена с кошельком WB'},
    ];
    const [selectValueEntered, setSelectValueEntered] = React.useState<string[]>([
        'Розничная цена',
    ]);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');
    const [enteredValueValid, setEnteredValueValid] = useState(false);

    const [updatePricesModalOpen, setUpdatePricesModalOpen] = useState(false);

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);
    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = useState(false);
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(dateRange, changedDoc, changedDocUpdateType, selectValue[0]);

    if (dateChangeRecalc) {
        setDateChangeRecalc(false);
        setCurrentPricesCalculatedBasedOn('');

        callApi('getPricesMM', {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: {
                lbd: dateRange[0].toISOString().slice(0, 10),
                rbd: dateRange[1].toISOString().slice(0, 10),
            },
        }).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['pricesData'][selectValue[0]] = resData['pricesData'][selectValue[0]];
            doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];

            setChangedDoc(doc);

            setDateChangeRecalc(false);
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
                rozPrice: undefined,
                sppPrice: undefined,
                wbWalletPrice: undefined,
                wbPrice: undefined,
                priceInfo: undefined,
                profit: 0,
                stock: undefined,
                rentabelnost: undefined,
                roi: undefined,
                primeCost: undefined,
                ad: 0,
                comissionSum: 0,
                deliverySum: 0,
                storageCostForArt: 0,
                taxSum: 0,
                expences: 0,
            };
            artInfo.art = artData['art'];
            artInfo.size = artData['size'];
            artInfo.object = artData['object'];
            artInfo.brand = artData['brand'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.imtId = artData['imtId'];
            artInfo.barcode = artData['barcode'];
            artInfo.rozPrice = artData['rozPrice'];
            artInfo.sppPrice = artData['sppPrice'];
            artInfo.wbWalletPrice = artData['wbWalletPrice'];
            artInfo.wbPrice = artData['wbPrice'];
            // artInfo.priceInfo = artData['priceInfo'];
            artInfo.profit = Math.round(artData['profit']);
            artInfo.stock = artData['stock'];
            artInfo.rentabelnost = artData['rentabelnost'];
            artInfo.roi = artData['roi'];
            artInfo.primeCost = artData['primeCost'];
            artInfo.ad = Math.round(artData['ad']);
            artInfo.comissionSum = Math.round(artData['comissionSum']);
            artInfo.deliverySum = Math.round(artData['deliverySum']);
            artInfo.storageCostForArt = artData['storageCostForArt'];
            artInfo.taxSum = Math.round(artData['taxSum']);
            artInfo.expences = Math.round(artData['expences']);

            temp[art] = artInfo;
        }

        setTableData(temp);

        filterTableData(withfFilters, temp);
    };

    const [filteredSummary, setFilteredSummary] = useState({});

    const filterTableData = (withfFilters = {}, tableData = {}) => {
        const temp = [] as any;

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
                if (filterArg == 'art') {
                    const rulesForAnd = filterData['val'].split('+');
                    // console.log(rulesForAnd);

                    let wholeText = '';
                    for (const key of [
                        'art',
                        'title',
                        'brand',
                        'nmId',
                        'imtId',
                        'object',
                        'size',
                        'barcode',
                    ]) {
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
        const paginatedDataTemp = temp.slice(0, 600);

        setFilteredSummary((row) => {
            const fstemp = row;
            fstemp['art'] = `На странице: ${paginatedDataTemp.length} Всего: ${temp.length}`;

            return fstemp;
        });

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
        for (const [campaignName, _] of Object.entries(doc.pricesData)) {
            campaignsNames.push({value: campaignName, content: campaignName});
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
                    <div
                        style={{
                            marginRight: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
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
                                        dateRange: {
                                            lbd: dateRange[0].toISOString().slice(0, 10),
                                            rbd: dateRange[1].toISOString().slice(0, 10),
                                        },
                                    }).then((res) => {
                                        if (!res) return;
                                        const resData = res['data'];
                                        doc['pricesData'][nextValue[0]] =
                                            resData['pricesData'][nextValue[0]];
                                        doc['artsData'][nextValue[0]] =
                                            resData['artsData'][nextValue[0]];

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
                        {switchingCampaignsFlag ? (
                            <Spin style={{marginLeft: 8, marginBottom: 8}} />
                        ) : (
                            <></>
                        )}
                    </div>
                    <div style={{marginBottom: 8, display: 'flex', flexDirection: 'row'}}>
                        <Button
                            // loading={fetchingDataFromServerFlag}
                            size="l"
                            view="action"
                            onClick={() => {
                                setDateChangeRecalc(true);
                            }}
                        >
                            <Icon data={ArrowsRotateLeft} />
                            <Text variant="subheader-1">Обновить</Text>
                        </Button>
                        <div style={{minWidth: 8}} />
                        <Button
                            // loading={fetchingDataFromServerFlag}
                            size="l"
                            view="action"
                            onClick={() => {
                                setEnteredValuesModalOpen(true);
                                setEnteredValue('');
                                setSelectedButton('');
                                setEnteredValueValid(false);
                            }}
                        >
                            <Icon data={Calculator} />
                            <Text variant="subheader-1">Рассчитать</Text>
                        </Button>
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
                                        placeholder={'Введите значение'}
                                        value={enteredValue}
                                        validationState={enteredValueValid ? undefined : 'invalid'}
                                        onUpdate={(val) => {
                                            const temp = parseInt(enteredValue);
                                            setEnteredValueValid(!isNaN(temp));
                                            setEnteredValue(val);
                                        }}
                                    />
                                    <div style={{minHeight: 4}} />
                                    {generateModalButtonWithActions(
                                        {
                                            disabled: !enteredValueValid,
                                            view: 'flat-action',
                                            icon: Calculator,
                                            placeholder: 'Рассчитать',
                                            onClick: () => {
                                                const params = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    dateRange: {
                                                        lbd: dateRange[0]
                                                            .toISOString()
                                                            .slice(0, 10),
                                                        rbd: dateRange[1]
                                                            .toISOString()
                                                            .slice(0, 10),
                                                    },
                                                    enteredValue: {},
                                                };

                                                const keys = {
                                                    'Розничная цена': 'rozPrice',
                                                    'Цена с СПП': 'sppPrice',
                                                    'Цена с кошельком WB': 'wbWalletPrice',
                                                };

                                                const key = keys[selectValueEntered[0]];
                                                params.enteredValue[key] = parseInt(enteredValue);
                                                setCurrentPricesCalculatedBasedOn(key);

                                                console.log(params);

                                                /////////////////////////
                                                callApi('getPricesMM', params).then((res) => {
                                                    if (!res) return;
                                                    const resData = res['data'];
                                                    doc['pricesData'][selectValue[0]] =
                                                        resData['pricesData'][selectValue[0]];
                                                    doc['artsData'][selectValue[0]] =
                                                        resData['artsData'][selectValue[0]];

                                                    setChangedDoc(doc);

                                                    console.log(doc);
                                                });

                                                setPagesCurrent(1);
                                                /////////////////////////

                                                setEnteredValuesModalOpen(false);
                                            },
                                        },
                                        selectedButton,
                                        setSelectedButton,
                                    )}
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
                            <Text variant="subheader-1">Обновить цены на WB</Text>
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

                                                const byNmId = {};
                                                for (let i = 0; i < filteredData.length; i++) {
                                                    const {nmId, wbPrice, primeCost} =
                                                        filteredData[i];
                                                    if (nmId && wbPrice && wbPrice > primeCost) {
                                                        byNmId[nmId] = {
                                                            nmID: nmId,
                                                            price: wbPrice,
                                                            discount: 50,
                                                        };
                                                    }
                                                }

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

                                                console.log(params);
                                                /////////////////////////
                                                callApi('updatePricesMM', params);
                                                /////////////////////////
                                                setDateChangeRecalc(true);
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
                    <Popup
                        open={datePickerOpen}
                        anchorRef={fieldRef}
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
                                            setDateChangeRecalc(true);
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
                                            setDateChangeRecalc(true);
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
                                            startOfWeek.setDate(
                                                today.getDate() - today.getDay() + 1,
                                            ); // Set to the first day of the current week (Sunday)

                                            const endOfWeek = new Date(today);
                                            endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the current week (Saturday)

                                            const range = [startOfWeek, endOfWeek];
                                            setDateRange(range);
                                            setDateChangeRecalc(true);
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
                                            setDateChangeRecalc(true);
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
                                            setDateChangeRecalc(true);
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
                                            setDateChangeRecalc(true);
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
                                            setDateChangeRecalc(true);
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
                                            setDateChangeRecalc(true);
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
                                            setDatePickerOpen(false);
                                            setDateChangeRecalc(true);
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
                                            thirtyOneDaysAgo.setDate(
                                                thirtyOneDaysAgo.getDate() - 30,
                                            );
                                            const range = [thirtyOneDaysAgo, yesterday];
                                            setDateRange(range);
                                            setDateChangeRecalc(true);
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
                                            ninetyOneDaysAgo.setDate(
                                                ninetyOneDaysAgo.getDate() - 90,
                                            );
                                            const range = [ninetyOneDaysAgo, yesterday];
                                            setDateRange(range);
                                            setDateChangeRecalc(true);
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
                                        setDateChangeRecalc(true);
                                    }}
                                />
                            </div>
                        </div>
                    </Popup>
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
                    pageSize={600}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 600, page * 600);
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