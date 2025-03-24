'use client';

import {Button, Card, Icon, List, Popover, Text} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import {BarsAscendingAlignLeftArrowUp, BarsAscendingAlignLeftArrowDown} from '@gravity-ui/icons';

interface AutoPhrasesWordsSelectionProps {
    disabled: boolean;
    itemsTemp: any;
    itemsObj: any;
    setAutoPhrasesArray: (arg?: any) => any;
    autoPhrasesMinusList: any[];
    autoPhrasesPlusList: any[];
}

export const AutoPhrasesWordsSelection = ({
    disabled,
    itemsTemp,
    itemsObj,
    setAutoPhrasesArray,
    autoPhrasesMinusList,
    autoPhrasesPlusList,
}: AutoPhrasesWordsSelectionProps) => {
    const [items, setItems] = useState(itemsTemp);
    const [frequencySortbutton, setfrequencySortbutton] = useState(1);
    const [lexicalGraphicSortButton, setlexicalGraphicSortButton] = useState(0);

    const sort = (itemsToSort: any) => {
        if (frequencySortbutton) {
            frequencySort(frequencySortbutton == 1, itemsToSort);
        } else if (lexicalGraphicSortButton) {
            lexicalGraphicSort(lexicalGraphicSortButton == 1, itemsToSort);
        }
    };

    useEffect(() => {
        sort(items);
    }, [frequencySortbutton, lexicalGraphicSortButton]);

    useEffect(() => {
        const filtered = itemsTemp.filter(
            (item: any) =>
                !autoPhrasesPlusList.includes(item) && !autoPhrasesMinusList.includes(item),
        );
        // console.log(autoPhrasesPlusList.length, autoPhrasesMinusList.length, filtered.length);
        sort(filtered);
    }, [autoPhrasesPlusList, autoPhrasesMinusList]);

    const frequencySort = (reverse = false, itemsToSort: any) => {
        const temp = Array.from(itemsToSort as string[]);
        temp.sort((a, b) => {
            return reverse ? itemsObj[b] - itemsObj[a] : itemsObj[a] - itemsObj[b];
        });
        setItems(temp);
    };

    const lexicalGraphicSort = (reverse = false, itemsToSort: any) => {
        const temp: String[] = Array.from(itemsToSort as string[]);
        temp.sort();
        if (reverse) {
            temp.reverse();
        }
        setItems(temp);
    };
    const sortButton = (
        buttonState: any,
        setButtonState: (arg?: any) => any,
        text: string,
        setOtherButtonState: (arg?: any) => any,
    ) => {
        const icon =
            buttonState != 1 ? BarsAscendingAlignLeftArrowUp : BarsAscendingAlignLeftArrowDown;
        return (
            <Button
                selected={buttonState !== 0}
                onClick={() => {
                    setButtonState(1 + (buttonState % 2));
                    setOtherButtonState(0);
                }}
            >
                <Text>{text}</Text>
                <Icon data={icon}></Icon>
            </Button>
        );
    };
    return (
        <Popover
        enableSafePolygon={true}

            placement={'bottom'}
            content={
                <div
                    style={{
                        height: 'calc(300px - 60px)',
                        width: 150,
                        overflow: 'auto',
                        display: 'flex',
                    }}
                >
                    <Card
                        view="outlined"
                        style={{
                            position: 'absolute',
                            background: 'var(--g-color-base-background)',
                            height: 450,
                            width: 350,
                            padding: 8,
                            top: -10,
                            left: -87.5,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', rowGap: '8px'}}>
                            {sortButton(
                                frequencySortbutton,
                                setfrequencySortbutton,
                                'Сортировать по частотности',
                                setlexicalGraphicSortButton,
                            )}
                            {sortButton(
                                lexicalGraphicSortButton,
                                setlexicalGraphicSortButton,
                                'Сортировать в алфавитном порядке',
                                setfrequencySortbutton,
                            )}
                        </div>
                        <List
                            filterable={false}
                            itemHeight={28}
                            items={items}
                            onItemClick={(item) => {
                                if (disabled) return;
                                setAutoPhrasesArray((oldArr: any[]) => oldArr.concat([item]));
                                setItems(items.filter((it: any) => it != item));
                            }}
                        />
                    </Card>
                </div>
            }
        >
            <Button style={{width: '100%'}} view="outlined" width="max">
                <Text variant="subheader-1">Показать слова</Text>
            </Button>
        </Popover>
    );
};
