import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import callApi, {getUid} from 'src/utilities/callApi';
import {Button, Loader, Pagination, Card, Text, Icon} from '@gravity-ui/uikit';
import {Pencil, Xmark} from '@gravity-ui/icons';

export const AutoFeedbackAnsweringPage = ({
    selectValue,
    refetch,
}: {
    selectValue: string[];
    refetch: boolean;
}) => {
    const [filters, setFilters] = useState({});
    const [data, setData] = useState(null as any);
    const [filteredData, setFilteredData] = useState([] as any[]);
    const paginationSize = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([] as any[]);

    useEffect(() => {
        const params = {uid: getUid(), campaignName: selectValue[0]};
        console.log('getFeedbacks', params);

        callApi('getAutoFeedbackTemplates', params)
            .then((res) => {
                if (!res || !res.data) return;
                console.log(res);
                setData(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [selectValue, refetch]);

    const filterData = (withfFilters = {}, tableData = {}) => {
        const temp = [] as any;

        for (const [phrase, phraseInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!phrase || !phraseInfo) continue;

            const tempTypeRow = phraseInfo;

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '') continue;
                if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) {
                temp.push(tempTypeRow);
            }
        }

        setFilteredData(temp);
    };

    useEffect(() => {
        if (!data) return;
        filterData();
    }, [data]);

    useEffect(() => {
        const temp = filteredData.slice(
            (currentPage - 1) * paginationSize,
            currentPage * paginationSize,
        );
        setPaginatedData(temp);
    }, [filteredData, currentPage]);

    const columns = [
        {
            name: 'name',
            placeholder: 'Название',
            render: ({value}) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        {value}
                        <div
                            style={{
                                marginLeft: 16,
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <Button
                                size="xs"
                                onClick={() => {
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        name: value,
                                    };

                                    console.log('deleteAutoFeedbackTemplate', params);

                                    callApi('deleteAutoFeedbackTemplate', params)
                                        .then((res) => {
                                            if (!res || !res.data) return;
                                            console.log(res);
                                            setData(res.data);
                                        })
                                        .catch((e) => {
                                            console.log(e);
                                        });
                                }}
                            >
                                <Icon data={Xmark} />
                            </Button>
                            <div style={{minWidth: 8}} />
                            <Button size="xs">
                                <Icon data={Pencil} />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        // {name: 'priority', placeholder: 'Приоритет'},
        {
            name: 'text',
            placeholder: 'Шаблон ответа',
            render: ({value}) => {
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value}</Text>
                    </div>
                );
            },
        },
        // {name: 'feedbackAge', placeholder: 'Возраст отзыва'},
        // {name: 'feedbackLength', placeholder: 'Длина отзыва'},
        {
            name: 'productValuation',
            placeholder: 'Оценка',
            render: ({row}) => {
                const {ratingFrom, ratingTo} = row;

                if (!ratingFrom || !ratingTo) return undefined;
                return (
                    <Button size="xs" selected pin="circle-circle">
                        {`${ratingFrom} - ${ratingTo}`}
                    </Button>
                );
            },
        },
        // {name: 'containsMedia', placeholder: 'Фото или видео'},
        {name: 'doNotContain', placeholder: 'Минус слова'},
        {name: 'contains', placeholder: 'Ключевые слова'},
        {
            name: 'bindingKeys',
            placeholder: 'Привязка',
            render: ({value}) => {
                if (!value) return undefined;
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value.join(', ')}</Text>
                    </div>
                );
            },
        },
        // {name: 'arts', placeholder: 'Артикулы'},
        // {name: 'brands', placeholder: 'Бренды'},
    ];

    return data ? (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card
                style={{
                    boxShadow: 'inset 0px 0px 10px var(--g-color-base-background)',
                    position: 'relative',
                    overflow: 'auto',
                    width: '100%',
                    maxHeight: 'calc(100vh - 68px - 32px - 36px - 16px - 48px)',
                }}
            >
                <TheTable
                    emptyDataMessage="У вас еще нет сохраненных шаблонов."
                    columnData={columns}
                    data={paginatedData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterData}
                />
            </Card>
            <div style={{minHeight: 16}} />
            <Pagination
                total={filteredData.length}
                page={currentPage}
                pageSize={paginationSize}
                onUpdate={(page) => {
                    setCurrentPage(page);
                }}
            />
        </div>
    ) : (
        <Loader size="l" />
    );
};
