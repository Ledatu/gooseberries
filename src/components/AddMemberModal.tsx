import {Button, Card, Modal, TextInput, Text, Switch, Icon} from '@gravity-ui/uikit';
import {TrashBin} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useMemo, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

interface AddMemberModalInterface {
    children: ReactElement | ReactElement[];
    sellerId: string;
    addedMember: any;
    setAddedMember: Function;
}

export const AddMemberModal = ({
    children,
    sellerId,
    addedMember,
    setAddedMember,
}: AddMemberModalInterface) => {
    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo;

    const [open, setOpen] = useState(false);

    const [identifier, setIdentifier] = useState('');
    const [modulesEnabled, setModulesEnabled] = useState({
        massAdvert: false,
        analytics: false,
        delivery: false,
        prices: false,
        nomenclatures: false,
        buyers: false,
        seo: false,
    });

    const mapModules = {
        massAdvert: 'Реклама',
        analytics: 'Аналитика',
        delivery: 'Поставки',
        prices: 'Цены',
        nomenclatures: 'Товары',
        buyers: 'Покупатели',
        seo: 'SEO',
    };

    const modules = useMemo(() => {
        const modulesTemp = [] as string[];
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            if (!enabled) continue;
            modulesTemp.push(key);
        }
        return modulesTemp;
    }, [modulesEnabled]);

    const modulesSwitches = useMemo(() => {
        const modulesSwitchesTemp = [] as any[];
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            modulesSwitchesTemp.push(
                <Switch
                    size="l"
                    checked={enabled}
                    content={mapModules[key]}
                    onUpdate={(val) =>
                        setModulesEnabled((cur) => {
                            cur[key] = val;
                            return {...cur};
                        })
                    }
                />,
            );
            modulesSwitchesTemp.push(<div style={{minHeight: 8}} />);
        }
        modulesSwitchesTemp.pop();
        return modulesSwitchesTemp;
    }, [modulesEnabled]);

    const handleOpen = async () => {
        setOpen(true);
        setIdentifier(addedMember?.member_identifier ?? '');
        setModulesEnabled((cur) => {
            const res = {};
            for (const key of Object.keys(cur)) {
                res[key] = addedMember?.modules?.includes(key);
            }
            return res as any;
        });
    };

    const clearFields = () => {
        setIdentifier('');
        setModulesEnabled({
            massAdvert: false,
            analytics: false,
            delivery: false,
            prices: false,
            nomenclatures: false,
            buyers: false,
            seo: false,
        });

        setAddedMember({
            member_identifier: '',
            modules: [],
        });
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
                <Card>
                    <motion.div
                        animate={{height: open ? 304 : 0}}
                        style={{
                            height: 0,
                            width: 300,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                                overflow: 'hidden',
                            }}
                        >
                            <TextInput
                                style={{width: '100%'}}
                                value={identifier}
                                onUpdate={(val) => setIdentifier(val)}
                                size="l"
                                placeholder="<@Имя пользователя> или <ID TG аккаунта>"
                            />
                            <motion.div
                                animate={{
                                    width: modules.length || identifier !== '' ? 114 : 0,
                                    marginLeft: modules.length || identifier !== '' ? 8 : 0,
                                }}
                                style={{width: 0}}
                            >
                                <Button view="outlined" size="l" onClick={clearFields}>
                                    <Icon data={TrashBin} />
                                    Очистить
                                </Button>
                            </motion.div>
                        </div>
                        <div style={{marginLeft: 8}}>{modulesSwitches}</div>
                        <Button
                            size="l"
                            view="outlined-success"
                            selected
                            disabled={!modules.length || identifier === ''}
                            onClick={() => {
                                const params = {
                                    user_id: user._id,
                                    seller_id: sellerId,
                                    member_identifier: identifier.replace(/@/g, ''),
                                    modules,
                                };
                                callApi('addMemberToCampaign', params)
                                    .then(() => {
                                        setAddedMember({
                                            member_identifier: identifier.replace(/@/g, ''),
                                            modules,
                                        });
                                        refetchUser();
                                    })
                                    .finally(() => handleClose());
                            }}
                        >
                            <Text variant="subheader-1">Добавить сотрудника</Text>
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
