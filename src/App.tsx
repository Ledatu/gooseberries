// import React from 'react';
// import block from 'bem-cn-lite';
// import {ThemeProvider, Button, Label, Dialog, Icon, TextInput} from '@gravity-ui/uikit';
// import iconGitHub from './assets/icons/github.svg';
// import iconStorybook from './assets/icons/storybook.svg';
// import iconTelegram from './assets/icons/telegram.svg';
// // import logo from './assets/logo.svg';
// import './App.scss';

// const b = block('app');

// enum Theme {
//     Light = 'light',
//     Dark = 'dark',
// }

// export const App = () => {
//     const [theme, setTheme] = React.useState(Theme.Light);
//     const [dialogOpen, setDialogOpen] = React.useState(false);

//     return (
//         <ThemeProvider theme={theme}>
//             <div className={b()}>
//                 <h1 className={b('header')}>UIKit example – Create React App</h1>
//                 <TextInput style={{width: '300px'}} placeholder="Ola, Ledatu!" />
//                 {/* <img src={logo} className={b('logo')} alt="logo" /> */}
//                 <div className={b('buttons-block')}>
//                     <Button
//                         className={b('button')}
//                         size="l"
//                         view="outlined"
//                         disabled={theme === Theme.Light}
//                         onClick={() => {
//                             setTheme(Theme.Light);
//                         }}
//                     >
//                         Light theme
//                     </Button>
//                     <Button
//                         className={b('button')}
//                         size="l"
//                         view="outlined"
//                         disabled={theme === Theme.Dark}
//                         onClick={() => {
//                             setTheme(Theme.Dark);
//                         }}
//                     >
//                         Dark theme
//                     </Button>
//                 </div>
//                 <div className={b('content')}>
//                     <div className={b('content-item')}>
//                         <Label className={b('label')} theme="normal">
//                             normal
//                         </Label>
//                         <Label className={b('label')} theme="info">
//                             info
//                         </Label>
//                         <Label className={b('label')} theme="success">
//                             success
//                         </Label>
//                         <Label className={b('label')} theme="warning">
//                             warning
//                         </Label>
//                         <Label className={b('label')} theme="danger">
//                             danger
//                         </Label>
//                         <Label className={b('label')} theme="unknown">
//                             unknown
//                         </Label>
//                     </div>
//                     <div className={b('content-item')}>
//                         <Button
//                             onClick={() => {
//                                 setDialogOpen(true);
//                             }}
//                             view="normal"
//                         >
//                             Show dialog
//                         </Button>
//                         <Dialog
//                             open={dialogOpen}
//                             onClose={() => {
//                                 setDialogOpen(false);
//                             }}
//                             onEnterKeyDown={() => {
//                                 setDialogOpen(false);
//                             }}
//                         >
//                             <Dialog.Header caption="Title" />
//                             <Dialog.Body>Content</Dialog.Body>
//                             <Dialog.Footer
//                                 onClickButtonApply={() => {
//                                     setDialogOpen(false);
//                                 }}
//                                 onClickButtonCancel={() => {
//                                     setDialogOpen(false);
//                                 }}
//                                 textButtonApply="Apply"
//                                 textButtonCancel="Cancel"
//                             />
//                         </Dialog>
//                     </div>
//                 </div>
//                 <h3 className={b('header')}>Useful links</h3>
//                 <div className={b('buttons-block')}>
//                     <Button
//                         className={b('button')}
//                         size="l"
//                         view="outlined"
//                         href="https://github.com/gravity-ui"
//                         target="_blank"
//                     >
//                         <Icon data={iconGitHub} />
//                         GitHub
//                     </Button>
//                     <Button
//                         className={b('button')}
//                         size="l"
//                         view="outlined"
//                         href="https://preview.gravity-ui.com/uikit/"
//                         target="_blank"
//                     >
//                         <Icon data={iconStorybook} />
//                         Storybook
//                     </Button>
//                     <Button
//                         className={b('button')}
//                         size="l"
//                         view="outlined"
//                         href="https://t.me/gravity_ui"
//                         target="_blank"
//                     >
//                         <Icon data={iconTelegram} />
//                         Telegram
//                     </Button>
//                 </div>
//             </div>
//         </ThemeProvider>
//     );
// };

// // import {ThemeProvider} from '@gravity-ui/uikit';
// // import ChartKit, {settings} from '@gravity-ui/chartkit';
// // import {YagrPlugin} from '@gravity-ui/chartkit/yagr';
// // import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

// // import '@gravity-ui/uikit/styles/styles.scss';
// // import React from 'react';

// // settings.set({plugins: [YagrPlugin]});

// // const data: YagrWidgetData = {
// //     data: {
// //         timeline: [
// //             1636838612441, 1636925012441, 1637011412441, 1637097812441, 1637184212441,
// //             1637270612441, 1637357012441, 1637443412441, 1637529812441, 1637616212441,
// //         ],
// //         graphs: [
// //             {
// //                 id: '0',
// //                 name: 'Serie 1',
// //                 color: '#6c59c2',
// //                 data: [25, 52, 89, 72, 39, 49, 82, 59, 36, 5],
// //             },
// //             {
// //                 id: '1',
// //                 name: 'Serie 2',
// //                 color: '#6e8188',
// //                 data: [37, 6, 51, 10, 65, 35, 72, 0, 94, 54],
// //             },
// //         ],
// //     },
// //     libraryConfig: {
// //         chart: {
// //             series: {
// //                 type: 'line',
// //                 interpolation: 'smooth',
// //             },
// //         },
// //         title: {
// //             text: 'line: random 10 pts',
// //         },
// //     },
// // };

