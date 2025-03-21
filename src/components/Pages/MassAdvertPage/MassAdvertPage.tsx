'use client';
import {useEffect, useMemo, useRef, useState} from 'react';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';

import {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';

settings.set({plugins: [YagrPlugin]});
import callApi, {getUid} from '@/utilities/callApi';
import axios, {CancelTokenSource} from 'axios';
import {getLocaleDateString, getNormalDateRange} from '@/utilities/getRoundValue';
import TheTable, {compare} from '@/components/TheTable';
import {RangePicker} from '@/components/RangePicker';
import {LogoLoad} from '@/components/logoLoad';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useCampaign} from '@/contexts/CampaignContext';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {useModules} from '@/contexts/ModuleProvider';
import {Note} from './NotesForArt/types';
import {StatisticsPanel} from '@/widgets/MassAdvert/overallStats/ui';
import {
    getAddToCardPercentColumn,
    getAddToCartCountColumn,
    getAvgPriceColum,
    getCardToOrderPercentColumn,
    getClicksColumn,
    getCPCColumn,
    getCPLColumn,
    getCPMColumn,
    getCpoColumn,
    getCRColumn,
    getCTRColumn,
    getDrrColumn,
    getDsiColumn,
    getOpenCardCountColumn,
    getOrdersColumn,
    getRomiColumn,
    getStocksColumn,
    getSumColumn,
    getSumOrdersColumn,
    getViewsColumn,
} from '@/widgets/MassAdvert/columnData/config/columns';
import {getPlacementsColumn} from '@/widgets/MassAdvert/columnData/config/placementsColumn';
import {getAnalyticsColumn} from '@/widgets/MassAdvert/columnData/config/analyticsColumn';
import {getArtColumn} from '@/widgets/MassAdvert/columnData/config/artColumn';
import {getAdvertsColumn} from '@/widgets/MassAdvert/columnData/config/advertsColumn';
import {getAutoSalesColumn} from '@/widgets/MassAdvert/columnData/config/autoSalesColumn';
import {MassAdvertPageSkeleton} from '@/components/Pages/MassAdvertPage/Skeleton';
import {campaignStore} from '@/shared/stores/campaignStore';
import {UpTableActions} from '@/widgets/MassAdvert/upTableActions/ui/widget';

