'use client';
import {useEffect, useMemo, useState} from 'react';
import {Spin, Icon, Button, Loader, Text, Tooltip} from '@gravity-ui/uikit';
import '@gravity-ui/react-data-table/build/esm/lib/DataTable.scss';
import {Pencil, Plus, Calendar} from '@gravity-ui/icons';
import TheTable, {compare} from '@/components/TheTable';
import {useCampaign} from '@/contexts/CampaignContext';
import {motion} from 'framer-motion';
import ApiClient from '@/utilities/ApiClient';
import {useError} from '@/contexts/ErrorContext';
import {EditMemberInfo, UserInfo} from './UserInfo';
import {AddMemberModal} from './AddMemberModal';
import {defaultRender, getRoundValue, renderAsPercent} from '@/utilities/getRoundValue';
import {useUser} from '@/components/RequireAuth';
import {EditSubscription} from './EditSubscription';
import {ChangeApiModal} from './ChangeApiModal';
import {SetSubscriptionExpDateModal} from './SetSubscriptionExpDateModal';
import {AddApiModal} from './AddApiModal';

interface IRender {
    value?: any;
    footer?: boolean;
    row?: any;
    index?: number;
}

export const ApiPage = () => {
    const {setSwitchingCampaignsFlag, switchingCampaignsFlag, sellerId, setSellerId} =
        useCampaign();
    const {showError} = useError();
    const [filters, setFilters] = useState<any>({undef: false});

    const {userInfo} = useUser();
    const {user} = userInfo ?? {};

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const getNomenclatures = async () => {
        try {
            const params = {seller_id: sellerId};

            console.log(params);

            const response = await ApiClient.post('campaigns/get', params, 'json', true);
            console.log(response?.data);

            if (response && response.data) {
                setData(response.data);
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error(error);
            showError('Возникла ошибка.');
        }
    };

    useEffect(() => {
        setSwitchingCampaignsFlag(true);
        getNomenclatures().finally(() => setSwitchingCampaignsFlag(false));
    }, [sellerId]);

    const [update, setUpdate] = useState(false);
    useEffect(() => {
        if (!update) return;
        getNomenclatures().finally(() => setUpdate(false));
    }, [update]);

    const [addedMember, setAddedMember] = useState({});
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(50);

    const generateEditButton = (key: any, onClick = undefined as any) => {
        const triggerButton = (
            <Button
                style={{marginLeft: 5}}
                view="outlined"
                onClick={(event) => {
                    if (onClick) onClick(event);
                    else {
                        event.stopPropagation();
                    }
                }}
            >
                <Icon data={Pencil} />
            </Button>
        );
        return onClick ? (
            triggerButton
        ) : (
            <EditSubscription
                setUpdate={setUpdate}
                filteredData={filteredData}
                enteredValueKey={key}
            >
                {triggerButton}
            </EditSubscription>
        );
    };

    const admin = useMemo(() => [1122958293, 933839157].includes(user?._id), [user]);
    const columnData = useMemo(
        () =>
            [
                {
                    name: 'name',
                    placeholder: 'Магазин',
                    valueType: 'text',
                    render: ({value, row, footer, index}: IRender) => {
                        if (footer) return value;

                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text>{(index ?? 0) + 1 + (page - 1) * (pagination ?? 50)}</Text>
                                <Text
                                    variant="subheader-2"
                                    style={{
                                        cursor: 'pointer',
                                        maxWidth: '20vw',
                                        overflow: 'hidden',
                                    }}
                                    onClick={() => setSellerId(row?.seller_id)}
                                >
                                    {value}
                                </Text>
                            </div>
                        );
                    },
                },
                {
                    name: 'subscriptionUntil',
                    placeholder: 'Подписка до',
                    render: ({value, row, footer}: IRender) => {
                        if (footer) return undefined;
                        const date = new Date(value).toLocaleDateString('ru-RU').slice(0, 10);
                        const expired =
                            new Date(value).getTime() - new Date().getTime() < 86400 * 7 * 1000;
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text variant="subheader-2" color={expired ? 'danger' : undefined}>
                                    {date == '01.01.2100' ? 'Бессрочная подписка' : date}
                                </Text>
                                {admin ? (
                                    <SetSubscriptionExpDateModal
                                        setUpdate={setUpdate}
                                        campaignName={row?.name}
                                        sellerId={row?.seller_id}
                                    >
                                        <Button
                                            style={{marginLeft: 4}}
                                            view="flat"
                                            pin="circle-circle"
                                        >
                                            <Icon data={Calendar} size={13} />
                                        </Button>
                                    </SetSubscriptionExpDateModal>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    },
                },
                {
                    name: 'ownerDetails',
                    wmaxWidth: 300,
                    placeholder: 'Владелец',
                    valueType: 'text',
                    render: ({value, footer}: IRender) => {
                        if (footer) return undefined;
                        return (
                            <div
                                style={{
                                    width: 'fit-content',
                                    maxWidth: 300,
                                    overflow: 'hidden',
                                    display: 'flex',
                                }}
                            >
                                <UserInfo user={value} view="outlined" />
                            </div>
                        );
                    },
                },
                {
                    name: 'members',
                    placeholder: 'Сотрудники',
                    valueType: 'text',
                    render: ({value, row, footer}: IRender) => {
                        if (footer || !row?.isOwner) return undefined;
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    maxWidth: 600,
                                    flexWrap: 'wrap',
                                    gap: 8,
                                }}
                            >
                                <AddMemberModal
                                    setUpdate={setUpdate}
                                    sellerId={row?.seller_id}
                                    addedMember={addedMember}
                                    setAddedMember={setAddedMember}
                                >
                                    <Button view="flat" pin="circle-circle" size="l">
                                        <Icon data={Plus} />
                                        <Text variant="subheader-1">Добавить</Text>
                                    </Button>
                                </AddMemberModal>
                                {value.map((member: any) => (
                                    <EditMemberInfo
                                        user={member}
                                        sellerId={row?.seller_id}
                                        setUpdate={setUpdate}
                                    />
                                ))}
                            </div>
                        );
                    },
                },
                {
                    name: 'price',
                    placeholder: 'Тариф',
                    render: ({value, row, footer}: IRender) => {
                        if (footer)
                            return `${defaultRender({value: Math.round(value)})} ₽ / ${defaultRender({value: getRoundValue(value, filteredData.length)})} ₽`;
                        if (isNaN(value)) return 'Тариф будет рассчитан в ближайшее время';
                        const {fixedTarif, saleRubles, salePercent} = row ?? {};
                        if (fixedTarif)
                            return (
                                <Tooltip content="Фикс тариф. Нажмите, чтобы скопировать">
                                    <Text
                                        color="primary"
                                        variant="subheader-2"
                                        className="g-link g-link_view_primary"
                                        onClick={() => {
                                            navigator.clipboard.writeText(value);
                                        }}
                                    >
                                        Фикс. тариф: {defaultRender({value})} ₽
                                    </Text>
                                </Tooltip>
                            );

                        const base = 5990;
                        const art = 59;
                        const artCount =
                            ((value + (saleRubles ?? 0)) / (1 - (salePercent ?? 0) / 100) - base) /
                            art;
                        const summary = Math.round(base + art * artCount);
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Tooltip content="База">
                                        <Text
                                            color="primary"
                                            variant="subheader-2"
                                            className="g-link g-link_view_primary"
                                        >
                                            {defaultRender({value: base})}
                                        </Text>
                                    </Tooltip>
                                    <div style={{margin: '0px 8px'}}>+</div>
                                    <Tooltip content="Стоимость 1 артикула">
                                        <Text
                                            color="primary"
                                            variant="subheader-2"
                                            className="g-link g-link_view_primary"
                                        >
                                            {defaultRender({value: art})}
                                        </Text>
                                    </Tooltip>
                                    <div style={{margin: '0px 8px'}}>*</div>
                                    <Tooltip content="Количество артикулов с 1 и более заказами за последние 30 дней">
                                        <Text
                                            color="primary"
                                            variant="subheader-2"
                                            className="g-link g-link_view_primary"
                                        >
                                            {defaultRender({value: artCount})}
                                        </Text>
                                    </Tooltip>
                                    <div style={{margin: '0px 8px'}}>=</div>
                                    <Tooltip content="Итог. Нажмите, чтобы скопировать">
                                        <Text
                                            color="primary"
                                            variant="subheader-2"
                                            className="g-link g-link_view_primary"
                                            onClick={() => {
                                                navigator.clipboard.writeText(value);
                                            }}
                                        >
                                            {defaultRender({value: summary})}
                                        </Text>
                                    </Tooltip>
                                    <div style={{margin: '0px 8px'}}>₽</div>
                                </div>
                                {salePercent ? (
                                    <Text color="primary" variant="subheader-2">
                                        Скидка % {salePercent}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {saleRubles ? (
                                    <Text color="primary" variant="subheader-2">
                                        Скидка ₽ {saleRubles}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {salePercent || saleRubles ? (
                                    <Text color="primary" variant="subheader-2">
                                        Итог со скидкой: {defaultRender({value: Math.round(value)})}{' '}
                                        ₽
                                    </Text>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    },
                },
                {
                    name: 'apiKeyExpDate',
                    placeholder: 'API до',
                    valueType: 'text',
                    render: ({value, footer}: IRender) => {
                        if (footer) return undefined;
                        const date = new Date(value).toLocaleDateString('ru-RU').slice(0, 10);
                        const expired =
                            new Date(value).getTime() - new Date().getTime() < 86400 * 30 * 1000;
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text variant="subheader-2">{date}</Text>
                                <ChangeApiModal sellerId={sellerId}>
                                    <Button
                                        selected={expired}
                                        view={expired ? 'outlined-danger' : 'outlined'}
                                        pin="circle-circle"
                                        size="s"
                                    >
                                        <Icon data={Pencil} />
                                        <Text variant="subheader-1">API Токен</Text>
                                    </Button>
                                </ChangeApiModal>
                            </div>
                        );
                    },
                },
            ].concat(
                admin
                    ? ([
                          {
                              name: 'salePercent',
                              placeholder: 'Скидка %',
                              render: renderAsPercent,
                              additionalNodes: [generateEditButton('salePercent')],
                          },
                          {
                              name: 'saleRubles',
                              placeholder: 'Скидка ₽',
                              additionalNodes: [generateEditButton('saleRubles')],
                          },
                          {
                              name: 'fixedTarif',
                              placeholder: 'Фикс. тариф',
                              additionalNodes: [generateEditButton('fixedTarif')],
                          },
                          {
                              name: 'comment',
                              placeholder: 'Комментарий',
                              valueType: 'text',
                              additionalNodes: [generateEditButton('comment')],
                          },
                      ] as any[])
                    : [],
            ),
        [filteredData, data, pagination, page],
    );

    const [filteredSummary, setFilteredSummary] = useState({});

    const filterTableData = (withfFilters: any = {}, tableData: any = []) => {
        const temp = [] as any;

        for (const [art, artInfo] of Object.entries(tableData?.length ? tableData : data)) {
            if (!art || !artInfo) continue;

            const tempTypeRow: any = artInfo;

            let addFlag = true;
            const useFilters: any = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if ((filterData as any)['val'] == '') continue;

                const fldata = (filterData as any)['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (filterArg == 'ownerDetails') {
                    let wholeText = '';
                    for (const [_, val] of Object.entries(flarg)) {
                        wholeText += val;
                    }
                    if (!compare(wholeText, filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'ownerDetails') {
                    let wholeText = '';
                    for (const [_, val] of Object.entries(flarg)) {
                        wholeText += val;
                    }
                    if (!compare(wholeText, filterData)) {
                        addFlag = false;
                        break;
                    }
                } else if (filterArg == 'subscriptionUntil') {
                    const dateA = new Date(flarg); // Month is 0-based in JS

                    const [day, month, year] = fldata.split('.').map(Number);
                    let dateB = new Date(year, month - 1, day);

                    if ((filterData as any)?.['compMode'] == 'include') {
                        if (!compare(dateA.toLocaleDateString('ru-RU').slice(0, 10), filterData)) {
                            addFlag = false;
                            break;
                        }
                    } else if (
                        !dateB.getTime() ||
                        !compare(dateA.getTime(), {...filterData, val: dateB.getTime()})
                    ) {
                        addFlag = false;
                        break;
                    }
                } else if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) {
                const {fixedTarif, saleRubles, salePercent, price: curPrice} = tempTypeRow ?? {};

                const price =
                    fixedTarif ?? (curPrice - (saleRubles ?? 0)) * (1 - (salePercent ?? 0) / 100);

                temp.push({...tempTypeRow, price});
            }
        }

        temp.sort((a: any, b: any) => {
            return (
                new Date(b.subscriptionUntil).getTime() - new Date(a.subscriptionUntil).getTime()
            );
        });

        setPage(1);
        setFilteredData([...temp]);

        const filteredSummaryTemp = {
            price: temp.reduce(
                (sum: number, entry: any) => sum + (!isNaN(entry?.price) ? (entry?.price ?? 0) : 0),
                0,
            ),
            name: `На странице Магазинов: ${pagination} Всего Магазинов: ${filteredData.length}`,
        };
        console.log(filteredSummaryTemp);

        setFilteredSummary({...filteredSummaryTemp});
    };

    useEffect(() => {
        filterTableData();
    }, [data]);

    if (!data) return <Spin />;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: data?.length ? undefined : 'center',
                    flexWrap: 'wrap',
                    marginBottom: 8,
                    flexDirection: 'row',
                }}
            >
                {/* <Button
                    loading={update}
                    size="l"
                    view="action"
                    onClick={() => {
                        setUpdate(true);
                    }}
                >
                    <Icon data={ArrowsRotateLeft} />
                </Button>*/}
                <AddApiModal>
                    <Button
                        size="xl"
                        view="flat"
                        style={{
                            border: '1px solid var(--g-color-base-generic-hover)',
                            borderRadius: 30,
                            overflow: 'hidden',
                            backdropFilter: 'blur(20px)',
                            boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                        }}
                    >
                        <Text variant="subheader-1">Добавить магазин WB</Text>
                    </Button>
                </AddApiModal>
                <motion.div
                    style={{
                        overflow: 'hidden',
                        marginTop: 4,
                    }}
                    animate={{
                        maxWidth: update ? 40 : 0,
                        opacity: update ? 1 : 0,
                    }}
                >
                    <Spin style={{marginLeft: 8}} />
                </motion.div>{' '}
            </div>

            {switchingCampaignsFlag ? (
                <div
                    style={{
                        height: 'calc(100vh - 10em - 60px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Loader size="l" />
                </div>
            ) : data?.['length'] == 0 ? (
                <></>
            ) : (
                <TheTable
                    key={'campaignsTable'}
                    columnData={columnData}
                    data={filteredData}
                    filters={filters}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    footerData={[filteredSummary]}
                    tableId={'campaigns'}
                    usePagination={true}
                    defaultPaginationSize={50}
                    height={'calc(100vh - 10em - 60px)'}
                    onPaginationUpdate={({page, paginatedData, paginationSize}: any) => {
                        setPage(page);
                        setPagination(paginationSize);
                        setFilteredSummary((row) => {
                            const fstemp: any = row;
                            fstemp['name'] =
                                `На странице Магазинов: ${paginatedData.length} Всего Магазинов: ${filteredData.length}`;

                            return fstemp;
                        });
                    }}
                />
            )}
        </div>
    );
};
