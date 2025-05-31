export type TableDataDto = {
	userId: number,
	tableId: string,
	paginationSize: number,
	order: string[],
	hidden: string[],
}