const getUserDoc = (docum = undefined, mode = false, selectValue = '') => {
    const [doc, setDocument] = useState<any>();

    if (docum) {
        // console.log(docum, mode, selectValue);

        if (mode) {
            doc['campaigns'][selectValue] = docum['campaigns'][selectValue];
            doc['balances'][selectValue] = docum['balances'][selectValue];
            doc['plusPhrasesTemplates'][selectValue] = docum['plusPhrasesTemplates'][selectValue];
            doc['advertsPlusPhrasesTemplates'][selectValue] =
                docum['advertsPlusPhrasesTemplates'][selectValue];
            doc['adverts'][selectValue] = docum['adverts'][selectValue];
            // doc['placementsAuctions'][selectValue] = docum['placementsAuctions'][selectValue];
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
    const {
        setSummary,
        setSemanticsModalOpenFromArt,
        setAutoSalesModalOpenFromParent,
        setArtsStatsByDayData,
        setShowDzhemModalOpen,
        setAdvertsArtsListModalFromOpen,
        setShowArtStatsModalOpen,
        setFetchingDataFromServerFlag,
        setRkList,
        setRkListMode,
    } = campaignStore;
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
    const [currentParsingProgress, setCurrentParsingProgress] = useState<any>({});

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

    const today = new Date(
        new Date()
            .toLocaleDateString('ru-RU')
            .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')
            .slice(0, 10),
    );
    // const monthAgo = new Date(today);
    // monthAgo.setDate(monthAgo.getDate() - 30);

    const [dateRange, setDateRange] = useState([today, today]);

    const [allNotes, setAllNotes] = useState<{[key: string]: Note[]} | undefined>();
    const [reloadNotes, setReloadNotes] = useState<boolean>(true);
    useEffect(() => {
        if (reloadNotes) {
            console.log('privet kak del');
            getNotes();
            setReloadNotes(false);
        }
    }, [sellerId, reloadNotes]);

    const [pagesCurrent, setPagesCurrent] = useState(1);

    const [data, setTableData] = useState({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [dateChangeRecalc, setDateChangeRecalc] = useState(false);

    const [unvalidatedArts, setUnvalidatedArts] = useState<any[]>([]);
    const [changedDoc, setChangedDoc] = useState<any>(undefined);
    const [changedDocUpdateType, setChangedDocUpdateType] = useState(false);

    const doc = getUserDoc(changedDoc, changedDocUpdateType, selectValue[0]);

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
        // console.log(
        //     tableData,
        //     data,
        //     Object.keys(tableData).length ? tableData : data,
        //     withfFilters['undef'] ? withfFilters : filters,
        // );

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
                    continue;
                } else if (fldata?.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (usefilterAutoSales && !availableAutoSalesNmIds.includes(tempTypeRow['nmId'])) {
                    addFlag = false;
                    break;
                }

                if (filterArg == 'art') {
                    const rulesForAnd = filterData['val'].split('+');
                    // console.log(rulesForAnd);

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
                    tagsNodes.pop();
                }
                return footer ? (
                    <div style={{height: 28}}>{value}</div>
                ) : (
                    <div
                        // title={value}
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
                                    // width: 20,
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
                                        // behavior={'delayed' as PopoverBehavior}
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
                                            <Button
                                                pin="brick-brick"
                                                view="outlined"
                                                size="xs"
                                                // selected
                                                // view={index % 2 == 0 ? 'flat' : 'flat-action'}
                                                onClick={() => {
                                                    setShowArtStatsModalOpen(true);
                                                    setArtsStatsByDayData(calcByDayStats([art]));
                                                }}
                                            >
                                                <Icon data={LayoutList}></Icon>
                                            </Button>
                                            <div style={{minWidth: 2}} />
                                            <Button
                                                pin="brick-brick"
                                                view="outlined"
                                                size="xs"
                                                // selected
                                                // view={index % 2 == 0 ? 'flat' : 'flat-action'}
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
                                                // style={{
                                                //     background:
                                                //         'linear-gradient(135deg, #ff9649, #ff5e62)',
                                                // }}
                                            >
                                                {/* <div style={{width: 11}}>
                                                    <Text>
                                                        <img
                                                            color="white"
                                                            style={{width: '100%', height: 'auto'}}
                                                            src={JarIcon}
                                                        />
                                                    </Text>
                                                </div> */}
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
                          // size="l"
                          view="outlined"
                          onClick={() => filterByButton('авто', 'adverts')}
                      >
                          <Icon data={Rocket} size={14} />
                      </Button>,
                      <Button
                          style={{marginLeft: 5}}
                          // size="l"
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
                              position={'start'}
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
                      const {art} = row;
                      const switches: any[] = [];
                      if (value)
                          for (const [advertId, _] of Object.entries(value)) {
                              const advertData = doc?.adverts?.[selectValue[0]]?.[advertId];
                              if (!advertData) continue;
                              // console.log('popa', advertData, filters['adverts'].val);
                              if (
                                  filters['adverts'] &&
                                  ['авто', 'поиск'].includes(
                                      String(filters['adverts'].val).toLowerCase().trim(),
                                  )
                              ) {
                                  // console.log('popa2', advertData, filters['adverts'].val);
                                  if (
                                      String(filters['adverts'].val)
                                          .toLowerCase()
                                          .includes('поиск') &&
                                      (advertData.type == 9 || advertData.type == 6)
                                  ) {
                                      switches.push(
                                          <AdvertCard
                                              sellerId={sellerId}
                                              advertBudgetRules={advertBudgetRules}
                                              setAdvertBudgetRules={setAdvertBudgetRules}
                                              permission={permission}
                                              id={advertId}
                                              index={index}
                                              art={art}
                                              doc={doc}
                                              selectValue={selectValue}
                                              copiedAdvertsSettings={copiedAdvertsSettings}
                                              setChangedDoc={setChangedDoc}
                                              manageAdvertsActivityCallFunc={
                                                  manageAdvertsActivityCallFunc
                                              }
                                              setArtsStatsByDayData={setArtsStatsByDayData}
                                              updateColumnWidth={updateColumnWidth}
                                              filteredData={filteredData}
                                              setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                              setFetchedPlacements={setFetchedPlacements}
                                              currentParsingProgress={currentParsingProgress}
                                              setCurrentParsingProgress={setCurrentParsingProgress}
                                              setDateRange={setDateRange}
                                              setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                              dateRange={dateRange}
                                              recalc={recalc}
                                              filterByButton={filterByButton}
                                              getUniqueAdvertIdsFromThePage={
                                                  getUniqueAdvertIdsFromThePage
                                              }
                                          />,
                                      );
                                  } else if (
                                      filters['adverts'] &&
                                      String(filters['adverts'].val)
                                          .toLowerCase()
                                          .includes('авто') &&
                                      advertData.type == 8
                                  ) {
                                      switches.push(
                                          <AdvertCard
                                              sellerId={sellerId}
                                              advertBudgetRules={advertBudgetRules}
                                              setAdvertBudgetRules={setAdvertBudgetRules}
                                              permission={permission}
                                              id={advertId}
                                              index={index}
                                              art={art}
                                              doc={doc}
                                              selectValue={selectValue}
                                              copiedAdvertsSettings={copiedAdvertsSettings}
                                              setChangedDoc={setChangedDoc}
                                              manageAdvertsActivityCallFunc={
                                                  manageAdvertsActivityCallFunc
                                              }
                                              setArtsStatsByDayData={setArtsStatsByDayData}
                                              updateColumnWidth={updateColumnWidth}
                                              filteredData={filteredData}
                                              setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                              setFetchedPlacements={setFetchedPlacements}
                                              currentParsingProgress={currentParsingProgress}
                                              setCurrentParsingProgress={setCurrentParsingProgress}
                                              setDateRange={setDateRange}
                                              setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                              dateRange={dateRange}
                                              recalc={recalc}
                                              filterByButton={filterByButton}
                                              getUniqueAdvertIdsFromThePage={
                                                  getUniqueAdvertIdsFromThePage
                                              }
                                          />,
                                      );
                                  } else {
                                      continue;
                                  }
                              } else {
                                  switches.push(
                                      <AdvertCard
                                          sellerId={sellerId}
                                          advertBudgetRules={advertBudgetRules}
                                          setAdvertBudgetRules={setAdvertBudgetRules}
                                          permission={permission}
                                          id={advertId}
                                          index={index}
                                          art={art}
                                          doc={doc}
                                          selectValue={selectValue}
                                          copiedAdvertsSettings={copiedAdvertsSettings}
                                          setChangedDoc={setChangedDoc}
                                          manageAdvertsActivityCallFunc={
                                              manageAdvertsActivityCallFunc
                                          }
                                          setArtsStatsByDayData={setArtsStatsByDayData}
                                          updateColumnWidth={updateColumnWidth}
                                          filteredData={filteredData}
                                          setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                          setFetchedPlacements={setFetchedPlacements}
                                          currentParsingProgress={currentParsingProgress}
                                          setCurrentParsingProgress={setCurrentParsingProgress}
                                          setDateRange={setDateRange}
                                          setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                          dateRange={dateRange}
                                          recalc={recalc}
                                          filterByButton={filterByButton}
                                          getUniqueAdvertIdsFromThePage={
                                              getUniqueAdvertIdsFromThePage
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
                                  // justifyContent: 'space-between',
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
                // console.log(dataA, dataB);
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
                    return undefined;
                };
                const fistActiveAdvert = findFirstActive(adverts);
                const updateTimeObj = new Date(updateTime);
                const moreThatHour =
                    new Date().getTime() / 1000 / 3600 - updateTimeObj.getTime() / 1000 / 3600 > 1;
                const {advertId} = fistActiveAdvert ?? {};
                // console.log(
                //     advertId,
                //     doc.advertsSelectedPhrases[selectValue[0]][advertId]
                //         ? doc.advertsSelectedPhrases[selectValue[0]][advertId].phrase == phrase
                //         : false,
                //     phrase,
                // );
                const isSelectedPhrase =
                    doc?.advertsSelectedPhrases?.[selectValue[0]]?.[advertId]?.phrase == phrase;
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
                            {phrase ? <Auction sellerId={sellerId} phrase={phrase} /> : <></>}
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
                                        if (
                                            !doc['advertsSelectedPhrases'][selectValue[0]][advertId]
                                        )
                                            doc['advertsSelectedPhrases'][selectValue[0]][
                                                advertId
                                            ] = {
                                                phrase: '',
                                            };
                                        if (isSelectedPhrase) {
                                            doc['advertsSelectedPhrases'][selectValue[0]][
                                                advertId
                                            ] = undefined;
                                        } else {
                                            doc['advertsSelectedPhrases'][selectValue[0]][
                                                advertId
                                            ].phrase = phrase;
                                        }
                                        setChangedDoc({...doc});
                                        const params: any = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            data: {
                                                mode: isSelectedPhrase ? 'Удалить' : 'Установить',
                                                advertsIds: {},
                                            },
                                        };
                                        params.data.advertsIds[advertId] = {};
                                        params.data.advertsIds[advertId].phrase = phrase;
                                        console.log(params);
                                        callApi('updateAdvertsSelectedPhrases', params);
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
        {
            name: 'stocks',
            placeholder: 'Остаток',
            group: true,
            render: ({value}: any) => {
                // const {advertsStocksThreshold} = row;
                // if (!advertsStocksThreshold) return value;
                // const {stocksThreshold} = advertsStocksThreshold ?? {};
                // if (!stocksThreshold) return value;
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
        {name: 'sum', placeholder: 'Расход, ₽'},
        {name: 'orders', placeholder: 'Заказы, шт.'},
        {name: 'sum_orders', placeholder: 'Заказы, ₽'},
        {
            name: 'avg_price',
            placeholder: 'Ср. Чек, ₽',
            render: ({row}: any) => {
                return defaultRender({value: getRoundValue(row?.sum_orders, row?.orders)});
            },
            sortFunction: (a: any, b: any, order: any) => {
                const dataA = getRoundValue(a?.sum_orders, a?.orders);
                const dataB = getRoundValue(b?.sum_orders, b?.orders);
                // console.log(dataA, dataB);
                const isNaNa = isNaN(dataA);
                const isNaNb = isNaN(dataB);
                if (isNaNa && isNaNb) return 1;
                else if (isNaNa) return 1;
                else if (isNaNb) return -1;
                return (dataA - dataB) * order;
            },
        },
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: ({value, row}: any) => {
                const findMinDrr = (adverts: any) => {
                    let minDrr = 0;
                    for (const [id, _] of Object.entries(adverts ?? {})) {
                        const advert = doc?.adverts?.[selectValue[0]]?.[id];
                        if (!advert) continue;
                        if (![9, 11].includes(advert?.status)) continue;
                        const drrAI = doc?.advertsAutoBidsRules[selectValue[0]]?.[advert?.advertId];
                        const {desiredDRR, useManualMaxCpm, autoBidsMode} = drrAI ?? {};
                        if (useManualMaxCpm || ['cpo'].includes(autoBidsMode)) continue;
                        if (desiredDRR > minDrr) minDrr = desiredDRR;
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

    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [sort, setSort] = React.useState<any[]>([{column: 'Расход', order: 'asc'}]);
    // const [doc, setUserDoc] = React.useState(getUserDoc());

    const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    useEffect(() => {
        if (!selectValue) return;
        if (!selectValue[0] || selectValue[0] == '') return;
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
            // if (row['art'] == 'страйп/15/16-1406')
            //     console.log(
            //         row['profit'],
            //         filteredSummaryTemp.analytics,
            //         filteredSummaryTemp.analytics + Math.round(row['profit'] ?? 0),
            //     );
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

    const getUniqueAdvertIdsFromThePage = () => {
        const lwr = filters['adverts']
            ? String(filters['adverts']['val']).toLocaleLowerCase().trim()
            : '';

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

                uniqueAdverts[advertId] = {advertId: advertId};
            }
        }
        return uniqueAdverts;
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

        return await callApi('manageAdvertsActivity', params);
    };

    const filterByButton = (val: any, key = 'art', compMode = 'include') => {
        filters[key] = {val: String(val) + ' ', compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const calcByDayStats = (arts: any[]) => {
        const tempJson: any = {};

        const daysBetween =
            dateRange[1].getTime() / 86400 / 1000 - dateRange[0].getTime() / 86400 / 1000;

        const now = new Date();
        for (let i = 0; i <= daysBetween; i++) {
            const dateIter = new Date(dateRange[1]);
            dateIter.setDate(dateIter.getDate() - i);

            if (dateIter > now) continue;
            const strDate = getLocaleDateString(dateIter);

            if (!tempJson[strDate])
                tempJson[strDate] = {
                    date: dateIter,
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
                    openCardCount: 0,
                    addToCartCount: 0,
                    addToCartPercent: 0,
                    cartToOrderPercent: 0,
                    cpl: 0,
                };

            for (const _art of arts) {
                const {advertsStats, nmFullDetailReport} = doc.campaigns[selectValue[0]][_art];
                if (!advertsStats) continue;
                const dateData = advertsStats[strDate];
                if (!dateData) continue;

                tempJson[strDate].orders += dateData['orders'];
                tempJson[strDate].sum_orders += dateData['sum_orders'];
                tempJson[strDate].sum += dateData['sum'];
                tempJson[strDate].views += dateData['views'];
                tempJson[strDate].clicks += dateData['clicks'];

                const {openCardCount, addToCartCount} = nmFullDetailReport.statistics[strDate] ?? {
                    openCardCount: 0,
                    addToCartCount: 0,
                };

                tempJson[strDate].openCardCount += openCardCount ?? 0;
                tempJson[strDate].addToCartCount += addToCartCount ?? 0;
            }
            tempJson[strDate].openCardCount = Math.round(tempJson[strDate].openCardCount);

            tempJson[strDate].addToCartPercent = getRoundValue(
                tempJson[strDate].addToCartCount,
                tempJson[strDate].openCardCount,
                true,
            );
            tempJson[strDate].cartToOrderPercent = getRoundValue(
                tempJson[strDate].orders,
                tempJson[strDate].addToCartCount,
                true,
            );
            tempJson[strDate].cpl = getRoundValue(
                tempJson[strDate].sum,
                tempJson[strDate].addToCartCount,
            );
        }

        const temp = [] as any[];

        for (const [strDate, data] of Object.entries(tempJson)) {
            const dateData: any = data;
            if (!strDate || !dateData) continue;

            dateData['orders'] = Math.round(dateData['orders']);
            dateData['sum_orders'] = Math.round(dateData['sum_orders']);
            dateData['sum'] = Math.round(dateData['sum']);
            dateData['views'] = Math.round(dateData['views']);
            dateData['clicks'] = Math.round(dateData['clicks']);

            const {orders, sum, clicks, views} = dateData as any;

            dateData['drr'] = getRoundValue(dateData['sum'], dateData['sum_orders'], true, 1);
            dateData['ctr'] = getRoundValue(clicks, views, true);
            dateData['cpc'] = getRoundValue(sum / 100, clicks, true, sum / 100);
            dateData['cpm'] = getRoundValue(sum * 1000, views);
            dateData['cr'] = getRoundValue(orders, dateData['openCardCount'], true);
            dateData['cpo'] = getRoundValue(sum, orders, false, sum);
            temp.push(dateData);
        }

        return temp;
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

            // console.log(artInfo);

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

                    // console.log(
                    //     artData['nmFullDetailReport']
                    //         ? artData['nmFullDetailReport'].statistics
                    //         : undefined,
                    //     strDate,
                    //     artData['nmFullDetailReport']
                    //         ? artData['nmFullDetailReport'].statistics
                    //             ? artData['nmFullDetailReport'].statistics[strDate]
                    //             : undefined
                    //         : undefined,
                    // );

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

                artInfo.drr = getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1);
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

                summaryTemp.profitTemp += Math.round(artInfo.profit);
            }

            temp[art] = artInfo;
        }

        summaryTemp.addToCartCount = Math.round(summaryTemp.addToCartCount);
        summaryTemp.orders = Math.round(summaryTemp.orders);
        summaryTemp.sales = Math.round(summaryTemp.sales);
        summaryTemp.sum_orders = Math.round(summaryTemp.sum_orders);
        summaryTemp.sum_sales = Math.round(summaryTemp.sum_sales);
        summaryTemp.drr_orders = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
        summaryTemp.drr_sales = getRoundValue(summaryTemp.sum, summaryTemp.sum_sales, true, 1);

        summaryTemp.profit = `${new Intl.NumberFormat('ru-RU').format(summaryTemp.profitTemp)} ₽`;
        summaryTemp.rent = `${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_orders, true),
        )}% / ${new Intl.NumberFormat('ru-RU').format(
            getRoundValue(summaryTemp.profitTemp, summaryTemp.sum_sales, true),
        )}%`;

        summaryTemp.drr = `${new Intl.NumberFormat('ru-RU').format(
            summaryTemp.drr_orders,
        )}% / ${new Intl.NumberFormat('ru-RU').format(summaryTemp.drr_sales)}%`;

        setSummary({...summaryTemp});

        setTableData(temp);

        filterTableData(withfFilters, temp, undefined, daterng);
    };

    const columnData: any = [
        doc
            ? {
                  ...getArtColumn({
                      filterAutoSales: filterAutoSales,
                      setFilterAutoSales: setFilterAutoSales,
                      filters: filters,
                      data: data,
                      filteredData: filteredData,
                      doc: doc,
                      selectValue: selectValue,
                      sellerId: sellerId,
                      filterTableData: filterTableData,
                      setAutoSalesModalOpenFromParent: setAutoSalesModalOpenFromParent,
                      setChangedDoc: setChangedDoc,
                      availableAutoSalesNmIds: availableAutoSalesNmIds,
                      filterByButton: filterByButton,
                      pagesCurrent: pagesCurrent,
                      setSemanticsModalOpenFromArt: setSemanticsModalOpenFromArt,
                      allNotes: allNotes,
                      setReloadNotes: setReloadNotes,
                      permission: permission,
                      setAdvertsArtsListModalFromOpen: setAdvertsArtsListModalFromOpen,
                      setRkList: setRkList,
                      setRkListMode: setRkListMode,
                      setShowArtStatsModalOpen: setShowArtStatsModalOpen,
                      setShowDzhemModalOpen: setShowDzhemModalOpen,
                      calcByDayStats: calcByDayStats,
                      setArtsStatsByDayData: setArtsStatsByDayData,
                  }),
              }
            : null,
        Object.keys(autoSalesProfits ?? []).length == 0
            ? {
                  ...getAdvertsColumn({
                      doc: doc,
                      filterByButton: filterByButton,
                      setFiltersRK: setFiltersRK,
                      filtersRK: filtersRK,
                      selectValue: selectValue,
                      filters: filters,
                      sellerId: sellerId,
                      advertBudgetRules: advertBudgetRules,
                      setAdvertBudgetRules: setAdvertBudgetRules,
                      recalc: recalc,
                      permission: permission,
                      copiedAdvertsSettings: copiedAdvertsSettings,
                      setChangedDoc: setChangedDoc,
                      manageAdvertsActivityCallFunc: manageAdvertsActivityCallFunc,
                      filteredData: filteredData,
                      setArtsStatsByDayData: setArtsStatsByDayData,
                      updateColumnWidth: updateColumnWidth,
                      setCopiedAdvertsSettings: setCopiedAdvertsSettings,
                      setFetchedPlacements: setFetchedPlacements,
                      currentParsingProgress: currentParsingProgress,
                      setDateRange: setDateRange,
                      dateRange: dateRange,
                      getUniqueAdvertIdsFromThePage: getUniqueAdvertIdsFromThePage,
                      setCurrentParsingProgress: setCurrentParsingProgress,
                      setShowArtStatsModalOpen: setShowArtStatsModalOpen,
                  }),
              }
            : {
                  ...getAutoSalesColumn({
                      autoSalesProfits: autoSalesProfits,
                      selectValue: selectValue,
                      doc: doc,
                      filteredData: filteredData,
                      setAutoSalesProfits: setAutoSalesProfits,
                      setChangedDoc: setChangedDoc,
                      showError: showError,
                  }),
              },
        {
            ...getAnalyticsColumn({
                unvalidatedArts: unvalidatedArts,
                stocksByWarehouses: stocksByWarehouses,
                sellerId: sellerId,
            }),
        },
        doc && getUniqueAdvertIdsFromThePage
            ? {
                  ...getPlacementsColumn({
                      placementsDisplayPhrase: placementsDisplayPhrase,
                      currentParsingProgress: currentParsingProgress,
                      selectedSearchPhrase: selectedSearchPhrase,
                      getUniqueAdvertIdsFromThePage: getUniqueAdvertIdsFromThePage,
                      selectValue: selectValue,
                      setSelectedSearchPhrase: setSelectedSearchPhrase,
                      doc: doc,
                      setChangedDoc: setChangedDoc,
                      setFetchedPlacements: setFetchedPlacements,
                      setCurrentParsingProgress: setCurrentParsingProgress,
                      sellerId: sellerId,
                  }),
              }
            : null,
        {...getStocksColumn()},
        {...getDsiColumn()},
        {...getSumColumn()},
        {...getOrdersColumn()},
        {...getSumOrdersColumn()},
        {...getAvgPriceColum()},
        doc ? {...getDrrColumn(doc, selectValue)} : null,
        {...getRomiColumn()},
        doc ? {...getCpoColumn(doc, selectValue)} : null,
        {...getViewsColumn()},
        {...getClicksColumn()},
        {...getCTRColumn()},
        {...getCPCColumn()},
        {...getCPMColumn()},
        {...getOpenCardCountColumn()},
        {...getCRColumn()},
        {...getAddToCardPercentColumn()},
        {...getCardToOrderPercentColumn()},
        {...getAddToCartCountColumn()},
        {...getCPLColumn()},
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

    const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    useEffect(() => {
        if (!selectValue) return;
        if (!selectValue[0] || selectValue[0] == '') return;

        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('Operation canceled due to new request.');
        }

        cancelTokenRef.current = axios.CancelToken.source();

        if (doc) setSwitchingCampaignsFlag(true);
        const params = {
            uid: getUid(),
            dateRange: {from: '2023', to: '2024'},
            campaignName: selectValue[0],
        };
        console.log(params);

        callApi(`getMassAdvertsNew`, params, true)
            .then(async (res) => {
                console.log(res);
                if (!res) return;
                const advertsAutoBidsRules = await ApiClient.post('massAdvert/get-bidder-rules', {
                    seller_id: sellerId,
                });
                const advertsSchedules = await ApiClient.post('massAdvert/get-schedules', {
                    seller_id: sellerId,
                });
                const autoSales = await ApiClient.post('massAdvert/get-sales-rules', {
                    seller_id: sellerId,
                });
                const resData = res['data'];

                console.log('advertsAutoBidsRules', advertsAutoBidsRules);

                resData['advertsAutoBidsRules'][selectValue[0]] = advertsAutoBidsRules?.data;
                resData['advertsSchedules'][selectValue[0]] = advertsSchedules?.data;
                resData['autoSales'][selectValue[0]] = autoSales?.data;
                setChangedDoc(resData);
                setSwitchingCampaignsFlag(false);
                console.log(resData);
            })
            .catch(() => {
                setSwitchingCampaignsFlag(false);
            });

        setCopiedAdvertsSettings({advertId: 0});

        return () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Component unmounted or selectValue changed.');
            }
        };
    }, [selectValue]);

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

    const anchorRef = useRef(null);

    const getRoundValue = (a: any, b: any, isPercentage = false, def = 0) => {
        let result = b ? a / b : def;
        if (isPercentage) {
            result = Math.round(result * 100 * 100) / 100;
        } else {
            result = Math.round(result);
        }
        return result;
    };

    useEffect(() => {
        recalc(dateRange);
    }, [filtersRK]);

    const [firstRecalc, setFirstRecalc] = useState(false);

    const [changedColumns, setChangedColumns] = useState<any>(false);

    // const [auctionFilters, setAuctionFilters] = useState({undef: false});
    // const [auctionTableData, setAuctionTableData] = useState<any[]>([]);
    // const [auctionFiltratedTableData, setAuctionFiltratedTableData] = useState<any[]>([]);
    // const filterAuctionData = (withfFilters = {}, tableData = {}) => {};

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
            <MassAdvertPageSkeleton />
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
            // doc['placementsAuctions'][selectValue[0]] =
            // resData['placementsAuctions'][selectValue[0]];
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
            <StatisticsPanel />
            {!isMobile ? (
                <UpTableActions
                    doc={doc}
                    permission={permission}
                    setAutoSalesProfits={setAutoSalesProfits}
                    sellerId={sellerId}
                    setAdvertBudgetRules={setAdvertBudgetRules}
                    selectValue={selectValue}
                    dateRange={dateRange}
                    setChangedDoc={setChangedDoc}
                    setChangedDocUpdateType={setChangedDocUpdateType}
                    filteredData={filteredData}
                    getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                    advertBudgetRules={advertBudgetRules}
                    manageAdvertsActivityCallFunc={manageAdvertsActivityCallFunc}
                    recalc={recalc}
                    setDateRange={setDateRange}
                    anchorRef={anchorRef}
                    filterByButton={filterByButton}
                    setCurrentParsingProgress={setCurrentParsingProgress}
                    setArtsStatsByDayData={setArtsStatsByDayData}
                    currentParsingProgress={currentParsingProgress}
                    setFetchedPlacements={setFetchedPlacements}
                    updateColumnWidth={updateColumnWidth}
                />
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
