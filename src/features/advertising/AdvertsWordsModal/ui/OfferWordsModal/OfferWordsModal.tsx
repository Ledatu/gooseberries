import {CSSProperties, useEffect, useState} from 'react';
import {PhrasesStats} from '../../types/PhraseStats';
// import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ActionTooltip, Button, Card, Icon, List, Popover, Text, TextInput} from '@gravity-ui/uikit';
import {ListItem} from '../RequestPhrasesModal/ListItem';
import {
    BarsAscendingAlignLeftArrowUp,
    BarsDescendingAlignLeftArrowDown,
    Eye,
    Magnifier,
} from '@gravity-ui/icons';

interface OffersWordsModalProps {
    // isActive: boolean;
    items: PhrasesStats[];
    onClick: (arg: PhrasesStats) => void;
    arrayToAdd: string[];
    title: string;
}

export const OffersWordsModal = ({items, onClick, arrayToAdd, title}: OffersWordsModalProps) => {
    const [textInputValue, setTextInputValue] = useState<string>('');
    useEffect(() => {
        const newArray = sortedWordsStats.filter((a) =>
            a.keyword.toLocaleLowerCase().includes(textInputValue.toLocaleLowerCase()),
        );
        setFilteredWordsStats(newArray);
    });
    const [currentWordsStats, setWordsStats] = useState<PhrasesStats[]>(items);

    const [sortButtonStates, setSortButtonStates] = useState<{
        alphabet: 'desc' | 'asc' | undefined;
        frequency: 'desc' | 'asc' | undefined;
        views: 'desc' | 'asc' | undefined;
    }>({alphabet: 'asc', frequency: undefined, views: undefined});

    useEffect(() => {
        const newArray = items.filter((stat) => !arrayToAdd.includes(stat.keyword) && stat.keyword);
        setWordsStats(newArray);
    }, [arrayToAdd]);

    const [sortedWordsStats, setSortedWordsStats] = useState<PhrasesStats[]>(currentWordsStats);
    const [filteredWordsStats, setFilteredWordsStats] = useState<PhrasesStats[]>(sortedWordsStats);

    useEffect(() => {
        if (sortButtonStates.views != undefined) {
            filterByViews(sortButtonStates.views);
        } else if (sortButtonStates.alphabet != undefined) {
            filterByAlphabet(sortButtonStates.alphabet);
        } else if (sortButtonStates.frequency != undefined) {
            filterByFrequency(sortButtonStates.frequency);
        } else {
            setSortedWordsStats(currentWordsStats);
        }
    }, [currentWordsStats]);

    const filterByAlphabet = (order: 'desc' | 'asc') => {
        if (order === 'desc') {
            setSortedWordsStats(
                currentWordsStats.sort((a, b) => b.keyword.localeCompare(a.keyword)),
            );
        } else {
            setSortedWordsStats(
                currentWordsStats.sort((a, b) => a.keyword.localeCompare(b.keyword)),
            );
        }
    };

    const filterByFrequency = (order: 'desc' | 'asc') => {
        if (order === 'desc') {
            setSortedWordsStats(currentWordsStats.sort((a, b) => b.frequency - a.frequency));
        } else {
            setSortedWordsStats(currentWordsStats.sort((a, b) => a.frequency - b.frequency));
        }
    };

    const filterByViews = (order: 'desc' | 'asc') => {
        if (order === 'desc') {
            setSortedWordsStats(currentWordsStats.sort((a, b) => b.views - a.views));
        } else {
            setSortedWordsStats(currentWordsStats.sort((a, b) => a.views - b.views));
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
        const newState =
            sortButtonStates[buttonName] === 'desc' || sortButtonStates[buttonName] === undefined
                ? 'asc'
                : 'desc';
        handleSortButtonStates(buttonName, newState);
        if (buttonName === 'alphabet') {
            filterByAlphabet(newState);
        } else if (buttonName === 'frequency') {
            filterByFrequency(newState);
        } else {
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
                            borderRadius: 16,
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
                                        console.log('alpha');
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
                                        console.log('views');
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
                                        console.log('freq');
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
                        <TextInput
                            value={textInputValue}
                            onUpdate={(value) => setTextInputValue(value)}
                        />
                        <List
                            items={filteredWordsStats}
                            renderItem={(item) => <ListItem item={item} />}
                            filterable={false}
                            itemHeight={36}
                            itemsHeight={420}
                            onItemClick={(item) => {
                                onClick(item);
                            }}
                        />
                    </Card>
                }
            >
                <Button>
                    <Text>{title}</Text>
                </Button>
            </Popover>
        </div>
    );
};
