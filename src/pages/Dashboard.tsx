import React, {useEffect, useMemo, useRef, useState} from 'react';
import block from 'bem-cn-lite';
import {
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
} from '@gravity-ui/uikit';
import '../App.scss';
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
import {UploadModal} from 'src/components/UploadModal';
import {SelectCampaign} from 'src/components/SelectCampaign';
import {BuyersPage} from './BuyersPage';

import {useUser} from 'src/components/RequireAuth';
import {ApiPage} from './ApiPage';
import {useMediaQuery} from 'src/hooks/useMediaQuery';

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
    subscription: boolean;
}

export const Dashboard = ({setThemeAurum}) => {
    const {userInfo} = useUser();

    const {user, campaigns} = userInfo ?? {};
    console.log(userInfo, user, campaigns);
    const themeVal = localStorage.getItem('theme');
    const initialTheme =
        themeVal !== 'undefined' && themeVal !== 'null' && themeVal
            ? JSON.parse(themeVal)
            : Theme.Dark;
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
        setThemeAurum(theme);
    }, [theme]);

    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = React.useState(false);

    const [selectValue, setSelectValue] = useState(['']);
    const [refetchAutoSales, setRefetchAutoSales] = useState(false);
    const [dzhemRefetch, setDzhemRefetch] = useState(false);

    useEffect(() => {
        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'no response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setAvailableTagsPending(false);
            });
    }, [selectValue]);

    const selectOptions = useMemo(() => {
        if (!campaigns) return [];
        const temp = [] as any[];
        for (const campaignInfo of campaigns) {
            const {name} = campaignInfo;
            temp.push({value: name, content: name});
        }
        setSelectValue([temp[0] ? temp[0]['value'] ?? '' : '']);
        return temp;
    }, [campaigns]);

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

    const modules = useMemo(() => {
        if (!campaigns) return [];
        for (const campaign of campaigns) {
            if (campaign.name === selectValue[0])
                return campaign.isOwner ? ['all'] : campaign.userModules;
        }
        return [];
    }, [campaigns, selectValue]);

    const [page, setPage] = useState(null as any);
    useEffect(
        () => setPage(page === null ? (modules.includes('all') ? 'massAdvert' : modules[0]) : page),
        [modules],
    );

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
            id: 'buyers',
            title: 'Покупатели',
            disabled: !modules.includes('all') && !modules.includes('buyers'),
        },
        {
            id: 'seo',
            title: 'SEO',
            disabled: !modules.includes('all') && !modules.includes('seo'),
        },
        {
            id: 'api',
            title: 'Магазины',
        },
    ];

    const isMobile = useMediaQuery('(max-width: 768px)');

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
                campaignName: selectValue,
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
                {isMobile ? (
                    <div
                        style={{
                            width: '100%',
                            boxShadow: 'inset 0px -9px 0px -8px var(--yc-color-base-generic-hover)',
                            background: '#0000',
                        }}
                    >
                        <div
                            style={{
                                margin: '0 32px',
                                boxShadow:
                                    'inset 0px -9px 0px -8px ' +
                                    (theme == Theme.Dark ? '#2d2c33' : '#fff'),
                            }}
                        >
                            <Tabs
                                wrapTo={renderTabItem}
                                activeTab={page}
                                items={optionsPages.filter((item) =>
                                    ['massAdvert', 'api'].includes(item.id),
                                )}
                                onSelectTab={(val) => {
                                    setPage(val);
                                }}
                            />
                        </div>
                    </div>
                ) : (
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
                                        loading={availableTagsPending}
                                        size="l"
                                        onClick={async () => {
                                            setNotesModalOpen((val) => !val);
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
                                    <Button size="l">{user?.username}</Button>
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
                                    <div style={{minWidth: 8}} />
                                    <UploadModal
                                        selectOptions={selectOptions}
                                        selectValue={selectValue}
                                        setRefetchAutoSales={setRefetchAutoSales}
                                        setDzhemRefetch={setDzhemRefetch}
                                    />
                                    <div style={{minWidth: 8}} />
                                    <SelectCampaign
                                        selectOptions={selectOptions}
                                        selectValue={selectValue}
                                        setSelectValue={setSelectValue}
                                        switchingCampaignsFlag={switchingCampaignsFlag}
                                        setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                    selectValue={selectValue}
                    setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
                    refetchAutoSales={refetchAutoSales}
                    setRefetchAutoSales={setRefetchAutoSales}
                    dzhemRefetch={dzhemRefetch}
                    setDzhemRefetch={setDzhemRefetch}
                />
            </div>
        </div>
    );
};

const PageElem = ({
    page,
    selectValue,
    setSwitchingCampaignsFlag,
    refetchAutoSales,
    setRefetchAutoSales,
    dzhemRefetch,
    setDzhemRefetch,
}) => {
    const pages = {
        delivery: (
            <DeliveryPage
                selectValue={selectValue}
                setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
            />
        ),
        massAdvert: (
            <MassAdvertPage
                selectValue={selectValue}
                setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
                refetchAutoSales={refetchAutoSales}
                setRefetchAutoSales={setRefetchAutoSales}
                dzhemRefetch={dzhemRefetch}
                setDzhemRefetch={setDzhemRefetch}
            />
        ),
        prices: (
            <PricesPage
                selectValue={selectValue}
                setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
            />
        ),
        nomenclatures: (
            <NomenclaturesPage
                selectValue={selectValue}
                setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
            />
        ),
        analytics: (
            <AnalyticsPage
                selectValue={selectValue}
                setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
            />
        ),
        buyers: (
            <BuyersPage
                selectValue={selectValue}
                setSwitchingCampaignsFlag={setSwitchingCampaignsFlag}
            />
        ),
        seo: <SEOPage />,
        api: <ApiPage />,
    };
    return pages[page] ?? <></>;
};
