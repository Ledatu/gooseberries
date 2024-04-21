import React, {useEffect, useId, useState} from 'react';
import {
    Spin,
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
    Pagination,
    Popover,
    PopoverBehavior,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

const {ipAddress} = require('../ipAddress');

import block from 'bem-cn-lite';

import Userfront from '@userfront/toolkit';
const b = block('app');

import {FileArrowUp, FileArrowDown} from '@gravity-ui/icons';

import callApi from 'src/utilities/callApi';
import {getRoundValue} from 'src/utilities/getRoundValue';
import axios from 'axios';
import TheTable, {compare} from 'src/components/TheTable';

const getUid = () => {
    return [
        '4a1f2828-9a1e-4bbf-8e07-208ba676a806',
        '46431a09-85c3-4703-8246-d1b5c9e52594',
        'ce86aeb0-30b7-45ba-9234-a6765df7a479',
        // '1c5a0344-31ea-469e-945e-1dfc4b964ecd',
    ].includes(Userfront.user.userUuid ?? '')
        ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806'
        : '';
};

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            // doc['campaigns'][selectValue] = docum['campaigns'][selectValue];
            // doc['balances'][selectValue] = docum['balances'][selectValue];
            // doc['plusPhrasesTemplates'][selectValue] = docum['plusPhrasesTemplates'][selectValue];
            // doc['advertsPlusPhrasesTemplates'][selectValue] =
            //     docum['advertsPlusPhrasesTemplates'][selectValue];
            // doc['advertsBudgetsToKeep'][selectValue] = docum['advertsBudgetsToKeep'][selectValue];
            // doc['adverts'][selectValue] = docum['adverts'][selectValue];
            // doc['placementsAuctions'][selectValue] = docum['placementsAuctions'][selectValue];
            // doc['advertsSelectedPhrases'][selectValue] =
            //     docum['advertsSelectedPhrases'][selectValue];
            // doc['advertsSchedules'][selectValue] = docum['advertsSchedules'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getNomenclatures', {
            uid: getUid(),
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
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
        formData.append('uid', getUid());
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

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    const filterByButton = (val, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val) + ' ', compMode: compMode};
        setFilters(filters);
        filterTableData(filters);
    };
    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, row, footer, index}) => {
                const {title, brand, object, nmId, photos, imtId, size, barcode} = row;

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
                                {Math.floor((pagesCurrent - 1) * 600 + index + 1)}
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
                                            onClick={() => filterByButton(size)}
                                        >
                                            <Text variant="caption-2">{`Размер: ${size}`}</Text>
                                        </Button>
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(barcode)}
                                        >
                                            <Text variant="caption-2">{`Баркод: ${barcode}`}</Text>
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

    const doc = getUserDoc();

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = doc ? doc[selected == '' ? selectValue[0] : selected] : {};

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
                commision: 0,
                tax: 0,
                expences: 0,
                logistics: 0,
                photos: undefined,
                spp: 0,
                primeCost: 0,
            };
            artInfo.art = artData['art'];
            artInfo.size = artData['size'];
            artInfo.object = artData['object'];
            artInfo.brand = artData['brand'];
            artInfo.nmId = artData['nmId'];
            artInfo.title = artData['title'];
            artInfo.photos = artData['photos'];
            artInfo.imtId = artData['imtId'];
            artInfo.barcode = artData['barcode'];
            artInfo.commision = artData['commision'];
            artInfo.tax = artData['tax'];
            artInfo.expences = artData['expences'];
            artInfo.logistics = artData['logistics'];
            artInfo.spp = artData['spp'];
            artInfo.primeCost = artData['primeCost'];

            temp[art] = artInfo;
        }

        setTableData(temp);

        filterTableData(withfFilters, temp);
    };

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

        setFilteredData(temp);

        setPaginatedData(paginatedDataTemp);
        setPagesCurrent(1);
        setPagesTotal(Math.ceil(temp.length));
    };

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);

    const [firstRecalc, setFirstRecalc] = useState(false);
    if (!doc) return <Spin />;
    if (!firstRecalc) {
        const campaignsNames: object[] = [];
        for (const [campaignName, _] of Object.entries(doc)) {
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
                    <div>
                        <Button
                            view="action"
                            size="l"
                            style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                            onClick={() => {
                                setModalOpen(true);
                            }}
                        >
                            <Text variant="subheader-1">Оборачиваемость</Text>
                        </Button>
                        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                            {generateModalForm('prefObor', doc, selectValue[0], data)}
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
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

                        setPaginatedData(paginatedDataTemp);
                    }}
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
