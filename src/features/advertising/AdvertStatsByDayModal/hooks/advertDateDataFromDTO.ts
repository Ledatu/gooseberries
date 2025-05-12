import { getLocaleDateString, getRoundValue } from "@/utilities/getRoundValue";
import { getDefaultAdvertDateData } from "../config/getDefaultAdvertDateData";
import { AdvertDateData } from "../types/AdvertDateData";
import { AdvertDateDataDTO } from "../types/AdvertDateDataDTO";

export const advertDateDataFromDTO = (dto: AdvertDateDataDTO[], docCampaign: any, arts: number[]): AdvertDateData[] => {
	const res = dto.map((dataDto) => {
		const data: AdvertDateData = getDefaultAdvertDateData();
		const dateString = getLocaleDateString(new Date(dataDto.date));
		
		for (const key of Object.keys(dataDto)) {
			if (key == 'date') {
				data.date = new Date(dataDto[key]);
				continue;
			}
			if (key == 'sum_orders') {
				data['sumOrders'] = Math.round(dataDto.sum_orders);
				continue;
			}
			data[key] = Math.round(dataDto[key]);
		}

		data['drr'] = getRoundValue(
			data['sum'],
			data['sumOrders'],
			true,
			1,
		);
		data['ctr'] = getRoundValue(data.clicks, data.views, true);
		data['cpc'] = getRoundValue(
			data.sum / 100,
			data.clicks,
			true,
			data.sum / 100,
		);
		data.cpm = getRoundValue(data.sum * 1000, data.views);
		data['cpo'] = getRoundValue(data.sum, data.orders, false, data.sum);
		for (const art of arts) {
			const { advertsStats, nmFullDetailReport } =
				docCampaign[art];
			if (!advertsStats) continue;

			if (!nmFullDetailReport) continue;
			if (!nmFullDetailReport.statistics) continue;
			if (!nmFullDetailReport.statistics[dateString]) continue;
			const { openCardCount, addToCartCount } =
				nmFullDetailReport.statistics[dateString] ?? {
					openCardCount: 0,
					addToCartCount: 0,
				};
			data['openCardCount'] += openCardCount ?? 0;
			data['addToCartCount'] += addToCartCount ?? 0;
		}

		data['openCardCount'] = Math.round(
			data['openCardCount'],
		);
		data['addToCartPercent'] = getRoundValue(
			data['addToCartCount'],
			data['openCardCount'],
			true,
		);
		data['cartToOrderPercent'] = getRoundValue(
			data['orders'],
			data['addToCartCount'],
			true,
		);
		data['cr'] = getRoundValue(
			data['orders'],
			data['openCardCount'],
			true,
		);
		data['crFromView'] = getRoundValue(
			data['orders'],
			data['views'],
			true,
		)
		data['cpl'] = getRoundValue(
			data['sum'],
			data['addToCartCount'],
		);

		data['avgPrice'] = getRoundValue(data['sumOrders'], data['orders']);
		data['rent'] = getRoundValue(
			data.profit, data.sumOrders, true
		)
		return data;
	})
	return res.sort((a, b) => b.date.getTime() - a.date.getTime())
}