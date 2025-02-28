import {Button, Icon, Link, Popover, Text} from '@gravity-ui/uikit';
import {Cherry, LayoutList, Plus, TagRuble, Xmark} from '@gravity-ui/icons';
import {CopyButton} from '@/components/Buttons/CopyButton';
import {ReactNode} from 'react';
import {CanBeAddedToSales} from '@/components/Pages/MassAdvertPage/CanBeAddedToSales';
import callApi, {getUid} from '@/utilities/callApi';
import {NotesForArt} from '@/components/Pages/MassAdvertPage/NotesForArt';

interface GetArtColumnParams {
    filterAutoSales: any;
    setFilterAutoSales: any;
    filters: any;
    data: any;
    filteredData: any;
    doc: any;
    selectValue: any;
    sellerId: any;
    filterTableData: any;
    setAutoSalesModalOpenFromParent: any;
    setChangedDoc: any;
    availableAutoSalesNmIds: any;
    filterByButton: any;
    pagesCurrent: any;
    permission: any;
    setSemanticsModalOpenFromArt: any;
    allNotes: any;
    setReloadNotes: any;
    setAdvertsArtsListModalFromOpen: any;
    setRkList: any;
    setRkListMode: any;
    setShowArtStatsModalOpen: any;
    setShowDzhemModalOpen: any;
    setSelectedNmId: any;
    calcByDayStats: any;
    setArtsStatsByDayData: any;
}

export const getArtColumn = ({
    filterAutoSales,
    setFilterAutoSales,
    filters,
    data,
    filteredData,
    doc,
    selectValue,
    sellerId,
    filterTableData,
    setAutoSalesModalOpenFromParent,
    setChangedDoc,
    availableAutoSalesNmIds,
    filterByButton,
    pagesCurrent,
    setSemanticsModalOpenFromArt,
    allNotes,
    setReloadNotes,
    permission,
    setAdvertsArtsListModalFromOpen,
    setRkList,
    setRkListMode,
    setShowArtStatsModalOpen,
    setShowDzhemModalOpen,
    setSelectedNmId,
    calcByDayStats,
    setArtsStatsByDayData,
}: GetArtColumnParams) => ({
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
        const inActionNow = autoSalesInfo?.autoSaleName && autoSalesInfo?.autoSaleName !== '';
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
                    {autoSalesInfo['fixedPrices'] && autoSalesInfo['fixedPrices']['dateRange'] ? (
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
                        // open={fixedPrices?.dateRange}
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
                                        <img style={{width: '100%', height: 'auto'}} src={imgUrl} />
                                        <></>
                                    </div>
                                }
                            >
                                <div style={{width: 40}}>
                                    <img style={{width: '100%', height: 'auto'}} src={imgUrl} />
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
                                                for (const [_, data] of Object.entries(adverts)) {
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
                                                for (const [_, data] of Object.entries(adverts)) {
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
                                                        ? (doc.dzhemData[selectValue[0]][value]
                                                              .phrasesStats ?? undefined)
                                                        : undefined
                                                    : undefined
                                                : undefined;
                                            console.log(
                                                value,
                                                doc.dzhemData[selectValue[0]][value],
                                            );
                                            const temp = [] as any[];
                                            if (dzhem)
                                                for (const [phrase, stats] of Object.entries(
                                                    dzhem,
                                                )) {
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
                        <div style={{display: 'flex', flexDirection: 'column', width: '100'}}>
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
                                <Button size="xs" view="flat" onClick={() => filterByButton(brand)}>
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
                                <Button size="xs" view="flat" onClick={() => filterByButton(nmId)}>
                                    <Text variant="caption-2">{`Артикул WB: ${nmId}`}</Text>
                                </Button>
                                <Button size="xs" view="flat" onClick={() => filterByButton(imtId)}>
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
                                <Button size="xs" view="flat" onClick={() => filterByButton(value)}>
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
});
