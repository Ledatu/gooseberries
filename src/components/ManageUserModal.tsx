import {Button, Modal, Text, Switch, Card} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useMemo, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

interface ManageUserModalInterface {
    sellerId: string;
    memberInfo: any;
    modules: string[];
    children: ReactElement | ReactElement[];
}

export const ManageUserModal = ({
    sellerId,
    memberInfo,
    modules,
    children,
}: ManageUserModalInterface) => {
    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo;

    const [open, setOpen] = useState(false);

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

    const newModules = useMemo(() => {
        const newModulesTemp = [] as string[];
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            if (!enabled) continue;
            newModulesTemp.push(key);
        }
        return newModulesTemp;
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
        setModulesEnabled((cur) => {
            const res = {};
            for (const key of Object.keys(cur)) {
                res[key] = modules.includes('all') || modules.includes(key);
            }
            return res as any;
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
                            background: '#221d220f',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <div style={{marginBottom: 8, width: '100%'}}>{modulesSwitches}</div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                width="max"
                                size="l"
                                view="outlined-success"
                                pin="circle-circle"
                                selected
                                disabled={!newModules.length}
                                onClick={() => {
                                    const params = {
                                        user_id: user._id,
                                        seller_id: sellerId,
                                        member_id: memberInfo?._id,
                                        newModules: newModules,
                                    };
                                    callApi('updateModulesForUserInCampaign', params)
                                        .then((res) => {
                                            console.log(res);
                                            refetchUser();
                                        })
                                        .finally(() => handleClose());
                                }}
                            >
                                <Text variant="subheader-1">Сохранить</Text>
                            </Button>
                            <div style={{minWidth: 8}}></div>
                            <Button
                                width="max"
                                size="l"
                                view="outlined-danger"
                                pin="circle-circle"
                                selected
                                onClick={() => {
                                    const params = {
                                        user_id: user._id,
                                        seller_id: sellerId,
                                        member_id: memberInfo?._id,
                                    };
                                    callApi('removeMemberFromCampaign', params)
                                        .then((res) => {
                                            console.log(res);
                                            refetchUser();
                                        })
                                        .finally(() => handleClose());
                                }}
                            >
                                <Text variant="subheader-1">Удалить</Text>
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
