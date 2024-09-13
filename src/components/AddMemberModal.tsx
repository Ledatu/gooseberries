import {Button, Card, Modal, TextInput, Text, Switch} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useMemo, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

interface AddMemberModalInterface {
    children: ReactElement | ReactElement[];
    sellerId: string;
}

export const AddMemberModal = ({children, sellerId}: AddMemberModalInterface) => {
    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo;

    const [open, setOpen] = useState(false);

    const [username, setUsername] = useState('');
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
        setUsername('');
        setModulesEnabled({
            massAdvert: false,
            analytics: false,
            delivery: false,
            prices: false,
            nomenclatures: false,
            buyers: false,
            seo: false,
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
                        <TextInput
                            value={username}
                            onUpdate={(val) => setUsername(val)}
                            size="l"
                            placeholder="Введите <@Имя пользователя>"
                        />
                        <div style={{marginLeft: 8}}>{modulesSwitches}</div>
                        <Button
                            size="l"
                            view="outlined-success"
                            selected
                            disabled={!modules.length || username === ''}
                            onClick={() => {
                                const params = {
                                    user_id: user._id,
                                    seller_id: sellerId,
                                    member_username: username,
                                    modules,
                                };
                                callApi('addMemberToCampaign', params)
                                    .then(() => {
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
