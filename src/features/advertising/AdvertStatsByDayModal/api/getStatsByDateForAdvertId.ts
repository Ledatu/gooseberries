
import { AdvertDateDataDTO } from "../types/AdvertDateDataDTO";
import ApiClient from "@/utilities/ApiClient";

export const getStatsByDateForAdvertId = async (sellerId: string, advertId: number): Promise<AdvertDateDataDTO[]> => {
	try {
		const params = {
			seller_id: sellerId,
			advertId,
		};
		console.log(params);
		const res = await ApiClient.post('massAdvert/new/advert/getAdvertStatsByDay', params)
		if (!res || !res.data || res.data.stats == undefined) {
			throw Error(`No data in getStatsByDateForAdvertId for ${sellerId} advertID = ${advertId}`);
		}
		const result: AdvertDateDataDTO[] = [];
		for (const key of Object.keys(res.data.stats)) {
			result.push({ ...res.data.stats[key], date: new Date(key) })
		}
		console.log(result)
		return result;
	} catch (error: any) {
		console.error(error)
		throw new Error(error.message);
	}
}