import {useEffect, useState} from 'react';
import {TableDataDto} from '../types/TableDataDto';
import {getColumnData} from '../api/getColumnsData';
import {setColumnData} from '../api/setColumnsData';
import {Button, Card, Icon, List, Popover, Text} from '@gravity-ui/uikit';
import {ArrowChevronDown, ArrowRotateLeft, Check, LayoutColumns3} from '@gravity-ui/icons';
import {ColumnEditItem} from './ColumnEditListItem';
// import {cx} from '@/lib/utils';

interface ColumnEditProps {
    columnData: {name: string; placeholder: string}[];
    tableId: string;
    onUpdate: (arg: {name: string; placeholder: string}[]) => void;
}

export const ColumnEdit = ({columnData, tableId, onUpdate}: ColumnEditProps) => {
    const [tableData, setTableData] = useState<TableDataDto>({
        tableId,
        userId: 0,
        paginationSize: 100,
        order: [],
        hidden: [],
    });

    useEffect(() => {
        console.log('tableData', tableData);
    }, [tableData]);

    const [tempTableData, setTempTableData] = useState<TableDataDto>({
        tableId,
        userId: 0,
        paginationSize: 100,
        order: [],
        hidden: [],
    });

    useEffect(() => {
        console.log('tempTableData', tempTableData);
    }, [tempTableData]);

    useEffect(() => {
        if (!tableData.order.length) {
            const newTableData = {...tableData, order: columnData.map((column) => column.name)};
            setTableData(newTableData);
        }
        console.log(tableData);
    }, [tableData, columnData]);

    const [open, setOpen] = useState(false);

    const getColumnDataFromApi = async () => {
        try {
            const data = await getColumnData(tableId);
            console.log('data from getColumnData', data);
            if (!data.order.length || data.order.length != columnData.length) {
                data.order = columnData.map((column) => column.name);
            }
            setTableData(data);
            setTempTableData(data);
            setUpdadeOn(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getColumnDataFromApi();
    }, []);

    const setColumnDataFromApi = async (tableData?: TableDataDto) => {
        try {
            // setTableData(tempTableData);
            const data = await setColumnData(
                tableId,
                tableData?.paginationSize ?? tempTableData.paginationSize,
                tableData?.order ?? tempTableData.order,
                tableData?.hidden ?? tempTableData.hidden,
            );
            console.log('data from setColumnData', data);
            setTableData(data);
            setTempTableData(data);
            setUpdadeOn(data);
        } catch (error) {
            console.error(error);
        }
    };

    const [columnsInOrder, setColumnsInOrder] =
        useState<{name: string; placeholder: string}[]>(columnData);
    useEffect(() => {
        console.log(columnsInOrder);
    });
    const setUpdadeOn = (data: TableDataDto) => {
        console.log(data, 'data setUpdateOn');
        const columns: {name: string; placeholder: string}[] = [];
        for (const orderItem of data.order) {
            // if (data.hidden.includes(orderItem)) continue;
            const column = columnData.filter((column) => column.name == orderItem);
            if (column.length) columns.push(column[0]);
        }
        console.log(columns);
        setColumnsInOrder(columns);
        const filteredColumns = columns.filter((column) => !data.hidden.includes(column.name));
        onUpdate(filteredColumns);
    };

    const save = () => {
        setColumnDataFromApi();
        setOpen(false);
    };

    const reset = () => {
        const newTableData = {
            ...tableData,
            order: columnData.map((column) => column.name),
            hidden: [],
            paginationSize: 100,
        };
        setTempTableData(newTableData);
        setTableData(newTableData);
        setColumnsInOrder(columnData);
        onUpdate(columnData);
        setColumnDataFromApi(newTableData);
        setOpen(false);
    };

    const undo = () => {
        setTempTableData(tableData);
        const columns = [];
        for (const orderItem of tableData.order) {
            // if (data.hidden.includes(orderItem)) continue;
            const column = columnData.filter((column) => column.name == orderItem);
            if (column.length) columns.push(column[0]);
        }
        console.log(columns);
        setColumnsInOrder(columns);
        // setOpen(false);
    };

    const changeOrder = (name: string, order: number) => {
        console.log(tempTableData);
        console.log(name);
        const index = tempTableData.order.findIndex((value) => value == name);
        console.log(index);
        let newIndex = index + order;
        newIndex =
            newIndex < 0 ? 0 : newIndex >= columnData.length ? columnData.length - 1 : newIndex;

        changePosition(index, newIndex);
    };

    const setPosition = (name: string, position: number) => {
        let pos = position - 1;
        pos = pos < 0 ? 0 : pos > tempTableData.order.length ? tempTableData.order.length : pos;
        console.log(tempTableData);
        const index = tempTableData.order.findIndex((value) => value == name);
        changePosition(index, pos);
    };

    const changePosition = (oldIndex: number, newIndex: number) => {
        console.log(oldIndex, newIndex);
        const newOrder = [...tempTableData.order];
        const column = columnsInOrder[oldIndex];
        const newColumnsInOrder = [...columnsInOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, column.name);
        newColumnsInOrder.splice(oldIndex, 1);
        newColumnsInOrder.splice(newIndex, 0, column);
        console.log(newColumnsInOrder, newOrder);
        setColumnsInOrder(newColumnsInOrder);
        setTempTableData({...tempTableData, order: newOrder});
    };

    const changeHidden = (name: string, hidden: boolean) => {
        hidden;
        let newHidden: string[];

        if (tempTableData.hidden.includes(name)) {
            newHidden = tempTableData.hidden.filter((col) => col !== name);
        } else {
            newHidden = [...tempTableData.hidden, name];
        }

        setTempTableData({...tempTableData, hidden: newHidden});
    };

    return (
        <div>
            <Popover
                open={open}
                onOpenChange={setOpen}
                enableSafePolygon={true}
                content={
                    <Card
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            width: 366,
                            background: '#221d220f',
                            backdropFilter: 'blur(48px)',
                            // transform: `translate(-50%, 0%)`,
                            border: '1px solid #eee2',
                            position: 'absolute',
                        }}
                        // className={cx(['blurred-card', 'centred-absolute-element'])}
                    >
                        <div style={{padding: 8}}>
                            <List
                                itemHeight={50}
                                itemsHeight={400}
                                filterable={false}
                                items={columnsInOrder}
                                renderItem={(item) => {
                                    const hidden = tempTableData.hidden.includes(item.name);
                                    return (
                                        <ColumnEditItem
                                            setPosition={setPosition}
                                            key={`${item.name}_${tableId}`}
                                            hidden={hidden}
                                            changeOrder={changeOrder}
                                            changeHidden={changeHidden}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                        />
                                    );
                                }}
                            />
                            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                                <Button
                                    selected
                                    style={{width: '100%'}}
                                    view="outlined-warning"
                                    onClick={reset}
                                >
                                    <Text>По умолчанию</Text>
                                    <Icon data={LayoutColumns3} />
                                </Button>
                                <Button
                                    selected
                                    style={{width: '100%'}}
                                    view="outlined-danger"
                                    onClick={undo}
                                >
                                    <Text>Отменить</Text>
                                    <Icon data={ArrowRotateLeft} />
                                </Button>
                                <Button
                                    selected
                                    style={{width: '100%'}}
                                    view="outlined-success"
                                    onClick={save}
                                >
                                    <Text>Сохранить</Text>
                                    <Icon data={Check} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                }
            >
                <Button>
                    <Icon data={ArrowChevronDown} />
                </Button>
            </Popover>
        </div>
    );
};
