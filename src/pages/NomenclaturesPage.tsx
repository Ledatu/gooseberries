import React, {useEffect, useId, useState} from 'react';
import {
    Spin,
    DropdownMenu,
    Select,
    SelectOption,
    TextInput,
    Link,
    Icon,
    Button,
    Modal,
    Text,
    Card,
    Label,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

const {ipAddress} = require('../ipAddress');

import block from 'bem-cn-lite';

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
    FileArrowUp,
    FileArrowDown,
} from '@gravity-ui/icons';
import useWindowDimensions from 'src/hooks/useWindowDimensions';

import callApi from 'src/utilities/callApi';
import {getRoundValue} from 'src/utilities/getRoundValue';
import axios from 'axios';

const getUserDoc = () => {
    const [documentData, setDocument] = useState<any>();
    useEffect(() => {
        callApi('getNomenclatures', {
            uid:
                (Userfront.user.userUuid == '4a1f2828-9a1e-4bbf-8e07-208ba676a806' ||
                Userfront.user.userUuid == '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                    ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
                    : '') ?? '',
        })
            .then((res: any) => setDocument(res.data))
            .catch((error) => console.error(error));
    }, []);
    return documentData;
};

export const NomenclaturesPage = () => {
    const uploadId = useId();

    const [uploadProgress, setUploadProgress] = useState(0);

    function handleChange(event) {
        const file = event.target.files[0];
        if (file.name != 'pricesTemplate.xlsx') {
            setUploadProgress(-1);
            return;
        }
        event.preventDefault();
        const url = `${ipAddress}/api/uploadFile`;
        const formData = new FormData();
        if (!file) return;
        formData.append('file', file);
        formData.append(
            'uid',
            (Userfront.user.userUuid == '4a1f2828-9a1e-4bbf-8e07-208ba676a806' ||
            Userfront.user.userUuid == '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
                : '') ?? '',
        );
        formData.append('campaignName', selectValue[0]);

        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
            },
            onUploadProgress: function (progressEvent) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress(percentCompleted);
            },
        };

        axios
            .post(url, formData, config)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
            });
    }

    const [filters, setFilters] = useState({undef: false});

    const [modalOpen, setModalOpen] = useState(false);

    const [data, setTableData] = useState<any[]>([]);
    const generateColumns = (columnsInfo) => {
        const columns: Column<any>[] = [];
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
                                    recalc('', filters);
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
                                                        recalc('', filters);
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
                                                        recalc('', filters);
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
                                                        recalc('', filters);
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
                                                        recalc('', filters);
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
                                                              recalc('', filters);
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
                                                              recalc('', filters);
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
                          return typeof value === 'number' && valueType != 'text'
                              ? new Intl.NumberFormat('ru-RU').format(value)
                              : value;
                      },
            });
        }

        return columns;
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
        {name: 'size', placeholder: 'Размер', valueType: 'text'},
        {name: 'object', placeholder: 'Предмет', valueType: 'text'},
        {name: 'brand', placeholder: 'Бренд', valueType: 'text'},
        {name: 'nmId', placeholder: 'Артикул ВБ', valueType: 'text'},
        {name: 'barcode', placeholder: 'Штрихкод', valueType: 'text'},
        {name: 'factoryArt', placeholder: 'Фабричный артикул', valueType: 'text'},
        {name: 'prices', placeholder: 'Цены', valueType: 'text'},
        {name: 'commision', placeholder: 'Коммисия'},
        {name: 'tax', placeholder: 'Ставка налога'},
        {name: 'expences', placeholder: 'Дополнительные расходы'},
        {
            name: 'prefObor',
            placeholder: 'Оборачиваемость',
            render: ({value}) => {
                if (!value) return;

                const avg = {count: 0, sum: 0};
                for (const [_warehouseName, warehouseData] of Object.entries(value)) {
                    if (!warehouseData) continue;
                    avg.count++;
                    avg.sum += warehouseData as number;
                }
                const val = getRoundValue(avg.sum, avg.count);
                return val;
            },
        },
        {name: 'logistics', placeholder: 'Логистика ВБ'},
        {name: 'spp', placeholder: 'СПП'},
        {name: 'primeCost', placeholder: 'Себестоимость'},
    ];
    const columns = generateColumns(columnData);

    // const [filteredSummary, setFilteredSummary] = useState({
    //     art: '',
    //     views: 0,
    //     clicks: 0,
    //     sum: 0,
    //     ctr: 0,
    //     drr: 0,
    //     orders: 0,
    //     sum_orders: 0,
    //     adverts: null,
    //     semantics: null,
    // });

    const documentData = getUserDoc();

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = documentData
            ? documentData[selected == '' ? selectValue[0] : selected]
            : {};

        const temp: any[] = [];
        for (const [art, artData] of Object.entries(campaignData)) {
            if (!art || !artData) continue;
            const artInfo = {
                art: '',
                size: 0,
                object: '',
                brand: '',
                nmId: 0,
                barcode: 0,
                commision: 0,
                tax: 0,
                expences: 0,
                logistics: 0,
                spp: 0,
                primeCost: 0,
            };
            artInfo.art = artData['art'];
            artInfo.size = artData['size'];
            artInfo.object = artData['object'];
            artInfo.brand = artData['brand'];
            artInfo.nmId = artData['nmId'];
            artInfo.barcode = artData['barcode'];
            artInfo.commision = artData['commision'];
            artInfo.tax = artData['tax'];
            artInfo.expences = artData['expences'];
            artInfo.logistics = artData['logistics'];
            artInfo.spp = artData['spp'];
            artInfo.primeCost = artData['primeCost'];

            if (artData['byWarehouses']) {
                for (const [warehouseName, warehouseData] of Object.entries(
                    artData['byWarehouses'],
                )) {
                    if (!warehouseName || !warehouseData) continue;
                    for (const [key, value] of Object.entries(warehouseData)) {
                        if (!(key in artInfo)) artInfo[key] = {};
                        if (!(warehouseName in artInfo[key])) artInfo[key][warehouseName] = value;
                    }
                }
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

        // console.log(temp);
        // const filteredSummaryTemp = {
        //     art: `Показано артикулов: ${temp.length}`,
        //     orders: 0,
        //     sum_orders: 0,
        //     sum: 0,
        //     views: 0,
        //     clicks: 0,
        //     drr: 0,
        //     ctr: 0,
        //     cpc: 0,
        //     cpm: 0,
        //     cr: 0,
        //     cpo: 0,
        //     adverts: null,
        //     semantics: null,
        //     budget: 0,
        //     budgetToKeep: 0,
        // };
        // for (let i = 0; i < temp.length; i++) {
        //     const row = temp[i];
        //     filteredSummaryTemp.sum_orders += row['sum_orders'];
        //     filteredSummaryTemp.orders += row['orders'];
        //     filteredSummaryTemp.sum += row['sum'];
        //     filteredSummaryTemp.views += row['views'];
        //     filteredSummaryTemp.clicks += row['clicks'];
        //     filteredSummaryTemp.budget += row['budget'] ?? 0;
        //     filteredSummaryTemp.budgetToKeep += row['budgetToKeep'] ?? 0;
        // }
        // filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        // filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        // filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        // filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        // filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
        // filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
        // filteredSummaryTemp.budgetToKeep = Math.round(filteredSummaryTemp.budgetToKeep);

        // filteredSummaryTemp.drr = getRoundValue(
        //     filteredSummaryTemp.sum,
        //     filteredSummaryTemp.sum_orders,
        //     true,
        //     1,
        // );
        // filteredSummaryTemp.ctr = getRoundValue(
        //     filteredSummaryTemp.clicks,
        //     filteredSummaryTemp.views,
        //     true,
        // );
        // filteredSummaryTemp.cpc = getRoundValue(
        //     filteredSummaryTemp.sum,
        //     filteredSummaryTemp.clicks,
        // );
        // filteredSummaryTemp.cpm = getRoundValue(
        //     filteredSummaryTemp.sum * 1000,
        //     filteredSummaryTemp.views,
        // );
        // filteredSummaryTemp.cr = getRoundValue(
        //     filteredSummaryTemp.orders,
        //     filteredSummaryTemp.views,
        //     true,
        // );
        // filteredSummaryTemp.cpo = getRoundValue(
        //     filteredSummaryTemp.sum,
        //     filteredSummaryTemp.orders,
        //     false,
        //     filteredSummaryTemp.sum,
        // );
        // setFilteredSummary(filteredSummaryTemp);
        // if (!temp.length) temp.push({});
        temp.sort((a, b) => a.art.localeCompare(b.art));
        setTableData(temp);
    };

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

    const [firstRecalc, setFirstRecalc] = useState(false);
    if (!documentData) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(documentData)) {
            campaignsNames.push({value: campaignName, content: campaignName});
        }
        setSelectOptions(campaignsNames as SelectOption<any>[]);
        const selected = campaignsNames[0]['value'];
        setSelectValue([selected]);
        console.log(documentData);

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
                    <div>
                        <Button
                            style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                            view="outlined"
                            onClick={() => {
                                setModalOpen(true);
                            }}
                        >
                            Оборачиваемость
                        </Button>
                        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                            {generateModalForm('prefObor', documentData, selectValue[0], data)}
                        </Modal>
                    </div>
                    <Select
                        className={b('selectCampaign')}
                        value={selectValue}
                        placeholder="Values"
                        options={selectOptions}
                        onUpdate={(nextValue) => {
                            setSelectValue(nextValue);
                            recalc(nextValue[0]);
                        }}
                    />
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
                    <div style={{marginRight: 4}}>
                        <Label
                            size="m"
                            icon={<Icon data={FileArrowDown} size={20} />}
                            theme={'clear'}
                            onClick={() => {
                                setUploadProgress(0);
                                callApi('downloadPricesTemplate', {
                                    uid:
                                        (Userfront.user.userUuid ==
                                            '4a1f2828-9a1e-4bbf-8e07-208ba676a806' ||
                                        Userfront.user.userUuid ==
                                            '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                            ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
                                            : '') ?? '',
                                    campaignName: selectValue[0],
                                })
                                    .then((res: any) => {
                                        return res.data;
                                    })
                                    .then((blob) => {
                                        const element = document.createElement('a');
                                        element.href = URL.createObjectURL(blob);
                                        element.download = 'pricesTemplate.xlsx';
                                        // simulate link click
                                        document.body.appendChild(element);
                                        element.click();
                                    });
                            }}
                        >
                            Скачать
                        </Label>
                    </div>
                    <div>
                        <div style={{marginLeft: 4}}>
                            <label htmlFor={uploadId}>
                                <Label
                                    size="m"
                                    icon={<Icon data={FileArrowUp} size={20} />}
                                    onClick={() => {
                                        setUploadProgress(0);
                                    }}
                                    theme={
                                        uploadProgress === 100
                                            ? 'success'
                                            : uploadProgress === -1
                                            ? 'danger'
                                            : 'clear'
                                    }
                                >
                                    Загрузить
                                </Label>

                                <input
                                    id={uploadId}
                                    style={{width: 0}}
                                    type="file"
                                    onChange={handleChange}
                                ></input>
                            </label>
                        </div>
                        {/* {uploadProgress ? (
                            <Progress value={uploadProgress} size="xs" theme="success" />
                        ) : (
                            <></>
                        )} */}
                    </div>
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    maxHeight: '80vh',
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
                    data={data}
                    columns={columns}
                    // footerData={[filteredSummary]}
                    footerData={[{}]}
                />
            </div>
        </div>
    );
};

