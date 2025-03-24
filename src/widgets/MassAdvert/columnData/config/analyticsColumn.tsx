import {Button, Card, Icon, Text, Tooltip} from '@gravity-ui/uikit';
import {getEnumurationString} from '@/utilities/getEnumerationString';
import {TriangleExclamation, TShirt} from '@gravity-ui/icons';
import {PageInfoGraphs} from '@/components/Pages/MassAdvertPage/PageInfoGraphs';
import {StocksByWarehousesPopup} from '@/components/Pages/MassAdvertPage/StocksByWarehousesPopup';

interface GetAnalyticsColumnParams {
    unvalidatedArts: any;
    stocksByWarehouses: any;
    sellerId: any;
}

export const getAnalyticsColumn = ({
    unvalidatedArts,
    stocksByWarehouses,
    sellerId,
}: GetAnalyticsColumnParams) => ({
    name: 'analytics',
    placeholder: 'Аналитика',
    render: ({row, footer}: any) => {
        const {profit, rentabelnost} = row;
        if (footer) {
            return (
                <Text color={profit > 0 ? 'positive' : 'danger'}>
                    {`${new Intl.NumberFormat('ru-RU').format(
                        Math.round(profit),
                    )} ₽ / ${new Intl.NumberFormat('ru-RU').format(Math.round(rentabelnost))}%`}
                </Text>
            );
        }
        const warningArtIcon = () => {
            const nmIdArray = unvalidatedArts.map((art: {nmId: any}) => art.nmId);
            const nmIdIndex = nmIdArray.findIndex((element: any) => element == nmId);
            if (nmIdIndex != -1) {
                const art = unvalidatedArts[nmIdIndex];
                const keys = Object.keys(art);
                const words: string[] = [];
                for (const key of keys) {
                    switch (key) {
                        case 'prices':
                            words.push('себестоимость');
                            break;
                        case 'tax':
                            words.push('налог');
                            break;
                        default:
                            break;
                    }
                }
                return (
                    <div style={{pointerEvents: 'auto'}}>
                        <Tooltip
                            style={{maxWidth: '400px'}}
                            content={
                                <Text>
                                    Внимание: расчёт прибыли выполнен с ошибкой. Пожалуйста,
                                    укажите&nbsp;{getEnumurationString(words)} для корректного
                                    отображения данных
                                </Text>
                            }
                            disabled={false}
                        >
                            <Text content={'div'} style={{color: 'rgb(255, 190, 92)'}}>
                                <Icon data={TriangleExclamation} size={11} />
                            </Text>
                        </Tooltip>
                    </div>
                );
            }
            return <div />;
        };
        const {placementsValue, stocksBySizes, nmId} = row ?? {};
        const stocksByWarehousesArt = stocksByWarehouses?.[nmId];
        const {phrase} = placementsValue ?? {};
        return (
            <Card
                style={{
                    width: 160,
                    height: 110.5,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <PageInfoGraphs
                    sellerId={sellerId}
                    phrase={phrase}
                    placementsValue={placementsValue}
                />
                {stocksBySizes && stocksBySizes.all > 1 ? (
                    <Button
                        style={{
                            width: 160,
                            overflow: 'hidden',
                        }}
                        width="max"
                        size="xs"
                        view={stocksBySizes ? 'outlined' : 'outlined-danger'}
                        pin="clear-clear"
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text>{`${stocksBySizes.available ?? ''} / ${
                                stocksBySizes.all ?? ''
                            }`}</Text>
                            <div style={{minWidth: 3}} />
                            <Icon data={TShirt} size={11} />
                        </div>
                    </Button>
                ) : (
                    <></>
                )}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div
                        style={{
                            width: '100%',
                            background: 'var(--g-color-base-generic-hover)',
                            height: 0.5,
                        }}
                    />
                    <StocksByWarehousesPopup stocksByWarehousesArt={stocksByWarehousesArt} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div
                        style={{
                            width: '100%',
                            background: 'var(--g-color-base-generic-hover)',
                            height: 0.5,
                        }}
                    />
                    <Button
                        disabled={!Math.round(profit)}
                        style={{
                            width: 160,
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                        width="max"
                        size="xs"
                        view={'flat'}
                        pin="clear-clear"
                    >
                        <Text
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}
                            color={
                                !Math.round(profit) ? undefined : profit > 0 ? 'positive' : 'danger'
                            }
                        >
                            {`${new Intl.NumberFormat('ru-RU').format(
                                Math.round(profit),
                            )} ₽ / ${new Intl.NumberFormat('ru-RU').format(
                                Math.round(rentabelnost),
                            )}%`}

                            {warningArtIcon()}
                        </Text>
                    </Button>
                </div>
            </Card>
        );
    },
    sortFunction: (a: any, b: any, order: any) => {
        const profitsDataA = a?.profit;
        const profitsDataB = b?.profit;
        const isNaNa = isNaN(profitsDataA);
        const isNaNb = isNaN(profitsDataB);
        if (isNaNa && isNaNb) return 1;
        else if (isNaNa) return 1;
        else if (isNaNb) return -1;
        return (profitsDataA - profitsDataB) * order;
    },
});
