import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import callApi, {getUid} from 'src/utilities/callApi';
import {Button, Loader, Text, Icon} from '@gravity-ui/uikit';
import {Pencil, Xmark, Plus} from '@gravity-ui/icons';
import {AutoFeedbackTemplateCreationModal} from './AutoFeedbackTemplateCreationModal';

export const AutoFeedbackAnsweringPage = ({
    sellerId,
    selectValue,
}: {
    sellerId: string;
    selectValue: string[];
}) => {
    const [filters, setFilters] = useState({});
    const [data, setData] = useState(null as any);
    const [filteredData, setFilteredData] = useState([] as any[]);
    const [refetch, setRefetch] = useState(false);

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

    const columns = [
        {
            name: 'name',
            placeholder: 'Название',
            render: ({value, row}) => {
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
                            <AutoFeedbackTemplateCreationModal
                                sellerId={sellerId}
                                selectValue={selectValue}
                                setRefetch={setRefetch}
                                templateValues={row}
                            >
                                <Button size="xs">
                                    <Icon data={Pencil} />
                                </Button>
                            </AutoFeedbackTemplateCreationModal>
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
        {
            name: 'doNotContain',
            placeholder: 'Минус слова',
            render: ({value}) => {
                if (!value) return undefined;
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value.join(', ')}</Text>
                    </div>
                );
            },
        },
        {
            name: 'contains',
            placeholder: 'Ключевые слова',
            render: ({value}) => {
                if (!value) return undefined;
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value.join(', ')}</Text>
                    </div>
                );
            },
        },
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
                position: 'relative',
            }}
        >
            <div style={{position: 'absolute', left: 0, top: -44}}>
                <AutoFeedbackTemplateCreationModal
                    sellerId={sellerId}
                    selectValue={selectValue}
                    setRefetch={setRefetch}
                >
                    <Button size="l" view="action">
                        <Icon data={Plus} />
                        <Text variant="subheader-1">Добавить шаблон</Text>
                    </Button>
                </AutoFeedbackTemplateCreationModal>
            </div>
            <TheTable
                emptyDataMessage="У вас еще нет сохраненных шаблонов."
                columnData={columns}
                data={filteredData}
                filters={filters}
                setFilters={setFilters}
                filterData={filterData}
                tableId={'feedbacksAnswersTemplates'}
                usePagination={true}
                defaultPaginationSize={100}
                height={'calc(100vh - 10em - 52px)'}
            />
        </div>
    ) : (
        <Loader size="l" />
    );
};
