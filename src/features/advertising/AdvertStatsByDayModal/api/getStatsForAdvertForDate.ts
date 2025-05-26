import ApiClient from "@/utilities/ApiClient"
import { getLocaleDateString } from "@/utilities/getRoundValue"
import { AdvertDateData } from "../types";

export const getStatsForAdvertForDate = async (sellerId: string, date: Date, advertId: number): Promise<{ date: string, stats: AdvertDateData }> => {
	try {
		const params = { seller_id: sellerId, date: getLocaleDateString(date), advertId }
		console.log(params)
		const res = await ApiClient.post('massAdvert/new/advert/getStatsForAdvertForDate', params);
		if (!res || !res.data)
			throw new Error('No data in res')
		console.log(res.data);
		return res.data
	} catch (error: any) {
		throw new Error("error in getStatsForAdvertForDate", error);
	}
}