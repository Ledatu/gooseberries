import {ArrowToggle, Button, Popup, Text} from '@gravity-ui/uikit';
import React, {useMemo, useRef, useState} from 'react';
import {useUser} from './RequireAuth';

export const UserPopup = () => {
    const {userInfo} = useUser();
    const {user} = userInfo ?? {};

    const ref = useRef(null);
    const [open, setOpen] = useState(false);

    const name = useMemo(() => {
        return [user?.first_name, user?.last_name].filter((item) => item !== undefined).join(' ');
    }, [user]);

    return (
        <div>
            <Popup anchorRef={ref} open={open} placement={'bottom-end'}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 300,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: 20,
                            width: '100%',
                            boxShadow: '0px 0px 0px 0px var(--yc-color-base-generic-hover)',
                        }}
                    >
                        <img
                            style={{
                                height: 70,
                                borderRadius: 100,
                                margin: 4,
                            }}
                            src={user?.photo_url}
                        />
                        <Text variant="subheader-2">{name}</Text>
                        <Text variant="body-1" color="secondary">
                            @{user?.username}
                        </Text>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 'calc(100% - 40px)',
                            marginBottom: 20,
                        }}
                    >
                        <Button view="outlined" width="max" size="l">
                            <Text variant="subheader-2"> Тут будет управление</Text>
                        </Button>
                    </div>
                </div>
            </Popup>
            <Button
                ref={ref}
                view="flat"
                pin="brick-brick"
                style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: 68}}
                onClick={() => setOpen(!open)}
            >
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <img
                        style={{height: 40, borderRadius: 100, marginRight: 4}}
                        src={user?.photo_url}
                    />
                    <ArrowToggle />
                </div>
            </Button>
        </div>
    );
};