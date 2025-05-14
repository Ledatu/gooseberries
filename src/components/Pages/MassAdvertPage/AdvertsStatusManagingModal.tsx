'use client';

import {Button, Card, Icon, Modal, Spin, Text} from '@gravity-ui/uikit';
import {TrashBin, Play, Pause} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, ReactNode, useState, cloneElement} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import {useError} from '@/contexts/ErrorContext';
import callApi, {getUid} from '@/utilities/callApi';
import ApiClient from '@/utilities/ApiClient';

interface AdvertsStatusManagingModalProps {
    setUpdatePaused: Function;
    children: ReactNode;
    disabled: boolean;
    getUniqueAdvertIdsFromThePage: (args?: any) => any;
    doc: any;
    setChangedDoc: (args?: any) => any;
}

export const AdvertsStatusManagingModal = ({
    setUpdatePaused,
    children,
    disabled,
    getUniqueAdvertIdsFromThePage,
    doc,
    setChangedDoc,
}: AdvertsStatusManagingModalProps) => {
    const {showError} = useError();
    const {selectValue, sellerId} = useCampaign();
    const [open, setOpen] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    const manageAdvertsActivityCallFunc = async (mode: any, advertId: any) => {
        const params: any = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {
                advertsIds: {},
                mode: mode,
            },
        };
        params.data.advertsIds[advertId] = {advertId: advertId};

        return await callApi('manageAdvertsActivity', params).catch((error) => {
            showError(error.response?.data?.error || 'An unknown error occurred');
        });
    };

    const manageAdvertsActivityOnClick = async (mode: any, newStatus: any) => {
        handleClose();
        setInProgress(true);
        const uniqueAdverts = getUniqueAdvertIdsFromThePage();
        for (const [id, advertData] of Object.entries(uniqueAdverts)) {
            if (!id || !advertData) continue;

            const {advertId} = advertData as any;
            if (newStatus != 7) {
                const params = {
                    seller_id: sellerId,
                    advertId,
                    paused: newStatus == 11,
                };

                try {
                    await ApiClient.post('massAdvert/set-paused', params);
                } catch (error: any) {
                    showError(error?.response?.data?.error || 'An unknown error occurred');
                }
            }

            const res = await manageAdvertsActivityCallFunc(mode, advertId);
            console.log(res);
            if (!res || res['data'] === undefined) {
                return;
            }

            if (res['data']['status'] == 'ok') {
                if (newStatus) {
                    doc.adverts[selectValue[0]][advertId].status = newStatus;
                } else {
                    doc.adverts[selectValue[0]][advertId] = undefined;
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
            setChangedDoc({...doc});
        }
        setUpdatePaused(true);
        setInProgress(false);
    };

    const deleteAdverts = async () => {
        handleClose();
        const uniqueAdverts = getUniqueAdvertIdsFromThePage();
        const advertIds = Object.values(uniqueAdverts).map((entry: any) => entry?.['advertId']);
        const params = {
            seller_id: sellerId,
            advertIds,
        };
        for (const id of Object.keys(uniqueAdverts)) {
            doc.adverts[selectValue[0]][id] = undefined;
        }
        setChangedDoc({...doc});
        try {
            console.log(new Date(), 'massAdvert/new/queue-advert-to-delete', params);
            await ApiClient.post('massAdvert/new/queue-advert-to-delete', params);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AdvertsBidsModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {triggerButton}
            <motion.div
                animate={{width: inProgress ? 36 : 0, marginLeft: inProgress ? 8 : 0}}
                style={{
                    width: 0,
                    marginRight: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spin />
            </motion.div>
            <Modal open={open && !disabled} onClose={handleClose}>
                <Card
                    view="clear"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                            gap: 8,
                            width: 200,
                        }}
                    >
                        <Text variant="display-2">Управление</Text>
                        <Button
                            width="max"
                            selected
                            size="l"
                            pin="circle-circle"
                            view="outlined-success"
                            onClick={() => {
                                manageAdvertsActivityOnClick('start', 9);
                            }}
                        >
                            <Icon data={Play} />
                            Возобновить показы
                        </Button>
                        <Button
                            width="max"
                            selected
                            size="l"
                            pin="circle-circle"
                            view={'outlined'}
                            onClick={async () => {
                                manageAdvertsActivityOnClick('pause', 11);
                            }}
                        >
                            <Icon data={Pause} />
                            Приостановить
                        </Button>
                        <Button
                            width="max"
                            selected
                            size="l"
                            pin="circle-circle"
                            view="outlined-danger"
                            onClick={deleteAdverts}
                        >
                            <Icon data={TrashBin} />
                            Завершить РК на WB
                        </Button>
                        <div style={{minHeight: 8}} />
                        <Text style={{margin: '0 8px'}}>
                            <b>Подсказка: </b>Чтобы отключить РК от управления AURUM, удалите
                            бюджет, шаблон фраз и автоставки.
                        </Text>
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
