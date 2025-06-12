import {useCampaign} from '@/contexts/CampaignContext';
import {useError} from '@/contexts/ErrorContext';
import {ModalWindow} from '@/shared/ui/Modal';
import {useNoCheckedRowsPopup} from '@/shared/ui/NoCheckedRowsPopup';
import ApiClient from '@/utilities/ApiClient';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';
import {Children, cloneElement, isValidElement, ReactElement, useState} from 'react';

interface SendClubDiscountModalProps {
    children: ReactElement<any, any>;
    checkedData: any[];
    lastCalcOldData: any;
    setLastCalcOldData: Function;
    doc: any;
    setDoc: Function;
    setCurrentPricesCalculatedBasedOn: Function;
}

export const SendClubDiscountModal = ({
    children,
    checkedData,
    lastCalcOldData,
    setLastCalcOldData,
    doc,
    setDoc,
    setCurrentPricesCalculatedBasedOn,
}: SendClubDiscountModalProps) => {
    const [open, setOpen] = useState(false);
    const {NoCheckedRowsPopup, openNoCheckedRowsPopup} = useNoCheckedRowsPopup();
    const {sellerId} = useCampaign();
    const {showError} = useError();

    const handleOpen = () => {
        if (checkedData?.length) {
            setOpen(true);
        } else openNoCheckedRowsPopup();
    };
    const handleClose = () => {
        setOpen(false);
    };

    const childArray = Children.toArray(children);

    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('SendClubDiscountModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const handleSendButton = async () => {
        setOpen(false);
        if (!checkedData.length) return;
        const params = {
            seller_id: sellerId,
            dataClub: [] as any[],
        };

        const tempOldData = {...lastCalcOldData};

        const byNmIdClub: any = {};
        for (let i = 0; i < checkedData.length; i++) {
            const {nmId, clubDiscountNeeded, art} = checkedData[i];
            if (
                nmId &&
                ((clubDiscountNeeded >= 3 && clubDiscountNeeded <= 31) || clubDiscountNeeded === 0)
            ) {
                byNmIdClub[nmId] = {
                    nmID: nmId,
                    clubDiscount: clubDiscountNeeded,
                };

                delete tempOldData[art]; // delete to prevent reset to default
            }
        }

        setLastCalcOldData(tempOldData);

        for (const [nmId, nmIdData] of Object.entries(byNmIdClub)) {
            if (nmId === undefined || nmIdData === undefined) continue;
            params.dataClub.push(nmIdData);
        }

        setDoc({...doc});

        console.log(params);

        try {
            await ApiClient.post('prices/set-wb-club-discount', params);
        } catch (error) {
            console.error(new Date(), error);
            showError('Не удалось отправить скидки.');
        }

        setCurrentPricesCalculatedBasedOn('');
    };

    return (
        <>
            {NoCheckedRowsPopup}
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            margin: '8px 0',
                            textWrap: 'nowrap',
                        }}
                        variant="display-2"
                    >
                        Обновить скидку WB Клуба
                    </Text>
                    <Button
                        view="action"
                        style={{
                            margin: '4px 0px',
                        }}
                        pin={'circle-circle'}
                        size={'l'}
                        selected={true}
                        onClick={handleSendButton}
                    >
                        <Icon data={CloudArrowUpIn} />
                        Отправить
                    </Button>
                </div>
            </ModalWindow>
        </>
    );
};
