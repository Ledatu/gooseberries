import {useCampaign} from '@/contexts/CampaignContext';
import {getStatsByDateForAdvertId} from '../api/getStatsByDateForAdvertId';
import {useEffect, useState} from 'react';
import {advertDateDataFromDTO} from '../hooks/advertDateDataFromDTO';
import {AdvertDateData} from '../types/AdvertDateData';
import {AdvertStatsByDayModal} from './AdvertStatsByDayModal';

interface AdvertStatsByDayModalForAdvertIdProps {
    advertId: number;
    arts: string[];
    docCampaign: any;
}

export const AdvertStatsByDayModalForAdvertId = ({
    advertId,
    arts,
    docCampaign,
}: AdvertStatsByDayModalForAdvertIdProps) => {
    const [data, setData] = useState<AdvertDateData[]>([]);
    const [open, setOpen] = useState(false);
    const {sellerId} = useCampaign();
    const getData = async () => {
        try {
            const stats = await getStatsByDateForAdvertId(sellerId, advertId);
            const tempData = advertDateDataFromDTO(stats, docCampaign, arts);
            setData(tempData);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (open) {
            getData();
        }
    }, [open]);

    return <AdvertStatsByDayModal open={open} setOpen={setOpen} data={data} />;
};
