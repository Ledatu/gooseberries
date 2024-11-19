import {
    Button,
    Card,
    Checkbox,
    Icon,
    Modal,
    RadioButton,
    Select,
    TextInput,
} from '@gravity-ui/uikit';
import {CloudArrowUpIn, TrashBin, Calendar as CalendarIcon} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState, Children, isValidElement, ReactElement, useMemo, useEffect} from 'react';
import {TextTitleWrapper} from './TextTitleWrapper';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import {Calendar} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import {getLocaleDateString} from 'src/utilities/getRoundValue';

export const AdvertsBidsModal = ({
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
    const [selectedButton, setSelectedButton] = useState('');
    const [open, setOpen] = useState(false);
    const modalOptions = [
        {value: 'Автоставки', content: 'Автоставки'},
        {value: 'Установить', content: 'Установить'},
    ];
    const [modalOption, setModalOption] = useState(modalOptions[0].value);

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

    const autoBidderOptions = [
        {
            value: 'placements',
            content: 'Место в выдаче',
        },
        {
            value: 'auction',
            content: 'Позиция в аукционе',
        },
        {
            value: 'bestPlacement',
            content: 'Топ позиция',
        },
        {
            value: 'orders',
            content: 'Заказы, шт.',
        },
        {
            value: 'sum_orders',
            content: 'Сумма заказов, руб.',
        },
        {
            value: 'obor',
            content: 'Оборачиваемость, дней',
        },
        {
            value: 'sellByDate',
            content: 'Распродать к дате',
        },
        {
            value: 'sum',
            content: 'Плановый расход',
        },
        {
            value: 'drr',
            content: 'Целевой ДРР',
        },
        {
            value: 'cpo',
            content: 'Целевой CPO',
        },
        {
            value: 'delete',
            content: 'Удалить автоставки',
        },
    ];
    const [autoBidderOption, setAutoBidderOption] = useState([autoBidderOptions[0].value]);

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

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const [useAutoMaxCpm, setUseAutoMaxCpm] = useState(true);

    const [cpmInputValue, setCpmInputValue] = useState('');
    const cpmInputValueValid = useMemo(() => {
        const temp = parseInt(cpmInputValue);
        return temp && temp >= 50 && !isNaN(temp) && isFinite(temp);
    }, [cpmInputValue]);

    const [drrInputValue, setDrrInputValue] = useState('');
    const drrInputValueValid = useMemo(() => {
        const temp = parseInt(drrInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [drrInputValue]);

    const [cpoInputValue, setCpoInputValue] = useState('');
    const cpoInputValueValid = useMemo(() => {
        const temp = parseInt(cpoInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [cpoInputValue]);

    const [ordersInputValue, setOrdersInputValue] = useState('');
    const ordersInputValueValid = useMemo(() => {
        const temp = parseInt(ordersInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [ordersInputValue]);

    const [sumOrdersInputValue, setSumOrdersInputValue] = useState('');
    const sumOrdersInputValueValid = useMemo(() => {
        const temp = parseInt(sumOrdersInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [sumOrdersInputValue]);

    const [sumInputValue, setSumInputValue] = useState('');
    const sumInputValueValid = useMemo(() => {
        const temp = parseInt(sumInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [sumInputValue]);

    const [placementsInputValue, setPlacementsInputValue] = useState('');
    const placementsInputValueValid = useMemo(() => {
        const temp = parseInt(placementsInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [placementsInputValue]);

    const [auctionInputValue, setAuctionInputValue] = useState('');
    const auctionInputValueValid = useMemo(() => {
        const temp = parseInt(auctionInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [auctionInputValue]);

    const [oborInputValue, setOborInputValue] = useState('');
    const oborInputValueValid = useMemo(() => {
        const temp = parseInt(oborInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [oborInputValue]);

    const [maxCpmInputValue, setMaxCpmInputValue] = useState('');
    const maxCpmInputValueValid = useMemo(() => {
        const temp = parseInt(maxCpmInputValue);
        return temp && temp > 0 && !isNaN(temp) && isFinite(temp);
    }, [maxCpmInputValue]);

    const [sellByDate, setSellByDate] = useState(undefined as any);
    const sellByDateValid = useMemo(() => {
        return sellByDate && sellByDate != 'Invalid Date';
    }, [sellByDate]);

    const [useAutoBudget, setUseAutoBudget] = useState(false);
    const [useMaxBudget, setUseMaxBudget] = useState(false);
    const [maxBudgetInputValue, setMaxBudgetInputValue] = useState('');
    const maxBudgetInputValueValid = useMemo(() => {
        const temp = parseInt(maxBudgetInputValue);
        return temp && temp >= 1000 && !isNaN(temp) && isFinite(temp);
    }, [maxBudgetInputValue]);

    useEffect(() => {
        if (
            ['sellByDate', 'orders', 'sum_orders', 'obor'].includes(autoBidderOption[0]) &&
            useAutoMaxCpm
        )
            return;
        setUseAutoBudget(false);
    }, [autoBidderOption, useAutoMaxCpm]);

    useEffect(() => {
        if (useAutoBudget) return;
        setUseMaxBudget(false);
        setMaxBudgetInputValue('');
    }, [useAutoBudget]);

    useEffect(() => {
        setModalOption(modalOptions[0].value);
        setAutoBidderOption([autoBidderOptions[0].value]);
        setCpmInputValue('100');
        setDrrInputValue('10');
        setCpoInputValue('50');
        setOrdersInputValue('10');
        setSumOrdersInputValue('1000');
        setSumInputValue('1000');
        setPlacementsInputValue('50');
        setAuctionInputValue('50');
        setOborInputValue('30');
        setMaxCpmInputValue('1000');
        setSellByDate(undefined);
        setUseAutoBudget(false);
        setUseMaxBudget(false);
        setUseAutoMaxCpm(true);
    }, [open]);

    const textInputs = {
        cpm: {
            input: (
                <TextInput
                    size="l"
                    value={cpmInputValue}
                    validationState={cpmInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setCpmInputValue(val)}
                />
            ),
            title: 'Введите ставку',
        },
        drr: {
            input: (
                <TextInput
                    size="l"
                    value={drrInputValue}
                    validationState={drrInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setDrrInputValue(val)}
                />
            ),
            title: 'Удерживать ДРР',
        },
        cpo: {
            input: (
                <TextInput
                    size="l"
                    value={cpoInputValue}
                    validationState={cpoInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setCpoInputValue(val)}
                />
            ),
            title: 'Введите CPO',
        },
        orders: {
            input: (
                <TextInput
                    size="l"
                    value={ordersInputValue}
                    validationState={ordersInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setOrdersInputValue(val)}
                />
            ),
            title: 'Введите кол-во заказов',
        },
        sum_orders: {
            input: (
                <TextInput
                    size="l"
                    value={sumOrdersInputValue}
                    validationState={sumOrdersInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setSumOrdersInputValue(val)}
                />
            ),
            title: 'Введите сумму заказов',
        },
        sum: {
            input: (
                <TextInput
                    size="l"
                    value={sumInputValue}
                    validationState={sumInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setSumInputValue(val)}
                />
            ),
            title: 'Введите плановый расход',
        },
        obor: {
            input: (
                <TextInput
                    size="l"
                    value={oborInputValue}
                    validationState={oborInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setOborInputValue(val)}
                />
            ),
            title: 'Введите оборачиваемость',
        },
        sellByDate: {
            input: (
                <>
                    <motion.div
                        animate={{
                            height: autoBidderOption[0] == 'sellByDate' && sellByDateValid ? 44 : 0,
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
                            value={sellByDate ? sellByDate.toLocaleDateString(0, 10) : ''}
                            rightContent={
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
                            height:
                                autoBidderOption[0] == 'sellByDate' && !sellByDateValid ? 250 : 0,
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
                <TextInput
                    size="l"
                    value={placementsInputValue}
                    validationState={placementsInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setPlacementsInputValue(val)}
                />
            ),
            title: 'Введите позицию в выдаче',
        },
        auction: {
            input: (
                <TextInput
                    size="l"
                    value={auctionInputValue}
                    validationState={auctionInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setAuctionInputValue(val)}
                />
            ),
            title: 'Введите позицию в аукционе',
        },
        maxCpm: {
            input: (
                <TextInput
                    size="l"
                    value={maxCpmInputValue}
                    validationState={maxCpmInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setMaxCpmInputValue(val)}
                />
            ),
            title: 'Макс. ставка',
        },
        bestPlacement: undefined,
        maxBudget: {
            input: (
                <TextInput
                    placeholder=">= 1000"
                    size="l"
                    value={maxBudgetInputValue}
                    validationState={maxBudgetInputValueValid ? undefined : 'invalid'}
                    onUpdate={(val) => setMaxBudgetInputValue(val)}
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
                            border: '1px solid #eee2',
                        }}
                    >
                        <RadioButton
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
                                <TextTitleWrapper title="Выберите метод автоставок" padding={16}>
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
                                                ? 54
                                                : 0,
                                    }}
                                >
                                    <TextTitleWrapper
                                        title={
                                            textInputs[autoBidderOption[0] == 'cpo' ? 'cpo' : 'drr']
                                                .title
                                        }
                                        padding={16}
                                    >
                                        {
                                            textInputs[autoBidderOption[0] == 'cpo' ? 'cpo' : 'drr']
                                                .input
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
                                        maxHeight: autoBidderOption[0] != 'delete' ? 86.5 : 0,
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
                                            height: !useAutoMaxCpm ? 54 : 0,
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
                        {generateModalButtonWithActions(
                            {
                                disabled:
                                    disabled ||
                                    !drrInputValueValid ||
                                    !cpoInputValueValid ||
                                    !ordersInputValueValid ||
                                    !sumOrdersInputValueValid ||
                                    !sumInputValueValid ||
                                    !placementsInputValueValid ||
                                    !auctionInputValueValid ||
                                    !oborInputValueValid ||
                                    (!maxCpmInputValueValid && !useAutoMaxCpm) ||
                                    !cpmInputValueValid ||
                                    (autoBidderOption[0] == 'sellByDate' && !sellByDateValid) ||
                                    (useAutoBudget &&
                                        useMaxBudget &&
                                        ['sellByDate', 'orders', 'sum_orders', 'obor'].includes(
                                            autoBidderOption[0],
                                        ) &&
                                        useAutoMaxCpm &&
                                        !maxBudgetInputValueValid),
                                placeholder:
                                    autoBidderOption[0] != 'delete' ? 'Установить' : 'Удалить',
                                icon: autoBidderOption[0] != 'delete' ? CloudArrowUpIn : TrashBin,
                                view:
                                    autoBidderOption[0] != 'delete'
                                        ? 'outlined-success'
                                        : 'outlined-danger',
                                onClick: () => {
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            mode: modalOption,
                                            autoBidsMode: autoBidderOption[0],
                                            placementsRange:
                                                autoBidderOption[0] == 'auction'
                                                    ? {
                                                          from: parseInt(auctionInputValue),
                                                          to: parseInt(auctionInputValue),
                                                      }
                                                    : {
                                                          from: parseInt(placementsInputValue),
                                                          to: parseInt(placementsInputValue),
                                                      },
                                            desiredOrders:
                                                autoBidderOption[0] == 'obor' ||
                                                autoBidderOption[0] == 'sum_orders' ||
                                                autoBidderOption[0] == 'sellByDate'
                                                    ? null
                                                    : parseInt(ordersInputValue),
                                            desiredDRR: parseInt(drrInputValue),
                                            desiredCpo: parseInt(cpoInputValue),
                                            desiredSum: parseInt(sumInputValue),
                                            desiredObor: parseInt(oborInputValue),
                                            desiredSumOrders: parseInt(sumOrdersInputValue),
                                            bid: parseInt(cpmInputValue),
                                            maxBid: parseInt(maxCpmInputValue),
                                            useManualMaxCpm: !useAutoMaxCpm,
                                            useAutoBudget,
                                            useMaxBudget,
                                            maxBudget: useMaxBudget
                                                ? parseInt(maxBudgetInputValue)
                                                : undefined,
                                            sellByDate:
                                                autoBidderOption[0] == 'sellByDate'
                                                    ? getLocaleDateString(sellByDate, 10)
                                                    : undefined,
                                            advertIds,
                                        },
                                    };

                                    for (const id of advertIds) {
                                        const old = doc.advertsAutoBidsRules[selectValue[0]][id];
                                        if (!doc.advertsAutoBidsRules[selectValue[0]][id])
                                            doc.advertsAutoBidsRules[selectValue[0]][id] = {};
                                        doc.advertsAutoBidsRules[selectValue[0]][id] =
                                            modalOption == 'Установить'
                                                ? old
                                                    ? {...old, bid: parseInt(cpmInputValue)}
                                                    : undefined
                                                : autoBidderOption[0] == 'delete'
                                                ? undefined
                                                : {
                                                      mode: modalOption,
                                                      autoBidsMode: autoBidderOption[0],
                                                      placementsRange:
                                                          autoBidderOption[0] == 'auction'
                                                              ? {
                                                                    from: parseInt(
                                                                        auctionInputValue,
                                                                    ),
                                                                    to: parseInt(auctionInputValue),
                                                                }
                                                              : {
                                                                    from: parseInt(
                                                                        placementsInputValue,
                                                                    ),
                                                                    to: parseInt(
                                                                        placementsInputValue,
                                                                    ),
                                                                },
                                                      desiredOrders:
                                                          autoBidderOption[0] == 'obor' ||
                                                          autoBidderOption[0] == 'sum_orders' ||
                                                          autoBidderOption[0] == 'sellByDate'
                                                              ? null
                                                              : parseInt(ordersInputValue),
                                                      desiredSum: parseInt(sumInputValue),
                                                      desiredObor: parseInt(oborInputValue),
                                                      desiredSumOrders:
                                                          parseInt(sumOrdersInputValue),
                                                      desiredDRR: parseInt(drrInputValue),
                                                      maxBid: !useAutoMaxCpm
                                                          ? parseInt(maxCpmInputValue)
                                                          : undefined,
                                                      useManualMaxCpm: !useAutoMaxCpm,
                                                      useAutoBudget,
                                                      useMaxBudget,
                                                      maxBudget: useMaxBudget
                                                          ? parseInt(maxBudgetInputValue)
                                                          : undefined,
                                                      sellByDate:
                                                          autoBidderOption[0] == 'sellByDate'
                                                              ? getLocaleDateString(sellByDate, 10)
                                                              : undefined,
                                                      bid: parseInt(cpmInputValue),
                                                  };
                                    }

                                    console.log(params);

                                    //////////////////////////////////
                                    callApi('setAdvertsCPMs', params);
                                    setChangedDoc({...doc});
                                    setOpen(false);
                                    //////////////////////////////////
                                },
                            },
                            selectedButton,
                            setSelectedButton,
                        )}
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
