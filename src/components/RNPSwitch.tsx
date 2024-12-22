import React, {useState, useEffect} from 'react';

import {Switch, Tooltip, Text, Loader} from '@gravity-ui/uikit';
import {useError} from 'src/pages/ErrorContext';

import ApiClient from 'src/utilities/ApiClient';
import {useUser} from './RequireAuth';
import {motion} from 'framer-motion';

export const RNPSwitch = () => {
    const {userInfo} = useUser();
    const {user} = userInfo;
    const {showError} = useError();
    const [state, setState] = useState(undefined as any);

    const getNotification = async () => {
        try {
            const params = {user_id: user?._id};
            const response = await ApiClient.post('auth/get-rnp-notification', params);
            if (!response?.data) {
                throw new Error('No user');
            }
            setState(response?.data?.notificationRNP);
        } catch (error) {
            console.error(error);
            showError('Не удалось получить o информацию наличии уведомлений.');
        }
    };

    const setNotification = async (value) => {
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
        <Tooltip content="Получать уведомления РНП">
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
                        checked={state}
                        onUpdate={(val) => {
                            setNotification(val);
                        }}
                    />

                    <Text style={{marginLeft: 8}} variant="subheader-1">
                        Получать уведомления РНП
                    </Text>
                </motion.div>
                <motion.div
                    style={{position: 'absolute'}}
                    animate={{opacity: state === undefined ? 1 : 0}}
                >
                    <Loader size="s" />
                </motion.div>
            </div>
        </Tooltip>
    );
};
