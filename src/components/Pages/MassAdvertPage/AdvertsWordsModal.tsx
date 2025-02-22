'use client';

import {
    Button,
    Card,
    Icon,
    List,
    Loader,
    Modal,
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
    ArrowRight,
    CaretUp,
    Plus,
    CaretDown,
    Minus,
    Magnifier,
    ArrowShapeUp,
} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {
    Children,
    isValidElement,
    ReactElement,
    ReactNode,
    useEffect,
    useState,
    cloneElement,
} from 'react';
import TheTable, {compare} from '@/components/TheTable';
import {parseFirst10Pages} from './ParseFirst10Pages';
import callApi, {getUid} from '@/utilities/callApi';
import {defaultRender, getRoundValue, renderAsPercent} from '@/utilities/getRoundValue';
import {AutoPhrasesWordsSelection} from './AutoPhrasesWordsSelection';
import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {useCampaign} from '@/contexts/CampaignContext';
import {renderGradNumber} from '@/utilities/renderGradNumber';
import {getMedian} from '@/utilities/getMedian';

interface AdvertsWordsModalProps {
    children: ReactNode;
    disabled: boolean;
    doc: any;
    advertId: number | string;
    art: any;
    setChangedDoc: (arg?: any) => any;
    setFetchedPlacements: (arg?: any) => any;
    currentParsingProgress: any;
    setCurrentParsingProgress: (arg?: any) => any;
}

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
}: AdvertsWordsModalProps) => {
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
    const [phrasesExcludedByMinus, setPhrasesExcludedByMinus] = useState<any[]>([]);
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

    const [semanticsFilteredSummary, setSemanticsFilteredSummary] = useState<any>({
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

    const [semanticsFilteredSummaryAvg, setSemanticsFilteredSummaryAvg] = useState<any>({
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

    const [semanticsFilteredSummaryMedian, setSemanticsFilteredSummaryMedian] = useState({
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
    const [clustersFiltersActive, setClustersFiltersActive] = useState<any>({undef: false});
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
                for (const [filterArg, data] of Object.entries(_clustersFilters)) {
                    const filterData: any = data;
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
        semanticsFilteredSummary.active.cpc = getRoundValue(sum / 100, clicks, true, sum / 100);
        semanticsFilteredSummary.active.ctr = getRoundValue(clicks, count, true);
        for (const [key, val] of Object.entries(semanticsFilteredSummary.active)) {
            if (typeof val !== 'number') continue;
            if (key === 'cpc' || key === 'ctr') {
                semanticsFilteredSummaryAvg.active[key] = val;
                continue;
            }
            semanticsFilteredSummaryAvg.active[key] = Math.round(val / _clusters.length);
        }
        setSemanticsFilteredSummaryAvg(semanticsFilteredSummaryAvg);
        console.log('clusters', clusters);
        semanticsFilteredSummaryMedian.active = getMedian(
            _clusters,
            semanticsFilteredSummaryMedian.active,
        ) as any;
        console.log('median active', semanticsFilteredSummaryMedian.active);

        setSemanticsFilteredSummaryMedian(semanticsFilteredSummaryMedian);
        semanticsFilteredSummary.active.cpc = semanticsFilteredSummaryMedian.active.cpc;
        semanticsFilteredSummary.active.ctr = semanticsFilteredSummaryMedian.active.ctr;
        setSemanticsFilteredSummary(semanticsFilteredSummary);
    };

    const [clustersFiltersMinus, setClustersFiltersMinus] = useState<any>({undef: false});
    const clustersFilterDataMinus = (withfFilters: any, clusters: any[]) => {
        const _clustersFilters = withfFilters ?? clustersFiltersMinus;
        const _clusters = clusters ?? semanticsModalSemanticsMinusItemsValue;

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
            for (const [filterArg, data] of Object.entries(_clustersFilters)) {
                const filterData: any = data;
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
        semanticsFilteredSummary.minus.cpc = getRoundValue(sum / 100, clicks, true, sum / 100);
        semanticsFilteredSummary.minus.ctr = getRoundValue(clicks, count, true);
        for (const [key, val] of Object.entries(semanticsFilteredSummary.minus)) {
            if (typeof val !== 'number') continue;
            if (key === 'cpc' || key === 'ctr') {
                semanticsFilteredSummaryAvg.minus[key] = val;
                continue;
            }
            semanticsFilteredSummaryAvg.minus[key] = Math.round(val / _clusters.length);
        }

        setSemanticsFilteredSummaryAvg(semanticsFilteredSummaryAvg);
        semanticsFilteredSummaryMedian.minus = getMedian(
            _clusters,
            semanticsFilteredSummaryMedian.active,
        ) as any;
        console.log('median minus', semanticsFilteredSummaryMedian.minus);
        setSemanticsFilteredSummaryMedian(semanticsFilteredSummaryMedian);

        for (const [key, val] of Object.entries(semanticsFilteredSummary.minus)) {
            if (typeof val !== 'number') continue;
            if (key === 'cpc' || key === 'ctr') {
                semanticsFilteredSummary.minus[key] = semanticsFilteredSummaryMedian.minus[key];
            }
        }
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
                    excluded: words ? (words['excluded'] ?? []) : [],
                    clusters: words ? (words['clusters'] ?? []) : [],
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
                    temp.sort((a: any, b: any) => {
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
                            freq: any;
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
                    temp.sort((a: any, b: any) => {
                        const freqA = a.freq ? a.freq.val : 0;
                        const freqB = b.freq ? b.freq.val : 0;
                        return freqB - freqA;
                    });

                    const tempPresets = [] as any[];
                    for (const [_cluster, clusterData] of Object.entries(temp)) {
                        const {preset, freq} = (clusterData as {
                            preset: string;
                            cluster: string;
                            freq: any;
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

                const phrasesExcludedByMinusTemp =
                    doc?.plusPhrasesTemplates?.[selectValue[0]]?.[plusPhrasesTemplate]
                        ?.phrasesExcludedByMinus ?? [];
                setPhrasesExcludedByMinus(phrasesExcludedByMinusTemp);

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
                    ? (doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate].isFixed ??
                      false)
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
    const [separetedWordsObj, setseparetedWordsObj] = useState({});
    useEffect(() => {
        const obj: any = {};
        const temp = [] as string[];
        for (const row of semanticsModalSemanticsItemsValue) {
            const {cluster, freq} = row;
            const words = (cluster as string).split(' ');
            for (const word of words) {
                if (!obj[word]) obj[word] = 0;
                obj[word] += freq ?? 0;
                if (!temp.includes(word)) temp.push(word);
            }
        }
        for (const row of semanticsModalSemanticsMinusItemsValue) {
            const {cluster, freq} = row;
            const words = (cluster as string).split(' ');
            for (const word of words) {
                if (!obj[word]) obj[word] = 0;
                obj[word] += freq ?? 0;
                if (!temp.includes(word)) temp.push(word);
            }
        }
        temp.sort((a, b) => obj[b] - obj[a]);
        setSeparetedWords(temp);
        setseparetedWordsObj(obj);
    }, [semanticsModalSemanticsItemsValue, semanticsModalSemanticsMinusItemsValue]);

    const columnDataSemantics = [
        {
            name: 'preset',
            valueType: 'text',
            placeholder: 'Пресет',
            constWidth: 100,
            render: ({value, row}: any) => {
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
            render: ({value, footer}: any) => {
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
                        <div style={{display: 'flex', flexDirection: 'row', columnGap: 4}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
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

                                    const params: any = {
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
                            <Button
                                disabled={disabled}
                                size="xs"
                                view={
                                    phrasesExcludedByMinus.includes(value)
                                        ? 'outlined-danger'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    let val = Array.from(phrasesExcludedByMinus);
                                    const cluster = value;
                                    if (!val.includes(cluster)) {
                                        val.push(cluster);
                                    } else {
                                        val = val.filter((value) => value != cluster);
                                    }

                                    setPhrasesExcludedByMinus(val);
                                }}
                            >
                                <Icon data={Minus} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'freq',
            placeholder: 'Частота',
            render: ({value, row, footer}: any) => {
                const {freqTrend} = row;
                return (
                    <Tooltip content={`${freqTrend > 0 ? '+' : ''}${freqTrend}`}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            {renderGradNumber(
                                {value: value, footer},
                                semanticsFilteredSummaryMedian.active['freq'],
                                defaultRender,
                            )}
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
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.active['count'],
                    defaultRender,
                );
            },
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт',
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.active['clicks'],
                    defaultRender,
                );
            },
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.active['ctr'],
                    renderAsPercent,
                );
            },
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.active['cpc'],
                    defaultRender,
                    'desc',
                );
            },
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
            render: ({value}: any) => defaultRender({value: getRoundValue(value, 1)}),
        },
        {
            name: 'placements',
            placeholder: 'Позиция, №',
            render: ({value, row}: any) => {
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
            render: ({value}: any) => {
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
            render: ({value, footer}: any) => {
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
                        <div style={{display: 'flex', flexDirection: 'row', columnGap: 4}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
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

                                    const params: any = {
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
                            <Button
                                disabled={disabled}
                                size="xs"
                                view={
                                    phrasesExcludedByMinus.includes(value)
                                        ? 'outlined-danger'
                                        : 'outlined'
                                }
                                onClick={() => {
                                    let val = Array.from(phrasesExcludedByMinus);
                                    const cluster = value;
                                    if (!val.includes(cluster)) {
                                        val.push(cluster);
                                    } else {
                                        val = val.filter((value) => value != cluster);
                                    }

                                    setPhrasesExcludedByMinus(val);
                                }}
                            >
                                <Icon data={Minus} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'freq',
            placeholder: 'Частота',
            render: ({value, row, footer}: any) => {
                const {freqTrend} = row;
                return (
                    <Tooltip content={`${freqTrend > 0 ? '+' : ''}${freqTrend}`}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            {renderGradNumber(
                                {value: value, footer},
                                semanticsFilteredSummaryMedian.minus['freq'],
                                defaultRender,
                            )}
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
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.minus['count'],
                    defaultRender,
                );
            },
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт',
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.minus['clicks'],
                    defaultRender,
                );
            },
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.minus['ctr'],
                    renderAsPercent,
                );
            },
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
            render: ({value, footer}: any) => {
                return renderGradNumber(
                    {value: value, footer},
                    semanticsFilteredSummaryMedian.active['cpc'],
                    defaultRender,
                    'desc',
                );
            },
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
            render: ({value}: any) => defaultRender({value: getRoundValue(value, 1)}),
        },
        {
            name: 'placements',
            placeholder: 'Позиция, №',
            render: ({value, row}: any) => {
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

    const renameFirstColumn = (colss: any, newName: string, additionalNodes = [] as any[]) => {
        const index = 1;
        const columnDataSemanticsCopy = Array.from(colss) as any[];
        columnDataSemanticsCopy[index].placeholder = newName;
        columnDataSemanticsCopy[index].additionalNodes = additionalNodes;
        return columnDataSemanticsCopy;
    };
    const generateMassAddDelButton = ({placeholder, array, mode}: any) => {
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

    const generateMassMinusButton = ({placeholder, array, mode}: any) => {
        return (
            <Button
                style={{marginLeft: 8}}
                view="outlined"
                onClick={() => {
                    const val = [] as any[];
                    if (mode == 'add') {
                        val.push(...Array.from(phrasesExcludedByMinus));
                        for (let i = 0; i < array.length; i++) {
                            const cluster = array[i].cluster;
                            if (val.includes(cluster)) continue;
                            val.push(cluster);
                        }
                    } else if (mode == 'del') {
                        const clustersToDel = [] as string[];
                        for (const clusterData of array) clustersToDel.push(clusterData.cluster);
                        for (let i = 0; i < phrasesExcludedByMinus.length; i++) {
                            const cluster = phrasesExcludedByMinus[i];
                            if (clustersToDel.includes(cluster)) continue;
                            if (val.includes(cluster)) continue;
                            val.push(cluster);
                        }
                    }
                    setPhrasesExcludedByMinus(val);
                }}
            >
                {placeholder}
            </Button>
        );
    };

    const filterByButtonClusters = (
        val: any,
        activeFlag: any,
        key = 'art',
        compMode = 'include',
    ) => {
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

    const triggerButton = cloneElement(triggerElement, {
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
                        paddingBlock: '8px',
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
                                        'Первичная фильтрация кластеров\nесли показы больше или равно'
                                    }
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--g-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--g-color-base-generic-hover)',
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
                                    title={
                                        'Первичная фильтрация кластеров\nесли %CTR меньше или равно'
                                    }
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--g-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--g-color-base-generic-hover)',
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
                                            startContent={<Text>%</Text>}
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
                                        'Вторичная фильтрация кластеров\nесли показы больше или равно'
                                    }
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--g-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--g-color-base-generic-hover)',
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
                                    title={
                                        'Вторичная фильтрация кластеров\nесли %CTR меньше или равно'
                                    }
                                    style={{
                                        width: '100%',
                                        border: '1px solid var(--g-color-base-generic-hover)',
                                        borderRadius: 8,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    <>
                                        <div
                                            style={{
                                                background: 'var(--g-color-base-generic-hover)',
                                                height: 0.5,
                                                width: '100%',
                                            }}
                                        />
                                        <TextInput
                                            startContent="%"
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
                                                        itemsTemp={separetedWords}
                                                        autoPhrasesPlusList={
                                                            semanticsAutoPhrasesModalIncludesList
                                                        }
                                                        autoPhrasesMinusList={
                                                            semanticsAutoPhrasesModalNotIncludesList
                                                        }
                                                        itemsObj={separetedWordsObj}
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
                                                        itemsTemp={separetedWords}
                                                        itemsObj={separetedWordsObj}
                                                        setAutoPhrasesArray={
                                                            setSemanticsAutoPhrasesModalNotIncludesList
                                                        }
                                                        autoPhrasesPlusList={
                                                            semanticsAutoPhrasesModalIncludesList
                                                        }
                                                        autoPhrasesMinusList={
                                                            semanticsAutoPhrasesModalNotIncludesList
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
                                            phrasesExcludedByMinus,
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
                                        phrasesExcludedByMinus,
                                    };
                                    {
                                        // ADDING TEMPLATE TO ART
                                        if (
                                            semanticsModalOpenFromArt &&
                                            semanticsModalOpenFromArt != ''
                                        ) {
                                            const paramsAddToArt: any = {
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
                                            'Активные кластеры',
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
                                        onPaginationUpdate={({paginatedData}: any) => {
                                            setSemanticsFilteredSummary((row: any) => {
                                                const temp = row;
                                                temp.active['cluster'] =
                                                    `Кластеров на странице: ${paginatedData.length} Всего кластеров: ${semanticsModalSemanticsItemsFiltratedValue.length}`;

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
                                            'Исключенные кластеры',
                                            disabled
                                                ? []
                                                : [
                                                      generateMassMinusButton({
                                                          placeholder: 'Минусы вкл',
                                                          array: semanticsModalSemanticsMinusItemsFiltratedValue,
                                                          mode: 'add',
                                                      }),
                                                      generateMassMinusButton({
                                                          placeholder: 'Минусы выкл',
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
                                        onPaginationUpdate={({paginatedData}: any) => {
                                            setSemanticsFilteredSummary((row: any) => {
                                                const temp = row;
                                                temp.minus['cluster'] =
                                                    `Кластеров на странице: ${paginatedData.length} Всего кластеров: ${semanticsModalSemanticsMinusItemsFiltratedValue.length}`;

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
