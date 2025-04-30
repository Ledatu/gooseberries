import TheTable, {compare} from '@/components/TheTable';
import {ClockArrowRotateLeft, Plus} from '@gravity-ui/icons';
import {ActionTooltip, Button, Card, Divider, Icon, Spin, Text} from '@gravity-ui/uikit';
import {useEffect, useMemo, useState} from 'react';
import {GetPayout} from './GetPayout';
import ApiClient from '@/utilities/ApiClient';
import {CopyButton} from '@/components/Buttons/CopyButton';
import {OperationHistory} from './OperationHistory';

interface IRender {
    value?: any;
    footer?: boolean;
    row?: any;
    index?: number;
}

interface Referral {
    clicks?: number;
    campaignsAdded?: number;
    user_id?: number;
    href?: string;
}

export interface Operation {
    user_id?: number;
    sum?: number;
    comment?: string;
    date?: Date;
}

const ReferralProgram = () => {
    return (
        <section className="max-w-2xl text-white text-sm leading-snug">
            <h2 className="text-xl font-semibold mb-2">Партнёрская программа AURUMSKYNET™</h2>
            <p className="mb-2">
                Приглашайте друзей и знакомых, делясь вашими уникальной{' '}
                <strong>реферальными ссылками</strong>, которые можно сгенерировать на этой
                странице.
            </p>
            <p className="mb-2">
                После добавлении магазина по вашей ссылке, в течение <strong>года</strong> с каждой
                оплаты приглашённого вы будете получать <strong>15%</strong>.
            </p>
            <p className="mb-2">
                Начисления накапливаются на вашем счёте. Вы можете{' '}
                <strong>запросить выплату</strong> в любой момент, когда средства станут доступны.
            </p>
            <p>Следите за статистикой в вашем личном кабинете.</p>
        </section>
    );
};

