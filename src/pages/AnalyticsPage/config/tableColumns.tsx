import {Card, Popover, Text} from '@gravity-ui/uikit';
import {defaultRender, renderAsPercent} from '@/utilities/getRoundValue';

export const taxColumn = (renderWithGraph: any) => {
    return {
        tax: {
            placeholder: 'Налог, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'tax', 'Налог, ₽'),
        },
    };
};

export const expensesColumn = (renderWithGraph: any) => {
    return {
        expences: {
            placeholder: 'Доп. расходы, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'expences', 'Доп. расходы, ₽'),
        },
    };
};

export const rentSalesColumn = (renderWithGraph: any) => {
    return {
        rentSales: {
            placeholder: '%Приб.Продажи',
            planType: 'avg',
            render: (args: any) =>
                renderWithGraph(args, 'rentSales', '%Приб.Продажи', ['rentSales'], (args: any) => {
                    const {value} = args;
                    return (
                        <Text color={value > 0 ? 'positive' : 'danger'}>
                            {renderAsPercent(args)}
                        </Text>
                    );
                }),
        },
    };
};

export const rentPrimeCostColumn = (renderWithGraph: any) => {
    return {
        rentSales: {
            placeholder: '%Приб.Продажи',
            planType: 'avg',
            render: (args: any) =>
                renderWithGraph(args, 'rentSales', '%Приб.Продажи', ['rentSales'], (args: any) => {
                    const {value} = args;
                    return (
                        <Text color={value > 0 ? 'positive' : 'danger'}>
                            {renderAsPercent(args)}
                        </Text>
                    );
                }),
        },
    };
};

export const salesPrimeCostColum = (renderWithGraph: any) => {
    return {
        salesPrimeCost: {
            placeholder: 'Себес. продаж, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'salesPrimeCost', 'Себес. продаж, ₽'),
        },
    };
};

export const logisticsColum = (renderWithGraph: any) => {
    return {
        logistics: {
            placeholder: 'Логистика, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'logistics', 'Логистика, ₽'),
        },
    };
};

export const logisticsPercentColumn = (renderWithGraph: any) => {
    return {
        logistics: {
            placeholder: 'Логистика, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'logistics', 'Логистика, ₽'),
        },
    };
};

export const drrOrdersColum = (renderWithGraph: any) => {
    return {
        drr_orders: {
            placeholder: 'ДРР к заказам, %',
            render: (args: any) =>
                renderWithGraph(
                    args,
                    'drr_orders',
                    'ДРР к заказам, %',
                    ['drr_orders'],
                    renderAsPercent,
                ),
            planType: 'avg',
            isReverseGrad: true,
        },
    };
};

export const drrSalesColumn = (renderWithGraph: any) => {
    return {
        drr_sales: {
            placeholder: 'ДРР к продажам, %',
            render: (args: any) =>
                renderWithGraph(
                    args,
                    'drr_sales',
                    'ДРР к продажам, %',
                    ['drr_sales'],
                    renderAsPercent,
                ),
            planType: 'avg',
            isReverseGrad: true,
        },
    };
};

export const romiColumn = (renderWithGraph: any) => {
    return {
        romi: {
            planType: 'avg',
            placeholder: 'ROMI, %',
            render: (args: any) =>
                renderWithGraph(args, 'romi', 'ROMI, %', ['romi'], renderAsPercent),
        },
    };
};

export const stocksColumn = (renderWithGraph: any) => {
    return {
        stocks: {
            placeholder: 'Остаток, шт.',
            render: (args: any) => renderWithGraph(args, 'stocks', 'Остаток, шт.'),
        },
    };
};

export const skuInStockColumn = (renderWithGraph: any) => {
    return {
        skuInStock: {
            planType: 'avg',
            placeholder: 'Товары, шт.',
            render: (args: any) => renderWithGraph(args, 'skuInStock', 'Товары, шт.'),
        },
    };
};

export const primeCostColumn = (renderWithGraph: any) => {
    return {
        primeCost: {
            planType: 'avg',
            placeholder: 'Себестоимость, ₽',
            render: (args: any) => renderWithGraph(args, 'primeCost', 'Себестоимость, ₽'),
        },
    };
};

export const oborColumn = (renderWithGraph: any) => {
    return {
        obor: {
            placeholder: 'Обор. к заказам, д.',
            planType: 'avg',
            render: (args: any) => renderWithGraph(args, 'obor', 'Обор. к заказам, д.'),
        },
    };
};

