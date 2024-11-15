import {Button, Card, Icon, Modal, Select, TextInput} from '@gravity-ui/uikit';
import {CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState, Children, isValidElement, ReactElement, useMemo, useEffect} from 'react';
import {TextTitleWrapper} from './TextTitleWrapper';
import callApi, {getUid} from 'src/utilities/callApi';

export const AdvertsBudgetsModal = ({
    disabled,
    children,
    selectValue,
    doc,
    setChangedDoc,
    getUniqueAdvertIdsFromThePage,
    advertId,
}: {
    disabled: boolean;
    children: ReactElement | ReactElement[];
    selectValue: string[];
    doc: any;
    setChangedDoc: Function;
    getUniqueAdvertIdsFromThePage: Function | undefined;
    advertId: number | undefined;
}) => {
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
        return temp && temp >= 1000 && !isNaN(temp) && isFinite(temp);
    }, [budgetInputValue]);

    useEffect(() => {
        setBudgetModalOption([budgetModalOptions[0].value]);
        setBudgetInputValue('1000');
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
            <Modal open={open && !disabled} onClose={handleClose}>
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
                            width: 250,
                            border: '1px solid #eee2',
                        }}
                    >
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
                                width: '100%',
                            }}
                            transition={transition}
                            animate={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'end',
                                height:
                                    open && budgetModalOption[0] != 'deleteBudgetToKeep' ? 62 : 0,
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
                        <motion.div style={{height: 0}} animate={{height: open ? 16 : 0}} />
                        <Button
                            size="l"
                            pin="circle-circle"
                            selected
                            view={
                                budgetModalOption[0] != 'deleteBudgetToKeep'
                                    ? 'outlined-success'
                                    : 'outlined-danger'
                            }
                            disabled={!budgetInputValueValid || disabled}
                            onClick={() => {
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
                                    if (budgetModalOption[0] == 'deleteBudgetToKeep') {
                                        doc.advertsBudgetsToKeep[selectValue[0]][id] = undefined;
                                        console.log(doc.advertsBudgetsToKeep[selectValue[0]][id]);
                                    } else if (budgetModalOption[0] == 'setBudgetToKeep')
                                        doc.advertsBudgetsToKeep[selectValue[0]][id] =
                                            parseInt(budgetInputValue);
                                }

                                console.log(params);

                                //////////////////////////////////
                                callApi('depositAdvertsBudgets', params);
                                setChangedDoc({...doc});
                                setOpen(false);
                                //////////////////////////////////
                            }}
                        >
                            <Icon
                                data={
                                    budgetModalOption[0] != 'deleteBudgetToKeep'
                                        ? CloudArrowUpIn
                                        : TrashBin
                                }
                            />
                            {
                                {
                                    purchase: 'Пополнить',
                                    setBudgetToKeep: 'Установить',
                                    deleteBudgetToKeep: 'Удалить',
                                }[budgetModalOption[0]]
                            }
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
