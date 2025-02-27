'use client';
import {
    ArrowToggle,
    Button,
    Card,
    Icon,
    Link,
    Popup,
    SegmentedRadioGroup,
    Text,
} from '@gravity-ui/uikit';
import {Sun, Moon, ArrowRightFromSquare} from '@gravity-ui/icons';
import {useMemo, useState} from 'react';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import {CopyButton} from '@/components/Buttons/CopyButton';
import {RNPSwitch} from '@/components/UserPopup/RNPSwitch';

export interface UserPopupProps {
    theme: string;
    toggleTheme: (val: string) => void;
}

export const UserPopup = ({theme, toggleTheme}: UserPopupProps) => {
    const [open, setOpen] = useState(false);
    // useEffect(() => {
    //     localStorage.setItem('theme', JSON.stringify(theme));
    //     setTheme(theme);
    // }, [theme]);
    const optionsTheme = [
        {value: 'dark', content: <Icon data={Moon}></Icon>},
        {value: 'light', content: <Icon data={Sun}></Icon>},
    ];

    const {userInfo} = useUser();
    const {user} = userInfo ?? {};

    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

    const name = useMemo(() => {
        return [user?.first_name, user?.last_name].filter((item) => item !== undefined).join(' ');
    }, [user]);

    return (
        <div>
            <Popup
                offset={{mainAxis: 4, crossAxis: -4}}
                anchorElement={anchorElement}
                open={open}
                placement={'bottom-end'}
            >
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
                                boxShadow: '0px 0px 0px 0px var(--gc-color-base-generic-hover)',
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
                            <div>
                                <Link
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 4,
                                        alignItems: 'center',
                                    }}
                                    view="secondary"
                                    href="https://seller.aurum-sky.net/login"
                                    onClick={() => {
                                        localStorage.removeItem('authToken');
                                    }}
                                >
                                    Выйти
                                    <Icon data={ArrowRightFromSquare} size={13} />
                                </Link>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 'calc(100% - 40px)',
                                marginBottom: 20,
                                gap: 16,
                            }}
                        >
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
                            <SegmentedRadioGroup
                                size="l"
                                name="themeRadioButton"
                                defaultValue={theme}
                                options={optionsTheme}
                                onUpdate={async (val: any) => {
                                    console.log(theme);
                                    toggleTheme(val);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Popup>
            <Button
                ref={setAnchorElement}
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
