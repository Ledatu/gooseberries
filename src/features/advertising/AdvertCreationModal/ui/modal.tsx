'use client';

import {Button, Text, Checkbox, Select, Icon} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {Children, isValidElement, ReactElement, cloneElement} from 'react';
import {ModalWindow} from '@/shared/ui/Modal';
import {useAdvertCreation} from '../hooks';
import {useNoCheckedRowsPopup} from '@/shared/ui/NoCheckedRowsPopup';

interface AdvertCreateModalProps {
    children: ReactElement | ReactElement[];
    doc: any;
    filteredData: any[];
    setChangedDoc: Function;
}

export const AdvertCreateModal = ({
    children,
    doc,
    setChangedDoc,
    filteredData,
}: AdvertCreateModalProps) => {
    const {
        open,
        confirmationOpen,
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
    } = useAdvertCreation(doc, setChangedDoc);

    const childArray = Children.toArray(children);
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const count = calculateSum();

    const {NoCheckedRowsPopup, openNoCheckedRowsPopup} = useNoCheckedRowsPopup();

    const triggerFunc = () => {
        if (filteredData?.length) handleOpen();
        else openNoCheckedRowsPopup();
    };

    const triggerButton = cloneElement(triggerElement, {
        onClick: triggerFunc,
    });

    return (
        <>
            {NoCheckedRowsPopup}
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
                {count !== 0 && (
                    <div className="text-center" style={{minWidth: 600}}>
                        <Text variant="header-1">Будет создано {count} РК.</Text>
                        <br />
                        <Text variant="header-1">
                            На сумму{' '}
                            <span className="text-red-400 underline underline-offset-2">
                                {count * 1000} ₽
                            </span>
                        </Text>
                    </div>
                )}
                {count === 0 && (
                    <div className="text-center">
                        <Text variant="header-1">Товары не выбраны, РК созданы не будут.</Text>
                    </div>
                )}
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 8, gap: 8}}>
                    {count !== 0 && (
                        <Button
                            onClick={async () => {
                                await handleConfirmCreate(filteredData);
                                // handleConfirmationClose();
                            }}
                            size="l"
                            pin="circle-circle"
                            view="flat"
                        >
                            Подтвердить
                        </Button>
                    )}
                    <Button
                        onClick={handleConfirmationClose}
                        size="l"
                        selected
                        pin="circle-circle"
                        view="flat-success"
                    >
                        {count !== 0 ? 'Отмена' : 'Закрыть'}
                    </Button>
                </div>
            </ModalWindow>
        </>
    );
};
