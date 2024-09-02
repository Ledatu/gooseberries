import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import callApi, {getUid} from 'src/utilities/callApi';
import {Button, Loader, Pagination, Icon, Card, Text} from '@gravity-ui/uikit';
import {Star} from '@gravity-ui/icons';

export const AutoFeedbackAnsweringPage = ({selectValue}: {selectValue: string[]}) => {
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
    }, [selectValue]);

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
        {name: 'name', placeholder: 'Название'},
        {name: 'priority', placeholder: 'Приоритет'},
        {name: 'answerTemplate', placeholder: 'Шаблон ответа'},
        {name: 'feedbackAge', placeholder: 'Возраст отзыва'},
        {name: 'feedbackLength', placeholder: 'Длина отзыва'},
        {
            name: 'productValuation',
            placeholder: 'Оценка',
            render: ({value}) => {
                if (!value) return undefined;
                const color =
                    value > 3
                        ? 'outlined-success'
                        : value == 3
                        ? 'outlined-warning'
                        : 'outlined-danger';
                return (
                    <Button size="xs" view={color} selected pin="circle-circle">
                        {value}
                        <Icon data={Star} size={11} />
                    </Button>
                );
            },
        },
        {name: 'containsMedia', placeholder: 'Фото или видео'},
        {name: 'minusWords', placeholder: 'Минус слова'},
        {name: 'keyWords', placeholder: 'Ключевые слова'},
        {name: 'tags', placeholder: 'Теги'},
        {name: 'arts', placeholder: 'Артикулы'},
        {name: 'brands', placeholder: 'Бренды'},
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
                    width: '100%',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 68px - 32px - 36px - 16px - 48px)',
                }}
            >
                <div style={{position: 'relative', top: 0, left: 0, display: 'flex'}}>
                    <Button view="action" size="l">
                        <Text variant="subheader-1">Добавить</Text>
                    </Button>
                </div>
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
