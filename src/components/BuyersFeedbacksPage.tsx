import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import callApi, {getUid} from 'src/utilities/callApi';
import {Button, Loader, Pagination, Icon, TextArea, Text, Card} from '@gravity-ui/uikit';
import {Star} from '@gravity-ui/icons';
import {renderAsDate} from 'src/utilities/getRoundValue';
import {AnswerFeedbackModal} from './AnswerFeedbackModal';

export const BuyersFeedbacksPage = ({selectValue}: {selectValue: string[]}) => {
    const [filters, setFilters] = useState({});
    const [data, setData] = useState(null as any);
    const [filteredData, setFilteredData] = useState([] as any[]);
    const paginationSize = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([] as any[]);

    useEffect(() => {
        const params = {uid: getUid(), campaignName: selectValue[0]};
        console.log('getFeedbacks', params);

        callApi('getFeedbacks', params)
            .then((res) => {
                if (!res || !res.data) return;
                console.log(res);
                setData(res.data);
            })
            .catch((e) => {
                setData([
                    {
                        id: 'n5um6IUBQOOSTxXoo0gV',
                        imtId: 4702466,
                        nmId: 5870243,
                        subjectId: 390,
                        userName: 'userName',
                        text: 'Great product. Thank you',
                        productValuation: 5,
                        createdDate: '2023-01-25T11:18:33Z',
                        updatedDate: '2023-01-26T11:09:54Z',
                        answer: null,
                        state: 'none',
                        productDetails: {
                            imtId: 4702466,
                            nmId: 5870243,
                            productName: 'Case for phone',
                            supplierArticle: '41058/transparent',
                            supplierName: 'ГП Реклама и услуги',
                            brandName: '1000 Catalog',
                            size: 'size',
                        },
                        photoLinks: [
                            {
                                fullSize:
                                    'feedbacks/470/4702466/2dc59933-00b5-4ba5-a11a-96312ef179f1_fs.jpg',
                                miniSize:
                                    'feedbacks/470/4702466/2dc59933-00b5-4ba5-a11a-96312ef179f1_ms.jpg',
                            },
                        ],
                        video: null,
                        wasViewed: true,
                    },
                ]);
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
        // {name: 'id', placeholder: 'ID Отзыва'},
        {name: 'supplierArticle', placeholder: 'Артикул'},
        {name: 'brandName', placeholder: 'Бренд'},
        {name: 'size', placeholder: 'Размер'},
        {name: 'nmId', placeholder: 'Артикул WB', valueType: 'text'},
        {name: 'userName', placeholder: 'Имя'},
        {
            name: 'text',
            placeholder: 'Отзыв',
            render: ({value}) => {
                return <TextArea style={{width: 250}} size="s" value={value} maxRows={5} />;
            },
        },
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
        {name: 'createdDate', placeholder: 'Дата создания', render: renderAsDate},
        {name: 'updatedDate', placeholder: 'Дата изменения', render: renderAsDate},
        {
            name: 'answer',
            placeholder: 'Ответ',
            render: ({value, row}) => {
                const {id} = row;
                if (!value) return <AnswerFeedbackModal selectValue={selectValue} id={id} />;
                return value;
            },
        },
        {
            name: 'state',
            placeholder: 'Статус',
            render: ({value}) => {
                if (!value) return;
                const map = {
                    none: {
                        color: 'subheader-1',
                        text: 'Не обработан (новый)',
                    },
                    wbRu: {
                        color: undefined,
                        text: 'Обработан',
                    },
                };
                return (
                    <Button view={'flat'} size="xs">
                        <Text variant={map[value]?.color}>{map[value]?.text}</Text>
                    </Button>
                );
            },
        },
        {name: 'photoLinks', placeholder: 'Фото'},
        {name: 'video', placeholder: 'Видео'},
        {name: 'wasViewed', placeholder: 'Просмотрен ли отзыв'},
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
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 68px - 32px - 36px - 16px - 48px)',
                }}
            >
                <TheTable
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
