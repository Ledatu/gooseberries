import {
    defaultRender,
    getRoundValue,
    renderAsPercent,
    renderSlashPercent,
} from '@/utilities/getRoundValue';
import {Button, Card, Icon, Spin, Text} from '@gravity-ui/uikit';
import {HelpMark} from '@/components/Popups/HelpMark';

export const getOpenCardCountColumn = () => ({
    name: 'openCardCount',
    placeholder: 'Всего переходов, шт.',
});

export const getCPMColumn = () => ({name: 'cpm', placeholder: 'CPM, ₽'});

export const getCPCColumn = () => ({name: 'cpc', placeholder: 'CPC, ₽'});

export const getCTRColumn = () => ({name: 'ctr', placeholder: 'CTR, %', render: renderAsPercent});

export const getCRColumn = () => ({name: 'cr', placeholder: 'CR, %', render: renderAsPercent});

export const getAddToCardPercentColumn = () => ({
    name: 'addToCartPercent',
    placeholder: 'CR в корзину, %',
    render: renderAsPercent,
});

export const getCPLColumn = () => ({name: 'cpl', placeholder: 'CPL, ₽'});

export const getAddToCartCountColumn = () => ({
    name: 'addToCartCount',
    placeholder: 'Корзины, шт.',
});

export const getCardToOrderPercentColumn = () => ({
    name: 'cartToOrderPercent',
    placeholder: 'CR в заказ, %',
    render: renderAsPercent,
});

export const getClicksColumn = () => ({
    name: 'clicks',
    placeholder: 'Клики, шт.',
    render: (args: any) => renderSlashPercent(args, 'openCardCount'),
});

export const getRomiColumn = () => ({
    name: 'romi',
    placeholder: 'ROMI, %',
    render: renderAsPercent,
});

export const getViewsColumn = () => ({name: 'views', placeholder: 'Показы, шт.'});

export const getCpoColumn = (doc: any, selectValue: any) => ({
    name: 'cpo',
    placeholder: 'CPO, ₽',
    render: ({value, row}: any) => {
        const findFirstActive = (adverts: any) => {
            for (const [id, _] of Object.entries(adverts ?? {})) {
                const advert = doc?.adverts?.[selectValue[0]]?.[id];
                if (!advert) continue;
                if ([9, 11].includes(advert.status)) return advert;
            }
            return undefined;
        };
        const {adverts} = row;
        const fistActiveAdvert = findFirstActive(adverts);
        const drrAI = doc?.advertsAutoBidsRules?.[selectValue[0]]?.[fistActiveAdvert?.advertId];
        const {desiredDRR, autoBidsMode} = drrAI ?? {};
        return (
            <Text
                color={
                    desiredDRR
                        ? autoBidsMode == 'cpo'
                            ? value <= desiredDRR
                                ? value == 0
                                    ? 'primary'
                                    : 'positive'
                                : value / desiredDRR - 1 < 0.5
                                  ? 'warning'
                                  : 'danger'
                            : 'primary'
                        : 'primary'
                }
            >
                {value}
            </Text>
        );
    },
});

export const getDrrColumn = (doc: any, selectValue: any) => ({
    name: 'drr',
    placeholder: 'ДРР, %',
    render: ({value, row}: any) => {
        const findMinDrr = (adverts: any) => {
            let minDrr = 0;
            for (const [id, _] of Object.entries(adverts ?? {})) {
                const advert = doc?.adverts?.[selectValue[0]]?.[id];
                if (!advert) continue;
                if (![9, 11].includes(advert?.status)) continue;
                const drrAI = doc?.advertsAutoBidsRules[selectValue[0]]?.[advert?.advertId];
                const {desiredDRR, useManualMaxCpm, autoBidsMode} = drrAI ?? {};
                if (useManualMaxCpm && !['drr'].includes(autoBidsMode)) continue;
                if (desiredDRR > minDrr) minDrr = desiredDRR;
            }
            return minDrr;
        };
        const {adverts} = row;
        const minDrr = findMinDrr(adverts);
        return (
            <Text
                color={
                    minDrr
                        ? value <= minDrr
                            ? value == 0
                                ? 'primary'
                                : 'positive'
                            : value / minDrr - 1 < 0.5
                              ? 'warning'
                              : 'danger'
                        : 'primary'
                }
            >
                {value}%
            </Text>
        );
    },
});

export const getAvgPriceColum = () => ({
    name: 'avg_price',
    placeholder: 'Ср. Чек, ₽',
    render: ({row}: any) => {
        return defaultRender({value: getRoundValue(row?.sum_orders, row?.orders)});
    },
    sortFunction: (a: any, b: any, order: any) => {
        const dataA = getRoundValue(a?.sum_orders, a?.orders);
        const dataB = getRoundValue(b?.sum_orders, b?.orders);
        // console.log(dataA, dataB);
        const isNaNa = isNaN(dataA);
        const isNaNb = isNaN(dataB);
        if (isNaNa && isNaNb) return 1;
        else if (isNaNa) return 1;
        else if (isNaNb) return -1;
        return (dataA - dataB) * order;
    },
});

export const getSumColumn = () => ({name: 'sum', placeholder: 'Расход, ₽'});

export const getOrdersColumn = () => ({name: 'orders', placeholder: 'Заказы, шт.'});

export const getSumOrdersColumn = () => ({name: 'sum_orders', placeholder: 'Заказы, ₽'});

export const getDsiColumn = () => ({
    name: 'dsi',
    placeholder: (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 8,
            }}
        >
            <Text variant="subheader-1">Обор.</Text>
            <HelpMark content="Показывает через сколько дней закончится текущий остаток с учетом средней скорости заказов в день за выбранные период в календаре" />
        </div>
    ),
});

export const getStocksColumn = () => ({
    name: 'stocks',
    placeholder: 'Остаток',
    group: true,
    render: ({value}: any) => {
        return (
            <div>
                <Text>{`${value}`}</Text>
            </div>
        );
    },
});
