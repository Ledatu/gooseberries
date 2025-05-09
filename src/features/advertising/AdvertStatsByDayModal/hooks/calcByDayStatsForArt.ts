import { getLocaleDateString, getRoundValue } from "@/utilities/getRoundValue";

export const calcByDayStats = (art: number, dateRange: [Date, Date], docCampaign: any) => {
	const tempJson: any = {};
	const daysBetween =
		dateRange[1].getTime() / 86400 / 1000 - dateRange[0].getTime() / 86400 / 1000;

	const now = new Date();
	for (let i = 0; i <= daysBetween; i++) {
		const dateIter = new Date(dateRange[1]);
		dateIter.setDate(dateIter.getDate() - i);

		if (dateIter > now) continue;
		const strDate = getLocaleDateString(dateIter);

		if (!tempJson[strDate])
			tempJson[strDate] = {
				date: dateIter,
				orders: 0,
				sumOrders: 0,
				sum: 0,
				views: 0,
				clicks: 0,
				drr: 0,
				ctr: 0,
				cpc: 0,
				cpm: 0,
				cr: 0,
				cpo: 0,
				openCardCount: 0,
				addToCartCount: 0,
				addToCartPercent: 0,
				cartToOrderPercent: 0,
				cpl: 0,
				avgPrice: 0
			};

		const { advertsStats, nmFullDetailReport } = docCampaign[art];
		if (!advertsStats) continue;
		const dateData = advertsStats[strDate];
		if (!dateData) continue;

		tempJson[strDate].orders += dateData['orders'];
		tempJson[strDate].sumOrders += dateData['sum_orders'];
		tempJson[strDate].sum += dateData['sum'];
		tempJson[strDate].views += dateData['views'];
		tempJson[strDate].clicks += dateData['clicks'];

		const { openCardCount, addToCartCount } = nmFullDetailReport.statistics[strDate] ?? {
			openCardCount: 0,
			addToCartCount: 0,
		};

		tempJson[strDate].openCardCount += openCardCount ?? 0;
		tempJson[strDate].addToCartCount += addToCartCount ?? 0;
		tempJson[strDate].openCardCount = Math.round(tempJson[strDate].openCardCount);
		tempJson[strDate].addToCartPercent = getRoundValue(
			tempJson[strDate].addToCartCount,
			tempJson[strDate].openCardCount,
			true,
		);
		tempJson[strDate].cartToOrderPercent = getRoundValue(
			tempJson[strDate].orders,
			tempJson[strDate].addToCartCount,
			true,
		);
		tempJson[strDate].cpl = getRoundValue(
			tempJson[strDate].sum,
			tempJson[strDate].addToCartCount,
		);
	}

	const temp = [] as any[];

	for (const [strDate, data] of Object.entries(tempJson)) {
		const dateData: any = data;
		if (!strDate || !dateData) continue;

		dateData['orders'] = Math.round(dateData['orders']);
		dateData['sumOrders'] = Math.round(dateData['sumOrders']);
		dateData['sum'] = Math.round(dateData['sum']);
		dateData['views'] = Math.round(dateData['views']);
		dateData['clicks'] = Math.round(dateData['clicks']);

		const { orders, sum, clicks, views } = dateData as any;

		dateData['drr'] = getRoundValue(dateData['sum'], dateData['sumOrders'], true, 1);
		dateData['ctr'] = getRoundValue(clicks, views, true);
		dateData['cpc'] = getRoundValue(sum / 100, clicks, true, sum / 100);
		dateData['cpm'] = getRoundValue(sum * 1000, views);
		dateData['cr'] = getRoundValue(orders, dateData['openCardCount'], true);
		dateData['cpo'] = getRoundValue(sum, orders, false, sum);
		dateData['avgPrice'] = getRoundValue(dateData['sumOrders'], dateData['orders']);

		temp.push(dateData);
	}

	return temp;
};