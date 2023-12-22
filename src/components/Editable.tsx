import React from 'react';
import {Table, withTableSorting} from '@gravity-ui/uikit';

const MyTable = withTableSorting(Table);
const data = [
    {Магазин: 'МАЮША', 'Ключ Апи': 'Hello'},
    {Магазин: 'DELICATUS', 'Ключ Апи': 'World!'},
];
const columns = [
    {id: 'Магазин', meta: {copy: ({id}) => `ID #${id}`}},
    {id: 'Ключ Апи', meta: {copy: true}},
];

export const Editable = () => {
    // const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    return <MyTable data={data} columns={columns} />;
};
