'use client';

import {Button, Icon, Text, TextInput} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {Children, isValidElement, ReactElement, useState, cloneElement} from 'react';
import ApiClient from '@/utilities/ApiClient';
import {useError} from '@/contexts/ErrorContext';
import {ModalWindow} from '@/shared/ui/Modal';

export const EditSubscription = ({children, setUpdate, filteredData, enteredValueKey}: any) => {
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');

    const keys = {
        salePercent: {name: 'Скидка %', type: 'number'},
        saleRubles: {name: 'Скидка ₽', type: 'number'},
        fixedTarif: {name: 'Фикс. тариф', type: 'number'},
        comment: {name: 'Комментарий', type: 'text'},
    };

    const handleOpen = async () => {
        setEnteredValue('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const invalid =
        (isNaN(Number(enteredValue)) || enteredValue == '') &&
        (keys as any)[enteredValueKey]?.type != 'text';

    return (
        <>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <Text
                    style={{
                        margin: '8px 0',
                    }}
                    variant="header-2"
                >
                    {(keys as any)[enteredValueKey]?.name ?? ''}
                </Text>
                <TextInput
                    autoFocus
                    size="l"
                    validationState={invalid ? 'invalid' : undefined}
                    placeholder={'Введите значение'}
                    value={enteredValue}
                    onUpdate={(val) => {
                        setEnteredValue(
                            (keys as any)[enteredValueKey]?.type != 'text'
                                ? val.replace(/,/g, '.')
                                : val,
                        );
                    }}
                />
                <div style={{minHeight: 8}} />
                <Button
                    size="l"
                    pin="circle-circle"
                    selected
                    disabled={invalid}
                    view="action"
                    onClick={async () => {
                        const params = {
                            data: {
                                enteredValue: {},
                                seller_ids: [] as any[],
                            },
                        };

                        for (let i = 0; i < filteredData.length; i++) {
                            const row = filteredData[i];
                            const {seller_id: sellerId} = row ?? {};
                            if (!sellerId) continue;
                            params.data.seller_ids.push(sellerId);
                        }

                        params.data.enteredValue = {
                            key: enteredValueKey,
                            val: enteredValue,
                            type: (keys as any)[enteredValueKey].type,
                        };
                        console.log(params);

                        try {
                            const response = await ApiClient.post('campaigns/edit', params);
                            if (response && response.data) {
                                setUpdate(true);
                            } else {
                                console.error('No data received from the API');
                            }
                        } catch (error) {
                            showError('Не удалось обновить информацию о подписках.');
                        }

                        setOpen(false);
                    }}
                >
                    <Icon data={CloudArrowUpIn} />
                    Сохранить
                </Button>
            </ModalWindow>
        </>
    );
};
