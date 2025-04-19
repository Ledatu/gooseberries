import { Color } from "./Color";

export type Note = {
	id?: number,
	text: string,
	date: Date,
	section?: string,
	color: Color,
	seller_id: string,
}