'use client';

import {Button, Icon, NumberInput, Spin, Text} from '@gravity-ui/uikit';
import {Calculator, TrashBin} from '@gravity-ui/icons';
import {useState} from 'react';
import {motion} from 'framer-motion';
import {getNormalDateRange} from '@/utilities/getRoundValue';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {useNoCheckedRowsPopup} from '@/shared/ui/NoCheckedRowsPopup';
import {useCampaign} from '@/contexts/CampaignContext';
import {ModalWindow} from '@/shared/ui/Modal';
import {TextTitleWrapper} from '@/components/TextTitleWrapper';

interface CalcClubDiscountProps {
    disabled: boolean;
    dateRange: any;
    setPagesCurrent: ({}: any) => any;
    doc: any;
    setChangedDoc: ({}: any) => any;
    filteredData: any;
    lastCalcOldData: any;
    setLastCalcOldData: ({}: any) => any;
    setCurrentPricesCalculatedBasedOn: Function;
}

export const CalcClubDiscount = ({
    disabled,
    dateRange,
    setPagesCurrent,
    doc,
    setChangedDoc,
    filteredData,
    lastCalcOldData,
    setLastCalcOldData,
    setCurrentPricesCalculatedBasedOn,
}: CalcClubDiscountProps) => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    const [clubDiscount, setClubDiscount] = useState<number | null>(null);
    const [calculatingFlag, setCalculatingFlag] = useState(false);

    const parseResponse = (response: any) => {
        console.log('response', response);

        const tempOldData: any = {};
        for (const [art, artData] of Object.entries(response['pricesData'])) {
            tempOldData[art] = doc['pricesData'][art];
            doc['pricesData'][art] = artData;
        }

        setLastCalcOldData(tempOldData);
        setChangedDoc({...doc});
        setPagesCurrent(1);
    };

    const calcPrices = async (deleteFlag = false) => {
        try {
            setCalculatingFlag(true);
            const params: any = {
                seller_id: sellerId,
                dateRange: getNormalDateRange(dateRange),
                enteredValue: {
                    clubDiscount: deleteFlag ? 0 : clubDiscount,
                },
            };

            const filters = {
                brands: [] as string[],
                objects: [] as string[],
                arts: [] as string[],
            };
            for (let i = 0; i < filteredData.length; i++) {
                const row = filteredData[i];
                const {brand, object, art} = row ?? {};

                if (!filters.brands.includes(brand)) filters.brands.push(brand);
                if (!filters.objects.includes(object)) filters.objects.push(object);
                if (!filters.arts.includes(art)) filters.arts.push(art);
            }
            params.enteredValue['filters'] = filters;

            console.log(params);

            for (const [art, artData] of Object.entries(lastCalcOldData)) {
                doc['pricesData'][art] = artData;
            }
            setLastCalcOldData({});

            console.log(params);
            setOpen(false);

            const response = await ApiClient.post('prices/calc', params, 'json', true);
            if (response && response.data) {
                setCurrentPricesCalculatedBasedOn('clubDiscount');
                parseResponse(response.data);
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error(error);
            showError('Не удалось рассчитать цены.');
        } finally {
            setCalculatingFlag(false);
        }
    };

    const {NoCheckedRowsPopup, openNoCheckedRowsPopup} = useNoCheckedRowsPopup();

    const handleOpen = () => {
        if (filteredData?.length) {
            setOpen(true);
        } else openNoCheckedRowsPopup();
    };
    const handleClose = () => setOpen(false);

    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {NoCheckedRowsPopup}
            <Button
                disabled={disabled}
                loading={calculatingFlag}
                size="l"
                view="action"
                onClick={handleOpen}
            >
                <Icon data={Calculator} />
                <Text variant="subheader-1">WB Клуб</Text>
            </Button>
            <motion.div
                style={{
                    overflow: 'hidden',
                }}
                animate={{
                    maxWidth: calculatingFlag ? 40 : 0,
                    opacity: calculatingFlag ? 1 : 0,
                    marginLeft: calculatingFlag ? 8 : 0,
                }}
            >
                <Spin />
            </motion.div>
            <ModalWindow isOpen={open && !disabled} handleClose={handleClose}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <TextTitleWrapper padding={8} title="Введите скидку WB Клуба" style={{gap: 8}}>
                        <NumberInput
                            size="l"
                            value={clubDiscount}
                            onUpdate={(val) => setClubDiscount(val)}
                            min={3}
                            max={31}
                        />
                    </TextTitleWrapper>
                    <Text variant='body-2'>от 3% до 31%</Text>
                    <Button
                        selected
                        pin="circle-circle"
                        disabled={disabled || clubDiscount === null}
                        size="l"
                        view="action"
                        onClick={() => calcPrices()}
                    >
                        <Icon data={Calculator} />
                        Рассчитать скидку
                    </Button>
                    <Button
                        selected
                        pin="circle-circle"
                        disabled={disabled}
                        size="l"
                        view="flat-danger"
                        onClick={() => calcPrices(true)}
                    >
                        <Icon data={TrashBin} />
                        Удалить скидку
                    </Button>
                </div>
            </ModalWindow>
        </div>
    );
};
