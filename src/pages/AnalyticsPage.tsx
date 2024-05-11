import React, {useEffect, useState} from 'react';
import {Spin, Select, SelectOption, Icon, Button, Text, Pagination, List} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import '../App.scss';

import block from 'bem-cn-lite';

const b = block('app');

import {ChevronDown, Key} from '@gravity-ui/icons';

import callApi, {getUid} from 'src/utilities/callApi';
import TheTable, {compare} from 'src/components/TheTable';
import Userfront from '@userfront/toolkit';
import {motion} from 'framer-motion';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);
        if (mode) {
            doc['analytics'][selectValue] = docum['analytics'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi('getNomenclatures', {
            uid: getUid(),
            campaignName:
                Userfront.user.userUuid === '46431a09-85c3-4703-8246-d1b5c9e52594'
                    ? 'ИП Иосифова Р. И.'
                    : 'ИП Валерий',
        })
            .then((response) => setDocument(response ? response['data'] : undefined))
            .catch((error) => console.error(error));
    }, []);
    return doc;
};

export const AnalyticsPage = () => {
    const apiPageColumnsVal = localStorage.getItem('apiPageColumns');

    const apiPageColumnsInitial =
        apiPageColumnsVal !== 'undefined' && apiPageColumnsVal && apiPageColumnsVal.length
            ? JSON.parse(apiPageColumnsVal)
            : ['entity', 'sum_orders', 'sum', 'drr'];
    console.log(apiPageColumnsInitial);
    const [apiPageColumns, setApiPageColumns] = useState(apiPageColumnsInitial);

    useEffect(() => {
        localStorage.setItem('apiPageColumns', JSON.stringify(apiPageColumns));
    }, [apiPageColumns]);

    const [filters, setFilters] = useState({undef: false});

    const [pagesTotal, setPagesTotal] = useState(1);
    const [pagesCurrent, setPagesCurrent] = useState(1);
    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    const columnData = [];

    const [selectOptions, setSelectOptions] = React.useState<SelectOption<any>[]>([]);
    const [selectValue, setSelectValue] = React.useState<string[]>([]);
    const [buttonLoading, setButtonLoading] = useState('');
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(changedDoc, changedDocUpdateType, selectValue[0]);

    const recalc = (selected = '', withfFilters = {}) => {
        const campaignData = doc
            ? doc.nomenclatures[selected === '' ? selectValue[0] : selected]
            : {};
        // const campaignData = doc ? doc.analytics[selected === '' ? selectValue[0] : selected] : {};

        const temp = {};
        for (const [entity, entityData] of Object.entries(campaignData)) {
            if (!entity || !entityData) continue;

            const entityInfo = {
                entity: '',
                sum_orders: '',
                // orders: '',
                sum: '',
            };

            entityInfo.entity = entityData['entity'] ?? '';
            entityInfo.sum_orders = entityData['sum_orders'];
            entityInfo.sum = entityData['sum'];

            temp[entity] = entityInfo;
        }

        setTableData(temp);

        filterTableData(withfFilters, temp);
    };

    const [filteredSummary, setFilteredSummary] = useState({});

    const filterTableData = (withFilters = {}, tableData = {}) => {
        const temp = [] as any;

        for (const [entity, entityInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!entity || !entityInfo) continue;

            const tempTypeRow = entityInfo as any[];

            let addFlag = true;
            const useFilters = withFilters['undef'] ? withFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg === 'undef' || !filterData) continue;
                if (filterData['val'] === '') continue;
                if (filterArg === 'art') {
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
                        if (ruleForAdd === '') {
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
                    if (tempFlagInc !== rulesForAnd.length) {
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

        temp.sort((rowA, rowB) => {
            return rowA.entity.localeCompare(rowB.entity, 'ru-RU');
        });
        const paginatedDataTemp = temp.slice(0, 366);

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
        for (const [campaignName, _] of Object.entries(doc['nomenclatures'])) {
            if (Userfront.user.userUuid === 'ce86aeb0-30b7-45ba-9234-a6765df7a479') {
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
            } else if (Userfront.user.userUuid === '1c5a0344-31ea-469e-945e-1dfc4b964ecd') {
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
            } else if (Userfront.user.userUuid === '46431a09-85c3-4703-8246-d1b5c9e52594') {
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
        const selected = campaignsNames[0]['value'];
        setSelectValue([selected]);
        console.log(doc);

        recalc(selected);
        setFirstRecalc(true);
    }

    function arrayMove(arrayTemp, oldIndex, newIndex) {
        const arr = Array.from(arrayTemp);
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(oldIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr; // for testing
    }

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'start',
                        flexWrap: 'wrap',
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
                                    loading={buttonLoading === 'switchingCampaigns'}
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
                            setButtonLoading('switchingCampaigns');

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

                                    setButtonLoading('');
                                    console.log(doc);
                                });
                            } else {
                                setSelectValue(nextValue);
                                setButtonLoading('');
                            }
                            recalc(nextValue[0], filters);
                            setPagesCurrent(1);
                        }}
                    />
                    <motion.div
                        style={{
                            overflow: 'hidden',
                        }}
                        animate={{
                            maxWidth: buttonLoading === 'switchingCampaigns' ? 40 : 0,
                            opacity: buttonLoading === 'switchingCampaigns' ? 1 : 0,
                        }}
                    >
                        <Spin style={{marginTop: 4, marginLeft: 8}} />
                    </motion.div>
                </div>
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'end',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{display: 'flex', height: 300}}>
                        <List
                            sortable
                            // filterable={false}
                            itemHeight={28}
                            items={['a'].concat(apiPageColumns)}
                            renderItem={(item) => {
                                return <Text>{item as string}</Text>;
                            }}
                            onSortEnd={({oldIndex, newIndex}) => {
                                setApiPageColumns(arrayMove(apiPageColumns, oldIndex, newIndex));
                            }}
                        ></List>
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
                    pageSize={366}
                    onUpdate={(page) => {
                        setPagesCurrent(page);
                        const paginatedDataTemp = filteredData.slice((page - 1) * 366, page * 366);
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
