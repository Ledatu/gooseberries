import {FC, HTMLProps} from 'react';
import {StatisticsCard} from '@/widgets/MassAdvert/overallStats/ui/card';
import {campaignStore} from '@/shared/stores/campaignStore';
import {observer} from 'mobx-react-lite';

interface StatisticsPanelProps extends HTMLProps<HTMLDivElement> {}

const cardStyle: any = {
    minWidth: '10em',
    height: '10em',
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
    marginRight: '8px',
    marginLeft: '8px',
    paddingLeft: '1em',
    paddingRight: '1em',
};

export const StatisticsPanel: FC<StatisticsPanelProps> = observer(({...rest}) => {
    const summary = campaignStore.summary;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-around',
                margin: '8px 0',
                flexWrap: 'wrap',
            }}
            {...rest}
        >
            <StatisticsCard
                value={summary.sum_orders}
                placeholder="ЗАКАЗЫ"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                value={summary.sum_sales}
                placeholder="ПРОДАЖИ"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                value={summary.sum}
                placeholder="РАСХОД"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                value={summary.drr}
                placeholder="ДРР к ЗАКАЗАМ / к ПРОДАЖАМ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                value={summary.profit}
                placeholder="ПРИБЫЛЬ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                value={summary.rent}
                placeholder="РЕНТ к ЗАКАЗАМ / к ПРОДАЖАМ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard value={summary.views} placeholder="ПОКАЗЫ" cardStyle={cardStyle} />
            <StatisticsCard value={summary.clicks} placeholder="КЛИКИ" cardStyle={cardStyle} />
            <StatisticsCard
                value={summary.addToCartCount}
                placeholder="КОРЗИНЫ"
                cardStyle={cardStyle}
            />
            <StatisticsCard value={summary.orders} placeholder="ЗАКАЗЫ" cardStyle={cardStyle} />
            <StatisticsCard value={summary.sales} placeholder="ПРОДАЖИ" cardStyle={cardStyle} />
        </div>
    );
});
