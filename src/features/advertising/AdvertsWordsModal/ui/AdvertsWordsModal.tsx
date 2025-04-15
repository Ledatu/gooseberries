'use client';

import {ReactNode, useState} from 'react';
import {AdvertWordsProvider} from '../hooks/AdvertsWordsModalContext';
import {AdvertsWordsHeader} from './AdvertsWordsHeader';
import {AdvertsWordsPage} from '../AdvertsWordsPages';
import {SaveTemplateModal} from './SaveTemplateModal';
import {AdditionalInfoTab} from './AdditionalInfo';
import {ModalWindow} from '@/shared/ui/Modal';
// import Classes from '@/styles/cardStyle.module.scss';

interface AdvertsWordsModal2Props {
    advertId: number;
    nmId: number;
    getNames: Function;
    children: ReactNode;
}

export const AdvertsWordsModal = ({
    advertId,
    children,
    getNames,
    nmId,
}: AdvertsWordsModal2Props) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const handleClose = () => setModalOpen(false);
    return (
        <>
            <div onClick={() => setModalOpen(!modalOpen)}>{children}</div>
            <ModalWindow padding={false} isOpen={modalOpen} handleClose={handleClose}>
                <div
                    style={{
                        width: '90vw',
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <AdvertWordsProvider
                        nmId={nmId}
                        getNames={getNames}
                        advertId={advertId}
                        closeAdvertsWordsModal={handleClose}
                    >
                        <SaveTemplateModal />
                        <AdvertsWordsHeader />
                        <AdditionalInfoTab />
                        <AdvertsWordsPage />
                    </AdvertWordsProvider>
                </div>
            </ModalWindow>
        </>
    );
};
