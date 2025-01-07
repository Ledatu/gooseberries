import {Button, Card, Icon, Modal, Spin, Text} from '@gravity-ui/uikit';
import {TrashBin, Play} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import {useCampaign} from 'src/contexts/CampaignContext';
import {useError} from 'src/pages/ErrorContext';
import callApi, {getUid} from 'src/utilities/callApi';

export const AdvertsStatusManagingModal = ({
    children,
    disabled,
    getUniqueAdvertIdsFromThePage,
    doc,
    setChangedDoc,
}) => {
    const {showError} = useError();
    const {selectValue} = useCampaign();
    const [open, setOpen] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    const manageAdvertsActivityCallFunc = async (mode, advertId) => {
        const params = {
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

    const manageAdvertsActivityOnClick = async (mode, newStatus) => {
        handleClose();
        setInProgress(true);
        const uniqueAdverts = getUniqueAdvertIdsFromThePage();
        for (const [id, advertData] of Object.entries(uniqueAdverts)) {
            if (!id || !advertData) continue;
            const {advertId} = advertData as any;
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
        setInProgress(false);
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

    const triggerButton = React.cloneElement(triggerElement, {
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
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                            width: 200,
                        }}
                    >
                        <Text variant="display-2">Управление</Text>
                        <div style={{minHeight: 8}} />
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
                        <div style={{minHeight: 8}} />
                        <Button
                            width="max"
                            selected
                            size="l"
                            pin="circle-circle"
                            view="outlined-danger"
                            onClick={() => {
                                manageAdvertsActivityOnClick('stop', undefined);
                            }}
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
