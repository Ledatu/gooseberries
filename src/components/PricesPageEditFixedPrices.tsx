import {Button, Card, Checkbox, Icon, Modal, Text, TextInput} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import callApi, {getUid} from 'src/utilities/callApi';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import {motion} from 'framer-motion';

export const NomenclaturesPageEditParameter = ({
    children,
    setUpdate,
    selectValue,
    filteredData,
    enteredValueKey,
}) => {
    const [open, setOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');

    const [editCheck, setEditCheck] = useState(false);
    const [editPercent, setEditPercent] = useState(false);

    const keys = {
        factoryArt: {name: 'Артикул фабрики', type: 'text'},
        myStocks: {name: 'Мои остатки, шт.', type: 'number'},
        multiplicity: {name: 'Кратность короба, шт.', type: 'number'},
        length: {name: 'Длина, см.', type: 'number'},
        width: {name: 'Ширина, см.', type: 'number'},
        height: {name: 'Высота, см.', type: 'number'},
        weight: {name: 'Вес, кг.', type: 'number'},
        ktr: {name: 'КТР WB, %', type: 'number'},
        commision: {name: 'Коммисия WB, %', type: 'number'},
        tax: {name: 'Ставка налога, %', type: 'number'},
        expences: {name: 'Доп. расходы, %', type: 'number'},
        prefObor: {name: 'План. оборачиваемость, д.', type: 'number'},
        minStocks: {name: 'Мин. остаток, шт.', type: 'number'},
        primeCost1: {name: 'Себестоимость 1, ₽', type: 'number'},
        primeCost2: {name: 'Себестоимость 2, ₽', type: 'number'},
        primeCost3: {name: 'Себестоимость 3, ₽', type: 'number'},
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

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const invalid =
        (isNaN(Number(enteredValue)) || enteredValue == '') &&
        keys[enteredValueKey]?.type != 'text';

    return (
        <>
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
                            width: 404,
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#221d220f',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <Text
                            style={{
                                margin: '8px 0',
                            }}
                            variant="header-2"
                        >
                            {keys[enteredValueKey]?.name ?? ''}
                        </Text>
                        <TextInput
                            autoFocus
                            size="l"
                            validationState={invalid ? 'invalid' : undefined}
                            placeholder={'Введите значение'}
                            value={enteredValue}
                            onUpdate={(val) => {
                                setEnteredValue(val);
                            }}
                        />
                        {keys[enteredValueKey]?.type != 'text' ? (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div style={{minHeight: 8}} />
                                <Checkbox
                                    size="l"
                                    checked={editCheck}
                                    onUpdate={(val) => {
                                        setEditCheck(val);
                                        if (!val) setEditPercent(false);
                                    }}
                                >
                                    Изменить относительно текущего значения
                                </Checkbox>
                                <div style={{minHeight: 8}} />
                                <Checkbox
                                    size="l"
                                    checked={editPercent}
                                    onUpdate={(val) => {
                                        setEditPercent(val);
                                        if (val) setEditCheck(true);
                                    }}
                                >
                                    Изменить в процентах
                                </Checkbox>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div style={{minHeight: 8}} />
                        <Button
                            size="l"
                            pin="circle-circle"
                            selected
                            disabled={invalid}
                            view="action"
                            onClick={async () => {
                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    data: {
                                        enteredValue: {},
                                        barcodes: [] as any[],
                                    },
                                };

                                for (let i = 0; i < filteredData.length; i++) {
                                    const row = filteredData[i];
                                    const {barcode} = row ?? {};
                                    if (barcode === undefined) continue;
                                    if (!params.data.barcodes.includes(barcode))
                                        params.data.barcodes.push(barcode);
                                }

                                params.data.enteredValue = {
                                    editCheck,
                                    editPercent,
                                    key: enteredValueKey,
                                    val: enteredValue,
                                    type: keys[enteredValueKey].type,
                                };
                                console.log(params);
                                /////////////////////////
                                await callApi('changeUploadedArtsDataForKey', params)
                                    .then(() => {
                                        setUpdate(true);
                                    })
                                    .finally(() => {
                                        setOpen(false);
                                    });
                                /////////////////////////
                            }}
                        >
                            <Icon data={CloudArrowUpIn} />
                            Сохранить
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};