import React from 'react';
import block from 'bem-cn-lite';
import {
    ThemeProvider,
    // Button,
    // Text,
    Persona,
    RadioButton,
    RadioButtonOption,
    // Tabs,
} from '@gravity-ui/uikit';
import '../App.scss';
import Userfront from '@userfront/toolkit';
import {ApiPage} from './ApiPage';
import {AdvertStatsPage} from './AdvertStatsPage';
// import {db} from '../utilities/firebase-config';
// import {doc, getDoc, updateDoc} from 'firebase/firestore';

// import { Editable } from 'src/components/Editable';

const b = block('app');

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export const Dashboard = () => {
    const [theme, setTheme] = React.useState(Theme.Light);
    const optionsTheme: RadioButtonOption[] = [
        {value: 'light', content: 'Светлая'},
        {value: 'dark', content: 'Темная'},
    ];
    const optionsPages: RadioButtonOption[] = [
        {value: 'api', content: 'Управление магазинами'},
        {value: 'create_rk', content: 'Создание РК'},
        {value: 'stats_rk', content: 'Статистика РК'},
    ];
    const [page, setPage] = React.useState('api');
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

                    <Persona
                        style={{marginBottom: '8px', marginRight: '8px'}}
                        onClose={() => {
                            Userfront.logout();
                        }}
                        type="email"
                        text={Userfront.user.email ?? ''}
                    ></Persona>

                    <RadioButton
                        style={{marginBottom: '8px', marginRight: '8px'}}
                        name="themeRadioButton"
                        defaultValue={theme}
                        options={optionsTheme}
                        onUpdate={async (val) => {
                            // console.log(val);
                            setTheme(val === 'light' ? Theme.Light : Theme.Dark);
                        }}
                    />
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
    };
    return pages[page] ?? <div></div>;
}