const generatePrefOborModalForm = (documentData, selectedCampaign, tableData) => {
    if (!documentData || !tableData || !selectedCampaign) return <></>;
    const getAllWarehouses = () => {
        for (const [art, artData] of Object.entries(documentData[selectedCampaign])) {
            if (!art || !artData) continue;
            const warehouses = artData['byWarehouses'];
            if (!warehouses) continue;
            return warehouses;
        }
        return {};
    };
    const warehouses = getAllWarehouses();
    warehouses['Все склады'] = {};
    if (!warehouses) return <></>;

    const warehousesInputs: any[] = [];
    for (const [warehouseName, _] of Object.entries(warehouses)) {
        warehouses[warehouseName] = {val: 30};
        warehousesInputs.push({
            val: warehouseName,
            elem: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 8,
                    }}
                >
                    <Card
                        view="clear"
                        style={{
                            width: '80%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '4px 16px',
                        }}
                    >
                        <div style={{margin: 4}}>
                            <Text variant="subheader-1">{warehouseName}</Text>
                        </div>
                        <TextInput
                            type="number"
                            defaultValue={warehouses[warehouseName].val}
                            style={{margin: 0, width: 80}}
                            hasClear
                            onUpdate={(value) => {
                                if (warehouseName === 'Все склады') {
                                    for (const [innerWarehouseName, _] of Object.entries(
                                        warehouses,
                                    )) {
                                        warehouses[innerWarehouseName].val = Number(value);
                                    }
                                } else {
                                    warehouses[warehouseName].val = Number(value);
                                }
                                return;
                            }}
                        />
                    </Card>
                    <Card style={{height: 0.5, width: '80%'}}>
                        <></>
                    </Card>
                </div>
            ),
        });
    }

    warehousesInputs.reverse();
    const allWarehouses = warehousesInputs.shift();
    warehousesInputs.sort((a, b) => a.val.localeCompare(b.val));
    const form = [allWarehouses].concat(warehousesInputs);
    const formElems: any[] = [];
    for (let i = 0; i < form.length; i++) {
        const {elem} = form[i];
        formElems.push(elem);
    }

    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '60vh',
                // padding: 40,
            }}
        >
            <Text
                style={{
                    margin: '8px 0',
                }}
                variant="display-2"
            >
                Оборачиваемость
            </Text>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                }}
            >
                {formElems}
            </div>
            <Button
                size="l"
                pin="circle-circle"
                view="action"
                style={{margin: 16}}
                onClick={() => {
                    // console.log(warehouses);
                    const data = {values: warehouses, key: 'prefObor', barcodes: [] as any[]};
                    for (let i = 0; i < tableData.length; i++) {
                        const row = tableData[i];

                        if (!row) continue;

                        data.barcodes.push(row['barcode']);
                    }
                    console.log(data);

                    callApi('setByWarehousesInfo', {
                        uid:
                            (Userfront.user.userUuid == '4a1f2828-9a1e-4bbf-8e07-208ba676a806' ||
                            Userfront.user.userUuid == '0e1fc05a-deda-4e90-88d5-be5f8e13ce6a'
                                ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
                                : '') ?? '',
                        campaignName: selectedCampaign,
                        data: data,
                    });
                }}
            >
                Установить
            </Button>
        </div>
    );
};

const generateModalForm = (mode, documentData, selectedCampaign, tableData) => {
    if (mode == 'prefObor')
        return generatePrefOborModalForm(documentData, selectedCampaign, tableData);
    return <></>;
};