export const oborSalesColumn = (renderWithGraph: any) => {
    return {
        oborSales: {
            placeholder: 'Обор. к продажам, д.',
            planType: 'avg',
            render: (args: any) => renderWithGraph(args, 'oborSales', 'Обор. к продажам, д.'),
        },
    };
};

export const orderPriceColumn = (renderWithGraph: any) => {
    return {
        orderPrice: {
            placeholder: 'Цена заказа, ₽',
            render: (args: any) => renderWithGraph(args, 'orderPrice', 'Цена заказа, ₽'),
        },
    };
};

export const buyoutsPercentColumn = (renderWithGraph: any) => {
    return {
        buyoutsPercent: {
            placeholder: 'Выкуп, %',
            planType: 'avg',
            render: (args: any) => {
                args.value = Math.round(args?.value ?? 0);
                return renderWithGraph(
                    args,
                    'buyoutsPercent',
                    'Выкуп, %',
                    ['buyoutsPercent'],
                    renderAsPercent,
                );
            },
        },
    };
};

export const crColumn = (renderWithGraph: any) => {
    return {
        cr: {
            placeholder: 'CR, %',
            planType: 'avg',
            render: (args: any) => renderWithGraph(args, 'cr', 'CR, %', ['cr'], renderAsPercent),
        },
    };
};

export const addToCartPercentColumn = (renderWithGraph: any) => {
    return {
        addToCartPercent: {
            placeholder: 'CR в корзину, %',
            planType: 'avg',
            render: (args: any) =>
                renderWithGraph(
                    args,
                    'addToCartPercent',
                    'CR в корзину, %',
                    ['addToCartPercent'],
                    renderAsPercent,
                ),
        },
    };
};

export const cartToOrderPercentColumn = (renderWithGraph: any) => {
    return {
        cartToOrderPercent: {
            placeholder: 'CR в заказ, %',
            planType: 'avg',
            render: (args: any) =>
                renderWithGraph(
                    args,
                    'cartToOrderPercent',
                    'CR в заказ, %',
                    ['cartToOrderPercent'],
                    renderAsPercent,
                ),
        },
    };
};

export const storageCostColumn = (renderWithGraph: any) => {
    return {
        storageCost: {
            placeholder: 'Хранение, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'storageCost', 'Хранение, ₽'),
        },
    };
};

export const viewsColumn = (renderWithGraph: any) => {
    return {
        views: {
            placeholder: 'Показы, шт.',
            render: (args: any) => renderWithGraph(args, 'views', 'Показы, шт.'),
        },
    };
};

export const clicksColumn = (renderWithGraph: any) => {
    return {
        clicks: {
            placeholder: 'Клики, шт.',
            render: (args: any) => renderWithGraph(args, 'clicks', 'Клики, шт.'),
        },
    };
};

export const ctrColumn = (renderWithGraph: any) => {
    return {
        ctr: {
            placeholder: 'CTR, %',
            planType: 'avg',
            render: (args: any) => renderWithGraph(args, 'ctr', 'CTR, %', ['ctr'], renderAsPercent),
        },
    };
};

export const cpcColumn = (renderWithGraph: any) => {
    return {
        cpc: {
            placeholder: 'CPC, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'cpc', 'CPC, ₽'),
        },
    };
};

export const cpmColumn = (renderWithGraph: any) => {
    return {
        cpm: {
            placeholder: 'CPM, ₽',
            isReverseGrad: true,
            render: (args: any) => renderWithGraph(args, 'ctr', 'CPM, ₽'),
        },
    };
};

export const openCardCountColumn = (renderWithGraph: any) => {
    return {
        openCardCount: {
            placeholder: 'Переходы, шт.',
            render: (args: any) => renderWithGraph(args, 'openCardCount', 'Переходы, шт.'),
        },
    };
};

export const sppPriceColumn = (renderWithGraph: any) => {
    return {
        sppPrice: {
            planType: 'avg',
            placeholder: 'Цена с СПП, ₽',
            render: (args: any) => renderWithGraph(args, 'sppPrice', 'Цена с СПП, ₽'),
        },
    };
};

export const addToCartCountColumn = (renderWithGraph: any) => {
    return {
        addToCartCount: {
            placeholder: 'Корзины, шт.',
            render: (args: any) => renderWithGraph(args, 'addToCartCount', 'Корзины, шт.'),
        },
    };
};

export const cplColumn = (renderWithGraph: any) => {
    return {
        cpl: {
            placeholder: 'CPL, ₽',
            isReverseGrad: true,
            planType: 'avg',
            render: (args: any) => renderWithGraph(args, 'cpl', 'CPL, ₽'),
        },
    };
};

