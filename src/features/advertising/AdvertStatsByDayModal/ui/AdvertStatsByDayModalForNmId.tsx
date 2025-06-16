import {useEffect, useState} from 'react';
import {AdvertDateData} from '../types/AdvertDateData';
import {AdvertStatsByDayModal} from './AdvertStatsByDayModal';
import {calcByDayStats} from '../hooks/calcByDayStatsForArt';
import {ActionTooltip, Button, Icon} from '@gravity-ui/uikit';
import {LayoutList} from '@gravity-ui/icons';
import {getProfitForArtByDate} from '../api/getProfitForArtByDate';
import {useCampaign} from '@/contexts/CampaignContext';

interface AdvertStatsByDayModalForNmIdProps {
    art: string;
    docCampaign: any;
    dateRange: [Date, Date];
}

export const AdvertStatsByDayModalForNmId = ({
    art,
    docCampaign,
    dateRange,
}: AdvertStatsByDayModalForNmIdProps) => {
    const [data, setData] = useState<AdvertDateData[]>([]);
    const [open, setOpen] = useState(false);
    const {sellerId} = useCampaign();
    const [profit, setProfit] = useState<{[key: string]: number}>({});

    const getProfit = async () => {
        try {
            const res = await getProfitForArtByDate(sellerId, art, dateRange[0], dateRange[1]);
            setProfit(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) {
            getProfit();
            const temp = calcByDayStats(art, dateRange, docCampaign);
            console.log(temp);
            setData(temp);
        }
    }, [open]);

    useEffect(() => {
        if (profit) {
            const stats = calcByDayStats(art, dateRange, docCampaign, profit);
            setData(stats);
        }
    }, [profit]);
    return (
        <AdvertStatsByDayModal
            open={open}
            setOpen={setOpen}
            data={data}
            customButton={({onClick}) => (
                <ActionTooltip title='Открывает детальную статистику по дням для выбранного артикула'>
                    <Button pin="brick-brick" view="outlined" size="xs" onClick={onClick}>
                        <Icon data={LayoutList}></Icon>
                    </Button>
                </ActionTooltip>
            )}
        />
    );
};
