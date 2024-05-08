import React from 'react';
import block from 'bem-cn-lite';
import {
    ThemeProvider,
    // Button,
    // Text,
    Persona,
    RadioButton,
    RadioButtonOption,
    Icon,
    // Tabs,
} from '@gravity-ui/uikit';
import '../App.scss';
import Userfront from '@userfront/toolkit';
import {ApiPage} from './ApiPage';
import {AdvertStatsPage} from './AdvertStatsPage';
import {DeliveryOrdersPage} from './DeliveryOrdersPage';
import {MassAdvertPage} from './MassAdvertPage';
// import {db} from '../utilities/firebase-config';
// import {doc, getDoc, updateDoc} from 'firebase/firestore';

// import { Editable } from 'src/components/Editable';
import {Sun, Moon} from '@gravity-ui/icons';
import {NomenclaturesPage} from './NomenclaturesPage';
import {PricesPage} from './PricesPage';

const b = block('app');

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export const Dashboard = () => {
    const [theme, setTheme] = React.useState(Theme.Dark);
    const optionsTheme: RadioButtonOption[] = [
        {value: 'dark', content: <Icon data={Moon}></Icon>},
        {value: 'light', content: <Icon data={Sun}></Icon>},
    ];
    const optionsPages: RadioButtonOption[] = [
        // {value: 'api', content: 'Управление магазинами'},
        // {value: 'create_rk', content: 'Создание РК'},
        {
            value: 'massAdvert',
            content: 'Реклама',
        },
        {
            value: 'prices',
            content: 'Цены',
            disabled:
                Userfront.user.userUuid != '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid != '46431a09-85c3-4703-8246-d1b5c9e52594',
        },
        // {
        //     value: 'stats_rk',
        //     content: 'Статистика',
        //     disabled: Userfront.user.userUuid != '4a1f2828-9a1e-4bbf-8e07-208ba676a806'  && Userfront.user.userUuid != '46431a09-85c3-4703-8246-d1b5c9e52594',
        // },
        // {
        //     value: 'deliveryOrders',
        //     content: 'Поставки',
        //     disabled:
        //         Userfront.user.userUuid != '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
        //         Userfront.user.userUuid != '46431a09-85c3-4703-8246-d1b5c9e52594',
        // },
        {
            value: 'nomenclatures',
            content: 'Товары',
            disabled:
                Userfront.user.userUuid != '4a1f2828-9a1e-4bbf-8e07-208ba676a806' &&
                Userfront.user.userUuid != '46431a09-85c3-4703-8246-d1b5c9e52594',
        },
    ];
    // const [page, setPage] = React.useState('nomenclatures');
    const [page, setPage] = React.useState('massAdvert');
    return (
        <ThemeProvider theme={theme}>
            <div className={b()}>
                {/* <TextInput style={{width: '300px'}} placeholder="Ola, Ledatu!" /> */}

                <div
                    className={b('appHeader')}
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                    }}
                >
                    <RadioButton
                        style={{marginBottom: '8px', marginRight: '8px'}}
                        name="pageRadioButton"
                        defaultValue={page}
                        options={optionsPages}
                        onUpdate={async (val) => {
                            setPage(val);
                        }}
                    />
                    {/* <div style={{display: 'flex', flexDirection: 'row'}}> */}
                    <Persona
                        style={{marginBottom: '8px', marginRight: '8px'}}
                        onClose={() => {
                            Userfront.logout();
                        }}
                        type="email"
                        text={Userfront.user.email ?? ''}
                    />

                    <RadioButton
                        style={{marginBottom: '8px'}}
                        name="themeRadioButton"
                        defaultValue={theme}
                        options={optionsTheme}
                        onUpdate={async (val) => {
                            // console.log(val);
                            setTheme(val === 'light' ? Theme.Light : Theme.Dark);
                        }}
                    />
                    {/* </div> */}
                </div>
                <div
                    style={{
                        marginTop: 8,
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
    };
    return pages[page] ?? <div></div>;
}
