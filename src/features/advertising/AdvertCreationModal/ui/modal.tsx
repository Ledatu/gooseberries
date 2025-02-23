'use client';

import {Button, Text, Checkbox, Select, Icon} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {Children, isValidElement, ReactElement, cloneElement} from 'react';
import {ModalWindow} from '@/shared/ui/Modal';
import {useAdvertCreation} from '../hooks';

interface AdvertCreateModalProps {
    sellerId: string;
    children: ReactElement | ReactElement[];
    doc: any;
    filteredData: any[];
    setChangedDoc: Function;
}

export const AdvertCreateModal = ({
    sellerId,
    children,
    doc,
    setChangedDoc,
    filteredData,
}: AdvertCreateModalProps) => {
    const {
        open,
        confirmationOpen,
        advertsCount,
        createAdvertsMode,
        advertTypeSwitchValue,
        setAdvertTypeSwitchValue,
        setCreateAdvertsMode,
        handleOpen,
        handleClose,
        handleConfirmationClose,
        handleCreateButtonClick,
        calculateSum,
        handleConfirmCreate,
    } = useAdvertCreation(sellerId, doc, setChangedDoc);

    const childArray = Children.toArray(children);
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
                <Text variant="display-2">Создание РК</Text>
                <div style={{minHeight: 8}} />
                <Select
                    size="l"
                    width={'max'}
                    value={advertTypeSwitchValue}
                    options={[
                        {value: 'Авто', content: 'Авто'},
                        {value: 'Поиск', content: 'Поиск'},
                    ]}
                    onUpdate={setAdvertTypeSwitchValue}
                />
                <Checkbox
                    style={{margin: '8px 0'}}
                    checked={createAdvertsMode}
                    onUpdate={setCreateAdvertsMode}
                >
                    Создание РК 1к1
                </Checkbox>
                <Button
                    onClick={() => handleCreateButtonClick(filteredData)}
                    selected
                    size="l"
                    pin="circle-circle"
                    view="flat-success"
                >
                    <Icon data={CloudArrowUpIn} />
                    Создать
                </Button>
            </ModalWindow>

            <ModalWindow isOpen={confirmationOpen} handleClose={handleConfirmationClose}>
                <Text variant="display-2">Подтверждение</Text>
                <div style={{minHeight: 8}} />
                {advertsCount !== 0 && (
                    <div className="text-center">
                        <Text>Будет создано {advertsCount} реклам.</Text>
                        <br />
                        <Text>
                            На сумму{' '}
                            <span className="text-red-400 underline underline-offset-2">
                                {calculateSum()} тыс. рублей
                            </span>
                        </Text>
                    </div>
                )}
                <Button
                    className={'mt-5 mb-5'}
                    onClick={async () => {
                        await handleConfirmCreate(filteredData);
                        // handleConfirmationClose();
                    }}
                    selected
                    size="l"
                    pin="circle-circle"
                    view="flat-success"
                >
                    Подтвердить
                </Button>
                <Button onClick={handleConfirmationClose} size="l" pin="circle-circle" view="flat">
                    Отмена
                </Button>
            </ModalWindow>
        </>
    );
};
