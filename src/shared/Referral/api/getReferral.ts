
import ApiClient from "@/utilities/ApiClient";
import { Referral } from "../types";

export const getReferral = async (userId: number):Promise<Referral[]> => {
	try {
		console.log(userId)
		const res = await ApiClient.post('api/auth/create-referral', { user_id: userId });
		if (!res || !res.data || !res.data.referral === undefined) {
			throw new Error('No data in res');
		}
		return res.data.referral
	} catch (error:any) {
		console.error(error);
		throw new Error(error);
	}
}