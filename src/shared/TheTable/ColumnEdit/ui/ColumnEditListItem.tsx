import {ArrowDown, ArrowUp, Check} from '@gravity-ui/icons';
import {Button, Checkbox, Icon, NumberInput, Text} from '@gravity-ui/uikit';
import {useState} from 'react';

interface ColumnEditItemProps {
    hidden: boolean;
    name: string;
    placeholder: string;
    changeOrder: (name: string, position: number) => void;
    setPosition: (name: string, position: number) => void;
    changeHidden: (name: string, hidden: boolean) => void;
}

export const ColumnEditItem = ({
    hidden,
    name,
    placeholder,
    changeOrder,
    setPosition,
    changeHidden,
}: ColumnEditItemProps) => {
    const [numberChangeOrder, setNumberChangeOrder] = useState<number>();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                justifyContent: 'space-between',
                alignContent: 'center',
                width: '100%',
                paddingInline: 4,
            }}
        >
            <div
                style={{
                    gap: 4,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '60%',
                    alignContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <Checkbox checked={!hidden} onUpdate={() => changeHidden(name, !hidden)} size="l" />
                <Text>{placeholder}</Text>
            </div>
            <div
                style={{
                    gap: 4,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '40%',
                    alignContent: 'center',
                }}
            >
                <NumberInput
                    value={numberChangeOrder}
                    // defaultValue={1}
                    size="m"
                    onUpdate={(value) => setNumberChangeOrder(value ?? 1)}
                    hiddenControls
                    endContent={
                        numberChangeOrder ? (
                            <Button onClick={() => setPosition(name, numberChangeOrder)} view='flat-success'>
                                <Icon data={Check} />
                            </Button>
                        ) : undefined
                    }
                />
                <Button onClick={() => changeOrder(name, -1)}>
                    <Icon data={ArrowUp} />
                </Button>
                <Button onClick={() => changeOrder(name, 1)}>
                    <Icon data={ArrowDown} />
                </Button>
            </div>
        </div>
    );
};
