import {Button, Card, Icon, Text} from '@gravity-ui/uikit';
import callApi, {getUid} from '@/utilities/callApi';
import {ArrowShapeDown, Check, Xmark} from '@gravity-ui/icons';
import {getRoundValue} from '@/utilities/getRoundValue';

interface GetAutoSalesColumnParams {
    autoSalesProfits: any;
    selectValue: any;
    doc: any;
    filteredData: any;
    setAutoSalesProfits: any;
    setChangedDoc: any;
    showError: any;
}

export const getAutoSalesColumn = ({
    autoSalesProfits,
    selectValue,
    doc,
    filteredData,
    setAutoSalesProfits,
    setChangedDoc,
    showError,
}: GetAutoSalesColumnParams) => ({
    constWidth: 400,
    name: 'autoSales',
    placeholder: 'Акции',
    sortFunction: (a: any, b: any, order: any) => {
        const profitsDataA = autoSalesProfits[a?.art]?.rentabelnost;
        const profitsDataB = autoSalesProfits[b?.art]?.rentabelnost;
        const isNaNa = isNaN(profitsDataA);
        const isNaNb = isNaN(profitsDataB);
        if (isNaNa && isNaNb) return 1;
        else if (isNaNa) return 1;
        else if (isNaNb) return -1;
        return (profitsDataA - profitsDataB) * order;
    },
    additionalNodes: [
        <Button
            view="outlined"
            style={{marginLeft: 5}}
            onClick={() => {
                const params: any = {
                    uid: getUid(),
                    campaignName: selectValue[0],
                    data: {},
                };
                const newDocAutoSales = {...doc.autoSales};
                const tempAutoSales = {...autoSalesProfits};
                for (const row of filteredData) {
                    const {nmId, art} = row;
                    const profits = autoSalesProfits[art];
                    if (!profits) continue;
                    const {autoSaleName, dateRange, rozPrice, oldRozPrices, oldDiscount} = profits;
                    params.data[nmId] = {
                        autoSaleName,
                        dateRange,
                        rozPrice,
                        oldRozPrices,
                        oldDiscount,
                    };
                    delete tempAutoSales[art];
                    newDocAutoSales[selectValue[0]][nmId] = {
                        autoSaleName: '',
                        fixedPrices: {dateRange, autoSaleName},
                    };
                }
                console.log(params);
                callApi('setAutoSales', params, false, true)
                    .then(() => {
                        setAutoSalesProfits(tempAutoSales);
                        doc.autoSales = newDocAutoSales;
                        setChangedDoc({...doc});
                    })
                    .catch((error) => {
                        showError(error.response?.data?.error || 'An unknown error occurred');
                    });
            }}
        >
            <Icon data={Check} />
            Принять все
        </Button>,
        <Button
            style={{marginLeft: 5}}
            view="outlined"
            onClick={() => {
                const tempAutoSales = {...autoSalesProfits};
                for (const row of filteredData) {
                    const {art} = row;
                    delete tempAutoSales[art];
                }
                setAutoSalesProfits(tempAutoSales);
            }}
        >
            <Icon data={Xmark} />
            Отклонить все
        </Button>,
    ],
    render: ({row, footer}: any) => {
        const {art, nmId} = row;
        if (footer) return undefined;
        const profitsData = autoSalesProfits[art];
        const switches = [] as any[];

        if (profitsData) {
            const proftDiff = profitsData.profit - profitsData.oldProfit;
            switches.push(
                <Card
                    style={{
                        height: 110.5,
                        width: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        style={{
                            borderTopLeftRadius: 7,
                            borderTopRightRadius: 7,
                            overflow: 'hidden',
                        }}
                        width="max"
                        size="xs"
                        pin="brick-brick"
                        view="flat"
                    >
                        <Text variant="subheader-1">{profitsData.autoSaleName}</Text>
                    </Button>
                    <Button view="outlined" size="xs" pin="clear-clear" width="max">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                                gap: 8,
                            }}
                        >
                            <Text color={profitsData.oldProfit > 0 ? 'positive' : 'danger'}>
                                {`${new Intl.NumberFormat('ru-RU').format(
                                    profitsData.oldProfit,
                                )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                    getRoundValue(profitsData.oldRentabelnost, 1, true),
                                )}%`}
                            </Text>
                            <div style={{minWidth: 8}} />
                            <Text>{`${profitsData.oldRozPrices} ₽`}</Text>
                        </div>
                    </Button>
                    <Text
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            height: 20,
                        }}
                        color={proftDiff == 0 ? 'secondary' : proftDiff > 0 ? 'positive' : 'danger'}
                    >
                        <Icon data={ArrowShapeDown} />
                        {`${proftDiff > 0 ? '+' : ''}${proftDiff} ₽`}
                    </Text>
                    <Button view="outlined" size="xs" pin="clear-clear" width="max">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                                gap: 8,
                            }}
                        >
                            <Text color={profitsData.profit > 0 ? 'positive' : 'danger'}>
                                {`${new Intl.NumberFormat('ru-RU').format(
                                    profitsData.profit,
                                )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                    getRoundValue(profitsData.rentabelnost, 1, true),
                                )}%`}
                            </Text>
                            <Text>{`${profitsData.rozPrice} ₽`}</Text>
                            <Text>{`с СПП: ${profitsData.sppPrice} ₽`}</Text>
                            <Text>{`с WB к.: ${profitsData.wbWalletPrice} ₽`}</Text>
                        </div>
                    </Button>
                    <div
                        style={{
                            minHeight: 0.5,
                            marginTop: 10,
                            width: '100%',
                            background: 'var(--g-color-base-generic-hover)',
                        }}
                    />
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                        <Button
                            pin="clear-clear"
                            size="xs"
                            width="max"
                            view="flat-success"
                            selected
                            style={{borderBottomLeftRadius: 7, overflow: 'hidden'}}
                            onClick={() => {
                                const params: any = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    data: {},
                                };
                                const {
                                    autoSaleName,
                                    dateRange,
                                    rozPrice,
                                    oldRozPrices,
                                    oldDiscount,
                                } = profitsData;
                                params.data[nmId] = {
                                    autoSaleName,
                                    dateRange,
                                    rozPrice,
                                    oldRozPrices,
                                    oldDiscount,
                                };
                                console.log(params);
                                doc.autoSales[selectValue[0]][nmId] = {
                                    autoSaleName: '',
                                    fixedPrices: {dateRange, autoSaleName},
                                };
                                setChangedDoc({...doc});
                                callApi('setAutoSales', params);
                                const temp = {...autoSalesProfits};
                                delete temp[art];
                                setAutoSalesProfits(temp);
                            }}
                        >
                            <Icon data={Check} />
                        </Button>
                        <Button
                            pin="clear-clear"
                            size="xs"
                            width="max"
                            view="flat-danger"
                            selected
                            style={{borderBottomRightRadius: 7, overflow: 'hidden'}}
                            onClick={() => {
                                const temp = {...autoSalesProfits};
                                delete temp[art];
                                setAutoSalesProfits(temp);
                            }}
                        >
                            <Icon data={Xmark} />
                        </Button>
                    </div>
                </Card>,
            );
            switches.push(<div style={{minWidth: 8}} />);
        }
        switches.pop();
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'scroll',
                    overflowY: 'hidden',
                    // justifyContent: 'space-between',
                }}
            >
                {switches}
            </div>
        );
    },
});
