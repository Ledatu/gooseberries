import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import callApi, {getUid} from 'src/utilities/callApi';

import {Button, Loader, Text, Icon} from '@gravity-ui/uikit';
import {Pencil, Xmark, Plus, StarFill} from '@gravity-ui/icons';
import {AutoFeedbackTemplateCreationModal} from './AutoFeedbackTemplateCreationModal';
import ApiClient from 'src/utilities/ApiClient';

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
    const [productValuations, setProductValuations] = useState([] as any);
    const [feedbackValuations, setFeedbackValuations] = useState([] as any);
    const getAutoFeedbackTemplates = async () => {
        try {
            const params = {seller_id: sellerId};
            const response = await ApiClient.post('buyers/getAutoFeedbackTemplates', params);
            if (!response?.data) {
                throw new Error(`Cant get valuations for campaign ${sellerId}`);
            }
            console.log('lfksjlkdjadjad', response.data);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getAutoFeedbackTemplates();
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

    const getValuation = async () => {
        try {
            const params = {seller_id: sellerId};
            const response = await ApiClient.post(
                'buyers/get-feedback-and-product-valuation',
                params,
            );
            if (!response?.data) {
                throw new Error(`Cant get valuations for campaign ${sellerId}`);
            }
            const valuations = response?.data?.valuations;
            const {feedbackValuation, productValuation} = valuations;
            const fv = [{value: 0, content: 'Без жалобы'}];
            for (const val of feedbackValuation) {
                fv.push({value: val.id, content: val.reason});
            }
            const pv = [{value: 0, content: 'Без жалобы'}];
            for (const val of productValuation) {
                pv.push({value: val.id, content: val.reason});
            }
            setFeedbackValuations(fv);
            setProductValuations(pv);
            console.log('valuations', feedbackValuations, productValuations);
        } catch (error) {
            console.error(error);
        }
    };
    useState(() => {
        getValuation();
    });
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
        {
            name: 'valuations',
            placeholder: 'Жалобы',
            render: ({row}) => {
                const {supplierFeedbackValuation, supplierProductValuation} = row;
                const vals: React.JSX.Element[] = [];
                if (
                    supplierFeedbackValuation &&
                    feedbackValuations[supplierFeedbackValuation + 1]
                ) {
                    vals.push(
                        <Button size="xs" selected pin="circle-circle" view="outlined-danger">
                            {`${feedbackValuations[supplierFeedbackValuation + 1]?.['content']}`}
                        </Button>,
                    );
                }
                if (supplierProductValuation && productValuations[supplierProductValuation + 1]) {
                    vals.push(
                        <Button
                            size="xs"
                            selected
                            pin="circle-circle"
                            style={{marginLeft: 4}}
                            view="outlined-danger"
                        >
                            {`${productValuations[supplierProductValuation + 1]?.['content']}`}
                        </Button>,
                    );
                    console.log(
                        productValuations[supplierProductValuation + 1],
                        feedbackValuations[supplierFeedbackValuation + 1],
                    );
                }
                return <div style={{display: 'block', wordWrap: 'break-word'}}>{vals}</div>;
            },
        },
        // {name: 'feedbackAge', placeholder: 'Возраст отзыва'},
        // {name: 'feedbackLength', placeholder: 'Длина отзыва'},
        {
            name: 'productValuation',
            placeholder: 'Оценка',
            render: ({row}) => {
                const {ratings} = row;
                if (ratings.length == 0 || ratings.length[0] == 0) return undefined;
                else {
                    const stars = ratings.map((rating) => {
                        const color =
                            rating > 3
                                ? 'outlined-success'
                                : rating == 3
                                ? 'outlined-warning'
                                : 'outlined-danger';
                        return (
                            <Button
                                view={color}
                                selected
                                pin="circle-circle"
                                style={{margin: '4px'}}
                            >
                                {rating}
                                <Icon data={StarFill} size={13} />
                            </Button>
                        );
                    });
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            {stars}
                        </div>
                    );
                }
                // if (!ratingFrom || !ratingTo) return undefined;
                // return (
                //     <Button size="xs" selected pin="circle-circle">
                //         {`${ratingFrom} - ${ratingTo}`}
                //     </Button>
                // );
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
                <AutoFeedbackTemplateCreationModal sellerId={sellerId} setRefetch={setRefetch}>
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
