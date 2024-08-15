import {Modal, RadioButton, Select, TextInput} from '@gravity-ui/uikit';
import {CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState, Children, isValidElement, ReactElement, useMemo, useEffect} from 'react';
import {TextTitleWrapper} from './TextTitleWrapper';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';

export const AdvertsBidsModal = ({
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
    const modalOptions = [
        {value: 'Установить', content: 'Установить'},
        {value: 'Автоставки', content: 'Автоставки'},
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
            content: 'Заказы',
        },
        {
            value: 'sum_orders',
            content: 'Сумма заказов',
        },
        {
            value: 'obor',
            content: 'Оборачиваемость',
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

    const [cpmInputValue, setCpmInputValue] = useState('');
    const cpmInputValueValid = useMemo(() => {
        const temp = parseInt(cpmInputValue);
        return temp && temp >= 100 && !isNaN(temp) && isFinite(temp);
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
            title: 'Введите ДРР',
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
        bestPlacement: undefined,
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
            <Modal open={open} onClose={handleClose}>
                <motion.div
                    transition={transition}
                    animate={{maxHeight: open ? 450 : 0}}
                    style={{
                        maxHeight: 0,
                        width: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 20,
                    }}
                >
                    <RadioButton
                        size="l"
                        value={modalOption}
                        options={modalOptions}
                        onUpdate={(opt) => setModalOption(opt)}
                    />
                    {modalOption == 'Установить' ? (
                        <div>
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
                        <div>
                            <motion.div
                                transition={transition}
                                style={{height: 0}}
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
                            {autoBidderOption[0] != 'cpo' && autoBidderOption[0] != 'delete' ? (
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <motion.div
                                        style={{height: 0}}
                                        animate={{height: open ? 8 : 0}}
                                    />
                                    <TextTitleWrapper title={textInputs.drr.title} padding={16}>
                                        {textInputs.drr.input}
                                    </TextTitleWrapper>
                                </div>
                            ) : (
                                <></>
                            )}
                            {autoBidderOption[0] != 'drr' && textInputs[autoBidderOption[0]] ? (
                                <div style={{display: 'flex', flexDirection: 'column'}}>
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
                        </div>
                    )}
                    <motion.div style={{height: 0}} animate={{height: open ? 8 : 0}} />
                    {generateModalButtonWithActions(
                        {
                            disabled:
                                !drrInputValueValid ||
                                !cpoInputValueValid ||
                                !ordersInputValueValid ||
                                !sumOrdersInputValueValid ||
                                !sumInputValueValid ||
                                !placementsInputValueValid ||
                                !auctionInputValueValid ||
                                !oborInputValueValid ||
                                !cpmInputValueValid,
                            placeholder: autoBidderOption[0] != 'delete' ? 'Установить' : 'Удалить',
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
                                            autoBidderOption[0] == 'obor'
                                                ? null
                                                : parseInt(ordersInputValue),
                                        desiredDRR: parseInt(drrInputValue),
                                        desiredSum: parseInt(sumInputValue),
                                        desiredObor: parseInt(oborInputValue),
                                        desiredSumOrders: parseInt(sumOrdersInputValue),
                                        bid: parseInt(cpmInputValue),
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
                                                                from: parseInt(auctionInputValue),
                                                                to: parseInt(auctionInputValue),
                                                            }
                                                          : {
                                                                from: parseInt(
                                                                    placementsInputValue,
                                                                ),
                                                                to: parseInt(placementsInputValue),
                                                            },
                                                  desiredOrders:
                                                      autoBidderOption[0] == 'obor'
                                                          ? null
                                                          : parseInt(ordersInputValue),
                                                  desiredSum: parseInt(sumInputValue),
                                                  desiredObor: parseInt(oborInputValue),
                                                  desiredSumOrders: parseInt(sumOrdersInputValue),
                                                  desiredDRR: parseInt(drrInputValue),
                                                  bid: parseInt(cpmInputValue),
                                              };
                                }

                                console.log(params);

                                //////////////////////////////////
                                callApi('setAdvertsCPMs', params);
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
