'use client';

import {Button, Card, Modal, Select, TextInput, Text, Checkbox} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {
    useState,
    Children,
    isValidElement,
    ReactElement,
    useMemo,
    useEffect,
    cloneElement,
} from 'react';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import callApi, {getUid} from '@/utilities/callApi';
import { HelpMark } from '@/components/Popups/HelpMark';

export const AdvertsBudgetsModal = ({
    sellerId,
    setAdvertBudgetsRules,
    advertBudgetsRules,
    disabled,
    children,
    selectValue,
    getUniqueAdvertIdsFromThePage,
    advertId,
}: {
    disabled: boolean;
    children: ReactElement | ReactElement[];
    selectValue: string[];
    sellerId: String;
    advertBudgetsRules: object[];
    setAdvertBudgetsRules: Function;
    getUniqueAdvertIdsFromThePage: Function | undefined;
    advertId: number | undefined;
}) => {
    const {showError} = useError();
    const [open, setOpen] = useState(false);

    const advertIds = useMemo(() => {
        if (advertId) return [advertId];
        if (!getUniqueAdvertIdsFromThePage) return [];
        const temp = [] as number[];
        const uniqueAdvertsIds = getUniqueAdvertIdsFromThePage();
        for (const [_, data] of Object.entries(uniqueAdvertsIds)) {
            const advertData: any = data;
            if (!advertData) continue;
            const id = advertData['advertId'];
            if (!temp.includes(id)) temp.push(id);
        }
        return temp;
    }, [open]);

    const [useDesiredDrr, setUseDesiredDrr] = useState(false);

    const budgetModalOptions = [
        {
            value: 'setAutoPurchase',
            content: 'Установить автопополнение',
        },
        {
            value: 'setBudgetToKeep',
            content: 'Установить бюджет на день',
        },
        {
            value: 'deleteBudgetToKeep',
            content: 'Удалить управление бюджетом',
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

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const [desiredDrrInputValue, setDesiredDrrInputValue] = useState('5');
    const desiredDrrInputValueValid = useMemo(() => {
        const temp = Number(desiredDrrInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [desiredDrrInputValue]);

    const [budgetInputValue, setBudgetInputValue] = useState('1000');
    const budgetInputValueValid = useMemo(() => {
        const temp = parseInt(budgetInputValue);
        return temp && temp >= 1000 && !isNaN(temp) && isFinite(temp);
    }, [budgetInputValue]);

    const [maxBudgetInputValue, setMaxBudgetInputValue] = useState('3000');
    const maxBudgetInputValueValid = useMemo(() => {
        const temp = parseInt(maxBudgetInputValue);
        return temp && temp >= 1000 && !isNaN(temp) && isFinite(temp);
    }, [maxBudgetInputValue]);

    const [depositValueTriggerInputValue, setDepositValueTriggerInputValue] = useState('500');
    const depositValueTriggerInputValueValid = useMemo(() => {
        const temp = parseInt(depositValueTriggerInputValue);
        return temp && temp > 0 && temp < 100000 && !isNaN(temp) && isFinite(temp);
    }, [depositValueTriggerInputValue]);

    useEffect(() => {
        const rules: any = advertBudgetsRules?.[advertId as any];
        if (rules) {
            setBudgetModalOption([
                rules['mode'] == 'oneTimeDeposit' ? 'setBudgetToKeep' : rules['mode'],
            ]);
            if (rules?.['desiredDrr']) {
                setDesiredDrrInputValue(rules?.['desiredDrr']);
                setUseDesiredDrr(true);
            }
            setMaxBudgetInputValue(rules?.['maxBudget'] ?? '3000');
            setBudgetInputValue(rules?.['budget'] ?? '1000');
            setDepositValueTriggerInputValue(rules?.['depositValueTrigger'] ?? '500');
        } else {
            setBudgetModalOption([budgetModalOptions[0].value]);
            setUseDesiredDrr(false);
            setMaxBudgetInputValue('3000');
            setBudgetInputValue('1000');
            setDepositValueTriggerInputValue('500');
        }
    }, [open]);

    const transition = useMemo(() => {
        return {
            type: 'spring',
            damping: 100,
            stiffness: 1000,
        };
    }, []);

    const dis = useMemo(() => {
        if (typeof maxBudgetInputValue !== 'string') return false;
        return maxBudgetInputValue?.includes('123456789');
    }, [maxBudgetInputValue]);

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
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
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
                            animate={{
                                height:
                                    open && budgetModalOption[0] !== 'deleteBudgetToKeep'
                                        ? budgetModalOption[0] !== 'setAutoPurchase'
                                            ? 62
                                            : 194
                                        : 0,
                                minHeight:
                                    open && budgetModalOption[0] !== 'deleteBudgetToKeep'
                                        ? budgetModalOption[0] !== 'setAutoPurchase'
                                            ? 62
                                            : 194
                                        : 0,
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: 8,
                                overflow: 'hidden',
                                alignItems: 'end',
                            }}
                        >
                            <motion.div
                                style={{
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: 8,
                                }}
                                transition={transition}
                                animate={{
                                    marginTop:
                                        open && budgetModalOption[0] !== 'deleteBudgetToKeep'
                                            ? 16
                                            : 0,
                                }}
                            >
                                <Text
                                    style={{height: 36, alignItems: 'center', display: 'flex'}}
                                    variant="body-2"
                                    color="secondary"
                                    whiteSpace="nowrap"
                                >
                                    {'Если баланс РК меньше'}
                                </Text>
                                <Text
                                    style={{height: 36, alignItems: 'center', display: 'flex'}}
                                    variant="body-2"
                                    color="secondary"
                                    whiteSpace="nowrap"
                                >
                                    {'Если ДРР РК меньше'}
                                </Text>
                                <Text
                                    style={{height: 36, alignItems: 'center', display: 'flex'}}
                                    variant="body-2"
                                    color="secondary"
                                    whiteSpace="nowrap"
                                >
                                    {'Суточный лимит'}
                                </Text>
                                <Text
                                    style={{height: 36, alignItems: 'center', display: 'flex'}}
                                    variant="body-2"
                                    color="secondary"
                                    whiteSpace="nowrap"
                                >
                                    {budgetModalOption[0] === 'purchase' ? (
                                        'Пополнить баланс РК на'
                                    ) : budgetModalOption[0] === 'setBudgetToKeep' ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: 8,
                                            }}
                                        >
                                            <Text>Бюджет на день</Text>
                                            <HelpMark content="Пополнит баланс РК до заданной суммы 1 раз в 00:00 по GMT+3, Москва" />
                                        </div>
                                    ) : (
                                        'Пополнять баланс РК на'
                                    )}
                                </Text>
                                <div style={{height: 12}} />
                            </motion.div>
                            <motion.div
                                style={{
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: 187,
                                    rowGap: 8,
                                }}
                                transition={transition}
                                animate={{
                                    marginTop:
                                        open && budgetModalOption[0] !== 'deleteBudgetToKeep'
                                            ? 16
                                            : 0,
                                }}
                            >
                                <TextInput
                                    hasClear
                                    size="l"
                                    value={new Intl.NumberFormat('ru-RU').format(
                                        Number(depositValueTriggerInputValue),
                                    )}
                                    onBlur={() => {
                                        if (depositValueTriggerInputValueValid) return;
                                        setDepositValueTriggerInputValue('1');
                                    }}
                                    validationState={
                                        depositValueTriggerInputValueValid ? undefined : 'invalid'
                                    }
                                    onUpdate={(val) =>
                                        setDepositValueTriggerInputValue(
                                            val.replace(/[%\s\D]/g, ''),
                                        )
                                    }
                                />
                                <TextInput
                                    hasClear
                                    disabled={!useDesiredDrr}
                                    size="l"
                                    value={desiredDrrInputValue + '%'}
                                    onBlur={() => {
                                        if (desiredDrrInputValueValid) return;
                                        setDesiredDrrInputValue('1');
                                    }}
                                    validationState={
                                        desiredDrrInputValueValid ? undefined : 'invalid'
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key == 'Backspace')
                                            setDesiredDrrInputValue(
                                                desiredDrrInputValue.slice(
                                                    0,
                                                    desiredDrrInputValue.length - 1,
                                                ),
                                            );
                                    }}
                                    onUpdate={(val) => {
                                        console.log(
                                            val
                                                .replace(/[%\s]/g, '')
                                                .replace(/,/g, '.')
                                                .replace(/[^\d.]/g, ''),
                                        );

                                        setDesiredDrrInputValue(
                                            val
                                                .replace(/[%\s]/g, '')
                                                .replace(/,/g, '.')
                                                .replace(/[^\d.]/g, ''),
                                        );
                                    }}
                                />
                                <TextInput
                                    hasClear
                                    size="l"
                                    disabled={dis}
                                    value={
                                        dis
                                            ? '∞'
                                            : new Intl.NumberFormat('ru-RU').format(
                                                  Number(maxBudgetInputValue),
                                              )
                                    }
                                    onBlur={() => {
                                        if (maxBudgetInputValueValid) return;
                                        setMaxBudgetInputValue('1000');
                                    }}
                                    validationState={
                                        maxBudgetInputValueValid ? undefined : 'invalid'
                                    }
                                    onUpdate={(val) =>
                                        setMaxBudgetInputValue(val.replace(/[%\s\D]/g, ''))
                                    }
                                />
                                <TextInput
                                    hasClear
                                    autoFocus
                                    size="l"
                                    value={new Intl.NumberFormat('ru-RU').format(
                                        Number(budgetInputValue),
                                    )}
                                    onBlur={() => {
                                        if (budgetInputValueValid) return;
                                        setBudgetInputValue('1000');
                                    }}
                                    validationState={budgetInputValueValid ? undefined : 'invalid'}
                                    onUpdate={(val) =>
                                        setBudgetInputValue(val.replace(/[%\s\D]/g, ''))
                                    }
                                    note={
                                        <Text
                                            variant="code-1"
                                            color="secondary"
                                            whiteSpace="nowrap"
                                        >
                                            Минимальная сумма – 1000 ₽
                                        </Text>
                                    }
                                />
                            </motion.div>
                            <motion.div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: 8,
                                    overflow: 'hidden',
                                    marginTop: 16,
                                }}
                                transition={transition}
                                animate={{
                                    width: budgetModalOption[0] === 'setAutoPurchase' ? 210 : 0,
                                }}
                            >
                                <div style={{height: 36}} />
                                <motion.div
                                    transition={transition}
                                    style={{
                                        height: 36,
                                        alignItems: 'center',
                                        display: 'flex',
                                        columnGap: 8,
                                    }}
                                >
                                    <Checkbox
                                        checked={useDesiredDrr}
                                        onUpdate={(val) => setUseDesiredDrr(val)}
                                        style={{
                                            height: 36,
                                            alignItems: 'center',
                                            display: 'flex',
                                        }}
                                        size="l"
                                        content={
                                            <Text
                                                variant="body-2"
                                                color="secondary"
                                                whiteSpace="nowrap"
                                            >
                                                ограничивать по ДРР
                                            </Text>
                                        }
                                    />
                                    <HelpMark
                                        content={`Пополнять на ${new Intl.NumberFormat(
                                            'ru-RU',
                                        ).format(
                                            Number(budgetInputValue),
                                        )} ₽ только если ДРР меньше указанного значения`}
                                    />
                                </motion.div>
                                <motion.div
                                    transition={transition}
                                    style={{
                                        height: 36,
                                        alignItems: 'center',
                                        display: 'flex',
                                        columnGap: 8,
                                    }}
                                >
                                    <Checkbox
                                        checked={dis}
                                        onUpdate={(val) => {
                                            setMaxBudgetInputValue(
                                                val
                                                    ? maxBudgetInputValue + '123456789'
                                                    : maxBudgetInputValue.slice(0, -9),
                                            );
                                        }}
                                        style={{
                                            height: 36,
                                            alignItems: 'center',
                                            display: 'flex',
                                        }}
                                        size="l"
                                        content={
                                            <Text
                                                variant="body-2"
                                                color="secondary"
                                                whiteSpace="nowrap"
                                            >
                                                без ограничений
                                            </Text>
                                        }
                                    />
                                    <HelpMark
                                        content={
                                            'Сумма пополнения в день не будет ограничена, будьте внимательны, выбирая данный вариант.'
                                        }
                                    />
                                </motion.div>
                                <div
                                    style={{
                                        height: 36,
                                    }}
                                />
                                <div
                                    style={{
                                        height: 12,
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                        <motion.div style={{height: 0}} animate={{height: open ? 16 : 0}} />
                        <div
                            style={{
                                columnGap: 16,
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                            }}
                        >
                            <Button
                                size="l"
                                pin="circle-circle"
                                selected
                                view={
                                    budgetModalOption[0] !== 'deleteBudgetToKeep'
                                        ? 'outlined-success'
                                        : 'outlined-danger'
                                }
                                disabled={!budgetInputValueValid || disabled}
                                onClick={async () => {
                                    setOpen(false);

                                    if (budgetModalOption[0] === 'purchase') {
                                        const params = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            data: {
                                                mode: budgetModalOption[0],
                                                budget: parseInt(budgetInputValue),
                                                advertIds,
                                            },
                                        };

                                        console.log(params);

                                        //////////////////////////////////
                                        callApi('depositAdvertsBudgets', params);
                                        //////////////////////////////////
                                    } else {
                                        let params = {};
                                        if (budgetModalOption[0] === 'setAutoPurchase') {
                                            params = {
                                                seller_id: sellerId,
                                                advertIds,
                                                rules: {
                                                    mode: budgetModalOption[0],
                                                    desiredDrr: useDesiredDrr
                                                        ? Number(desiredDrrInputValue)
                                                        : null,
                                                    depositValueTrigger: parseInt(
                                                        depositValueTriggerInputValue,
                                                    ),
                                                    maxBudget: parseInt(maxBudgetInputValue),
                                                    budget: parseInt(budgetInputValue),
                                                },
                                            };
                                        } else if (budgetModalOption[0] === 'setBudgetToKeep') {
                                            params = {
                                                seller_id: sellerId,
                                                advertIds,
                                                rules: {
                                                    mode: budgetModalOption[0],
                                                    budget: parseInt(budgetInputValue),
                                                },
                                            };
                                        } else if (budgetModalOption[0] === 'deleteBudgetToKeep') {
                                            params = {
                                                seller_id: sellerId,
                                                advertIds,
                                            };
                                        }
                                        console.log(params);

                                        const url =
                                            budgetModalOption[0] === 'deleteBudgetToKeep'
                                                ? 'massAdvert/delete-advert-budget-rules'
                                                : 'massAdvert/set-advert-budget-rules';

                                        try {
                                            const response = await ApiClient.post(url, params);
                                            if (!response?.data) {
                                                throw new Error(
                                                    `Cant set advertsBudgetRules for campaign ${sellerId}`,
                                                );
                                            }
                                            console.log('set', response);

                                            setAdvertBudgetsRules(response.data);
                                        } catch (error) {
                                            console.error(error);
                                            showError('Возникла ошибка');
                                        }
                                    }
                                }}
                            >
                                {
                                    {
                                        purchase: 'Пополнить',
                                        setBudgetToKeep: 'Сохранить',
                                        setAutoPurchase: 'Сохранить',
                                        deleteBudgetToKeep: 'Удалить',
                                    }[budgetModalOption[0]]
                                }
                            </Button>
                            <Button size="l" pin="circle-circle" onClick={handleClose}>
                                Отмена
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
