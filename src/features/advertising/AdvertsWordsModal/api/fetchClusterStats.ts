import ApiClient from "@/utilities/ApiClient";
import { ClusterData, clusterDataMap } from "./mapper";


export const fetchClusterStats = async (advertId: number, sellerId: string): Promise<{ startTime: Date, endTime: Date, clusterData: ClusterData[] }> => {
	try {
		const params = { advertId: advertId, seller_id: sellerId };
		const res = await ApiClient.post('massAdvert/new/getAdvertKeywordStats', params);
		console.log(res);
		if (!res || !res.data) {
			throw new Error('Error, didnt get data of advertId');
		}
		const { startTime, endTime, clusterStats } = res.data;
		return { startTime, endTime, clusterData: clusterStats.map(clusterDataMap) };
	} catch (error: any) {
		console.error(error)
		throw new Error("Error while getting cluster stats", error);
	}
};