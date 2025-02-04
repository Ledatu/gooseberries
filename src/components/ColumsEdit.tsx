import {
    Button,
    Card,
    Icon,
    List,
    Checkbox,
    Popover,
    Text,
    PopoverInstanceProps,
} from '@gravity-ui/uikit';
import {LayoutColumns3} from '@gravity-ui/icons';
import React, {useRef, useState} from 'react';

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

export const ColumnsEdit = ({columns, setColumns, columnDataObj, saveColumnsData}) => {
    const popoverRef = useRef<PopoverInstanceProps>(null);
    const [rerenderList, setRerenderList] = useState(true);

    const close = () => {
        popoverRef.current?.closeTooltip();
    };
    const toggleColumnVisibility = (key: string, value: boolean) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) => (col.key === key ? {...col, visibility: value} : col)),
        );
    };
    // const [initialColumnData, setInitialColumnData] = useState(Object.keys(columnDataObj));
    // const [tempColumns, setTempColumns] = useState(Object.keys(columnDataObj));
    return (
        <Popover
            ref={popoverRef}
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
                            height: '80vh',
                            width: 250,
                            padding: 8,
                            overflow: 'auto',
                            top: -10,
                            left: -9,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backdropFilter: 'blur(8px)',
                            background: '#221d220f',
                            // boxShadow: '#0006 0px 2px 8px 0px',
                            border: '1px solid #eee2',
                            borderRadius: '0px 0px 8px 8px',
                        }}
                    >
                        <List
                            sortable={true}
                            filterable={false}
                            itemHeight={28}
                            items={columns}
                            sortHandleAlign="right"
                            renderItem={(item) => {
                                const {key, visibility} = item as any;
                                return (
                                    <div
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Checkbox
                                            checked={visibility}
                                            onUpdate={(value) => toggleColumnVisibility(key, value)}
                                        />
                                        <div style={{minWidth: 4}} />
                                        <Text>{columnDataObj[key].placeholder}</Text>
                                    </div>
                                );
                            }}
                            onSortEnd={({oldIndex, newIndex}) => {
                                const movedArray = arrayMove(columns, oldIndex, newIndex);
                                setColumns(movedArray);
                                setRerenderList(rerenderList);
                            }}
                        />
                        <Button
                            style={{marginTop: '8px'}}
                            onClick={() => {
                                saveColumnsData();
                                close();
                            }}
                        >
                            <Text>Сохранить положение столбцов</Text>
                        </Button>
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
