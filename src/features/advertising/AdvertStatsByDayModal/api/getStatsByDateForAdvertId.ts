import callApi, { getUid } from "@/utilities/callApi";
import { AdvertDateDataDTO } from "../types/AdvertDateDataDTO";

export const getStatsByDateForAdvertId = async (campaignName: string, advertId: number): Promise<AdvertDateDataDTO[]> => {
	try {
		const params = {
			uid: getUid(),
			campaignName: campaignName,
			data: { advertId: advertId },
		};
		console.log(params);
		const res = await callApi('getStatsByDateForAdvertId', params);
		if (!res || !res.data || res.data.days == undefined) {
			throw Error(`No data in getStatsByDateForAdvertId for ${campaignName} advertID = ${advertId}`);
		}
		const result: AdvertDateDataDTO[] = [];
		for (const key of Object.keys(res.data.days)) {
			result.push({ ...res.data.days[key], date: new Date(key) })
		}
		console.log(result)
		return result;
	} catch (error: any) {
		console.error(error)
		throw new Error(error.message);
	}
}