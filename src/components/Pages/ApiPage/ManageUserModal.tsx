'use client';

import {Button, Modal, Text, Card, ArrowToggle, Select} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useMemo, useState, cloneElement} from 'react';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import ApiClient from '@/utilities/ApiClient';
import {useError} from '@/contexts/ErrorContext';

interface ManageUserModalInterface {
    sellerId: string;
    memberInfo: any;
    modules: string[];
    setUpdate: Function;
    children: ReactElement | ReactElement[];
}

export const ManageUserModal = ({
    sellerId,
    memberInfo,
    modules,
    setUpdate,
    children,
}: ManageUserModalInterface) => {
    const {userInfo} = useUser();
    const {user} = userInfo;

    const {showError} = useError();

    const [open, setOpen] = useState(false);

    const [modulesEnabled, setModulesEnabled] = useState<{[key: string]: string[]}>({
        massAdvert: ['Доступ закрыт'],
        prices: ['Доступ закрыт'],
        delivery: ['Доступ закрыт'],
        analytics: ['Доступ закрыт'],
        buyers: ['Доступ закрыт'],
        seo: ['Доступ закрыт'],
        nomenclatures: ['Доступ закрыт'],
        reports: ['Доступ закрыт'],
    });

    const mapModules: {[key: string]: string} = {
        massAdvert: 'Реклама',
        analytics: 'Аналитика',
        delivery: 'Поставки',
        prices: 'Цены',
        nomenclatures: 'Товары',
        buyers: 'Покупатели',
        seo: 'SEO',
        reports: 'Отчеты',
    };

    const newModules = useMemo(() => {
        const modulesTemp: any = {};
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            if (!enabled || enabled[0] == 'Доступ закрыт') continue;
            modulesTemp[key] = enabled[0];
        }
        return modulesTemp;
    }, [modulesEnabled]);

    const selectOptions = [
        {value: 'Управление', content: 'Управление'},
        {value: 'Только просмотр', content: 'Только просмотр'},
        {value: 'Доступ закрыт', content: 'Доступ закрыт'},
    ];

    const modulesSwitches = useMemo(() => {
        const modulesSwitchesTemp = [] as any[];
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            modulesSwitchesTemp.push(
                <Card
                    // view="clear"
                    style={{
                        borderRadius: 30,
                        padding: 14,
                        backdropFilter: 'blur(48px)',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text variant="subheader-1">{mapModules[key]}</Text>
                    <div style={{minWidth: 16}} />
                    <Select
                        renderControl={({triggerProps: {onClick, onKeyDown}}) => {
                            return (
                                <Button
                                    // ref={ref as Ref<HTMLButtonElement>}
                                    view={
                                        enabled[0] == 'Доступ закрыт'
                                            ? 'outlined'
                                            : enabled[0] == 'Только просмотр'
                                              ? 'outlined-success'
                                              : 'outlined-action'
                                    }
                                    style={{alignItems: 'center'}}
                                    pin={'circle-circle'}
                                    onClick={onClick}
                                    onKeyDown={onKeyDown}
                                    // extraProps={{
                                    //     onKeyDown,
                                    // }}
                                >
                                    <div
                                        style={{
                                            width: 140,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text variant="subheader-1">{enabled[0]}</Text>
                                        <div style={{minWidth: 8}} />
                                        <ArrowToggle />
                                    </div>
                                </Button>
                            );
                        }}
                        size="l"
                        value={enabled}
                        options={selectOptions}
                        onUpdate={(nextVal) =>
                            setModulesEnabled((cur) => {
                                cur[key] = nextVal;
                                return {...cur};
                            })
                        }
                    />
                </Card>,
            );
            modulesSwitchesTemp.push(<div style={{minHeight: 8}} />);
        }
        modulesSwitchesTemp.pop();
        return modulesSwitchesTemp;
    }, [modulesEnabled]);

    const handleOpen = async () => {
        setOpen(true);
        setModulesEnabled((cur) => {
            const res: any = {};
            for (const key of Object.keys(cur)) {
                res[key] = [modules[key as any] ?? 'Доступ закрыт'];
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

    const triggerButton = cloneElement(triggerElement, {
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
                            backdropFilter: 'blur(48px)',
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
                                disabled={!Object.keys(newModules).length}
                                onClick={async () => {
                                    const params = {
                                        user_id: user._id,
                                        seller_id: sellerId,
                                        member_id: memberInfo?._id,
                                        newModules: newModules,
                                    };

                                    try {
                                        await ApiClient.post('auth/update-member', params);
                                        setUpdate(true);
                                    } catch (error: any) {
                                        showError(
                                            error.response?.data?.error ||
                                                'Не удалось обновить разрешения сотрудника.',
                                        );
                                    }
                                    handleClose();
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
                                onClick={async () => {
                                    const params = {
                                        user_id: user._id,
                                        seller_id: sellerId,
                                        member_id: memberInfo?._id,
                                    };

                                    try {
                                        await ApiClient.post('auth/delete-member', params);
                                        setUpdate(true);
                                    } catch (error: any) {
                                        console.error(error);
                                        showError(
                                            error.response?.data?.error ||
                                                'Не удалось удалить сотрудника.',
                                        );
                                    }
                                    handleClose();
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
