export type Color = "positive" | "warning" | "danger" | "utility" | 'info' | 'normal'

export type Note = {
	id?: number,
	text?: string,
	time?: Date,
	color: Color,
	nmId: number,
	seller_id: string
}

export const colors: any = {
	info: 'rgb(54, 151, 241)',
	positive: 'rgb(77, 176, 155)',
	warning: 'rgb(255, 190, 92)',
	danger: 'rgb(229, 50, 93)',
	utility: 'rgb(154, 99, 209)',
	normal: 'white',
};