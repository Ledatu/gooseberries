import {ModalWindow} from '@/shared/ui/Modal';
import {Button, Text} from '@gravity-ui/uikit';
import {Children, cloneElement, isValidElement, ReactElement, useMemo, useState} from 'react';
import {Operation} from './PartnerkaPage';

interface GetPayoutI {
    children: ReactElement<any, any>;
    operations: Operation[];
}

export const OperationHistory = ({children, operations}: GetPayoutI) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const operationList = useMemo(
        () =>
            operations
                .map((operation) => (
                    <Button view="flat" size="l" pin="clear-clear" style={{height: 90}}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                                justifyContent: 'center',
                                gap: 8,
                                height: '100%',
                                width: '40vh',
                            }}
                        >
                            <Text variant="header-1">
                                {`${(operation?.sum ?? 0) > 0 ? '+' : ''}${new Intl.NumberFormat('ru-RU').format(operation?.sum ?? 0)} ₽`}
                            </Text>
                            <Text
                                variant="subheader-1"
                                style={{textWrap: 'wrap', maxWidth: 300}}
                            >{`${operation?.comment}`}</Text>
                            <Text
                                variant="caption-2"
                                color="secondary"
                            >{`${new Date(operation?.date ?? '').toLocaleString('ru-RU')}`}</Text>
                        </div>
                    </Button>
                ))
                .toReversed(),
        [operations],
    );

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <ModalWindow padding={false} isOpen={open} handleClose={handleClose}>
                <div style={{gap: 16, display: 'flex', flexDirection: 'column'}}>
                    <Text style={{margin: 16, marginBottom: 0}} variant="header-2">
                        История операций
                    </Text>
                    <div
                        style={{
                            gap: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '50vh',
                            overflow: 'auto',
                        }}
                    >
                        {operationList}
                    </div>
                    <div />
                </div>
            </ModalWindow>
        </>
    );
};
