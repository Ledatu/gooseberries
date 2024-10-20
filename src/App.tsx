import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Dashboard} from './pages/Dashboard';
import '@gravity-ui/uikit/styles/styles.scss';
import {LoginPage} from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';
import {Alert, ThemeProvider} from '@gravity-ui/uikit';
import {ErrorProvider, useError} from './pages/ErrorContext';
import {CampaignProvider} from './contexts/CampaignContext';

// Global Alert Component
const GlobalAlert: React.FC = () => {
    const {error} = useError();

    return (
        <>
            {error && (
                <Alert
                    theme="danger"
                    style={{position: 'fixed', top: '85px', right: '20px', zIndex: 1000}}
                    message={error}
                />
            )}
        </>
    );
};

export const App = () => {
    const [themeAurum, setThemeAurum] = useState();
    return (
        <ThemeProvider theme={themeAurum}>
            <ErrorProvider>
                <CampaignProvider>
                    <GlobalAlert />
                    <Router>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            {/* <Route path="/apis" element={<ApiPage />} /> */}
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
                </CampaignProvider>
            </ErrorProvider>
        </ThemeProvider>
    );
};
