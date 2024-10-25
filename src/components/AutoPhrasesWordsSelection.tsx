import {Button, Card, List, Popover, Text} from '@gravity-ui/uikit';
import React from 'react';

export const AutoPhrasesWordsSelection = ({disabled, items, setItems, setAutoPhrasesArray}) => {
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
