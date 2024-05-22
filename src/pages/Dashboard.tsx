import React, {useEffect, useState} from 'react';
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
import {Sun, Moon} from '@gravity-ui/icons';
import {NomenclaturesPage} from './NomenclaturesPage';
import {PricesPage} from './PricesPage';
import {AnalyticsPage} from './AnalyticsPage';

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

    const [page, setPage] = React.useState('massAdvert');

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
                        setPage(item.id);
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 400,
                        }}
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
            id: 'prices',
            title: 'Цены',
            disabled:
                Userfront.user.userUuid !== '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid !== '17fcd1f0-cb29-455d-b5bd-42345f0c7ef8' &&
                Userfront.user.userUuid !== '46431a09-85c3-4703-8246-d1b5c9e52594',
        },
        {
            id: 'analytics',
            title: 'Аналитика',
        },
        {
            id: 'nomenclatures',
            title: 'Товары',
            disabled:
                Userfront.user.userUuid !== '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid !== '17fcd1f0-cb29-455d-b5bd-42345f0c7ef8' &&
                Userfront.user.userUuid !== '46431a09-85c3-4703-8246-d1b5c9e52594',
        },
    ];
    return (
        <ThemeProvider theme={theme}>
            <div className={b()}>
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
                                    padding: '0px 48px',
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

                                    <Persona
                                        style={{marginRight: '8px'}}
                                        onClose={() => {
                                            Userfront.logout();
                                        }}
                                        type="email"
                                        text={Userfront.user.email ?? ''}
                                    />

                                    <RadioButton
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

                    <div
                        style={{
                            marginTop: 16,
                            // marginLeft: 48,
                            // marginRight: 48,
                            justifyContent: 'center',

                            // position: 'absolute',
                            width: '90vw',
                            position: 'relative',
                            // left: 'calc(-50vw + 50%)',
                        }}
                    >
                        <PageElem page={page} />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

function PageElem({page}) {
    const pages = {
        api: <ApiPage />,
        stats_rk: <AdvertStatsPage />,
        deliveryOrders: <DeliveryOrdersPage />,
        massAdvert: <MassAdvertPage />,
        prices: <PricesPage />,
        nomenclatures: <NomenclaturesPage />,
        analytics: <AnalyticsPage />,
    };
    return pages[page] ?? <div></div>;
}
