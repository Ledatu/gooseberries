'use client';

import {
    Button,
    Card,
    Modal,
    TextInput,
    Text,
    Icon,
    Select,
    ArrowToggle,
    // SelectRenderControl,
} from '@gravity-ui/uikit';
import {TrashBin} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useMemo, useState, cloneElement} from 'react';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';

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
    const {showError} = useError();
    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo;

    const [open, setOpen] = useState(false);

    const [identifier, setIdentifier] = useState('');
    const [modulesEnabled, setModulesEnabled] = useState<any>({
        massAdvert: ['Доступ закрыт'],
        prices: ['Доступ закрыт'],
        delivery: ['Доступ закрыт'],
        analytics: ['Доступ закрыт'],
        buyers: ['Доступ закрыт'],
        seo: ['Доступ закрыт'],
        nomenclatures: ['Доступ закрыт'],
        reports: ['Доступ закрыт'],
    });

    const mapModules: any = {
        massAdvert: 'Реклама',
        analytics: 'Аналитика',
        delivery: 'Поставки',
        prices: 'Цены',
        nomenclatures: 'Товары',
        buyers: 'Покупатели',
        seo: 'SEO',
        reports: 'Отчеты',
    };

    const modules = useMemo(() => {
        const modulesTemp: any = {};
        for (const [key, enabled] of Object.entries(modulesEnabled) as [string, string[]][]) {
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
        for (const [key, enabled] of Object.entries(modulesEnabled) as [string, string[]][]) {
            modulesSwitchesTemp.push(
                <Card
                    // view="clear"
                    style={{
                        borderRadius: 30,
                        padding: 14,
                        backdropFilter: 'blur(20px)',
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
                                    style={{alignItems: 'center'}}
                                    view={
                                        enabled[0] == 'Доступ закрыт'
                                            ? 'outlined'
                                            : enabled[0] == 'Только просмотр'
                                              ? 'outlined-success'
                                              : 'outlined-action'
                                    }
                                    pin={'circle-circle'}
                                    // ref={ref as Ref<HTMLButtonElement>}
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
                            setModulesEnabled((cur: any) => {
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
        setIdentifier(addedMember?.member_identifier ?? '');
        setModulesEnabled((cur: any) => {
            const res: any = {};
            for (const key of Object.keys(cur)) {
                res[key] = [addedMember?.modules?.[key] ?? 'Доступ закрыт'];
            }
            return res as any;
        });
    };

    const clearFields = () => {
        setIdentifier('');
        setModulesEnabled({
            massAdvert: ['Доступ закрыт'],
            prices: ['Доступ закрыт'],
            delivery: ['Доступ закрыт'],
            analytics: ['Доступ закрыт'],
            buyers: ['Доступ закрыт'],
            seo: ['Доступ закрыт'],
            nomenclatures: ['Доступ закрыт'],
            reports: ['Доступ закрыт'],
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
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            boxSizing: 'unset',
                            border: '1px solid #eee2',
                            height: 0,
                            width: 300,
                        }}
                        animate={{height: open ? 610 : 0}}
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
                                    width:
                                        Object.keys(modules).length || identifier !== '' ? 118 : 0,
                                    marginLeft:
                                        Object.keys(modules).length || identifier !== '' ? 8 : 0,
                                }}
                                style={{width: 0}}
                            >
                                <Button view="outlined" size="l" onClick={clearFields}>
                                    <Icon data={TrashBin} />
                                    Очистить
                                </Button>
                            </motion.div>
                        </div>
                        <div style={{marginLeft: 8, width: '100%'}}>{modulesSwitches}</div>
                        <Button
                            size="xl"
                            pin="circle-circle"
                            view="outlined-success"
                            selected
                            disabled={!Object.keys(modules).length || identifier === ''}
                            onClick={async () => {
                                const params = {
                                    user_id: user._id,
                                    seller_id: sellerId,
                                    member_identifier: identifier.replace(/@/g, ''),
                                    modules,
                                };

                                try {
                                    await ApiClient.post('auth/add-member', params);
                                    setAddedMember({
                                        member_identifier: identifier.replace(/@/g, ''),
                                        modules,
                                    });
                                    refetchUser();
                                } catch (error: any) {
                                    showError(
                                        error.response?.data?.error ||
                                            'Не удалось добавить сотрудника.',
                                    );
                                }
                                handleClose();
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
