import {Button, Card, Icon, List, Popover, Text} from '@gravity-ui/uikit';
import React, {useEffect, useState} from 'react';
import {BarsAscendingAlignLeftArrowUp, BarsAscendingAlignLeftArrowDown} from '@gravity-ui/icons';

export const AutoPhrasesWordsSelection = ({disabled, itemsTemp, itemsObj, setAutoPhrasesArray}) => {
    const [items, setItems] = useState(itemsTemp);
    useEffect(() => {
        setItems(itemsTemp);
    }, [itemsTemp]);
    const [frequencySortbutton, setfrequencySortbutton] = useState(1);
    const [lexicalGraphicSortButton, setlexicalGraphicSortButton] = useState(0);
    useEffect(() => {
        if (frequencySortbutton) {
            frequencySort(frequencySortbutton == 1);
        } else if (lexicalGraphicSortButton) {
            lexicalGraphicSort(lexicalGraphicSortButton == 1);
        }
    }, [frequencySortbutton, lexicalGraphicSortButton, items]);

    const frequencySort = (reverse = false) => {
        const temp = Array.from(items as string[]);
        temp.sort((a, b) => {
            return reverse ? itemsObj[b] - itemsObj[a] : itemsObj[a] - itemsObj[b];
        });
        setItems(temp);
    };

    const lexicalGraphicSort = (reverse = false) => {
        const temp: String[] = Array.from(items as string[]);
        temp.sort();
        if (reverse) {
            temp.reverse();
        }
        setItems(temp);
    };
    const sortButton = (buttonState, setButtonState, text, setOtherButtonState) => {
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
                                setAutoPhrasesArray((oldArr) => oldArr.concat([item]));
                                setItems(items.filter((it) => it != item));
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
