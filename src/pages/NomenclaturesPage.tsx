import React, {useEffect, useId, useState} from 'react';
import {Spin, Select, SelectOption, Icon, Button, Text, Pagination} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

const {ipAddress} = require('../ipAddress');

import block from 'bem-cn-lite';

const b = block('app');

import {FileArrowUp, FileArrowDown, ChevronDown, Key} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import axios from 'axios';
import TheTable, {compare} from 'src/components/TheTable';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['nomenclatures'][selectValue] = docum['nomenclatures'][selectValue];
            doc['artsData'][selectValue] = docum['artsData'][selectValue];
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

    const [filters, setFilters] = useState({undef: false});

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

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
        {name: 'factoryArt', placeholder: 'Артикул фабрики', valueType: 'text'},
        {name: 'multiplicity', placeholder: 'Кратность короба, шт.'},
        {name: 'length', placeholder: 'Длина, см.'},
        {name: 'width', placeholder: 'Ширина, см.'},
        {name: 'height', placeholder: 'Высота, см.'},
        {name: 'ktr', placeholder: 'KTR WB, %'},
        {name: 'weight', placeholder: 'Вес, кг.'},
        {name: 'commision', placeholder: 'Коммисия WB, %'},
        {name: 'tax', placeholder: 'Ставка налога, %'},
        {name: 'expences', placeholder: 'Дополнительные расходы, ₽'},
        {name: 'primeCost1', placeholder: 'Себестоимость 1, ₽'},
        {name: 'primeCost2', placeholder: 'Себестоимость 2, ₽'},
        {name: 'primeCost3', placeholder: 'Себестоимость 3, ₽'},
    ];

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);
    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = useState(false);
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(changedDoc, changedDocUpdateType, selectValue[0]);

    function handleChange(event) {
        const file = event.target.files[0];
        if (!file || !file.name.includes('.xlsx')) {
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
                const artsData = response.data;
                doc.artsData[selectValue[0]] = artsData;
                setChangedDoc(doc);
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
            });
    }

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = doc
            ? doc.nomenclatures[selected == '' ? selectValue[0] : selected]
            : {};
        const campaignDataUploaded = doc
            ? doc.artsData[selected == '' ? selectValue[0] : selected]
            : {};

        const temp = {};
        for (const [art, artData] of Object.entries(campaignData)) {
            if (!art || !artData) continue;

            const artDataUploaded = campaignDataUploaded[art] ?? {};

            const artInfo = {
                art: '',
                size: 0,
                object: '',
                brand: '',
                title: '',
                imtId: '',
                nmId: 0,
                barcode: 0,
                commision: undefined,
                tax: undefined,
                expences: undefined,
                logistics: 0,
                photos: undefined,
                spp: 0,
                prices: 0,
                factoryArt: undefined,
                multiplicity: undefined,
                length: undefined,
                width: undefined,
                height: undefined,
                weight: undefined,
                primeCost1: undefined,
                primeCost2: undefined,
                primeCost3: undefined,
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
            artInfo.prices = artDataUploaded['prices'];
            artInfo.factoryArt = artDataUploaded['factoryArt'];
            artInfo.multiplicity = artDataUploaded['multiplicity'];
            artInfo.length = artDataUploaded['length'];
            artInfo.width = artDataUploaded['width'];
            artInfo.height = artDataUploaded['height'];
            artInfo.weight = artDataUploaded['weight'];
            artInfo.commision = artDataUploaded['commision'];
            artInfo.tax = artDataUploaded['tax'];
            artInfo.expences = artDataUploaded['expences'];
            artInfo.primeCost1 = artDataUploaded['prices']
                ? artDataUploaded['prices']['Себестоимость 1']
                : undefined;
            artInfo.primeCost2 = artDataUploaded['prices']
                ? artDataUploaded['prices']['Себестоимость 2']
                : undefined;
            artInfo.primeCost3 = artDataUploaded['prices']
                ? artDataUploaded['prices']['Себестоимость 3']
                : undefined;

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
        for (const [campaignName, _] of Object.entries(doc.nomenclatures)) {
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

                                if (!Object.keys(doc['nomenclatures'][nextValue[0]]).length) {
                                    callApi('getNomenclatures', {
                                        uid: getUid(),
                                        campaignName: nextValue,
                                    }).then((res) => {
                                        if (!res) return;
                                        const resData = res['data'];
                                        doc['nomenclatures'][nextValue[0]] =
                                            resData['nomenclatures'][nextValue[0]];
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
                        <Button
                            size="l"
                            view={'outlined'}
                            onClick={() => {
                                setUploadProgress(0);
                                callApi('downloadPricesTemplate', {
                                    uid: getUid(),
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
                            <Icon data={FileArrowDown} size={20} />
                            Скачать
                        </Button>
                    </div>
                    <div>
                        <div style={{marginLeft: 4}}>
                            <label htmlFor={uploadId}>
                                <Button
                                    size="l"
                                    onClick={() => {
                                        setUploadProgress(0);
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                    selected={uploadProgress === 100 || uploadProgress === -1}
                                    view={
                                        uploadProgress === 100
                                            ? 'flat-success'
                                            : uploadProgress === -1
                                            ? 'flat-danger'
                                            : 'outlined'
                                    }
                                >
                                    <Icon data={FileArrowUp} size={20} />
                                    Загрузить
                                    <input
                                        id={uploadId}
                                        style={{
                                            opacity: 0,
                                            position: 'absolute',
                                            height: 40,
                                            left: 0,
                                        }}
                                        type="file"
                                        onChange={handleChange}
                                    />
                                </Button>
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
