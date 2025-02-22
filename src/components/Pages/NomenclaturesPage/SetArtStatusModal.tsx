'use client';

import {ArrowToggle, Button, Card, Icon, Modal, Select} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {
    useState,
    Children,
    isValidElement,
    ReactElement,
    useMemo,
    ReactNode,
    cloneElement,
} from 'react';
import ApiClient from '@/utilities/ApiClient';
import {useError} from '@/contexts/ErrorContext';

interface SetArtStatusModalProps {
    children: ReactNode;
    sellerId: string;
    filteredData: any;
    setUpdate: ({}: any) => any;
}

export const SetArtStatusModal = ({
    children,
    sellerId,
    filteredData,
    setUpdate,
}: SetArtStatusModalProps) => {
    const {showError} = useError();

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(['active']);
    const statusOptions = useMemo(
        () => [
            {
                content: 'Активен',
                value: 'active',
            },
            {
                content: 'Не активен',
                value: 'disabled',
            },
        ],
        [],
    );

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AdvertsBudgetsModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <div>
            {triggerButton}
            <Modal open={open} onClose={handleClose}>
                <Card
                    view="clear"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            width: 250,
                            border: '1px solid #eee2',
                        }}
                    >
                        <Select
                            size="l"
                            width={'max'}
                            value={status}
                            options={statusOptions}
                            onUpdate={(status) => setStatus(status)}
                            renderControl={({triggerProps: {onClick, onKeyDown}}) => {
                                return (
                                    <Button
                                        // ref={ref as Ref<HTMLButtonElement>}
                                        width="max"
                                        view={
                                            status[0] == 'active'
                                                ? 'outlined-success'
                                                : 'outlined-danger'
                                        }
                                        pin={'circle-circle'}
                                        // ref={ref}
                                        size="l"
                                        selected
                                        onClick={onClick}
                                        onKeyDown={onKeyDown}
                                        // extraProps={{
                                        //     onKeyDown,
                                        // }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {{active: 'Активен', disabled: 'Не активен'}[status[0]]}
                                            <div style={{minWidth: 8}} />
                                            <ArrowToggle />
                                        </div>
                                    </Button>
                                );
                            }}
                        />
                        <div style={{minHeight: 8}} />
                        <Button
                            size="l"
                            pin="circle-circle"
                            selected
                            onClick={async () => {
                                try {
                                    const params = {
                                        seller_id: sellerId,
                                        data: {
                                            status: status[0],
                                            nmIds: [] as string[],
                                        },
                                    };
                                    for (const row of filteredData) {
                                        const {nmId} = row;
                                        if (!params.data.nmIds.includes(nmId))
                                            params.data.nmIds.push(nmId);
                                    }
                                    console.log(params);
                                    const response = await ApiClient.post(
                                        'nomenclatures/set-status',
                                        params,
                                    );
                                    if (response && response.data) {
                                        setUpdate(true);
                                    } else {
                                        console.error('No data received from the API');
                                    }
                                } catch (error) {
                                    showError('Не удалось установить статус артикулов.');
                                }
                                setOpen(false);
                            }}
                        >
                            <Icon data={CloudArrowUpIn} />
                            Сохранить
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
