'use client';
import {PageInfoGraphs} from './PageInfoGraphs';
import {CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    Spin,
    Button,
    Text,
    Card,
    Link,
    Icon,
    Popover,
    Modal,
    Skeleton,
    List,
    Tooltip,
    ButtonPin,
    ButtonSize,
    ButtonView,
    IconData,
} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import {
    Rocket,
    Magnifier,
    LayoutHeader,
    ArrowsRotateLeft,
    ArrowShapeDown,
    ChartLine,
    ArrowRotateLeft,
    CircleRuble,
    TShirt,
    SlidersVertical,
    ArrowShapeUp,
    Minus,
    Plus,
    Play,
    ArrowRight,
    Clock,
    Check,
    TagRuble,
    Cherry,
    Xmark,
    TriangleExclamation,
} from '@gravity-ui/icons';

import {motion} from 'framer-motion';

import ChartKit, {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
settings.set({plugins: [YagrPlugin]});
import callApi, {getUid} from '@/utilities/callApi';
import {
    defaultRender,
    getNormalDateRange,
    renderAsPercent,
    renderSlashPercent,
} from '@/utilities/getRoundValue';
import TheTable, {compare} from '@/components/TheTable';
import {RangePicker} from '@/components/RangePicker';
import {AutoSalesModal} from './AutoSalesModal';
import {TagsFilterModal} from '@/components/TagsFilterModal';
import {PhrasesModal} from './PhrasesModal';
import {AdvertCard} from './AdvertCard';
import {AdvertsBidsModal} from './AdvertsBidsModal';
import {AdvertsBudgetsModal} from './AdvertsBudgetsModal';
import {LogoLoad} from '@/components/logoLoad';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useCampaign} from '@/contexts/CampaignContext';
import {CanBeAddedToSales} from './CanBeAddedToSales';
import {StocksByWarehousesPopup} from './StocksByWarehousesPopup';
import {AdvertsSchedulesModal} from './AdvertsSchedulesModal';
import {AdvertsStatusManagingModal} from './AdvertsStatusManagingModal';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {getEnumurationString} from '@/utilities/getEnumerationString';
import {AdvertCreateModal} from '@/features/advertising/AdvertCreationModal';
import DzhemPhrasesModal from './DzhemPhrasesModal';
import {PopupFilterArts} from './PopupFilterArts';
import {Auction} from './Auction';
import {parseFirst10Pages} from './ParseFirst10Pages';
import {useModules} from '@/contexts/ModuleProvider';
import {HelpMark} from '@/components/Popups/HelpMark';
import {CopyButton} from '@/components/Buttons/CopyButton';
import {Note} from './NotesForArt/types';
import {NotesForArt} from './NotesForArt';
import {getNamesForAdverts} from '@/entities';
import {ShortAdvertTemplateInfo} from '@/entities/types/ShortAdvertTemplateInfo';
import {changeSelectedPhrase} from '@/features/advertising/AdvertsWordsModal/api/changeSelectedPhrase';
import {StatisticsPanel} from '@/widgets/ui';
import {AdvertStatsByDayModalForNmId} from '@/features/advertising/AdvertStatsByDayModal/ui/AdvertStatsByDayModalForNmId';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        if (mode && doc) {
            doc['campaigns'][selectValue] = docum['campaigns'][selectValue];
            doc['balances'][selectValue] = docum['balances'][selectValue];
            doc['plusPhrasesTemplates'][selectValue] = docum['plusPhrasesTemplates'][selectValue];
            doc['advertsPlusPhrasesTemplates'][selectValue] =
                docum['advertsPlusPhrasesTemplates'][selectValue];
            doc['adverts'][selectValue] = docum['adverts'][selectValue];
            doc['advertsSelectedPhrases'][selectValue] =
                docum['advertsSelectedPhrases'][selectValue];
            doc['advertsSchedules'][selectValue] = docum['advertsSchedules'][selectValue];
            doc['autoSales'][selectValue] = docum['autoSales'][selectValue];

            if (
                doc['dzhemData'] &&
                doc['dzhemData'][selectValue] &&
                docum['dzhemData'] &&
                docum['dzhemData'][selectValue]
            )
                doc['dzhemData'][selectValue] = docum['dzhemData'][selectValue];
        }
        setDocument(docum);
    }

    return doc;
};

