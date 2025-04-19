import ApiClient from "@/utilities/ApiClient"

export const deleteNote = async (id: number, seller_id: string) => {
	try {
		await ApiClient.post('massAdvert/new/deleteNote', { id: id, seller_id: seller_id })
	}
	catch (error: any) {
		console.error(error);
		throw new Error("error while deleting note", error.text)
	}
}