'use client';

import {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import block from 'bem-cn-lite';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import {CircleMinusFill, CircleMinus, CirclePlusFill, CirclePlus, Funnel} from '@gravity-ui/icons';
import {
    Button,
    Card,
    CardTheme,
    Checkbox,
    DropdownMenu,
    Icon,
    Pagination,
    Text,
} from '@gravity-ui/uikit';
import {DelayedTextInput} from '@gravity-ui/components';
import {defaultRender} from '@/utilities/getRoundValue';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import callApi from '@/utilities/callApi';
import {PaginationSizeInput} from './PaginationSizeInput';
import {ClearFiltersButton} from './ClearFiltersButton';
import {useCheckboxes} from './hooks';
import {getFiltersFromUrl, getSortsFromUrl, setUrlFilters, setUrlSorts} from "@/shared/lib/tableViewParams";

const b = block('the-table');

interface TheTableProps {
    theme?: CardTheme | undefined;
    tableId: string;
    usePagination: boolean;
    defaultPaginationSize?: number;
    onPaginationUpdate?: Function;
    onCheckboxStateUpdate?: Function;
    columnData: any;
    useCheckboxes?: boolean;
    checkboxKey?: string;
    data: any[];
    filters: any;
    setFilters: (filters: any) => void;
    filterData: any;
    emptyDataMessage?: string;
    footerData?: any[];
    width?: string | number;
    height?: string | number;
    onRowClick?: (row: any, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
    // rowKey?: ((row: any, index: number) => string | number) | undefined;
}

export default function TheTable({
    theme,
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
    useCheckboxes: useChecks,
    onCheckboxStateUpdate,
    checkboxKey,
}: TheTableProps) {
    let isFiltersUpdated: RefObject<boolean> = useRef<boolean>(false);
    const viewportSize = useWindowDimensions();

    const {checkboxStates, updateCheckbox, checkboxHeaderState, updateHeaderCheckbox} =
        useCheckboxes(data, filters, checkboxKey ?? 'nmId');
    const [sortState, setSortState] = useState([] as any);

    useEffect(() => {
        if (!isFiltersUpdated.current) {
            return
        }
        setUrlFilters(tableId || "0", filters)
    }, [filters]);

    useEffect(() => {
        const urlSorts = getSortsFromUrl(tableId || "")
        console.log("URL sorts", urlSorts)
        if (urlSorts.length > 0) {
            setSortState(urlSorts)
        } else {
            setUrlSorts(tableId || "0", sortState)
        }

        const newFilters = getFiltersFromUrl(tableId || "0", filters)
        setFilters(newFilters)

        setTimeout(() => {
            isFiltersUpdated.current = true
        }, 10)
    }, []);

    useEffect(() => {
        console.log("SORT StATW", sortState)
        if (Array.isArray(sortState) && sortState.length === 0) {
            return
        }
        setUrlSorts(tableId || "0", sortState)
    }, [sortState]);

    useEffect(() => {
        if (onCheckboxStateUpdate) onCheckboxStateUpdate(checkboxHeaderState, checkboxStates);
    }, [checkboxHeaderState, checkboxStates]);
    const {userInfo} = useUser();

    const {user} = userInfo ?? {};
    const [page, setPage] = useState(1);

    const [paginationSize, setPaginationSize] = useState(defaultPaginationSize as any);
    const [sortedData, setSortedData] = useState(data);

    const [sortFuncs, setSortFuncs] = useState({});

    const sortData = () => {
        if (!sortState) return;
        let sortedDataTemp = [...data];
        for (let i = 0; i < sortState?.length; i++) {
            const {columnId, order} = sortState[i];
            const sortFunc: any = (sortFuncs as any)[columnId];
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
            .catch(() => {
                setPaginationSize(defaultPaginationSize);
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
        if (onPaginationUpdate)
            onPaginationUpdate({page, paginatedData: tempPaginatedData, paginationSize});
    }, [paginationSize, sortedData]);

    const columns = useMemo(() => {
        const columns: Column<any>[] = [];
        if (!columnData || !columnData.length) return columns;

        if (useChecks) {
            columns.push({
                sortable: false,
                name: 'checkbox',
                className: b(`td_fixed td_fixed_checkbox`),
                header: (
                    <Checkbox
                        checked={checkboxHeaderState}
                        onChange={() => updateHeaderCheckbox()}
                        style={{marginTop: 22}}
                        size="l"
                    />
                ),
                render: ({row, footer}) => {
                    if (footer) return undefined;
                    const checkboxIndex = row?.[checkboxKey ?? 'nmId'];
                    return (
                        <Checkbox
                            checked={checkboxStates[checkboxIndex] ? true : false}
                            onChange={() => updateCheckbox(checkboxIndex)}
                            size="l"
                            onUpdate={() => {
                                console.log('checked', checkboxIndex, row);
                            }}
                        />
                    );
                },
            });
        }

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
                (sortFuncs as any)[name] = sortFunction;
                // console.log(sortFuncs);
            }

            columns.push({
                sortable,
                sub,
                name: name,
                className: b(
                    className ??
                        (i < 1
                            ? `td_fixed td_fixed_${name}${useChecks ? ' td_left_37' : ''}`
                            : 'td_body'),
                ),
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
    }, [columnData, filters, checkboxStates, page]);

    const tableCardStyle = {
        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
        overflow: 'auto',
        maxHeight: height ?? '100%',
        maxWidth: width ?? '100%',
        borderRadius: 9,
    };

    return (
        <div style={{height: `calc(${height ?? '100%'} - 16px - 28px)`, width: width ?? '100%'}}>
            <Card style={tableCardStyle} theme={theme}>
                <DataTable
                    emptyDataMessage={emptyDataMessage ?? 'Нет данных.'}
                    startIndex={1}
                    onSort={(tempSortState) => {
                        console.log("Temp sort state", tempSortState)
                        setSortState(tempSortState)
                    }}
                    settings={{
                        externalSort: true,
                        stickyHead: MOVING,
                        stickyFooter: MOVING,
                        displayIndices: false,
                        highlightRows: true,
                    }}
                    // rowKey={rowKey}
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
                    <ClearFiltersButton
                        filters={filters}
                        setFilters={setFilters}
                        filterData={filterData}
                    />
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
                            const tempPaginatedData = sortedData.slice(
                                (page - 1) * pagination,
                                page * pagination,
                            );
                            setPaginatedData(tempPaginatedData);

                            if (onPaginationUpdate)
                                onPaginationUpdate({
                                    page,
                                    paginatedData: tempPaginatedData,
                                    paginationSize,
                                });
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export const generateFilterTextInput = (args: any) => {
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
                minWidth: (constWidth ?? width) ? (minWidth < width ? minWidth : width) : minWidth,
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
                    endContent={
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

export const compare = (a: any, filterData: any) => {
    const {val, compMode} = filterData;
    if (typeof a == 'string' && a.length == 24 && a.includes('T') && a.at(-1) == 'Z') {
        return new Date(a as string).toLocaleDateString('ru-RU').includes(String(val));
    }
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
        return Number(a) > Number(val.replace(/[,]/g, '.'));
    }
    if (compMode == 'not bigger') {
        return Number(a) < Number(val.replace(/[,]/g, '.'));
    }
    return false;
};
