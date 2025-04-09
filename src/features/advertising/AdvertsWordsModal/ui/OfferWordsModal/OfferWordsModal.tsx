import {CSSProperties, useEffect, useState} from 'react';
import {PhrasesStats} from '../../api/PhraseStats';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ActionTooltip, Button, Card, Icon, List, Popover, Text} from '@gravity-ui/uikit';
import {ListItem} from '../RequestPhrasesModal/ListItem';
import {
    BarsAscendingAlignLeftArrowUp,
    BarsDescendingAlignLeftArrowDown,
    Eye,
    Magnifier,
} from '@gravity-ui/icons';

interface OffersWordsModalProps {
    isActive: boolean;
}

export const OffersWordsModal = ({isActive}: OffersWordsModalProps) => {
    const {wordsStats, advertWordsTemplateHandler, template} = useAdvertsWordsModal();

    const [currentWordsStats, setWordsStats] = useState<PhrasesStats[]>(wordsStats);

    const [sortButtonStates, setSortButtonStates] = useState<{
        alphabet: 'desc' | 'asc' | undefined;
        frequency: 'desc' | 'asc' | undefined;
        views: 'desc' | 'asc' | undefined;
    }>({alphabet: 'asc', frequency: undefined, views: undefined});

    useEffect(() => {
        const newArray = wordsStats.filter(
            (stat) =>
                !template.includes.includes(stat.keyword) &&
                stat.keyword &&
                !template.notIncludes.includes(stat.keyword),
        );
        console.log('newArray', newArray);
        setWordsStats(newArray);
    }, [wordsStats, template]);

    const [filteredWordsStats, setFilteredWordsStats] = useState<PhrasesStats[]>(currentWordsStats);

    useEffect(() => {
        setFilteredWordsStats(currentWordsStats);
        if (sortButtonStates.views !== undefined) {
            filterByViews(sortButtonStates.views);
        }
        if (sortButtonStates.alphabet !== undefined) {
            filterByAlphabet(sortButtonStates.alphabet);
        }
        if (sortButtonStates.frequency !== undefined) {
            filterByAlphabet(sortButtonStates.frequency);
        }
    }, [currentWordsStats]);

    const filterByAlphabet = (order: 'desc' | 'asc') => {
        if (order === 'desc') {
            setFilteredWordsStats(
                currentWordsStats.sort((a, b) => b.keyword.localeCompare(a.keyword)),
            );
        } else {
            setFilteredWordsStats(
                currentWordsStats.sort((a, b) => a.keyword.localeCompare(b.keyword)),
            );
        }
    };

    const filterByFrequency = (order: 'desc' | 'asc') => {
        if (order === 'desc') {
            setFilteredWordsStats(currentWordsStats.sort((a, b) => b.frequency - a.frequency));
        } else {
            setFilteredWordsStats(currentWordsStats.sort((a, b) => a.frequency - b.frequency));
        }
    };

    const filterByViews = (order: 'desc' | 'asc') => {
        if (order === 'desc') {
            setFilteredWordsStats(currentWordsStats.sort((a, b) => b.views - a.views));
        } else {
            setFilteredWordsStats(currentWordsStats.sort((a, b) => a.views - b.views));
        }
    };

    const handleSortButtonStates = (
        buttonName: 'alphabet' | 'frequency' | 'views',
        buttonState: 'desc' | 'asc' | undefined,
    ) => {
        const states: {
            alphabet: 'desc' | 'asc' | undefined;
            frequency: 'desc' | 'asc' | undefined;
            views: 'desc' | 'asc' | undefined;
        } = {alphabet: undefined, frequency: undefined, views: undefined};
        states[buttonName] = buttonState;

        setSortButtonStates({...states});
    };

    const handleSortButton = (buttonName: 'alphabet' | 'frequency' | 'views') => {
        console.log(currentWordsStats, filteredWordsStats, template, wordsStats);
        const newState =
            sortButtonStates[buttonName] === 'desc' || sortButtonStates[buttonName] === undefined
                ? 'asc'
                : 'desc';

        handleSortButtonStates(buttonName, newState);
        if (buttonName === 'alphabet') {
            filterByAlphabet(newState);
        }
        if (buttonName === 'frequency') {
            filterByFrequency(newState);
        }
        if (buttonName === 'views') {
            filterByViews(newState);
        }
    };

    return (
        <div>
            <Popover
                content={
                    <Card
                        view="clear"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#221d220f',
                            backdropFilter: 'blur(48px)',
                            transform: `translate(-50%, 0%)`,
                            border: '1px solid #eee2',
                            position: 'absolute',
                            // left : ''
                            gap: 4,
                            width: 400,
                            padding: 8,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 4,
                            }}
                        >
                            <ActionTooltip title="Сортировка по алфавиту">
                                <Button
                                    view={
                                        sortButtonStates.alphabet === 'desc'
                                            ? 'flat-danger'
                                            : sortButtonStates.alphabet === 'asc'
                                              ? 'flat-warning'
                                              : 'flat'
                                    }
                                    onClick={() => {
                                        handleSortButton('alphabet');
                                    }}
                                >
                                    Aa
                                    <Icon
                                        data={
                                            sortButtonStates.alphabet !== 'desc'
                                                ? BarsAscendingAlignLeftArrowUp
                                                : BarsDescendingAlignLeftArrowDown
                                        }
                                    />
                                </Button>
                            </ActionTooltip>
                            <ActionTooltip title="Сортировать по показам">
                                <Button
                                    style={
                                        {
                                            '--g-button__text-align-content': 'center',
                                        } as CSSProperties
                                    }
                                    view={
                                        sortButtonStates.views === 'desc'
                                            ? 'flat-danger'
                                            : sortButtonStates.views === 'asc'
                                              ? 'flat-warning'
                                              : 'flat'
                                    }
                                    onClick={() => {
                                        handleSortButton('views');
                                    }}
                                >
                                    <div
                                        style={{
                                            gap: 4,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            height: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Icon data={Eye}></Icon>
                                        <Icon
                                            data={
                                                sortButtonStates.views !== 'desc'
                                                    ? BarsAscendingAlignLeftArrowUp
                                                    : BarsDescendingAlignLeftArrowDown
                                            }
                                        />
                                    </div>
                                </Button>
                            </ActionTooltip>
                            <ActionTooltip title="Сортировать по частоте">
                                <Button
                                    view={
                                        sortButtonStates.frequency === 'desc'
                                            ? 'flat-danger'
                                            : sortButtonStates.frequency === 'asc'
                                              ? 'flat-warning'
                                              : 'flat'
                                    }
                                    onClick={() => {
                                        handleSortButton('frequency');
                                    }}
                                >
                                    <div
                                        style={{
                                            gap: 4,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            height: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Icon data={Magnifier} />
                                        <Icon
                                            data={
                                                sortButtonStates.frequency !== 'desc'
                                                    ? BarsAscendingAlignLeftArrowUp
                                                    : BarsDescendingAlignLeftArrowDown
                                            }
                                        />
                                    </div>
                                </Button>
                            </ActionTooltip>
                        </div>

                        <List
                            items={filteredWordsStats}
                            renderItem={(item) => <ListItem item={item} />}
                            filterable={false}
                            itemHeight={36}
                            itemsHeight={420}
                            onItemClick={(item) => {
                                isActive
                                    ? advertWordsTemplateHandler.addIncludes(item.keyword)
                                    : advertWordsTemplateHandler.addNotIncludes(item.keyword);
                            }}
                        />
                    </Card>
                }
            >
                <Button>
                    <Text>Показать слова</Text>
                </Button>
            </Popover>
        </div>
    );
};
