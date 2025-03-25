import ApiClient from "@/utilities/ApiClient";
import { ClusterData, clusterDataMap } from "./mapper";

interface fetchClusterStatsParams {
	advertId: number,
	seller_id: string,
	startDate?: Date,
	endDate?: Date,
	excluded?: boolean
}


export const fetchClusterStats = async (advertId: number, sellerId: string, excluded: boolean = false, startDate?: Date, endDate?: Date): Promise<{ startTime: Date, endTime: Date, clusterData: ClusterData[] }> => {
	try {
		const params: fetchClusterStatsParams = { advertId: advertId, seller_id: sellerId };
		params['excluded'] = excluded ?? false;
		startDate ? params['startDate'] = startDate : undefined;
		endDate ? params['endDate'] = endDate : undefined;
		console.log(params);
		const res = await ApiClient.post('massAdvert/new/getAdvertKeywordStats', params);
		console.log(res);
		if (!res || !res.data) {
			throw new Error('Error, didnt get data of advertId');
		}
		const { startTime, endTime, clusterStats } = res.data;
		const start = new Date(startTime);
		const end = new Date(endTime)
		return { startTime: start, endTime: end, clusterData: clusterStats.map(clusterDataMap) };
	} catch (error: any) {
		console.error(error)
		throw new Error("Error while getting cluster stats", error);
	}
};