export const sumColumn = (renderWithGraph: any) => {
    return {
        sum: {
            placeholder: 'Расход, ₽',
            render: (args: any) => renderWithGraph(args, 'sum', 'Расход, ₽'),
            isReverseGrad: true,
        },
    };
};

export const sumOrdersColumn = (renderWithGraph: any) => {
    return {
        sum_orders: {
            placeholder: 'Заказы, ₽',
            render: (args: any) => renderWithGraph(args, 'sum_orders', 'Заказов, ₽'),
        },
    };
};

export const ordersColumn = (renderWithGraph: any) => {
    return {
        orders: {
            placeholder: 'Заказы, шт.',
            render: (args: any) => renderWithGraph(args, 'orders', 'Заказов, шт.'),
        },
    };
};

export const avgCostColumn = (renderWithGraph: any) => {
    return {
        avgCost: {
            placeholder: 'Средний чек, ₽',
            planType: 'avg',
            render: (args: any) => renderWithGraph(args, 'avgCost', 'Средний чек, ₽'),
        },
    };
};

export const sumSalesColumn = (renderWithGraph: any) => {
    return {
        sum_sales: {
            placeholder: 'Продаж, ₽',
            render: (args: any) => renderWithGraph(args, 'sum_sales', 'Продаж, ₽'),
        },
    };
};

export const salesColumn = (renderWithGraph: any) => {
    return {
        sales: {
            placeholder: 'Продаж, шт.',
            render: (args: any) => renderWithGraph(args, 'sales', 'Продаж, шт.'),
        },
    };
};

export const profitColumn = (renderWithGraph: any) => {
    return {
        profit: {
            placeholder: 'Профит, ₽.',
            render: (args: any) =>
                renderWithGraph(args, 'profit', 'Профит, ₽.', undefined, (args: any) => {
                    const {value} = args;
                    return (
                        <Text color={value > 0 ? 'positive' : 'danger'}>{defaultRender(args)}</Text>
                    );
                }),
        },
    };
};

export const rentabelnostColumn = (renderWithGraph: any) => {
    return {
        rentabelnost: {
            placeholder: '%Приб.Заказы',
            planType: 'avg',
            render: (args: any) =>
                renderWithGraph(
                    args,
                    'rentabelnost',
                    '%Приб.Заказы',
                    ['rentabelnost'],
                    (args: any) => {
                        const {value} = args;
                        return (
                            <Text color={value > 0 ? 'positive' : 'danger'}>
                                {renderAsPercent(args)}
                            </Text>
                        );
                    },
                ),
        },
    };
};

export const entityColumn = (renderFilterByClickButton: any) => {
    return {
        entity: {
            valueType: 'text',
            placeholder: 'Объект',
            minWidth: 400,
            render: ({value, row, footer}: any) => {
                if (value === undefined || row.isBlank) return undefined;

                let titleWrapped = value;
                if (value.length > 30) {
                    let wrapped = false;
                    titleWrapped = '';
                    const titleArr = value.split(' ');
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

                return !footer ? renderFilterByClickButton({value}, 'entity') : value;
            },
        },
    };
};

export const dateColumn = () => {
    return {
        date: {
            valueType: 'text',
            placeholder: 'Дата',
            render: (args: {value: any; row: any}) => {
                const {value, row} = args;
                if (row.isBlank) return undefined;
                if (value === undefined) return 'Итого';
                const {notes, entity} = row;

                const {all} = notes ? (notes.all ? notes : {all: []}) : {all: []};

                const notesList = [] as any[];
                for (let i = 0; i < all.length; i++) {
                    const {note, tags} = all[i];

                    if (tags.includes(entity) || tags.length == 0) {
                        notesList.push(
                            <Card
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: 64,
                                    padding: 8,
                                    marginBottom: 8,
                                }}
                            >
                                {note}
                            </Card>,
                        );
                    }
                }

                return notesList.length ? (
                    <Popover
                        content={
                            <div
                                style={{
                                    height: 'calc(30em - 60px)',
                                    width: '30em',
                                    overflow: 'auto',
                                    paddingBottom: 8,
                                    display: 'flex',
                                }}
                            >
                                <Card
                                    view="outlined"
                                    theme="warning"
                                    style={{
                                        position: 'absolute',
                                        height: '30em',
                                        width: '30em',
                                        padding: 20,
                                        overflow: 'auto',
                                        top: -10,
                                        left: -10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: 'var(--g-color-base-background)',
                                    }}
                                >
                                    {notesList}
                                </Card>
                            </div>
                        }
                    >
                        <Text color="brand">{value}</Text>
                    </Popover>
                ) : (
                    value
                );
            },
        },
    };
};
