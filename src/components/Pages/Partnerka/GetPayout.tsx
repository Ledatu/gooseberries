import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {ModalWindow} from '@/shared/ui/Modal';
import ApiClient from '@/utilities/ApiClient';
import {Button, NumberInput, Text} from '@gravity-ui/uikit';
import {Children, cloneElement, isValidElement, ReactElement, useMemo, useState} from 'react';

interface GetPayoutI {
    children: ReactElement<any, any>;
    balance: number;
    setUpdateFlag: Function;
}

export const GetPayout = ({children, balance, setUpdateFlag}: GetPayoutI) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClick = async () => {
        handleClose();
        try {
            const response = await ApiClient.post('massAdvert/new/get-payout', {sum});
            console.log(new Date(), 'get-payout', response);
            setUpdateFlag(true);
        } catch (error) {
            console.error(new Date(), error);
        }
    };

    const [sum, setSum] = useState<number | null>(balance ? balance : 900);
    const sumValid = useMemo(() => sum !== null && sum >= 900 && sum <= balance, [sum, balance]);

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
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div style={{gap: 12, display: 'flex', flexDirection: 'column'}}>
                    <TextTitleWrapper padding={8} title="Укажите сумму">
                        <NumberInput
                            placeholder={
                                900 <= balance
                                    ? `От 900 до ${balance}`
                                    : 'Недостаточно средств на балансе.'
                            }
                            validationState={sumValid ? undefined : 'invalid'}
                            size="l"
                            value={sum}
                            errorMessage="Вы не можете вывеси данную сумму."
                            onUpdate={(val) => {
                                setSum(val);
                                console.log(val);
                            }}
                            max={balance}
                            min={900}
                        />
                    </TextTitleWrapper>
                    <Button
                        disabled={!sumValid}
                        pin="circle-circle"
                        selected
                        size="l"
                        onClick={handleClick}
                        href={'https://t.me/AurumSkyNetSupportBot'}
                        target={'_blank'}
                    >
                        Запросить выплату
                    </Button>
                    <Text variant="caption-2" color="secondary">
                        Для проведения выплаты вы будете направлены в поддержку. <br /> Не забудьте
                        сообщить оператору, что вы хотите получить выплату <br /> по партнерской
                        программе.
                    </Text>
                </div>
            </ModalWindow>
        </>
    );
};
