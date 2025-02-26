import { useState } from "react";
import { ColumnData } from '../types';
export interface useColumnsEditProps {
	columns: any[];
	setColumns: ({ }: any) => any;
	columnDataObj: any;
	saveColumnsData: () => any;
}

export const useColumnsEdit = ({ columns, setColumns, columnDataObj, saveColumnsData }: useColumnsEditProps) => {

	const [columnsData, setColumnsData] = useState<ColumnData[]>(
		columns.map((column: any) => {
			return {
				name: columnDataObj[column.key].name,
				placeholder: columnDataObj[column.key].placeholder,
				visibility: column.visibility,
			};
		}),
	);
	const toggleColumnVisibility = (key: string, value: boolean) => {
		setColumns((prevColumns: any[]) =>
			prevColumns.map((col) => (col.key === key ? { ...col, visibility: value } : col)),
		);
	};
	return { columnsData, setColumnsData, toggleColumnVisibility, saveColumnsData }
}