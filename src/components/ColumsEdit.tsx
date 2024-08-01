import {Button, Card, Icon, List, Popover, Text} from '@gravity-ui/uikit';
import {LayoutColumns3} from '@gravity-ui/icons';
import React from 'react';

export const arrayMove = (arrayTemp, oldIndex, newIndex) => {
    const arr = [...arrayTemp];
    while (oldIndex < 0) {
        oldIndex += arr.length;
    }
    while (newIndex < 0) {
        newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

    return arr;
};

export const ColumnsEdit = ({columns, setColumns, columnDataObj}) => {
    return (
        <Popover
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
                        theme="warning"
                        style={{
                            position: 'absolute',
                            background: 'var(--g-color-base-background)',
                            height: 300,
                            width: 200,
                            padding: 8,
                            overflow: 'auto',
                            top: -10,
                            left: -9,
                            display: 'flex',
                        }}
                    >
                        <List
                            sortable
                            filterable={false}
                            itemHeight={28}
                            items={columns}
                            sortHandleAlign="right"
                            renderItem={(item) => {
                                return (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {/* <Checkbox defaultChecked /> */}
                                        {/* <div style={{minWidth: 4}} /> */}
                                        <Text>{columnDataObj[item as string].placeholder}</Text>
                                    </div>
                                );
                            }}
                            onSortEnd={({oldIndex, newIndex}) => {
                                setColumns(arrayMove(columns, oldIndex, newIndex));
                            }}
                        />
                    </Card>
                </div>
            }
        >
            <Button size="l" view="action" style={{marginBottom: 8}}>
                <Icon data={LayoutColumns3} />
                <Text variant="subheader-1">Столбцы</Text>
            </Button>
        </Popover>
    );
};
