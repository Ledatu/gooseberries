import React from 'react';
import {Table, withTableSelection} from '@gravity-ui/uikit';

const MyTable = withTableSelection(Table);
const data = [
    {Магазин: 'МАЮША', 'Ключ Апи': 'Hello'},
    {Магазин: 'DELICATUS', 'Ключ Апи': 'World!'},
];
const columns = [
    {id: 'Магазин', meta: {copy: ({id}) => `ID #${id}`}},
    {id: 'Ключ Апи', meta: {copy: true}},
];

export const ListOfApiKeys = () => {
    const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    return (
        <MyTable
            data={data}
            columns={columns}
            onSelectionChange={(val) => {
                console.log(val, selectedIds);
                setSelectedIds(val);
            }}
            selectedIds={selectedIds}
        />
    );
};
