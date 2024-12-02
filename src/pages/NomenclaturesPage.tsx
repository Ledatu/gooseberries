import React, {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {Spin, Icon, Button, Text, Modal, TextInput, Link, Card, Loader} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';
import {Pencil, CloudArrowUpIn, TrashBin, ArrowsRotateLeft} from '@gravity-ui/icons';
import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare} from 'src/components/TheTable';
import {generateModalButtonWithActions} from './MassAdvertPage';
import {getRoundValue, renderAsPercent} from 'src/utilities/getRoundValue';
import {NomenclaturesPageEditParameter} from 'src/components/NomenclaturesPageEditParameter';
import {useCampaign} from 'src/contexts/CampaignContext';
import {TagsFilterModal} from 'src/components/TagsFilterModal';
import {motion} from 'framer-motion';
import {UploadNomenclaturesTemplate} from 'src/components/UploadNomenclaturesTemplate';
import {DownloadNomenclaturesTemplate} from 'src/components/DownloadNomenclaturesTemplate';
import ApiClient from 'src/utilities/ApiClient';
import {useError} from './ErrorContext';
import {CopyButton} from 'src/components/CopyButton';
import {SetArtStatusModal} from 'src/components/SetArtStatusModal';

export const NomenclaturesPage = ({permission, sellerId}) => {
    const {selectValue, setSwitchingCampaignsFlag, switchingCampaignsFlag} = useCampaign();
    const {showError} = useError();
    const [filters, setFilters] = useState({undef: false});

    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const filterByClick = (val, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const getNomenclatures = async () => {
        try {
            const params = {seller_id: sellerId};

            console.log(params);

            const response = await ApiClient.post('nomenclatures/get', params, 'json', true);
            console.log(response?.data);

            if (response && response.data) {
                setData(response.data);
                setPagesCurrent(1);
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error(error);
            showError('Возникла ошибка.');
        }
    };

    useEffect(() => {
        setSwitchingCampaignsFlag(true);
        getNomenclatures().finally(() => setSwitchingCampaignsFlag(false));
    }, [sellerId]);

    const [update, setUpdate] = useState(false);
    useEffect(() => {
        if (!update) return;
        getNomenclatures().finally(() => setUpdate(false));
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
                disabled={permission != 'Управление'}
                style={{marginLeft: 5}}
                view="outlined"
                onClick={(event) => {
                    if (onClick) onClick(event);
                    else {
                        event.stopPropagation();
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

    const columnData = useMemo(
        () => [
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
                name: 'status',
                placeholder: 'Статус в AURUM',
                valueType: 'text',
                render: ({value, footer}) => {
                    if (footer) return undefined;
                    const status = value ?? 'active';
                    return (
                        <Button
                            selected
                            size="xs"
                            pin="circle-circle"
                            view={status === 'active' ? 'flat-success' : 'flat-danger'}
                        >
                            {{active: 'Активен', disabled: 'Не активен'}[status]}
                        </Button>
                    );
                },
                additionalNodes: [
                    <SetArtStatusModal
                        sellerId={sellerId}
                        filteredData={filteredData}
                        setUpdate={setUpdate}
                    >
                        <Button
                            disabled={permission != 'Управление'}
                            style={{marginLeft: 5}}
                            view="outlined"
                        >
                            <Icon data={Pencil} />
                        </Button>
                    </SetArtStatusModal>,
                ],
            },
            {
                name: 'volume',
                placeholder: 'Объём, л.',
                render: ({value}) => {
                    if (value === undefined) return undefined;
                    return getRoundValue(value, 1, true) / 1000;
                },
            },
            {
                name: 'tags',
                placeholder: 'Теги',
                valueType: 'text',
                render: ({value, row}) => {
                    if (value === undefined) return;
                    const tags = [] as ReactNode[];
                    for (const tag of value) {
                        console.log(tag, row['art']);

                        if (!tag) continue;
                        const text = tag.toUpperCase();
                        tags.push(
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Button
                                    size="xs"
                                    selected
                                    view="flat-info"
                                    pin="circle-brick"
                                    onClick={() => filterByClick(text, 'tags')}
                                >
                                    {tag.toUpperCase()}
                                </Button>
                                <CopyButton
                                    pin="brick-circle"
                                    view="flat-info"
                                    color="secondary"
                                    selected
                                    size="xs"
                                    iconSize={13}
                                    copyText={text}
                                />
                            </div>,
                            <div style={{minWidth: 8}} />,
                        );
                    }
                    tags.pop();
                    return <div style={{display: 'flex', flexDirection: 'row'}}>{tags}</div>;
                },
                additionalNodes: [
                    generateEditButton('tags', () => {
                        setTagsModalFormOpen(true);
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
            {
                name: 'weight',
                placeholder: 'Вес, кг.',
                additionalNodes: [generateEditButton('weight')],
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
        ],
        [filteredData, data],
    );

    const filterByButton = (val, key = 'tags', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
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
                } else if (filterArg == 'status') {
                    const wholeText = tempTypeRow['status']
                        ? {active: 'Активен', disabled: 'Не активен'}[tempTypeRow['status']]
                        : 'Активен';

                    console.log(wholeText);

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
            return a.vendorCode.localeCompare(b.vendorCode, 'ru-RU');
        });

        setFilteredData([...temp]);
        setPagesCurrent(1);
    };

    useEffect(() => {
        filterTableData();
    }, [data]);

    const [tagsModalFormOpen, setTagsModalFormOpen] = useState(false);
    const [tagsInputValid, setTagsInputValid] = useState(true);
    const tagsInputRef = useRef<HTMLInputElement>(null);

    if (!data) return <Spin />;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: 8,
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
                        <TagsFilterModal filterByButton={filterByButton} />
                        <div style={{minWidth: 8}} />
                        <Button
                            loading={update}
                            size="l"
                            view="action"
                            onClick={() => {
                                setUpdate(true);
                            }}
                        >
                            <Icon data={ArrowsRotateLeft} />
                        </Button>
                        <motion.div
                            style={{
                                overflow: 'hidden',
                                marginTop: 4,
                            }}
                            animate={{
                                maxWidth: update ? 40 : 0,
                                opacity: update ? 1 : 0,
                            }}
                        >
                            <Spin style={{marginLeft: 8}} />
                        </motion.div>
                        <Modal open={tagsModalFormOpen} onClose={() => setTagsModalFormOpen(false)}>
                            <Card
                                view="clear"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    translate: '-50% -50%',
                                    flexWrap: 'nowrap',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: 'none',
                                }}
                            >
                                <motion.div
                                    style={{
                                        overflow: 'hidden',
                                        width: 404,
                                        flexWrap: 'nowrap',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#221d220f',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '#0002 0px 2px 8px 0px',
                                        padding: 30,
                                        borderRadius: 30,
                                        border: '1px solid #eee2',
                                    }}
                                >
                                    <Text variant="display-1">Назначить / Удалить тег</Text>
                                    <div style={{minHeight: 8}} />
                                    <TextInput
                                        size="l"
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
                                                    const tagUnformatted =
                                                        tagsInputRef.current.value;

                                                    const tag =
                                                        '#' +
                                                        tagUnformatted
                                                            .replace(/#/g, '')
                                                            .toUpperCase();

                                                    if (
                                                        tag[0] != '#' ||
                                                        tag.indexOf(' ') !== -1 ||
                                                        tag.length < 2
                                                    ) {
                                                        setTagsInputValid(false);
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
                                                        const {nmId} = row ?? {};
                                                        if (nmId === undefined) continue;
                                                        if (!params.data.nmIds.includes(nmId))
                                                            params.data.nmIds.push(nmId);
                                                    }

                                                    callApi('setTags', params);

                                                    setTagsModalFormOpen(false);
                                                }
                                            },
                                        },
                                        '',
                                        () => {},
                                    )}
                                    {generateModalButtonWithActions(
                                        {
                                            placeholder: 'Удалить тег',
                                            icon: TrashBin,
                                            view: 'outlined-danger',
                                            onClick: () => {
                                                if (tagsInputRef.current !== null) {
                                                    const tagUnformatted =
                                                        tagsInputRef.current.value;

                                                    const tag =
                                                        '#' +
                                                        tagUnformatted
                                                            .replace(/#/g, '')
                                                            .toUpperCase();

                                                    if (
                                                        tag[0] != '#' ||
                                                        tag.indexOf(' ') !== -1 ||
                                                        tag.length < 2
                                                    ) {
                                                        setTagsInputValid(false);

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
                                                        const {nmId} = row ?? {};
                                                        if (nmId === undefined) continue;
                                                        if (!params.data.nmIds.includes(nmId))
                                                            params.data.nmIds.push(nmId);
                                                    }

                                                    callApi('setTags', params);

                                                    setTagsModalFormOpen(false);
                                                }
                                            },
                                        },
                                        '',
                                        () => {},
                                    )}
                                </motion.div>
                            </Card>
                        </Modal>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <DownloadNomenclaturesTemplate sellerId={sellerId} />
                    <div style={{minWidth: 8}} />
                    <UploadNomenclaturesTemplate sellerId={sellerId} setUpdate={setUpdate} />
                </div>
            </div>

            {switchingCampaignsFlag ? (
                <div
                    style={{
                        height: 'calc(100vh - 10em - 60px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Loader size="l" />
                </div>
            ) : (
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
            )}
        </div>
    );
};
