'use client';

import {useEffect, useMemo, useState} from 'react';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import block from 'bem-cn-lite';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import {Card, CardTheme, Pagination, Text} from '@gravity-ui/uikit';
import {defaultRender} from '@/utilities/getRoundValue';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import callApi from '@/utilities/callApi';
import {ClearFiltersButton} from '@/components/TheTable/ClearFiltersButton';
import {PaginationSizeInput} from '@/components/TheTable/PaginationSizeInput';
import {generateFilterTextInput} from '@/pages/AnalyticsPage/ui/FilterTextInput';
import {observer} from 'mobx-react-lite';
import {analyticsDataStore} from '@/pages/AnalyticsPage/stores/data/analyticsDataStore';

const b = block('the-table');

interface TheTableProps {
    theme?: CardTheme | undefined;
    tableId: string;
    usePagination: boolean;
    defaultPaginationSize?: number;
    onPaginationUpdate?: Function;
    columnData: any;
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

export const AnalyticsTable = observer(
    ({
        theme,
        tableId,
        usePagination,
        defaultPaginationSize,
        onPaginationUpdate,
        columnData,
        filters,
        setFilters,
        filterData,
        emptyDataMessage,
        footerData = [],
        height,
        width,
        onRowClick,
        // rowKey = (row, index) => index,
    }: TheTableProps) => {
        const {data} = analyticsDataStore;
        const viewportSize = useWindowDimensions();

        const {userInfo} = useUser();
        const {user} = userInfo ?? {};

        const [page, setPage] = useState(1);
        const [paginationSize, setPaginationSize] = useState(defaultPaginationSize as any);

        const [sortFuncs, setSortFuncs] = useState({});

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
                tempPaginatedData = data;
            } else {
                tempPaginatedData = data.slice((page - 1) * paginationSize, page * paginationSize);
            }
            setPaginatedData(tempPaginatedData);
            if (onPaginationUpdate)
                onPaginationUpdate({page, paginatedData: tempPaginatedData, paginationSize});
        }, [paginationSize, data]);

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
                    (sortFuncs as any)[name] = sortFunction;
                    // console.log(sortFuncs);
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
                    render: render
                        ? (args) => render(args)
                        : (args) => defaultRender(args, valueType),
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

        return (
            <div
                style={{height: `calc(${height ?? '100%'} - 16px - 28px)`, width: width ?? '100%'}}
            >
                <Card style={tableCardStyle} theme={theme}>
                    <DataTable
                        emptyDataMessage={emptyDataMessage ?? 'Нет данных.'}
                        startIndex={1}
                        settings={{
                            externalSort: true,
                            stickyHead: MOVING,
                            stickyFooter: MOVING,
                            displayIndices: false,
                            dynamicRender: true,
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
                            total={data.length}
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
    },
);
