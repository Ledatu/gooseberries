import {
    Button,
    Card,
    Checkbox,
    Icon,
    Modal,
    Select,
    Spin,
    Text,
    TextInput,
} from '@gravity-ui/uikit';
import {Calculator} from '@gravity-ui/icons';
import React, {useState} from 'react';
import {motion} from 'framer-motion';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateTextInputWithNoteOnTop, getNormalDateRange} from 'src/utilities/getRoundValue';
import {useCampaign} from 'src/contexts/CampaignContext';

export const CalcPricesModal = ({
    dateRange,
    setPagesCurrent,
    doc,
    setChangedDoc,
    filteredData,
    lastCalcOldData,
    setLastCalcOldData,
    setCurrentPricesCalculatedBasedOn,
}) => {
    const {selectValue} = useCampaign();
    const [calculatingFlag, setCalculatingFlag] = useState(false);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState('');
    const [enteredDiscountValue, setEnteredDiscountValue] = useState('');
    const [fixPrices, setFixPrices] = useState(false);
    const [enteredValueValid, setEnteredValueValid] = useState(false);
    const [changeDiscount, setChangeDiscount] = useState(false);
    const [enteredDiscountValueValid, setEnteredDiscountValueValid] = useState(false);

    const selectOptionsEntered = [
        {value: 'Цена после скидки', content: 'Цена после скидки'},
        {value: 'Цена с СПП', content: 'Цена с СПП'},
        {value: 'Наценка к себестоимости', content: 'Наценка к себестоимости'},
        {value: 'Рентабельность', content: 'Рентабельность'},
        {value: 'Профит', content: 'Профит'},
    ];
    const [selectValueEntered, setSelectValueEntered] = React.useState<string[]>([
        'Цена после скидки',
    ]);

    const [enableOborRuleSet, setEnableOborRuleSet] = React.useState(false);
    const [oborRuleSet, setOborRuleSet] = React.useState({
        7: '',
        14: '',
        30: '',
        60: '',
        90: '',
        120: '',
        999: '',
    });
    const [oborRuleSetValidationState, setOborRuleSetValidationState] = React.useState({
        7: true,
        14: true,
        30: true,
        60: true,
        90: true,
        120: true,
        999: true,
    });
    const isOborRuleSetValid = () => {
        for (const [_, valid] of Object.entries(oborRuleSetValidationState)) {
            if (!valid) return false;
        }
        return true;
    };
    const clearOborRuleSet = () => {
        const temp = {...oborRuleSet};
        const tempValid = {...oborRuleSetValidationState};
        for (const [obor, _] of Object.entries(temp)) {
            temp[obor] = '';
            tempValid[obor] = true;
        }
        setEnableOborRuleSet(false);
        setOborRuleSet(temp);
        setOborRuleSetValidationState(tempValid);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                loading={calculatingFlag}
                size="l"
                view="action"
                onClick={() => {
                    setEnteredValuesModalOpen(true);
                    setEnteredValue('');
                    setEnteredDiscountValue('');
                    clearOborRuleSet();
                    setFixPrices(false);
                    setEnteredValueValid(false);
                    setChangeDiscount(false);
                    setEnteredDiscountValueValid(false);
                }}
            >
                <Icon data={Calculator} />
                <Text variant="subheader-1">Рассчитать</Text>
            </Button>
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
                open={enteredValuesModalOpen}
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
                            overflow: 'hidden',
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
                        <Select
                            size="l"
                            value={selectValueEntered}
                            options={selectOptionsEntered}
                            onUpdate={(val) => {
                                setSelectValueEntered(val);
                            }}
                        />
                        <div style={{minHeight: 8}} />
                        <TextInput
                            size="l"
                            disabled={enableOborRuleSet}
                            placeholder={
                                selectValueEntered[0] == 'Наценка к себестоимости'
                                    ? 'Введите наценку, %'
                                    : selectValueEntered[0] == 'Рентабельность'
                                    ? 'Введите рентабельность, %'
                                    : selectValueEntered[0] == 'Профит'
                                    ? 'Введите профит, ₽'
                                    : 'Введите цену, ₽'
                            }
                            value={enteredValue}
                            validationState={
                                enteredValueValid || enableOborRuleSet ? undefined : 'invalid'
                            }
                            onUpdate={(val) => {
                                const temp = parseInt(val);
                                setEnteredValueValid(!isNaN(temp));
                                setEnteredValue(val);
                            }}
                        />
                        <div style={{minHeight: 8}} />
                        <Checkbox
                            size="l"
                            content={'Изменить скидку'}
                            checked={changeDiscount}
                            onUpdate={(val) => {
                                setChangeDiscount(val);
                            }}
                        />
                        <div style={{minHeight: 8}} />
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
                        <div style={{minHeight: 8}} />
                        <Checkbox
                            size="l"
                            content={'Зафиксировать цены'}
                            checked={fixPrices || enableOborRuleSet}
                            onUpdate={(val) => {
                                setFixPrices(val);
                            }}
                        />
                        <div style={{minHeight: 8}} />
                        <div
                            style={{
                                overflow: 'hidden',
                                display: 'flex',
                                width: 'calc(100%-32px)',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                size="l"
                                checked={enableOborRuleSet}
                                onUpdate={(val) => setEnableOborRuleSet(val)}
                                content="Задать для оборачиваемости"
                            />
                            <motion.div
                                animate={{
                                    maxHeight: enableOborRuleSet ? 1000 : 0,
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
                                    for (const [obor, _] of Object.entries(oborRuleSet)) {
                                        oborTextInputs.push(
                                            <div style={{width: '8em', margin: 8}}>
                                                {generateTextInputWithNoteOnTop({
                                                    value: oborRuleSet[obor],
                                                    disabled: !enableOborRuleSet,
                                                    validationState:
                                                        oborRuleSetValidationState[obor],
                                                    placeholder: `${oborPrev + 1} - ${obor} дней`,
                                                    onUpdateHandler: (val) => {
                                                        const curVal = {...oborRuleSet};
                                                        const temp = parseInt(val);
                                                        setOborRuleSetValidationState(() => {
                                                            const tempValid = {
                                                                ...oborRuleSetValidationState,
                                                            };
                                                            if (isNaN(temp) || !isFinite(temp)) {
                                                                tempValid[obor] = false;
                                                            } else {
                                                                tempValid[obor] = true;
                                                            }
                                                            return tempValid;
                                                        });

                                                        curVal[obor] = val;
                                                        setOborRuleSet(curVal);
                                                    },
                                                })}
                                            </div>,
                                        );
                                        oborPrev = parseInt(obor);
                                    }

                                    return oborTextInputs;
                                })()}
                            </motion.div>
                        </div>
                        <div style={{minHeight: 8}} />

                        <Button
                            disabled={
                                (!enableOborRuleSet && !enteredValueValid) ||
                                (changeDiscount && !enteredDiscountValueValid) ||
                                (enableOborRuleSet && !isOborRuleSetValid())
                            }
                            size="l"
                            view="action"
                            onClick={() => {
                                setCalculatingFlag(true);
                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    dateRange: getNormalDateRange(dateRange),
                                    enteredValue: {},
                                    fixPrices: fixPrices || enableOborRuleSet,
                                };

                                const keys = {
                                    'Цена после скидки': 'rozPrice',
                                    'Цена с СПП': 'sppPrice',
                                    'Наценка к себестоимости': 'primeCostMarkup',
                                    Рентабельность: 'rentabelnost',
                                    Профит: 'profit',
                                };

                                const key = keys[selectValueEntered[0]];
                                params.enteredValue[key] = parseInt(
                                    enableOborRuleSet ? '-1' : enteredValue,
                                );
                                setCurrentPricesCalculatedBasedOn(
                                    key == 'primeCostMarkup' ? 'rozPrice' : key,
                                );

                                if (changeDiscount) {
                                    params.enteredValue['discount'] =
                                        parseInt(enteredDiscountValue);
                                }

                                if (enableOborRuleSet) {
                                    const tempOborRuleSet = {};
                                    for (const [obor, val] of Object.entries(oborRuleSet)) {
                                        tempOborRuleSet[obor] =
                                            val !== '' ? parseInt(val) : undefined;
                                    }
                                    params.enteredValue['oborRuleSet'] = tempOborRuleSet;
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
                                    if (!filters.objects.includes(object))
                                        filters.objects.push(object);
                                    if (!filters.arts.includes(art)) filters.arts.push(art);
                                }
                                params.enteredValue['filters'] = filters;

                                console.log(params);

                                for (const [art, artData] of Object.entries(lastCalcOldData)) {
                                    doc['pricesData'][selectValue[0]][art] = artData;
                                }
                                setLastCalcOldData({});

                                /////////////////////////
                                callApi('getPricesMM', params, true).then((res) => {
                                    if (!res) return;

                                    const tempOldData = {};
                                    const resData = res['data'];
                                    for (const [art, artData] of Object.entries(
                                        resData['pricesData'][selectValue[0]],
                                    )) {
                                        tempOldData[art] = doc['pricesData'][selectValue[0]][art];

                                        doc['pricesData'][selectValue[0]][art] = artData;
                                    }
                                    doc['artsData'][selectValue[0]] =
                                        resData['artsData'][selectValue[0]];

                                    setLastCalcOldData(tempOldData);

                                    setChangedDoc({...doc});
                                    setCalculatingFlag(false);
                                });

                                setPagesCurrent(1);
                                /////////////////////////

                                setEnteredValuesModalOpen(false);
                            }}
                        >
                            <Icon data={Calculator}></Icon>
                            Рассчитать
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