// // export const App = () => {
// //     return (
// //         <ThemeProvider>
// //             <div className="app" style={{height: 500}}>
// //                 <ChartKit type="yagr" data={data} />
// //             </div>
// //         </ThemeProvider>
// //     );
// // };

import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    // Link,
    Navigate,
    useLocation,
    // useNavigate,
} from 'react-router-dom';
import Userfront, {SignupForm, LoginForm, PasswordResetForm} from '@userfront/toolkit';
import {Button, Link} from '@gravity-ui/uikit';
import {HomePage} from './pages/home/HomePage';

Userfront.init('xbr4jv4b');

// enum Roots {
//     Home = 'home',
//     SignUp = 'signup',
//     Login = 'login',
//     Reset = 'reset',
//     Dashboard = 'dashboard',
// }

export const App = () => {
    // const navigate = useNavigate();
    // const [route, setRoute] = React.useState(Roots.Home);
    // navigate('/');
    return (
        <Router>
            {/* <Tabs activeTab={route}>
                <Tabs.Item
                    id="home"
                    title="Home"
                    onClick={() => {
                        setRoute(Roots.Home);
                        const location = useLocation();
                        return <Navigate to="/" state={{from: location}} replace />;
                        // navigate('/');
                    }}
                />
                <Tabs.Item
                    id="signup"
                    title="SignUp"
                    onClick={() => {
                        setRoute(Roots.SignUp);
                        const location = useLocation();
                        return <Navigate to="/signup" state={{from: location}} replace />;
                        // navigate('/signup');
                    }}
                />
                <Tabs.Item
                    id="login"
                    title="Login"
                    onClick={() => {
                        setRoute(Roots.Login);
                        const location = useLocation();
                        return <Navigate to="/login" state={{from: location}} replace />;
                        // navigate('/login');
                    }}
                />
                <Tabs.Item
                    id="reset"
                    title="Reset"
                    onClick={() => {
                        setRoute(Roots.Reset);
                        const location = useLocation();
                        return <Navigate to="/reset" state={{from: location}} replace />;
                        // navigate('/reset');
                    }}
                />
                <Tabs.Item
                    id="dashboard"
                    title="Dashboard"
                    onClick={() => {
                        setRoute(Roots.Dashboard);
                        const location = useLocation();
                        return <Navigate to="/dashboard" state={{from: location}} replace />;
                        // navigate('/dashboard');
                    }}
                />
            </Tabs> */}

            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <HomePage />
                        </RequireAuth>
                    }
                />
                <Route path="/signup" element={<SignUpElem />} />
                <Route path="/login" element={<LoginElem />} />
                <Route path="/reset" element={<PasswordResetElem />} />
                <Route
                    path="/userinfo"
                    element={
                        <RequireAuth>
                            <DashboardElem />
                        </RequireAuth>
                    }
                />
                <Route
                    path="*"
                    element={
                        <RequireAuth>
                            <HomePage />
                        </RequireAuth>
                    }
                />
            </Routes>
        </Router>
        //         <Router>
        //             <div>
        //                 <nav>
        //                     <ul>
        //                         <li>
        //                             <Link to="/">Home</Link>
        //                         </li>
        //                         <li>
        //                             <Link to="/signup">SignUp</Link>
        //                         </li>
        //                         <li>
        //                             <Link to="/login">Login</Link>
        //                         </li>
        //                         <li>
        //                             <Link to="/reset">Reset</Link>
        //                         </li>
        //                         <li>
        //                             <Link to="/dashboard">Dashboard</Link>
        //                         </li>
        //                     </ul>
        //                 </nav>

        //                 <Routes>
        //                     <Route path="/" element={<HomePage />} />
        //                     <Route path="/signup" element={<SignUp />} />
        //                     <Route path="/login" element={<Login />} />
        //                     <Route path="/reset" element={<PasswordReset />} />
        //                     <Route
        //                         path="/dashboard"
        //                         element={
        //                             <RequireAuth>
        //                                 <Dashboard />
        //                             </RequireAuth>
        //                         }
        //                     />
        //                 </Routes>
        //             </div>
        //         </Router>
    );
};

function SignUpElem() {
    return (
        <div>
            <SignupForm />
            <div
                style={{
                    marginTop: '10px',
                    left: '50%',
                    position: 'absolute',
                    transform: 'translate(-50%, 0px)',
                }}
            >
                <Link view="normal" href="/login">
                    Уже есть аккаунт? Войти.
                </Link>
            </div>
        </div>
    );
}

function LoginElem() {
    return (
        <div>
            <LoginForm />
            <div
                style={{
                    marginTop: '10px',
                    left: '50%',
                    position: 'absolute',
                    transform: 'translate(-50%, 0px)',
                }}
            >
                <Link view="normal" href="/signup">
                    Нет аккаунта? Зарегестрироваться.
                </Link>
            </div>
        </div>
    );
}

function PasswordResetElem() {
    return (
        <div>
            <PasswordResetForm />
        </div>
    );
}

function DashboardElem() {
    const userData = JSON.stringify(Userfront.user, null, 2);
    return (
        <div>
            <pre>{userData}</pre>
            <Button
                onClick={() => {
                    Userfront.logout();
                }}
            >
                Logout
            </Button>
        </div>
    );
}

function RequireAuth({children}) {
    const location = useLocation();
    if (!Userfront.tokens.accessToken) {
        // Redirect to the /login page
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    return children;
}
