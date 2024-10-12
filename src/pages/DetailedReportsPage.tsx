import {Card} from '@gravity-ui/uikit';
import React, {useEffect, useState} from 'react';
import {RangePicker} from 'src/components/RangePicker';
import TheTable from 'src/components/TheTable';

export const DetailedReportsPage = () => {
    const columnData = [{}] as any[];
    const [filters, setFilters] = useState({undef: false});
    const [data, setData] = useState([] as any[]);
    useEffect(() => {
        setData([{id: 2309481092348, profit: 90909090}]);
    }, []);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const [filteredData, setFilteredData] = useState([] as any[]);
    const [dateRange, setDateRange] = useState([] as any[]);

    const recalc = () => {};
    const filterData = () => {};

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
            <div>
                <RangePicker
                    args={{
                        recalc,
                        dateRange,
                        setDateRange,
                    }}
                />
            </div>

            <Card
                style={{
                    maxWidth: '100%',
                    // maxHeight: '80vh',
                    maxHeight: 'calc(100vh - 10em - 52px)',
                    boxShadow: 'inset 0px 0px 10px var(--g-color-base-background)',
                    overflow: 'auto',
                }}
            >
                <TheTable
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterData}
                    tableId={''}
                    usePagination={false}
                />
            </Card>
        </div>
    );
};
