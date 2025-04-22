import ApiClient from "@/utilities/ApiClient";
import { PhrasesStats } from "../types/PhraseStats";

export const getPhrasesStats = async (sellerId: string, advertId: number, cluster: string): Promise<PhrasesStats[]> => {
	try {
		const params = { advertId, cluster, seller_id: sellerId };
		const res = await ApiClient.post('massAdvert/new/getPhrasesStatsForCluster', params);
		console.log(res);
		if (!res || !res.data || res.data.phrasesStats === undefined) {
			throw new Error("No data for getPhrasesStats");
		}
		return res.data.phrasesStats;
	}
	catch (error: any) {
		throw new Error("error in getPhrasesStats", error);
	}
}