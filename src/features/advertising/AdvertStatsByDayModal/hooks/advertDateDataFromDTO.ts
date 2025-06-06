import { getLocaleDateString, getRoundValue } from '@/utilities/getRoundValue';
import { getDefaultAdvertDateData } from '../config/getDefaultAdvertDateData';
import { AdvertDateData } from '../types/AdvertDateData';
import { AdvertDateDataDTO } from '../types/AdvertDateDataDTO';

export const advertDateDataFromDTO = (
    dto: AdvertDateDataDTO[],
    docCampaign: any,
    arts: string[],
): AdvertDateData[] => {
    const res = dto.map((dataDto) => {
        const data: AdvertDateData = getDefaultAdvertDateData();
        const dateString = getLocaleDateString(new Date(dataDto.date));
        const keysFromSnakeToCamel: Record<string, string> = { sum_orders: 'sumOrders', orders_ad: 'ordersAd', sum_orders_ad: 'sumOrdersAd' };
        for (const key of Object.keys(dataDto)) {
            if (key == 'date') {
                data.date = new Date(dataDto[key]);
                continue;
            }
            const newKey = keysFromSnakeToCamel[key];
            if (newKey) {
                data[newKey] = Math.round(dataDto[key])
                continue;
            }
            data[key] = Math.round(dataDto[key]);
        }

        data['drr'] = getRoundValue(data['sum'], data['sumOrders'], true, 1);
        data['drrAd'] = getRoundValue(data['sum'], data.sumOrdersAd, true, 1);
        data['ctr'] = getRoundValue(data.clicks, data.views, true);
        data['cpc'] = getRoundValue(data.sum / 100, data.clicks, true, data.sum / 100);
        data.cpm = getRoundValue(data.sum * 1000, data.views);
        data['cpo'] = getRoundValue(data.sum, data.orders, false, data.sum);
        data['cpoAd'] = getRoundValue(data.sum, data.ordersAd, false, data.sum);
        console.log('arts', arts);
        for (const art of arts) {
            console.log('docCampaign', docCampaign[art]);
            const { advertsStats, nmFullDetailReport } = docCampaign[art];
            if (!advertsStats) continue;

            if (!nmFullDetailReport) continue;
            if (!nmFullDetailReport.statistics) continue;
            if (!nmFullDetailReport.statistics[dateString]) continue;
            const { openCardCount, addToCartCount } = nmFullDetailReport.statistics[dateString] ?? {
                openCardCount: 0,
                addToCartCount: 0,
            };
            data['openCardCount'] += openCardCount ?? 0;
            data['addToCartCount'] += addToCartCount ?? 0;
        }

        data['openCardCount'] = Math.round(data['openCardCount']);
        data['addToCartPercent'] = getRoundValue(
            data['addToCartCount'],
            data['openCardCount'],
            true,
        );
        data['cartToOrderPercent'] = getRoundValue(data['orders'], data['addToCartCount'], true);
        data['cr'] = getRoundValue(data['orders'], data['openCardCount'], true);
        data['crFromView'] = getRoundValue(data['orders'], data['views'], true);
        data['cpl'] = getRoundValue(data['sum'], data['addToCartCount']);

        data['avgPrice'] = getRoundValue(data['sumOrders'], data['orders']);
        data['rent'] = getRoundValue(data.profit, data.sumOrders, true);
        return data;
    });
    return res.sort((a, b) => b.date.getTime() - a.date.getTime());
};
