import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import ApiClient from 'src/utilities/ApiClient';
import {Button, Loader, Icon, Text, Link, Popover, Tooltip} from '@gravity-ui/uikit';
import {Star, PencilToLine, LogoTelegram} from '@gravity-ui/icons';
import {renderAsDate} from 'src/utilities/getRoundValue';
import {TagsFilterModal} from './TagsFilterModal';
import {AnswerFeedbackModal} from './AnswerFeedbackModal';
import {useError} from 'src/pages/ErrorContext';
import callApi from 'src/utilities/callApi';

export const BuyersFeedbacksPage = ({
    permission,
    selectValue,
    sellerId,
    isAnswered,
}: {
    permission: string;
    selectValue: string[];
    sellerId: string;
    isAnswered: string;
}) => {
    const {showError} = useError();
    const [filters, setFilters] = useState({});
    const [data, setData] = useState(null as any);
    const [filteredData, setFilteredData] = useState([] as any[]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pending, setPending] = useState(false);
    const [productValuations, setProductValuations] = useState([]);
    const [feedbackValuations, setFeedbackValuations] = useState([]);
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
                fv.push({value: val._id, content: val.reason});
            }
            const pv = [{value: 0, content: 'Без жалобы'}];
            for (const val of productValuation) {
                pv.push({value: val._id, content: val.reason});
            }

            setFeedbackValuations(fv as React.SetStateAction<never[]>);
            setProductValuations(pv as React.SetStateAction<never[]>);
            console.log('valuations', feedbackValuations, productValuations);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getValuation();
    }, [sellerId]);
    const getFeedbacks = async () => {
        try {
            const params = {seller_id: sellerId, isAnswered};
            const response = await ApiClient.post('buyers/get-feedbacks', params);
            if (response?.status != 200) {
                throw new Error('Не получилось достать отзывы ');
            }
            setData(response.data);
            setPending(false);
        } catch (error) {
            console.error(error);
            showError('Не удалось получить информвцию oб отзывах');
        }
    };
    useEffect(() => {
        setPending(true);
        getFeedbacks();
    }, [selectValue, isAnswered]);

    const [artsTags, setArtsTags] = useState({});

    const [artsData, setArtsData] = useState({});
    const getArtsData = async () => {
        if (sellerId == '') setArtsData({});
        const params = {seller_id: sellerId, key: 'byNmId'};
        const artsDataTemp = await callApi('getArtsData', params).catch((e) => {
            console.log(e);
        });
        console.log('getArtsData', params, artsDataTemp);
        if (artsDataTemp && artsDataTemp['data']) setArtsData(artsDataTemp['data']);
        else setArtsData({});
    };
    const getArtsTags = async () => {
        if (sellerId == '') setArtsTags({});
        const params = {seller_id: sellerId};
        const artsTagsTemp = await callApi('getArtsTags', params).catch((e) => {
            console.log(e);
        });
        console.log('getArtsTags', params, artsTagsTemp);
        if (artsTagsTemp && artsTagsTemp['data']) setArtsTags(artsTagsTemp['data']);
        else setArtsTags({});
    };
    useEffect(() => {
        getArtsData();
        getArtsTags();
    }, [sellerId]);

    const filterData = (withfFilters = {}, tableData = {}) => {
        const temp = [] as any;

        const tempObj = Object.keys(tableData).length ? tableData : data;
        if (tempObj)
            for (const [phrase, phraseInfo] of Object.entries(tempObj)) {
                if (!phrase || !phraseInfo) continue;

                const tempTypeRow = phraseInfo;

                let addFlag = true;
                const useFilters = withfFilters['undef'] ? withfFilters : filters;
                for (const [filterArg, filterData] of Object.entries(useFilters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;

                    if (filterArg == 'nmId') {
                        const rulesForAnd = filterData['val'].split('+');
                        // console.log(rulesForAnd);
                        const nmId = tempTypeRow['nmId'];
                        let wholeText = '';
                        const artData = artsData[nmId];
                        if (artData)
                            for (const key of [
                                'art',
                                'title',
                                'brand',
                                'nmId',
                                'imtId',
                                'object',
                            ]) {
                                wholeText += artData[key] + ' ';
                            }

                        const tags = artsTags[nmId];
                        if (tags) {
                            for (const key of tags) {
                                wholeText += key + ' ';
                            }
                        }

                        let tempFlagInc = 0;
                        for (let k = 0; k < rulesForAnd.length; k++) {
                            const ruleForAdd = rulesForAnd[k];
                            if (ruleForAdd == '') {
                                tempFlagInc++;
                                continue;
                            }
                            if (
                                compare(wholeText, {
                                    val: ruleForAdd,
                                    compMode: filterData['compMode'],
                                })
                            ) {
                                tempFlagInc++;
                            }
                        }
                        if (tempFlagInc != rulesForAnd.length) {
                            addFlag = false;
                            continue;
                        }
                    } else if (!compare(tempTypeRow[filterArg], filterData)) {
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

    const filterByButton = (val, key = 'nmId', compMode = 'include') => {
        filters[key] = {val: String(val) + ' ', compMode: compMode};
        setFilters({...filters});
        filterData(filters);
    };

    useEffect(() => {
        if (!data) return;
        filterData();
    }, [data]);

    const columns = [
        {
            valueType: 'text',
            name: 'nmId',
            placeholder: 'Артикул',
            width: 200,
            render: ({value, footer, index}) => {
                const {title, brand, object, photos, imtId, art} = artsData[value] ?? {};
                const nmId = value;
                const tags = artsTags[nmId] ?? [];

                if (title === undefined) return <div style={{height: 28}}>{value}</div>;

                const imgUrl = photos ? (photos[0] ? photos[0].big : undefined) : undefined;

                let titleWrapped = title;
                if (title.length > 30) {
                    let wrapped = false;
                    titleWrapped = '';
                    const titleArr = title.split(' ');
                    for (const word of titleArr) {
                        titleWrapped += word;
                        if (titleWrapped.length > 25 && !wrapped) {
                            titleWrapped += '\n';
                            wrapped = true;
                        } else {
                            titleWrapped += ' ';
                        }
                    }
                }

                /// tags
                const tagsNodes = [] as any[];

                if (tags) {
                    for (let i = 0; i < tags.length; i++) {
                        const tag = tags[i];
                        if (!tag) continue;

                        tagsNodes.push(
                            <Button
                                size="xs"
                                pin="circle-circle"
                                selected
                                view="outlined-info"
                                onClick={() => filterByButton(tag.toUpperCase())}
                            >
                                {tag.toUpperCase()}
                            </Button>,
                        );
                        tagsNodes.push(<div style={{minWidth: 8}} />);
                    }
                    tagsNodes.pop();
                }

                return footer ? (
                    <div style={{height: 28}}>{value}</div>
                ) : (
                    <div
                        // title={value}
                        style={{
                            maxWidth: '20vw',
                            display: 'flex',
                            flexDirection: 'row',
                            zIndex: 40,
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row',
                                marginRight: 8,
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: `${String(filteredData.length).length * 6}px`,
                                    // width: 20,
                                    margin: '0 16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {Math.floor((currentPage - 1) * 100 + index + 1)}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Popover
                                        behavior={'delayed' as any}
                                        disabled={value === undefined}
                                        content={
                                            <div style={{width: 200}}>
                                                <img
                                                    style={{width: '100%', height: 'auto'}}
                                                    src={imgUrl}
                                                />
                                                <></>
                                            </div>
                                        }
                                    >
                                        <div style={{width: 40}}>
                                            <img
                                                style={{width: '100%', height: 'auto'}}
                                                src={imgUrl}
                                            />
                                        </div>
                                    </Popover>
                                </div>
                                <div style={{width: 4}} />
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{marginLeft: 6}}>
                                        <Link
                                            view="primary"
                                            style={{whiteSpace: 'pre-wrap'}}
                                            href={`https://www.wildberries.ru/catalog/${nmId}/detail.aspx?targetUrl=BP`}
                                            target="_blank"
                                        >
                                            <Text variant="subheader-1">{titleWrapped}</Text>
                                        </Link>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(object)}
                                        >
                                            <Text variant="caption-2">{`${object}`}</Text>
                                        </Button>
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(brand)}
                                        >
                                            <Text variant="caption-2">{`${brand}`}</Text>
                                        </Button>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(nmId)}
                                        >
                                            <Text variant="caption-2">{`Артикул WB: ${nmId}`}</Text>
                                        </Button>
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(imtId)}
                                        >
                                            <Text variant="caption-2">{`ID КТ: ${imtId}`}</Text>
                                        </Button>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            size="xs"
                                            view="flat"
                                            onClick={() => filterByButton(art)}
                                        >
                                            <Text variant="caption-2">{`Артикул: ${art}`}</Text>
                                        </Button>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            maxWidth: 'calc(20vw - 46px)',
                                            overflowX: 'scroll',
                                        }}
                                    >
                                        {tagsNodes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
            group: true,
        },

        {name: 'createdDate', placeholder: 'Дата', render: renderAsDate},
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
                    <Button view={color} selected pin="circle-circle">
                        {value}
                        <Icon data={Star} size={13} />
                    </Button>
                );
            },
        },
        {name: 'userName', placeholder: 'Имя', valueType: 'text'},
        {
            valueType: 'text',
            name: 'pros',
            placeholder: 'Достоинства',
            render: ({value}) => {
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value}</Text>
                    </div>
                );
            },
        },

        {
            valueType: 'text',
            name: 'cons',
            placeholder: 'Недостатки',
            render: ({value}) => {
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value}</Text>
                    </div>
                );
            },
        },
        {
            valueType: 'text',
            name: 'text',
            placeholder: 'Комментарий',
            render: ({value}) => {
                return (
                    <div style={{textWrap: 'wrap'}}>
                        <Text>{value}</Text>
                    </div>
                );
            },
        },

        {
            valueType: 'text',
            name: 'answer',
            placeholder: 'Ответ',
            render:
                isAnswered == 'answered'
                    ? ({value}) => {
                          const {text} = value ?? {};
                          return (
                              <div style={{textWrap: 'wrap'}}>
                                  <Text>{text}</Text>
                              </div>
                          );
                      }
                    : ({row}) => {
                          const {pros, cons, text, id} = row;
                          const all = pros + cons + text;
                          if (all == '') return undefined;
                          return (
                              <AnswerFeedbackModal sellerId={sellerId} id={id} setData={setData}>
                                  <Button
                                      width="max"
                                      pin="circle-circle"
                                      disabled={permission != 'Управление'}
                                  >
                                      <Icon data={PencilToLine} size={13} />
                                      Ответить
                                  </Button>
                              </AnswerFeedbackModal>
                          );
                      },
        },
    ];

    return data && !pending ? (
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
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: -44,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <TagsFilterModal filterByButton={filterByButton} />
                <Tooltip content="Телеграмм бот для ответов на вопросы покупателей">
                    <Button
                        style={{cursor: 'pointer', marginLeft: '8px'}}
                        view="action"
                        size="l"
                        href={'https://t.me/AurumBuyersQuestionsBot'}
                        target={'_blank'}
                    >
                        <Icon data={LogoTelegram} />
                        <Text variant="subheader-1">Телеграмм бот</Text>
                    </Button>
                </Tooltip>
            </div>
            <TheTable
                columnData={columns}
                data={filteredData}
                filters={filters}
                setFilters={setFilters}
                filterData={filterData}
                tableId={'buyersFeedbacks'}
                usePagination={true}
                defaultPaginationSize={100}
                onPaginationUpdate={({page}) => setCurrentPage(page)}
                height={'calc(100vh - 10em - 52px)'}
            />
        </div>
    ) : (
        <Loader size="l" />
    );
};
