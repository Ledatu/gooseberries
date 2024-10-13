import React, {useEffect, useMemo, useState} from 'react';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import block from 'bem-cn-lite';
import useWindowDimensions from 'src/hooks/useWindowDimensions';

import {
    CircleMinusFill,
    CircleMinus,
    CirclePlusFill,
    CirclePlus,
    Funnel,
    FunnelXmark,
} from '@gravity-ui/icons';
import {Button, Card, DropdownMenu, Icon, Pagination, Text} from '@gravity-ui/uikit';
import {DelayedTextInput} from '@gravity-ui/components';
import {defaultRender} from 'src/utilities/getRoundValue';
import {useUser} from './RequireAuth';
import callApi from 'src/utilities/callApi';
import {motion} from 'framer-motion';
import {PaginationSizeInput} from './PaginationSizeInput';

const b = block('the-table');

interface TheTableProps {
    tableId: string;
    usePagination: boolean;
    defaultPaginationSize?: number;
    onPaginationUpdate?: Function;
    columnData: any;
    data: any[];
    filters: any;
    setFilters: (filters: any) => void;
    filterData: any;
    emptyDataMessage?: string;
    footerData?: any[];
    width?: string | number;
    height?: string | number;
    onRowClick?: (row: any, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
}

export default function TheTable({
    tableId,
    usePagination,
    defaultPaginationSize,
    onPaginationUpdate,
    columnData,
    data,
    filters,
    setFilters,
    filterData,
    emptyDataMessage,
    footerData = [],
    height,
    width,
    onRowClick,
}: TheTableProps) {
    const viewportSize = useWindowDimensions();

    const {userInfo} = useUser();
    const {user} = userInfo ?? {};

    const [page, setPage] = useState(1);
    const [paginationSize, setPaginationSize] = useState(defaultPaginationSize as any);

    const [sortedData, setSortedData] = useState(data);
    const [sortState, setSortState] = useState([] as any);

    const [sortFuncs, setSortFuncs] = useState({});

    const sortData = () => {
        if (!sortState) return;
        let sortedDataTemp = [...data];
        for (let i = 0; i < sortState?.length; i++) {
            const {columnId, order} = sortState[i];
            const sortFunc = sortFuncs[columnId];
            sortedDataTemp = sortedDataTemp.sort((a, b) => {
                const av = a[columnId] ?? 0;
                const bv = b[columnId] ?? 0;
                if (sortFunc) {
                    return sortFunc(a, b, order);
                } else if (isNaN(Number(av))) {
                    return (
                        String(av)
                            .toLocaleLowerCase()
                            .localeCompare(String(bv).toLocaleLowerCase()) * order
                    );
                } else return (av - bv) * order;
            });
        }

        if (page * paginationSize > sortedData.length) setPage(1);

        setSortedData(sortedDataTemp);
    };

    useEffect(() => sortData(), [data, sortState]);

    const [fetchPaginationSize, setFetchPaginationSize] = useState(true);
    useEffect(() => {
        if (!usePagination || !fetchPaginationSize) return;
        const params = {
            user_id: user?._id,
            table_id: tableId,
        };
        callApi('getPaginationSize', params, false, true)
            .then((res) => {
                if (!res || !res['data']) return;
                const data = res['data'];
                setPaginationSize(data?.paginationSize ?? defaultPaginationSize);
            })
            .catch((e) => {
                setPaginationSize(defaultPaginationSize);
                console.log(new Date(), 'error getting pagination size', e);
            })
            .finally(() => {
                setFetchPaginationSize(false);
            });
    }, [fetchPaginationSize]);

    const [paginatedData, setPaginatedData] = useState([] as any[]);
    useEffect(() => {
        let tempPaginatedData = [] as any[];
        if (!usePagination) {
            tempPaginatedData = sortedData;
        } else {
            tempPaginatedData = sortedData.slice(
                (page - 1) * paginationSize,
                page * paginationSize,
            );
        }
        setPaginatedData(tempPaginatedData);
        if (onPaginationUpdate) onPaginationUpdate({page, paginatedData: tempPaginatedData});
    }, [paginationSize, sortedData]);

    const columns = useMemo(() => {
        const columns: Column<any>[] = [];
        if (!columnData || !columnData.length) return columns;

        for (let i = 0; i < columnData.length; i++) {
            const column = columnData[i];
            if (!column) continue;
            const {
                name,
                placeholder,
                width,
                constWidth,
                render,
                className,
                valueType,
                additionalNodes,
                sortable,
                sub,
                isDivider,
                sortFunction,
            } = column;

            if (sortFunction) {
                sortFuncs[name] = sortFunction;
                console.log(sortFuncs);
            }

            columns.push({
                sortable,
                sub,
                name: name,
                className: b(className ?? (i < 1 ? `td_fixed td_fixed_${name}` : 'td_body')),
                header: isDivider ? (
                    <></>
                ) : sub ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <Text variant="subheader-1">{placeholder}</Text>
                        {additionalNodes}
                    </div>
                ) : (
                    generateFilterTextInput({
                        filters,
                        setFilters,
                        filterData: filterData,
                        name,
                        placeholder,
                        valueType,
                        width,
                        constWidth,
                        viewportSize,
                        additionalNodes,
                    })
                ),
                render: render ? (args) => render(args) : (args) => defaultRender(args, valueType),
            });
        }

        setSortFuncs({...sortFuncs});
        return columns;
    }, [columnData, filters]);

