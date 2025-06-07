import { ClusterDataDto } from './ClusterDataDto'

export interface ClusterData {
	addToCartCurrent: number
	addToCartPercentile: number
	avgPositionCurrent: number
	cartToOrderCurrent: number
	cartToOrderPercentile: number
	clicks: number
	cluster: string
	cpc: number
	ctr: number
	cpm: number
	frequencyCurrent: number
	openCardCurrent: number
	openCardPercentile: number
	openToCartCurrent: number
	openToCartPercentile: number
	openToOrderPercent: number
	ordersCurrent: number
	ordersPercentile: number
	preset: string
	totalFrequency: number
	totalSum: number
	views: number
	visibilityCurrent: number
	weekFrequency: number
	drr: number,
	cpo: number,
	profitSum: number
	[key: string]: string | number
	
}

export function clusterDataMap(dto: ClusterDataDto): ClusterData {
	return {
		addToCartCurrent: dto.addToCartCurrent,
		addToCartPercentile: dto.addToCartPercentile,
		avgPositionCurrent: dto.avgPositionCurrent,
		cartToOrderCurrent: dto.cartToOrderCurrent,
		cartToOrderPercentile: dto.cartToOrderPercentile,
		clicks: dto.clicks,
		cluster: dto.cluster,
		cpm: dto.cpm,
		cpc: dto.cpc,
		ctr: dto.ctr,
		frequencyCurrent: dto.frequencyCurrent,
		openCardCurrent: dto.openCardCurrent,
		openCardPercentile: dto.openCardPercentile,
		openToCartCurrent: dto.openToCartCurrent,
		openToCartPercentile: dto.openToCartPercentile,
		openToOrderPercent: dto.openToOrderPercent,
		ordersCurrent: dto.ordersCurrent,
		ordersPercentile: dto.ordersPercentile,
		preset: dto.preset,
		totalFrequency: dto.totalFrequency,
		totalSum: dto.totalSum,
		views: dto.views,
		visibilityCurrent: dto.visibilityCurrent,
		weekFrequency: dto.weekFrequency,
		drr: dto.drr,
		cpo: dto.cpo,

		profitSum: dto.profitSum
	}
}