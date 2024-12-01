import React, {useEffect, useMemo, useRef, useState} from 'react';
import block from 'bem-cn-lite';
import {Text, Icon, Tabs, Link, Button, Modal, TextArea, List, Tooltip} from '@gravity-ui/uikit';
import '../App.scss';
import {MassAdvertPage} from './MassAdvertPage';
// import {db} from '../utilities/firebase-config';
import textLogo from '../assets/textLogo.png';
// import {doc, getDoc, updateDoc} from 'firebase/firestore';

// import { Editable } from 'src/components/Editable';
import {
    PencilToSquare,
    Xmark,
    Check,
    TrashBin,
    CircleQuestion,
    ChartColumnStacked,
    LogoTelegram,
    Key,
    GraduationCap,
} from '@gravity-ui/icons';
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
import {UserPopup} from 'src/components/UserPopup';
import {DetailedReportsPage} from './DetailedReportsPage';
import {useCampaign} from 'src/contexts/CampaignContext';
import {NoSubscriptionPage} from './NoSubscriptionPage';

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
    const {userInfo, refetchUser} = useUser();
    const {campaigns} = userInfo ?? {};
    const {selectValue} = useCampaign();

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

    const [refetchAutoSales, setRefetchAutoSales] = useState(false);
    const [dzhemRefetch, setDzhemRefetch] = useState(false);

    const selectOptions = useMemo(() => {
        if (!campaigns) return [];
        const temp = [] as any[];
        for (const campaignInfo of campaigns) {
            const {name} = campaignInfo;
            temp.push({value: name, content: name});
        }

        return temp;
    }, [campaigns]);

    const {availableTags, availableTagsPending} = useCampaign();

    const [tagsAddedForCurrentNote, setTagsAddedForCurrentNote] = useState([] as any[]);
    const [notesModalOpen, setNotesModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    // const [page, setPage] = useState('analytics');
    // const [page, setPage] = useState('delivery');

    const [subscriptionExpDate, setSubscriptionExpDate] = useState(undefined as any);
    const [apiKeyExpDate, setApiKeyExpDate] = useState(undefined as any);
    const [sellerId, setSellerId] = useState('');
    const [modulesMap, setModulesMap] = useState({} as any);

    const modules = useMemo(() => {
        if (!campaigns) return [];
        for (const campaign of campaigns) {
            if (campaign.name === selectValue[0]) {
                setSubscriptionExpDate(campaign.subscriptionUntil);
                setApiKeyExpDate(campaign.apiKeyExpDate);
                setSellerId(campaign?.seller_id);
                const userModules = campaign.userModules;
                setModulesMap(userModules);
                return campaign.isOwner ? ['all'] : Object.keys(userModules ?? {}) ?? [];
            }
        }
        return [];
    }, [campaigns, selectValue]);

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date()); // Update the current time every minute
        }, 60000); // 60000 ms = 1 minute

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);

    const [page, setPage] = useState('noModules' as any);
    useEffect(() => {
        console.log(page, modules);
        if (!modules.length) {
            setPage('noModules');
            return;
        }
        const firstModule = modules.includes('all') ? 'massAdvert' : modules[0];
        setPage(
            page == 'noModules'
                ? firstModule
                : modules.includes(page) || modules.includes('all')
                ? page
                : firstModule,
        );
    }, [modules]);
    useEffect(() => {
        const titleMap = {
            massAdvert: 'Реклама',
            analytics: 'Аналитика',
            prices: 'Цены',
            delivery: 'Поставки',
            nomenclatures: 'Товары',
            buyers: 'Покупатели',
            reports: 'Отчеты',
            seo: 'SEO',
            api: 'Магазины',
        };

        document.title =
            page == 'noModules' ? 'AURUM | Магазины' : `${titleMap[page]}: ${selectValue[0]}`;
    }, [page, selectValue]);

    const notesTextArea = useRef<HTMLTextAreaElement>(null);

    const renderTabItem = (item, node, index) => {
        if (item === undefined || node === undefined || index === undefined) return <></>;
        const isCurrent = (page == 'noModules' && item.id == 'api') || item.id == page;
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
                    borderBottom: isCurrent ? '5px solid #ffbe5c' : '5px solid #0000',
                }}
            >
                <Link
                    href={item?.href}
                    target={item?.target}
                    className="tablink"
                    view="primary"
                    onClick={() => {
                        if (item.disabled || !item.id) return;
                        setPage(item.id);
                        refetchUser();
                    }}
                >
                    <Text variant="body-3" color={item.disabled ? 'secondary' : undefined}>
                        {item.title}
                    </Text>
                </Link>
            </div>
        );
    };

    const renderFooterItem = (item, node, index) => {
        if (item === undefined || node === undefined || index === undefined) return <></>;
        const isCurrent = (page == 'noModules' && item.id == 'api') || item.id == page;
        return (
            <Link
                href={item?.href}
                target={item?.target}
                className="tablink"
                view="primary"
                onClick={() => {
                    if (item.disabled || !item.id) return;
                    setPage(item.id);
                    refetchUser();
                }}
            >
                <Text
                    variant="caption-2"
                    color={isCurrent ? 'brand' : 'primary'}
                    style={{
                        height: 70,
                        paddingBottom: 10,
                        width: 70,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon data={item?.icon} size={24} />
                    {item.title}
                </Text>
            </Link>
        );
    };

    const optionsPages: any[] = [
        {
            icon: ChartColumnStacked,
            id: 'massAdvert',
            title: 'Реклама',
            disabled: !modules.includes('all') && !modules.includes('massAdvert'),
        },
        {
            id: 'prices',
            title: 'Цены',
            disabled: !modules.includes('all') && !modules.includes('prices'),
        },
        {
            id: 'delivery',
            title: 'Поставки',
            disabled: !modules.includes('all') && !modules.includes('delivery'),
        },
        {
            id: 'analytics',
            title: 'Аналитика',
            disabled: !modules.includes('all') && !modules.includes('analytics'),
        },
        {
            id: 'buyers',
            title: 'Покупатели',
            disabled: !modules.includes('all') && !modules.includes('buyers'),
        },
        {
            id: 'seo',
            title: 'Семантика',
            disabled: !modules.includes('all') && !modules.includes('seo'),
        },
        {
            id: 'nomenclatures',
            title: 'Товары',
            disabled: !modules.includes('all') && !modules.includes('nomenclatures'),
        },
        {
            id: 'reports',
            title: 'Отчеты',
            disabled: !modules.includes('all') && !modules.includes('reports'),
        },
        {
            icon: Key,
            id: 'api',
            title: 'Магазины',
        },
        {
            icon: CircleQuestion,
            title: 'Поддержка',
            href: 'https://t.me/AurumSkyNetSupportBot',
            target: '_blank',
        },
        {
            icon: GraduationCap,
            title: 'База знаний',
            href: 'https://aurum-wiki.tilda.ws/tdocs/',
            target: '_blank',
        },
    ].filter((page) => !page.disabled);

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
                campaignName: selectValue[0],
                data: {
                    note: note,
                    tags: tagsAddedForCurrentNote,
                },
            };
            console.log(params);

            callApi('saveNote', params);
            setCurrentNote('');
            setTagsAddedForCurrentNote([]);
        }
    };

    return (
        <div className={b()}>
            {isMobile ? (
                <div
                    style={{
                        position: 'fixed',
                        bottom: -1,
                        zIndex: 10,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Tabs
                        wrapTo={renderFooterItem}
                        activeTab={page}
                        items={optionsPages.filter((item) =>
                            ['Реклама', 'Магазины', 'Поддержка', 'База знаний'].includes(
                                item.title,
                            ),
                        )}
                        onSelectTab={(val) => {
                            setPage(val);
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    height: 68,
                    zIndex: 1000,
                    backdropFilter: 'blur(20px)',
                }}
            >
                {isMobile ? (
                    <div
                        style={{
                            width: '100%',
                            boxShadow: 'inset 0px -9px 0px -8px var(--yc-color-base-generic-hover)',
                            background: '#0000',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                position: 'fixed',
                                top: 0,
                                height: 68,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    height: 68,
                                }}
                            >
                                <div style={{minWidth: 24}} />
                                <img
                                    style={{height: 'calc(100% - 24px)'}}
                                    src={textLogo}
                                    alt="Aurum logo"
                                />
                            </div>
                            <SelectCampaign
                                apiKeyExpDate={apiKeyExpDate}
                                subscriptionExpDate={subscriptionExpDate}
                                selectOptions={selectOptions}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-around',
                            position: 'absolute',
                            top: 0,
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
                                        padding: '0px 40px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            overflow: 'hidden',
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
                                            <div style={{minWidth: 12}} />
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
                                                className="tabs"
                                                wrapTo={renderTabItem}
                                                activeTab={page}
                                                items={optionsPages.filter(
                                                    (item) =>
                                                        !['Поддержка', 'База знаний'].includes(
                                                            item.title,
                                                        ),
                                                )}
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
                                        }}
                                    >
                                        {selectValue[0] ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
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
                                                    <div style={{minWidth: 12}} />
                                                    <Tooltip content={'База знаний'}>
                                                        <Button
                                                            size="xl"
                                                            href={
                                                                'https://aurum-wiki.tilda.ws/tdocs/'
                                                            }
                                                            target={'_blank'}
                                                        >
                                                            <Icon data={GraduationCap} size={18} />
                                                        </Button>
                                                    </Tooltip>
                                                    <div style={{minWidth: 12}} />
                                                    <Tooltip content={'Поддержка'}>
                                                        <Button
                                                            size="xl"
                                                            href={
                                                                'https://t.me/AurumSkyNetSupportBot'
                                                            }
                                                            target={'_blank'}
                                                        >
                                                            <Icon data={CircleQuestion} size={18} />
                                                        </Button>
                                                    </Tooltip>
                                                    <div style={{minWidth: 12}} />
                                                    <Tooltip content={'Наш телеграм канал'}>
                                                        <Button
                                                            size="xl"
                                                            href={'https://t.me/+5PHQ7OK2pT4yMDBi'}
                                                            target={'_blank'}
                                                        >
                                                            <Icon data={LogoTelegram} size={18} />
                                                        </Button>
                                                    </Tooltip>
                                                    <div style={{minWidth: 24}} />
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        height: 68,
                                                        boxShadow:
                                                            '-1px 0px 0px 0px var(--yc-color-base-generic-hover)',
                                                    }}
                                                >
                                                    <div style={{minWidth: 12}} />
                                                    <Button
                                                        pin="round-brick"
                                                        view="flat"
                                                        loading={availableTagsPending}
                                                        size="l"
                                                        onClick={async () => {
                                                            setNotesModalOpen((val) => !val);
                                                        }}
                                                    >
                                                        <Icon data={PencilToSquare} />
                                                    </Button>
                                                    <Modal
                                                        open={notesModalOpen}
                                                        onClose={() => saveNote()}
                                                    >
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
                                                                <Text
                                                                    variant="subheader-1"
                                                                    color="secondary"
                                                                >
                                                                    {new Date().toLocaleString(
                                                                        'ru-RU',
                                                                        {
                                                                            day: '2-digit',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </Text>
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        left: 8,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        view="flat-success"
                                                                        size="s"
                                                                        onClick={() =>
                                                                            saveNoteToTheServer()
                                                                        }
                                                                    >
                                                                        <Icon data={Check} />
                                                                    </Button>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        right: 8,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        view="flat"
                                                                        size="s"
                                                                        onClick={() => saveNote()}
                                                                    >
                                                                        <Icon data={Xmark} />
                                                                    </Button>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        right: 40,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        view="flat-danger"
                                                                        size="s"
                                                                        onClick={() => {
                                                                            if (
                                                                                notesTextArea.current
                                                                            )
                                                                                notesTextArea.current.value =
                                                                                    '';

                                                                            setTagsAddedForCurrentNote(
                                                                                [],
                                                                            );
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
                                                                                {item
                                                                                    ? (
                                                                                          item as string
                                                                                      ).toUpperCase()
                                                                                    : ''}
                                                                            </Button>
                                                                        );
                                                                    }}
                                                                    onItemClick={(item) => {
                                                                        let tempArr =
                                                                            Array.from(
                                                                                tagsAddedForCurrentNote,
                                                                            );
                                                                        if (
                                                                            tempArr.includes(item)
                                                                        ) {
                                                                            tempArr =
                                                                                tempArr.filter(
                                                                                    (value) =>
                                                                                        value !=
                                                                                        item,
                                                                                );
                                                                        } else {
                                                                            tempArr.push(item);
                                                                        }

                                                                        setTagsAddedForCurrentNote(
                                                                            tempArr,
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Modal>
                                                    <UploadModal
                                                        selectOptions={selectOptions}
                                                        selectValue={selectValue}
                                                        setRefetchAutoSales={setRefetchAutoSales}
                                                        setDzhemRefetch={setDzhemRefetch}
                                                    />
                                                    <div style={{minWidth: 8}} />
                                                </div>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        <UserPopup
                                            setTheme={setTheme}
                                            setThemeAurum={setThemeAurum}
                                            Theme={Theme}
                                        />
                                        <div
                                            style={{
                                                height: 68,
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                boxShadow:
                                                    '-1px 0px 0px 0px var(--yc-color-base-generic-hover)',
                                            }}
                                        >
                                            <SelectCampaign
                                                apiKeyExpDate={apiKeyExpDate}
                                                subscriptionExpDate={subscriptionExpDate}
                                                selectOptions={selectOptions}
                                            />
                                        </div>
                                    </div>
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
                    height: '100vh',
                }}
            >
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        // background:
                        // 'linear-gradient(180deg, rgba(45, 44, 51, 1) 0%, rgba(34, 33, 39, 1) 100%)',
                    }}
                >
                    {currentTime >= new Date(subscriptionExpDate) &&
                    ![1122958293, 933839157].includes(userInfo?.user?._id) ? (
                        <NoSubscriptionPage />
                    ) : (
                        <PageElem
                            permission={modules.includes('all') ? 'Управление' : modulesMap?.[page]}
                            page={page}
                            refetchAutoSales={refetchAutoSales}
                            setRefetchAutoSales={setRefetchAutoSales}
                            dzhemRefetch={dzhemRefetch}
                            setDzhemRefetch={setDzhemRefetch}
                            sellerId={sellerId}
                        />
                    )}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        // background: 'var(--g-color-base-background)',
                        width: '100vw',
                        bottom: -100,
                        left: -40,
                        height: 100,
                    }}
                ></div>
            </div>
        </div>
    );
};

const PageElem = ({
    page,
    permission,
    refetchAutoSales,
    setRefetchAutoSales,
    dzhemRefetch,
    setDzhemRefetch,
    sellerId,
}) => {
    const pages = {
        delivery: <DeliveryPage permission={permission} sellerId={sellerId} />,
        massAdvert: (
            <MassAdvertPage
                permission={permission}
                refetchAutoSales={refetchAutoSales}
                setRefetchAutoSales={setRefetchAutoSales}
                dzhemRefetch={dzhemRefetch}
                setDzhemRefetch={setDzhemRefetch}
                sellerId={sellerId}
            />
        ),
        prices: <PricesPage permission={permission} sellerId={sellerId} />,
        nomenclatures: <NomenclaturesPage permission={permission} sellerId={sellerId} />,
        analytics: <AnalyticsPage permission={permission} />,
        buyers: <BuyersPage permission={permission} sellerId={sellerId} />,
        reports: <DetailedReportsPage sellerId={sellerId} />,
        seo: <SEOPage />,
        api: <ApiPage />,
        noModules: <ApiPage />,
    };
    return pages[page] ?? <></>;
};
