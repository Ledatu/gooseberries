
import ApiClient from "@/utilities/ApiClient";
import { Referral } from "../types";

export const deleteReferral = async (userId: number, referral: string):Promise<Referral[]> => {
	try {
		console.log(userId, referral)
		const res = await ApiClient.post('api/auth/delete-referral', { user_id: userId, referral });
		if (!res || !res.data || !res.data.referral === undefined) {
			throw new Error('No data in res');
		}
		return res.data.referral
	} catch (error:any) {
		console.error(error);
		throw new Error(error);
	}
}