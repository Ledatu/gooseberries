'use client';

import {
    ActionTooltip,
    Button,
    Card,
    Checkbox,
    Icon,
    Modal,
    Select,
    Spin,
    Text,
    TextInput,
    Tooltip,
} from '@gravity-ui/uikit';
import {Calculator, Plus, Xmark, Check, FileDollar, Percent, Pencil} from '@gravity-ui/icons';
import {useEffect, useMemo, useState} from 'react';
import {motion} from 'framer-motion';
import {getNormalDateRange} from '@/utilities/getRoundValue';
import {DownloadPricesCalcTemplate} from './DownloadPricesCalcTemplate';
import {useError} from '@/contexts/ErrorContext';
import {UploadPricesCalcTemplate} from './UploadPricesCalcTemplate';
import ApiClient from '@/utilities/ApiClient';
import {useNoCheckedRowsPopup} from '@/shared/ui/NoCheckedRowsPopup';

interface CalcPricesModalProps {
    sellerId: string;
    disabled: boolean;
    dateRange: any;
    setPagesCurrent: ({}: any) => any;
    doc: any;
    setChangedDoc: ({}: any) => any;
    filteredData: any;
    lastCalcOldData: any;
    setLastCalcOldData: ({}: any) => any;
    setCurrentPricesCalculatedBasedOn: ({}: any) => any;
}

