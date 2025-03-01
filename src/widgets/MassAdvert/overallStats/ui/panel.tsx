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
    const {summary} = campaignStore;

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
                summary={summary}
                val_key="sum_orders"
                placeholder="ЗАКАЗЫ"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                summary={summary}
                val_key="sum_sales"
                placeholder="ПРОДАЖИ"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                summary={summary}
                val_key="sum"
                placeholder="РАСХОД"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                summary={summary}
                val_key="drr"
                placeholder="ДРР к ЗАКАЗАМ / к ПРОДАЖАМ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                summary={summary}
                val_key="profit"
                placeholder="ПРИБЫЛЬ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                summary={summary}
                val_key="rent"
                placeholder="РЕНТ к ЗАКАЗАМ / к ПРОДАЖАМ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                summary={summary}
                val_key="views"
                placeholder="ПОКАЗЫ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                val_key="clicks"
                placeholder="КЛИКИ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                val_key="addToCartCount"
                placeholder="КОРЗИНЫ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                val_key="orders"
                placeholder="ЗАКАЗЫ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                val_key="sales"
                placeholder="ПРОДАЖИ"
                cardStyle={cardStyle}
            />
        </div>
    );
});
