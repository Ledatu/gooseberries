import {Card, Checkbox, Text} from '@gravity-ui/uikit';
import {ColumnData} from '../types';
import {Reorder, useDragControls, useMotionValue} from 'framer-motion';
import {ReorderIcon} from './DragIcon';

interface ListColumnItemProps {
    item: ColumnData;
    toggleColumnVisibility: Function;
}

export const ListColumnItem = ({item, toggleColumnVisibility}: ListColumnItemProps) => {
    const y = useMotionValue(0);
    const dragControls = useDragControls();
    return (
        <Reorder.Item
            key={item.name}
            value={item}
            dragListener={false}
            dragControls={dragControls}
            style={{width: 200, y}}
        >
            <Card
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '50px',
                    width: '200px',
                }}
            >
                <Checkbox
                    checked={item.visibility}
                    onUpdate={(value) => toggleColumnVisibility(item.name, value)}
                />
                <div style={{minWidth: 4}} />
                <Text>{item.placeholder}</Text>
                <div style={{marginLeft: 'auto', marginRight: 16}}>
                    <ReorderIcon dragControls={dragControls} />
                </div>
            </Card>
        </Reorder.Item>
    );
};
