'use client';

import {useEffect, useState} from 'react';
import TheTable, {compare} from '@/components/TheTable';
import callApi, {getUid} from '@/utilities/callApi';

import {Button, Text, Icon, ActionTooltip} from '@gravity-ui/uikit';
import {Pencil, Xmark, Plus, StarFill} from '@gravity-ui/icons';
import {AutoFeedbackTemplateCreationModal} from './AutoFeedbackTemplateCreationModal';
import ApiClient from '@/utilities/ApiClient';
import {LogoLoad} from '@/components/logoLoad';

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

    const filterData = (withfFilters: any = {}, tableData: any = {}) => {
        const temp = [] as any;

        for (const [phrase, phraseInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            if (!phrase || !phraseInfo) continue;

            const tempTypeRow: any = phraseInfo;

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
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
    useEffect(() => {
        getValuation();
    }, []);

    const [artsData, setArtsData] = useState({});
    const getArtsData = async () => {
        if (sellerId == '') return;
        const params = {seller_id: sellerId, key: 'byNmId'};
        const artsDataTemp = await callApi('getArtsData', params).catch((e) => {
            console.log(e);
        });
        console.log('getArtsData', params, artsDataTemp);
        if (artsDataTemp && artsDataTemp['data']) setArtsData(artsDataTemp['data']);
        else setArtsData({});
    };
    useEffect(() => {
        getArtsData();
    }, [sellerId]);

    const columns = [
        {
            name: 'name',
            valueType: 'text',
            placeholder: 'Название',
            render: ({value, row}: any) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <ActionTooltip title={value}>
                            <Text style={{maxWidth: 300}} ellipsis>
                                {value}
                            </Text>
                        </ActionTooltip>
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
                                feedbackValuations={feedbackValuations}
                                artsData={artsData}
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
        {
            valueType: 'text',
            name: 'bindingKeys',
            placeholder: 'Привязка',
            render: ({value}: any) => {
                if (!value) return undefined;
                return (
                    <ActionTooltip title={value?.join(', ')}>
                        <Text
                            style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 5, // Adjust based on maxHeight and line-height
                                maxHeight: 150,
                                whiteSpace: 'normal', // ensures wrapping
                            }}
                        >
                            {value?.join(', ')}
                        </Text>
                    </ActionTooltip>
                );
            },
        },
        {
            name: 'productValuation',
            placeholder: 'Оценка',
            render: ({row}: any) => {
                const {ratings} = row;
                if (ratings.length == 0 || ratings.length[0] == 0) return undefined;
                else {
                    const stars = ratings.map((rating: number) => {
                        const color =
                            rating > 3
                                ? 'outlined-success'
                                : rating == 3
                                  ? 'outlined-warning'
                                  : 'outlined-danger';
                        return (
                            <Button
                                style={{width: 45}}
                                size="s"
                                view={color}
                                selected
                                pin="circle-circle"
                            >
                                {rating}
                                <Icon data={StarFill} size={12} />
                            </Button>
                        );
                    });
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 4,
                            }}
                        >
                            {stars}
                        </div>
                    );
                }
            },
        },
        {
            valueType: 'text',
            name: 'text',
            placeholder: 'Шаблон ответа',
            render: ({value}: any) => {
                return (
                    <ActionTooltip title={value}>
                        <Text
                            style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 5, // Adjust based on maxHeight and line-height
                                maxHeight: 150,
                                whiteSpace: 'normal', // ensures wrapping
                                wordBreak: 'break-word', // optional: breaks long words if needed
                            }}
                        >
                            {value}
                        </Text>
                    </ActionTooltip>
                );
            },
        },
        {
            valueType: 'text',
            name: 'contains',
            placeholder: 'Ключевые слова',
            render: ({value}: any) => {
                if (!value) return undefined;
                return (
                    <ActionTooltip title={value?.join(', ')}>
                        <Text
                            style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minWidth: 250,
                                WebkitLineClamp: 5, // Adjust based on maxHeight and line-height
                                maxHeight: 150,
                                whiteSpace: 'normal', // ensures wrapping
                                wordBreak: 'break-word', // optional: breaks long words if needed
                            }}
                        >
                            {value?.join(', ')}
                        </Text>
                    </ActionTooltip>
                );
            },
        },
        {
            valueType: 'text',
            name: 'doNotContain',
            placeholder: 'Минус слова',
            render: ({value}: any) => {
                if (!value) return undefined;
                return (
                    <ActionTooltip title={value?.join(', ')}>
                        <Text
                            style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 5, // Adjust based on maxHeight and line-height
                                maxHeight: 150,
                                whiteSpace: 'normal', // ensures wrapping
                                wordBreak: 'break-word', // optional: breaks long words if needed
                            }}
                        >
                            {value?.join(', ')}
                        </Text>
                    </ActionTooltip>
                );
            },
        },
        {
            valueType: 'text',
            name: 'valuations',
            placeholder: 'Жалобы',
            render: ({row}: any) => {
                const {supplierFeedbackValuation, supplierProductValuation} = row;
                const vals: React.JSX.Element[] = [];
                if (
                    supplierFeedbackValuation &&
                    feedbackValuations[supplierFeedbackValuation + 1]
                ) {
                    vals.push(
                        <Button size="s" selected pin="circle-circle" view="outlined-danger">
                            {`${feedbackValuations[supplierFeedbackValuation + 1]?.['content']}`}
                        </Button>,
                    );
                }
                if (supplierProductValuation && productValuations[supplierProductValuation + 1]) {
                    vals.push(
                        <Button
                            size="s"
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
                    feedbackValuations={feedbackValuations}
                    sellerId={sellerId}
                    setRefetch={setRefetch}
                    artsData={artsData}
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
        <LogoLoad />
        // <Loader size="l" />
    );
};
