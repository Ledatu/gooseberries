import { getRoundValue } from "@/utilities/getRoundValue";
import { AdvertDateData } from "../types/AdvertDateData";

export const getSummaryData = (filteredData: AdvertDateData[]) => {
	const summary: { [key: string]: number } = {
		date: 0,
		orders: 0,
		ordersAd: 0,
		sumOrdersAd: 0,
		sumOrders: 0,
		avgPrices: 0,
		sum: 0,
		views: 0,
		clicks: 0,
		drr: 0,
		drrAd: 0,
		ctr: 0,
		cpc: 0,
		cpm: 0,
		cr: 0,
		cpo: 0,
		cpoAd: 0,
		profit: 0,
		rent: 0,
		openCardCount: 0,
		addToCartCount: 0,
		addToCartPercent: 0,
		cartToOrderPercent: 0,
		cpl: 0,
	}

	for (const data of filteredData) {
		for (const [key, val] of Object.entries(data)) {
			if (
				[
					'sum',
					'clicks',
					'views',
					'orders',
					'sumOrders',
					'ordersAd',
					'sumOrdersAd',
					'avgPrices',
					'openCardCount',
					'addToCartCount',
					'addToCartPercent',
					'cartToOrderPercent',
					'profit',
				].includes(key)
			)
				summary[key] +=
					isFinite(val as number) && !isNaN(val as number) ? val : 0;
		}

		summary['date']++;
	}

	summary.sumOrders = Math.round(
		summary.sumOrders,
	);
	summary.sumOrdersaAd = Math.round(
		summary.sumOrdersAd,
	);

	summary.orders = Math.round(
		summary.orders,
	);

	summary.ordersAd = Math.round(
		summary.ordersAd,
	);
	summary.profit = Math.round(summary.profit);
	summary.avgPrice = getRoundValue(
		summary.sumOrders,
		summary.orders,
	);
	summary.sum = Math.round(summary.sum);
	summary.views = Math.round(
		summary.views,
	);
	summary.clicks = Math.round(
		summary.clicks,
	);
	summary.openCardCount = Math.round(
		summary.openCardCount,
	);
	summary.addToCartPercent = getRoundValue(
		summary.addToCartCount,
		summary.openCardCount,
		true,
	);
	summary.cartToOrderPercent = getRoundValue(
		summary.orders,
		summary.addToCartCount,
		true,
	);
	summary.rent = getRoundValue(
		summary.profit,
		summary.sumOrders,
		true
	)
	const { orders, sum, views, clicks, openCardCount, addToCartCount, ordersAd } =
		summary;

	summary.drr = getRoundValue(
		summary.sum,
		summary.sumOrders,
		true,
		1,
	);
	summary.drrAd = getRoundValue(
		summary.sum,
		summary.sumOrdersAd,
		true,
		1,
	);
	summary.ctr = getRoundValue(clicks, views, true);
	summary.cpc = getRoundValue(sum / 100, clicks, true, sum / 100);
	summary.cpm = getRoundValue(sum * 1000, views);
	summary.cr = getRoundValue(orders, openCardCount, true);
	summary.crFromView = getRoundValue(orders, views, true);

	summary.cpo = getRoundValue(sum, orders, false, sum);
	summary.cpoAd = getRoundValue(sum, ordersAd, false, sum);

	summary.cpl = getRoundValue(sum, addToCartCount, false, sum);
	return summary;
}