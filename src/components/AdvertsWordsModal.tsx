import {
    Button,
    Card,
    Icon,
    List,
    Loader,
    Modal,
    Popover,
    RadioButton,
    Skeleton,
    Spin,
    Text,
    TextInput,
    Tooltip,
} from '@gravity-ui/uikit';
import {
    LayoutHeader,
    Pencil,
    TriangleExclamation,
    Eye,
    ArrowRight,
    CaretUp,
    Plus,
    CaretDown,
    Magnifier,
    ArrowShapeUp,
} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import {parseFirst10Pages} from 'src/pages/MassAdvertPage';
import callApi, {getUid} from 'src/utilities/callApi';
import {getRoundValue, renderAsPercent} from 'src/utilities/getRoundValue';
import DataTable from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import {AutoPhrasesWordsSelection} from './AutoPhrasesWordsSelection';
import {TextTitleWrapper} from './TextTitleWrapper';
import {useCampaign} from 'src/contexts/CampaignContext';

export const AdvertsWordsModal = ({
    children,
    disabled,
    doc,
    advertId,
    art,
    setChangedDoc,
    setFetchedPlacements,
    currentParsingProgress,
    setCurrentParsingProgress,
    columnDataAuction,
    auctionOptions,
    auctionSelectedOption,
    setAuctionSelectedOption,
}) => {
    const {selectValue} = useCampaign();

    const [open, setOpen] = useState(false);

    const [wordsFetchUpdate, setWordsFetchUpdate] = useState(false);

    const [semanticsAutoPhrasesModalFormOpen, setSemanticsAutoPhrasesModalFormOpen] =
        useState(false);
    const [semanticsAutoPhrasesModalIncludesList, setSemanticsAutoPhrasesModalIncludesList] =
        useState<any[]>([]);
    const [
        semanticsAutoPhrasesModalIncludesListInput,
        setSemanticsAutoPhrasesModalIncludesListInput,
    ] = useState('');
    const [semanticsAutoPhrasesModalNotIncludesList, setSemanticsAutoPhrasesModalNotIncludesList] =
        useState<any[]>([]);
    const [
        semanticsAutoPhrasesModalNotIncludesListInput,
        setSemanticsAutoPhrasesModalNotIncludesListInput,
    ] = useState('');

    const [semanticsModalOpenFromArt, setSemanticsModalOpenFromArt] = useState('');

    const [semanticsModalSemanticsItemsValue, setSemanticsModalSemanticsItemsValue] = useState<
        any[]
    >([]);
    const [semanticsModalSemanticsItemsValuePresets, setSemanticsModalSemanticsItemsValuePresets] =
        useState<any[]>([]);
    const [
        semanticsModalSemanticsMinusItemsValuePresets,
        setSemanticsModalSemanticsMinusItemsValuePresets,
    ] = useState<any[]>([]);
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
        semanticsModalSemanticsPlusItemsTemplateNameSaveValue,
        setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue,
    ] = useState('Новое правило');
    const [semanticsModalSemanticsThresholdValue, setSemanticsModalSemanticsThresholdValue] =
        useState(1);
    const [semanticsModalSemanticsCTRThresholdValue, setSemanticsModalSemanticsCTRThresholdValue] =
        useState('0');
    const [
        semanticsModalSemanticsCTRThresholdValueValid,
        setSemanticsModalSemanticsCTRThresholdValueValid,
    ] = useState(true);
    const [
        semanticsModalSemanticsSecondThresholdValue,
        setSemanticsModalSemanticsSecondThresholdValue,
    ] = useState(0);
    const [
        semanticsModalSemanticsSecondCTRThresholdValue,
        setSemanticsModalSemanticsSecondCTRThresholdValue,
    ] = useState('0');
    const [
        semanticsModalSemanticsSecondCTRThresholdValueValid,
        setSemanticsModalSemanticsSecondCTRThresholdValueValid,
    ] = useState(true);

    const [semanticsModalIsFixed, setSemanticsModalIsFixed] = useState(false);

    const [semanticsFilteredSummary, setSemanticsFilteredSummary] = useState({
        active: {
            cluster: '',
            cpc: 0,
            sum: 0,
            count: 0,
            ctr: 0,
            clicks: 0,
            freq: 0,
            freqTrend: 0,
            placements: null,
        },
        minus: {
            cluster: '',
            freq: 0,
            freqTrend: 0,
            count: 0,
            clicks: 0,
            sum: 0,
            cpc: 0,
            ctr: 0,
            placements: null,
        },
        template: {cluster: {summary: 0}},
    });

    const [clustersFiltersActive, setClustersFiltersActive] = useState({undef: false});
    const clustersFilterDataActive = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersActive;
        const _clusters = clusters ?? semanticsModalSemanticsItemsValue;
        // console.log(_clustersFilters, _clusters);

        semanticsFilteredSummary.active = {
            cluster: '',
            cpc: 0,
            sum: 0,
            count: 0,
            ctr: 0,
            clicks: 0,
            freq: 0,
            freqTrend: 0,
            placements: null,
        };

        setSemanticsModalSemanticsItemsFiltratedValue(
            _clusters.filter((cluster) => {
                for (const [filterArg, filterData] of Object.entries(_clustersFilters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;
                    else if (!compare(cluster[filterArg], filterData)) {
                        return false;
                    }
                }

                for (const [key, val] of Object.entries(cluster)) {
                    if (['sum', 'count', 'clicks', 'freq'].includes(key))
                        semanticsFilteredSummary.active[key] += val;
                }

                return true;
            }),
        );

        const {sum, count, clicks} = semanticsFilteredSummary.active;
        semanticsFilteredSummary.active.cpc = getRoundValue(sum, clicks);
        semanticsFilteredSummary.active.ctr = getRoundValue(clicks, count, true);
        setSemanticsFilteredSummary(semanticsFilteredSummary);
    };

    const [clustersFiltersMinus, setClustersFiltersMinus] = useState({undef: false});
    const clustersFilterDataMinus = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersMinus;
        const _clusters = clusters ?? semanticsModalSemanticsMinusItemsValue;
        // console.log(_clustersFilters, _clusters);

        semanticsFilteredSummary.minus = {
            cluster: '',
            cpc: 0,
            sum: 0,
            count: 0,
            ctr: 0,
            clicks: 0,
            freq: 0,
            freqTrend: 0,
            placements: null,
        };

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
                for (const [key, val] of Object.entries(cluster)) {
                    if (['sum', 'count', 'clicks', 'freq'].includes(key))
                        semanticsFilteredSummary.minus[key] += val;
                }
                temp.push(cluster);
            }
        }
        // console.log(temp);

        setSemanticsModalSemanticsMinusItemsFiltratedValue([...temp]);

        const {sum, count, clicks} = semanticsFilteredSummary.minus;
        semanticsFilteredSummary.minus.cpc = getRoundValue(sum, clicks);
        semanticsFilteredSummary.minus.ctr = getRoundValue(clicks, count, true);
        setSemanticsFilteredSummary(semanticsFilteredSummary);
    };

    useEffect(() => {
        if (!open) return;

        setWordsFetchUpdate(true);
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            advertId: advertId,
        };
        console.log(params);

        callApi('getWordsForAdvertId', params, true)
            .then((res) => {
                if (!res) throw 'its undefined';
                const words = res['data'];
                const advertSemantics = {
                    excluded: words ? words['excluded'] ?? [] : [],
                    clusters: words ? words['clusters'] ?? [] : [],
                };
                console.log(advertSemantics);
                setSemanticsModalOpenFromArt(art);

                if (autoPhrasesTemplate) {
                    setSemanticsAutoPhrasesModalIncludesList(autoPhrasesTemplate.includes ?? []);
                    setSemanticsAutoPhrasesModalNotIncludesList(
                        autoPhrasesTemplate.notIncludes ?? [],
                    );
                } else {
                    setSemanticsAutoPhrasesModalIncludesList([]);
                    setSemanticsAutoPhrasesModalNotIncludesList([]);
                }
                setSemanticsAutoPhrasesModalIncludesListInput('');
                setSemanticsAutoPhrasesModalNotIncludesListInput('');

                console.log(advertSemantics);

                setSemanticsModalSemanticsItemsValue(() => {
                    const temp = advertSemantics.clusters;
                    temp.sort((a, b) => {
                        const key = 'count';
                        const valA = a[key] ?? 0;
                        const valB = b[key] ?? 0;
                        return valB - valA;
                    });

                    // console.log(temp);

                    const tempPresets = [] as any[];
                    for (const [_cluster, clusterData] of Object.entries(temp)) {
                        const {preset, freq} = (clusterData as {
                            preset: string;
                            cluster: string;
                            freq: object;
                        }) ?? {
                            preset: undefined,
                            freq: undefined,
                            cluster: undefined,
                        };
                        if (preset) tempPresets.push(preset);
                        if (freq && freq['val']) {
                            temp[_cluster].freq = freq['val'];
                            temp[_cluster].freqTrend = freq['trend'];
                        }
                    }
                    setSemanticsModalSemanticsItemsValuePresets(tempPresets);

                    clustersFilterDataActive(clustersFiltersActive, temp);
                    return temp;
                });
                setSemanticsModalSemanticsMinusItemsValue(() => {
                    const temp = advertSemantics.excluded;
                    temp.sort((a, b) => {
                        const freqA = a.freq ? a.freq.val : 0;
                        const freqB = b.freq ? b.freq.val : 0;
                        return freqB - freqA;
                    });

                    const tempPresets = [] as any[];
                    for (const [_cluster, clusterData] of Object.entries(temp)) {
                        const {preset, freq} = (clusterData as {
                            preset: string;
                            cluster: string;
                            freq: object;
                        }) ?? {
                            preset: undefined,
                            freq: undefined,
                            cluster: undefined,
                        };
                        if (preset) tempPresets.push(preset);
                        if (freq && freq['val']) {
                            temp[_cluster].freq = freq['val'];
                            temp[_cluster].freqTrend = freq['trend'];
                        }
                    }
                    setSemanticsModalSemanticsMinusItemsValuePresets(tempPresets);

                    clustersFilterDataMinus(clustersFiltersMinus, temp);
                    return temp;
                });

                const plusThreshold = doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate].threshold
                    : 1;
                setSemanticsModalSemanticsThresholdValue(plusThreshold);

                const plusCTRThreshold = doc.plusPhrasesTemplates[selectValue[0]][
                    plusPhrasesTemplate
                ]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate].ctrThreshold
                    : 0;
                setSemanticsModalSemanticsCTRThresholdValue(plusCTRThreshold);

                const plusSecondThreshold = doc.plusPhrasesTemplates[selectValue[0]][
                    plusPhrasesTemplate
                ]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate].secondThreshold
                    : 0;
                setSemanticsModalSemanticsSecondThresholdValue(plusSecondThreshold);

                const plusSecondCTRThreshold = doc.plusPhrasesTemplates[selectValue[0]][
                    plusPhrasesTemplate
                ]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                          .secondCtrThreshold
                    : 0;
                setSemanticsModalSemanticsSecondCTRThresholdValue(plusSecondCTRThreshold);

                const isFixed = doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate].isFixed ?? false
                    : false;
                setSemanticsModalIsFixed(isFixed);

                setClustersFiltersActive({undef: false});
                setClustersFiltersMinus({undef: false});

                // // console.log(value.plus);
                setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                    plusPhrasesTemplate ?? `Новое правило`,
                );
                const plusItems = doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate]
                    ? doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate].clusters
                    : [];
                setSemanticsModalSemanticsPlusItemsValue(plusItems);
            })
            .catch((error) => console.error('Error fetching words for advertId:', error))
            .finally(() => setWordsFetchUpdate(false));
    }, [open]);

    const [separetedWords, setSeparetedWords] = useState([] as string[]);
    useEffect(() => {
        const separetedWordsObj = {};
        const temp = [] as string[];
        for (const row of semanticsModalSemanticsItemsFiltratedValue) {
            const {cluster, freq} = row;
            const words = (cluster as string).split(' ');
            for (const word of words) {
                if (!separetedWordsObj[word]) separetedWordsObj[word] = 0;
                separetedWordsObj[word] += freq;
                if (!temp.includes(word)) temp.push(word);
            }
        }
        for (const row of semanticsModalSemanticsMinusItemsFiltratedValue) {
            const {cluster, freq} = row;
            const words = (cluster as string).split(' ');
            for (const word of words) {
                if (!separetedWordsObj[word]) separetedWordsObj[word] = 0;
                separetedWordsObj[word] += freq;
                if (!temp.includes(word)) temp.push(word);
            }
        }
        temp.sort((a, b) => separetedWordsObj[b] - separetedWordsObj[a]);
        setSeparetedWords(
            temp.filter(
                (item) =>
                    !semanticsAutoPhrasesModalIncludesList.includes(item) &&
                    !semanticsAutoPhrasesModalNotIncludesList.includes(item),
            ),
        );
    }, [
        semanticsModalSemanticsItemsFiltratedValue,
        semanticsModalSemanticsMinusItemsFiltratedValue,
        semanticsAutoPhrasesModalIncludesList,
        semanticsAutoPhrasesModalNotIncludesList,
    ]);

    const columnDataSemantics = [
        {
            name: 'preset',
            valueType: 'text',
            placeholder: 'Пресет',
            constWidth: 100,
            render: ({value, row}) => {
                const {cluster} = row;

                const bad =
                    semanticsModalSemanticsItemsValuePresets.includes(value) &&
                    semanticsModalSemanticsMinusItemsValuePresets.includes(value);

                const isSelected =
                    (doc['advertsSelectedPhrases'][selectValue[0]][advertId]
                        ? doc['advertsSelectedPhrases'][selectValue[0]][advertId].phrase
                        : '') == cluster;

                const multiplePresetInstancesThowItIsNotIncluded =
                    semanticsModalSemanticsItemsValuePresets.filter((item) => item == value)
                        .length > 1 && !isSelected;

                return (
                    <div
                        style={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {bad ? (
                            <Button
                                size="xs"
                                view={'flat-danger'}
                                onClick={() =>
                                    filterByButtonClusters(value, false, 'preset', 'include')
                                }
                            >
                                {value}
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                view={
                                    multiplePresetInstancesThowItIsNotIncluded
                                        ? 'flat-warning'
                                        : 'flat'
                                }
                                onClick={() =>
                                    filterByButtonClusters(value, true, 'preset', 'include')
                                }
                            >
                                <Text color="primary">{value}</Text>
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            additionalNodes: [] as any[],
            constWidth: 400,
            name: 'cluster',
            placeholder: 'Кластер',
            valueType: 'text',
            render: ({value, footer}) => {
                if (footer) {
                    return <Text>{value}</Text>;
                }

                let valueWrapped = value;
                let curStrLen = 0;
                if (value.length > 30) {
                    valueWrapped = '';
                    const titleArr = value.split(' ');
                    for (const word of titleArr) {
                        valueWrapped += word;
                        curStrLen += word.length;
                        if (curStrLen > 40) {
                            valueWrapped += '\n';
                            curStrLen = 0;
                        } else {
                            valueWrapped += ' ';
                            curStrLen++;
                        }
                    }
                }

                const isSelected =
                    (doc['advertsSelectedPhrases'][selectValue[0]][advertId]
                        ? doc['advertsSelectedPhrases'][selectValue[0]][advertId].phrase
                        : '') == value;

                const mapAuctionsTypes = {
                    Выдача: 'firstPage',
                    'Аукцион Авто': 'auto',
                    'Аукцион Поиска': 'search',
                };

                const auction = (
                    doc.fetchedPlacements[value]
                        ? doc.fetchedPlacements[value].cpms[
                              mapAuctionsTypes[auctionSelectedOption]
                          ] ?? []
                        : []
                ).slice(0, 100);

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: 418,
                        }}
                    >
                        <Text style={{whiteSpace: 'wrap'}}>{valueWrapped}</Text>
                        <div style={{width: 8}} />
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
                            <div style={{width: 4}} />
                            <Popover
                                placement={'bottom-start'}
                                content={
                                    <Card
                                        view="clear"
                                        style={{
                                            height: 20,
                                            overflow: 'auto',
                                            display: 'flex',
                                        }}
                                    >
                                        <Card
                                            view="clear"
                                            style={{
                                                position: 'absolute',
                                                maxHeight: '30em',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                top: -10,
                                                left: -10,
                                            }}
                                        >
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <Card
                                                    // theme="warning"
                                                    style={{
                                                        height: 'fit-content',
                                                        width: 'fit-content',
                                                        boxShadow:
                                                            'var(--g-color-base-background) 0px 2px 8px',
                                                    }}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                'var(--yc-color-base-background)',
                                                            overflow: 'auto',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            padding: 5,
                                                        }}
                                                    >
                                                        <RadioButton
                                                            value={auctionSelectedOption}
                                                            options={auctionOptions}
                                                            onUpdate={(value) => {
                                                                setAuctionSelectedOption(value);
                                                            }}
                                                        />
                                                    </Card>
                                                </Card>
                                                <div style={{minHeight: 12}} />
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row'}}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                'var(--yc-color-base-background)',
                                                            maxWidth: '60em',
                                                            maxHeight: '30em',
                                                            height: 'fit-content',
                                                            overflow: 'auto',
                                                            boxShadow:
                                                                'var(--g-color-base-background) 0px 2px 8px',
                                                        }}
                                                    >
                                                        <Card
                                                            style={{
                                                                background:
                                                                    'var(--g-color-base-background)',
                                                            }}
                                                        >
                                                            <DataTable
                                                                settings={{
                                                                    displayIndices: false,
                                                                    stickyHead: MOVING,
                                                                    stickyFooter: MOVING,
                                                                    highlightRows: true,
                                                                }}
                                                                footerData={[
                                                                    {
                                                                        cpm: `${auctionSelectedOption}, ${
                                                                            auction
                                                                                ? auction.length
                                                                                : 0
                                                                        } шт.`,
                                                                    },
                                                                ]}
                                                                theme="yandex-cloud"
                                                                onRowClick={(row, index, event) => {
                                                                    console.log(row, index, event);
                                                                }}
                                                                columns={columnDataAuction}
                                                                data={auction}
                                                            />
                                                        </Card>
                                                    </Card>
                                                </div>
                                            </div>
                                        </Card>
                                    </Card>
                                }
                            >
                                <Button
                                    size="xs"
                                    view={'outlined'}
                                    onClick={() => {}}
                                    disabled={!doc.fetchedPlacements[value]}
                                >
                                    <Icon data={Eye} />
                                </Button>
                            </Popover>
                            <div style={{width: 4}} />
                            <Button
                                disabled={disabled}
                                size="xs"
                                view={isSelected ? 'outlined-success' : 'outlined'}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (!doc['advertsSelectedPhrases'][selectValue[0]][advertId])
                                        doc['advertsSelectedPhrases'][selectValue[0]][advertId] = {
                                            phrase: '',
                                        };

                                    if (isSelected) {
                                        doc['advertsSelectedPhrases'][selectValue[0]][advertId] =
                                            undefined;
                                    } else {
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            advertId
                                        ].phrase = value;
                                    }

                                    setChangedDoc({...doc});

                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            mode: isSelected ? 'Удалить' : 'Установить',
                                            advertsIds: {},
                                        },
                                    };
                                    params.data.advertsIds[advertId] = {};
                                    params.data.advertsIds[advertId].phrase = value;
                                    console.log(params);

                                    callApi('updateAdvertsSelectedPhrases', params);
                                }}
                            >
                                <Icon data={ArrowShapeUp} />
                            </Button>
                            <div style={{width: 4}} />
                            <Button
                                disabled={disabled}
                                size="xs"
                                view={
                                    semanticsModalSemanticsPlusItemsValue.includes(value)
                                        ? 'outlined-warning'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                    const cluster = value;
                                    if (!val.includes(cluster)) {
                                        val.push(cluster);
                                    } else {
                                        val = val.filter((value) => value != cluster);
                                    }

                                    setSemanticsModalSemanticsPlusItemsValue(val);
                                }}
                            >
                                <Icon data={Plus} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'freq',
            placeholder: 'Частота',
            render: ({value, row}) => {
                const {freqTrend} = row;
                return (
                    <Tooltip content={`${freqTrend > 0 ? '+' : ''}${freqTrend}`}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text>{value}</Text>
                            {freqTrend ? (
                                <Text
                                    color={
                                        freqTrend > 0
                                            ? 'positive'
                                            : freqTrend < 0
                                            ? 'danger'
                                            : 'primary'
                                    }
                                >
                                    <Icon data={freqTrend > 0 ? CaretUp : CaretDown} />
                                </Text>
                            ) : (
                                <> </>
                            )}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            name: 'count',
            placeholder: 'Показы, шт',
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт',
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: renderAsPercent,
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
        },
        {
            name: 'placements',
            placeholder: 'Позиция, №',
            render: ({value, row}) => {
                if (value === null) return;
                const {cluster} = row;
                return (
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            size="xs"
                            view="flat"
                            onClick={(event) => {
                                event.stopPropagation();
                                parseFirst10Pages(
                                    cluster,
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                );
                            }}
                        >
                            {doc.fetchedPlacements[cluster] &&
                            doc.campaigns[selectValue[0]][semanticsModalOpenFromArt] ? (
                                doc.fetchedPlacements[cluster].data[
                                    doc.campaigns[selectValue[0]][semanticsModalOpenFromArt].nmId
                                ] ? (
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log &&
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log.position !== undefined ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text color="secondary">{`${
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].log.position + 1
                                            }`}</Text>
                                            <div style={{width: 3}} />
                                            <Icon data={ArrowRight} size={13}></Icon>
                                            <div style={{width: 3}} />
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </>
                                    )
                                ) : (
                                    'Нет в выдаче'
                                )
                            ) : (
                                '№'
                            )}
                            <Icon size={12} data={LayoutHeader} />
                        </Button>
                        {currentParsingProgress[cluster] &&
                        currentParsingProgress[cluster].progress !== undefined &&
                        currentParsingProgress[cluster].progress !=
                            currentParsingProgress[cluster].max ? (
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{width: 4}} />
                                {currentParsingProgress[cluster].error ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {`${
                                            currentParsingProgress[cluster].progress / 100
                                        }/20 стр.`}
                                        <div style={{width: 3}} />
                                        <Icon size={12} data={TriangleExclamation} />
                                    </div>
                                ) : (
                                    <Spin size="xs" />
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
    ];
    const columnDataSemantics2 = [
        {
            name: 'preset',
            valueType: 'text',
            constWidth: 100,
            placeholder: 'Пресет',
            render: ({value}) => {
                const bad =
                    semanticsModalSemanticsItemsValuePresets.includes(value) &&
                    semanticsModalSemanticsMinusItemsValuePresets.includes(value);
                return (
                    <div
                        style={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {bad ? (
                            <Button
                                size="xs"
                                view={'flat-danger'}
                                onClick={() =>
                                    filterByButtonClusters(value, true, 'preset', 'include')
                                }
                            >
                                {value}
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                view={'flat'}
                                onClick={() =>
                                    filterByButtonClusters(value, false, 'preset', 'include')
                                }
                            >
                                <Text color="primary">{value}</Text>
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            additionalNodes: [] as any[],
            constWidth: 400,
            name: 'cluster',
            placeholder: 'Кластер',
            valueType: 'text',
            render: ({value, footer}) => {
                if (footer) {
                    return <Text>{value}</Text>;
                }

                let valueWrapped = value;
                let curStrLen = 0;
                if (value.length > 30) {
                    valueWrapped = '';
                    const titleArr = value.split(' ');
                    for (const word of titleArr) {
                        valueWrapped += word;
                        curStrLen += word.length;
                        if (curStrLen > 40) {
                            valueWrapped += '\n';
                            curStrLen = 0;
                        } else {
                            valueWrapped += ' ';
                            curStrLen++;
                        }
                    }
                }

                const isSelected =
                    (doc['advertsSelectedPhrases'][selectValue[0]][advertId]
                        ? doc['advertsSelectedPhrases'][selectValue[0]][advertId].phrase
                        : '') == value;

                const mapAuctionsTypes = {
                    Выдача: 'firstPage',
                    'Аукцион Авто': 'auto',
                    'Аукцион Поиска': 'search',
                };

                const auction = doc.fetchedPlacements[value]
                    ? doc.fetchedPlacements[value].cpms[mapAuctionsTypes[auctionSelectedOption]] ??
                      []
                    : [];

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: 418,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{whiteSpace: 'wrap'}}>{valueWrapped}</Text>
                        <div style={{width: 8}} />
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
                            <div style={{width: 4}} />
                            <Popover
                                placement={'bottom-start'}
                                content={
                                    <Card
                                        view="clear"
                                        style={{
                                            height: 20,
                                            overflow: 'auto',
                                            display: 'flex',
                                        }}
                                    >
                                        <Card
                                            view="clear"
                                            style={{
                                                position: 'absolute',
                                                maxHeight: '30em',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                top: -10,
                                                left: -10,
                                            }}
                                        >
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <Card
                                                    // theme="warning"
                                                    style={{
                                                        height: 'fit-content',
                                                        width: 'fit-content',
                                                        boxShadow:
                                                            'var(--g-color-base-background) 0px 2px 8px',
                                                    }}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                'var(--yc-color-base-background)',
                                                            overflow: 'auto',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            padding: 5,
                                                        }}
                                                    >
                                                        <RadioButton
                                                            value={auctionSelectedOption}
                                                            options={auctionOptions}
                                                            onUpdate={(value) => {
                                                                setAuctionSelectedOption(value);
                                                            }}
                                                        />
                                                    </Card>
                                                </Card>
                                                <div style={{minHeight: 12}} />
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row'}}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                'var(--yc-color-base-background)',
                                                            maxWidth: '60em',
                                                            maxHeight: '30em',
                                                            height: 'fit-content',
                                                            overflow: 'auto',
                                                            boxShadow:
                                                                'var(--g-color-base-background) 0px 2px 8px',
                                                        }}
                                                    >
                                                        <Card
                                                            style={{
                                                                background:
                                                                    'var(--g-color-base-background)',
                                                            }}
                                                        >
                                                            <DataTable
                                                                settings={{
                                                                    displayIndices: false,
                                                                    stickyHead: MOVING,
                                                                    stickyFooter: MOVING,
                                                                    highlightRows: true,
                                                                }}
                                                                footerData={[
                                                                    {
                                                                        cpm: `${auctionSelectedOption}, ${
                                                                            auction
                                                                                ? auction.length
                                                                                : 0
                                                                        } шт.`,
                                                                    },
                                                                ]}
                                                                theme="yandex-cloud"
                                                                onRowClick={(row, index, event) => {
                                                                    console.log(row, index, event);
                                                                }}
                                                                columns={columnDataAuction}
                                                                data={auction}
                                                            />
                                                        </Card>
                                                    </Card>
                                                </div>
                                            </div>
                                        </Card>
                                    </Card>
                                }
                            >
                                <Button
                                    size="xs"
                                    view={'outlined'}
                                    onClick={() => {}}
                                    disabled={!doc.fetchedPlacements[value]}
                                >
                                    <Icon data={Eye} />
                                </Button>
                            </Popover>
                            <div style={{width: 4}} />
                            <Button
                                size="xs"
                                view={isSelected ? 'outlined-success' : 'outlined'}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (!doc['advertsSelectedPhrases'][selectValue[0]][advertId])
                                        doc['advertsSelectedPhrases'][selectValue[0]][advertId] = {
                                            phrase: '',
                                        };

                                    if (isSelected) {
                                        doc['advertsSelectedPhrases'][selectValue[0]][advertId] =
                                            undefined;
                                    } else {
                                        doc['advertsSelectedPhrases'][selectValue[0]][
                                            advertId
                                        ].phrase = value;
                                    }

                                    setChangedDoc({...doc});

                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            mode: isSelected ? 'Удалить' : 'Установить',
                                            advertsIds: {},
                                        },
                                    };
                                    params.data.advertsIds[advertId] = {};
                                    params.data.advertsIds[advertId].phrase = value;
                                    console.log(params);

                                    callApi('updateAdvertsSelectedPhrases', params);
                                }}
                            >
                                <Icon data={ArrowShapeUp} />
                            </Button>
                            <div style={{width: 4}} />
                            <Button
                                size="xs"
                                view={
                                    semanticsModalSemanticsPlusItemsValue.includes(value)
                                        ? 'outlined-warning'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    let val = Array.from(semanticsModalSemanticsPlusItemsValue);
                                    const cluster = value;
                                    if (!val.includes(cluster)) {
                                        val.push(cluster);
                                    } else {
                                        val = val.filter((value) => value != cluster);
                                    }

                                    setSemanticsModalSemanticsPlusItemsValue(val);
                                }}
                            >
                                <Icon data={Plus} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'freq',
            placeholder: 'Частота',
            render: ({value, row}) => {
                const {freqTrend} = row;
                return (
                    <Tooltip content={`${freqTrend > 0 ? '+' : ''}${freqTrend}`}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text>{value}</Text>
                            {freqTrend ? (
                                <Text
                                    color={
                                        freqTrend > 0
                                            ? 'positive'
                                            : freqTrend < 0
                                            ? 'danger'
                                            : 'primary'
                                    }
                                >
                                    <Icon data={freqTrend > 0 ? CaretUp : CaretDown} />
                                </Text>
                            ) : (
                                <> </>
                            )}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            name: 'count',
            placeholder: 'Показы, шт',
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт',
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: renderAsPercent,
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
        },
        {
            name: 'placements',
            placeholder: 'Позиция, №',
            render: ({value, row}) => {
                if (value === null) return;
                const {cluster} = row;
                return (
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            size="xs"
                            view="flat"
                            onClick={(event) => {
                                event.stopPropagation();
                                parseFirst10Pages(
                                    cluster,
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                );
                            }}
                        >
                            {doc.fetchedPlacements[cluster] &&
                            doc.campaigns[selectValue[0]][semanticsModalOpenFromArt] ? (
                                doc.fetchedPlacements[cluster].data[
                                    doc.campaigns[selectValue[0]][semanticsModalOpenFromArt].nmId
                                ] ? (
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log &&
                                    doc.fetchedPlacements[cluster].data[
                                        doc.campaigns[selectValue[0]][semanticsModalOpenFromArt]
                                            .nmId
                                    ].log.position !== undefined ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text color="secondary">{`${
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].log.position + 1
                                            }`}</Text>
                                            <div style={{width: 3}} />
                                            <Icon data={ArrowRight} size={13}></Icon>
                                            <div style={{width: 3}} />
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            {
                                                doc.fetchedPlacements[cluster].data[
                                                    doc.campaigns[selectValue[0]][
                                                        semanticsModalOpenFromArt
                                                    ].nmId
                                                ].index
                                            }
                                        </>
                                    )
                                ) : (
                                    'Нет в выдаче'
                                )
                            ) : (
                                '№'
                            )}
                            <Icon size={12} data={LayoutHeader} />
                        </Button>
                        {currentParsingProgress[cluster] &&
                        currentParsingProgress[cluster].progress !== undefined &&
                        currentParsingProgress[cluster].progress !=
                            currentParsingProgress[cluster].max ? (
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{width: 4}} />
                                {currentParsingProgress[cluster].error ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {`${
                                            currentParsingProgress[cluster].progress / 100
                                        }/20 стр.`}
                                        <div style={{width: 3}} />
                                        <Icon size={12} data={TriangleExclamation} />
                                    </div>
                                ) : (
                                    <Spin size="xs" />
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
    ];

    const renameFirstColumn = (colss, newName: string, additionalNodes = [] as any[]) => {
        const index = 1;
        const columnDataSemanticsCopy = Array.from(colss) as any[];
        columnDataSemanticsCopy[index].placeholder = newName;
        columnDataSemanticsCopy[index].additionalNodes = additionalNodes;
        return columnDataSemanticsCopy;
    };
    const generateMassAddDelButton = ({placeholder, array, mode}) => {
        return (
            <Button
                style={{marginLeft: 8}}
                view="outlined"
                onClick={() => {
                    const val = [] as any[];
                    if (mode == 'add') {
                        val.push(...Array.from(semanticsModalSemanticsPlusItemsValue));
                        for (let i = 0; i < array.length; i++) {
                            const cluster = array[i].cluster;
                            if (val.includes(cluster)) continue;
                            val.push(cluster);
                        }
                    } else if (mode == 'del') {
                        const clustersToDel = [] as string[];
                        for (const clusterData of array) clustersToDel.push(clusterData.cluster);
                        for (let i = 0; i < semanticsModalSemanticsPlusItemsValue.length; i++) {
                            const cluster = semanticsModalSemanticsPlusItemsValue[i];
                            if (clustersToDel.includes(cluster)) continue;
                            if (val.includes(cluster)) continue;
                            val.push(cluster);
                        }
                    }

                    setSemanticsModalSemanticsPlusItemsValue(val);
                }}
            >
                {placeholder}
            </Button>
        );
    };

    const filterByButtonClusters = (val, activeFlag, key = 'art', compMode = 'include') => {
        if (activeFlag) {
            clustersFiltersActive[key] = {val: String(val), compMode: compMode};
            setClustersFiltersActive(clustersFiltersActive);
            clustersFilterDataActive(clustersFiltersActive, semanticsModalSemanticsItemsValue);
        } else {
            clustersFiltersMinus[key] = {val: String(val), compMode: compMode};
            setClustersFiltersMinus(clustersFiltersMinus);
            clustersFilterDataMinus(clustersFiltersMinus, semanticsModalSemanticsMinusItemsValue);
        }
    };

    const plusPhrasesTemplate = doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId]
        ? doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId].templateName
        : undefined;
    const {autoPhrasesTemplate} =
        doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate] ?? {};

    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <div>
            {triggerButton}
            {wordsFetchUpdate ? <Skeleton style={{marginLeft: 5, width: 60}} /> : <></>}
            <div style={{height: 4}} />
            <Modal open={open} onClose={handleClose}>
                <motion.div
                    animate={{maxWidth: open ? '90vw' : 0}}
                    style={{
                        maxWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        margin: 20,
                        alignItems: 'start',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                marginRight: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: '100%',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    view="outlined"
                                    href={`https://cmp.wildberries.ru/campaigns/edit/${advertId}`}
                                    target="_blank"
                                >
                                    {advertId}
                                </Button>
                                <div style={{minWidth: 8}} />
                                <TextInput
                                    disabled={disabled}
                                    placeholder="Имя"
                                    hasClear
                                    value={semanticsModalSemanticsPlusItemsTemplateNameSaveValue}
                                    onUpdate={(val) => {
                                        setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(
                                            val,
                                        );
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginTop: 8,
                                    width: '100%',
                                }}
                            >
                                <TextTitleWrapper
                                    title={
                                        'Первичная фильтрация фраз\nесли показы больше или равно'
                                    }
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--yc-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--yc-color-base-generic-hover)',
                                                height: 0.5,
                                                width: '100%',
                                            }}
                                        />
                                        <TextInput
                                            disabled={disabled}
                                            view="clear"
                                            hasClear
                                            style={{width: '90%', margin: '0 5%'}}
                                            value={String(semanticsModalSemanticsThresholdValue)}
                                            onUpdate={(val) => {
                                                setSemanticsModalSemanticsThresholdValue(
                                                    Number(val),
                                                );
                                            }}
                                            type="number"
                                        />
                                    </>
                                </TextTitleWrapper>
                                <div style={{minWidth: 8}} />
                                <TextTitleWrapper
                                    title={'Первичная фильтрация фраз\nесли %CTR меньше или равно'}
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--yc-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--yc-color-base-generic-hover)',
                                                height: 0.5,
                                                width: '100%',
                                            }}
                                        />
                                        <TextInput
                                            disabled={disabled}
                                            hasClear
                                            style={{width: '90%', margin: '0 5%'}}
                                            view="clear"
                                            value={semanticsModalSemanticsCTRThresholdValue}
                                            onUpdate={(val) => {
                                                val = val.replace(',', '.');

                                                const numberVal = Number(val);
                                                const valid = !isNaN(numberVal);

                                                setSemanticsModalSemanticsCTRThresholdValueValid(
                                                    valid,
                                                );
                                                setSemanticsModalSemanticsCTRThresholdValue(val);
                                            }}
                                            validationState={
                                                !semanticsModalSemanticsCTRThresholdValueValid
                                                    ? 'invalid'
                                                    : undefined
                                            }
                                        />
                                    </>
                                </TextTitleWrapper>
                                <div style={{minWidth: 8}} />
                                <TextTitleWrapper
                                    title={
                                        'Вторичная фильтрация фраз\nесли показы больше или равно'
                                    }
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--yc-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--yc-color-base-generic-hover)',
                                                height: 0.5,
                                                width: '100%',
                                            }}
                                        />
                                        <TextInput
                                            disabled={disabled}
                                            view="clear"
                                            hasClear
                                            style={{width: '90%', margin: '0 5%'}}
                                            value={String(
                                                semanticsModalSemanticsSecondThresholdValue,
                                            )}
                                            onUpdate={(val) => {
                                                setSemanticsModalSemanticsSecondThresholdValue(
                                                    Number(val),
                                                );
                                            }}
                                            type="number"
                                        />
                                    </>
                                </TextTitleWrapper>
                                <div style={{minWidth: 8}} />
                                <TextTitleWrapper
                                    title={'Вторичная фильтрация фраз\nесли %CTR меньше или равно'}
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--yc-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--yc-color-base-generic-hover)',
                                                height: 0.5,
                                                width: '100%',
                                            }}
                                        />
                                        <TextInput
                                            disabled={disabled}
                                            hasClear
                                            style={{width: '90%', margin: '0 5%'}}
                                            view="clear"
                                            value={semanticsModalSemanticsSecondCTRThresholdValue}
                                            onUpdate={(val) => {
                                                val = val.replace(',', '.');

                                                const numberVal = Number(val);
                                                const valid = !isNaN(numberVal);

                                                setSemanticsModalSemanticsSecondCTRThresholdValueValid(
                                                    valid,
                                                );
                                                setSemanticsModalSemanticsSecondCTRThresholdValue(
                                                    val,
                                                );
                                            }}
                                            validationState={
                                                !semanticsModalSemanticsSecondCTRThresholdValueValid
                                                    ? 'invalid'
                                                    : undefined
                                            }
                                        />
                                    </>
                                </TextTitleWrapper>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginBottom: 8,
                                }}
                            >
                                <Button
                                    disabled={disabled}
                                    width="max"
                                    selected={semanticsModalIsFixed}
                                    onClick={() => setSemanticsModalIsFixed(!semanticsModalIsFixed)}
                                >
                                    {`Фикс. ${!semanticsModalIsFixed ? 'выкл.' : 'вкл.'}`}
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view={
                                        semanticsAutoPhrasesModalIncludesList.length ||
                                        semanticsAutoPhrasesModalNotIncludesList.length
                                            ? 'flat-success'
                                            : 'normal'
                                    }
                                    selected={
                                        semanticsAutoPhrasesModalIncludesList.length ||
                                        semanticsAutoPhrasesModalNotIncludesList.length
                                            ? true
                                            : undefined
                                    }
                                    onClick={() => {
                                        setSemanticsAutoPhrasesModalFormOpen(
                                            !semanticsAutoPhrasesModalFormOpen,
                                        );
                                    }}
                                >
                                    {`Автофразы`}
                                </Button>
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
                                            height: 'calc(60vh + 40px)',
                                            width: '60vw',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            margin: '30px 30px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: '60vh',
                                                    width: '100%',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Text variant="header-1">
                                                        Фразы должны содержать
                                                    </Text>
                                                    <div style={{minWidth: 8}} />
                                                    <AutoPhrasesWordsSelection
                                                        disabled={disabled}
                                                        items={separetedWords}
                                                        setItems={setSeparetedWords}
                                                        setAutoPhrasesArray={
                                                            setSemanticsAutoPhrasesModalIncludesList
                                                        }
                                                    />
                                                </div>
                                                <div style={{height: 8}} />
                                                <TextInput
                                                    disabled={disabled}
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
                                                        if (disabled) return;
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
                                            <div style={{minWidth: 16}} />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: '60vh',
                                                    width: '100%',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Text variant="header-1">
                                                        Фразы не должны содержать
                                                    </Text>
                                                    <div style={{minWidth: 8}} />
                                                    <AutoPhrasesWordsSelection
                                                        disabled={disabled}
                                                        items={separetedWords}
                                                        setItems={setSeparetedWords}
                                                        setAutoPhrasesArray={
                                                            setSemanticsAutoPhrasesModalNotIncludesList
                                                        }
                                                    />
                                                </div>
                                                <div style={{height: 8}} />
                                                <TextInput
                                                    disabled={disabled}
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
                                                        if (disabled) return;
                                                        let val = Array.from(
                                                            semanticsAutoPhrasesModalNotIncludesList,
                                                        );
                                                        val = val.filter((value) => value != rule);
                                                        setSemanticsAutoPhrasesModalNotIncludesList(
                                                            val,
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
                                                                            setSemanticsAutoPhrasesModalNotIncludesListInput(
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
                                                    items={semanticsAutoPhrasesModalNotIncludesList}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                style={{marginTop: 8}}
                                                size="l"
                                                pin="circle-circle"
                                                view="action"
                                                onClick={() =>
                                                    setSemanticsAutoPhrasesModalFormOpen(false)
                                                }
                                            >
                                                <Text variant="subheader-1">Закрыть</Text>
                                            </Button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>

                            <Button
                                width={'max'}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    for (
                                        let i = 0;
                                        i < semanticsModalSemanticsItemsFiltratedValue.length &&
                                        i < 10;
                                        i++
                                    ) {
                                        parseFirst10Pages(
                                            semanticsModalSemanticsItemsFiltratedValue[i].cluster,
                                            setFetchedPlacements,
                                            setCurrentParsingProgress,
                                        );
                                    }
                                }}
                            >
                                Парсер выдачи первых 10 фраз
                                <Icon size={12} data={LayoutHeader} />
                            </Button>
                            <div style={{minHeight: 8}} />
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
                                            threshold: semanticsModalSemanticsThresholdValue,
                                            ctrThreshold: Number(
                                                semanticsModalSemanticsCTRThresholdValue,
                                            ),
                                            secondThreshold:
                                                semanticsModalSemanticsSecondThresholdValue,
                                            secondCtrThreshold:
                                                semanticsModalSemanticsSecondCTRThresholdValue,
                                            autoPhrasesTemplate: {
                                                includes: semanticsAutoPhrasesModalIncludesList,
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
                                        ctrThreshold: Number(
                                            semanticsModalSemanticsCTRThresholdValue,
                                        ),
                                        secondThreshold:
                                            semanticsModalSemanticsSecondThresholdValue,
                                        secondCtrThreshold:
                                            semanticsModalSemanticsSecondCTRThresholdValue,
                                        autoPhrasesTemplate: {
                                            includes: semanticsAutoPhrasesModalIncludesList,
                                            notIncludes: semanticsAutoPhrasesModalNotIncludesList,
                                        },
                                    };
                                    {
                                        // ADDING TEMPLATE TO ART
                                        if (
                                            semanticsModalOpenFromArt &&
                                            semanticsModalOpenFromArt != ''
                                        ) {
                                            const paramsAddToArt = {
                                                uid: getUid(),
                                                campaignName: selectValue[0],
                                                data: {advertsIds: {}},
                                            };
                                            paramsAddToArt.data.advertsIds[advertId] = {
                                                mode: 'Установить',
                                                templateName: name,
                                                advertId: advertId,
                                            };
                                            callApi(
                                                'setAdvertsPlusPhrasesTemplates',
                                                paramsAddToArt,
                                            );

                                            if (
                                                !doc.advertsPlusPhrasesTemplates[selectValue[0]][
                                                    advertId
                                                ]
                                            )
                                                doc.advertsPlusPhrasesTemplates[selectValue[0]][
                                                    advertId
                                                ] = {};

                                            doc.advertsPlusPhrasesTemplates[selectValue[0]][
                                                advertId
                                            ].templateName = name;
                                        }
                                    }

                                    console.log(params);

                                    setChangedDoc({...doc});

                                    callApi('setPlusPhraseTemplate', params);

                                    setOpen(false);
                                }}
                                disabled={
                                    disabled ||
                                    !semanticsModalSemanticsCTRThresholdValueValid ||
                                    !semanticsModalSemanticsSecondCTRThresholdValueValid
                                }
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxWidth: '90vw',
                            height: 'calc(90vh - 72px)',
                        }}
                    >
                        {wordsFetchUpdate ? (
                            <Loader size="l" />
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Card
                                    view="clear"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'auto',
                                        maxWidth: '90vw',
                                        height: 'calc(55vh)',
                                    }}
                                >
                                    <TheTable
                                        theme="success"
                                        columnData={renameFirstColumn(
                                            columnDataSemantics,
                                            'Фразы в показах',
                                            disabled
                                                ? []
                                                : [
                                                      generateMassAddDelButton({
                                                          placeholder: 'Добавить все',
                                                          array: semanticsModalSemanticsItemsFiltratedValue,
                                                          mode: 'add',
                                                      }),
                                                      generateMassAddDelButton({
                                                          placeholder: 'Удалить все',
                                                          array: semanticsModalSemanticsItemsFiltratedValue,
                                                          mode: 'del',
                                                      }),
                                                  ],
                                        )}
                                        data={semanticsModalSemanticsItemsFiltratedValue}
                                        filters={clustersFiltersActive}
                                        setFilters={setClustersFiltersActive}
                                        filterData={clustersFilterDataActive}
                                        footerData={[semanticsFilteredSummary.active]}
                                        tableId={'advertsWordsActive'}
                                        usePagination={true}
                                        defaultPaginationSize={100}
                                        onPaginationUpdate={({paginatedData}) => {
                                            setSemanticsFilteredSummary((row) => {
                                                const temp = row;
                                                temp.active[
                                                    'cluster'
                                                ] = `На странице фраз: ${paginatedData.length} Всего фраз: ${semanticsModalSemanticsItemsFiltratedValue.length}`;

                                                return temp;
                                            });
                                        }}
                                        height={'calc(55vh - 54px)'}
                                    />
                                </Card>
                                <div style={{minHeight: 8}} />
                                <Card
                                    view="clear"
                                    style={{
                                        height: 'calc(35vh - 96px)',
                                        overflow: 'auto',
                                        maxWidth: '90vw',
                                    }}
                                >
                                    <TheTable
                                        theme="danger"
                                        columnData={renameFirstColumn(
                                            columnDataSemantics2,
                                            'Исключенные фразы',
                                            disabled
                                                ? []
                                                : [
                                                      generateMassAddDelButton({
                                                          placeholder: 'Добавить все',
                                                          array: semanticsModalSemanticsMinusItemsFiltratedValue,
                                                          mode: 'add',
                                                      }),
                                                      generateMassAddDelButton({
                                                          placeholder: 'Удалить все',
                                                          array: semanticsModalSemanticsMinusItemsFiltratedValue,
                                                          mode: 'del',
                                                      }),
                                                  ],
                                        )}
                                        data={semanticsModalSemanticsMinusItemsFiltratedValue}
                                        filters={clustersFiltersMinus}
                                        setFilters={setClustersFiltersMinus}
                                        filterData={clustersFilterDataMinus}
                                        footerData={[semanticsFilteredSummary.minus]}
                                        tableId={'advertsWordsMinus'}
                                        usePagination={true}
                                        defaultPaginationSize={100}
                                        onPaginationUpdate={({paginatedData}) => {
                                            setSemanticsFilteredSummary((row) => {
                                                const temp = row;
                                                temp.minus[
                                                    'cluster'
                                                ] = `На странице фраз: ${paginatedData.length} Всего фраз: ${semanticsModalSemanticsMinusItemsFiltratedValue.length}`;

                                                return temp;
                                            });
                                        }}
                                        height={'calc(35vh - 96px - 54px)'}
                                    />
                                    <div style={{minHeight: 8}} />
                                </Card>
                            </div>
                        )}
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
};
