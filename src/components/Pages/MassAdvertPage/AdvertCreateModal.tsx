'use client';

import {Button, Text, Checkbox, Select, Icon} from '@gravity-ui/uikit';
import {CloudArrowUpIn} from '@gravity-ui/icons';
import {Children, isValidElement, ReactElement, useState, cloneElement} from 'react';
import {useError} from '@/contexts/ErrorContext';
import {useCampaign} from '@/contexts/CampaignContext';
import ApiClient from '@/utilities/ApiClient';
import {ModalWindow} from '@/shared/ui/Modal';

interface AdvertCreateModalProps {
    sellerId: String;
    children: ReactElement | ReactElement[];
    doc: any;
    filteredData: Object[];
    setChangedDoc: Function;
}

interface AdvertTypeSwitch {
    value: string;
    content: string;
}

export const AdvertCreateModal = ({
    sellerId,
    children,
    doc,
    setChangedDoc,
    filteredData,
}: AdvertCreateModalProps) => {
    const {showError} = useError();
    const {selectValue} = useCampaign();

    const [open, setOpen] = useState<boolean>(false);
    const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false); // New state for confirmation modal
    const [advertsCount, setAdvertsCount] = useState<number>(0); // State to store the number of adverts

    const [createAdvertsMode, setCreateAdvertsMode] = useState<boolean>(false);
    const advertTypeSwitchValues: AdvertTypeSwitch[] = [
        {value: 'Авто', content: 'Авто'},
        {value: 'Поиск', content: 'Поиск'},
    ];
    const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = useState(['Авто']);

    const handleOpen = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
    };

    const childArray = Children.toArray(children);

    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const handleCreateButtonClick = async () => {
        console.log(filteredData[0]);

        const count: number = filteredData.filter(
            (item: any) => item.art !== undefined && item.nmId !== undefined && item.stocks !== 1,
        ).length;
        setAdvertsCount(count);
        setConfirmationOpen(true);
        setOpen(false);
    };

    const calculateSum = (): number => {
        if (createAdvertsMode) {
            return advertsCount;
        }
        if (advertTypeSwitchValue[0] === 'Авто') {
            return Math.ceil(advertsCount / 100);
        } else {
            return Math.ceil(advertsCount / 50);
        }
    };

    const handleConfirmCreate = async () => {
        setConfirmationOpen(false);
        const params: any = {
            seller_id: sellerId,
            data: {
                arts: {},
                mode: createAdvertsMode, // true -- one to one | false -- one to many
                budget: 1000,
                bid: 10,
                type: advertTypeSwitchValue[0],
            },
        };
        for (let i: number = 0; i < filteredData.length; i++) {
            const {art, nmId} = filteredData[i] as any;
            if (art === undefined || nmId === undefined) continue;
            params.data.arts[art] = {art, nmId};
        }
        console.log(params);

        handleClose();

        try {
            const res = await ApiClient.post('massAdvert/create-adverts', params);
            if (!res) return;

            const advertsInfosPregenerated = res['data'];
            if (advertsInfosPregenerated)
                for (const [advertId, data] of Object.entries(advertsInfosPregenerated)) {
                    const advertsData: any = data;
                    if (!advertId || !advertsData) continue;
                    advertsData['daysInWork'] = 1;
                    doc['adverts'][selectValue[0]][advertId] = advertsData;

                    const type = advertsData['type'];
                    let nms = [] as any[];
                    if (type == 8) {
                        nms = advertsData['autoParams']
                            ? (advertsData['autoParams'].nms ?? [])
                            : [];
                    } else if (type == 9) {
                        nms = advertsData['unitedParams']
                            ? (advertsData['unitedParams'][0].nms ?? [])
                            : [];
                    }

                    for (const [art, data] of Object.entries(doc['campaigns'][selectValue[0]])) {
                        const artData: any = data;
                        if (!art || !artData) continue;
                        if (nms.includes(artData['nmId'])) {
                            if (!doc['campaigns'][selectValue[0]][art]['adverts'])
                                doc['campaigns'][selectValue[0]][art]['adverts'] = {};
                            doc['campaigns'][selectValue[0]][art]['adverts'][advertId] = {
                                advertId: advertId,
                            };
                        }
                    }
                }

            setChangedDoc({...doc});
        } catch (error: any) {
            showError(error.response?.data?.error || 'Не удалось создать РК.');
        }
    };

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
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
                    onClick={handleCreateButtonClick}
                    selected
                    size="l"
                    pin="circle-circle"
                    view="flat-success"
                >
                    <Icon data={CloudArrowUpIn} />
                    Создать
                </Button>
            </ModalWindow>

            <ModalWindow isOpen={confirmationOpen} handleClose={handleConfirmationClose}>
                <Text variant="display-2">Подтверждение</Text>
                <div style={{minHeight: 8}} />
                {advertsCount !== 0 && (
                    <div className="text-center">
                        <Text>Будет создано {advertsCount} реклам.</Text>
                        <br />
                        <Text>
                            На сумму{' '}
                            <span className="text-red-400 underline underline-offset-2">
                                {calculateSum()} тыс. рублей
                            </span>
                        </Text>
                    </div>
                )}
                <Button
                    className={'mt-5 mb-5'}
                    onClick={handleConfirmCreate}
                    selected
                    size="l"
                    pin="circle-circle"
                    view="flat-success"
                >
                    Подтвердить
                </Button>
                <Button onClick={handleConfirmationClose} size="l" pin="circle-circle" view="flat">
                    Отмена
                </Button>
            </ModalWindow>
        </>
    );
};
