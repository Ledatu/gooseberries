import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Dashboard} from './pages/Dashboard';
import '@gravity-ui/uikit/styles/styles.scss';
import {LoginPage} from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';
import {ThemeProvider} from '@gravity-ui/uikit';

export const App = () => {
    const [themeAurum, setThemeAurum] = useState();
    return (
        <ThemeProvider theme={themeAurum}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
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
