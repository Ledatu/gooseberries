'use client';

import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {useCampaign} from '@/contexts/CampaignContext';
import {useError} from '@/contexts/ErrorContext';
import {ModalWindow} from '@/shared/ui/Modal';
import ApiClient from '@/utilities/ApiClient';
import {Button, Loader, NumberInput, TextArea, TextInput} from '@gravity-ui/uikit';
import {Children, cloneElement, isValidElement, ReactElement, useMemo, useState} from 'react';

export const CheckTemplateModal = ({children, template}: {children: any; template: any}) => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        console.log(template);
    };
    const handleClose = () => setOpen(false);

    const [name, setName] = useState('');
    const nameValid = useMemo(() => name.length != 0, [name]);

    const [rating, setRating] = useState(5);

    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');
    const [text, setText] = useState('');
    const [nmId, setNmId] = useState('');
    const nmIdValid = useMemo(() => nmId.length != 0, [nmId]);

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

    const [checkResult, setCheckResult] = useState('none');
    const [checkingResult, setCheckingResult] = useState(false);

    const handleCheck = async () => {
        setCheckingResult(true);
        try {
            const params = {
                seller_id: sellerId,
                template,
                feedback: {
                    productValuation: rating,
                    text,
                    userName: name,
                    pros,
                    cons,
                    nmId,
                },
            };
            console.log('cheking', params);

            const response = (await ApiClient.post('buyers/check-template', params)) as any;

            if (!response.data) {
                setCheckResult('Данный шаблон не подходит под указанный отзыв');
                setCheckingResult(false);
                return;
            }

            setCheckResult(response?.data ?? 'Данный шаблон не подходит под указанный отзыв');
        } catch (error: any) {
            console.error(error);
            showError(error?.response?.data?.error || 'An unknown error occurred');
        }
        setCheckingResult(false);
    };

    return (
        <>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                        <TextTitleWrapper title="Имя">
                            <TextInput
                                validationState={nameValid ? undefined : 'invalid'}
                                style={{minWidth: 200, width: 200}}
                                size="l"
                                value={name}
                                onUpdate={(val) => setName(val)}
                            />
                        </TextTitleWrapper>
                        <TextTitleWrapper title="Оценка">
                            <NumberInput
                                size="l"
                                style={{minWidth: 100, width: 100}}
                                min={1}
                                max={5}
                                value={rating}
                                onUpdate={(val) => setRating(val ?? 1)}
                            />
                        </TextTitleWrapper>
                    </div>
                    <TextTitleWrapper title="Плюсы">
                        <TextArea size="l" value={pros} onUpdate={(val) => setPros(val)} />
                    </TextTitleWrapper>
                    <TextTitleWrapper title="Минусы">
                        <TextArea size="l" value={cons} onUpdate={(val) => setCons(val)} />
                    </TextTitleWrapper>
                    <TextTitleWrapper title="Комментарий">
                        <TextArea size="l" value={text} onUpdate={(val) => setText(val)} />
                    </TextTitleWrapper>
                    <TextTitleWrapper title="Артикул WB">
                        <TextInput
                            validationState={nmIdValid ? undefined : 'invalid'}
                            size="l"
                            value={nmId}
                            onUpdate={(val) => setNmId(val)}
                        />
                    </TextTitleWrapper>
                    {checkingResult ? (
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Loader />
                        </div>
                    ) : (
                        <TextTitleWrapper title="Результат">
                            <TextArea
                                readOnly
                                size="l"
                                errorMessage="Более 1000 символов в ответе."
                                validationState={checkResult.length <= 1000 ? undefined : 'invalid'}
                                value={
                                    checkResult != 'none' ? checkResult : 'Сначала проверьте шаблон'
                                }
                            />
                        </TextTitleWrapper>
                    )}
                    <Button
                        disabled={!nameValid || !nmIdValid}
                        view="action"
                        size="l"
                        pin="circle-circle"
                        width="max"
                        onClick={handleCheck}
                    >
                        Проверить шаблон
                    </Button>
                </div>
            </ModalWindow>
        </>
    );
};
