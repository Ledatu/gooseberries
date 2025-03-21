'use client';

import TheTable from '@/components/TheTable';
import {Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import { ActiveClustersTable } from '../../ui/ActiveClustersTable';

export const ActiveClustersPage = () => {
    return (
        <motion.div layoutId="AdvertsWordsPage">
            <ActiveClustersTable />
            {/* <Text>ActiveClustersPage</Text>
			<Text>ВОЖЛДЫОДЖОВДЖо</Text> */}
        </motion.div>
    );
};
