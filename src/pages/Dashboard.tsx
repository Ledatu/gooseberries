import React, {useEffect, useMemo, useRef, useState} from 'react';
import block from 'bem-cn-lite';
import {
    ThemeProvider,
    // Button,
    Text,
    RadioButton,
    RadioButtonOption,
    Icon,
    Tabs,
    Link,
    Button,
    Modal,
    TextArea,
    List,
    // Tabs,
} from '@gravity-ui/uikit';
import '../App.scss';
import Userfront from '@userfront/toolkit';
import {ApiPage} from './ApiPage';
import {AdvertStatsPage} from './AdvertStatsPage';
import {DeliveryOrdersPage} from './DeliveryOrdersPage';
import {MassAdvertPage} from './MassAdvertPage';
// import {db} from '../utilities/firebase-config';
import textLogo from '../assets/textLogo.png';
// import {doc, getDoc, updateDoc} from 'firebase/firestore';

// import { Editable } from 'src/components/Editable';
import {Sun, Moon, PencilToSquare, Xmark, Check, TrashBin} from '@gravity-ui/icons';
import {NomenclaturesPage} from './NomenclaturesPage';
import {PricesPage} from './PricesPage';
import {AnalyticsPage} from './AnalyticsPage';
import callApi, {getUid} from 'src/utilities/callApi';
import {DeliveryPage} from './DeliveryPage';
import {SEOPage} from './SEOPage';

const b = block('app');

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export interface User {
    uuid: string;
    roles: string[];
    modules: string[];
    campaignNames: string[];
}

