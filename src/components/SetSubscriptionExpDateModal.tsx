import {Button, Card, Icon, Modal, TextInput, Text} from '@gravity-ui/uikit';
import {CloudArrowUpIn, Calendar as CalendarIcon} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState, Children, isValidElement, ReactElement, useMemo, useEffect} from 'react';
import {Calendar} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import {useError} from 'src/pages/ErrorContext';
import ApiClient from 'src/utilities/ApiClient';
import {getLocaleDateString} from 'src/utilities/getRoundValue';
import {useUser} from './RequireAuth';

export const SetSubscriptionExpDateModal = ({
    children,
    campaignName,
    sellerId,
}: {
    children: ReactElement | ReactElement[];
    campaignName: string;
    sellerId: string;
}) => {
    const {showError} = useError();
    const {refetchUser} = useUser();
    const [open, setOpen] = useState(false);

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
        console.error('AdvertsBidsModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const [subExpDate, setSubExpDate] = useState(undefined as any);
    const subExpDateValid = useMemo(() => {
        return subExpDate && subExpDate != 'Invalid Date';
    }, [subExpDate]);

    useEffect(() => {
        setSubExpDate(undefined);
    }, [open]);

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
                            border: '1px solid #eee2',
                        }}
                    >
                        <Text variant="header-1">{campaignName}</Text>
                        <motion.div
                            animate={{
                                height: subExpDateValid ? 44 : 0,
                            }}
                            style={{
                                width: '100%',
                                height: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <TextInput
                                size="l"
                                value={subExpDate ? subExpDate.toLocaleDateString(0, 10) : ''}
                                rightContent={
                                    <Button
                                        size="m"
                                        view="outlined"
                                        onClick={() => setSubExpDate(undefined)}
                                    >
                                        <Icon data={CalendarIcon} />
                                    </Button>
                                }
                            />
                        </motion.div>
                        <motion.div
                            animate={{
                                height: !subExpDateValid ? 250 : 0,
                            }}
                            style={{
                                height: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <Calendar
                                minValue={dateTimeParse(new Date())}
                                onUpdate={(val) => {
                                    setSubExpDate(val.toDate());
                                }}
                            />
                        </motion.div>
                        <Button
                            size="l"
                            pin="circle-circle"
                            view="flat-success"
                            selected
                            disabled={!subExpDateValid}
                            onClick={async () => {
                                if (!subExpDate) return;

                                const date = new Date(subExpDate);

                                const params = {
                                    seller_id: sellerId,
                                    subscriptionUntil: getLocaleDateString(date),
                                };

                                try {
                                    await ApiClient.post('auth/set-sub-exp-date', params);
                                    refetchUser();
                                } catch (error) {
                                    console.error(error);
                                    showError(
                                        error.response?.data?.error ||
                                            'Не удалось установить дату подписки.',
                                    );
                                }
                                handleClose();
                            }}
                        >
                            <Icon data={CloudArrowUpIn} />
                            Подтвердить
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
