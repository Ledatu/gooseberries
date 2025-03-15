'use client';

import {cx} from '@/lib/utils';
import {Button, Card, Modal, Text} from '@gravity-ui/uikit';
import {ReactNode, useState} from 'react';
import {AdvertWordsProvider} from '../hooks/AdvertsWordsModalContext';
import {AdvertsWordsHeader} from './AdvertsWordsHeader';
import {AdvertsWordsPage} from '../AdvertsWordsPages';
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
            {/* <Button
                onClick={() => {
                    setModalOpen(!modalOpen);
                }}
            >
                <Text>ХУЙЖдвфлж{nmId}</Text>
            </Button> */}
            <Modal open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                <Card
                    style={{width: '80%', height: '70%', display: 'flex', flexDirection: 'column'}}
                    className={cx(['centred-absolute-element', 'blurred-card'])}
                >
                    <AdvertWordsProvider advertId={advertId}>
                        <AdvertsWordsHeader />
                        <AdvertsWordsPage />
                    </AdvertWordsProvider>
                    {/* <Text>хай</Text> */}
                </Card>
            </Modal>
        </div>
    );
};
