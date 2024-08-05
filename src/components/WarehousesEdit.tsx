import {Button, Card, Icon, List, Popover, Switch, Text} from '@gravity-ui/uikit';
import {Trolley, EyeSlash, Eye} from '@gravity-ui/icons';
import React, {useEffect, useMemo, useState} from 'react';
import {arrayMove} from './ColumsEdit';
import {motion} from 'framer-motion';
import callApi, {getUid} from 'src/utilities/callApi';

export const WarehousesEdit = ({columns, setColumns, selectValue, sortingType, setSortingType}) => {
    const [items, setItems] = useState(columns as any[]);
    const [sortingTypeTemp, setSortingTypeTemp] = useState(sortingType);

    const [warehousesFetching, setWarehousesFetching] = useState(false);
    useEffect(() => {
        if (!selectValue[0]) return;
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
        };
        setWarehousesFetching(true);
        callApi('getWarehouses', params)
            .then((res) => {
                if (!res || !res['data']) return;
                const temp = res['data'];
                console.log('warehouses:', temp);

                setColumns(temp['warehouses'] ?? []);
                setSortingType(temp['sortingType']);
            })
            .catch((e) => {
                console.log('error fetching warehouses', e);
            })
            .finally(() => setWarehousesFetching(false));
    }, [selectValue]);

    useEffect(() => {
        sortItems(sortingType, columns);
        setSortingTypeTemp(sortingType);
    }, [columns, sortingType]);

    const arrayMoveWrapper = (arrayTemp, oldIndex, newIndex) => {
        return arrayMove(arrayTemp, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order: index,
        }));
    };

    const itemsChanged = useMemo(() => {
        return JSON.stringify(columns) !== JSON.stringify(items) || sortingTypeTemp != sortingType;
    }, [columns, items, sortingTypeTemp, sortingType]);

    const toggleVisibility = (name) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item['name'] === name ? {...item, visible: !item['visible']} : item,
            ),
        );
    };

    const sortItems = (sortingParam, data = undefined as any) => {
        setItems((prevItems) =>
            data
                ? data.sort((a, b) => a[sortingParam] - b[sortingParam])
                : prevItems.sort((a, b) => a[sortingParam] - b[sortingParam]),
        );
    };

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
                            height: 450,
                            width: 350,
                            padding: 8,
                            top: -10,
                            left: -9,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            animate={{height: itemsChanged ? 390 : 450}}
                            style={{
                                height: 450,
                                overflow: 'auto',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Switch
                                    checked={sortingTypeTemp == 'tarif'}
                                    onUpdate={(val) => {
                                        const value = val ? 'tarif' : 'order';
                                        setSortingTypeTemp(value);
                                        sortItems(value);
                                    }}
                                />
                                <div style={{minWidth: 4}} />
                                <Text variant="subheader-1">
                                    Использовать сортировку по тарифам
                                </Text>
                            </div>
                            <List
                                sortable={sortingTypeTemp == 'order'}
                                filterable={false}
                                itemHeight={28}
                                items={items}
                                sortHandleAlign="right"
                                renderItem={(item) => {
                                    return (
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div style={{minWidth: 2}} />
                                                <Button
                                                    size="xs"
                                                    view={
                                                        item['visible'] ? 'flat' : 'flat-secondary'
                                                    }
                                                    onClick={() => toggleVisibility(item['name'])}
                                                >
                                                    <Icon data={item['visible'] ? Eye : EyeSlash} />
                                                </Button>
                                                <div style={{minWidth: 3}} />

                                                <Text
                                                    variant="subheader-1"
                                                    color={
                                                        item['visible'] ? 'primary' : 'secondary'
                                                    }
                                                >
                                                    {item['name']}
                                                </Text>
                                                <div style={{minWidth: 3}} />
                                            </div>

                                            <Text
                                                variant="subheader-1"
                                                color={
                                                    item['visible']
                                                        ? item['tarif'] > 135
                                                            ? 'danger'
                                                            : item['tarif'] > 85
                                                            ? 'warning'
                                                            : 'positive'
                                                        : 'secondary'
                                                }
                                            >
                                                {item['tarif'] ? `${item['tarif']}%` : ''}
                                            </Text>
                                        </div>
                                    );
                                }}
                                onSortEnd={({oldIndex, newIndex}) => {
                                    setItems((prevItems) =>
                                        arrayMoveWrapper(prevItems, oldIndex, newIndex),
                                    );
                                }}
                            />
                        </motion.div>
                        <motion.div
                            animate={{y: itemsChanged ? 18 : 100}}
                            style={{
                                height: 0,
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                size="l"
                                view="action"
                                onClick={() => {
                                    setColumns(items);
                                    setSortingType(sortingTypeTemp);
                                    sortItems(sortingTypeTemp);
                                    callApi('updateWarehouses', {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        warehouses: items,
                                        sortingType: sortingTypeTemp,
                                    });
                                }}
                                style={{
                                    borderRadius: 9,
                                    boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                                }}
                            >
                                <Text variant="subheader-1">Сохранить</Text>
                            </Button>
                            <div style={{minWidth: 16}} />
                            <Button
                                size="l"
                                view="outlined"
                                onClick={() => {
                                    setItems(columns);
                                    setSortingTypeTemp(sortingType);
                                    sortItems(sortingType);
                                }}
                                style={{
                                    borderRadius: 9,
                                    background: 'var(--g-color-base-background',
                                    boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                                }}
                            >
                                <Text variant="subheader-1">Сбросить</Text>
                            </Button>
                        </motion.div>
                    </Card>
                </div>
            }
        >
            <Button size="l" view="action" loading={warehousesFetching}>
                <Icon data={Trolley} />
                <Text variant="subheader-1">Склады</Text>
            </Button>
        </Popover>
    );
};
