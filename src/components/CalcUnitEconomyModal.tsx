import {Button, Card, Icon, Modal, Text} from '@gravity-ui/uikit';
import {Calculator} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useEffect, useState} from 'react';
import {generateTextInputWithNoteOnTop, getRoundValue} from 'src/utilities/getRoundValue';

export const CalcUnitEconomyModal = () => {
    const [calcUnitEconomyModalOpen, setCalcUnitEconomyModalOpen] = useState(false);
    const [unitEconomyParams, setUnitEconomyParams] = useState({
        rozPrice: '',
        primeCost: '',
        comission: '',
        length: '',
        width: '',
        height: '',
        koef: 100,
        ktr: 1,
        tax: '',
        expences: '',
        drr: 10,
        buyoutsPercent: '',
        obor: 30,
    });
    const [unitEconomyParamsValid, setUnitEconomyParamsValid] = useState({
        rozPrice: false,
        primeCost: false,
        comission: false,
        length: false,
        width: false,
        height: false,
        koef: true,
        ktr: true,
        tax: false,
        expences: false,
        drr: true,
        buyoutsPercent: false,
        obor: true,
    });
    const [unitEconomyProfit, setUnitEconomyProfit] = useState({
        profit: 0,
        delivery: '',
        storage: '',
    });
    const [unitEconomyProfitValid, setUnitEconomyProfitValid] = useState(false);
    useEffect(() => {
        for (const [_, valid] of Object.entries(unitEconomyParamsValid)) {
            if (!valid) {
                setUnitEconomyProfitValid(false);
                return;
            }
        }
        setUnitEconomyProfitValid(true);

        const buyoutsPercent = Number(unitEconomyParams.buyoutsPercent) / 100;

        const rozPrice = Number(unitEconomyParams.rozPrice);
        const primeCost = Number(unitEconomyParams.primeCost);
        const comission = Number(unitEconomyParams.comission) / 100;
        const comissionSum = comission * rozPrice;

        const length = Number(unitEconomyParams.length);
        const width = Number(unitEconomyParams.width);
        const height = Number(unitEconomyParams.height);
        const koef = Number(unitEconomyParams.koef) / 100;
        const ktr = Number(unitEconomyParams.ktr);
        const volume = (length * width * height) / 1000;

        const boxDeliveryBase = 30;
        const boxDeliveryLiter = 7;
        const boxStorageBase = 0.07;
        // const boxStorageLiter = 0.07;

        let delivery = 0;
        delivery += boxDeliveryBase * koef * (volume < 1 ? volume : 1);
        if (volume > 1) {
            delivery += (volume - 1) * (boxDeliveryLiter * koef);
        }
        delivery += (1 - buyoutsPercent) * 50;
        delivery *= ktr ?? 1;
        delivery = delivery / buyoutsPercent;

        const tax = Number(unitEconomyParams.tax) / 100;
        const taxSum = tax * rozPrice;

        const expences = Number(unitEconomyParams.expences) / 100;
        const expencesSum = expences * rozPrice;

        const obor = Number(unitEconomyParams.obor);
        const storageCostForArt = obor * volume * boxStorageBase * koef;

        const drr = Number(unitEconomyParams.drr) / 100;
        const ad = (drr * rozPrice) / buyoutsPercent;

        const allExpences =
            ad + delivery + comissionSum + storageCostForArt + taxSum + expencesSum + primeCost;

        const profit = rozPrice - allExpences;

        const tempProfit = {...unitEconomyProfit};
        tempProfit.profit = profit;
        tempProfit.delivery =
            isNaN(delivery) || !isFinite(delivery) ? 'Ошибка.' : String(Math.round(delivery));
        tempProfit.storage =
            isNaN(storageCostForArt) || !isFinite(storageCostForArt)
                ? 'Ошибка.'
                : String(Math.round(storageCostForArt));
        setUnitEconomyProfit(tempProfit);
    }, [unitEconomyParams]);

    return (
        <>
            <Button
                size="l"
                view="action"
                onClick={() => {
                    setCalcUnitEconomyModalOpen(true);
                }}
            >
                <Icon data={Calculator} />
                <Text variant="subheader-1">Рассчитать юнит экономику</Text>
            </Button>
            <Modal
                open={calcUnitEconomyModalOpen}
                onClose={() => {
                    setCalcUnitEconomyModalOpen(false);
                    setUnitEconomyParams(unitEconomyParams);
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
                        {(() => {
                            const placeholders = [
                                {
                                    rozPrice: 'Цена после скидки, ₽',
                                    primeCost: 'Себестоимость, ₽',
                                    comission: 'Комиссия, %',
                                    tax: 'Налог, %',
                                    expences: 'Доп. расходы, %',
                                    drr: 'ДРР,  %',
                                    buyoutsPercent: 'Процент выкупа, %',
                                },
                                {
                                    length: 'Длина, см.',
                                    width: 'Ширина, см.',
                                    height: 'Высота, см.',
                                    koef: 'Коэффициент склада, %',
                                    ktr: 'КТР',
                                    obor: 'Оборачиваемость, дней',
                                },
                            ];
                            const inputs = [] as any[];
                            for (const headers of placeholders) {
                                const row = [] as any[];
                                for (const [key, placeholder] of Object.entries(headers)) {
                                    row.push(
                                        generateTextInputWithNoteOnTop({
                                            placeholder: placeholder,
                                            value: unitEconomyParams[key],
                                            onUpdateHandler: (val) => {
                                                const temp = {...unitEconomyParams};
                                                temp[key] = val;
                                                setUnitEconomyParams(temp);

                                                const numberLike = Number(val != '' ? val : 'nan');
                                                const validTemp = {
                                                    ...unitEconomyParamsValid,
                                                };
                                                validTemp[key] =
                                                    !isNaN(numberLike) && isFinite(numberLike);
                                                setUnitEconomyParamsValid(validTemp);
                                            },
                                            disabled: false,
                                            validationState: unitEconomyParamsValid[key],
                                        }),
                                    );
                                    row.push(<div style={{minHeight: 8}} />);
                                }
                                row.pop();
                                inputs.push(row);
                            }

                            const divs = [] as any[];
                            for (const row of inputs) {
                                divs.push(
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {row}
                                    </div>,
                                );
                                divs.push(<div style={{minHeight: 8}} />);
                            }
                            return divs;
                        })()}
                        {generateTextInputWithNoteOnTop({
                            placeholder: 'Логистика, ₽',
                            value: unitEconomyProfitValid ? unitEconomyProfit.delivery : 'Ошибка.',
                            onUpdateHandler: () => {},
                            disabled: true,
                            validationState: true,
                        })}
                        <div style={{minHeight: 8}} />
                        {generateTextInputWithNoteOnTop({
                            placeholder: 'Хранение, ₽',
                            value: unitEconomyProfitValid ? unitEconomyProfit.storage : 'Ошибка.',
                            onUpdateHandler: () => {},
                            disabled: true,
                            validationState: true,
                        })}
                        <div style={{minHeight: 8}} />
                        <Text
                            variant="header-1"
                            style={{whiteSpace: 'pre-wrap'}}
                            color={
                                unitEconomyProfitValid
                                    ? unitEconomyProfit.profit > 0
                                        ? 'positive'
                                        : 'danger'
                                    : 'danger'
                            }
                        >
                            {(() => {
                                return unitEconomyProfitValid ? (
                                    `${Math.round(unitEconomyProfit.profit)} / ${getRoundValue(
                                        unitEconomyProfit.profit,
                                        unitEconomyParams['rozPrice'],
                                        true,
                                    )}%`
                                ) : (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        Введите все
                                        <b />
                                        значения
                                    </div>
                                );
                            })()}
                        </Text>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
