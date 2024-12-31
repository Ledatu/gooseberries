import {Button, Card, Modal, Text, Checkbox, Select, Icon} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import {useError} from 'src/pages/ErrorContext';
import {useCampaign} from 'src/contexts/CampaignContext';
import ApiClient from 'src/utilities/ApiClient';

interface AdvertCreateModalInterface {
    sellerId: String;
    children: ReactElement | ReactElement[];
    doc: Object;
    filteredData: Object[];
    setChangedDoc: Function;
}

export const AdvertCreateModal = ({
    sellerId,
    children,
    doc,
    setChangedDoc,
    filteredData,
}: AdvertCreateModalInterface) => {
    const {showError} = useError(); // Access error context
    const {selectValue} = useCampaign();

    const [open, setOpen] = useState(false);

    const [createAdvertsMode, setCreateAdvertsMode] = useState(false);
    const advertTypeSwitchValues: any[] = [
        {value: 'Авто', content: 'Авто'},
        {value: 'Поиск', content: 'Поиск'},
    ];
    const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = React.useState(['Авто']);

    const handleOpen = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <Modal open={open} onClose={handleClose}>
                <Card
                    view="clear"
                    style={{
                        width: 300,
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
                            background: '#221d220f',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <Text variant="display-2">Создание РК</Text>
                        <div style={{minHeight: 8}} />
                        <Select
                            size="l"
                            width={'max'}
                            value={advertTypeSwitchValue}
                            options={advertTypeSwitchValues}
                            onUpdate={(val) => {
                                setAdvertTypeSwitchValue(val);
                            }}
                        />
                        <Checkbox
                            style={{margin: '8px 0'}}
                            checked={createAdvertsMode}
                            onUpdate={(val) => setCreateAdvertsMode(val)}
                        >
                            Создание РК 1к1
                        </Checkbox>
                        <Button
                            onClick={async () => {
                                const params = {
                                    seller_id: sellerId,
                                    data: {
                                        arts: {},
                                        mode: createAdvertsMode, // true -- one to one | false -- one to many
                                        budget: 1000,
                                        bid: 10,
                                        type: advertTypeSwitchValue[0],
                                    },
                                };
                                for (let i = 0; i < filteredData.length; i++) {
                                    const {art, nmId} = filteredData[i] as any;
                                    if (art === undefined || nmId === undefined) continue;
                                    params.data.arts[art] = {art, nmId};
                                }
                                console.log(params);
                                handleClose();

                                try {
                                    const res = await ApiClient.post(
                                        'massAdvert/create-adverts',
                                        params,
                                    );

                                    if (res) {
                                        const advertsInfosPregenerated = res['data'];
                                        if (advertsInfosPregenerated)
                                            for (const [advertId, advertsData] of Object.entries(
                                                advertsInfosPregenerated,
                                            )) {
                                                if (!advertId || !advertsData) continue;
                                                advertsData['daysInWork'] = 1;
                                                doc['adverts'][selectValue[0]][advertId] =
                                                    advertsData;

                                                const type = advertsData['type'];
                                                let nms = [] as any[];
                                                if (type == 8) {
                                                    nms = advertsData['autoParams']
                                                        ? advertsData['autoParams'].nms ?? []
                                                        : [];
                                                } else if (type == 9) {
                                                    nms = advertsData['unitedParams']
                                                        ? advertsData['unitedParams'][0].nms ?? []
                                                        : [];
                                                }

                                                for (const [art, artData] of Object.entries(
                                                    doc['campaigns'][selectValue[0]],
                                                )) {
                                                    if (!art || !artData) continue;
                                                    if (nms.includes(artData['nmId'])) {
                                                        if (
                                                            !doc['campaigns'][selectValue[0]][art][
                                                                'adverts'
                                                            ]
                                                        )
                                                            doc['campaigns'][selectValue[0]][art][
                                                                'adverts'
                                                            ] = {};
                                                        doc['campaigns'][selectValue[0]][art][
                                                            'adverts'
                                                        ][advertId] = {
                                                            advertId: advertId,
                                                        };
                                                    }
                                                }
                                            }

                                        setChangedDoc({...doc});
                                    }
                                } catch (error) {
                                    showError(
                                        error.response?.data?.error || 'Не удалось создать РК.',
                                    );
                                }
                            }}
                            selected
                            size="l"
                            pin="circle-circle"
                            view="flat-success"
                        >
                            <Icon data={CloudArrowUpIn} />
                            Создать
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
