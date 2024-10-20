import React, {ReactNode, useEffect, useId, useRef, useState} from 'react';
import {Spin, Icon, Button, Text, Modal, TextInput, Label, Link} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

const {ipAddress} = require('../ipAddress');

import {FileArrowUp, FileArrowDown, Pencil, CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import axios from 'axios';
import TheTable, {compare} from 'src/components/TheTable';
import {generateModalButtonWithActions} from './MassAdvertPage';
import {getRoundValue, renderAsPercent} from 'src/utilities/getRoundValue';
import {useUser} from 'src/components/RequireAuth';
import {NomenclaturesPageEditParameter} from 'src/components/NomenclaturesPageEditParameter';
import {useCampaign} from 'src/contexts/CampaignContext';
import {TagsFilterModal} from 'src/components/TagsFilterModal';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const {userInfo} = useUser();
    const {campaigns} = userInfo ?? {};
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
        callApi(
            'getNomenclatures',
            {
                uid: getUid(),
                campaignName: selectValue != '' ? selectValue : campaigns[0]?.name,
            },
            true,
        )
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const NomenclaturesPage = () => {
    const {selectValue, setSwitchingCampaignsFlag} = useCampaign();
    const uploadId = useId();
    const [uploadProgress, setUploadProgress] = useState(0);

    const [filters, setFilters] = useState({undef: false});

    const [selectedButton, setSelectedButton] = useState('');

    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const filterByClick = (val, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const updateInfo = () => {
        callApi(
            'getNomenclatures',
            {
                uid: getUid(),
                campaignName: selectValue[0],
            },
            true,
        ).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['nomenclatures'][selectValue[0]] = resData['nomenclatures'][selectValue[0]];
            doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];

            setChangedDoc({...doc});

            console.log(doc);
        });
    };

    const [update, setUpdate] = useState(false);
    useEffect(() => {
        if (!update) return;
        updateInfo();
        setUpdate(false);
    }, [update]);

    const renderFilterByClickButton = ({value}, key) => {
        return (
            <Button
                size="xs"
                view="flat"
                onClick={() => {
                    filterByClick(value, key);
                }}
            >
                {value}
            </Button>
        );
    };

    const generateEditButton = (key, onClick = undefined as any) => {
        const triggerButton = (
            <Button
                style={{marginLeft: 5}}
                view="outlined"
                onClick={(event) => {
                    if (onClick) onClick(event);
                    else {
                        event.stopPropagation();
                        setSelectedButton('');
                    }
                }}
            >
                <Icon data={Pencil} />
            </Button>
        );
        return onClick ? (
            triggerButton
        ) : (
            <NomenclaturesPageEditParameter
                setUpdate={setUpdate}
                selectValue={selectValue}
                filteredData={filteredData}
                enteredValueKey={key}
            >
                {triggerButton}
            </NomenclaturesPageEditParameter>
        );
    };

    const columnData = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index, row}) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;
                const {nmId} = row;
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
                );
            },
            valueType: 'text',
            group: true,
        },
        {
            name: 'size',
            placeholder: 'Размер',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'size'),
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
        {
            name: 'barcode',
            placeholder: 'Баркод',
            valueType: 'text',
            render: (args) => renderFilterByClickButton(args, 'barcode'),
        },
        {
            name: 'volume',
            placeholder: 'Объём, л.',
        },
        {
            name: 'tags',
            placeholder: 'Теги',
            valueType: 'text',
            render: ({value}) => {
                if (value === undefined) return;
                const tags = [] as ReactNode[];
                for (const tag of value) {
                    if (tag === undefined) continue;

                    //     <Label
                    //     style={{margin: '0 4px'}}
                    //     size="xs"
                    //     pin="circle-circle"
                    //     selected
                    //     view="outlined-info"
                    // >
                    //     {tag.toUpperCase()}
                    // </Label>,

                    tags.push(
                        <div style={{margin: '0 4px'}}>
                            <Label size="xs" theme="info" type="copy" copyText={tag.toUpperCase()}>
                                {tag.toUpperCase()}
                            </Label>
                        </div>,
                    );
                }
                return <div style={{display: 'flex', flexDirection: 'row'}}>{tags}</div>;
            },
            additionalNodes: [
                generateEditButton('tags', () => {
                    setTagsModalFormOpen(true);
                    setSelectedButton('');
                }),
            ],
        },
        {
            name: 'factoryArt',
            placeholder: 'Артикул фабрики',
            valueType: 'text',
            additionalNodes: [generateEditButton('factoryArt')],
        },
        {
            name: 'myStocks',
            placeholder: 'Мои остатки, шт.',
            additionalNodes: [generateEditButton('myStocks')],
        },
        {
            name: 'multiplicity',
            placeholder: 'Кратность короба, шт.',
            additionalNodes: [generateEditButton('multiplicity')],
        },
        {name: 'weight', placeholder: 'Вес, кг.', additionalNodes: [generateEditButton('weight')]},
        {
            name: 'ktr',
            placeholder: 'КТР WB',
            additionalNodes: [generateEditButton('ktr')],
        },
        {
            name: 'commision',
            placeholder: 'Коммисия WB, %',
            additionalNodes: [generateEditButton('commision')],
            render: renderAsPercent,
        },
        {
            name: 'tax',
            placeholder: 'Ставка налога, %',
            additionalNodes: [generateEditButton('tax')],
            render: renderAsPercent,
        },
        {
            name: 'expences',
            placeholder: 'Доп. расходы, %',
            additionalNodes: [generateEditButton('expences')],
            render: renderAsPercent,
        },
        {
            name: 'prefObor',
            placeholder: 'План. оборачиваемость, д.',
            additionalNodes: [generateEditButton('prefObor')],
        },
        {
            name: 'minStocks',
            placeholder: 'Мин. остаток, шт.',
            additionalNodes: [generateEditButton('minStocks')],
        },
        {
            name: 'primeCost1',
            placeholder: 'Себестоимость 1, ₽',
            additionalNodes: [generateEditButton('primeCost1')],
        },
        {
            name: 'primeCost2',
            placeholder: 'Себестоимость 2, ₽',
            additionalNodes: [generateEditButton('primeCost2')],
        },
        {
            name: 'primeCost3',
            placeholder: 'Себестоимость 3, ₽',
            additionalNodes: [generateEditButton('primeCost3')],
        },
    ];

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const filterByButton = (val, key = 'tags', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    useEffect(() => {
        setSwitchingCampaignsFlag(true);

        if (doc)
            if (!Object.keys(doc['nomenclatures'][selectValue[0]]).length) {
                callApi(
                    'getNomenclatures',
                    {
                        uid: getUid(),
                        campaignName: selectValue,
                    },
                    true,
                ).then((res) => {
                    if (!res) return;
                    const resData = res['data'];
                    doc['nomenclatures'][selectValue[0]] = resData['nomenclatures'][selectValue[0]];
                    doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];

                    setChangedDoc({...doc});

                    setSwitchingCampaignsFlag(false);
                    console.log(doc);
                });
            } else {
                setSwitchingCampaignsFlag(false);
            }
        setSwitchingCampaignsFlag(false);

        recalc(selectValue[0], filters);
        setPagesCurrent(1);
    }, [selectValue]);

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
        formData.append('uid', getUid());
        formData.append('campaignName', selectValue[0]);
        formData.append('file', file);

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

                callApi(
                    'getNomenclatures',
                    {
                        uid: getUid(),
                        campaignName: selectValue[0],
                    },
                    true,
                ).then((res) => {
                    if (!res) return;
                    const resData = res['data'];
                    doc['nomenclatures'][selectValue[0]] = resData['nomenclatures'][selectValue[0]];
                    doc['artsData'][selectValue[0]] = resData['artsData'][selectValue[0]];
                    setChangedDoc({...doc});
                    console.log(doc);
                });
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
                tags: [] as any[],
                barcode: 0,
                commision: undefined,
                tax: undefined,
                expences: undefined,
                prefObor: undefined,
                minStocks: 0,
                logistics: 0,
                photos: undefined,
                spp: 0,
                prices: 0,
                factoryArt: undefined,
                myStocks: 0,
                multiplicity: undefined,
                volume: 0,
                ktr: undefined,
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
            artInfo.volume = getRoundValue(artData['volume'], 1, true) / 100;

            // artInfo.tags = ['#бестселлер'];
            artInfo.tags = artData['tags'];

            artInfo.ktr = artDataUploaded['ktr'];
            artInfo.prices = artDataUploaded['prices'];
            artInfo.factoryArt = artDataUploaded['factoryArt'];
            artInfo.myStocks = artDataUploaded['myStocks'];
            artInfo.multiplicity = artDataUploaded['multiplicity'];
            artInfo.weight = artDataUploaded['weight'];
            artInfo.commision = artDataUploaded['commision'];
            artInfo.tax = artDataUploaded['tax'];
            artInfo.expences = artDataUploaded['expences'];
            artInfo.prefObor = artDataUploaded['prefObor'];
            artInfo.minStocks = artDataUploaded['minStocks'];
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

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (filterArg == 'tags') {
                    let wholeText = '';
                    if (flarg)
                        for (const key of flarg) {
                            wholeText += key + ' ';
                        }

                    if (!compare(wholeText, filterData)) {
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

        setFilteredData(temp);
        setPagesCurrent(1);
    };

    const [tagsModalFormOpen, setTagsModalFormOpen] = useState(false);
    const [tagsInputValid, setTagsInputValid] = useState(true);
    const tagsInputRef = useRef<HTMLInputElement>(null);

    const [firstRecalc, setFirstRecalc] = useState(false);

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc();
        setSwitchingCampaignsFlag(false);
    }

    if (!doc) return <Spin />;
    if (!firstRecalc) {
        console.log(doc);
        recalc(selectValue[0]);
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
                            marginBottom: 8,
                            marginRight: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TagsFilterModal filterByButton={filterByButton} />
                        <Modal open={tagsModalFormOpen} onClose={() => setTagsModalFormOpen(false)}>
                            <div
                                style={{
                                    padding: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '30em',
                                    alignItems: 'center',
                                }}
                            >
                                <Text variant="display-1">Назначить / Удалить тег</Text>
                                <div style={{minHeight: 8}} />
                                <TextInput
                                    controlRef={tagsInputRef}
                                    defaultValue=""
                                    validationState={tagsInputValid ? undefined : 'invalid'}
                                    errorMessage={
                                        'Имя тега должно начинаться с #, содержать как минимум одну букву и не иметь пробелов.'
                                    }
                                    onUpdate={() => {
                                        setTagsInputValid(true);
                                    }}
                                />
                                <div style={{minHeight: 8}} />
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Назначить тег',
                                        icon: CloudArrowUpIn,
                                        view: 'outlined-success',
                                        onClick: () => {
                                            if (tagsInputRef.current !== null) {
                                                const tagUnformatted = tagsInputRef.current.value;

                                                const tag =
                                                    '#' +
                                                    tagUnformatted.replace(/#/g, '').toUpperCase();

                                                if (
                                                    tag[0] != '#' ||
                                                    tag.indexOf(' ') !== -1 ||
                                                    tag.length < 2
                                                ) {
                                                    setTagsInputValid(false);
                                                    setSelectedButton('');
                                                    return;
                                                }

                                                const params = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    data: {
                                                        nmIds: [] as number[],
                                                        mode: 'Установить',
                                                        tag: tag,
                                                    },
                                                };

                                                for (const row of filteredData) {
                                                    const {art, size, nmId} = row ?? {};
                                                    if (nmId === undefined) continue;
                                                    if (!params.data.nmIds.includes(nmId))
                                                        params.data.nmIds.push(nmId);

                                                    const aurumArt =
                                                        art + (size == '0' ? '' : `_${size}`);
                                                    if (
                                                        !doc.nomenclatures[selectValue[0]][aurumArt]
                                                    )
                                                        continue;
                                                    if (
                                                        !doc.nomenclatures[selectValue[0]][
                                                            aurumArt
                                                        ].tags.includes(tag)
                                                    )
                                                        doc.nomenclatures[selectValue[0]][
                                                            aurumArt
                                                        ].tags.push(tag);
                                                }

                                                setChangedDoc({...doc});

                                                callApi('setTags', params);

                                                setTagsModalFormOpen(false);
                                            }
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                                {generateModalButtonWithActions(
                                    {
                                        placeholder: 'Удалить тег',
                                        icon: TrashBin,
                                        view: 'outlined-danger',
                                        onClick: () => {
                                            if (tagsInputRef.current !== null) {
                                                const tagUnformatted = tagsInputRef.current.value;

                                                const tag =
                                                    '#' +
                                                    tagUnformatted.replace(/#/g, '').toUpperCase();

                                                if (
                                                    tag[0] != '#' ||
                                                    tag.indexOf(' ') !== -1 ||
                                                    tag.length < 2
                                                ) {
                                                    setTagsInputValid(false);
                                                    setSelectedButton('');
                                                    return;
                                                }

                                                const params = {
                                                    uid: getUid(),
                                                    campaignName: selectValue[0],
                                                    data: {
                                                        nmIds: [] as number[],
                                                        mode: 'Удалить',
                                                        tag: tag,
                                                    },
                                                };

                                                for (const row of filteredData) {
                                                    const {art, size, nmId} = row ?? {};
                                                    if (nmId === undefined) continue;
                                                    if (!params.data.nmIds.includes(nmId))
                                                        params.data.nmIds.push(nmId);

                                                    const aurumArt =
                                                        art + (size == '0' ? '' : `_${size}`);
                                                    if (
                                                        !doc.nomenclatures[selectValue[0]][aurumArt]
                                                    )
                                                        continue;

                                                    doc.nomenclatures[selectValue[0]][
                                                        aurumArt
                                                    ].tags = doc.nomenclatures[selectValue[0]][
                                                        aurumArt
                                                    ].tags.filter((val) => val != tag);
                                                }

                                                setChangedDoc({...doc});

                                                callApi('setTags', params);

                                                setTagsModalFormOpen(false);
                                            }
                                        },
                                    },
                                    selectedButton,
                                    setSelectedButton,
                                )}
                            </div>
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
                    <div style={{marginRight: 4}}>
                        <Button
                            size="l"
                            view={'outlined-warning'}
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
                                        element.download = `Информация о товарах ${selectValue[0]}.xlsx`;
                                        // simulate link click
                                        document.body.appendChild(element);
                                        element.click();
                                    });
                            }}
                        >
                            <Icon data={FileArrowDown} size={20} />
                            <Text variant="subheader-1">Скачать</Text>
                        </Button>
                    </div>
                    <div>
                        <div style={{marginLeft: 4}}>
                            <label htmlFor={uploadId}>
                                <Button
                                    size="l"
                                    onClick={() => {
                                        setUploadProgress(0);
                                        (
                                            document.getElementById(uploadId) as HTMLInputElement
                                        ).value = '';
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
                                            : 'outlined-success'
                                    }
                                >
                                    <Icon data={FileArrowUp} size={20} />
                                    <Text variant="subheader-1">Загрузить</Text>

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

            <TheTable
                columnData={columnData}
                data={filteredData}
                filters={filters}
                setFilters={setFilters}
                filterData={filterTableData}
                footerData={[filteredSummary]}
                tableId={'nomenclatures'}
                usePagination={true}
                defaultPaginationSize={300}
                onPaginationUpdate={({page, paginatedData}) => {
                    setPagesCurrent(page);
                    setFilteredSummary((row) => {
                        const fstemp = row;
                        fstemp[
                            'art'
                        ] = `На странице: ${paginatedData.length} Всего: ${filteredData.length}`;

                        return fstemp;
                    });
                }}
                height={'calc(100vh - 10em - 60px)'}
            />
        </div>
    );
};
