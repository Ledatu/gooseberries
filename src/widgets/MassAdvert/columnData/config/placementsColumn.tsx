import {Button, Card, Icon, Spin, Text} from '@gravity-ui/uikit';
import callApi, {getUid} from '@/utilities/callApi';
import {
    ArrowRight,
    ArrowRotateLeft,
    ArrowShapeUp,
    LayoutHeader,
    Magnifier,
    Rocket,
} from '@gravity-ui/icons';
import {parseFirst10Pages} from '@/components/Pages/MassAdvertPage/ParseFirst10Pages';
import {Auction} from '@/components/Pages/MassAdvertPage/Auction';

interface GetPlacementsColumnParams {
    placementsDisplayPhrase: any;
    currentParsingProgress: any;
    selectedSearchPhrase: any;
    getUniqueAdvertIdsFromThePage: any;
    selectValue: any;
    setSelectedSearchPhrase: any;
    doc: any;
    setChangedDoc: any;
    setFetchedPlacements: any;
    setCurrentParsingProgress: any;
    sellerId: any;
}

export const getPlacementsColumn = ({
    placementsDisplayPhrase,
    currentParsingProgress,
    selectedSearchPhrase,
    getUniqueAdvertIdsFromThePage,
    selectValue,
    setSelectedSearchPhrase,
    doc,
    setChangedDoc,
    setFetchedPlacements,
    setCurrentParsingProgress,
    sellerId,
}: GetPlacementsColumnParams) => ({
    name: 'placements',
    placeholder:
        'Позиция' +
        (placementsDisplayPhrase != '' && currentParsingProgress[placementsDisplayPhrase]
            ? ` / Проверка: ${currentParsingProgress[placementsDisplayPhrase].progress / 100} стр.`
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
                    placementsDisplayPhrase != '' && selectedSearchPhrase == placementsDisplayPhrase
                        ? 'outlined-success'
                        : 'outlined'
                }
                onClick={(event) => {
                    event.stopPropagation();
                    const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                    const params: any = {
                        uid: getUid(),
                        campaignName: selectValue[0],
                        data: {
                            mode:
                                selectedSearchPhrase == placementsDisplayPhrase
                                    ? 'Удалить'
                                    : 'Установить',
                            advertsIds: {},
                        },
                    };
                    for (const [id, advertData] of Object.entries(uniqueAdverts)) {
                        if (!id || !advertData) continue;
                        const {advertId} = advertData as any;
                        params.data.advertsIds[advertId] = {};
                        params.data.advertsIds[advertId].phrase = placementsDisplayPhrase;
                        setSelectedSearchPhrase(
                            selectedSearchPhrase == placementsDisplayPhrase
                                ? ''
                                : placementsDisplayPhrase,
                        );
                        if (selectedSearchPhrase == placementsDisplayPhrase) {
                            delete doc.advertsSelectedPhrases[selectValue[0]][advertId];
                        } else {
                            doc.advertsSelectedPhrases[selectValue[0]][advertId] = {
                                phrase: placementsDisplayPhrase,
                            };
                        }
                    }
                    console.log(params);
                    setChangedDoc({...doc});
                    callApi('updateAdvertsSelectedPhrases', params);
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
            // console.log(phrase, doc.fetchedPlacements[phrase], doc.fetchedPlacements, doc);
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
                                if (!doc['advertsSelectedPhrases'][selectValue[0]][advertId])
                                    doc['advertsSelectedPhrases'][selectValue[0]][advertId] = {
                                        phrase: '',
                                    };
                                if (isSelectedPhrase) {
                                    doc['advertsSelectedPhrases'][selectValue[0]][advertId] =
                                        undefined;
                                } else {
                                    doc['advertsSelectedPhrases'][selectValue[0]][advertId].phrase =
                                        phrase;
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
});
