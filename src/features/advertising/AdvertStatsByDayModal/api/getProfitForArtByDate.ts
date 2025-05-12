
import ApiClient from "@/utilities/ApiClient";

export const getProfitForArtByDate = async (sellerId: string, art: string, dateFrom: Date, dateTo: Date): Promise<{ [key: string]: number }> => {
	try {
		const params = {
			seller_id: sellerId,
			art,
			dateFrom,
			dateTo,
		};
		console.log(params);
		const res = await ApiClient.post('massAdvert/new/advert/getNmIdProfitBydate', params)
		if (!res || !res.data || res.data.profit == undefined) {
			throw Error(`No data in getStatsByDateForAdvertId for ${sellerId} art = ${art}`);
		}
		return res.data.profit;

	} catch (error: any) {
		console.error(error)
		throw new Error(error.message);
	}
}