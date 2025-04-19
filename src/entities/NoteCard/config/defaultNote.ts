import { Note } from "../types/Note";

export const defaultNote = (sellerId: string): Note => {
	return {
		seller_id: sellerId,
		text: '',
		color: 'normal',
		date: new Date()
	}
}