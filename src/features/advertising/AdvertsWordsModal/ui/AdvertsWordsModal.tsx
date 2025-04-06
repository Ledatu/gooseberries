'use client';

import {cx} from '@/lib/utils';
import {Card, Modal} from '@gravity-ui/uikit';
import {ReactNode, useState} from 'react';
import {AdvertWordsProvider} from '../hooks/AdvertsWordsModalContext';
import {AdvertsWordsHeader} from './AdvertsWordsHeader';
import {AdvertsWordsPage} from '../AdvertsWordsPages';
import {SaveTemplateModal} from './SaveTemplateModal';
import {AdditionalInfoTab} from './AdditionalInfo';
// import Classes from '@/styles/cardStyle.module.scss';

interface AdvertsWordsModal2Props {
    advertId: number;
    children: ReactNode;
}

export const AdvertsWordsModal = ({advertId, children}: AdvertsWordsModal2Props) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    return (
        <div>
            <div onClick={() => setModalOpen(!modalOpen)}>{children}</div>
            <Modal open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                <Card
                    style={{width: '90%', height: '80%', display: 'flex', flexDirection: 'column'}}
                    className={cx(['centred-absolute-element', 'blurred-card'])}
                >
                    <AdvertWordsProvider advertId={advertId}>
                        <SaveTemplateModal />
                        <AdvertsWordsHeader />
                        <AdditionalInfoTab />
                        <AdvertsWordsPage />
                    </AdvertWordsProvider>
                </Card>
            </Modal>
        </div>
    );
};
