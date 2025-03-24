'use client';

import {cx} from '@/lib/utils';
import {Button, Card, Modal, Text} from '@gravity-ui/uikit';
import {useState} from 'react';
import {AutoWordsProvider} from './AdvertsWordsModalContext';
import {AdvertsWordsHeader} from './AdvertsWordsHeader';
import {AdvertsWordsPage} from './AdvertsWordsPage';
// import Classes from '@/styles/cardStyle.module.scss';

export const AdvertsWordsModal2 = (nmId: number) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    return (
        <div>
            <Button
                onClick={() => {
                    setModalOpen(!modalOpen);
                }}
            >
                <Text>ХУЙЖдвфлж{nmId}</Text>
            </Button>
            <Modal open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                <Card
                    style={{width: '80%', height: '70%', display: 'flex', flexDirection: 'column'}}
                    className={cx(['centred-absolute-element', 'blurred-card'])}
                >
                    <AutoWordsProvider>
                        <AdvertsWordsHeader />
                        <AdvertsWordsPage />
                    </AutoWordsProvider>
                    {/* <Text>хай</Text> */}
                </Card>
            </Modal>
        </div>
    );
};
