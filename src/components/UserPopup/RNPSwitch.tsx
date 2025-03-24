'use client';

import {useState, useEffect} from 'react';

import {Switch, Text, Loader, Tooltip, Icon} from '@gravity-ui/uikit';
import {useError} from '@/contexts/ErrorContext';

import ApiClient from '@/utilities/ApiClient';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import {motion} from 'framer-motion';
import {CircleQuestion} from '@gravity-ui/icons';

export const RNPSwitch = () => {
    const {userInfo} = useUser();
    const {user} = userInfo;
    const {showError} = useError();
    const [state, setState] = useState(false);

    const getNotification = async () => {
        try {
            const params = {user_id: user?._id};
            const response = await ApiClient.post('auth/get-rnp-notification', params);
            console.log(response);
            if (!response?.data) {
                throw new Error('No user');
            }
            setState(response?.data?.notificationRNP);
        } catch (error) {
            console.error(error);
            showError('Не удалось получить o информацию наличии уведомлений.');
        }
    };

    const setNotification = async (value: boolean) => {
        try {
            const params = {user_id: user?._id, notificationRNP: value};
            const response = await ApiClient.post('auth/set-rnp-notification', params);
            if (response?.status != 200) {
                throw new Error('RNP notifications wasnt changed');
            }
            setState(value);
        } catch (error) {
            console.error(error);
            showError('Возникла ошибка');
        }
    };
    useEffect(() => {
        getNotification();
    }, []);

    return (
        // <Tooltip content="Получать уведомления РНП">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: 0,
                }}
                animate={{opacity: state === undefined ? 0 : 1}}
                transition={{delay: 0.1}}
            >
                <Switch
                    checked={!!state} // Ensures 'checked' is always a boolean
                    onUpdate={(val) => {
                        setNotification(val);
                    }}
                    className="gc-switch"
                />
                <Text style={{marginLeft: 8}} variant="subheader-1">
                    Получать уведомления РНП
                </Text>
                <div style={{marginLeft: '8px'}}>
                    <Tooltip
                        style={{maxWidth: '400px'}}
                        content=<Text>
                            <b>РНП (Рука на Пульсе)</b> – ежедневная рассылка с ключевыми метриками:
                            сумма заказов, расходы на рекламу, ДРР, прибыль и рентабельность.
                            Включает тренды и процентное изменение показателей относительно прошлого
                            дня.
                        </Text>
                    >
                        <Icon data={CircleQuestion} />
                    </Tooltip>
                </div>
            </motion.div>
            <motion.div
                style={{position: 'absolute'}}
                animate={{opacity: state === undefined ? 1 : 0}}
            >
                <Loader size="s" />
            </motion.div>
        </div>
        // </Tooltip>
    );
};
