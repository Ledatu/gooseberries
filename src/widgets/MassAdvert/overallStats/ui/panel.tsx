import {FC, HTMLProps} from 'react';
import {campaignStore} from '@/shared/stores/campaignStore';
import {observer} from 'mobx-react-lite';
import {StatisticsCard} from './card';
import {Summary} from '@/shared/types/summary';

interface StatisticsPanelProps extends HTMLProps<HTMLDivElement> {}

const cardStyle: any = {
    minWidth: '12em',
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
    const summary: Summary = campaignStore.summary;
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
                cardStyle={cardStyle}
                entity1={{value: summary.sum_orders, placeholder: 'ЗАКАЗЫ', rub: true}}
                entity2={{value: summary.sum_sales, placeholder: 'ПРОДАЖИ', rub: true}}
            />
            <StatisticsCard
                cardStyle={cardStyle}
                entity1={{value: summary.sum, placeholder: 'РАСХОД', rub: true}}
                entity2={{
                    value: `${summary.drr}`,
                    valueType: 'text',
                    placeholder: 'ДРР к ЗАКАЗАМ / к ПРОДАЖАМ',
                }}
            />
            <StatisticsCard
                cardStyle={cardStyle}
                entity1={{value: summary.profit, placeholder: 'ПРИБЫЛЬ'}}
                entity2={{
                    value: summary.rent,
                    valueType: 'text',
                    placeholder: 'РЕНТ к ЗАКАЗАМ / к ПРОДАЖАМ',
                }}
            />
            <StatisticsCard
                cardStyle={cardStyle}
                entity1={{value: summary.views, placeholder: 'ПОКАЗЫ'}}
                entity2={{value: summary.x, placeholder: 'CTR', percent: true}}
            />
            <StatisticsCard
                cardStyle={cardStyle}
                entity1={{value: summary.clicks, placeholder: 'КЛИКИ'}}
                entity2={{value: summary.s, placeholder: 'ПЕРЕХОДЫ'}}
            />
            <StatisticsCard
                cardStyle={cardStyle}
                entity1={{value: summary.orders, placeholder: 'ЗАКАЗЫ шт'}}
                entity2={{value: summary.sales, placeholder: 'ПРОДАЖИ шт'}}
            />
        </div>
    );
});
