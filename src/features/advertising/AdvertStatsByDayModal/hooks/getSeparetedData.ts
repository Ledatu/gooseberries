import { getRoundValue } from "@/utilities/getRoundValue";
import { getDefaultAdvertDateData } from "../config/getDefaultAdvertDateData";
import { AdvertDateData } from "../types";

export const getSeparetedData = (searchData: AdvertDateData, currentData: AdvertDateData) => {
	const catalogData = getDefaultAdvertDateData();
	searchData.sum = Math.round(searchData.sum);
	searchData.profit
	catalogData.clicks = currentData.clicks - searchData.clicks;
	catalogData.addToCartCount = currentData.addToCartCount - searchData.addToCartCount;
	catalogData.openCardCount = currentData.openCardCount - searchData.openCardCount;
	catalogData.orders = currentData.orders - searchData.orders;
	catalogData.sum = currentData.sum - searchData.sum;
	searchData.avgPrice = currentData.avgPrice;

	catalogData.avgPrice = currentData.avgPrice;
	searchData.sumOrders = searchData.avgPrice * searchData.orders;
	catalogData.sumOrders = catalogData.avgPrice * catalogData.orders
	catalogData.views = currentData.views - searchData.views;
	catalogData.profit = currentData.profit - searchData.profit;
	catalogData.addToCartCount = currentData.addToCartCount - searchData.addToCartCount;
	catalogData['drr'] = getRoundValue(
		catalogData['sum'],
		catalogData['sumOrders'],
		true,
		1,
	);
	catalogData['ctr'] = getRoundValue(catalogData.clicks, catalogData.views, true);
	catalogData['cpc'] = getRoundValue(
		catalogData.sum / 100,
		catalogData.clicks,
		true,
		catalogData.sum / 100,
	);
	catalogData.cpm = getRoundValue(catalogData.sum * 1000, catalogData.views);
	catalogData['cpo'] = getRoundValue(catalogData.sum, catalogData.orders, false, catalogData.sum);
	catalogData['openCardCount'] = Math.round(
		catalogData['openCardCount'],
	);
	catalogData['addToCartPercent'] = getRoundValue(
		catalogData['addToCartCount'],
		catalogData['openCardCount'],
		true,
	);
	catalogData['cartToOrderPercent'] = getRoundValue(
		catalogData['orders'],
		catalogData['addToCartCount'],
		true,
	);
	catalogData['cr'] = getRoundValue(
		catalogData['orders'],
		catalogData['openCardCount'],
		true,
	);
	catalogData['crFromView'] = getRoundValue(
		catalogData['orders'],
		catalogData['views'],
		true,
	)
	catalogData['cpl'] = getRoundValue(
		catalogData['sum'],
		catalogData['addToCartCount'],
	);

	searchData['crFromView'] = getRoundValue(
		searchData['orders'],
		searchData['views'],
		true,
	)

	catalogData['avgPrice'] = getRoundValue(catalogData['sumOrders'], catalogData['orders']);
	catalogData['rent'] = getRoundValue(
		catalogData.profit, catalogData.sumOrders, true
	)

	searchData['rent'] = getRoundValue(
		searchData.profit, searchData.sumOrders, true
	)

	searchData['cartToOrderPercent'] = getRoundValue(
		searchData['orders'],
		searchData['addToCartCount'],
		true,
	);
	console.log(currentData, catalogData, searchData)
	return { catalogStats: catalogData, searchStats: searchData };

}