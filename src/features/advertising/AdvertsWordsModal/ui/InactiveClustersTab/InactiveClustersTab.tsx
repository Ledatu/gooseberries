import {useEffect} from 'react';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ClustersTable} from '../ClustersTable';

export const InactiveClusters = () => {
	const {setExcluded} = useAdvertsWordsModal();
	useEffect(() => {
		setExcluded(true);
	}, []);
	return <ClustersTable />;
};