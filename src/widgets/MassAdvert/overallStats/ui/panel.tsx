import { Summary } from '@/shared/types/summary';
import { FC } from 'react';
import { StatisticsCard } from '@/widgets/MassAdvert/overallStats/ui/card';

interface StatisticsPanelProps {
    summary: Summary;
}

export const StatisticsPanel: FC<StatisticsPanelProps> = ({ summary }) => {
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
    };

    console.log("SUMMARY\N\N\N\N", summary)

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
        >
            <StatisticsCard
                summary={summary}
                key="sum_orders"
                placeholder="ЗАКАЗЫ"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                summary={summary}
                key="sum_sales"
                placeholder="ПРОДАЖИ"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                summary={summary}
                key="sum"
                placeholder="РАСХОД"
                cardStyle={cardStyle}
                rub={true}
            />
            <StatisticsCard
                summary={summary}
                key="drr"
                placeholder="ДРР к ЗАКАЗАМ / к ПРОДАЖАМ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                summary={summary}
                key="profit"
                placeholder="ПРИБЫЛЬ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                summary={summary}
                key="rent"
                placeholder="РЕНТ к ЗАКАЗАМ / к ПРОДАЖАМ"
                cardStyle={cardStyle}
                valueType="text"
            />
            <StatisticsCard
                summary={summary}
                key="views"
                placeholder="ПОКАЗЫ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                key="clicks"
                placeholder="КЛИКИ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                key="addToCartCount"
                placeholder="КОРЗИНЫ"
                cardStyle={cardStyle}
            />
            <StatisticsCard
                summary={summary}
                key="orders"
                placeholder="ЗАКАЗЫ"
                cardStyle={cardStyle}
                count={true}
            />
            <StatisticsCard
                summary={summary}
                key="sales"
                placeholder="ПРОДАЖИ"
                cardStyle={cardStyle}
                count={true}
            />
        </div>
    );
};