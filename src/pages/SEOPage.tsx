import {Card, TextInput} from '@gravity-ui/uikit';
import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import TheTable, {compare} from 'src/components/TheTable';

export const SEOPage = () => {
    const [isInputDown, setIsInputDown] = useState(true);
    const mainInputRef = useRef<HTMLInputElement>(null);

    const [dataPhrasesTable, setDataPhrasesTable] = useState({});
    const [filtersPhrasesTable, setFiltersPhrasesTable] = useState({undef: false});
    const [filteredDataPhrasesTable, setFilteredDataPhrasesTable] = useState([] as any[]);
    const columnsPhrasesTable = [
        {name: 'phrase', placeholder: 'Поисковая фраза', valueType: 'text'},
        {name: 'freq', placeholder: 'Частота'},
    ];

    const [dataWordsTable, setDataWordsTable] = useState({});
    const [filtersWordsTable, setFiltersWordsTable] = useState({undef: false});
    const [filteredDataWordsTable, setFilteredDataWordsTable] = useState([] as any[]);
    const columnsWordsTable = [
        {name: 'word', placeholder: 'Слово', valueType: 'text'},
        {name: 'freq', placeholder: 'Частота'},
    ];

    const handleMainInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (mainInputRef.current !== null) {
                const val = mainInputRef.current.value.trim();
                const isValid = val != '';
                setIsInputDown(!isValid);

                setDataPhrasesTable({
                    какашки: {phrase: 'какашки', freq: 4000},
                    'какашки собаки': {phrase: 'какашки собаки', freq: 400},
                    'какашки кошки': {phrase: 'какашки кошки', freq: 40},
                    кошки: {phrase: 'кошки', freq: 40333333},
                });
            }
        }
    };

    const filterDataTable = (
        withfFilters,
        tableData,
        defaultFilters,
        defaultTableData,
        defaultSetFilteredTableData,
    ) => {
        const temp = [] as any;

        for (const [phrase, phraseInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : defaultTableData,
        )) {
            if (!phrase || !phraseInfo) continue;

            const tempTypeRow = phraseInfo;

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : defaultFilters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '' && filterArg != 'placements') continue;

                const fldata = filterData['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) {
                temp.push(tempTypeRow);
            }
        }

        temp.sort((a, b) => {
            return b.freq - a.freq;
        });

        defaultSetFilteredTableData(temp);

        return temp;
    };

    const filterDataWordsTable = (withfFilters = {}, tableData = {}) => {
        filterDataTable(
            withfFilters,
            tableData,
            filtersWordsTable,
            dataWordsTable,
            setFilteredDataWordsTable,
        );
    };
    useEffect(() => {
        filterDataWordsTable(filtersWordsTable, dataWordsTable);
    }, [filtersWordsTable, dataWordsTable]);

    const filterDataPhrasesTable = (withfFilters = {}, tableData = {}) => {
        const temp = filterDataTable(
            withfFilters,
            tableData,
            filtersPhrasesTable,
            dataPhrasesTable,
            setFilteredDataPhrasesTable,
        );

        const tempDataWordsTable = {};
        for (const row of temp) {
            const {phrase, freq} = row;

            for (const word of phrase.split(' ')) {
                if (!tempDataWordsTable[word]) tempDataWordsTable[word] = {word, freq: 0};
                tempDataWordsTable[word].freq += freq;
            }
        }

        setDataWordsTable(tempDataWordsTable);
    };
    useEffect(() => {
        filterDataPhrasesTable(filtersPhrasesTable, dataPhrasesTable);
    }, [filtersPhrasesTable, dataPhrasesTable]);

    const tableCardStyle = {
        width: '100%',
        // maxHeight: 'calc(100vh - 10em - 68px - 32px - 36px - 48px - 30px)',
        boxShadow: 'inset 0px 0px 10px var(--g-color-base-background)',
        overflow: 'auto',
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div
                animate={{marginTop: isInputDown ? 300 : 0}}
                transition={{
                    type: 'spring',
                    damping: 100,
                    stiffness: 1000,
                }}
                style={{display: 'flex', flexDirection: 'row', width: '60vw'}}
            >
                <TextInput
                    controlRef={mainInputRef}
                    style={{
                        margin: '8px 0',
                        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                    }}
                    size="xl"
                    placeholder="Введите слово для поиска"
                    onKeyDown={handleMainInputKeyDown}
                />
            </motion.div>
            <motion.div
                animate={{opacity: isInputDown ? 0 : 1}}
                transition={{
                    type: 'spring',
                    damping: 100,
                    stiffness: 1000,
                }}
                style={{
                    top: 300,
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100vw',
                    padding: '0 40px',
                    opacity: 0,
                }}
            >
                <motion.div
                    onAnimationStart={async () => {
                        await new Promise((resolve) => setTimeout(resolve, 300));
                        filterDataPhrasesTable(
                            {freq: {val: '', mode: 'include'}},
                            dataPhrasesTable,
                        );
                    }}
                    animate={{
                        opacity: !isInputDown ? 1 : 0,
                        maxWidth: !isInputDown ? '40vw' : 0,
                    }}
                    style={{
                        maxWidth: 0,
                        opacity: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Card style={tableCardStyle}>
                        <TheTable
                            columnData={columnsPhrasesTable}
                            data={filteredDataPhrasesTable}
                            filters={filtersPhrasesTable}
                            setFilters={setFiltersPhrasesTable}
                            filterData={filterDataPhrasesTable}
                        />
                    </Card>
                </motion.div>
                <div style={{minWidth: 32}} />
                <motion.div
                    onAnimationStart={async () => {
                        await new Promise((resolve) => setTimeout(resolve, 300));
                        filterDataWordsTable({freq: {val: '', mode: 'include'}}, dataWordsTable);
                    }}
                    animate={{
                        opacity: !isInputDown ? 1 : 0,
                        maxWidth: !isInputDown ? '40vw' : 0,
                    }}
                    style={{
                        maxWidth: 0,
                        opacity: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Card style={tableCardStyle}>
                        <TheTable
                            columnData={columnsWordsTable}
                            data={filteredDataWordsTable}
                            filters={filtersWordsTable}
                            setFilters={setFiltersWordsTable}
                            filterData={filterDataWordsTable}
                        />
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};
