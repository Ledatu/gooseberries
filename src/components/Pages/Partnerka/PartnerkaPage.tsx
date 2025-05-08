import TheTable, {compare} from '@/components/TheTable';
import {ClockArrowRotateLeft, Comment, Plus} from '@gravity-ui/icons';
import {ActionTooltip, Button, Card, Divider, Icon, Spin, Text, Tooltip} from '@gravity-ui/uikit';
import {useEffect, useMemo, useState} from 'react';
import {GetPayout} from './GetPayout';
import ApiClient from '@/utilities/ApiClient';
import {CopyButton} from '@/components/Buttons/CopyButton';
import {OperationHistory} from './OperationHistory';
import {defaultRender, getRoundValue} from '@/utilities/getRoundValue';
import {EditComment} from './EditComment';

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
    comment?: string;
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
                Зарабатывайте вместе с AURUMSKYNET™ — приглашайте друзей, коллег и партнёров,
                используя вашу уникальную реферальную ссылку. Ссылку можно сгенерировать прямо на
                этой странице.
            </p>
            <p className="mb-2">
                <p className="font-semibold"> Увеличенный пробный период для приглашённых</p>
                Пользователи, зарегистрировавшиеся по вашей ссылке, получают расширенный пробный
                период — 21 день вместо стандартных 7.
            </p>
            <p className="mb-2">
                <p className="font-semibold">15% от всех оплат приглашённого магазина</p>Если
                пользователь добавит по вашей ссылке магазин в течение 30 дней, вы будете получать
                15% от всех его оплат в течение 12 месяцев.
            </p>
            <p className="mb-2">
                <p className="font-semibold">Выплата при балансе от 5 000 ₽</p>Вознаграждение
                автоматически накапливается на вашем счёте. Как только сумма достигнет 5 000 ₽, вы
                можете запросить выплату в любой момент.
            </p>
            <p className="mb-2">
                <p className="font-semibold">Прозрачная статистика</p>В личном кабинете доступна
                информация о приглашённых магазинах, их подписках и размере вашего вознаграждения.
            </p>
            <p>Присоединяйтесь к партнёрской программе и начните зарабатывать уже сегодня!</p>
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
            const response = await ApiClient.post('/auth/get-referal-campaigns', {});
            if (!response || !response.data) throw new Error('No data');
            setData(response?.data);
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
        // if (referrals.length >= 4) return;
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
            render: ({value, footer}: IRender) => {
                if (footer) return undefined;
                const date = new Date(value).toLocaleDateString('ru-RU').slice(0, 10);
                const expired = new Date(value).getTime() - new Date().getTime() < 86400 * 7 * 1000;
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
                    </div>
                );
            },
        },
        {
            name: 'createdAt',
            placeholder: 'Дата добавления',
            render: ({value, footer}: IRender) => {
                if (footer) return undefined;
                const date = new Date(value ?? '2024-01-01')
                    .toLocaleDateString('ru-RU')
                    .slice(0, 10);
                const expired =
                    new Date().getTime() - new Date(value).getTime() < 86400 * 365 * 1000;
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text variant="subheader-2" color={expired ? 'danger' : undefined}>
                            {date}
                        </Text>
                    </div>
                );
            },
        },
        {
            name: 'refEndDate',
            placeholder: 'Дата окончания начислений',
            render: ({row, footer}: IRender) => {
                if (footer) return undefined;
                const value = new Date(row?.createdAt ?? '2024-01-01');
                value.setDate(value.getDate() + 365);
                const date = value.toLocaleDateString('ru-RU').slice(0, 10);
                const expired = new Date(value).getTime() - new Date().getTime() < 86400 * 7 * 1000;
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text variant="subheader-2" color={expired ? 'danger' : undefined}>
                            {date}
                        </Text>
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
                    ((value + (saleRubles ?? 0)) / (1 - (salePercent ?? 0) / 100) - base) / art;
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
                                Итог со скидкой: {defaultRender({value: Math.round(value)})} ₽
                            </Text>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
        },
        {
            name: 'refPercent',
            placeholder: 'Ваше вознаграждение (при оплате)',
            render: ({value, footer}: IRender) => {
                if (footer) return value;
                return (
                    <Text color="primary" variant="subheader-2">
                        {defaultRender({value: Math.round(value)})} ₽
                    </Text>
                );
            },
        },
        {
            name: 'referal',
            placeholder: 'Реферальная ссылка',
            render: ({value}: IRender) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <Text color="primary" variant="subheader-2">
                            {value}
                        </Text>
                        {refComments[value] ? (
                            <Text
                                variant="subheader-2"
                                color="secondary"
                                ellipsis
                                style={{maxWidth: 360, textWrap: 'wrap'}}
                            >
                                {refComments[value]}
                            </Text>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            },
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

                const refPercent = (price ?? 0) * 0.15;

                temp.push({...tempTypeRow, price, refPercent});
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
                        flexDirection: 'column',
                        gap: 4,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            width: 440,
                        }}
                    >
                        <Text variant="subheader-2">{refka?.href}</Text>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <CopyButton copyText={refka?.href ?? ''} pin="circle-circle" />
                            <EditComment referal={refka?.href ?? ''} setUpdateFlag={setUpdateFlag}>
                                <Button pin="circle-circle">
                                    <Icon data={Comment} />
                                </Button>
                            </EditComment>
                        </div>
                    </div>
                    {refka?.comment ? (
                        <Text
                            variant="subheader-2"
                            color="secondary"
                            ellipsis
                            style={{maxWidth: 360, textWrap: 'wrap'}}
                        >
                            {refka?.comment}
                        </Text>
                    ) : (
                        <></>
                    )}
                </div>
            )),
        [referrals],
    );

    const refComments = useMemo(
        () =>
            referrals.reduce((obj, refka) => {
                if (refka?.href) obj[refka.href] = refka?.comment;
                return obj;
            }, {} as any),
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
                            <ActionTooltip
                                title={
                                    balance < 5000
                                        ? 'Запросить выплату можно при балансе от 5 000 ₽'
                                        : 'Здесь вы можете запросить выплату'
                                }
                            >
                                <GetPayout setUpdateFlag={setUpdateFlag} balance={balance}>
                                    {/* <Text
                                    style={{cursor: 'pointer'}}
                                    variant="caption-2"
                                    color="secondary"
                                >
                                    Запросить выплату
                                </Text> */}
                                    <Button
                                        pin="circle-circle"
                                        view="flat"
                                        size="xs"
                                        disabled={balance < 5000}
                                    >
                                        Запросить выплату
                                    </Button>
                                </GetPayout>
                            </ActionTooltip>
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
