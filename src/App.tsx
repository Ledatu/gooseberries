import React, {useState} from 'react';
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
import {Button, Link, ThemeProvider} from '@gravity-ui/uikit';
import {Dashboard} from './pages/Dashboard';
import '@gravity-ui/uikit/styles/styles.scss';
import {LoginPage} from './pages/LoginPage';

Userfront.init('xbr4jv4b');

export const App = () => {
    const [themeAurum, setThemeAurum] = useState();
    return (
        <ThemeProvider theme={themeAurum}>
            <Router>
                <Routes>
                    <Route path="/signup" element={<SignUpElem />} />
                    <Route path="/logi" element={<LoginPage />} />
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
                                <Dashboard setThemeAurum={setThemeAurum} />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
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
        // uid = createUserAndGetToken(Userfront.tokens.accessToken);
        // Redirect to the /login page
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    return children;
}
