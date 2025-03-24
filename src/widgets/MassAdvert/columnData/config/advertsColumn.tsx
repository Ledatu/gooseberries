import {Button, Icon, Text} from '@gravity-ui/uikit';
import {Magnifier, Minus, Plus, Rocket} from '@gravity-ui/icons';
import {PopupFilterArts} from '@/components/Pages/MassAdvertPage/PopupFilterArts';
import {HelpMark} from '@/components/Popups/HelpMark';
import {AdvertCard} from '@/components/Pages/MassAdvertPage/AdvertCard';

interface GetAdvertsColumnParams {
    doc: any;
    filterByButton: any;
    setFiltersRK: any;
    filtersRK: any;
    selectValue: any;
    filters: any;
    sellerId: any;
    advertBudgetRules: any;
    setAdvertBudgetRules: any;
    recalc: any;
    permission: any;
    copiedAdvertsSettings: any;
    setChangedDoc: any;
    manageAdvertsActivityCallFunc: any;
    filteredData: any;
    setArtsStatsByDayData: any;
    updateColumnWidth: any;
    setCopiedAdvertsSettings: any;
    setFetchedPlacements: any;
    currentParsingProgress: any;
    setDateRange: any;
    dateRange: any;
    getUniqueAdvertIdsFromThePage: any;
    setCurrentParsingProgress: any;
    setShowArtStatsModalOpen: any;
    pausedAdverts: any;
    setUpdatePaused: any;
}

export const getAdvertsColumn = ({
    doc,
    filtersRK,
    setFiltersRK,
    filterByButton,
    selectValue,
    filters,
    sellerId,
    advertBudgetRules,
    setAdvertBudgetRules,
    recalc,
    permission,
    copiedAdvertsSettings,
    setChangedDoc,
    manageAdvertsActivityCallFunc,
    filteredData,
    setArtsStatsByDayData,
    updateColumnWidth,
    setCopiedAdvertsSettings,
    setFetchedPlacements,
    currentParsingProgress,
    setDateRange,
    dateRange,
    getUniqueAdvertIdsFromThePage,
    setCurrentParsingProgress,
    setShowArtStatsModalOpen,
    pausedAdverts,
    setUpdatePaused,
}: GetAdvertsColumnParams) => ({
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
                            <Text style={{margin: '0 3px'}} color="brand" variant="subheader-1">
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
                    ['авто', 'поиск'].includes(String(filters['adverts'].val).toLowerCase().trim())
                ) {
                    // console.log('popa2', advertData, filters['adverts'].val);
                    if (
                        String(filters['adverts'].val).toLowerCase().includes('поиск') &&
                        (advertData.type == 9 || advertData.type == 6)
                    ) {
                        switches.push(
                            <AdvertCard
                                pausedAdverts={pausedAdverts}
                                setUpdatePaused={setUpdatePaused}
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
                                manageAdvertsActivityCallFunc={manageAdvertsActivityCallFunc}
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
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                            />,
                        );
                    } else if (
                        filters['adverts'] &&
                        String(filters['adverts'].val).toLowerCase().includes('авто') &&
                        advertData.type == 8
                    ) {
                        switches.push(
                            <AdvertCard
                                pausedAdverts={pausedAdverts}
                                setUpdatePaused={setUpdatePaused}
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
                                manageAdvertsActivityCallFunc={manageAdvertsActivityCallFunc}
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
                                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                            />,
                        );
                    } else {
                        continue;
                    }
                } else {
                    switches.push(
                        <AdvertCard
                            pausedAdverts={pausedAdverts}
                            setUpdatePaused={setUpdatePaused}
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
                            manageAdvertsActivityCallFunc={manageAdvertsActivityCallFunc}
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
                            getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                        />,
                    );
                }
            }
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                    gap: 8,
                }}
            >
                {switches}
            </div>
        );
    },
});
