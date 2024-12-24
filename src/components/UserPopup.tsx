import {ArrowToggle, Button, Card, Icon, Popup, RadioButton, Text} from '@gravity-ui/uikit';
import {Sun, Moon} from '@gravity-ui/icons';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useUser} from './RequireAuth';
import {CopyButton} from './CopyButton';
import {RNPSwitch} from './RNPSwitch';

export const UserPopup = ({setThemeAurum, Theme, setTheme}) => {
    const themeVal = localStorage.getItem('theme');
    const initialTheme =
        themeVal !== 'undefined' && themeVal !== 'null' && themeVal
            ? JSON.parse(themeVal)
            : Theme.Dark;
    const [theme] = useState(initialTheme);
    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
        setThemeAurum(theme);
    }, [theme]);
    const optionsTheme = [
        {value: 'dark', content: <Icon data={Moon}></Icon>},
        {value: 'light', content: <Icon data={Sun}></Icon>},
    ];

    const {userInfo} = useUser();
    const {user} = userInfo ?? {};

    const ref = useRef(null);
    const [open, setOpen] = useState(false);

    const name = useMemo(() => {
        return [user?.first_name, user?.last_name].filter((item) => item !== undefined).join(' ');
    }, [user]);

    return (
        <div>
            <Popup offset={[-4, 4]} anchorRef={ref} open={open} placement={'bottom-end'}>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#221d220f',
                            backdropFilter: 'blur(8px)',
                            // boxShadow: '#0006 0px 2px 8px 0px',
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                            border: '1px solid #eee2',
                            position: 'absolute',
                            left: -296,
                            top: -3,
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
                            {user?.username ? (
                                <CopyButton
                                    view="flat"
                                    color="secondary"
                                    size="xs"
                                    copyText={user?.username}
                                    iconSize={13}
                                >
                                    <Text variant="body-1" color="secondary">
                                        Username: {'@' + user?.username}
                                    </Text>
                                </CopyButton>
                            ) : (
                                <></>
                            )}
                            <CopyButton
                                view="flat"
                                color="secondary"
                                size="xs"
                                copyText={user?._id}
                                iconSize={13}
                            >
                                <Text variant="body-1" color="secondary">
                                    ID: {user?._id}
                                </Text>
                            </CopyButton>
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
                            <div style={{minHeight: 16}} />
                            <Card
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 36,
                                    width: '100%',
                                }}
                            >
                                <RNPSwitch />
                            </Card>
                            <div style={{minHeight: 16}} />
                            <RadioButton
                                size="l"
                                name="themeRadioButton"
                                defaultValue={theme}
                                options={optionsTheme}
                                onUpdate={async (val) => {
                                    setTheme(val === 'light' ? Theme.Light : Theme.Dark);
                                }}
                            />
                        </div>
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
