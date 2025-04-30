import ApiClient from "@/utilities/ApiClient";
import { Note } from '../types'
export const getNotesByDateRange = async (seller_id: string): Promise<{ [key: string]: Note[] }> => {
	try {
		const res = await ApiClient.post('massAdvert/new/getNotes', { seller_id, grouped: true});
		console.log(res);
		if (!res || !res.data || res.data.notes === undefined) {
			throw new Error("No data in res for get notes")
		}
		return res.data.notes
	} catch (error: any) {
		console.error(error);
		throw new Error("Error while getting notes", error.message);
	}
}