export const Dashboard = () => {
    const themeVal = localStorage.getItem('theme');
    const initialTheme =
        themeVal !== 'undefined' && themeVal !== 'null' && themeVal
            ? JSON.parse(themeVal)
            : Theme.Dark;
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);

    const [userInfo, setUserInfo] = useState({} as User);
    useEffect(() => {
        callApi('getUserInfo', {uid: Userfront.user.userUuid})
            .then((response) => {
                if (!response || !response['data']) return;
                const info: User = response.data;
                setUserInfo(info);
            })
            .catch((e) => console.log('Error occured while fetching user info', e));
    }, []);

    const optionsTheme: RadioButtonOption[] = [
        {value: 'dark', content: <Icon data={Moon}></Icon>},
        {value: 'light', content: <Icon data={Sun}></Icon>},
    ];

    const [availableTags, setAvailableTags] = useState([] as any[]);
    const [tagsAddedForCurrentNote, setTagsAddedForCurrentNote] = useState([] as any[]);
    const [availableTagsPending, setAvailableTagsPending] = useState(false);
    const [notesModalOpen, setNotesModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    // const [page, setPage] = useState('analytics');
    // const [page, setPage] = useState('delivery');

    const [selectedCampaign, setSelectedCampaign] = useState('');
    const modules = useMemo(() => userInfo.modules ?? [], [userInfo]);

    const [page, setPage] = useState(modules.includes('all') ? 'massAdvert' : modules[0]);
    useEffect(() => setPage(modules.includes('all') ? 'massAdvert' : modules[0]), [modules]);

    const notesTextArea = useRef<HTMLTextAreaElement>(null);

    const renderTabItem = (item, node, index) => {
        if (item === undefined || node === undefined || index === undefined) return <></>;

        return (
            <div
                key={index}
                style={{
                    // marginBottom: item.id == page ? 1 : 0,
                    height: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderTop: '4px solid #0000',
                    borderBottom: item.id == page ? '5px solid #ffbe5c' : '5px solid #0000',
                }}
            >
                <Link
                    className="tablink"
                    view="primary"
                    onClick={() => {
                        if (item.disabled) return;
                        setPage(item.id);
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 400,
                        }}
                        color={item.disabled ? 'secondary' : undefined}
                    >
                        {item.title}
                    </Text>
                </Link>
            </div>
        );
    };

    const optionsPages: any[] = [
        {
            id: 'massAdvert',
            title: 'Реклама',
            disabled: !modules.includes('all') && !modules.includes('massAdvert'),
        },
        {
            id: 'analytics',
            title: 'Аналитика',
            disabled: !modules.includes('all') && !modules.includes('analytics'),
        },
        {
            id: 'delivery',
            title: 'Поставки',
            disabled: !modules.includes('all') && !modules.includes('delivery'),
        },
        {
            id: 'prices',
            title: 'Цены',
            disabled: !modules.includes('all') && !modules.includes('prices'),
        },
        {
            id: 'nomenclatures',
            title: 'Товары',
            disabled: !modules.includes('all') && !modules.includes('nomenclatures'),
        },
        {
            id: 'seo',
            title: 'SEO',
            disabled: !modules.includes('all') && !modules.includes('seo'),
        },
    ];

    const saveNote = () => {
        setNotesModalOpen(false);
        if (notesTextArea.current !== null) {
            const note = notesTextArea.current.value;
            setCurrentNote(note ?? '');
        }
    };
    const saveNoteToTheServer = () => {
        setNotesModalOpen(false);
        if (notesTextArea.current !== null) {
            const note = notesTextArea.current.value;

            const params = {
                uid: getUid(),
                campaignName: selectedCampaign,
                data: {
                    note: note,
                    tags: tagsAddedForCurrentNote,
                },
            };
            callApi('saveNote', params);
            setCurrentNote('');
            setTagsAddedForCurrentNote([]);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={b()}>
                {/* <TextInput style={{width: '300px'}} placeholder="Ola, Ledatu!" /> */}

                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            // boxShadow: 'var(--g-color-base-background) 0px 1px 8px',
                            // background: '#00000022',
                            background: '#0000',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                boxShadow:
                                    'inset 0px -9px 0px -8px var(--yc-color-base-generic-hover)',
                            }}
                        >
                            <div
                                style={{
                                    padding: '0px 10vw',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: 68,
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            boxShadow:
                                                '1px 0px 0px 0px var(--yc-color-base-generic-hover)',
                                        }}
                                    >
                                        <img
                                            style={{height: 'calc(100% - 24px)'}}
                                            src={textLogo}
                                            alt="Aurum logo"
                                        />
                                        <div style={{minWidth: 32}} />
                                    </div>
                                    <div style={{minWidth: 32}} />
                                    <div
                                        style={{
                                            boxShadow:
                                                'inset 0px -9px 0px -8px ' +
                                                (theme == Theme.Dark ? '#2d2c33' : '#fff'),
                                        }}
                                    >
                                        <Tabs
                                            wrapTo={renderTabItem}
                                            activeTab={page}
                                            items={optionsPages}
                                            onSelectTab={(val) => {
                                                setPage(val);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        height: 68,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        boxShadow:
                                            '-1px 0px 0px 0px var(--yc-color-base-generic-hover)',
                                    }}
                                >
                                    <div style={{minWidth: 32}} />
                                    <Button
                                        size="l"
                                        onClick={async () => {
                                            setNotesModalOpen((val) => !val);
                                            setAvailableTagsPending(true);

                                            try {
                                                const res = await callApi('getAllTags', {
                                                    uid: getUid(),
                                                    campaignName: selectedCampaign,
                                                });

                                                if (!res) throw 'no response';

                                                const {tags} = res['data'] ?? {};

                                                tags.sort();

                                                setAvailableTags(tags ?? []);

                                                setAvailableTagsPending(false);
                                            } catch (e) {
                                                console.log(e);
                                                setAvailableTagsPending(false);
                                            }
                                        }}
                                    >
                                        <Icon data={PencilToSquare} />
                                    </Button>
                                    <Modal open={notesModalOpen} onClose={() => saveNote()}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: '30em',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    height: 36,
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Text variant="subheader-1" color="secondary">
                                                    {new Date().toLocaleString('ru-RU', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </Text>
                                                <div style={{position: 'absolute', left: 8}}>
                                                    <Button
                                                        view="flat-success"
                                                        size="s"
                                                        onClick={() => saveNoteToTheServer()}
                                                    >
                                                        <Icon data={Check} />
                                                    </Button>
                                                </div>
                                                <div style={{position: 'absolute', right: 8}}>
                                                    <Button
                                                        view="flat"
                                                        size="s"
                                                        onClick={() => saveNote()}
                                                    >
                                                        <Icon data={Xmark} />
                                                    </Button>
                                                </div>
                                                <div style={{position: 'absolute', right: 40}}>
                                                    <Button
                                                        view="flat-danger"
                                                        size="s"
                                                        onClick={() => {
                                                            if (notesTextArea.current)
                                                                notesTextArea.current.value = '';

                                                            setTagsAddedForCurrentNote([]);
                                                        }}
                                                    >
                                                        <Icon data={TrashBin} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <TextArea
                                                defaultValue={currentNote}
                                                controlRef={notesTextArea}
                                                autoFocus
                                                rows={20}
                                            />
                                            <div style={{minHeight: 8}} />
                                            <div></div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    width: 'calc(100% - 16px)',
                                                    height: 200,
                                                }}
                                            >
                                                <List
                                                    filterPlaceholder="Введите имя тега"
                                                    emptyPlaceholder="Такой тег отсутствует"
                                                    loading={availableTagsPending}
                                                    items={availableTags}
                                                    renderItem={(item) => {
                                                        return (
                                                            <Button
                                                                size="xs"
                                                                pin="circle-circle"
                                                                selected={tagsAddedForCurrentNote.includes(
                                                                    item,
                                                                )}
                                                                view={
                                                                    tagsAddedForCurrentNote.includes(
                                                                        item,
                                                                    )
                                                                        ? 'outlined-info'
                                                                        : 'outlined'
                                                                }
                                                            >
                                                                {item.toUpperCase()}
                                                            </Button>
                                                        );
                                                    }}
                                                    onItemClick={(item) => {
                                                        let tempArr =
                                                            Array.from(tagsAddedForCurrentNote);
                                                        if (tempArr.includes(item)) {
                                                            tempArr = tempArr.filter(
                                                                (value) => value != item,
                                                            );
                                                        } else {
                                                            tempArr.push(item);
                                                        }

                                                        setTagsAddedForCurrentNote(tempArr);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Modal>
                                    <div style={{minWidth: 8}} />
                                    <Button
                                        size="l"
                                        onClick={() => {
                                            Userfront.logout();
                                        }}
                                    >
                                        {Userfront.user.email?.split('@')[0] ?? ''}
                                    </Button>
                                    <div style={{minWidth: 8}} />
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
                    </div>
                </div>
                <div
                    style={{
                        marginTop: 62,
                        justifyContent: 'center',
                        width: 'calc(100vw - 80px)',
                        position: 'relative',
                    }}
                >
                    <PageElem
                        page={page}
                        selectedCampaign={selectedCampaign}
                        setSelectedCampaign={setSelectedCampaign}
                        userInfo={userInfo}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

const PageElem = ({page, selectedCampaign, setSelectedCampaign, userInfo}) => {
    const pages = {
        api: <ApiPage />,
        stats_rk: <AdvertStatsPage />,
        deliveryOrders: <DeliveryOrdersPage />,
        delivery: (
            <DeliveryPage
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                userInfo={userInfo}
            />
        ),
        massAdvert: (
            <MassAdvertPage
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                userInfo={userInfo}
            />
        ),
        prices: (
            <PricesPage
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                userInfo={userInfo}
            />
        ),
        nomenclatures: (
            <NomenclaturesPage
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                userInfo={userInfo}
            />
        ),
        analytics: (
            <AnalyticsPage
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                userInfo={userInfo}
            />
        ),
        seo: <SEOPage />,
    };
    return pages[page] ?? <></>;
};
