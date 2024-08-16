import {Modal, Select, TextInput} from '@gravity-ui/uikit';
import {CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState, Children, isValidElement, ReactElement, useMemo, useEffect} from 'react';
import {TextTitleWrapper} from './TextTitleWrapper';
import {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';

export const AdvertsBudgetsModal = ({
    children,
    selectValue,
    doc,
    setChangedDoc,
    getUniqueAdvertIdsFromThePage,
    advertId,
}: {
    children: ReactElement | ReactElement[];
    selectValue: string[];
    doc: any;
    setChangedDoc: Function;
    getUniqueAdvertIdsFromThePage: Function | undefined;
    advertId: number | undefined;
}) => {
    const [selectedButton, setSelectedButton] = useState('');
    const [open, setOpen] = useState(false);

    const advertIds = (() => {
        if (advertId) return [advertId];
        if (!getUniqueAdvertIdsFromThePage) return [];
        const temp = [] as number[];
        const uniqueAdvertsIds = getUniqueAdvertIdsFromThePage();
        for (const [_, advertData] of Object.entries(uniqueAdvertsIds)) {
            if (!advertData) continue;
            const id = advertData['advertId'];
            if (!temp.includes(id)) temp.push(id);
        }
        return temp;
    })();

    const budgetModalOptions = [
        {
            value: 'setBudgetToKeep',
            content: 'Установить бюджет на день',
        },
        {
            value: 'deleteBudgetToKeep',
            content: 'Удалить бюджет на день',
        },
        {
            value: 'purchase',
            content: 'Пополнить',
        },
    ];

    const [budgetModalOption, setBudgetModalOption] = useState(['']);

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

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const [budgetInputValue, setBudgetInputValue] = useState('');
    const budgetInputValueValid = useMemo(() => {
        const temp = parseInt(budgetInputValue);
        return temp && temp >= 500 && !isNaN(temp) && isFinite(temp);
    }, [budgetInputValue]);

    useEffect(() => {
        setBudgetModalOption([budgetModalOptions[0].value]);
        setBudgetInputValue('500');
    }, [open]);

    const transition = useMemo(() => {
        return {
            type: 'spring',
            damping: 100,
            stiffness: 1000,
        };
    }, []);

    return (
        <div>
            {triggerButton}
            <Modal open={open} onClose={handleClose}>
                <motion.div
                    style={{
                        width: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 20,
                    }}
                >
                    <motion.div
                        transition={transition}
                        style={{height: 0}}
                        animate={{height: open ? 8 : 0}}
                    />
                    <Select
                        size="l"
                        width={'max'}
                        value={budgetModalOption}
                        options={budgetModalOptions}
                        onUpdate={(opt) => setBudgetModalOption(opt)}
                    />
                    <motion.div
                        style={{
                            height: 0,
                            overflow: 'hidden',
                        }}
                        transition={transition}
                        animate={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                            height: open && budgetModalOption[0] != 'deleteBudgetToKeep' ? 62 : 0,
                        }}
                    >
                        <TextTitleWrapper title="Сумма" padding={16}>
                            <TextInput
                                autoFocus
                                size="l"
                                value={budgetInputValue}
                                validationState={budgetInputValueValid ? undefined : 'invalid'}
                                onUpdate={(val) => setBudgetInputValue(val)}
                            />
                        </TextTitleWrapper>
                    </motion.div>
                    <motion.div style={{height: 0}} animate={{height: open ? 8 : 0}} />
                    {generateModalButtonWithActions(
                        {
                            disabled: true,
                            placeholder: {
                                purchase: 'Пополнить',
                                setBudgetToKeep: 'Установить',
                                deleteBudgetToKeep: 'Удалить',
                            }[budgetModalOption[0]],
                            icon:
                                budgetModalOption[0] != 'deleteBudgetToKeep'
                                    ? CloudArrowUpIn
                                    : TrashBin,
                            view:
                                budgetModalOption[0] != 'deleteBudgetToKeep'
                                    ? 'outlined-success'
                                    : 'outlined-danger',
                            onClick: () => {
                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    data: {
                                        mode: budgetModalOption[0],
                                        budget: parseInt(budgetInputValue),
                                        advertIds,
                                    },
                                };

                                for (const id of advertIds) {
                                    if (budgetModalOption[0] == 'deleteBudgetToKeep')
                                        doc.advertsBudgetsToKeep[selectValue[0]][id] = undefined;
                                    else if (budgetModalOption[0] == 'setBudgetToKeep')
                                        doc.advertsBudgetsToKeep[selectValue[0]][id] =
                                            parseInt(budgetInputValue);
                                }

                                console.log(params);

                                //////////////////////////////////
                                // callApi('setAdvertsCPMs', params);
                                setChangedDoc(doc);
                                setOpen(false);
                                //////////////////////////////////
                            },
                        },
                        selectedButton,
                        setSelectedButton,
                    )}
                </motion.div>
            </Modal>
        </div>
    );
};
