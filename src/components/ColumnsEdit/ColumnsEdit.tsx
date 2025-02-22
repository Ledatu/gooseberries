'use client';

import {
    Button,
    Card,
    Icon,
    List,
    Checkbox,
    Popover,
    Text,
    // PopoverInstanceProps,
} from '@gravity-ui/uikit';
import {LayoutColumns3} from '@gravity-ui/icons';
import {useState} from 'react';
import {arrayMove} from '@/utilities/arrayMove';

interface ColumnsEditProps {
    columns: any[];
    setColumns: ({}: any) => any;
    columnDataObj: any;
    saveColumnsData: () => any;
}

export const ColumnsEdit = ({
    columns,
    setColumns,
    columnDataObj,
    saveColumnsData,
}: ColumnsEditProps) => {
    // const popoverRef = useRef<PopoverInstanceProps>(null);
    const [rerenderList, setRerenderList] = useState(true);
    const [openPopover, setOpenPopover] = useState(false);

    // const close = () => {
    //     popoverRef.current?.closeTooltip();
    // };
    const toggleColumnVisibility = (key: string, value: boolean) => {
        setColumns((prevColumns: any[]) =>
            prevColumns.map((col) => (col.key === key ? {...col, visibility: value} : col)),
        );
    };
    // const [initialColumnData, setInitialColumnData] = useState(Object.keys(columnDataObj));
    // const [tempColumns, setTempColumns] = useState(Object.keys(columnDataObj));
    return (
        <Popover
            open={openPopover}
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
                            height: 300,
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
                                setOpenPopover(false);
                            }}
                        >
                            <Text>Сохранить положение столбцов</Text>
                        </Button>
                    </Card>
                </div>
            }
        >
            <Button
                size="l"
                view="action"
                style={{marginBottom: 8}}
                onClick={() => setOpenPopover(!openPopover)}
            >
                <Icon data={LayoutColumns3} />
                <Text variant="subheader-1">Столбцы</Text>
            </Button>
        </Popover>
    );
};
