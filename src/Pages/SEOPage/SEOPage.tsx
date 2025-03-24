'use client';

import {Button, Icon, Loader, TextInput, Text, Link, Popover} from '@gravity-ui/uikit';
import {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import TheTable, {compare} from '@/components/TheTable';
import callApi, {getUid} from '@/utilities/callApi';

import {FileArrowDown, Function, Minus, ArrowRotateLeft} from '@gravity-ui/icons';
import {defaultRender} from '@/utilities/getRoundValue';

export const SEOPage = () => {
    const [isInputDown, setIsInputDown] = useState(true);
    const mainInputRef = useRef<HTMLInputElement>(null);

    const [deletedWords, setDeletedWords] = useState([] as string[]);

    const [dataPhrasesTable, setDataPhrasesTable] = useState({});
    const [filtersPhrasesTable, setFiltersPhrasesTable] = useState({undef: false});
    const [filteredDataPhrasesTable, setFilteredDataPhrasesTable] = useState([] as any[]);
    const [filteredSummaryPhrasesTable, setFilteredSummaryPhrasesTable] = useState({});
    const columnsPhrasesTable = [
        {
            name: 'phrase',
            placeholder: 'Поисковая фраза',
            valueType: 'text',
        },
        {
            name: 'freq',
            placeholder: 'Частота',
        },
    ];

    const [dataWordsTable, setDataWordsTable] = useState({});
    const [filtersWordsTable, setFiltersWordsTable] = useState({undef: false});
    const [filteredDataWordsTable, setFilteredDataWordsTable] = useState([] as any[]);
    const [filteredSummaryWordsTable, setFilteredSummaryWordsTable] = useState({});
    const columnsWordsTable = [
        {
            name: 'word',
            placeholder: 'Слово',
            valueType: 'text',
            render: (args: any) => {
                const {footer, value} = args;
                if (footer) return defaultRender(args);
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        {defaultRender(args)}
                        <Button
                            size="xs"
                            view="outlined"
                            onClick={() => {
                                setDeletedWords((prevWords) => prevWords.concat([value]));
                            }}
                        >
                            <Icon data={Minus} />
                        </Button>
                    </div>
                );
            },
            additionalNodes: deletedWords.length
                ? [
                      <Button
                          style={{marginLeft: 5}}
                          view="outlined"
                          onClick={() => setDeletedWords([])}
                      >
                          <Icon data={ArrowRotateLeft} />
                      </Button>,
                  ]
                : [],
        },
        {
            name: 'freq',
            placeholder: 'Частота',
        },
    ];

    const [fetchingPhrases, setFetchingPhrases] = useState(true);
    const [lastFetchedPhrase, setLastFetchedPhrase] = useState('');

    const [useRegularExpressions, setUseRegularExpressions] = useState(false);

    const handleMainInputKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            if (mainInputRef.current !== null) {
                const val = mainInputRef.current.value.trim();
                const isValid = val != '';
                setIsInputDown(!isValid);

                const params = {
                    uid: getUid(),
                    filterPhrase: val,
                    escapeChars: !useRegularExpressions,
                };
                console.log(params);

                if (isValid && lastFetchedPhrase != val) {
                    setFetchingPhrases(true);
                    setLastFetchedPhrase(val);
                    callApi('getRequestsFiltered', params)
                        .then((res) => {
                            if (!res) return;
                            const data = res['data'];
                            setDataPhrasesTable(data);
                            setDeletedWords([]);
                        })
                        .catch((error) => {
                            console.log(new Date(), 'error occured:', error);
                        })
                        .finally(() => setFetchingPhrases(false));
                }
            }
        }
    };

    const downloadXlsx = () => {
        callApi('downloadSEOXslx', {
            uid: getUid(),
            data: {
                phrasesTable: filteredDataPhrasesTable,
                wordsTable: filteredDataWordsTable,
                lastFetchedPhrase,
            },
        })
            .then((res: any) => {
                return res.data;
            })
            .then((blob) => {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(blob);
                element.download = `SEO ${lastFetchedPhrase} ${new Date().toLocaleDateString(
                    'ru-RU',
                )}.xlsx`;
                // simulate link click
                document.body.appendChild(element);
                element.click();
            });
    };

    const filterDataTable = (
        withfFilters: any,
        tableData: any,
        defaultFilters: any,
        defaultTableData: any,
    ) => {
        const temp = [] as any;

        for (const [phrase, phraseInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : defaultTableData,
        )) {
            if (!phrase || !phraseInfo) continue;

            const tempTypeRow: any = phraseInfo;

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : defaultFilters;
            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
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

        temp.sort((a: any, b: any) => {
            return b.freq - a.freq;
        });

        return temp;
    };

    const filterDataWordsTable = (withfFilters = {}, tableData = {}) => {
        const temp = filterDataTable(
            withfFilters,
            tableData,
            filtersWordsTable,
            dataWordsTable,
        ).filter(({word}: any) => !deletedWords.includes(word));

        setFilteredDataWordsTable(temp);

        const filteredSummaryTemp = {
            freq: 0,
        };

        for (const row of temp) {
            const {freq} = row;
            filteredSummaryTemp.freq += freq;
        }
        setFilteredSummaryWordsTable(filteredSummaryTemp);
    };
    useEffect(() => {
        filterDataWordsTable(filtersWordsTable, dataWordsTable);
    }, [filtersWordsTable, dataWordsTable, deletedWords]);

    const filterDataPhrasesTable = (withfFilters = {}, tableData = {}) => {
        const temp = filterDataTable(
            withfFilters,
            tableData,
            filtersPhrasesTable,
            dataPhrasesTable,
        );

        setFilteredDataPhrasesTable(temp);

        const filteredSummaryTemp = {
            freq: 0,
        };

        const tempDataWordsTable: any = {};
        for (const row of temp) {
            const {phrase, freq} = row;
            filteredSummaryTemp.freq += freq;
            for (const word of phrase.split(' ')) {
                if (!tempDataWordsTable[word]) tempDataWordsTable[word] = {word, freq: 0};
                tempDataWordsTable[word].freq += freq;
            }
        }
        setFilteredSummaryPhrasesTable(filteredSummaryTemp);

        setDataWordsTable(tempDataWordsTable);
    };
    useEffect(() => {
        filterDataPhrasesTable(filtersPhrasesTable, dataPhrasesTable);
    }, [filtersPhrasesTable, dataPhrasesTable]);

    const tableCardStyle = {
        width: '100%',
        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
        overflow: 'auto',
        borderRadius: 9,
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
                animate={{marginTop: isInputDown ? 300 : 0, width: isInputDown ? '50vw' : '45vw'}}
                transition={{
                    type: 'spring',
                    damping: 100,
                    stiffness: 1000,
                }}
                style={{display: 'flex', flexDirection: 'row', width: '60vw', alignItems: 'center'}}
            >
                <TextInput
                    endContent={
                        <Popover
                            openDelay={1000}
                            hasArrow={false}
                            placement={'bottom'}
                            content={
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text>Поиск с использованием регулярных выражений.</Text>
                                    <div style={{minWidth: 4}} />
                                    <Link
                                        href="https://support.google.com/a/answer/1371415?hl=ru"
                                        target="_blank"
                                    >
                                        Справка
                                    </Link>
                                </div>
                            }
                        >
                            <Button
                                style={{marginRight: 8}}
                                size="l"
                                selected={useRegularExpressions}
                                onClick={() => setUseRegularExpressions(!useRegularExpressions)}
                            >
                                <Icon data={Function} size={20} />
                            </Button>
                        </Popover>
                    }
                    autoFocus
                    controlRef={mainInputRef}
                    style={{
                        borderRadius: 9,
                        margin: '8px 0',
                        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                    }}
                    size="xl"
                    placeholder={
                        useRegularExpressions
                            ? 'Введите регулярное выражение'
                            : 'Введите поисковый запрос'
                    }
                    onKeyDown={handleMainInputKeyDown}
                />
                <motion.div
                    animate={{
                        width: isInputDown || fetchingPhrases ? 0 : 138,
                        marginLeft: isInputDown || fetchingPhrases ? 0 : 16,
                        opacity: isInputDown || fetchingPhrases ? 0 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 100,
                        stiffness: 1000,
                    }}
                    style={{display: 'flex', flexDirection: 'row', width: 0, opacity: 0}}
                >
                    <Button
                        size="xl"
                        style={{
                            boxShadow: tableCardStyle.boxShadow,
                            borderRadius: tableCardStyle.borderRadius,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        view="outlined"
                        onClick={downloadXlsx}
                    >
                        <Icon data={FileArrowDown} size={20} />
                        Скачать
                    </Button>
                </motion.div>
            </motion.div>
            <motion.div
                animate={{opacity: fetchingPhrases && !isInputDown ? 1 : 0}}
                transition={{duration: 0.1}}
                style={{
                    opacity: 0,
                    pointerEvents: 'none',
                    top: 60,
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100vw',
                    height: 224,
                }}
            >
                <Loader size="l" />
            </motion.div>
            <motion.div
                animate={{opacity: isInputDown ? 0 : 1, top: fetchingPhrases ? 300 : 74}}
                transition={{
                    type: 'spring',
                    damping: 100,
                    stiffness: 1000,
                }}
                style={{
                    pointerEvents: isInputDown ? 'none' : 'all',
                    top: 300,
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100vw',
                    // padding: '0 40px',
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
                        x: isInputDown ? -1000 : 0,
                        opacity: !isInputDown ? 1 : 0,
                        maxHeight: fetchingPhrases
                            ? 'calc(100vh - 60px - 76px - 300px)'
                            : 'calc(100vh - 60px - 76px - 40px)',
                    }}
                    transition={{
                        type: 'spring',
                        damping: 100,
                        stiffness: 1000,
                    }}
                    style={{
                        x: -1000,
                        maxWidth: '50vw',
                        maxHeight: 'calc(100vh - 60px - 76px - 40px)',
                        opacity: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <TheTable
                        columnData={columnsPhrasesTable}
                        data={filteredDataPhrasesTable}
                        filters={filtersPhrasesTable}
                        setFilters={setFiltersPhrasesTable}
                        filterData={filterDataPhrasesTable}
                        footerData={[filteredSummaryPhrasesTable]}
                        tableId={'seoPhrases'}
                        usePagination={true}
                        defaultPaginationSize={300}
                        onPaginationUpdate={({paginatedData}: any) => {
                            setFilteredSummaryPhrasesTable((row) => {
                                const temp: any = row;
                                temp['phrase'] =
                                    `На странице фраз: ${paginatedData.length} Всего фраз: ${filteredDataPhrasesTable.length}`;

                                return temp;
                            });
                        }}
                    />
                </motion.div>
                <div style={{minWidth: 32}} />
                <motion.div
                    onAnimationStart={async () => {
                        await new Promise((resolve) => setTimeout(resolve, 300));
                        filterDataWordsTable({freq: {val: '', mode: 'include'}}, dataWordsTable);
                    }}
                    animate={{
                        x: isInputDown ? 1000 : 0,
                        opacity: !isInputDown ? 1 : 0,
                        maxHeight: fetchingPhrases
                            ? 'calc(100vh - 60px - 76px - 300px)'
                            : 'calc(100vh - 60px - 76px - 40px)',
                    }}
                    transition={{
                        type: 'spring',
                        damping: 100,
                        stiffness: 1000,
                    }}
                    style={{
                        x: 1000,
                        maxWidth: '30vw',
                        maxHeight: 'calc(100vh - 60px - 76px - 40px)',
                        opacity: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <TheTable
                        columnData={columnsWordsTable}
                        data={filteredDataWordsTable}
                        filters={filtersWordsTable}
                        setFilters={setFiltersWordsTable}
                        filterData={filterDataWordsTable}
                        footerData={[filteredSummaryWordsTable]}
                        tableId={'seoWords'}
                        usePagination={true}
                        defaultPaginationSize={300}
                        onPaginationUpdate={({paginatedData}: any) => {
                            setFilteredSummaryWordsTable((row) => {
                                const temp: any = row;
                                temp['word'] =
                                    `На странице слов: ${paginatedData.length} Всего слов: ${filteredDataWordsTable.length}`;

                                return temp;
                            });
                        }}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};
