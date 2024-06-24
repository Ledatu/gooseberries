import React, {useEffect, useRef, useState} from 'react';
import block from 'bem-cn-lite';
import {
    ThemeProvider,
    // Button,
    Text,
    Persona,
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

const b = block('app');

enum Theme {
    Light = 'light',
    Dark = 'dark',
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
    const [page, setPage] = useState('massAdvert');
    const notesTextArea = useRef<HTMLTextAreaElement>(null);

    const [selectedCampaign, setSelectedCampaign] = useState('');

    const renderTabItem = (item, node, index) => {
        if (item === undefined || node === undefined || index === undefined) return <></>;

        return (
            <div
                key={index}
                style={{
                    height: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderTop: '4px solid #0000',
                    borderBottom: item.id == page ? '4px solid #ffbe5c' : '4px solid #0000',
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
        },
        {
            id: 'analytics',
            title: 'Аналитика',
        },
        {
            id: 'delivery',
            title: 'Поставки',
            disabled:
                Userfront.user.userUuid !== '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid !== '17fcd1f0-cb29-455d-b5bd-42345f0c7ef8' &&
                Userfront.user.userUuid !== '46431a09-85c3-4703-8246-d1b5c9e52594' &&
                Userfront.user.userUuid !== '6857e0f3-0069-4b70-a6f0-2c47ab4e6064',
        },
        {
            id: 'prices',
            title: 'Цены',
            disabled:
                Userfront.user.userUuid !== '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid !== '17fcd1f0-cb29-455d-b5bd-42345f0c7ef8' &&
                Userfront.user.userUuid !== '46431a09-85c3-4703-8246-d1b5c9e52594' &&
                Userfront.user.userUuid !== '6857e0f3-0069-4b70-a6f0-2c47ab4e6064',
        },
        {
            id: 'nomenclatures',
            title: 'Товары',
            disabled:
                Userfront.user.userUuid !== '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid !== '17fcd1f0-cb29-455d-b5bd-42345f0c7ef8' &&
                Userfront.user.userUuid !== '46431a09-85c3-4703-8246-d1b5c9e52594' &&
                Userfront.user.userUuid !== '6857e0f3-0069-4b70-a6f0-2c47ab4e6064',
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
                                    <Persona
                                        size="s"
                                        onClose={() => {
                                            Userfront.logout();
                                        }}
                                        type="empty"
                                        text={Userfront.user.email?.split('@')[0] ?? ''}
                                    />
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
                        width: '90vw',
                        position: 'relative',
                    }}
                >
                    {getPageElem({page, args: {selectedCampaign, setSelectedCampaign}})}
                </div>
            </div>
        </ThemeProvider>
    );
};

const getPageElem = ({page, args}) => {
    const pages = {
        api: <ApiPage />,
        stats_rk: <AdvertStatsPage />,
        deliveryOrders: <DeliveryOrdersPage />,
        delivery: <DeliveryPage pageArgs={args} />,
        massAdvert: <MassAdvertPage pageArgs={args} />,
        prices: <PricesPage pageArgs={args} />,
        nomenclatures: <NomenclaturesPage pageArgs={args} />,
        analytics: <AnalyticsPage pageArgs={args} />,
    };
    return pages[page] ?? <div></div>;
};
