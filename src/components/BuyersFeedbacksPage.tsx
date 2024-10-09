import React, {useEffect, useState} from 'react';
import TheTable, {compare} from './TheTable';
import callApi, {getUid} from 'src/utilities/callApi';
import {Button, Loader, Pagination, Icon, Card, Text, Link, Popover} from '@gravity-ui/uikit';
import {Star, PencilToLine} from '@gravity-ui/icons';
import {renderAsDate} from 'src/utilities/getRoundValue';
import {TagsFilterModal} from './TagsFilterModal';
import {AnswerFeedbackModal} from './AnswerFeedbackModal';

export const BuyersFeedbacksPage = ({
    selectValue,
    sellerId,
    isAnswered,
}: {
    selectValue: string[];
    sellerId: string;
    isAnswered: string;
}) => {
    const [filters, setFilters] = useState({});
    const [data, setData] = useState(null as any);
    const [filteredData, setFilteredData] = useState([] as any[]);
    const paginationSize = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([] as any[]);

    const [pending, setPending] = useState(false);

    useEffect(() => {
        const params = {uid: getUid(), campaignName: selectValue[0], isAnswered};
        console.log('getFeedbacks', params);

        setPending(true);
        callApi('getFeedbacks', params)
            .then((res) => {
                if (!res || !res.data) return;
                console.log(res);
                setData(res.data);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setPending(false);
            });
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
        setFilters(filters);
        filterData(filters);
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
                        if (tag === undefined) continue;

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
                                  <Button width="max" pin="circle-circle">
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
            <div style={{position: 'absolute', left: 0, top: -44}}>
                <TagsFilterModal filterByButton={filterByButton} selectValue={selectValue} />
            </div>
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
