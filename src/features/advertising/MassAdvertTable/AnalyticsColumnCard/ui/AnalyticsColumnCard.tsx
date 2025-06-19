import {StocksByWarehousesPopup} from '@/components/Pages/MassAdvertPage/StocksByWarehousesPopup';
import {useCampaign} from '@/contexts/CampaignContext';
import {PageInfoGraphs} from '@/features/Top100ComparsionInfo/ui';
import {TShirt} from '@gravity-ui/icons';
import {ActionTooltip, Button, Card, Icon, Text} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import {getWordsWarningArtIcon} from '../hooks/getWordsWarningArtIcon';
import {WarningArtIcon} from './WarningArtIcon';

interface AnalyticsColumnCardProps {
    unvalidatedArts: any[];
    row: any;
    stocksByWarehousesArt: any;
}

export const AnalyticsColumnCard = ({
    unvalidatedArts,
    row,
    stocksByWarehousesArt,
}: AnalyticsColumnCardProps) => {
    const {profit, rentabelnost} = row;
    const {placementsValue, stocksBySizes, nmId} = row ?? {};
    const {phrase} = placementsValue ?? {};

    const [words, setWords] = useState<string[]>([]);
    useEffect(() => {
        setWords(getWordsWarningArtIcon(nmId, unvalidatedArts));
    }, [unvalidatedArts, row]);

    const {sellerId} = useCampaign();
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <ActionTooltip title="Показывает график сравнения позиции карточки в топ-100 по запросу">
                    <PageInfoGraphs
                        sellerId={sellerId}
                        phrase={phrase}
                        placementsValue={placementsValue}
                    />
                </ActionTooltip>
            </div>
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        background: 'var(--g-color-base-generic-hover)',
                        height: 0.5,
                    }}
                />
                <StocksByWarehousesPopup stocksByWarehousesArt={stocksByWarehousesArt} />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        background: 'var(--g-color-base-generic-hover)',
                        height: 0.5,
                    }}
                />
                <ActionTooltip title={'Показывает прогнозную прибыль и рентабельность артикула'}>
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
                            {words.length ? <WarningArtIcon words={words} /> : undefined}
                        </Text>
                    </Button>
                </ActionTooltip>
            </div>
        </Card>
    );
};
