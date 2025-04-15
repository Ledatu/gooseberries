import {useEffect} from 'react';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ClustersTable} from '../ClustersTable';

export const ActiveClustersTab = () => {
    const {setExcluded} = useAdvertsWordsModal();
    useEffect(() => {
        setExcluded(false);
    }, []);
    return <ClustersTable isExcluded={false} />;
};
