import { AdvertDateData } from "../types/AdvertDateData"

export const getDefaultAdvertDateData = (): AdvertDateData => {
	return {
		date: new Date(),
		orders: 0,
		sumOrders: 0,
		sum: 0,
		views: 0,
		clicks: 0,
		drr: 0,
		ctr: 0,
		cto: 0,
		cpc: 0,
		cpm: 0,
		openCardCount: 0,
		addToCartCount: 0,
		addToCartPercent: 0,
		cartToOrderPercent: 0,
		cr: 0,
		rent: 0,
		profit: 0,
		crFromView: 0,
		cpl: 0,
		avgPrice: 0
	}
}