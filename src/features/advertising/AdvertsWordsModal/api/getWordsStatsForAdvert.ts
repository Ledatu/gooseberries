import ApiClient from "@/utilities/ApiClient"
import { PhrasesStats } from "../types/PhraseStats";


export const getWordsStatsForAdvert = async (sellerId: string, advertId: number): Promise<PhrasesStats[]> => {
	try {
		const params = { seller_id: sellerId, advertId };
		const res = await ApiClient.post('massAdvert/new/getWordsStatsForAdvert', params);
		console.log(res);
		if (!res || !res.data || res.data.wordsStats === undefined) {
			throw new Error(`No data for getWordsStatsForAdvert ${JSON.stringify(res)}`);
		}
		return res.data.wordsStats
	} catch (error: any) {
		throw new Error("Error in getWordsStatsForAdvert", error)

	}
}