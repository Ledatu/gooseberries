'use client';

import {
    Button,
    Card,
    Checkbox,
    Icon,
    Modal,
    Select,
    TextInput,
    Text,
    SegmentedRadioGroup,
    NumberInput,
} from '@gravity-ui/uikit';
import {CloudArrowUpIn, TrashBin, Calendar as CalendarIcon} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useMemo, cloneElement} from 'react';
import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {Calendar} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import {HelpMark} from '@/components/Popups/HelpMark';
import {useAdvertBids} from '../hooks';
import {LogoLoad} from '@/components/logoLoad';

export const AdvertsBidsModal = ({
    disabled,
    children,
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
    const {
        cpm,
        setCpm,
        drr,
        setDrr,
        cpo,
        setCpo,
        orders,
        setOrders,
        sumOrders,
        setSumOrders,
        sum,
        setSum,
        obor,
        setObor,
        placementsTrigger,
        setPlacementsTrigger,
        usePlacementsTrigger,
        setUsePlacementsTrigger,
        sellByDate,
        setSellByDate,
        placements,
        setPlacements,
        auction,
        setAuction,
        maxCpm,
        setMaxCpm,
        maxBudget,
        setMaxBudget,
        useAutoMaxCpm,
        setUseAutoMaxCpm,
        autoBidderOption,
        setAutoBidderOption,
        setUseAutoBudget,
        useAutoBudget,
        useMaxBudget,
        setUseMaxBudget,
        autoBidderOptions,
        // handleClick,
        deleteRules,
        setNewRules,
        open,
        setOpen,
        modalOption,
        setModalOption,
        modalOptions,
        isLoaded,
    } = useAdvertBids({
        doc,
        setChangedDoc,
        advertId,
        getUniqueAdvertIdsFromThePage,
    });

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
        console.error('AdvertsBidsModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const handleDeleteButton = () => {
        deleteRules();
        setOpen(false);
    };
    const handleSetButton = () => {
        setNewRules();
        setOpen(false);
    };

    const textInputs: any = {
        cpm: {
            input: (
                <NumberInput
                    size="l"
                    hasClear
                    value={cpm}
                    validationState={cpm > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => {
                        val ? setCpm(val) : setCpm(0);
                    }}
                />
            ),
            title: 'Введите ставку',
        },
        drr: {
            input: (
                <NumberInput
                    size="l"
                    value={drr || 0}
                    allowDecimal
                    validationState={drr > 0 ? undefined : 'invalid'}
                    // validationState={drrInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setDrr(val || 0)}
                />
            ),
            title: (
                <div style={{display: 'flex'}}>
                    <Text variant="subheader-1" style={{marginRight: 8}}>
                        Удерживать ДРР к заказам
                    </Text>
                    <HelpMark
                        content={
                            'ДРР задаётся к заказам. Фактическая ДРР к продажам будет выше при выкупе <100%. Учитывайте это.'
                        }
                    />
                </div>
            ),
        },
        cpo: {
            input: (
                <NumberInput
                    size="l"
                    value={cpo}
                    validationState={cpo > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setCpo(val || 0)}
                />
            ),
            title: 'Введите CPO',
        },
        orders: {
            input: (
                <NumberInput
                    size="l"
                    value={orders}
                    validationState={orders > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setOrders(val || 0)}
                />
            ),
            title: 'Введите кол-во заказов',
        },
        sum_orders: {
            input: (
                <NumberInput
                    size="l"
                    value={sumOrders}
                    validationState={sumOrders > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setSumOrders(val || 0)}
                />
            ),
            title: 'Введите сумму заказов',
        },
        sum: {
            input: (
                <NumberInput
                    size="l"
                    value={sum}
                    validationState={sum > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setSum(val || 0)}
                />
            ),
            title: 'Введите плановый расход',
        },
        obor: {
            input: (
                <NumberInput
                    size="l"
                    validationState={obor > 0 ? undefined : 'invalid'}
                    value={obor}
                    onUpdate={(val) => setObor(val || 0)}
                />
            ),
            title: 'Введите оборачиваемость',
        },
        placementsTrigger: {
            input: (
                <NumberInput
                    size="l"
                    value={placementsTrigger}
                    validationState={placementsTrigger > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setPlacementsTrigger(val || 0)}
                />
            ),
            title: 'Введите позицию в выдаче',
        },
        sellByDate: {
            input: (
                <>
                    <motion.div
                        animate={{
                            height: autoBidderOption[0] == 'sellByDate' ? 44 : 0,
                        }}
                        style={{
                            height: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <TextInput
                            size="l"
                            value={sellByDate ? sellByDate.toLocaleDateString('ru-RU') : ''}
                            startContent={
                                <Button
                                    size="m"
                                    view="outlined"
                                    onClick={() => setSellByDate(undefined)}
                                >
                                    <Icon data={CalendarIcon} />
                                </Button>
                            }
                        />
                    </motion.div>
                    <motion.div
                        animate={{
                            height: autoBidderOption[0] == 'sellByDate' && !sellByDate ? 250 : 0,
                        }}
                        style={{
                            height: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <Calendar
                            minValue={dateTimeParse(new Date())}
                            onUpdate={(val) => {
                                setSellByDate(val.toDate());
                            }}
                        />
                    </motion.div>
                </>
            ),
            title: 'К какой дате распродать',
        },
        placements: {
            input: (
                <NumberInput
                    size="l"
                    value={placements}
                    validationState={placements > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setPlacements(val || 0)}
                />
            ),
            title: 'Введите позицию в выдаче',
        },
        auction: {
            input: (
                <NumberInput
                    size="l"
                    value={auction}
                    validationState={auction > 0 ? undefined : 'invalid'}
                    onUpdate={(val) => setAuction(val || 0)}
                />
            ),
            title: 'Введите позицию в аукционе',
        },
        maxCpm: {
            input: (
                <NumberInput
                    size="l"
                    validationState={maxCpm > 0 ? undefined : 'invalid'}
                    value={maxCpm}
                    onUpdate={(val) => setMaxCpm(val || 0)}
                />
            ),
            title: 'Макс. ставка',
        },
        bestPlacement: undefined,
        maxBudget: {
            input: (
                <NumberInput
                    placeholder=">= 1000"
                    size="l"
                    value={maxBudget}
                    validationState={maxBudget >= 1000 ? undefined : 'invalid'}
                    onUpdate={(val) => setMaxBudget(val || 0)}
                />
            ),
            title: 'Макс. бюджет',
        },
    };

    const transition = useMemo(() => {
        return {
            type: 'spring',
            damping: 100,
            stiffness: 1000,
        };
    }, []);

    const isSetDeleteButtonDisabled: any =
        disabled ||
        !drr ||
        !cpo ||
        !orders ||
        !sumOrders ||
        !sum ||
        !placements ||
        !auction ||
        !obor ||
        (!maxCpm && !useAutoMaxCpm) ||
        !cpm ||
        (autoBidderOption[0] == 'sellByDate' && !sellByDate) ||
        (useAutoBudget &&
            useMaxBudget &&
            ['sellByDate', 'orders', 'sum_orders', 'obor'].includes(autoBidderOption[0]) &&
            useAutoMaxCpm &&
            !maxBudget);

    return (
        <div>
            {triggerButton}
            <Modal open={open && !disabled} onClose={handleClose}>
                <Card
                    view="clear"
                    style={{
                        width: '400px',
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
                    {' '}
                    {!isLoaded ? (
                        <LogoLoad />
                    ) : (
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
                                border: '1px solid #eee2',
                            }}
                        >
                            <SegmentedRadioGroup
                                size="l"
                                value={modalOption}
                                options={modalOptions}
                                onUpdate={(opt) => setModalOption(opt)}
                            />
                            {modalOption == 'Установить' ? (
                                <div style={{width: '100%'}}>
                                    <motion.div
                                        transition={transition}
                                        style={{height: 0}}
                                        animate={{height: open ? 8 : 0}}
                                    />
                                    <TextTitleWrapper title={textInputs.cpm.title} padding={16}>
                                        {textInputs.cpm.input}
                                    </TextTitleWrapper>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <motion.div
                                        transition={transition}
                                        style={{height: 0, width: '100%'}}
                                        animate={{height: open ? 8 : 0}}
                                    />
                                    <TextTitleWrapper
                                        title="Выберите метод автоставок"
                                        padding={16}
                                    >
                                        <Select
                                            size="l"
                                            width={'max'}
                                            value={autoBidderOption}
                                            options={autoBidderOptions}
                                            onUpdate={(opt) => setAutoBidderOption(opt)}
                                        />
                                    </TextTitleWrapper>
                                    <motion.div
                                        style={{height: 0, overflow: 'hidden', width: '100%'}}
                                        animate={{
                                            marginTop:
                                                autoBidderOption[0] != 'delete' &&
                                                (['drr', 'cpo'].includes(autoBidderOption[0])
                                                    ? true
                                                    : useAutoMaxCpm)
                                                    ? 8
                                                    : 0,
                                            height:
                                                autoBidderOption[0] != 'delete' &&
                                                (['drr', 'cpo'].includes(autoBidderOption[0])
                                                    ? true
                                                    : useAutoMaxCpm)
                                                    ? 'fit-content'
                                                    : 0,
                                        }}
                                    >
                                        <TextTitleWrapper
                                            title={
                                                textInputs[
                                                    autoBidderOption[0] == 'cpo' ? 'cpo' : 'drr'
                                                ].title
                                            }
                                            padding={16}
                                        >
                                            {
                                                textInputs[
                                                    autoBidderOption[0] == 'cpo' ? 'cpo' : 'drr'
                                                ].input
                                            }
                                        </TextTitleWrapper>
                                    </motion.div>
                                    <motion.div
                                        style={{
                                            maxHeight: 0,
                                            overflow: 'hidden',
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        animate={{
                                            maxHeight: autoBidderOption[0] != 'delete' ? 90 : 0,
                                        }}
                                    >
                                        <Checkbox
                                            style={{marginTop: 8}}
                                            checked={!useAutoMaxCpm}
                                            onUpdate={(val) => setUseAutoMaxCpm(!val)}
                                        >
                                            Задать макс. ставку
                                        </Checkbox>
                                        <motion.div
                                            style={{height: 0, overflow: 'hidden', width: '100%'}}
                                            animate={{
                                                marginTop: !useAutoMaxCpm ? 8 : 0,
                                                height: !useAutoMaxCpm ? 'fit-content' : 0,
                                            }}
                                        >
                                            <TextTitleWrapper
                                                title={textInputs.maxCpm.title}
                                                padding={16}
                                            >
                                                {textInputs.maxCpm.input}
                                            </TextTitleWrapper>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        style={{
                                            maxHeight: 0,
                                            overflow: 'hidden',
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        animate={{
                                            maxHeight: ![
                                                'placements',
                                                'auction',
                                                'bestPlacement',
                                                'delete',
                                            ].includes(autoBidderOption[0])
                                                ? 88
                                                : 0,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: 8,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 8,
                                            }}
                                        >
                                            <Checkbox
                                                checked={usePlacementsTrigger}
                                                onUpdate={(val) => setUsePlacementsTrigger(val)}
                                                style={{whiteSpace: 'none'}}
                                            >
                                                Учитывать место в выдаче
                                            </Checkbox>
                                            <HelpMark content="При достижении данной позиции алгоритм будет учитывать место в выдаче при изменении ставки." />
                                        </div>
                                        <motion.div
                                            style={{
                                                maxHeight: 0,
                                                overflow: 'hidden',
                                                width: '100%',
                                            }}
                                            animate={{
                                                marginTop: usePlacementsTrigger ? 8 : 0,
                                                maxHeight: usePlacementsTrigger ? 70 : 0,
                                            }}
                                        >
                                            <TextTitleWrapper
                                                title={textInputs.placementsTrigger.title}
                                                padding={16}
                                            >
                                                {textInputs.placementsTrigger.input}
                                            </TextTitleWrapper>
                                        </motion.div>
                                    </motion.div>

                                    {!['drr', 'cpo'].includes(autoBidderOption[0]) &&
                                    textInputs[autoBidderOption[0]] ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                width: '100%',
                                            }}
                                        >
                                            <motion.div
                                                style={{height: 0}}
                                                animate={{height: open ? 8 : 0}}
                                            />
                                            <TextTitleWrapper
                                                title={textInputs[autoBidderOption[0]].title}
                                                padding={16}
                                            >
                                                {textInputs[autoBidderOption[0]].input}
                                            </TextTitleWrapper>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <motion.div
                                        style={{
                                            height: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                        animate={{
                                            height:
                                                0 +
                                                ([
                                                    'sellByDate',
                                                    'orders',
                                                    'sum_orders',
                                                    'obor',
                                                ].includes(autoBidderOption[0]) && useAutoMaxCpm
                                                    ? 23
                                                    : 0) +
                                                (useAutoBudget ? 23 : 0) +
                                                (useMaxBudget ? 62 : 0),
                                        }}
                                    >
                                        <Checkbox
                                            style={{marginTop: 8}}
                                            checked={useAutoBudget}
                                            onUpdate={(val) => setUseAutoBudget(val)}
                                        >
                                            Использовать автобюджет
                                        </Checkbox>
                                        <Checkbox
                                            style={{marginTop: 8, marginBottom: 8}}
                                            checked={useMaxBudget}
                                            onUpdate={(val) => setUseMaxBudget(val)}
                                        >
                                            Задать макс. бюджет
                                        </Checkbox>
                                        <TextTitleWrapper
                                            title={textInputs.maxBudget.title}
                                            padding={16}
                                        >
                                            {textInputs.maxBudget.input}
                                        </TextTitleWrapper>
                                    </motion.div>
                                </div>
                            )}
                            <motion.div style={{height: 0}} animate={{height: open ? 8 : 0}} />
                            <Button
                                disabled={isSetDeleteButtonDisabled}
                                size="l"
                                style={{margin: '4px'}}
                                view={
                                    autoBidderOption[0] != 'delete'
                                        ? 'outlined-success'
                                        : 'outlined-danger'
                                }
                                onClick={
                                    autoBidderOption[0] == 'delete'
                                        ? handleDeleteButton
                                        : modalOption[0] == 'Установить'
                                          ? () => {}
                                          : handleSetButton
                                }
                            >
                                <Icon
                                    data={
                                        autoBidderOption[0] != 'delete' ? CloudArrowUpIn : TrashBin
                                    }
                                />
                                {autoBidderOption[0] != 'delete' ? 'Установить' : 'Удалить'}
                            </Button>
                        </motion.div>
                    )}
                </Card>
            </Modal>
        </div>
    );
};
