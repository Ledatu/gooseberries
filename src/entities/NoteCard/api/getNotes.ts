import ApiClient from "@/utilities/ApiClient";
import { Note } from '../types'
export const getNotes = async (seller_id: string): Promise<Note[]> => {
	try {
		const res = await ApiClient.post('massAdvert/new/getNotes', { seller_id });
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