    const tableCardStyle = {
        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
        overflow: 'auto',
        maxHeight: height ?? '100%',
        maxWidth: width ?? '100%',
        borderRadius: 9,
    };

    const filtersUsed = useMemo(() => {
        for (const [key, val] of Object.entries(filters)) {
            if (!key || !val || key == 'undef') continue;
            if (val['val'] != '') return true;
        }
        return false;
    }, [filters]);

    return (
        <div style={{height: `calc(${height ?? '100%'} - 16px - 28px)`, width: width ?? '100%'}}>
            <Card style={tableCardStyle}>
                <DataTable
                    emptyDataMessage={emptyDataMessage ?? 'Нет данных.'}
                    startIndex={1}
                    onSort={(tempSortState) => setSortState(tempSortState)}
                    settings={{
                        externalSort: true,
                        stickyHead: MOVING,
                        stickyFooter: MOVING,
                        displayIndices: false,
                        highlightRows: true,
                    }}
                    theme="yandex-cloud"
                    onRowClick={(row, index, event) => {
                        if (onRowClick) onRowClick(row, index, event);
                        else console.log(row);
                    }}
                    rowClassName={(_row, index, isFooterData) =>
                        isFooterData ? b('tableRow_footer') : b('tableRow_' + index)
                    }
                    data={paginatedData}
                    columns={columns}
                    footerData={footerData}
                />
            </Card>
            {usePagination ? (
                <div
                    style={{
                        marginTop: 16,
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    <motion.div
                        style={{width: 0, overflow: 'hidden'}}
                        animate={{
                            width: filtersUsed ? 106 : 0,
                            marginRight: filtersUsed ? 8 : 0,
                        }}
                    >
                        <Button
                            selected
                            onClick={() => {
                                setFilters(() => {
                                    const newFilters = {undef: true};
                                    for (const [key, filterData] of Object.entries(
                                        filters as any,
                                    )) {
                                        if (key == 'undef' || !key || !filterData) continue;
                                        newFilters[key] = {
                                            val: '',
                                            compMode: filterData['compMode'] ?? 'include',
                                        };
                                    }
                                    filterData(newFilters);
                                    return {...newFilters};
                                });
                            }}
                        >
                            <Icon data={FunnelXmark} />
                            Очистить
                        </Button>
                    </motion.div>
                    <PaginationSizeInput
                        paginationSize={paginationSize}
                        setFetchPaginationSize={setFetchPaginationSize}
                        setPage={setPage}
                        user={user}
                        tableId={tableId}
                    />
                    <Pagination
                        total={sortedData.length}
                        page={page}
                        pageSize={paginationSize}
                        onUpdate={(page) => {
                            setPage(page);

                            const pagination = paginationSize ?? defaultPaginationSize;
                            const tempPaginatedData = data.slice(
                                (page - 1) * pagination,
                                page * pagination,
                            );
                            setPaginatedData(tempPaginatedData);

                            if (onPaginationUpdate)
                                onPaginationUpdate({page, paginatedData: tempPaginatedData});
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export const generateFilterTextInput = (args) => {
    const {
        filters,
        setFilters,
        filterData,
        name,
        placeholder,
        valueType,
        constWidth,
        width,
        viewportSize,
        additionalNodes,
    } = args;
    let minWidth = viewportSize ? viewportSize.width / 20 : 60;
    if (minWidth < 40) minWidth = 60;
    if (minWidth > 250) minWidth = 200;

    // let placeholderWrapped = placeholder;
    // if (placeholder.length > 30) {
    //     let wrapped = false;
    //     placeholderWrapped = '';
    //     const titleArr = placeholder.split(' ');
    //     for (const word of titleArr) {
    //         placeholderWrapped += word;
    //         if (placeholderWrapped.length > 25 && !wrapped) {
    //             placeholderWrapped += '\n';
    //             wrapped = true;
    //         } else {
    //             placeholderWrapped += ' ';
    //         }
    //     }
    // }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: 'max-content',
                alignItems: 'end',
                minWidth: constWidth ?? width ? (minWidth < width ? minWidth : width) : minWidth,
                maxWidth: constWidth,
                width: constWidth,
            }}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'end',
                }}
            >
                <Text style={{marginLeft: 4}} variant="subheader-1">
                    {placeholder}
                </Text>
                <DelayedTextInput
                    style={{width: '100%'}}
                    delay={250}
                    hasClear
                    value={filters[name] ? filters[name].val : ''}
                    onUpdate={(val) => {
                        setFilters(() => {
                            if (!(name in filters))
                                filters[name] = {
                                    compMode: valueType != 'text' ? 'bigger' : 'include',
                                    val: '',
                                };
                            filters[name].val = val;
                            filterData(filters);
                            return {...filters};
                        });
                    }}
                    // placeholder={'Фильтр'}
                    rightContent={
                        <DropdownMenu
                            renderSwitcher={(props) => (
                                <Button
                                    {...props}
                                    view={
                                        filters[name]
                                            ? filters[name].val != ''
                                                ? !filters[name].compMode.includes('not')
                                                    ? 'flat-success'
                                                    : 'flat-danger'
                                                : 'flat'
                                            : 'flat'
                                    }
                                    size="xs"
                                >
                                    <Icon data={Funnel} />
                                </Button>
                            )}
                            items={[
                                [
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'include'
                                                            ? CirclePlusFill
                                                            : CirclePlus
                                                        : CirclePlusFill
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'include',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'include';
                                                filterData(filters);
                                                return {...filters};
                                            });
                                        },
                                        text: 'Включает',
                                    },
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'not include'
                                                            ? CircleMinusFill
                                                            : CircleMinus
                                                        : CircleMinus
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'not include',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'not include';
                                                filterData(filters);
                                                return {...filters};
                                            });
                                        },
                                        text: 'Не включает',
                                        theme: 'danger',
                                    },
                                ],
                                [
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'equal'
                                                            ? CirclePlusFill
                                                            : CirclePlus
                                                        : CirclePlus
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'equal',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'equal';
                                                filterData(filters);
                                                return {...filters};
                                            });
                                        },
                                        text: 'Равно',
                                    },
                                    {
                                        iconStart: (
                                            <Icon
                                                data={
                                                    filters[name]
                                                        ? filters[name].compMode == 'not equal'
                                                            ? CircleMinusFill
                                                            : CircleMinus
                                                        : CircleMinus
                                                }
                                            />
                                        ),
                                        action: () => {
                                            setFilters(() => {
                                                if (!(name in filters))
                                                    filters[name] = {
                                                        compMode: 'not equal',
                                                        val: '',
                                                    };
                                                filters[name].compMode = 'not equal';
                                                filterData(filters);
                                                return {...filters};
                                            });
                                        },
                                        text: 'Не равно',
                                        theme: 'danger',
                                    },
                                ],
                                valueType != 'text'
                                    ? [
                                          {
                                              iconStart: (
                                                  <Icon
                                                      data={
                                                          filters[name]
                                                              ? filters[name].compMode == 'bigger'
                                                                  ? CirclePlusFill
                                                                  : CirclePlus
                                                              : CirclePlus
                                                      }
                                                  />
                                              ),
                                              action: () => {
                                                  setFilters(() => {
                                                      if (!(name in filters))
                                                          filters[name] = {
                                                              compMode: 'bigger',
                                                              val: '',
                                                          };
                                                      filters[name].compMode = 'bigger';
                                                      filterData(filters);
                                                      return {...filters};
                                                  });
                                              },
                                              text: 'Больше',
                                          },
                                          {
                                              iconStart: (
                                                  <Icon
                                                      data={
                                                          filters[name]
                                                              ? filters[name].compMode ==
                                                                'not bigger'
                                                                  ? CircleMinusFill
                                                                  : CircleMinus
                                                              : CircleMinus
                                                      }
                                                  />
                                              ),
                                              action: () => {
                                                  setFilters(() => {
                                                      if (!(name in filters))
                                                          filters[name] = {
                                                              compMode: 'not bigger',
                                                              val: '',
                                                          };
                                                      filters[name].compMode = 'not bigger';
                                                      filterData(filters);
                                                      return {...filters};
                                                  });
                                              },
                                              text: 'Меньше',
                                              theme: 'danger',
                                          },
                                      ]
                                    : [],
                            ]}
                        />
                    }
                />
            </div>
            {additionalNodes ?? <></>}
        </div>
    );
};

export const compare = (a, filterData) => {
    const {val, compMode} = filterData;
    if (compMode == 'include') {
        return String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
    }
    if (compMode == 'not include') {
        return !String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
    }
    if (compMode == 'equal') {
        return String(a).toLocaleLowerCase() == String(val).toLocaleLowerCase();
    }
    if (compMode == 'not equal') {
        return String(a).toLocaleLowerCase() != String(val).toLocaleLowerCase();
    }
    if (compMode == 'bigger') {
        return Number(a) > Number(val);
    }
    if (compMode == 'not bigger') {
        return Number(a) < Number(val);
    }
    return false;
};