export const PartnerkaPage = () => {
    const [filters, setFilters] = useState({} as any);
    const [referrals, setReferrals] = useState([] as Referral[]);
    const [data, setData] = useState([] as any[]);
    const [filteredSummary, setFilteredSummary] = useState({} as any);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(100);
    const [filteredData, setFilteredData] = useState([] as any[]);

    const [operationHistory, setOperationHistory] = useState([] as any[]);
    const balance = useMemo(
        () => operationHistory.reduce((sum, entry) => (entry?.sum ?? 0) + sum, 0),
        [operationHistory],
    );

    const [updateFlag, setUpdateFlag] = useState(true);
    const fetchData = async () => {
        try {
            setData([]);
        } catch (error) {
            console.error(new Date(), error);
        }
    };

    const fetchReferrals = async () => {
        try {
            const response = await ApiClient.post('auth/get-referral', {});
            if (!response || !response.data) throw new Error('No data');
            setReferrals(response?.data?.referral);
        } catch (error) {
            console.error(new Date(), error);
        }
    };

    const createReferral = async () => {
        if (referrals.length >= 4) return;
        try {
            const response = await ApiClient.post('auth/create-referral', {});
            if (!response || !response.data) throw new Error('No data');
            setReferrals(response?.data?.referral);
        } catch (error) {
            console.error(new Date(), error);
        }
    };

    const fetchOperationHistory = async () => {
        try {
            const response = await ApiClient.post(
                'massAdvert/new/get-referal-operation-history',
                {},
            );
            if (!response || !response.data) throw new Error('No data');
            setOperationHistory(response?.data);
        } catch (error) {
            console.error(new Date(), error);
        }
    };

    useEffect(() => {
        if (!updateFlag) return;
        fetchData();
        fetchReferrals();
        fetchOperationHistory();
        setUpdateFlag(false);
    }, [updateFlag]);

    const columnData: any[] = [
        {
            name: 'name',
            placeholder: 'Название',
            valueType: 'text',
            render: ({value, footer, index}: IRender) => {
                if (footer) return value;
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            gap: 8,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                            }}
                        >
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
                                        maxWidth: '50vw',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {value}
                                </Text>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'subscriptionUntil',
            placeholder: 'Подписка оплачена до',
        },
        {
            name: 'createdAt',
            placeholder: 'Дата добавления',
        },
        {
            name: 'refEndDate',
            placeholder: 'Дата окончания начислений',
        },
        {
            name: 'price',
            placeholder: 'Тариф',
        },
        {
            name: 'refPercent',
            placeholder: 'Ваш процент',
        },
    ];

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

                if (
                    filterArg == 'subscriptionUntil' ||
                    filterArg == 'createdAt' ||
                    filterArg == 'refEndDate'
                ) {
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

        setFilteredSummary({...filteredSummaryTemp});
    };

    useEffect(() => {
        filterTableData();
    }, [data]);

    const refki = useMemo(
        () =>
            referrals.map((refka) => (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <Text variant="subheader-2">{refka?.href}</Text>
                    <CopyButton copyText={refka?.href ?? ''} pin="circle-circle" />
                </div>
            )),
        [referrals],
    );

    if (!data) return <Spin />;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 32,
                        flexWrap: 'wrap',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 32,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Card
                            style={{
                                borderRadius: 30,
                                width: 300,
                                height: 200,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                            }}
                        >
                            <Text variant="header-2">Баланс</Text>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: 8,
                                }}
                            >
                                <Text variant="display-2">{`${new Intl.NumberFormat('ru-RU').format(balance)} ₽`}</Text>
                                <ActionTooltip title="Посмотреть историю операций">
                                    <OperationHistory operations={operationHistory}>
                                        <Button pin="circle-circle" view="flat" size="l">
                                            <Icon data={ClockArrowRotateLeft} size={20} />
                                        </Button>
                                    </OperationHistory>
                                </ActionTooltip>
                            </div>
                            <GetPayout setUpdateFlag={setUpdateFlag} balance={balance}>
                                <Text
                                    style={{cursor: 'pointer'}}
                                    variant="caption-2"
                                    color="secondary"
                                >
                                    Запросить выплату
                                </Text>
                            </GetPayout>
                        </Card>
                        <ReferralProgram />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 32,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Divider orientation="vertical" />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: 8,
                                }}
                            >
                                <Text variant="header-1">Ваши реферальные ссылки</Text>{' '}
                                <Button
                                    pin="circle-circle"
                                    view="action"
                                    size="l"
                                    onClick={createReferral}
                                >
                                    <Icon data={Plus} />
                                    Создать
                                </Button>
                            </div>
                            {refki}
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 16,
                }}
            >
                {data?.length ? (
                    <TheTable
                        key={'partnerka'}
                        columnData={columnData}
                        data={filteredData}
                        filters={filters}
                        setFilters={setFilters}
                        filterData={filterTableData}
                        footerData={[filteredSummary]}
                        tableId={'partnerka'}
                        usePagination={true}
                        defaultPaginationSize={50}
                        height={'calc(100vh - 10em - 60px - 300px)'}
                        onPaginationUpdate={({page, paginatedData, paginationSize}: any) => {
                            setPage(page);
                            setPagination(paginationSize);
                            setFilteredSummary((row: any) => {
                                const fstemp: any = row;
                                fstemp['name'] =
                                    `На странице Магазинов: ${paginatedData.length} Всего Магазинов: ${filteredData.length}`;

                                return fstemp;
                            });
                        }}
                    />
                ) : (
                    <Card
                        style={{
                            borderRadius: 30,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 30,
                            gap: 8,
                        }}
                    >
                        <Text variant="header-2">
                            Здесь будет отображаться информация о кабинетах, подключённых по вашим
                            ссылкам. <br />
                            Пока таких нет 😕 — сгенерируйте реферальную ссылку и поделитесь ею 📲,
                            чтобы начать зарабатывать 💸.
                        </Text>
                    </Card>
                )}
            </div>
        </div>
    );
};