export const CalcPricesModal = ({
    sellerId,
    disabled,
    dateRange,
    setPagesCurrent,
    doc,
    setChangedDoc,
    filteredData,
    lastCalcOldData,
    setLastCalcOldData,
    setCurrentPricesCalculatedBasedOn,
}: CalcPricesModalProps) => {
    const {showError} = useError();
    const [calculatingFlag, setCalculatingFlag] = useState(false);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');
    const [enteredDiscountValue, setEnteredDiscountValue] = useState('');
    const [fixPrices, setFixPrices] = useState(false);
    const [enteredValueValid, setEnteredValueValid] = useState(false);
    const [changeDiscount, setChangeDiscount] = useState(false);
    const [enteredDiscountValueValid, setEnteredDiscountValueValid] = useState(false);

    const [changeFixedPrices, setChangeFixedPrices] = useState(false);
    const [changeFixedPricesInPercents, setChangeFixedPricesInPercents] = useState(false);

    const selectOptionsEntered = [
        {value: 'Цена после скидки', content: 'Цена после скидки'},
        {value: 'Цена с СПП', content: 'Цена с СПП'},
        {value: 'Цена с WB кошельком', content: 'Цена с WB кошельком'},
        // {value: 'Цена с WB Клубом', content: 'Цена с WB Клубом'},
        {value: 'Наценка к себестоимости', content: 'Наценка к себестоимости'},
        {value: 'Рентабельность', content: 'Рентабельность'},
        {value: 'Профит', content: 'Профит'},
        {value: 'Марж. без рекламы', content: 'Марж. без рекламы'},
        {value: 'Марж.% без рекламы', content: 'Марж.% без рекламы'},
    ];
    const [selectValueEntered, setSelectValueEntered] = useState<string[]>(['Цена после скидки']);

    const [useFile, setUseFile] = useState(false);

    const [enableOborRuleSet, setEnableOborRuleSet] = useState(false);
    const [tempChangeObor, setTempChangeObor] = useState<any>({});
    const [tempChangeOborValidationState, setTempChangeOborValidationState] = useState<any>({});
    const [oborRuleSet, setOborRuleSet] = useState<any>({
        999999: '',
    });
    const [oborRuleSetValidationState, setOborRuleSetValidationState] = useState<any>({
        999999: true,
    });
    useEffect(() => {
        const temp: any = {};
        const keysTemp = Object.keys(oborRuleSet);
        const keys = [] as number[];
        for (const key of keysTemp) {
            const num = parseInt(key);
            keys.push(num);
            keys.push(num + 1);
        }

        for (const [obor, val] of Object.entries(tempChangeObor)) {
            if (
                !val ||
                0 >= parseInt(val as string) ||
                999999 <= parseInt(val as string) ||
                keys.includes(parseInt(val as string)) ||
                isNaN(parseInt(val as string)) ||
                val == ''
            )
                temp[obor] = false;
            else temp[obor] = true;
        }
        setTempChangeOborValidationState(temp);
    }, [tempChangeObor]);

    useEffect(() => {
        const temp: any = {};
        for (const [obor, val] of Object.entries(oborRuleSet)) {
            if (!val || isNaN(parseInt(val as string)) || val == '') temp[obor] = false;
            else temp[obor] = true;
        }
        setOborRuleSetValidationState(temp as any);
    }, [oborRuleSet]);
    const isOborRuleSetValid = useMemo(() => {
        for (const [_, valid] of Object.entries(oborRuleSetValidationState)) {
            if (!valid) return false;
        }
        return true;
    }, [oborRuleSetValidationState]);
    const clearOborRuleSet = () => {
        const temp: any = {...oborRuleSet};
        const tempValid: any = {...oborRuleSetValidationState};
        for (const [obor, _] of Object.entries(temp)) {
            temp[obor] = '';
            tempValid[obor] = true;
        }
        setEnableOborRuleSet(false);
        setOborRuleSet(temp);
        setOborRuleSetValidationState(tempValid);
    };

    const parseResponse = (response: any) => {
        console.log('response', response);

        const tempOldData: any = {};
        for (const [art, artData] of Object.entries(response['pricesData'])) {
            tempOldData[art] = doc['pricesData'][art];
            doc['pricesData'][art] = artData;
        }

        setLastCalcOldData(tempOldData);
        setChangedDoc({...doc});
        setPagesCurrent(1);
    };

    const calcPrices = async () => {
        try {
            setCalculatingFlag(true);
            const params: any = {
                seller_id: sellerId,
                dateRange: getNormalDateRange(dateRange),
                enteredValue: {},
                fixPrices: fixPrices || enableOborRuleSet || changeFixedPrices,
            };

            const keys: any = {
                'Цена после скидки': 'rozPrice',
                'Цена с СПП': 'sppPrice',
                'Цена с WB кошельком': 'wbWalletPrice',
                'Цена с WB Клубом': 'clubDiscountedPrice',
                'Наценка к себестоимости': 'primeCostMarkup',
                Рентабельность: 'rentabelnost',
                Профит: 'profit',
                'Марж. без рекламы': 'profit_no_ad',
                'Марж.% без рекламы': 'rent_no_ad',
            };

            const key = keys[selectValueEntered[0]];
            params.enteredValue[key] = parseInt(enableOborRuleSet ? '-1' : enteredValue);

            if (changeDiscount) {
                params.enteredValue['discount'] = parseInt(enteredDiscountValue);
            }

            if (enableOborRuleSet) {
                const tempOborRuleSet: any = {};
                for (const [obor, val] of Object.entries(oborRuleSet)) {
                    tempOborRuleSet[obor] = val !== '' ? parseInt(val as any) : undefined;
                }
                params.enteredValue['oborRuleSet'] = tempOborRuleSet;
            } else if (changeFixedPrices) {
                params.enteredValue['changeFixedPrices'] = true;
                params.enteredValue['changeFixedPricesInPercents'] = changeFixedPricesInPercents;
            }

            const filters = {
                brands: [] as string[],
                objects: [] as string[],
                arts: [] as string[],
            };
            for (let i = 0; i < filteredData.length; i++) {
                const row = filteredData[i];
                const {brand, object, art} = row ?? {};

                if (!filters.brands.includes(brand)) filters.brands.push(brand);
                if (!filters.objects.includes(object)) filters.objects.push(object);
                if (!filters.arts.includes(art)) filters.arts.push(art);
            }
            params.enteredValue['filters'] = filters;

            console.log(params);

            for (const [art, artData] of Object.entries(lastCalcOldData)) {
                doc['pricesData'][art] = artData;
            }
            setLastCalcOldData({});

            console.log(params);
            setEnteredValuesModalOpen(false);

            const response = await ApiClient.post('prices/calc', params, 'json', true);
            if (response && response.data) {
                setCurrentPricesCalculatedBasedOn(key == 'primeCostMarkup' ? 'rozPrice' : key);
                parseResponse(response.data);
            } else {
                console.error('No data received from the API');
            }
            setCalculatingFlag(false);
        } catch (error) {
            console.error(error);
            showError('Не удалось рассчитать цены.');
            setCalculatingFlag(false);
        }
    };

    const {NoCheckedRowsPopup, openNoCheckedRowsPopup} = useNoCheckedRowsPopup();

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {NoCheckedRowsPopup}
            <ActionTooltip title='Рассчитывает различные параметры цены для артикула'>
                <Button
                    disabled={disabled}
                    loading={calculatingFlag}
                    size="l"
                    view="action"
                    onClick={() => {
                        if (filteredData?.length) {
                            setEnteredValuesModalOpen(true);
                            setEnteredValuesModalOpen(true);
                            setEnteredValue('');
                            setEnteredDiscountValue('');
                            clearOborRuleSet();
                            setFixPrices(false);
                            setEnteredValueValid(false);
                            setChangeDiscount(false);
                            setEnteredDiscountValueValid(false);
                        } else openNoCheckedRowsPopup();
                    }}
                >
                    <Icon data={Calculator} />
                    <Text variant="subheader-1">Рассчитать</Text>
                </Button>
            </ActionTooltip>
            <motion.div
                style={{
                    overflow: 'hidden',
                    marginTop: 4,
                }}
                animate={{
                    maxWidth: calculatingFlag ? 40 : 0,
                    opacity: calculatingFlag ? 1 : 0,
                }}
            >
                <Spin style={{marginLeft: 8}} />
            </motion.div>
            <Modal
                open={enteredValuesModalOpen && !disabled}
                onClose={() => {
                    setEnteredValuesModalOpen(false);
                }}
            >
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
                            minWidth: 270,
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#221d220f',
                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <Select
                                width={'max'}
                                size="l"
                                value={selectValueEntered}
                                options={selectOptionsEntered}
                                onUpdate={(val) => {
                                    setSelectValueEntered(val);
                                }}
                            />
                            <div style={{minWidth: 8}} />
                            <Tooltip openDelay={600} content={'Использовать файл для загрузки'}>
                                <Button
                                    selected={useFile}
                                    onClick={() => setUseFile(!useFile)}
                                    size="l"
                                >
                                    <Icon data={FileDollar} />
                                </Button>
                            </Tooltip>
                        </div>
                        <motion.div
                            animate={{
                                maxHeight: useFile ? 0 : enableOborRuleSet ? 1000 : 210,
                                overflow: 'hidden',
                            }}
                            style={{
                                width: '100%',
                                maxHeight: 210,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{minHeight: 8}} />
                            <motion.div
                                animate={{
                                    maxHeight: enableOborRuleSet ? 1000 : 0,
                                    maxWidth: enableOborRuleSet ? 470 : 0,
                                    opacity: enableOborRuleSet ? 1 : 0,
                                }}
                                style={{
                                    maxHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {(() => {
                                    let oborPrev = -1;
                                    const oborTextInputs = [] as any[];
                                    const keys = Object.keys(oborRuleSet);
                                    for (let i = 0; i < keys.length; i++) {
                                        const obor = keys[i];
                                        oborTextInputs.push(
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text variant="subheader-1" style={{margin: 8}}>
                                                    От:
                                                </Text>
                                                <div style={{width: 80}}>
                                                    <TextInput
                                                        size="l"
                                                        disabled
                                                        value={String(oborPrev + 1)}
                                                        onUpdate={() => {}}
                                                    />
                                                </div>
                                                <Text variant="subheader-1" style={{margin: 8}}>
                                                    До:
                                                </Text>
                                                <div style={{width: 80, height: 36}}>
                                                    {i == keys.length - 1 ? (
                                                        <Button size="l" disabled width="max">
                                                            <Text variant="subheader-2">∞</Text>
                                                        </Button>
                                                    ) : (
                                                        <TextInput
                                                            placeholder={obor}
                                                            startContent={
                                                                <motion.div
                                                                    style={{opacity: 0}}
                                                                    animate={{
                                                                        width:
                                                                            tempChangeObor[obor] !==
                                                                            undefined
                                                                                ? 28
                                                                                : 0,

                                                                        opacity:
                                                                            tempChangeObor[obor] !==
                                                                            undefined
                                                                                ? 1
                                                                                : 0,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        selected
                                                                        disabled={
                                                                            tempChangeOborValidationState[
                                                                                obor
                                                                            ] === false
                                                                        }
                                                                        onClick={() => {
                                                                            const temp: any =
                                                                                oborRuleSet[obor];
                                                                            delete oborRuleSet[
                                                                                obor
                                                                            ];
                                                                            oborRuleSet[
                                                                                parseInt(
                                                                                    tempChangeObor[
                                                                                        obor
                                                                                    ],
                                                                                )
                                                                            ] = temp;
                                                                            delete tempChangeObor[
                                                                                obor
                                                                            ];
                                                                            setOborRuleSet({
                                                                                ...oborRuleSet,
                                                                            });
                                                                            setTempChangeObor({
                                                                                ...tempChangeObor,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <Icon data={Check} />
                                                                    </Button>
                                                                </motion.div>
                                                            }
                                                            size="l"
                                                            value={tempChangeObor[obor] ?? obor}
                                                            onUpdate={(val) => {
                                                                if (val == obor) {
                                                                    delete tempChangeObor[obor];
                                                                } else tempChangeObor[obor] = val;
                                                                setTempChangeObor({
                                                                    ...tempChangeObor,
                                                                });
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div style={{width: 220, margin: 8}}>
                                                    <TextInput
                                                        placeholder={
                                                            selectValueEntered[0] ==
                                                            'Наценка к себестоимости'
                                                                ? 'Введите наценку, %'
                                                                : selectValueEntered[0] ==
                                                                        'Рентабельность' ||
                                                                    selectValueEntered[0] ==
                                                                        'Марж.% без рекламы'
                                                                  ? 'Введите рентабельность, %'
                                                                  : selectValueEntered[0] ==
                                                                          'Профит' ||
                                                                      selectValueEntered[0] ==
                                                                          'Марж. без рекламы'
                                                                    ? 'Введите профит, ₽'
                                                                    : 'Введите цену, ₽'
                                                        }
                                                        size="l"
                                                        value={oborRuleSet[obor]}
                                                        disabled={!enableOborRuleSet}
                                                        validationState={
                                                            oborRuleSetValidationState[obor]
                                                                ? undefined
                                                                : 'invalid'
                                                        }
                                                        onUpdate={(val) => {
                                                            const curVal = {...oborRuleSet};
                                                            curVal[obor] = val;
                                                            setOborRuleSet(curVal);
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    view="outlined"
                                                    size="l"
                                                    onClick={() => {
                                                        if (i == keys.length - 1) {
                                                            const keyObor =
                                                                keys.length == 1
                                                                    ? 7
                                                                    : parseInt(
                                                                          keys[keys.length - 2],
                                                                      ) + 7;

                                                            oborRuleSet[String(keyObor)] = '';
                                                            setOborRuleSet({...oborRuleSet});
                                                        } else {
                                                            delete oborRuleSet[obor];
                                                            setOborRuleSet({...oborRuleSet});
                                                        }
                                                    }}
                                                >
                                                    <Icon
                                                        data={i == keys.length - 1 ? Plus : Xmark}
                                                    />
                                                </Button>
                                            </div>,
                                        );
                                        oborPrev = parseInt(obor);
                                    }

                                    return oborTextInputs;
                                })()}
                            </motion.div>
                            <motion.div
                                style={{
                                    overflow: 'hidden',
                                    width: '100%',
                                    maxHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                                animate={{
                                    maxHeight: enableOborRuleSet ? 0 : 36,
                                    opacity: enableOborRuleSet ? 0 : 1,
                                }}
                            >
                                <TextInput
                                    size="l"
                                    disabled={enableOborRuleSet}
                                    placeholder={
                                        selectValueEntered[0] == 'Наценка к себестоимости'
                                            ? 'Введите наценку, %'
                                            : selectValueEntered[0] == 'Рентабельность' ||
                                                selectValueEntered[0] == 'Марж.% без рекламы'
                                              ? 'Введите рентабельность, %'
                                              : selectValueEntered[0] == 'Профит' ||
                                                  selectValueEntered[0] == 'Марж. без рекламы'
                                                ? 'Введите профит, ₽'
                                                : 'Введите цену, ₽'
                                    }
                                    value={enteredValue}
                                    validationState={
                                        enteredValueValid || enableOborRuleSet
                                            ? undefined
                                            : 'invalid'
                                    }
                                    onUpdate={(val) => {
                                        const temp = parseInt(val);
                                        setEnteredValueValid(!isNaN(temp));
                                        setEnteredValue(val);
                                    }}
                                />
                                <div style={{minWidth: 8}} />
                                <Tooltip
                                    openDelay={600}
                                    content={'Изменить параметры цены на значение или процент.'}
                                >
                                    <Button
                                        size="l"
                                        selected={changeFixedPrices}
                                        onClick={() => {
                                            setChangeFixedPrices(!changeFixedPrices);
                                        }}
                                    >
                                        <Icon data={Pencil} />
                                        Изменить на ±
                                    </Button>
                                </Tooltip>
                                <motion.div
                                    style={{width: 0}}
                                    animate={{
                                        width: changeFixedPrices ? 65 : 0,
                                        marginLeft: changeFixedPrices ? 8 : 0,
                                    }}
                                >
                                    <Tooltip
                                        openDelay={600}
                                        content={
                                            'Использовать процент для изменения параметра цены'
                                        }
                                    >
                                        <Button
                                            size="l"
                                            selected={changeFixedPricesInPercents}
                                            onClick={() => {
                                                setChangeFixedPricesInPercents(
                                                    !changeFixedPricesInPercents,
                                                );
                                            }}
                                        >
                                            в
                                            <Icon data={Percent} />
                                        </Button>
                                    </Tooltip>
                                </motion.div>
                            </motion.div>
                            <div style={{minHeight: 8}} />

                            <div
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <TextInput
                                    size="l"
                                    disabled={!changeDiscount}
                                    placeholder={'Введите скидку, %'}
                                    value={enteredDiscountValue}
                                    validationState={
                                        changeDiscount
                                            ? enteredDiscountValueValid
                                                ? undefined
                                                : 'invalid'
                                            : undefined
                                    }
                                    onUpdate={(val) => {
                                        const temp = parseInt(val);
                                        setEnteredDiscountValueValid(!isNaN(temp));
                                        setEnteredDiscountValue(val);
                                    }}
                                />
                                <div style={{minWidth: 8}} />
                                <Tooltip
                                    openDelay={600}
                                    content={'Изменить процент скидки на товар'}
                                >
                                    <Button
                                        size="l"
                                        selected={changeDiscount}
                                        onClick={() => {
                                            setChangeDiscount(!changeDiscount);
                                        }}
                                    >
                                        <Icon data={Pencil} />
                                        Изменить
                                    </Button>
                                </Tooltip>
                            </div>
                            <div style={{minHeight: 8}} />
                            <Checkbox
                                size="l"
                                checked={enableOborRuleSet}
                                onUpdate={(val) => setEnableOborRuleSet(val)}
                                content="Задать для оборачиваемости"
                            />
                        </motion.div>
                        <motion.div
                            animate={{
                                maxHeight: useFile ? 96 : 0,
                                marginTop: useFile ? 8 : 0,
                                overflow: 'hidden',
                            }}
                            style={{
                                width: '100%',
                                maxHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <DownloadPricesCalcTemplate
                                sellerId={sellerId}
                                mode={selectValueEntered[0]}
                                filteredData={filteredData}
                            />
                            <div style={{minHeight: 8}} />
                            <UploadPricesCalcTemplate
                                sellerId={sellerId}
                                fixPrices={fixPrices}
                                dateRange={dateRange}
                                parseResponse={parseResponse}
                                setCurrentPricesCalculatedBasedOn={
                                    setCurrentPricesCalculatedBasedOn
                                }
                                setCalculatingFlag={setCalculatingFlag}
                                setOpen={setEnteredValuesModalOpen}
                            />
                        </motion.div>
                        <motion.div
                            style={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                size="l"
                                content={'Зафиксировать цены'}
                                checked={fixPrices || enableOborRuleSet || changeFixedPrices}
                                onUpdate={(val) => {
                                    setFixPrices(val);
                                }}
                            />
                        </motion.div>
                        <motion.div
                            animate={{
                                maxHeight: !useFile ? 44 : 0,
                                marginTop: !useFile ? 8 : 0,
                                overflow: 'hidden',
                            }}
                            style={{
                                maxHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                selected
                                pin="circle-circle"
                                disabled={
                                    disabled ||
                                    (!enableOborRuleSet && !enteredValueValid) ||
                                    (changeDiscount && !enteredDiscountValueValid) ||
                                    (enableOborRuleSet && !isOborRuleSetValid)
                                }
                                size="l"
                                view="action"
                                onClick={calcPrices}
                            >
                                <Icon data={Calculator}></Icon>
                                Рассчитать
                            </Button>
                        </motion.div>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
