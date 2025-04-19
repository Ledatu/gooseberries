import ApiClient from "@/utilities/ApiClient";
import { Note } from "../types";

export const insertNote = async (seller_id: string, note: Note) => {
	try {
		await ApiClient.post("massAdvert/new/writeNote", { seller_id: seller_id, note: note })
	} catch (error: any) {
		console.error(error);
		throw new Error("Error in insertNote", error.message)
	}
}