export const MassAdvertPage = () => {
    const [selectedNmId, setSelectedNmId] = useState(0);
    const {showError} = useError();
    const {availablemodulesMap} = useModules();
    const permission: string = useMemo(() => {
        console.log(availablemodulesMap);

        return availablemodulesMap['massAdvert'];
    }, [availablemodulesMap]);
    const {selectValue, setSwitchingCampaignsFlag, sellerId} = useCampaign();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [advertBudgetRules, setAdvertBudgetRules] = useState<any>([]);
    const fetchAdvertBudgetRules = async () => {
        try {
            const response = await ApiClient.post('massAdvert/get-advert-budget-rules', {
                seller_id: sellerId,
            });
            if (!response?.data) {
                throw new Error('error while getting advertBudgetRules');
            }
            const temp = response?.data;
            setAdvertBudgetRules(temp);
        } catch (error: any) {
            console.error(error);
            showError(error);
        }
    };

    const [advertsTodayDrr, setAdvertsTodayDrr] = useState<{[key: string]: number}>({});
    const fetchAdvertsTodayDrr = async () => {
        try {
            const response = await ApiClient.post('massAdvert/new/get-advert-today-drr', {
                seller_id: sellerId,
            });
            if (response?.data) {
                setAdvertsTodayDrr(response?.data);
            }
        } catch (error: any) {
            console.error(error);
            showError(error);
        }
    };
    useEffect(() => {
        fetchAdvertBudgetRules();
    }, [sellerId]);

    useEffect(() => {
        if (!selectValue[0]) return;

        callApi('getAvailableAutoSaleNmIds', {
            seller_id: sellerId,
        })
            .then((res) => {
                if (!res) throw 'no response';
                const nmIds = res['data'] ?? {};
                setAvailableAutoSalesNmIds(nmIds ?? []);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [sellerId]);

    const cardStyle: any = {
        minWidth: '10em',
        height: '10em',
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
        marginRight: '8px',
        marginLeft: '8px',
    };

    const [stocksByWarehouses, setStocksByWarehouses] = useState<any>({});
    useEffect(() => {
        const params = {seller_id: sellerId};
        callApi('getStocksByWarehouses', params).then((res) => {
            if (!res || !res['data']) return;

            setStocksByWarehouses(res['data']);
        });
    }, [sellerId]);

    const [selectedSearchPhrase, setSelectedSearchPhrase] = useState<string>('');
    const [filtersRK, setFiltersRK] = useState<any>({
        scheduleRules: false,
        budgetRules: false,
        phrasesRules: false,
        bidderRules: false,
        activeAdverts: false,
        pausedAdverts: false,
    });

    const [semanticsModalOpenFromArt, setSemanticsModalOpenFromArt] = useState('');
    const [currentParsingProgress, setCurrentParsingProgress] = useState<any>({});

    const [pausedAdverts, setPausedAdverts] = useState({} as any);
    const [updatePaused, setUpdatePaused] = useState(true);

    const getPaused = async () => {
        try {
            const params = {seller_id: sellerId};
            const res = await ApiClient.post('massAdvert/get-paused', params);
            console.log(res?.data);
            if (!res || !res.data) {
                throw new Error('Request without result');
            }
            setPausedAdverts(res.data);
        } catch (error) {
            console.error('Error while getting paused adverts', error);
        }
        setUpdatePaused(false);
    };

    useEffect(() => {
        if (!updatePaused) return;
        getPaused();
    }, [updatePaused]);

    const [autoSalesModalOpenFromParent, setAutoSalesModalOpenFromParent] = useState('');

    const [fetchedPlacements, setFetchedPlacements] = useState<any>(undefined);

    const [filters, setFilters] = useState<any>({undef: false});

    const [availableAutoSalesNmIds, setAvailableAutoSalesNmIds] = useState([] as any[]);
    const [autoSalesProfits, setAutoSalesProfits] = useState<any>({});
    const [filterAutoSales, setFilterAutoSales] = useState(false);

    const [placementsDisplayPhrase, setPlacementsDisplayPhrase] = useState('');

    const [copiedAdvertsSettings, setCopiedAdvertsSettings] = useState({advertId: 0});

    const getNotes = async () => {
        try {
            const params = {seller_id: sellerId};
            const res = await ApiClient.post('massAdvert/notes/getNotes', params);
            console.log(res?.data);
            if (!res || !res.data) {
                throw new Error('Request without result');
            }
            setAllNotes(res.data);
        } catch (error) {
            console.error('Error while getting all notes', error);
        }
    };

    const [allNotes, setAllNotes] = useState<{[key: string]: Note[]} | undefined>();
    const [reloadNotes, setReloadNotes] = useState<boolean>(true);
    useEffect(() => {
        if (reloadNotes) {
            console.log('privet kak del');
            getNotes();
            setReloadNotes(false);
        }
    }, [sellerId, reloadNotes]);

    const [showDzhemModalOpen, setShowDzhemModalOpen] = useState(false);

    const [advertsArtsListModalFromOpen, setAdvertsArtsListModalFromOpen] = useState(false);
    const [rkList, setRkList] = useState<any[]>([]);
    const [rkListMode, setRkListMode] = useState('add');

    const [pagesCurrent, setPagesCurrent] = useState(1);

    const [shortAdvertInfo, setShortAdvertInfo] = useState<{
        [key: string]: ShortAdvertTemplateInfo;
    }>({});

    const getNames = async () => {
        try {
            getSelectedPhrases();
            const templates = await getNamesForAdverts(sellerId);
            setShortAdvertInfo(templates);
        } catch (error) {
            console.error(error);
        }
    };

    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);

    const [unvalidatedArts, setUnvalidatedArts] = useState<any[]>([]);

    const getUnvalidatedArts = async () => {
        try {
            const params = {seller_id: sellerId, fields: ['prices', 'tax']};
            const response = await ApiClient.post('massAdvert/unvalidatedArts', params);
            if (!response?.data) {
                throw new Error('error while getting unvalidatedArts');
            }
            console.log('unvalidatedArts', response?.data?.unvalidatedArts);
            setUnvalidatedArts(response?.data?.unvalidatedArts);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUnvalidatedArts();
    }, [sellerId]);

    const updateColumnWidth = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        filterTableData({adverts: {val: '', mode: 'include'}}, data);
    };

    const manageAdvertsActivityCallFunc = async (mode: string, advertId: any) => {
        const params: any = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {
                advertsIds: {},
                mode: mode,
            },
        };
        params.data.advertsIds[advertId] = {advertId: advertId};

        //////////////////////////////////
        return await callApi('manageAdvertsActivity', params);
        //////////////////////////////////
    };

    const filterByButton = (val: any, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val) + ' ', compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const [advertsSelectedPhrases, setAdvertsSelectedPhrases] = useState({} as any);
    const getSelectedPhrases = async () => {
        try {
            const response = await ApiClient.post('massAdvert/new/get-selected-phrases', {
                seller_id: sellerId,
            });

            if (!response) throw new Error('Не удалось получить мастер фразы');
            setAdvertsSelectedPhrases(
                (response?.data?.selectedPhrases as any[])?.reduce((obj, entry) => {
                    obj[entry?.advertId] = entry?.selectedPhrase;
                    return obj;
                }, {}),
            );
        } catch (error) {}
    };

    const columnData: any = [
        {
            name: 'art',
            placeholder: 'Артикул',
            width: 200,
            additionalNodes: [
                <Button
                    style={{marginLeft: 5, marginRight: 5}}
                    view="outlined"
                    selected={filterAutoSales}
                    onClick={() => {
                        setFilterAutoSales(!filterAutoSales);
                        filterTableData(filters, data, !filterAutoSales);
                    }}
                >
                    <Icon data={TagRuble} />
                </Button>,
                <CopyButton
                    tooltip="Нажмите, чтобы скопировать артикулы в таблице в буфер обмена"
                    view="outlined"
                    copyText={() => {
                        const arts: number[] = [];
                        for (const row of filteredData) {
                            const {nmId} = row;
                            if (!arts.includes(nmId)) arts.push(nmId);
                        }
                        return arts.join(', ');
                    }}
                />,
            ],
            render: ({value, row, footer, index}: any) => {
                const {title, brand, object, nmId, photos, imtId, art, tags} = row;
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
                /// tags
                const tagsNodes = [] as ReactNode[];
                const autoSalesInfo = doc?.['autoSales']?.[selectValue[0]]?.[nmId];
                const {fixedPrices} = autoSalesInfo ?? {};
                const inActionNow =
                    autoSalesInfo?.autoSaleName && autoSalesInfo?.autoSaleName !== '';
                const {autoSaleName} = fixedPrices ?? {};
                if (autoSalesInfo && ((autoSaleName && autoSaleName != '') || inActionNow)) {
                    tagsNodes.push(
                        <div>
                            <CanBeAddedToSales
                                nmId={nmId}
                                sellerId={sellerId}
                                pin="circle-clear"
                                view={inActionNow ? 'outlined-action' : 'outlined'}
                                selected={false}
                                setAutoSalesModalOpenFromParent={setAutoSalesModalOpenFromParent}
                            />
                            {autoSalesInfo['fixedPrices'] &&
                            autoSalesInfo['fixedPrices']['dateRange'] ? (
                                <Button
                                    size="xs"
                                    pin="clear-clear"
                                    view={inActionNow ? 'outlined-action' : 'outlined'}
                                    selected={false}
                                    onClick={() => {
                                        const params = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            nmIds: [nmId],
                                        };
                                        console.log(params);
                                        delete doc.autoSales[selectValue[0]][nmId];
                                        setChangedDoc({...doc});
                                        callApi('deleteAutoSaleFromNmIds', params);
                                    }}
                                >
                                    <Icon data={Xmark} size={12} />
                                </Button>
                            ) : (
                                <></>
                            )}
                            <Popover
                                disabled={!fixedPrices?.dateRange}
                                openDelay={1000}
                                placement={'bottom'}
                                content={
                                    <Text variant="subheader-1">
                                        {autoSalesInfo['fixedPrices'] &&
                                        autoSalesInfo['fixedPrices']['dateRange'] ? (
                                            autoSalesInfo['fixedPrices']['dateRange'] ? (
                                                `${new Date(
                                                    autoSalesInfo['fixedPrices']['dateRange'][0],
                                                ).toLocaleDateString('ru-RU')}
                                                        - ${new Date(
                                                            autoSalesInfo['fixedPrices'][
                                                                'dateRange'
                                                            ][1],
                                                        ).toLocaleDateString('ru-RU')}`
                                            ) : (
                                                'Выберите даты акции'
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </Text>
                                }
                            >
                                <Button
                                    size="xs"
                                    pin={'clear-circle'}
                                    view={inActionNow ? 'outlined-action' : 'outlined'}
                                    selected={false}
                                >
                                    <Text>{autoSaleName ?? autoSalesInfo?.autoSaleName}</Text>
                                </Button>
                            </Popover>
                        </div>,
                    );
                    tagsNodes.push(<div style={{minWidth: 8}} />);
                } else if (availableAutoSalesNmIds.includes(nmId)) {
                    tagsNodes.push(
                        <CanBeAddedToSales
                            nmId={nmId}
                            sellerId={sellerId}
                            view={'flat-action'}
                            selected={false}
                            pin="circle-circle"
                            setAutoSalesModalOpenFromParent={setAutoSalesModalOpenFromParent}
                        />,
                    );
                    tagsNodes.push(<div style={{minWidth: 8}} />);
                }
                if (tags) {
                    for (let i = 0; i < tags.length; i++) {
                        const tag = tags[i];
                        if (!tag) continue;
                        tagsNodes.push(
                            <Button
                                content={'div'}
                                size="xs"
                                pin="circle-circle"
                                selected
                                view="outlined-info"
                                onClick={() => filterByButton(tag.toUpperCase())}
                            >
                                {tag.toUpperCase()}
                            </Button>,
                        );
                        tagsNodes.push(<div style={{minWidth: 8}} />);
                    }
                    tagsNodes.pop();
                }
                return footer ? (
                    <div style={{height: 28}}>{value}</div>
                ) : (
                    <div
                        style={{
                            position: 'relative',
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
                                display: 'flex',
                                flexDirection: 'row',
                                marginRight: 40,
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: `${String(filteredData.length).length * 6}px`,
                                    margin: '0 16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {Math.floor((pagesCurrent - 1) * 100 + index + 1)}
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
                                        openDelay={1000}
                                        closeDelay={1000}
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
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Button
                                                disabled={permission != 'Управление'}
                                                size="xs"
                                                pin="brick-brick"
                                                view="outlined"
                                                onClick={() => {
                                                    setAdvertsArtsListModalFromOpen(true);
                                                    const adverts = doc.adverts[selectValue[0]];
                                                    const temp = [] as any[];
                                                    if (adverts) {
                                                        for (const [_, data] of Object.entries(
                                                            adverts,
                                                        )) {
                                                            const advertData: any = data;
                                                            if (!advertData) continue;
                                                            temp.push(advertData['advertId']);
                                                        }
                                                    }
                                                    setSemanticsModalOpenFromArt(art);
                                                    setRkList(temp ?? []);
                                                    setRkListMode('add');
                                                }}
                                            >
                                                <Icon data={Plus} />
                                            </Button>
                                            <div style={{minWidth: 2}} />
                                            <Button
                                                disabled={permission != 'Управление'}
                                                size="xs"
                                                pin="brick-brick"
                                                view="outlined"
                                                onClick={() => {
                                                    setAdvertsArtsListModalFromOpen(true);
                                                    const adverts = row.adverts;
                                                    const temp = [] as any[];
                                                    if (adverts) {
                                                        for (const [_, data] of Object.entries(
                                                            adverts,
                                                        )) {
                                                            const advertData: any = data;
                                                            if (!advertData) continue;
                                                            temp.push(advertData['advertId']);
                                                        }
                                                    }
                                                    setSemanticsModalOpenFromArt(art);
                                                    setRkList(temp ?? []);
                                                    setRkListMode('delete');
                                                }}
                                            >
                                                <Icon data={Xmark} />
                                            </Button>
                                        </div>
                                        <div style={{minHeight: 2}} />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <AdvertStatsByDayModalForNmId
                                                docCampaign={doc.campaigns[selectValue[0]]}
                                                art={art}
                                                dateRange={dateRange}
                                            />
                                            <div style={{minWidth: 2}} />
                                            <Button
                                                pin="brick-brick"
                                                view="outlined"
                                                size="xs"
                                                onClick={() => {
                                                    const dzhem = doc.dzhemData
                                                        ? doc.dzhemData[selectValue[0]]
                                                            ? doc.dzhemData[selectValue[0]][value]
                                                                ? (doc.dzhemData[selectValue[0]][
                                                                      value
                                                                  ].phrasesStats ?? undefined)
                                                                : undefined
                                                            : undefined
                                                        : undefined;
                                                    console.log(
                                                        value,
                                                        doc.dzhemData[selectValue[0]][value],
                                                    );
                                                    const temp = [] as any[];
                                                    if (dzhem)
                                                        for (const [
                                                            phrase,
                                                            stats,
                                                        ] of Object.entries(dzhem)) {
                                                            const phrasesStats: any = stats;
                                                            if (!phrase || !phrasesStats) continue;
                                                            phrasesStats['phrase'] = phrase;
                                                            temp.push(phrasesStats);
                                                        }
                                                    temp.sort((a, b) => {
                                                        return b?.openCardCount - a?.openCardCount;
                                                    });
                                                    setSelectedNmId(nmId);
                                                    setShowDzhemModalOpen(true);
                                                }}
                                            >
                                                <Icon data={Cherry}></Icon>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: 4}} />
                                <div
                                    style={{display: 'flex', flexDirection: 'column', width: '100'}}
                                >
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
                                            width: '100',
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
                                            maxWidth: '100%',
                                            paddingRight: '100%',
                                            overflowX: 'scroll',
                                        }}
                                    >
                                        {tagsNodes}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{position: 'absolute', top: 0, right: 0, zIndex: 1000}}>
                            <NotesForArt
                                notes={allNotes?.[nmId as string] || []}
                                nmId={nmId}
                                reloadNotes={setReloadNotes}
                            />
                        </div>
                    </div>
                );
            },
            valueType: 'text',
            group: true,
        },
        Object.keys(autoSalesProfits ?? []).length == 0
            ? {
                  name: 'adverts',
                  placeholder: 'Реклама',
                  valueType: 'text',
                  additionalNodes: [
                      <Button
                          style={{marginLeft: 5}}
                          view="outlined"
                          onClick={() => filterByButton('авто', 'adverts')}
                      >
                          <Icon data={Rocket} size={14} />
                      </Button>,
                      <Button
                          style={{marginLeft: 5}}
                          view="outlined"
                          onClick={() => filterByButton('поиск', 'adverts')}
                      >
                          <Icon data={Magnifier} size={14} />
                      </Button>,
                      <PopupFilterArts setFilters={setFiltersRK} filters={filtersRK} />,
                      <div
                          style={{
                              display: 'flex',
                              flexDirection: 'column',
                              marginBottom: 5,
                              marginLeft: 4,
                          }}
                      >
                          <HelpMark
                              content={
                                  <div style={{display: 'flex', flexDirection: 'column'}}>
                                      <Text variant="subheader-1">
                                          Для поиска введите
                                          <Text
                                              style={{margin: '0 3px'}}
                                              color="brand"
                                              variant="subheader-1"
                                          >
                                              Id РК
                                          </Text>
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('+', 'adverts')}
                                          >
                                              <Icon data={Plus} size={14} />
                                          </Button>
                                          чтобы показать артикулы с РК
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('-', 'adverts')}
                                          >
                                              <Icon data={Minus} size={14} />
                                          </Button>
                                          чтобы показать артикулы без РК
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('авто', 'adverts')}
                                          >
                                              авто
                                          </Button>
                                          чтобы показать артикулы с авто РК
                                      </Text>
                                      <div style={{height: 4}} />
                                      <Text variant="subheader-1">
                                          Введите
                                          <Button
                                              size="s"
                                              style={{margin: '0 3px'}}
                                              view="outlined-action"
                                              onClick={() => filterByButton('поиск', 'adverts')}
                                          >
                                              поиск
                                          </Button>
                                          чтобы показать артикулы с поисковыми РК
                                      </Text>
                                  </div>
                              }
                          />
                      </div>,
                  ],
                  render: ({value, row, index}: any) => {
                      if (typeof value === 'number') {
                          return <Text>{`Уникальных РК ID: ${value}`}</Text>;
                      }
                      if (!value) return <></>;
                      const switches: any[] = [];

                      const advertIds = Object.keys(value)
                          .filter((a) => doc.adverts[selectValue[0]]?.[a]?.type)
                          .sort((a, b) => {
                              return (
                                  doc.adverts[selectValue[0]]?.[a]?.type -
                                  doc.adverts[selectValue[0]]?.[b]?.type
                              );
                          });

                      for (const advertId of advertIds) {
                          const advertData = doc?.adverts?.[selectValue[0]]?.[advertId];
                          if (!advertData) continue;
                          if (
                              filters['adverts'] &&
                              String(filters['adverts'].val).toLowerCase().trim().length
                          ) {
                              if (
                                  String(filters['adverts'].val).toLowerCase().includes('поиск') &&
                                  (advertData.type == 9 || advertData.type == 6)
                              ) {
                                  switches.push(
                                      <AdvertCard
                                          drrToday={advertsTodayDrr?.[advertId]}
                                          getNames={getNames}
                                          pausedAdverts={pausedAdverts}
                                          setUpdatePaused={setUpdatePaused}
                                          sellerId={sellerId}
                                          advertBudgetRules={advertBudgetRules}
                                          setAdvertBudgetRules={setAdvertBudgetRules}
                                          permission={permission}
                                          id={advertId}
                                          index={index}
                                          nmId={row?.nmId}
                                          doc={doc}
                                          selectValue={selectValue}
                                          copiedAdvertsSettings={copiedAdvertsSettings}
                                          setChangedDoc={setChangedDoc}
                                          manageAdvertsActivityCallFunc={
                                              manageAdvertsActivityCallFunc
                                          }
                                          updateColumnWidth={updateColumnWidth}
                                          filteredData={filteredData}
                                          setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                          setDateRange={setDateRange}
                                          dateRange={dateRange}
                                          recalc={recalc}
                                          filterByButton={filterByButton}
                                          getUniqueAdvertIdsFromThePage={
                                              getUniqueAdvertIdsFromThePage
                                          }
                                          template={
                                              shortAdvertInfo[parseInt(advertId)] ?? {
                                                  advertId: parseInt(advertId),
                                                  templateName: 'Фразы',
                                              }
                                          }
                                      />,
                                  );
                              } else if (
                                  filters['adverts'] &&
                                  String(filters['adverts'].val).toLowerCase().includes('авто') &&
                                  advertData.type == 8
                              ) {
                                  switches.push(
                                      <AdvertCard
                                          drrToday={advertsTodayDrr?.[advertId]}
                                          getNames={getNames}
                                          pausedAdverts={pausedAdverts}
                                          setUpdatePaused={setUpdatePaused}
                                          sellerId={sellerId}
                                          advertBudgetRules={advertBudgetRules}
                                          setAdvertBudgetRules={setAdvertBudgetRules}
                                          permission={permission}
                                          id={advertId}
                                          index={index}
                                          nmId={row?.nmId}
                                          doc={doc}
                                          selectValue={selectValue}
                                          copiedAdvertsSettings={copiedAdvertsSettings}
                                          setChangedDoc={setChangedDoc}
                                          manageAdvertsActivityCallFunc={
                                              manageAdvertsActivityCallFunc
                                          }
                                          updateColumnWidth={updateColumnWidth}
                                          filteredData={filteredData}
                                          setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                          setDateRange={setDateRange}
                                          dateRange={dateRange}
                                          recalc={recalc}
                                          filterByButton={filterByButton}
                                          getUniqueAdvertIdsFromThePage={
                                              getUniqueAdvertIdsFromThePage
                                          }
                                          template={
                                              shortAdvertInfo[parseInt(advertId)] ?? {
                                                  advertId: parseInt(advertId),
                                                  templateName: 'Фразы',
                                              }
                                          }
                                      />,
                                  );
                              } else if (
                                  filters['adverts'] &&
                                  advertId.includes(filters['adverts'].val.trim())
                              ) {
                                  switches.push(
                                      <AdvertCard
                                          drrToday={advertsTodayDrr?.[advertId]}
                                          getNames={getNames}
                                          pausedAdverts={pausedAdverts}
                                          setUpdatePaused={setUpdatePaused}
                                          sellerId={sellerId}
                                          advertBudgetRules={advertBudgetRules}
                                          setAdvertBudgetRules={setAdvertBudgetRules}
                                          permission={permission}
                                          id={advertId}
                                          index={index}
                                          nmId={row?.nmId}
                                          doc={doc}
                                          selectValue={selectValue}
                                          copiedAdvertsSettings={copiedAdvertsSettings}
                                          setChangedDoc={setChangedDoc}
                                          manageAdvertsActivityCallFunc={
                                              manageAdvertsActivityCallFunc
                                          }
                                          updateColumnWidth={updateColumnWidth}
                                          filteredData={filteredData}
                                          setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                          setDateRange={setDateRange}
                                          dateRange={dateRange}
                                          recalc={recalc}
                                          filterByButton={filterByButton}
                                          getUniqueAdvertIdsFromThePage={
                                              getUniqueAdvertIdsFromThePage
                                          }
                                          template={
                                              shortAdvertInfo[parseInt(advertId)] ?? {
                                                  advertId: parseInt(advertId),
                                                  templateName: 'Фразы',
                                              }
                                          }
                                      />,
                                  );
                              } else {
                                  continue;
                              }
                          } else {
                              switches.push(
                                  <AdvertCard
                                      drrToday={advertsTodayDrr?.[advertId]}
                                      getNames={getNames}
                                      pausedAdverts={pausedAdverts}
                                      setUpdatePaused={setUpdatePaused}
                                      sellerId={sellerId}
                                      advertBudgetRules={advertBudgetRules}
                                      setAdvertBudgetRules={setAdvertBudgetRules}
                                      permission={permission}
                                      id={advertId}
                                      index={index}
                                      nmId={row?.nmId}
                                      doc={doc}
                                      selectValue={selectValue}
                                      copiedAdvertsSettings={copiedAdvertsSettings}
                                      setChangedDoc={setChangedDoc}
                                      manageAdvertsActivityCallFunc={manageAdvertsActivityCallFunc}
                                      updateColumnWidth={updateColumnWidth}
                                      filteredData={filteredData}
                                      setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                      setDateRange={setDateRange}
                                      dateRange={dateRange}
                                      recalc={recalc}
                                      filterByButton={filterByButton}
                                      getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                      template={
                                          shortAdvertInfo[parseInt(advertId)] ?? {
                                              advertId: parseInt(advertId),
                                              templateName: 'Фразы',
                                          }
                                      }
                                  />,
                              );
                          }
                      }
                      return (
                          <div
                              style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflowX: 'scroll',
                                  overflowY: 'hidden',
                                  gap: 8,
                              }}
                          >
                              {switches}
                          </div>
                      );
                  },
              }
            : {
                  constWidth: 400,
                  name: 'autoSales',
                  placeholder: 'Акции',
                  sortFunction: (a: any, b: any, order: any) => {
                      const profitsDataA = autoSalesProfits[a?.art]?.rentabelnost;
                      const profitsDataB = autoSalesProfits[b?.art]?.rentabelnost;
                      const isNaNa = isNaN(profitsDataA);
                      const isNaNb = isNaN(profitsDataB);
                      if (isNaNa && isNaNb) return 1;
                      else if (isNaNa) return 1;
                      else if (isNaNb) return -1;
                      return (profitsDataA - profitsDataB) * order;
                  },
                  additionalNodes: [
                      <Button
                          view="outlined"
                          style={{marginLeft: 5}}
                          onClick={() => {
                              const params: any = {
                                  uid: getUid(),
                                  campaignName: selectValue[0],
                                  data: {},
                              };
                              const newDocAutoSales = {...doc.autoSales};
                              const tempAutoSales = {...autoSalesProfits};
                              for (const row of filteredData) {
                                  const {nmId, art} = row;
                                  const profits = autoSalesProfits[art];
                                  if (!profits) continue;
                                  const {
                                      autoSaleName,
                                      dateRange,
                                      rozPrice,
                                      oldRozPrices,
                                      oldDiscount,
                                  } = profits;
                                  params.data[nmId] = {
                                      autoSaleName,
                                      dateRange,
                                      rozPrice,
                                      oldRozPrices,
                                      oldDiscount,
                                  };
                                  delete tempAutoSales[art];
                                  newDocAutoSales[selectValue[0]][nmId] = {
                                      autoSaleName: '',
                                      fixedPrices: {dateRange, autoSaleName},
                                  };
                              }
                              console.log(params);
                              callApi('setAutoSales', params, false, true)
                                  .then(() => {
                                      setAutoSalesProfits(tempAutoSales);
                                      doc.autoSales = newDocAutoSales;
                                      setChangedDoc({...doc});
                                  })
                                  .catch((error) => {
                                      showError(
                                          error.response?.data?.error ||
                                              'An unknown error occurred',
                                      );
                                  });
                          }}
                      >
                          <Icon data={Check} />
                          Принять все
                      </Button>,
                      <Button
                          style={{marginLeft: 5}}
                          view="outlined"
                          onClick={() => {
                              const tempAutoSales = {...autoSalesProfits};
                              for (const row of filteredData) {
                                  const {art} = row;
                                  delete tempAutoSales[art];
                              }
                              setAutoSalesProfits(tempAutoSales);
                          }}
                      >
                          <Icon data={Xmark} />
                          Отклонить все
                      </Button>,
                  ],
                  render: ({row, footer}: any) => {
                      const {art, nmId} = row;
                      if (footer) return undefined;
                      const profitsData = autoSalesProfits[art];
                      const switches = [] as any[];

                      if (profitsData) {
                          const proftDiff = profitsData.profit - profitsData.oldProfit;
                          switches.push(
                              <Card
                                  style={{
                                      height: 110.5,
                                      width: 'fit-content',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                  }}
                              >
                                  <Button
                                      style={{
                                          borderTopLeftRadius: 7,
                                          borderTopRightRadius: 7,
                                          overflow: 'hidden',
                                      }}
                                      width="max"
                                      size="xs"
                                      pin="brick-brick"
                                      view="flat"
                                  >
                                      <Text variant="subheader-1">{profitsData.autoSaleName}</Text>
                                  </Button>
                                  <Button view="outlined" size="xs" pin="clear-clear" width="max">
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              width: '100%',
                                              justifyContent: 'space-between',
                                              gap: 8,
                                          }}
                                      >
                                          <Text
                                              color={
                                                  profitsData.oldProfit > 0 ? 'positive' : 'danger'
                                              }
                                          >
                                              {`${new Intl.NumberFormat('ru-RU').format(
                                                  profitsData.oldProfit,
                                              )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                                  getRoundValue(
                                                      profitsData.oldRentabelnost,
                                                      1,
                                                      true,
                                                  ),
                                              )}%`}
                                          </Text>
                                          <Text>{`${profitsData.oldRozPrices} ₽`}</Text>
                                      </div>
                                  </Button>
                                  <Text
                                      style={{
                                          width: '100%',
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: 8,
                                          height: 20,
                                      }}
                                      color={
                                          proftDiff == 0
                                              ? 'secondary'
                                              : proftDiff > 0
                                                ? 'positive'
                                                : 'danger'
                                      }
                                  >
                                      <Icon data={ArrowShapeDown} />
                                      {`${proftDiff > 0 ? '+' : ''}${proftDiff} ₽`}
                                  </Text>
                                  <Button view="outlined" size="xs" pin="clear-clear" width="max">
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              width: '100%',
                                              justifyContent: 'space-between',
                                              gap: 8,
                                          }}
                                      >
                                          <Text
                                              color={profitsData.profit > 0 ? 'positive' : 'danger'}
                                          >
                                              {`${new Intl.NumberFormat('ru-RU').format(
                                                  profitsData.profit,
                                              )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                                  getRoundValue(profitsData.rentabelnost, 1, true),
                                              )}%`}
                                          </Text>
                                          <Text>{`${profitsData.rozPrice} ₽`}</Text>
                                          <Text>{`с СПП: ${profitsData.sppPrice} ₽`}</Text>
                                          <Text>{`с WB к.: ${profitsData.wbWalletPrice} ₽`}</Text>
                                      </div>
                                  </Button>
                                  <div
                                      style={{
                                          minHeight: 0.5,
                                          marginTop: 10,
                                          width: '100%',
                                          background: 'var(--g-color-base-generic-hover)',
                                      }}
                                  />
                                  <div
                                      style={{display: 'flex', flexDirection: 'row', width: '100%'}}
                                  >
                                      <Button
                                          pin="clear-clear"
                                          size="xs"
                                          width="max"
                                          view="flat-success"
                                          selected
                                          style={{borderBottomLeftRadius: 7, overflow: 'hidden'}}
                                          onClick={() => {
                                              const params: any = {
                                                  uid: getUid(),
                                                  campaignName: selectValue[0],
                                                  data: {},
                                              };
                                              const {
                                                  autoSaleName,
                                                  dateRange,
                                                  rozPrice,
                                                  oldRozPrices,
                                                  oldDiscount,
                                              } = profitsData;
                                              params.data[nmId] = {
                                                  autoSaleName,
                                                  dateRange,
                                                  rozPrice,
                                                  oldRozPrices,
                                                  oldDiscount,
                                              };
                                              console.log(params);
                                              doc.autoSales[selectValue[0]][nmId] = {
                                                  autoSaleName: '',
                                                  fixedPrices: {dateRange, autoSaleName},
                                              };
                                              setChangedDoc({...doc});
                                              callApi('setAutoSales', params);
                                              const temp = {...autoSalesProfits};
                                              delete temp[art];
                                              setAutoSalesProfits(temp);
                                          }}
                                      >
                                          <Icon data={Check} />
                                      </Button>
                                      <Button
                                          pin="clear-clear"
                                          size="xs"
                                          width="max"
                                          view="flat-danger"
                                          selected
                                          style={{borderBottomRightRadius: 7, overflow: 'hidden'}}
                                          onClick={() => {
                                              const temp = {...autoSalesProfits};
                                              delete temp[art];
                                              setAutoSalesProfits(temp);
                                          }}
                                      >
                                          <Icon data={Xmark} />
                                      </Button>
                                  </div>
                              </Card>,
                          );
                          switches.push(<div style={{minWidth: 8}} />);
                      }
                      switches.pop();
                      return (
                          <div
                              style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  overflowX: 'scroll',
                                  overflowY: 'hidden',
                              }}
                          >
                              {switches}
                          </div>
                      );
                  },
              },
        {
            name: 'analytics',
            placeholder: 'Аналитика',
            render: ({row, footer}: any) => {
                const {profit, rentabelnost} = row;
                if (footer) {
                    return (
                        <Text color={profit > 0 ? 'positive' : 'danger'}>
                            {`${new Intl.NumberFormat('ru-RU').format(
                                Math.round(profit),
                            )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                Math.round(rentabelnost),
                            )}%`}
                        </Text>
                    );
                }
                const warningArtIcon = () => {
                    const nmIdArray = unvalidatedArts.map((art) => art.nmId);
                    const nmIdIndex = nmIdArray.findIndex((element) => element == nmId);
                    if (nmIdIndex != -1) {
                        const art = unvalidatedArts[nmIdIndex];
                        const keys = Object.keys(art);
                        const words: string[] = [];
                        for (const key of keys) {
                            switch (key) {
                                case 'prices':
                                    words.push('себестоимость');
                                    break;
                                case 'tax':
                                    words.push('налог');
                                    break;
                                default:
                                    break;
                            }
                        }
                        return (
                            <div>
                                <Tooltip
                                    style={{maxWidth: '400px'}}
                                    content={
                                        <Text>
                                            Внимание: расчёт прибыли выполнен с ошибкой. Пожалуйста,
                                            укажите&nbsp;{getEnumurationString(words)} для
                                            корректного отображения данных
                                        </Text>
                                    }
                                >
                                    <Text style={{color: 'rgb(255, 190, 92)'}}>
                                        <Icon data={TriangleExclamation} size={11} />
                                    </Text>
                                </Tooltip>
                            </div>
                        );
                    }
                    return <div />;
                };
                const {placementsValue, stocksBySizes, nmId} = row ?? {};
                const stocksByWarehousesArt = stocksByWarehouses?.[nmId];
                const {phrase} = placementsValue ?? {};
                return (
                    <Card
                        style={{
                            width: 160,
                            height: 110.5,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <PageInfoGraphs
                            sellerId={sellerId}
                            phrase={phrase}
                            placementsValue={placementsValue}
                        />
                        {stocksBySizes && stocksBySizes.all > 1 ? (
                            <Button
                                style={{
                                    width: 160,
                                    overflow: 'hidden',
                                }}
                                width="max"
                                size="xs"
                                view={stocksBySizes ? 'outlined' : 'outlined-danger'}
                                pin="clear-clear"
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text>{`${stocksBySizes.available ?? ''} / ${
                                        stocksBySizes.all ?? ''
                                    }`}</Text>
                                    <div style={{minWidth: 3}} />
                                    <Icon data={TShirt} size={11} />
                                </div>
                            </Button>
                        ) : (
                            <></>
                        )}
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div
                                style={{
                                    width: '100%',
                                    background: 'var(--g-color-base-generic-hover)',
                                    height: 0.5,
                                }}
                            />
                            <StocksByWarehousesPopup
                                stocksByWarehousesArt={stocksByWarehousesArt}
                            />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div
                                style={{
                                    width: '100%',
                                    background: 'var(--g-color-base-generic-hover)',
                                    height: 0.5,
                                }}
                            />
                            <Button
                                disabled={!Math.round(profit)}
                                style={{
                                    width: 160,
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                                width="max"
                                size="xs"
                                view={'flat'}
                                pin="clear-clear"
                            >
                                <Text
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4,
                                    }}
                                    color={
                                        !Math.round(profit)
                                            ? undefined
                                            : profit > 0
                                              ? 'positive'
                                              : 'danger'
                                    }
                                >
                                    {`${new Intl.NumberFormat('ru-RU').format(
                                        Math.round(profit),
                                    )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                        Math.round(rentabelnost),
                                    )}%`}
                                    {warningArtIcon()}
                                </Text>
                            </Button>
                        </div>
                    </Card>
                );
            },
            sortFunction: (a: any, b: any, order: any) => {
                const profitsDataA = a?.profit;
                const profitsDataB = b?.profit;
                const isNaNa = isNaN(profitsDataA);
                const isNaNb = isNaN(profitsDataB);
                if (isNaNa && isNaNb) return 1;
                else if (isNaNa) return 1;
                else if (isNaNb) return -1;
                return (profitsDataA - profitsDataB) * order;
            },
        },
        {
            name: 'placements',
            placeholder:
                'Позиция' +
                (placementsDisplayPhrase != '' && currentParsingProgress[placementsDisplayPhrase]
                    ? ` / Проверка: ${
                          currentParsingProgress[placementsDisplayPhrase].progress / 100
                      } стр.`
                    : ''),
            width: placementsDisplayPhrase != '' ? '15vw' : undefined,
            sortFunction: (a: any, b: any, order: any) => {
                const dataA = a?.placements;
                const dataB = b?.placements;
                const isNaNa = isNaN(dataA);
                const isNaNb = isNaN(dataB);
                if (isNaNa && isNaNb) return 1;
                else if (isNaNa) return 1;
                else if (isNaNb) return -1;
                return (dataA - dataB) * order;
            },
            additionalNodes: [
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Button
                        style={{
                            marginLeft: 5,
                            display: placementsDisplayPhrase != '' ? 'inherit' : 'none',
                        }}
                        view={
                            placementsDisplayPhrase != '' &&
                            selectedSearchPhrase == placementsDisplayPhrase
                                ? 'outlined-success'
                                : 'outlined'
                        }
                        onClick={async (event) => {
                            event.stopPropagation();
                            setSelectedSearchPhrase(
                                selectedSearchPhrase == placementsDisplayPhrase
                                    ? ''
                                    : placementsDisplayPhrase,
                            );
                            const uniqueAdverts = Object.values(
                                getUniqueAdvertIdsFromThePage(),
                            )?.map((advert: any) => advert?.advertId);
                            for (const advertId of uniqueAdverts) {
                                if (!advertId) continue;
                                try {
                                    await changeSelectedPhrase({
                                        seller_id: sellerId,
                                        advertId,
                                        selectedPhrase: placementsDisplayPhrase,
                                        asSet: true,
                                    });
                                } catch (error) {
                                    showError(
                                        `Не удалось установить мастер фразу в РК ${advertId}.`,
                                    );
                                }
                            }
                            await getSelectedPhrases();
                        }}
                    >
                        <Icon size={12} data={ArrowShapeUp} />
                    </Button>
                    <Button
                        disabled={
                            currentParsingProgress[placementsDisplayPhrase] &&
                            currentParsingProgress[placementsDisplayPhrase].isParsing
                        }
                        style={{
                            marginLeft: 5,
                            display: placementsDisplayPhrase != '' ? 'inherit' : 'none',
                        }}
                        view="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            delete doc.fetchedPlacements[placementsDisplayPhrase];
                            delete currentParsingProgress[placementsDisplayPhrase];
                            parseFirst10Pages(
                                placementsDisplayPhrase,
                                setFetchedPlacements,
                                setCurrentParsingProgress,
                                100,
                                placementsDisplayPhrase != '' &&
                                    currentParsingProgress[placementsDisplayPhrase]
                                    ? currentParsingProgress[placementsDisplayPhrase].progress / 100
                                    : 0,
                            );
                            for (let i = 0; i < 9; i++) {
                                parseFirst10Pages(
                                    'тестовая фраза',
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                    100,
                                );
                            }
                            setChangedDoc({...doc});
                        }}
                    >
                        <Icon size={12} data={ArrowRotateLeft} />
                    </Button>
                    <Button
                        loading={
                            currentParsingProgress[placementsDisplayPhrase] &&
                            currentParsingProgress[placementsDisplayPhrase].isParsing
                        }
                        style={{
                            marginLeft: 5,
                            display: placementsDisplayPhrase != '' ? 'inherit' : 'none',
                        }}
                        view="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            parseFirst10Pages(
                                placementsDisplayPhrase,
                                setFetchedPlacements,
                                setCurrentParsingProgress,
                                100,
                                placementsDisplayPhrase != '' &&
                                    currentParsingProgress[placementsDisplayPhrase]
                                    ? currentParsingProgress[placementsDisplayPhrase].progress / 100
                                    : 0,
                                doc.fetchedPlacements[placementsDisplayPhrase],
                                currentParsingProgress[placementsDisplayPhrase],
                            );
                            for (let i = 0; i < 5; i++) {
                                parseFirst10Pages(
                                    'тестовая фраза',
                                    setFetchedPlacements,
                                    setCurrentParsingProgress,
                                    100,
                                );
                            }
                        }}
                    >
                        <Icon size={12} data={LayoutHeader} />
                    </Button>
                    {currentParsingProgress[placementsDisplayPhrase] &&
                    currentParsingProgress[placementsDisplayPhrase].isParsing ? (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{width: 5}} />
                            <Spin size="s" />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>,
            ],
            render: ({value, row}: any) => {
                if (placementsDisplayPhrase != '') {
                    const phrase = placementsDisplayPhrase;
                    const {nmId} = row;
                    const {log, index} = doc.fetchedPlacements[phrase]
                        ? (doc.fetchedPlacements[phrase].data?.[nmId] ?? ({} as any))
                        : ({} as any);
                    const {updateTime} = doc.fetchedPlacements[phrase] ?? ({} as any);
                    const updateTimeObj = new Date(updateTime);
                    if (!index || index == -1) return undefined;
                    const {position} = log ?? {};
                    return (
                        <Card
                            view="clear"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: 96,
                                width: 'max',
                            }}
                        >
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                {position !== undefined ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text color="secondary">{`${position + 1}`}</Text>
                                        <div style={{minWidth: 3}} />
                                        <Icon data={ArrowRight} size={13}></Icon>
                                        <div style={{minWidth: 3}} />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <Text>{`${!index || index == -1 ? 'Нет в выдаче' : index} `}</Text>
                                <div style={{width: 4}} />
                            </div>
                            <Text>{`${updateTimeObj.toLocaleString('ru-RU')}`}</Text>
                        </Card>
                    );
                }
                if (!value) return undefined;
                const {drrAI, placementsValue, adverts} = row;
                if (!placementsValue) return undefined;
                const {updateTime, index, phrase, log, cpmIndex} = placementsValue;
                const {placementsRange} = drrAI ?? {};
                if (phrase == '') return undefined;
                const {position, advertsType} = log ?? {};
                const findFirstActive = (adverts: any[]) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const fistActiveAdvert = findFirstActive(adverts);
                const updateTimeObj = new Date(updateTime);
                const moreThatHour =
                    new Date().getTime() / 1000 / 3600 - updateTimeObj.getTime() / 1000 / 3600 > 1;
                const {advertId} = fistActiveAdvert ?? {};
                const isSelectedPhrase = advertsSelectedPhrases?.[advertId] == phrase;
                return (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {position !== undefined ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {advertsType ? (
                                        <Text
                                            color="secondary"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Icon
                                                data={advertsType == 'auto' ? Rocket : Magnifier}
                                                size={13}
                                            />
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                    <div style={{minWidth: advertsType ? 3 : 0}} />
                                    <Text color="secondary">{`${position + 1}`}</Text>
                                    <div style={{width: 3}} />
                                    <Icon data={ArrowRight} size={13}></Icon>
                                    <div style={{width: 3}} />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Text
                                color={
                                    index != -1
                                        ? placementsRange &&
                                          placementsRange.from != 0 &&
                                          placementsRange.to != 0
                                            ? Math.abs(placementsRange.from - index) < 5 &&
                                              Math.abs(placementsRange.to - index) < 5
                                                ? placementsRange.from == index &&
                                                  placementsRange.from == index
                                                    ? 'positive'
                                                    : 'warning'
                                                : 'primary'
                                            : 'primary'
                                        : 'danger'
                                }
                            >{`${
                                !index || index == -1
                                    ? 'Нет в выдаче'
                                    : index + (!cpmIndex || cpmIndex == -1 ? '' : ` (${cpmIndex})`)
                            } `}</Text>
                            <div style={{width: 4}} />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                            }}
                        >
                            {phrase ? (
                                <Auction sellerId={sellerId} phrase={phrase} nmId={row?.nmId}>
                                    <Text style={{cursor: 'pointer'}}>{phrase}</Text>
                                </Auction>
                            ) : (
                                <></>
                            )}
                            <div style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                                <Button
                                    size="xs"
                                    view="outlined"
                                    href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${phrase}`}
                                    target="_blank"
                                >
                                    <Icon data={Magnifier} />
                                </Button>
                                <Button
                                    size="xs"
                                    view={isSelectedPhrase ? 'outlined-success' : 'outlined'}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        changeSelectedPhrase({
                                            seller_id: sellerId,
                                            advertId,
                                            selectedPhrase: phrase,
                                        }).then(() => {
                                            getSelectedPhrases();
                                        });
                                    }}
                                >
                                    <Icon data={ArrowShapeUp} />
                                </Button>
                            </div>
                        </div>
                        <Text
                            color={moreThatHour ? 'danger' : 'primary'}
                        >{`${updateTimeObj.toLocaleString('ru-RU')}`}</Text>
                        <Text>
                            {placementsRange
                                ? placementsRange.from != 0 && placementsRange.to != 0
                                    ? `Целевая позиция: ${placementsRange.from}`
                                    : 'Ставки по ДРР'
                                : ''}
                        </Text>
                    </div>
                );
            },
            group: true,
        },
        {name: 'sum', placeholder: 'Расход, ₽'},
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: ({value, row}: any) => {
                const findMaxDrr = (adverts: any) => {
                    let maxDrr = 0;
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if (![9, 11].includes(advert?.status)) continue;
                        const drrAI = doc?.advertsAutoBidsRules[selectValue[0]]?.[advert?.advertId];
                        const {desiredDRR, useManualMaxCpm, autoBidsMode} = drrAI ?? {};
                        if (
                            (useManualMaxCpm && autoBidsMode != 'drr') ||
                            ['cpo'].includes(autoBidsMode)
                        )
                            continue;
                        if (desiredDRR > maxDrr) maxDrr = desiredDRR;
                    }
                    return maxDrr;
                };
                const {adverts} = row;
                const maxDrr = findMaxDrr(adverts);
                return (
                    <Text
                        color={
                            maxDrr
                                ? value <= maxDrr
                                    ? value == 0
                                        ? 'primary'
                                        : 'positive'
                                    : value / maxDrr - 1 < 0.5
                                      ? 'warning'
                                      : 'danger'
                                : 'primary'
                        }
                    >
                        {value}%
                    </Text>
                );
            },
        },
        {name: 'sum_orders', placeholder: 'Заказы, ₽'},
        {
            name: 'stocks',
            placeholder: 'Остаток',
            group: true,
            render: ({value}: any) => {
                return (
                    <div>
                        <Text>{`${value}`}</Text>
                    </div>
                );
            },
        },
        {
            name: 'dsi',
            placeholder: (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: 8,
                    }}
                >
                    <Text variant="subheader-1">Обор.</Text>
                    <HelpMark content="Показывает через сколько дней закончится текущий остаток с учетом средней скорости заказов в день за выбранные период в календаре" />
                </div>
            ),
        },
        {name: 'orders', placeholder: 'Заказы, шт.'},
        {
            name: 'avg_price',
            placeholder: 'Ср. Чек, ₽',
            render: ({row}: any) => {
                return defaultRender({value: getRoundValue(row?.sum_orders, row?.orders)});
            },
            sortFunction: (a: any, b: any, order: any) => {
                const dataA = getRoundValue(a?.sum_orders, a?.orders);
                const dataB = getRoundValue(b?.sum_orders, b?.orders);
                const isNaNa = isNaN(dataA);
                const isNaNb = isNaN(dataB);
                if (isNaNa && isNaNb) return 1;
                else if (isNaNa) return 1;
                else if (isNaNb) return -1;
                return (dataA - dataB) * order;
            },
        },
        {name: 'romi', placeholder: 'ROMI, %', render: renderAsPercent},
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value, row}: any) => {
                const findFirstActive = (adverts: any) => {
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if ([9, 11].includes(advert.status)) return advert;
                    }
                    return undefined;
                };
                const {adverts} = row;
                const fistActiveAdvert = findFirstActive(adverts);
                const drrAI =
                    doc?.advertsAutoBidsRules?.[selectValue[0]]?.[fistActiveAdvert?.advertId];
                const {desiredCpo, autoBidsMode} = drrAI ?? {};
                return (
                    <Text
                        color={
                            desiredCpo
                                ? autoBidsMode == 'cpo'
                                    ? value <= desiredCpo
                                        ? value == 0
                                            ? 'primary'
                                            : 'positive'
                                        : value / desiredCpo - 1 < 0.5
                                          ? 'warning'
                                          : 'danger'
                                    : 'primary'
                                : 'primary'
                        }
                    >
                        {value}
                    </Text>
                );
            },
        },
        {name: 'views', placeholder: 'Показы, шт.'},
        {
            name: 'clicks',
            placeholder: 'Клики, шт.',
            render: (args: any) => renderSlashPercent(args, 'openCardCount'),
        },
        {name: 'ctr', placeholder: 'CTR, %', render: renderAsPercent},
        {name: 'cpc', placeholder: 'CPC, ₽'},
        {name: 'cpm', placeholder: 'CPM, ₽'},
        {name: 'openCardCount', placeholder: 'Всего переходов, шт.'},
        {name: 'cr', placeholder: 'CR, %', render: renderAsPercent},
        {name: 'addToCartPercent', placeholder: 'CR в корзину, %', render: renderAsPercent},
        {name: 'cartToOrderPercent', placeholder: 'CR в заказ, %', render: renderAsPercent},
        {name: 'addToCartCount', placeholder: 'Корзины, шт.'},
        {name: 'cpl', placeholder: 'CPL, ₽'},
    ];

    const [filteredSummary, setFilteredSummary] = useState({
        art: '',
        uniqueImtIds: 0,
        views: 0,
        clicks: 0,
        sum: 0,
        ctr: 0,
        drr: 0,
        orders: 0,
        analytics: 0,
        stocks: 0,
        sum_orders: 0,
        romi: 0,
        adverts: 0,
        semantics: null,
    });

    const [arts, setArts] = useState({} as any);

    useEffect(() => {
        if (!selectValue || fetchingDataFromServerFlag) return;
        if (!selectValue[0] || selectValue[0] == '') return;

        setCopiedAdvertsSettings({advertId: 0});
        updateTheData();
    }, [selectValue, arts]);

    const getBidderRules = async () => {
        if (!doc) return;
        const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
            seller_id: sellerId,
        });
        doc.advertsAutoBidsRules[selectValue[0]] = advertsAutoBidsRules?.data;
        setChangedDoc({...doc});
    };

    useEffect(() => {
        getBidderRules();
    }, [advertBudgetRules]);

    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(changedDoc, changedDocUpdateType, selectValue[0]);

    const updateTheData = useCallback(async () => {
        if (!selectValue || !Object.entries(arts).length) return;
        console.log('YOOO UPDATE INCOMING');
        setFetchingDataFromServerFlag(true);
        setSwitchingCampaignsFlag(false);
        const params = {
            seller_id: sellerId,
        };
        console.log(params);

        await ApiClient.post('massAdvert/new/get-mass-advert', params)
            .then(async (response) => {
                setFetchingDataFromServerFlag(false);
                fetchAdvertsTodayDrr();
                if (!response) return;
                const resData = response['data'];

                const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
                    seller_id: sellerId,
                });
                const advertsSchedules = await ApiClient.post('massAdvert/get-schedules', {
                    seller_id: sellerId,
                });
                const autoSales = await ApiClient.post('massAdvert/get-sales-rules', {
                    seller_id: sellerId,
                });
                const adverts = await ApiClient.post('massAdvert/new/get-adverts', {
                    seller_id: sellerId,
                });
                const temp = adverts?.data;
                resData.adverts[selectValue[0]] = temp;

                for (const [advertId, advertData] of Object.entries(temp) as any) {
                    const {type, autoParams, unitedParams, isQueuedToCreate} = advertData;
                    let nms = [];
                    if (type == 8) {
                        nms = autoParams?.nms ?? [];
                    } else if (type == 9) {
                        nms = unitedParams?.[0].nms ?? [];
                    }
                    for (const nmId of nms) {
                        const art = arts[nmId];
                        if (!art) continue;
                        if (isQueuedToCreate) console.log(nmId, art, advertId);
                        if (resData?.campaigns?.[selectValue[0]]?.[art]) {
                            if (!resData?.campaigns?.[selectValue[0]]?.[art]?.adverts)
                                resData.campaigns[selectValue[0]][art].adverts = {};

                            resData.campaigns[selectValue[0]][art].adverts[advertId] = {
                                advertId: parseInt(advertId),
                            };
                        }
                    }
                }

                console.log('advertsAutoBidsRules', advertsAutoBidsRules);

                resData['advertsAutoBidsRules'][selectValue[0]] = advertsAutoBidsRules?.data;
                resData['advertsSchedules'][selectValue[0]] = advertsSchedules?.data;
                resData['autoSales'][selectValue[0]] = autoSales?.data;

                setChangedDoc(resData);
                setChangedDocUpdateType(true);
            })
            .catch((error) => console.error(error));
    }, [sellerId, arts, selectValue]);

    useEffect(() => {
        const interval = setInterval(updateTheData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [updateTheData]);

    if (fetchedPlacements) {
        for (const [phrase, phraseData] of Object.entries(fetchedPlacements)) {
            if (!phrase || !phraseData) continue;
            const {data, updateTime, cpms} = phraseData as any;
            if (!data || !updateTime) continue;
            if (!Object.keys(data).length) continue;
            if (!doc.fetchedPlacements[phrase]) doc.fetchedPlacements[phrase] = {};
            if (
                !doc.fetchedPlacements[phrase]['data'] ||
                (doc.fetchedPlacements[phrase]['updateTime'] &&
                    new Date(doc.fetchedPlacements[phrase]['updateTime']).getTime() / 1000 / 60 > 2)
            ) {
                doc.fetchedPlacements[phrase]['data'] = {};
                doc.fetchedPlacements[phrase]['cpms'] = {};
            }
            doc.fetchedPlacements[phrase]['updateTime'] = updateTime;
            Object.assign(doc.fetchedPlacements[phrase]['data'], data);
            Object.assign(doc.fetchedPlacements[phrase]['cpms'], cpms);
        }

        console.log(doc);
        setChangedDoc({...doc});

        setFetchedPlacements(undefined);
    }

    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );

    const [dateRange, setDateRange] = useState<[Date, Date]>([today, today]);
    const anchorRef = useRef(null);

    const [summary, setSummary] = useState({
        views: 0,
        clicks: 0,
        sum: 0,
        drr_orders: 0,
        drr_sales: 0,
        drr: '',
        orders: 0,
        sales: 0,
        sum_orders: 0,
        sum_sales: 0,
        addToCartCount: 0,
        ctr: 0,
        openCardCount: 0,
        profit: '',
        rent: '',
        profitTemp: 0,
    });

    const getRoundValue = (a: any, b: any, isPercentage = false, def = 0) => {
        let result = b ? a / b : def;
        if (isPercentage) {
            result = Math.round(result * 100 * 100) / 100;
        } else {
            result = Math.round(result);
        }
        return result;
    };
    const recalc = (
        daterng: any,
        selected = '',
        withfFilters = {},
        campaignData_ = undefined as any,
    ) => {
        const [startDate, endDate] = daterng;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysBetween =
            Math.abs(
                startDate.getTime() -
                    (today.getTime() > endDate.getTime() ? endDate.getTime() : today.getTime()),
            ) /
            1000 /
            86400;

        const summaryTemp = {
            views: 0,
            clicks: 0,
            sum: 0,
            drr_orders: 0,
            drr_sales: 0,
            drr: '',
            orders: 0,
            sales: 0,
            sum_orders: 0,
            sum_sales: 0,
            addToCartCount: 0,
            profit: '',
            rent: '',
            ctr: 0,
            openCardCount: 0,
            profitTemp: 0,
        };

        const _selectedCampaignName = selected == '' ? selectValue[0] : selected;
        let campaignData = doc;
        if (campaignData_) campaignData = campaignData_;
        if (
            !(
                campaignData &&
                campaignData?.campaigns &&
                campaignData?.campaigns[_selectedCampaignName] &&
                campaignData?.adverts &&
                campaignData?.adverts[_selectedCampaignName]
            )
        )
            return;

        const temp: any = {};
        for (const [art, data] of Object.entries(campaignData.campaigns[_selectedCampaignName])) {
            const artData: any = data;
            if (!art || !artData) continue;
            const artInfo: any = {
                art: '',
                photos: undefined,
                imtId: undefined,
                brand: '',
                object: '',
                nmId: 0,
                title: '',
                adverts: 0,
                stocks: 0,
                dsi: 0,
                stocksBySizes: {},
                profitLog: {},
                advertsManagerRules: undefined,
                tags: [] as any[],
                advertsStocksThreshold: undefined,
                placements: undefined,
                placementsValue: undefined,
                drrAI: {},
                expectedBuyoutsPersent: 0,
                plusPhrasesTemplate: undefined,
                advertsSelectedPhrases: {},
                semantics: {},
                budget: {},
                bid: {},
                bidLog: {},
                budgetToKeep: {},
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
                analytics: 0,
                rentabelnost: 0,
                profit: 0,
                sales: 0,
                sum_sales: 0,
                openCardCount: 0,
                romi: 0,
                addToCartPercent: 0,
                addToCartCount: 0,
                cartToOrderPercent: 0,
                cpl: 0,
            };

            artInfo.art = artData['art'];
            artInfo.photos = artData['photos'];
            artInfo.imtId = artData['imtId'];
            artInfo.object = artData['object'];
            artInfo.nmId = artData['nmId'];
            artInfo.tags = artData['tags'];
            artInfo.title = artData['title'];
            artInfo.brand = artData['brand'];
            artInfo.stocks = artData['stocks'];

            artInfo.stocksBySizes = artData['stocksBySizes'];
            artInfo.adverts = artData['adverts'];
            artInfo.advertsManagerRules = artData['advertsManagerRules'];
            artInfo.profitLog = artData['profitLog'];
            artInfo.advertsStocksThreshold = artData['advertsStocksThreshold'];
            artInfo.placementsValue = artData['placements'];
            artInfo.expectedBuyoutsPersent = artData['expectedBuyoutsPersent'];
            artInfo.plusPhrasesTemplate = artData['plusPhrasesTemplate'];
            artInfo.placements = artData['placements'] ? artData['placements'].index : undefined;

            if (artInfo.adverts) {
                for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
                    if (!advertType || advertType == 'none' || !advertsOfType) continue;

                    for (const [advertId, _] of Object.entries(advertsOfType)) {
                        if (!advertId) continue;
                        const advertData = campaignData.adverts[_selectedCampaignName][advertId];
                        if (!advertData) continue;
                        const status = advertData['status'];
                        if (![4, 9, 11].includes(status)) continue;

                        artInfo.budget[advertId] = advertData['budget'];

                        artInfo.bid[advertId] = advertData['cpm'];

                        artInfo.semantics[advertId] = advertData['words'];

                        artInfo.drrAI[advertId] =
                            campaignData.advertsAutoBidsRules[_selectedCampaignName][advertId];
                        artInfo.advertsSelectedPhrases[advertId] =
                            campaignData.advertsSelectedPhrases[_selectedCampaignName][advertId];
                        artInfo.bidLog[advertId] = advertData['bidLog'];
                    }
                }
            }
            if (artData['advertsStats']) {
                for (const [strDate, data] of Object.entries(artData['advertsStats'])) {
                    const dateData: any = data;
                    if (strDate == 'updateTime' || !dateData) continue;

                    if (!dateData) continue;
                    const date = new Date(strDate);
                    date.setHours(0, 0, 0, 0);
                    if (date < startDate || date > endDate) continue;

                    artInfo.sum_orders += dateData['sum_orders'];
                    artInfo.orders += dateData['orders'];

                    artInfo.sum_sales += dateData['sum_sales'];
                    artInfo.sales += dateData['sales'];
                    artInfo.sum += dateData['sum'];
                    artInfo.views += dateData['views'];
                    artInfo.clicks += dateData['clicks'];
                    artInfo.profit += dateData['profit'];
                    artInfo.rentabelnost = getRoundValue(
                        artInfo['profit'],
                        artInfo['sum_orders'],
                        true,
                    );
                    artInfo.analytics += artInfo.rentabelnost;

                    const {openCardCount, addToCartCount} = artData['nmFullDetailReport']
                        ? (artData['nmFullDetailReport'].statistics[strDate] ?? {
                              openCardCount: 0,
                              addToCartCount: 0,
                          })
                        : {
                              openCardCount: 0,
                              addToCartCount: 0,
                          };

                    artInfo.openCardCount += openCardCount ?? 0;
                    artInfo.addToCartCount += addToCartCount ?? 0;
                }
                artInfo.openCardCount = Math.round(artInfo.openCardCount);

                artInfo.addToCartPercent = getRoundValue(
                    artInfo.addToCartCount,
                    artInfo.openCardCount,
                    true,
                );
                artInfo.cartToOrderPercent = getRoundValue(
                    artInfo.orders,
                    artInfo.addToCartCount,
                    true,
                );

                artInfo.sum_orders = Math.round(artInfo.sum_orders);
                artInfo.orders = Math.round(artInfo.orders);
                artInfo.sum_sales = Math.round(artInfo.sum_sales);
                artInfo.sales = Math.round(artInfo.sales * 100) / 100;
                artInfo.sum = Math.round(artInfo.sum);
                artInfo.views = Math.round(artInfo.views);
                artInfo.clicks = Math.round(artInfo.clicks);

                artInfo.dsi = getRoundValue(artInfo.stocks, artInfo.orders / (daysBetween + 1));

                artInfo.drr = artInfo.sum
                    ? getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1)
                    : 0;
                artInfo.ctr = getRoundValue(artInfo.clicks, artInfo.views, true);
                artInfo.cpc = getRoundValue(
                    artInfo.sum / 100,
                    artInfo.clicks,
                    true,
                    artInfo.sum / 100,
                );
                artInfo.cpm = getRoundValue(artInfo.sum * 1000, artInfo.views);
                artInfo.cr = getRoundValue(artInfo.orders, artInfo.openCardCount, true);
                artInfo.cpo = getRoundValue(artInfo.sum, artInfo.orders, false, artInfo.sum);
                artInfo.cpl = getRoundValue(
                    artInfo.sum,
                    artInfo.addToCartCount,
                    false,
                    artInfo.sum,
                );
                artInfo.romi = getRoundValue(artInfo.profit, artInfo.sum, true);

                summaryTemp.sales += artInfo.sales;
                summaryTemp.sum_sales += artInfo.sum_sales;
                summaryTemp.sum_orders += artInfo.sum_orders;
                summaryTemp.sum += artInfo.sum;
                summaryTemp.views += artInfo.views;
                summaryTemp.clicks += artInfo.clicks;
                summaryTemp.addToCartCount += artInfo.addToCartCount;
                summaryTemp.orders += artInfo.orders;
                summaryTemp.openCardCount += artInfo.openCardCount;

                summaryTemp.profitTemp += Math.round(artInfo.profit ?? 0);
            }

            temp[art] = artInfo;
        }

        summaryTemp.addToCartCount = Math.round(summaryTemp.addToCartCount);
        summaryTemp.orders = Math.round(summaryTemp.orders);
        summaryTemp.sales = Math.round(summaryTemp.sales);
        summaryTemp.sum_orders = Math.round(summaryTemp.sum_orders);
        summaryTemp.openCardCount = Math.round(summaryTemp.openCardCount);
        summaryTemp.sum_sales = Math.round(summaryTemp.sum_sales);
        summaryTemp.drr_orders = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
        summaryTemp.drr_sales = getRoundValue(summaryTemp.sum, summaryTemp.sum_sales, true, 1);

        summaryTemp.ctr = getRoundValue(summaryTemp.clicks, summaryTemp.views, true, 1);

        summaryTemp.profit = `${new Intl.NumberFormat('ru-RU').format(summaryTemp.profitTemp)} ₽`;
        summaryTemp.rent = `${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_orders, true),
        )}% / ${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_sales, true),
        )}%`;

        summaryTemp.drr = `${new Intl.NumberFormat('ru-RU').format(
            summaryTemp.drr_orders,
        )}% / ${new Intl.NumberFormat('ru-RU').format(summaryTemp.drr_sales)}%`;

        setSummary(summaryTemp);

        setTableData(temp);

        filterTableData(withfFilters, temp, undefined, daterng);
    };

    useEffect(() => {
        recalc(dateRange);
    }, [filtersRK]);

    const getBalanceYagrData = () => {
        const balanceLog =
            doc.balances && doc.balances[selectValue[0]]
                ? (doc.balances[selectValue[0]]?.data ?? {})
                : {};

        const timelineBudget: any[] = [];
        const graphsDataBonus: any[] = [];
        const graphsDataBalance: any[] = [];
        const graphsDataNet: any[] = [];
        if (balanceLog) {
            for (let i = 0; i < balanceLog.length; i++) {
                const time = balanceLog[i].time;
                const balanceData = balanceLog[i].balance;
                if (!time || !balanceData) continue;

                const {net, balance, bonus} = balanceData;

                const timeObj = new Date(time);

                timeObj.setMinutes(Math.floor(timeObj.getMinutes() / 15) * 15);

                const lbd = new Date(dateRange[0]);
                lbd.setHours(0, 0, 0, 0);
                const rbd = new Date(dateRange[1]);
                rbd.setHours(23, 59, 59);
                if (timeObj < lbd || timeObj > rbd) continue;
                timelineBudget.push(timeObj.getTime());
                graphsDataBalance.push(balance ?? 0);
                graphsDataBonus.push(bonus ?? 0);
                graphsDataNet.push(net ?? 0);
            }
        }

        const yagrBalanceData: YagrWidgetData = {
            data: {
                timeline: timelineBudget,
                graphs: [
                    {
                        id: '0',
                        name: 'Баланс',
                        scale: 'y',
                        color: '#ffbe5c',
                        data: graphsDataNet,
                    },
                    {
                        id: '1',
                        name: 'Бонусы',
                        scale: 'y',
                        color: '#4aa1f2',
                        data: graphsDataBonus,
                    },
                    {
                        id: '2',
                        name: 'Счет',
                        scale: 'y',
                        color: '#5fb8a5',
                        data: graphsDataBalance,
                    },
                ],
            },

            libraryConfig: {
                chart: {
                    series: {
                        spanGaps: false,
                        type: 'line',
                        interpolation: 'smooth',
                    },
                },
                axes: {
                    y: {
                        label: 'Баланс',
                        precision: 'auto',
                        show: true,
                    },
                    x: {
                        label: 'Время',
                        precision: 'auto',
                        show: true,
                    },
                },
                series: [],
                scales: {y: {min: 0}},
                title: {
                    text: 'Изменение баланса',
                },
            },
        };

        return yagrBalanceData;
    };

    const filterTableData = (
        withfFilters: any = {},
        tableData: any = {},
        _filterAutoSales = undefined as any,
        datering = undefined,
    ) => {
        const [startDate, endDate] = datering ?? dateRange;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysBetween =
            Math.abs(
                startDate.getTime() -
                    (today.getTime() > endDate.getTime() ? endDate.getTime() : today.getTime()),
            ) /
            1000 /
            86400;

        const temp = [] as any;
        const usefilterAutoSales = _filterAutoSales ?? filterAutoSales;

        for (const [art, info] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            const artInfo: any = info;
            if (!art || !artInfo) continue;

            const tempTypeRow: any = artInfo;
            tempTypeRow['placements'] =
                artInfo['placements'] == -1 ? 10 * 1000 : artInfo['placements'];

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            if (Object.values(filtersRK).includes(true)) useFilters['filtersRK'] = filtersRK;
            else delete useFilters['filtersRK'];

            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '' && filterArg != 'placements') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (flarg && fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata?.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (usefilterAutoSales && !availableAutoSalesNmIds.includes(tempTypeRow['nmId'])) {
                    addFlag = false;
                    break;
                }

                if (filterArg == 'art') {
                    const rulesForAnd = filterData['val'].split('+');

                    let wholeText = '';
                    for (const key of ['art', 'title', 'brand', 'nmId', 'imtId', 'object']) {
                        wholeText += tempTypeRow[key] + ' ';
                    }

                    const tags = tempTypeRow['tags'];
                    if (tags) {
                        for (const key of tags) {
                            wholeText += key + ' ';
                        }
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
                } else if (filterArg == 'filtersRK') {
                    const adverts = tempTypeRow['adverts'];

                    let add = false;
                    if (adverts)
                        for (const id of Object.keys(adverts)) {
                            const status = doc?.adverts?.[selectValue[0]]?.[id]?.status;

                            const hasStatusFilter =
                                filtersRK['activeAdverts'] || filtersRK['pausedAdverts'];
                            let byStatus = !hasStatusFilter;

                            if (filtersRK['activeAdverts'] && status != 9) continue;
                            else if (filtersRK['activeAdverts']) byStatus = true;

                            if (filtersRK['pausedAdverts'] && status != 11) continue;
                            else if (filtersRK['pausedAdverts']) byStatus = true;

                            if (
                                filtersRK['bidderRules'] &&
                                !doc?.advertsAutoBidsRules?.[selectValue[0]]?.[id] &&
                                byStatus
                            )
                                add = true;
                            if (filtersRK['budgetRules'] && !advertBudgetRules[id] && byStatus)
                                add = true;
                            if (
                                filtersRK['phrasesRules'] &&
                                !doc?.advertsPlusPhrasesTemplates?.[selectValue[0]]?.[id] &&
                                byStatus
                            )
                                add = true;
                            if (
                                filtersRK['scheduleRules'] &&
                                !doc?.advertsSchedules?.[selectValue[0]]?.[id] &&
                                byStatus
                            )
                                add = true;

                            if (
                                !filtersRK['bidderRules'] &&
                                !filtersRK['budgetRules'] &&
                                !filtersRK['phrasesRules'] &&
                                !filtersRK['scheduleRules'] &&
                                byStatus &&
                                hasStatusFilter
                            )
                                add = true;
                        }
                    if (!add) addFlag = false;
                } else if (filterArg == 'placements') {
                    if (filterData['val'] == '') {
                        setPlacementsDisplayPhrase('');
                        setSelectedSearchPhrase('');
                        continue;
                    }
                    const temp = isNaN(parseInt(filterData['val']));

                    if (temp) {
                        setPlacementsDisplayPhrase(filterData['val']);
                        if (placementsDisplayPhrase != filterData['val'])
                            setSelectedSearchPhrase('');
                    } else if (!compare(tempTypeRow[filterArg], filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'adverts') {
                    const rulesForAnd = [filterData['val']];
                    const adverts = tempTypeRow[filterArg];
                    let wholeText = '';
                    let wholeTextTypes = '';
                    if (adverts)
                        for (const [id, _] of Object.entries(adverts)) {
                            wholeText += id + ' ';
                            const advertData = doc?.adverts?.[selectValue[0]]?.[id];

                            if (advertData)
                                wholeTextTypes += advertData.type == 8 ? 'авто ' : 'поиск ';
                        }

                    const lwr = String(filterData['val']).toLocaleLowerCase().trim();
                    if (['авто', 'поиск'].includes(lwr)) {
                        if (wholeTextTypes.includes(lwr)) continue;
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
                } else if (filterArg == 'autoSales') {
                    const rentabelnost = getRoundValue(
                        autoSalesProfits[tempTypeRow['art']]?.rentabelnost,
                        1,
                        true,
                    );
                    if (!compare(rentabelnost, filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'semantics') {
                    if (!compare(tempTypeRow['plusPhrasesTemplate'], filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'avg_price') {
                    if (
                        !compare(
                            getRoundValue(tempTypeRow['sum_orders'], tempTypeRow['orders']),
                            filterData,
                        )
                    ) {
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

        temp.sort((a: any, b: any) => {
            return a.art.localeCompare(b.art, 'ru-RU');
        });
        const filteredSummaryTemp = {
            art: '',
            orders: 0,
            sum_orders: 0,
            sum: 0,
            views: 0,
            clicks: 0,
            drr: 0,
            ctr: 0,
            analytics: 0,
            profit: 0,
            rentabelnost: 0,
            cpc: 0,
            cpm: 0,
            cr: 0,
            uniqueImtIds: 0,
            stocks: 0,
            dsi: 0,
            cpo: 0,
            cpl: 0,
            adverts: 0,
            semantics: null,
            budget: 0,
            romi: 0,
            openCardCount: 0,
            addToCartPercent: 0,
            addToCartCount: 0,
            cartToOrderPercent: 0,
        };
        const uniqueAdvertsIds: any[] = [];
        const uniqueImtIds: any[] = [];
        for (let i = 0; i < temp.length; i++) {
            const row = temp[i];
            const imtId = row['imtId'];
            if (!uniqueImtIds.includes(imtId)) uniqueImtIds.push(imtId);

            const adverts = row['adverts'];
            if (adverts) {
                for (const id of Object.keys(adverts)) {
                    if (!uniqueAdvertsIds.includes(id)) uniqueAdvertsIds.push(id);
                }
            }
            filteredSummaryTemp.sum_orders += row['sum_orders'];
            filteredSummaryTemp.orders += row['orders'];
            filteredSummaryTemp.stocks += row['stocks'];
            filteredSummaryTemp.sum += row['sum'];
            filteredSummaryTemp.views += row['views'];
            filteredSummaryTemp.clicks += row['clicks'];

            filteredSummaryTemp.profit += Math.round(row['profit'] ?? 0);

            filteredSummaryTemp.budget += row['budget'] ?? 0;
            filteredSummaryTemp.openCardCount += row['openCardCount'];
            filteredSummaryTemp.addToCartCount += row['addToCartCount'];
        }
        filteredSummaryTemp.uniqueImtIds = Math.round(uniqueImtIds.length);

        filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
        filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
        filteredSummaryTemp.stocks = Math.round(filteredSummaryTemp.stocks);
        filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
        filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
        filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
        filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
        filteredSummaryTemp.adverts = uniqueAdvertsIds.length;

        filteredSummaryTemp.profit = Math.round(filteredSummaryTemp.profit);
        filteredSummaryTemp.rentabelnost = getRoundValue(
            filteredSummaryTemp.profit,
            filteredSummaryTemp.sum_orders,
            true,
        );
        filteredSummaryTemp.analytics = filteredSummaryTemp.rentabelnost;

        filteredSummaryTemp.openCardCount = Math.round(filteredSummaryTemp.openCardCount);
        filteredSummaryTemp.addToCartPercent = getRoundValue(
            filteredSummaryTemp.addToCartCount,
            filteredSummaryTemp.openCardCount,
            true,
        );
        filteredSummaryTemp.cartToOrderPercent = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.addToCartCount,
            true,
        );

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
            filteredSummaryTemp.sum / 100,
            filteredSummaryTemp.clicks,
            true,
            filteredSummaryTemp.sum / 100,
        );
        filteredSummaryTemp.cpm = getRoundValue(
            filteredSummaryTemp.sum * 1000,
            filteredSummaryTemp.views,
        );
        filteredSummaryTemp.cr = getRoundValue(
            filteredSummaryTemp.orders,
            filteredSummaryTemp.openCardCount,
            true,
        );
        filteredSummaryTemp.cpo = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.orders,
            false,
            filteredSummaryTemp.sum,
        );
        filteredSummaryTemp.cpl = getRoundValue(
            filteredSummaryTemp.sum,
            filteredSummaryTemp.addToCartCount,
            false,
            filteredSummaryTemp.sum,
        );

        filteredSummaryTemp.romi = getRoundValue(
            filteredSummaryTemp.profit,
            filteredSummaryTemp.sum,
            true,
        );

        filteredSummaryTemp.dsi = getRoundValue(
            filteredSummaryTemp.stocks,
            filteredSummaryTemp.orders / (daysBetween + 1),
        );

        setFilteredSummary(filteredSummaryTemp);
        setFilteredData(temp);
    };

    const [fetchingDataFromServerFlag, setFetchingDataFromServerFlag] = useState(false);
    const [firstRecalc, setFirstRecalc] = useState(false);

    useEffect(() => {
        if (fetchingDataFromServerFlag) return;
        getNames();
    }, [sellerId, fetchingDataFromServerFlag]);

    const fetchArts = async () => {
        try {
            const response = await ApiClient.post('massAdvert/new/arts-nmIds', {
                seller_id: sellerId,
            });
            if (!response?.data) {
                throw new Error('error while getting advertBudgetRules');
            }
            const temp = response?.data;

            setArts(temp);
        } catch (error: any) {
            console.error(error);
            showError(error);
        }
    };
    useEffect(() => {
        fetchArts();
    }, [sellerId, firstRecalc]);

    const [changedColumns, setChangedColumns] = useState<any>(false);

    const balance = (() => {
        const map: any = {balance: 'Счет', bonus: 'Бонусы', net: 'Баланс'};

        const temp = doc?.balances?.[selectValue[0]]?.data?.slice(-1)?.[0]?.balance;
        const arr = [] as string[];
        if (temp)
            for (const [type, val] of Object.entries(temp)) {
                if (val)
                    arr.push(
                        map[type] + ': ' + new Intl.NumberFormat('ru-RU').format(val as number),
                    );
            }
        return arr.join(' ');
    })();

    if (changedDoc) {
        setChangedDoc(undefined);
        setChangedDocUpdateType(false);
        recalc(dateRange, selectValue[0], filters, changedDoc);
    }

    if (changedColumns) {
        setChangedColumns(false);
    }

    if (!doc)
        return isMobile ? (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LogoLoad />
            </div>
        ) : (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-around',
                        margin: '8px 0',
                    }}
                >
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                    <Card style={{...cardStyle, flexDirection: 'column'}}>
                        <Skeleton style={{width: '50%', height: 18}} />
                        <div style={{minHeight: 4}} />
                        <Skeleton style={{width: '70%', height: 36}} />
                    </Card>
                </div>
                <div
                    style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                        <div style={{minWidth: 4}} />
                        <Skeleton
                            style={{
                                width: 120,
                                height: 36,
                            }}
                        />
                    </div>
                </div>
                <div style={{minHeight: 8}} />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: '20vw',
                            height: 48,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: '100%',
                            height: 48,
                        }}
                    />
                </div>
                <div style={{minHeight: 4}} />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: '20vw',
                            height: 'calc(68vh - 96px)',
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: '100%',
                            height: 'calc(68vh - 96px)',
                        }}
                    />
                </div>
                <div style={{minHeight: 4}} />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: '20vw',
                            height: 48,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: '100%',
                            height: 48,
                        }}
                    />
                </div>
            </div>
        );

    if (dateChangeRecalc) {
        setFetchingDataFromServerFlag(true);
        setDateChangeRecalc(false);

        callApi('calcMassAdvertsNew', {
            uid: getUid(),
            campaignName: selectValue[0],
            dateRange: getNormalDateRange(dateRange),
        }).then((res) => {
            if (!res) return;
            const resData = res['data'];
            doc['campaigns'][selectValue[0]] = resData['campaigns'][selectValue[0]];
            doc['balances'][selectValue[0]] = resData['balances'][selectValue[0]];
            doc['plusPhrasesTemplates'][selectValue[0]] =
                resData['plusPhrasesTemplates'][selectValue[0]];
            doc['advertsPlusPhrasesTemplates'][selectValue[0]] =
                resData['advertsPlusPhrasesTemplates'][selectValue[0]];
            doc['advertsSelectedPhrases'][selectValue[0]] =
                resData['advertsSelectedPhrases'][selectValue[0]];
            doc['advertsAutoBidsRules'][selectValue[0]] =
                resData['advertsAutoBidsRules'][selectValue[0]];
            doc['adverts'][selectValue[0]] = resData['adverts'][selectValue[0]];
            doc['advertsSchedules'][selectValue[0]] = resData['advertsSchedules'][selectValue[0]];

            setChangedDoc({...doc});

            setDateChangeRecalc(false);
            setFetchingDataFromServerFlag(false);
            console.log(doc);
        });

        setPagesCurrent(1);
    }

    if (!firstRecalc) {
        console.log(doc);

        for (let i = 0; i < columnData.length; i++) {
            const {name, valueType} = columnData[i] ?? {};
            if (!name) continue;
            if (!filters[name])
                filters[name] = {val: '', compMode: valueType != 'text' ? 'bigger' : 'include'};
        }
        setFilters({...filters});

        setFirstRecalc(true);
    }

    const getUniqueAdvertIdsFromThePage = () => {
        const lwr = filters['adverts']
            ? String(filters['adverts']['val']).toLocaleLowerCase().trim()
            : '';
        const lwrAsNumber: number = parseInt(lwr);
        const uniqueAdverts: any = {};

        for (let i = 0; i < filteredData.length; i++) {
            const {adverts} = filteredData[i];
            if (!adverts) continue;

            for (const [id, _] of Object.entries(adverts)) {
                if (!id) continue;
                const advertData = doc?.adverts?.[selectValue[0]]?.[id];
                if (!advertData) continue;
                const {advertId, type} = advertData;
                if (!advertId) continue;
                if (lwr == 'авто' && type != 8) continue;
                else if (lwr == 'поиск' && ![6, 9].includes(type)) continue;
                else if (!Number.isNaN(lwrAsNumber) && !id.includes(lwr)) continue;

                uniqueAdverts[advertId] = {advertId: advertId};
            }
        }
        return uniqueAdverts;
    };

    return (
        <div style={{width: '100%', flexWrap: 'wrap'}}>
            {isMobile ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: 16,
                    }}
                >
                    <RangePicker
                        args={{
                            align: 'column',
                            recalc,
                            dateRange,
                            setDateRange,
                            anchorRef,
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
            <StatisticsPanel summary={summary} />
            {!isMobile ? (
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
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <AdvertCreateModal
                                doc={doc}
                                filteredData={filteredData}
                                setChangedDoc={setChangedDoc}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    view="action"
                                    size="l"
                                >
                                    <Icon data={SlidersVertical} />
                                    <Text variant="subheader-1">Создать</Text>
                                </Button>
                            </AdvertCreateModal>
                            <div style={{minWidth: 8}} />
                            <AdvertsStatusManagingModal
                                setUpdatePaused={setUpdatePaused}
                                disabled={permission != 'Управление'}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    view="action"
                                    size="l"
                                    style={{cursor: 'pointer'}}
                                >
                                    <Icon data={Play} />
                                    <Text variant="subheader-1">Управление</Text>
                                </Button>
                            </AdvertsStatusManagingModal>
                            <div style={{minWidth: 8}} />
                            <AdvertsBidsModal
                                disabled={permission != 'Управление'}
                                selectValue={selectValue}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                advertId={undefined}
                            >
                                <Button
                                    view="action"
                                    size="l"
                                    disabled={permission != 'Управление'}
                                >
                                    <Icon data={ChartLine} />
                                    <Text variant="subheader-1">Ставки</Text>
                                </Button>
                            </AdvertsBidsModal>
                            <div style={{minWidth: 8}} />
                            <AdvertsBudgetsModal
                                disabled={permission != 'Управление'}
                                selectValue={selectValue}
                                sellerId={sellerId}
                                advertBudgetsRules={advertBudgetRules}
                                setAdvertBudgetsRules={setAdvertBudgetRules}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                                advertId={undefined}
                            >
                                <Button
                                    view="action"
                                    size="l"
                                    disabled={permission != 'Управление'}
                                >
                                    <Icon data={CircleRuble} />
                                    <Text variant="subheader-1">Бюджет</Text>
                                </Button>
                            </AdvertsBudgetsModal>
                            <div style={{minWidth: 8}} />
                            <PhrasesModal
                                disabled={permission != 'Управление'}
                                getTemplates={getNames}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                            />
                            <div style={{minWidth: 8}} />
                            <AdvertsSchedulesModal
                                setUpdatePaused={setUpdatePaused}
                                disabled={permission != 'Управление'}
                                doc={doc}
                                setChangedDoc={setChangedDoc}
                                advertId={undefined as any}
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    view="action"
                                    size="l"
                                >
                                    <Icon data={Clock} />
                                    <Text variant="subheader-1">График</Text>
                                </Button>
                            </AdvertsSchedulesModal>
                            <div style={{minWidth: 8}} />
                            <TagsFilterModal filterByButton={filterByButton} />
                            <div style={{minWidth: 8}} />
                            <AutoSalesModal
                                disabled={permission != 'Управление'}
                                selectValue={selectValue}
                                filteredData={filteredData}
                                setAutoSalesProfits={setAutoSalesProfits}
                                sellerId={sellerId}
                                openFromParent={autoSalesModalOpenFromParent}
                                setOpenFromParent={setAutoSalesModalOpenFromParent}
                            />
                            <div style={{minWidth: 8}} />
                            <Popover
                                enableSafePolygon={true}
                                openDelay={500}
                                placement={'bottom'}
                                content={
                                    <div
                                        style={{
                                            height: 'calc(30em)',
                                            width: '60em',
                                            overflow: 'auto',
                                            display: 'flex',
                                        }}
                                    >
                                        <Card
                                            view="outlined"
                                            theme="warning"
                                            style={{
                                                height: '30em',
                                                width: '60em',
                                                overflow: 'auto',
                                                top: -10,
                                                left: -200,
                                                display: 'flex',
                                            }}
                                        >
                                            <ChartKit type="yagr" data={getBalanceYagrData()} />
                                        </Card>
                                    </div>
                                }
                            >
                                <Button view="outlined-success" size="l">
                                    <Text variant="subheader-1">{balance}</Text>
                                </Button>
                            </Popover>
                        </div>
                        <Modal
                            open={advertsArtsListModalFromOpen}
                            onClose={() => {
                                setAdvertsArtsListModalFromOpen(false);
                                setSemanticsModalOpenFromArt('');
                            }}
                        >
                            <div
                                style={{
                                    margin: 20,
                                    width: '30vw',
                                    height: '60vh',
                                    overflow: 'scroll',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        margin: '8px 0',
                                    }}
                                    variant="display-2"
                                >
                                    {rkListMode == 'add'
                                        ? 'Добавить артикул в РК'
                                        : 'Удалить артикул из РК'}
                                </Text>
                                <List
                                    filterPlaceholder={`Поиск по Id кампании среди ${rkList.length} шт.`}
                                    items={rkList}
                                    itemHeight={112}
                                    renderItem={(advertId) => {
                                        return (
                                            <div
                                                style={{
                                                    padding: '0 16px',
                                                    display: 'flex',
                                                    margin: '4px 0',
                                                    flexDirection: 'row',
                                                    height: 96,
                                                    width: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}
                                            >
                                                <AdvertCard
                                                    drrToday={advertsTodayDrr?.[advertId]}
                                                    getNames={getNames}
                                                    pausedAdverts={pausedAdverts}
                                                    setUpdatePaused={setUpdatePaused}
                                                    sellerId={sellerId}
                                                    advertBudgetRules={advertBudgetRules}
                                                    setAdvertBudgetRules={setAdvertBudgetRules}
                                                    permission={permission}
                                                    id={advertId}
                                                    index={-1}
                                                    nmId={0}
                                                    doc={doc}
                                                    selectValue={selectValue}
                                                    copiedAdvertsSettings={copiedAdvertsSettings}
                                                    setChangedDoc={setChangedDoc}
                                                    manageAdvertsActivityCallFunc={
                                                        manageAdvertsActivityCallFunc
                                                    }
                                                    updateColumnWidth={updateColumnWidth}
                                                    filteredData={filteredData}
                                                    setCopiedAdvertsSettings={
                                                        setCopiedAdvertsSettings
                                                    }
                                                    setDateRange={setDateRange}
                                                    dateRange={dateRange}
                                                    recalc={recalc}
                                                    filterByButton={filterByButton}
                                                    getUniqueAdvertIdsFromThePage={
                                                        getUniqueAdvertIdsFromThePage
                                                    }
                                                    template={
                                                        shortAdvertInfo[advertId] ?? {
                                                            advertId: parseInt(advertId),
                                                            templateName: 'Фразы',
                                                        }
                                                    }
                                                />
                                                <div style={{minWidth: 8}} />
                                                <Button
                                                    view={
                                                        rkListMode == 'add'
                                                            ? 'outlined-success'
                                                            : 'outlined-danger'
                                                    }
                                                    disabled={
                                                        !doc.adverts?.[selectValue[0]]?.[
                                                            advertId
                                                        ] ||
                                                        doc?.adverts?.[selectValue[0]]?.[advertId]
                                                            ?.type != 8
                                                    }
                                                    onClick={async () => {
                                                        const params: any = {
                                                            uid: getUid(),
                                                            campaignName: selectValue[0],
                                                            data: {
                                                                advertsIds: {},
                                                                mode: rkListMode,
                                                            },
                                                        };
                                                        params.data.advertsIds[advertId] = {
                                                            advertId: advertId,
                                                            art: semanticsModalOpenFromArt,
                                                        };

                                                        console.log(params);

                                                        const res = await callApi(
                                                            'manageAdvertsNMs',
                                                            params,
                                                        );
                                                        console.log(res);
                                                        if (!res || res['data'] === undefined) {
                                                            return;
                                                        }

                                                        if (res['data']['status'] == 'ok') {
                                                            if (
                                                                !doc.campaigns[selectValue[0]][
                                                                    semanticsModalOpenFromArt
                                                                ].adverts
                                                            )
                                                                doc.campaigns[selectValue[0]][
                                                                    semanticsModalOpenFromArt
                                                                ].adverts = {};

                                                            doc.campaigns[selectValue[0]][
                                                                semanticsModalOpenFromArt
                                                            ].adverts[advertId] =
                                                                rkListMode == 'add'
                                                                    ? {advertId: advertId}
                                                                    : undefined;

                                                            if (rkListMode == 'delete') {
                                                                delete doc.campaigns[
                                                                    selectValue[0]
                                                                ][semanticsModalOpenFromArt]
                                                                    .adverts[advertId];
                                                                const adverts =
                                                                    doc.campaigns[selectValue[0]][
                                                                        semanticsModalOpenFromArt
                                                                    ].adverts;
                                                                if (adverts) {
                                                                    const temp = [] as any[];
                                                                    for (const [
                                                                        _,
                                                                        data,
                                                                    ] of Object.entries(adverts)) {
                                                                        const advertData: any =
                                                                            data;
                                                                        if (!advertData) continue;
                                                                        temp.push(
                                                                            advertData['advertId'],
                                                                        );
                                                                    }
                                                                    setRkList(temp);
                                                                }
                                                            }

                                                            setAdvertsArtsListModalFromOpen(false);
                                                        }
                                                        setChangedDoc({...doc});
                                                    }}
                                                >
                                                    <Icon
                                                        data={rkListMode == 'add' ? Plus : Xmark}
                                                    />
                                                </Button>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </Modal>
                        {showDzhemModalOpen && (
                            <DzhemPhrasesModal
                                open={showDzhemModalOpen}
                                onClose={() => setShowDzhemModalOpen(false)}
                                sellerId={sellerId}
                                nmId={selectedNmId}
                            />
                        )}
                        {/* {showArtStatsModalOpen && (
                            <ModalWindow
                                padding={false}
                                isOpen={showArtStatsModalOpen}
                                handleClose={() => setShowArtStatsModalOpen(false)}
                            >
                                <div
                                    style={
                                        {
                                            background: theme == 'light' ? '#fff9' : undefined,
                                            width: '90vw',
                                            height: '70vh',
                                            margin: 16,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            '--g-color-base-background':
                                                theme === 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeee',
                                            gap: 16,
                                        } as CSSProperties
                                    }
                                >
                                    <Text variant="header-2">Статистика по дням</Text>
                                    <TheTable
                                        height={'calc(70vh - 96px)'}
                                        columnData={columnDataArtByDayStats}
                                        data={artsStatsByDayFilteredData}
                                        filters={artsStatsByDayFilters}
                                        setFilters={setArtsStatsByDayFilters}
                                        filterData={artsStatsByDayDataFilter}
                                        footerData={[artsStatsByDayFilteredSummary]}
                                        tableId={'byDateStatsTable'}
                                        defaultPaginationSize={50}
                                        usePagination={true}
                                    />
                                </div>
                            </ModalWindow>
                        )} */}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Button
                                style={{
                                    marginBottom: 8,
                                }}
                                loading={fetchingDataFromServerFlag}
                                size="l"
                                view="action"
                                onClick={updateTheData}
                            >
                                <Icon data={ArrowsRotateLeft} />
                            </Button>
                            <div style={{width: 8}} />
                            {fetchingDataFromServerFlag ? <Spin style={{marginRight: 8}} /> : <></>}
                        </div>
                        <RangePicker
                            args={{
                                recalc,
                                dateRange,
                                setDateRange,
                                anchorRef,
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div style={{marginBottom: 80}} />
            )}

            {isMobile ? (
                <></>
            ) : (
                <TheTable
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    footerData={[filteredSummary]}
                    tableId={'massAdverts'}
                    usePagination={true}
                    onPaginationUpdate={({page, paginatedData}: any) => {
                        setPagesCurrent(page);
                        setFilteredSummary((row) => {
                            const temp = row;
                            temp.art = `На странице SKU: ${paginatedData.length} Всего SKU: ${filteredData.length} ID КТ: ${temp.uniqueImtIds}`;

                            return temp;
                        });
                    }}
                    defaultPaginationSize={300}
                    width="100%"
                    height="calc(100vh - 68px - 70px - 38px)"
                />
            )}
        </div>
    );
};

export const generateModalButtonWithActions = (
    params: {
        disabled?: boolean;
        pin?: ButtonPin;
        size?: ButtonSize;
        view?: ButtonView;
        style?: CSSProperties;
        selected?: boolean;
        placeholder: string;
        icon: IconData;
        onClick?: any;
    },
    selectedButton: any,
    setSelectedButton: any,
) => {
    const {pin, size, view, style, selected, placeholder, icon, onClick, disabled} = params;
    if (selected || selectedButton || setSelectedButton) {
    }
    return (
        <motion.div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Button
                disabled={disabled}
                style={
                    style ?? {
                        margin: '4px 0px',
                    }
                }
                pin={pin ?? 'circle-circle'}
                size={size ?? 'l'}
                view={view ?? 'action'}
                selected={true}
                onClick={() => {
                    onClick();
                }}
            >
                <Icon data={icon} />
                {placeholder}
            </Button>
        </motion.div>
    );
};
